package com.ratantatai.api.payment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.ratantatai.api.config.RazorpayProperties;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Base64;
import org.springframework.stereotype.Service;

@Service
public class RazorpayOrderClient {

    private static final URI ORDERS = URI.create("https://api.razorpay.com/v1/orders");

    private final RazorpayProperties props;
    private final ObjectMapper objectMapper;
    private final HttpClient http =
            HttpClient.newBuilder().connectTimeout(Duration.ofSeconds(15)).build();

    public RazorpayOrderClient(RazorpayProperties props, ObjectMapper objectMapper) {
        this.props = props;
        this.objectMapper = objectMapper;
    }

    public JsonNode createOrder(long amountPaise, String receipt, JsonNode notes) throws Exception {
        if (!props.isConfigured()) {
            throw new IllegalStateException("Razorpay keys are not configured on the server");
        }

        ObjectNode body = objectMapper.createObjectNode();
        body.put("amount", amountPaise);
        body.put("currency", "INR");
        body.put("receipt", receipt);
        if (notes != null && !notes.isNull()) {
            body.set("notes", notes);
        }

        String auth =
                Base64.getEncoder()
                        .encodeToString(
                                (props.getKeyId() + ":" + props.getKeySecret())
                                        .getBytes(StandardCharsets.UTF_8));

        HttpRequest request =
                HttpRequest.newBuilder(ORDERS)
                        .timeout(Duration.ofSeconds(30))
                        .header("Authorization", "Basic " + auth)
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(objectMapper.writeValueAsString(body)))
                        .build();

        HttpResponse<String> res = http.send(request, HttpResponse.BodyHandlers.ofString());
        if (res.statusCode() < 200 || res.statusCode() >= 300) {
            throw new IllegalStateException("Razorpay error " + res.statusCode() + ": " + res.body());
        }
        return objectMapper.readTree(res.body());
    }
}
