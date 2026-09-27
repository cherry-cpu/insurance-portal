package com.ratantatai.api.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ratantatai.api.config.RazorpayProperties;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@Validated
@RestController
public class ApiPaymentController {

    private final RazorpayOrderClient razorpayOrderClient;
    private final RazorpayProperties razorpayProperties;
    private final ObjectMapper objectMapper;

    public ApiPaymentController(
            RazorpayOrderClient razorpayOrderClient,
            RazorpayProperties razorpayProperties,
            ObjectMapper objectMapper) {
        this.razorpayOrderClient = razorpayOrderClient;
        this.razorpayProperties = razorpayProperties;
        this.objectMapper = objectMapper;
    }

    @GetMapping("/api/health")
    public Map<String, String> health() {
        Map<String, String> map = new HashMap<>();
        map.put("status", "ok");
        map.put("service", "ratantatai-insurance-api");
        return map;
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
