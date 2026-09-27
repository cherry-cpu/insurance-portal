package com.ratantatai.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/communications")
public class CommunicationController {

    // Simulating sending communication (Email, WhatsApp, Call log)
    @PostMapping("/send")
    public ResponseEntity<?> trackCommunication(@RequestBody java.util.Map<String, String> payload) {
        String channel = payload.get("channel"); // EMAIL, WHATSAPP, CALL
        String recipientId = payload.get("recipientId");
        String messageBody = payload.get("messageBody");

        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("message", channel + " successfully routed to recipient " + recipientId);
        map.put("timestamp", LocalDateTime.now().toString());
        map.put("channel", channel);
        // Logic here would typically interact with Twilio, SendGrid, or save to 'communication_log' DB
        return ResponseEntity.ok(map);
    }

    // Fetching timeline history
    @GetMapping("/history/{recipientId}")
    public ResponseEntity<?> getHistory(@PathVariable String recipientId) {
        // Simulating data fetched from 'communication_log' table
        List<Map<String, Object>> history = new ArrayList<>();

        Map<String, Object> h1 = new HashMap<>();
        h1.put("channel", "WHATSAPP");
        h1.put("direction", "OUTBOUND");
        h1.put("body", "Your claims documents are verified.");
        h1.put("date", "2026-04-10");

        Map<String, Object> h2 = new HashMap<>();
        h2.put("channel", "EMAIL");
        h2.put("direction", "INBOUND");
        h2.put("body", "Policy Renewal Inquiry from customer.");
        h2.put("date", "2026-04-08");

        Map<String, Object> h3 = new HashMap<>();
        h3.put("channel", "CALL");
        h3.put("direction", "OUTBOUND");
        h3.put("body", "Call duration 04:12s. Discussed premium options.");
        h3.put("date", "2026-04-05");

        history.add(h1);
        history.add(h2);
        history.add(h3);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("history", history);

        return ResponseEntity.ok(response);
    }
    @PutMapping("/history/{id}")
    public ResponseEntity<?> updateCommunicationLog(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("message", "Log entry " + id + " updated.");
        return ResponseEntity.ok(map);
    }

    @DeleteMapping("/history/{id}")
    public ResponseEntity<?> deleteCommunicationLog(@PathVariable Long id) {
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("message", "Log entry " + id + " deleted.");
        return ResponseEntity.ok(map);
    }

    @GetMapping("/history/{recipientId}/export-pdf")
    public ResponseEntity<?> exportCommunicationPdf(@PathVariable String recipientId) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Communication audit log PDF export initiated for: " + recipientId);
        response.put("downloadUrl", "/api/files/comm-log-" + recipientId + ".pdf");
        return ResponseEntity.ok(response);
    }
}
