package com.ratantatai.api.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ratantatai.api.config.RazorpayProperties;
import jakarta.validation.Valid;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
public class PaymentController {

    private final RazorpayOrderClient razorpayOrderClient;
    private final RazorpayProperties razorpayProperties;
    private final ObjectMapper objectMapper;

    public PaymentController(
            RazorpayOrderClient razorpayOrderClient,
            RazorpayProperties razorpayProperties,
            ObjectMapper objectMapper) {
        this.razorpayOrderClient = razorpayOrderClient;
        this.razorpayProperties = razorpayProperties;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        return Map.of("status", "ok", "service", "ratantatai-insurance-api");
    }

    /**
     * Creates a Razorpay order. Response matches the React {@code RazorpayButton} expectations:
     * {@code orderId}, {@code amount}, {@code currency}, {@code keyId}.
     */
    @PostMapping("/api/payments/create-order")
    public ResponseEntity<ObjectNode> createOrder(@Valid @RequestBody CreateOrderRequest req) {
        try {
            JsonNode order =
                    razorpayOrderClient.createOrder(req.getAmountPaise(), req.getReceipt(), req.getNotes());
            ObjectNode out = order.deepCopy();
            if (out.has("id")) {
                out.put("orderId", out.get("id").asText());
            }
            out.put("keyId", razorpayProperties.getKeyId());
            return ResponseEntity.ok(out);
        } catch (Exception e) {
            ObjectNode err = objectMapper.createObjectNode();
            err.put("error", e.getMessage());
            return ResponseEntity.status(503).body(err);
        }
    }
}
