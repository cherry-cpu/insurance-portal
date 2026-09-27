package com.ratantatai.api.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ratantatai.api.config.RazorpayProperties;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
public class RazorpayOrderClient {

    private static final String ORDERS_URL = "https://api.razorpay.com/v1/orders";

    private final RazorpayProperties props;
    private final ObjectMapper objectMapper;
    private final RestTemplate restTemplate;

    public RazorpayOrderClient(RazorpayProperties props, ObjectMapper objectMapper) {
        this.props = props;
        this.objectMapper = objectMapper;
        this.restTemplate = new RestTemplate();
    }

    public JsonNode createOrder(long amountPaise, String receipt, JsonNode notes) throws Exception {
        if (!props.isConfigured()) {
            throw new IllegalStateException("Razorpay keys are not configured on the server");
        }

        // Build request body
        ObjectNode body = objectMapper.createObjectNode();
        body.put("amount", amountPaise);
        body.put("currency", "INR");
        body.put("receipt", receipt);

        if (notes != null && !notes.isNull()) {
            body.set("notes", notes);
        }

        // Basic Auth
        String auth = Base64.getEncoder().encodeToString(
                (props.getKeyId() + ":" + props.getKeySecret())
                        .getBytes(StandardCharsets.UTF_8)
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Basic " + auth);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<String> entity = new HttpEntity<>(
                objectMapper.writeValueAsString(body),
                headers
        );

        ResponseEntity<String> response = restTemplate.exchange(
                ORDERS_URL,
                HttpMethod.POST,
                entity,
                String.class
        );

        if (response.getStatusCodeValue() < 200 || response.getStatusCodeValue() >= 300) {
            throw new IllegalStateException(
                    "Razorpay error " + response.getStatusCodeValue() + ": " + response.getBody()
            );
        }

        return objectMapper.readTree(response.getBody());
    }
}