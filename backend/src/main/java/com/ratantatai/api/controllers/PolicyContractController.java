package com.ratantatai.api.controllers;

import com.ratantatai.api.models.PolicyContract;
import com.ratantatai.api.repos.PolicyContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
public class PolicyContractController {

    @Autowired
    private PolicyContractRepository policyRepo;

    @GetMapping
    public List<PolicyContract> getAllPolicies() {
        return policyRepo.findAll();
    }

    @GetMapping("/user/{userId}")
    public List<PolicyContract> getPoliciesByUser(@PathVariable Long userId) {
        return policyRepo.findByUserId(userId);
    }

    @PostMapping
    public ResponseEntity<PolicyContract> createPolicy(@RequestBody PolicyContract policy) {
        PolicyContract saved = policyRepo.save(policy);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{policyNumber}/cancel")
    public ResponseEntity<?> cancelPolicy(@PathVariable String policyNumber, @RequestBody java.util.Map<String, String> payload) {
        PolicyContract policy = policyRepo.findByPolicyNumber(policyNumber);
        if (policy == null) return ResponseEntity.notFound().build();
        
        String reason = payload.get("reason");
        policy.setStatus("CANCELLED");
        policyRepo.save(policy);
        
        return ResponseEntity.ok(java.util.Map.of(
            "status", "success",
            "message", "Policy cancelled successfully.",
            "reasonLogged", reason
        ));
    }

    @GetMapping("/{policyNumber}/certificate")
    public ResponseEntity<?> generateCertificate(@PathVariable String policyNumber) {
        PolicyContract policy = policyRepo.findByPolicyNumber(policyNumber);
        if (policy == null) return ResponseEntity.notFound().build();
        
        return ResponseEntity.ok(java.util.Map.of(
            "status", "success",
            "downloadUrl", "https://api.ratantatai.example.com/certs/" + policyNumber + ".pdf",
            "message", "E-Certificate successfully generated."
        ));
    }

    @PostMapping("/verify-aadhar")
    public ResponseEntity<?> verifyAadhar(@RequestBody java.util.Map<String, String> payload) {
        String aadhar = payload.get("aadharNumber");
        if (aadhar == null || aadhar.length() != 12) {
            return ResponseEntity.badRequest().body(java.util.Map.of("status", "error", "message", "Invalid Aadhar Format"));
        }
        
        // Simulating eKYC UIDAI Authentication
        return ResponseEntity.ok(java.util.Map.of(
            "status", "success",
            "message", "Aadhar Authenticated Successfully",
            "ekyc_name", "Jane Doe",
            "ekyc_dob", "1990-05-15",
            "ekyc_address", "123 Secure St, Digital City, IN"
        ));
    }
}
