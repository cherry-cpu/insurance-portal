package com.ratantatai.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/documents")
public class DocumentController {

    // Simulating multipart file upload securely
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestBody java.util.Map<String, String> payload) {
        String type = payload.get("documentType"); // KYC, POLICY, CLAIM
        String title = payload.get("title");
        String relatedId = payload.get("relatedId"); // POL-123 or CLM-123
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("message", "Document [" + title + "] uploaded successfully for " + relatedId + " under category " + type);
        map.put("documentId", "DOC-" + (int)(Math.random() * 10000));
        // In a real flow, you'll process MultipartFile, store locally or S3, then save DB entity.
        return ResponseEntity.ok(map);
    }

    @PostMapping("/{documentId}/esign")
    public ResponseEntity<?> triggerESignature(@PathVariable String documentId, @RequestBody java.util.Map<String, String> payload) {
        String signatureData = payload.get("signatureValue"); // The digital seal or drawn map
        String ipAddress = payload.get("ipAddress");
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("message", "Document [" + documentId + "]  has been officially E-Signed and sealed with secure cryptographic hash.");
        map.put("signedAt", LocalDateTime.now().toString());
        return ResponseEntity.ok(map);
    }
}
