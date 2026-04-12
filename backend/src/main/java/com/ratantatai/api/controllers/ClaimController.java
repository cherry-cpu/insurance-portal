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
        if (status == null || status.isBlank()) {
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
            return ResponseEntity.badRequest().body(Map.of(
                "status", "error",
                "message", "Policy number not found"
            ));
        }

        Claim claim = new Claim();
        claim.setPolicyContractId(contract.getId());
        String claimNumber = Objects.toString(payload.get("claimNumber"), "");
        if (claimNumber.isBlank()) {
            claimNumber = "CLM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        claim.setClaimNumber(claimNumber);

        Object amountObj = payload.get("amountClaimedPaise");
        if (amountObj != null) {
            claim.setAmountClaimedPaise(Long.valueOf(amountObj.toString()));
        }

        String hospitalRef = Objects.toString(payload.get("hospitalRef"), null);
        claim.setHospitalRef(hospitalRef);
        claim.setDetailsJson(Objects.toString(payload.get("detailsJson"), null));
        claim.setDoctorReview("pending");

        if (hospitalRef != null && !hospitalRef.isBlank()) {
            claim.setStatus("PRE_AUTH_REQUESTED");
            claim.setPreAuthStatus("REQUESTED");
            claim.setPreAuthReference("PA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        } else {
            claim.setStatus("SUBMITTED");
        }

        Claim saved = claimRepo.save(claim);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "claimNumber", saved.getClaimNumber(),
            "claimId", saved.getId(),
            "preAuthStatus", saved.getPreAuthStatus(),
            "claimStatus", saved.getStatus()
        ));
    }

    @PostMapping("/{claimNumber}/preauthorize")
    public ResponseEntity<?> preauthorizeClaim(@PathVariable String claimNumber, @RequestBody Map<String, String> payload) {
        Claim claim = claimRepo.findByClaimNumber(claimNumber);
        if (claim == null) return ResponseEntity.notFound().build();

        String decision = Objects.toString(payload.get("decision"), "").toUpperCase();
        String note = payload.get("note");
        String preAuthReference = Objects.toString(payload.get("preAuthReference"), claim.getPreAuthReference());

        if (decision.equals("APPROVE") || decision.equals("APPROVED")) {
            claim.setPreAuthStatus("APPROVED");
            claim.setStatus("PRE_AUTHORIZED");
            claim.setPreAuthReference(preAuthReference.isBlank() ? "PA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase() : preAuthReference);
        } else if (decision.equals("REJECT") || decision.equals("REJECTED")) {
            claim.setPreAuthStatus("REJECTED");
            claim.setStatus("REJECTED");
        } else {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Invalid pre-authorization decision."));
        }

        if (note != null) {
            claim.setAdjudicationNotes(note);
        }

        claimRepo.save(claim);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "claimNumber", claim.getClaimNumber(),
            "preAuthStatus", claim.getPreAuthStatus(),
            "claimStatus", claim.getStatus()
        ));
    }

    @PostMapping("/{claimNumber}/adjudicate")
    public ResponseEntity<?> adjudicateClaim(@PathVariable String claimNumber, @RequestBody Map<String, Object> payload) {
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
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Invalid adjudication decision."));
        }

        claim.setAdjudicationNotes(notes);
        claimRepo.save(claim);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "claimNumber", claim.getClaimNumber(),
            "claimStatus", claim.getStatus()
        ));
    }

    @PostMapping("/{claimNumber}/settle")
    public ResponseEntity<?> settleClaim(@PathVariable String claimNumber, @RequestBody Map<String, String> payload) {
        Claim claim = claimRepo.findByClaimNumber(claimNumber);
        if (claim == null) return ResponseEntity.notFound().build();

        String amountPaise = payload.get("amountPaise");
        String payoutReference = payload.get("payoutReference");

        if (amountPaise != null && !amountPaise.isBlank()) {
            claim.setSettlementAmountPaise(Long.valueOf(amountPaise));
        }
        claim.setPayoutReference(payoutReference);
        claim.setSettlementDate(LocalDate.now());
        claim.setStatus("SETTLED");
        claimRepo.save(claim);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "claimNumber", claim.getClaimNumber(),
            "message", "Claim settled successfully.",
            "settlementDate", claim.getSettlementDate().toString()
        ));
    }

    @PostMapping("/{claimNumber}/doctor-review")
    public ResponseEntity<?> doctorReview(@PathVariable String claimNumber, @RequestBody Map<String, String> payload) {
        Claim claim = claimRepo.findByClaimNumber(claimNumber);
        if (claim == null) return ResponseEntity.notFound().build();

        claim.setDoctorReview(Objects.toString(payload.get("review"), claim.getDoctorReview()));
        if (payload.containsKey("doctorNote")) {
            claim.setAdjudicationNotes(payload.get("doctorNote"));
        }
        claimRepo.save(claim);

        return ResponseEntity.ok(Map.of("status", "success", "claimNumber", claim.getClaimNumber(), "doctorReview", claim.getDoctorReview()));
    }
}
