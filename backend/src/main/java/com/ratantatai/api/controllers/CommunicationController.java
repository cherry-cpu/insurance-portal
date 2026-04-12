package com.ratantatai.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/communications")
public class CommunicationController {

    // Simulating sending communication (Email, WhatsApp, Call log)
    @PostMapping("/send")
    public ResponseEntity<?> trackCommunication(@RequestBody java.util.Map<String, String> payload) {
        String channel = payload.get("channel"); // EMAIL, WHATSAPP, CALL
        String recipientId = payload.get("recipientId");
        String messageBody = payload.get("messageBody");

        // Logic here would typically interact with Twilio, SendGrid, or save to 'communication_log' DB
        return ResponseEntity.ok(java.util.Map.of(
            "status", "success",
            "message", channel + " successfully routed to recipient " + recipientId,
            "timestamp", LocalDateTime.now().toString(),
            "channel", channel
        ));
    }

    // Fetching timeline history
    @GetMapping("/history/{recipientId}")
    public ResponseEntity<?> getHistory(@PathVariable String recipientId) {
        // Simulating data fetched from 'communication_log' table
        return ResponseEntity.ok(java.util.Map.of(
            "status", "success",
            "history", java.util.List.of(
                java.util.Map.of("channel", "WHATSAPP", "direction", "OUTBOUND", "body", "Your claims documents are verified.", "date", "2026-04-10"),
                java.util.Map.of("channel", "EMAIL", "direction", "INBOUND", "body", "Policy Renewal Inquiry from customer.", "date", "2026-04-08"),
                java.util.Map.of("channel", "CALL", "direction", "OUTBOUND", "body", "Call duration 04:12s. Discussed premium options.", "date", "2026-04-05")
            )
        ));
    }
}
