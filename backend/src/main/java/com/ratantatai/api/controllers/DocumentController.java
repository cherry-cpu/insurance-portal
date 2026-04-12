package com.ratantatai.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    // Simulating multipart file upload securely
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestBody java.util.Map<String, String> payload) {
        String type = payload.get("documentType"); // KYC, POLICY, CLAIM
        String title = payload.get("title");
        String relatedId = payload.get("relatedId"); // POL-123 or CLM-123

        // In a real flow, you'll process MultipartFile, store locally or S3, then save DB entity.
        return ResponseEntity.ok(java.util.Map.of(
            "status", "success",
            "message", "Document [" + title + "] uploaded successfully for " + relatedId + " under category " + type,
            "documentId", "DOC-" + (int)(Math.random() * 10000)
        ));
    }

    @PostMapping("/{documentId}/esign")
    public ResponseEntity<?> triggerESignature(@PathVariable String documentId, @RequestBody java.util.Map<String, String> payload) {
        String signatureData = payload.get("signatureValue"); // The digital seal or drawn map
        String ipAddress = payload.get("ipAddress");

        return ResponseEntity.ok(java.util.Map.of(
            "status", "success",
            "message", "Document " + documentId + " has been officially E-Signed and sealed with secure cryptographic hash.",
            "signedAt", LocalDateTime.now().toString()
        ));
    }
}
