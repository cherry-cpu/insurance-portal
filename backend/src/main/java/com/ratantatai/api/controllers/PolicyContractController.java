package com.ratantatai.api.controllers;

import com.ratantatai.api.models.AuditLog;
import com.ratantatai.api.models.PolicyContract;
import com.ratantatai.api.repos.AuditLogRepository;
import com.ratantatai.api.repos.PolicyContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/policies")
public class PolicyContractController {

    @Autowired
    private PolicyContractRepository policyRepo;

    @Autowired
    private AuditLogRepository auditLogRepo;

    @GetMapping
    public List<PolicyContract> getAllPolicies() {
        return policyRepo.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<PolicyContract> getPoliciesByUser(@PathVariable Long userId) {
        return policyRepo.findByUserId(userId);
    }

    @GetMapping("/{policyNumber}")
    public ResponseEntity<PolicyContract> getPolicy(@PathVariable String policyNumber) {
        PolicyContract policy = policyRepo.findByPolicyNumber(policyNumber);
        if (policy == null) return ResponseEntity.notFound().build();
        return ResponseEntity.ok(policy);
    }

    @PutMapping("/{policyNumber}")
    public ResponseEntity<?> updatePolicy(@PathVariable String policyNumber, @RequestBody Map<String, Object> updates) {
        PolicyContract policy = policyRepo.findByPolicyNumber(policyNumber);
        if (policy == null) return ResponseEntity.notFound().build();

        // Store old values for audit
        String oldValues = serializePolicyFields(policy);

        // Update allowed fields
        if (updates.containsKey("nomineeJson")) {
            policy.setNomineeJson((String) updates.get("nomineeJson"));
        }
        if (updates.containsKey("healthJson")) {
            policy.setHealthJson((String) updates.get("healthJson"));
        }
        if (updates.containsKey("addressJson")) {
            policy.setAddressJson((String) updates.get("addressJson"));
        }
        if (updates.containsKey("documentsJson")) {
            policy.setDocumentsJson((String) updates.get("documentsJson"));
        }
        if (updates.containsKey("status")) {
            policy.setStatus((String) updates.get("status"));
        }

        policy.setUpdatedAt(OffsetDateTime.now());
        PolicyContract saved = policyRepo.save(policy);

        // Create audit log
        createAuditLog("POLICY", policyNumber, "UPDATE", oldValues, serializePolicyFields(saved), updates);

        return ResponseEntity.ok(new HashMap() {{
            put("status", "success");
            put("message", "Policy updated successfully");
            put("policy", saved);
        }});
    }

    @PostMapping("/{identifier}/renew")
    @CrossOrigin
    public ResponseEntity<?> renewPolicy(@PathVariable String identifier, @RequestBody Map<String, Object> renewalData) {
        PolicyContract policy = findPolicyByIdentifier(identifier);
        if (policy == null) return ResponseEntity.notFound().build();

        if (!"ACTIVE".equals(policy.getStatus())) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "Only active policies can be renewed");
            return ResponseEntity.badRequest().body(error);
        }

        // Store old values for audit
        String oldValues = serializePolicyFields(policy);

        // Calculate new dates
        LocalDate newStartDate = policy.getEndDate();
        LocalDate newEndDate = newStartDate.plusYears(1);

        // Update policy
        policy.setStartDate(newStartDate);
        policy.setEndDate(newEndDate);
        policy.setStatus("ACTIVE"); 
        policy.setUpdatedAt(OffsetDateTime.now());

        PolicyContract renewed = policyRepo.save(policy);

        // Create audit log
        createAuditLog("POLICY", policy.getPolicyNumber(), "RENEW", oldValues, serializePolicyFields(renewed), renewalData);

        Map<String, Object> renewalDetails = new HashMap<>();
        renewalDetails.put("newStartDate", newStartDate);
        renewalDetails.put("newEndDate", newEndDate);
        renewalDetails.put("premium", renewalData.get("premium"));

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Policy renewed successfully");
        response.put("policy", renewed);
        response.put("renewalDetails", renewalDetails);

        return ResponseEntity.ok(response);
    }

    private PolicyContract findPolicyByIdentifier(String identifier) {
        PolicyContract policy = policyRepo.findByPolicyNumber(identifier);
        if (policy == null) {
            try {
                Long id = Long.parseLong(identifier);
                policy = policyRepo.findById(id).orElse(null);
            } catch (NumberFormatException e) {
                // Not a numeric ID
            }
        }
        return policy;
    }

    @PostMapping
    public ResponseEntity<PolicyContract> createPolicy(@RequestBody PolicyContract policy) {
        policy.setPolicyNumber(defaultPolicyNumber(policy.getPolicyNumber()));
        policy.setUserId(defaultLong(policy.getUserId(), 1L));
        policy.setProductId(defaultLong(policy.getProductId(), 1L));
        policy.setStatus(Objects.toString(policy.getStatus(), "ACTIVE"));
        policy.setStartDate(policy.getStartDate() == null ? LocalDate.now() : policy.getStartDate());
        policy.setEndDate(policy.getEndDate() == null ? LocalDate.now().plusYears(1) : policy.getEndDate());
        PolicyContract saved = policyRepo.save(policy);
        return ResponseEntity.ok(saved);
    }

    private static String defaultPolicyNumber(String value) {
        if (value == null || value.isEmpty()) {
            return "POL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        }
        return value;
    }

    private static Long defaultLong(Long value, Long fallback) {
        return value == null || value <= 0 ? fallback : value;
    }

    @PostMapping("/{policyNumber}/cancel")
    public ResponseEntity<?> cancelPolicy(@PathVariable String policyNumber, @RequestBody java.util.Map<String, String> payload) {
        PolicyContract policy = policyRepo.findByPolicyNumber(policyNumber);
        if (policy == null) return ResponseEntity.notFound().build();

        String reason = payload.get("reason");
        policy.setStatus("CANCELLED");
        policyRepo.save(policy);
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put( "message", "Policy cancelled successfully.");
        map.put("reasonLogged", reason);
        return ResponseEntity.ok(map);
    }

    @GetMapping("/{identifier}/certificate")
    @CrossOrigin
    public ResponseEntity<?> generateCertificate(@PathVariable String identifier) {
        PolicyContract policy = findPolicyByIdentifier(identifier);
        if (policy == null) return ResponseEntity.notFound().build();

        // Generate certificate content (simplified - in production, use PDF library)
        String certificateContent = generateCertificateContent(policy);
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("certificateContent", certificateContent);
        map.put("downloadUrl", "/api/policies/" + (policy.getId() != null ? policy.getId() : policy.getPolicyNumber()) + "/certificate/download");
        map.put("message", "E-Certificate generated successfully");
        map.put("generatedAt", OffsetDateTime.now());

        return ResponseEntity.ok(map);
    }

    @GetMapping("/{policyNumber}/certificate/download")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable String policyNumber) {
        PolicyContract policy = policyRepo.findByPolicyNumber(policyNumber);
        if (policy == null) return ResponseEntity.notFound().build();

        // In a real implementation, generate actual PDF bytes
        // For now, return text content as bytes
        String certificateText = generateCertificateContent(policy);
        byte[] pdfBytes = certificateText.getBytes();

        return ResponseEntity.ok()
                .header("Content-Type", "application/pdf")
                .header("Content-Disposition", "attachment; filename=\"" + policyNumber + "_certificate.pdf\"")
                .body(pdfBytes);
    }

    private String generateCertificateContent(PolicyContract policy) {
        return String.format(
                "INSURANCE CERTIFICATE\n\n" +
                        "Policy Number: %s\n" +
                        "Status: %s\n" +
                        "Coverage Period: %s to %s\n\n" +
                        "This is to certify that the above policy is valid and active.\n\n" +
                        "Issued on: %s\n" +
                        "Ratantatai Insurance Services",
                policy.getPolicyNumber(),
                policy.getStatus(),
                policy.getStartDate(),
                policy.getEndDate(),
                OffsetDateTime.now()
        );
    }

    private void createAuditLog(String entityType, String entityId, String action, String oldValues, String newValues, Map<String, Object> requestData) {
        AuditLog auditLog = new AuditLog();
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setAction(action);
        auditLog.setOldValues(oldValues);
        auditLog.setNewValues(newValues);
        auditLog.setUsername((String) requestData.getOrDefault("username", "SYSTEM"));
        auditLog.setUserId(Long.valueOf(requestData.getOrDefault("userId", "0").toString()));

        auditLogRepo.save(auditLog);
    }

    private String serializePolicyFields(PolicyContract policy) {
        return String.format(
                "policyNumber=%s,status=%s,startDate=%s,endDate=%s,nomineeJson=%s,healthJson=%s,addressJson=%s,documentsJson=%s",
                policy.getPolicyNumber(),
                policy.getStatus(),
                policy.getStartDate(),
                policy.getEndDate(),
                policy.getNomineeJson(),
                policy.getHealthJson(),
                policy.getAddressJson(),
                policy.getDocumentsJson()
        );
    }
}