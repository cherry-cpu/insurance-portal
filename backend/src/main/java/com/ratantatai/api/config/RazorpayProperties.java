package com.ratantatai.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "razorpay")
public class RazorpayProperties {

    /**
     * Publishable key id (same value exposed to React as REACT_APP_RAZORPAY_KEY_ID).
     */
    private String keyId = "";

    /** API key secret — server only, never commit real values. */
    private String keySecret = "";

    public String getKeyId() {
        return keyId;
    }

    public void setKeyId(String keyId) {
        this.keyId = keyId;
    }

    public String getKeySecret() {
        return keySecret;
    }

    public void setKeySecret(String keySecret) {
        this.keySecret = keySecret;
    }

    public boolean isConfigured() {
        return keyId != null && !keyId.isBlank() && keySecret != null && !keySecret.isBlank();
    }
}
