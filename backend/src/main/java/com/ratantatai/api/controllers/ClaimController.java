package com.ratantatai.api.controllers;

import com.ratantatai.api.models.Claim;
import com.ratantatai.api.models.PolicyContract;
import com.ratantatai.api.repos.ClaimRepository;
import com.ratantatai.api.repos.PolicyContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/claims")
public class ClaimController {

    @Autowired
    private ClaimRepository claimRepo;

    @Autowired
    private PolicyContractRepository policyRepo;

    @GetMapping
    public List<Claim> getAllClaims(@RequestParam(required = false) String status) {
        if (status == null || status.isEmpty()) {
            return claimRepo.findAll();
        }
        return claimRepo.findByStatus(status.toUpperCase());
    }

    @GetMapping("/{claimNumber}")
    public ResponseEntity<Claim> getClaim(@PathVariable String claimNumber) {
        Claim claim = claimRepo.findByClaimNumber(claimNumber);
        if (claim == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(claim);
    }

    @GetMapping("/policy/{policyId}")
    public List<Claim> getClaimsByPolicy(@PathVariable Long policyId) {
        return claimRepo.findByPolicyContractId(policyId);
    }

    @PostMapping
    public ResponseEntity<Claim> createClaim(@RequestBody Claim claim) {
        Claim saved = claimRepo.save(claim);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitClaim(@RequestBody Map<String, Object> payload) {

        String policyNumber = Objects.toString(payload.get("policyNumber"), "").trim();
        PolicyContract contract = policyRepo.findByPolicyNumber(policyNumber);

        if (contract == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "Policy number not found");
            return ResponseEntity.badRequest().body(error);
        }

        Claim claim = new Claim();
        claim.setPolicyContractId(contract.getId());

        String claimNumber = Objects.toString(payload.get("claimNumber"), "");
        if (claimNumber.isEmpty()) {
            claimNumber = "CLM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        claim.setClaimNumber(claimNumber);

        Object amountObj = payload.get("amountClaimedPaise");
        if (amountObj != null) {
            claim.setAmountClaimedPaise(Long.valueOf(amountObj.toString()));
        }

        String claimType = Objects.toString(payload.get("claimType"), null);
        String claimCategory = Objects.toString(payload.get("claimCategory"), null);
        String treatmentType = Objects.toString(payload.get("treatmentType"), null);
        String patientName = Objects.toString(payload.get("patientName"), null);
        String diagnosis = Objects.toString(payload.get("diagnosis"), null);

        String admissionDateStr = Objects.toString(payload.get("admissionDate"), null);
        String dischargeDateStr = Objects.toString(payload.get("dischargeDate"), null);

        claim.setClaimType(claimType);
        claim.setClaimCategory(claimCategory);
        claim.setTreatmentType(treatmentType);
        claim.setPatientName(patientName);
        claim.setDiagnosis(diagnosis);

        if (admissionDateStr != null && !admissionDateStr.isEmpty()) {
            claim.setAdmissionDate(LocalDate.parse(admissionDateStr));
        }
        if (dischargeDateStr != null && !dischargeDateStr.isEmpty()) {
            claim.setDischargeDate(LocalDate.parse(dischargeDateStr));
        }

        claim.setDoctorRef(Objects.toString(payload.get("doctorName"), null));

        String hospitalRef = Objects.toString(payload.get("hospitalRef"), null);
        claim.setHospitalRef(hospitalRef);
        claim.setDetailsJson(Objects.toString(payload.get("detailsJson"), null));
        claim.setDoctorReview("pending");

        if (hospitalRef != null && !hospitalRef.isEmpty()) {
            claim.setStatus("PRE_AUTH_REQUESTED");
            claim.setPreAuthStatus("REQUESTED");
            claim.setPreAuthReference("PA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());

            if (claimType == null || claimType.isEmpty()) {
                claim.setClaimType("CASHLESS");
            }
        } else {
            claim.setStatus("SUBMITTED");

            if (claimType == null || claimType.isEmpty()) {
                claim.setClaimType("REIMBURSEMENT");
            }
        }

        Claim saved = claimRepo.save(claim);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("claimNumber", saved.getClaimNumber());
        response.put("claimId", saved.getId());
        response.put("preAuthStatus", saved.getPreAuthStatus());
        response.put("claimStatus", saved.getStatus());
        response.put("claimType", saved.getClaimType());
        response.put("claimCategory", saved.getClaimCategory());
        response.put("admissionDate", saved.getAdmissionDate() != null ? saved.getAdmissionDate().toString() : null);
        response.put("dischargeDate", saved.getDischargeDate() != null ? saved.getDischargeDate().toString() : null);

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{claimNumber}/preauthorize")
    public ResponseEntity<?> preauthorizeClaim(@PathVariable String claimNumber,
                                               @RequestBody Map<String, String> payload) {

        Claim claim = claimRepo.findByClaimNumber(claimNumber);
        if (claim == null) return ResponseEntity.notFound().build();

        String decision = Objects.toString(payload.get("decision"), "").toUpperCase();
        String note = payload.get("note");
        String preAuthReference = Objects.toString(payload.get("preAuthReference"), claim.getPreAuthReference());

        if (decision.equals("APPROVE") || decision.equals("APPROVED")) {
            claim.setPreAuthStatus("APPROVED");
            claim.setStatus("PRE_AUTHORIZED");

            if (preAuthReference.isEmpty()) {
                preAuthReference = "PA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
            }
            claim.setPreAuthReference(preAuthReference);

        } else if (decision.equals("REJECT") || decision.equals("REJECTED")) {
            claim.setPreAuthStatus("REJECTED");
            claim.setStatus("REJECTED");

        } else {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "Invalid pre-authorization decision.");
            return ResponseEntity.badRequest().body(error);
        }

        if (note != null) {
            claim.setAdjudicationNotes(note);
        }

        claimRepo.save(claim);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("claimNumber", claim.getClaimNumber());
        response.put("preAuthStatus", claim.getPreAuthStatus());
        response.put("claimStatus", claim.getStatus());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{claimNumber}/adjudicate")
    public ResponseEntity<?> adjudicateClaim(@PathVariable String claimNumber,
                                             @RequestBody Map<String, Object> payload) {

        Claim claim = claimRepo.findByClaimNumber(claimNumber);
        if (claim == null) return ResponseEntity.notFound().build();

        String decision = Objects.toString(payload.get("decision"), "").toUpperCase();
        String notes = Objects.toString(payload.get("notes"), "");

        Object approvedAmount = payload.get("approvedAmountPaise");
        if (approvedAmount != null) {
            claim.setApprovedAmountPaise(Long.valueOf(approvedAmount.toString()));
        }

        if (decision.equals("APPROVE") || decision.equals("APPROVED")) {
            claim.setStatus("APPROVED");
        } else if (decision.equals("REJECT") || decision.equals("REJECTED")) {
            claim.setStatus("REJECTED");
        } else {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "Invalid adjudication decision.");
            return ResponseEntity.badRequest().body(error);
        }

        claim.setAdjudicationNotes(notes);
        claimRepo.save(claim);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("claimNumber", claim.getClaimNumber());
        response.put("claimStatus", claim.getStatus());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{claimNumber}/settle")
    public ResponseEntity<?> settleClaim(@PathVariable String claimNumber,
                                         @RequestBody Map<String, String> payload) {

        Claim claim = claimRepo.findByClaimNumber(claimNumber);
        if (claim == null) return ResponseEntity.notFound().build();

        String amountPaise = payload.get("amountPaise");
        String payoutReference = payload.get("payoutReference");

        if (amountPaise != null && !amountPaise.isEmpty()) {
            claim.setSettlementAmountPaise(Long.valueOf(amountPaise));
        }

        claim.setPayoutReference(payoutReference);
        claim.setSettlementDate(LocalDate.now());
        claim.setStatus("SETTLED");

        claimRepo.save(claim);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("claimNumber", claim.getClaimNumber());
        response.put("message", "Claim settled successfully.");
        response.put("settlementDate", claim.getSettlementDate().toString());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{claimNumber}/doctor-review")
    public ResponseEntity<?> doctorReview(@PathVariable String claimNumber,
                                          @RequestBody Map<String, String> payload) {

        Claim claim = claimRepo.findByClaimNumber(claimNumber);
        if (claim == null) return ResponseEntity.notFound().build();

        claim.setDoctorReview(Objects.toString(payload.get("review"), claim.getDoctorReview()));

        if (payload.containsKey("doctorNote")) {
            claim.setAdjudicationNotes(payload.get("doctorNote"));
        }

        claimRepo.save(claim);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("claimNumber", claim.getClaimNumber());
        response.put("doctorReview", claim.getDoctorReview());

        return ResponseEntity.ok(response);
    }
}