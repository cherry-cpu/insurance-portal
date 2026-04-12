package com.ratantatai.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/company-master")
public class CompanyMasterController {

    @GetMapping
    public ResponseEntity<?> getAllCompanies() {
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "companies", List.of(
                Map.of("id", "INS-001", "name", "HDFC Ergo General Insurance", "registration", "IRDAI-146", "status", "ACTIVE"),
                Map.of("id", "INS-002", "name", "Star Health & Allied Insurance", "registration", "IRDAI-129", "status", "ACTIVE"),
                Map.of("id", "INS-003", "name", "Life Insurance Corporation (LIC)", "registration", "IRDAI-512", "status", "INACTIVE")
            )
        ));
    }

    @GetMapping("/{companyId}/details")
    public ResponseEntity<?> getCompanyDetails(@PathVariable String companyId) {
        // Simulating the JOIN logic across multiple tables for a single master view
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "companyId", companyId,
            "details", Map.of(
                "contactEmail", "b2b@insurance-partner.com",
                "contactPhone", "+91-882910291"
            ),
            "products", List.of(
                Map.of("code", "HLTH-COMP", "name", "Comprehensive Family Health", "category", "HEALTH_INSURANCE", "basePremium", "$120/mo"),
                Map.of("code", "HLTH-TERM", "name", "Standard Term Protect", "category", "LIFE_INSURANCE", "basePremium", "$45/mo")
            ),
            "agreements", List.of(
                Map.of("type", "Primary Brokerage Commission", "commissionRate", "15.00%", "validUntil", "2028-12-31")
            ),
            "networkRules", List.of(
                Map.of("region", "PAN-INDIA", "description", "Network hospitals restricted to Tier-1 strictly for cashless claims."),
                Map.of("region", "STATE-MH", "description", "Exclusive auto-repair cashless tie-up with verified mechanics only.")
            )
        ));
    }

    @PostMapping("/{companyId}/agreements")
    public ResponseEntity<?> updateAgreements(@PathVariable String companyId, @RequestBody Map<String, String> payload) {
        String newRate = payload.get("commissionRate");
        // Update logic mapping to DB
        return ResponseEntity.ok(Map.of("status", "success", "message", "Commission updated to " + newRate + " %"));
    }
}
