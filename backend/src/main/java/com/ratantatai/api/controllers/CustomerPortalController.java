package com.ratantatai.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/portal")
public class CustomerPortalController {

    // Fetch unified customer dashboard details (Policies & Claims)
    @GetMapping("/dashboard/{customerId}")
    public ResponseEntity<?> getCustomerDashboard(@PathVariable String customerId) {
        // Simulating data retrieval for a specific customer
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "customerId", customerId,
            "policies", List.of(
                Map.of("id", "POL-99210", "type", "Comprehensive Health", "status", "Active", "premium", "$120/mo")
            ),
            "claims", List.of(
                Map.of("id", "CLM-88219", "status", "In Review", "amount", "$4,200", "date", "2026-04-10")
            )
        ));
    }

    // Endpoint for customers to download their own documents
    @GetMapping("/documents/{documentId}/download")
    public ResponseEntity<?> downloadDocument(@PathVariable String documentId) {
        // Simulated Secure S3 Pre-Signed URL logic
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Document URL generated securely.",
            "downloadUrl", "https://cdn.ratantatai.com/secure/" + documentId + "?token=securexyz123"
        ));
    }

    // Endpoint for requesting endorsement or detail changes
    @PostMapping("/requests")
    public ResponseEntity<?> createServiceRequest(@RequestBody Map<String, String> payload) {
        String policyId = payload.get("policyId");
        String changeType = payload.get("changeType"); // e.g. "ADDRESS_CHANGE", "NOMINEE_UPDATE"
        String details = payload.get("details");

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Change request (" + changeType + ") submitted successfully for policy " + policyId + ". A representative will review it shortly.",
            "ticketId", "REQ-" + (int)(Math.random() * 10000)
        ));
    }
}
