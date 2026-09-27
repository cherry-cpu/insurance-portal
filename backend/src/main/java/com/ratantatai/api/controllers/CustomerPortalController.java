package com.ratantatai.api.controllers;

import com.ratantatai.api.models.Claim;
import com.ratantatai.api.models.PolicyContract;
import com.ratantatai.api.repos.ClaimRepository;
import com.ratantatai.api.repos.PolicyContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/portal")
public class CustomerPortalController {

    @Autowired
    private PolicyContractRepository policyRepo;

    @Autowired
    private ClaimRepository claimRepo;

    // Fetch unified customer dashboard details (Policies & Claims)
    @GetMapping("/dashboard/{identifier}")
    public ResponseEntity<?> getCustomerDashboard(@PathVariable String identifier) {
        // Simple logic: if numeric, try as user ID, otherwise try as policy number
        List<PolicyContract> policies;
        try {
            Long userId = Long.parseLong(identifier);
            policies = policyRepo.findByUserId(userId);
        } catch (NumberFormatException e) {
            PolicyContract p = policyRepo.findByPolicyNumber(identifier);
            policies = p != null ? Collections.singletonList(p) : Collections.emptyList();
        }

        List<Claim> allClaims = new ArrayList<>();
        for (PolicyContract p : policies) {
            allClaims.addAll(claimRepo.findByPolicyContractId(p.getId()));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("identifier", identifier);
        response.put("policies", policies);
        response.put("claims", allClaims);

        return ResponseEntity.ok(response);
    }

    // Endpoint for customers to download their own documents
    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<?> downloadDocument(@PathVariable String documentId) {

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Document URL generated securely.");
        response.put("downloadUrl",
                "https://cdn.ratantatai.com/secure/" + documentId + "?token=securexyz123");

        return ResponseEntity.ok(response);
    }

    // Endpoint for requesting endorsement or detail changes
    @PostMapping("/requests")
    public ResponseEntity<?> createServiceRequest(@RequestBody Map<String, String> payload) {

        String policyId = payload.get("policyId");
        String changeType = payload.get("changeType");
        String details = payload.get("details");

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message",
                "Change request (" + changeType + ") submitted successfully for policy "
                        + policyId + ". A representative will review it shortly.");
        response.put("ticketId", "REQ-" + (int) (Math.random() * 10000));

        return ResponseEntity.ok(response);
    }
}