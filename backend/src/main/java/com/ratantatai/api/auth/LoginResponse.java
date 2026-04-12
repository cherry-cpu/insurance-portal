package com.ratantatai.api.auth;

public class LoginResponse {
    private String token;
    private String userRole;
    private String redirectUrl;

    public LoginResponse(String token, String userRole, String redirectUrl) {
        this.token = token;
        this.userRole = userRole;
        this.redirectUrl = redirectUrl;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUserRole() {
        return userRole;
    }

    public void setUserRole(String userRole) {
        this.userRole = userRole;
    }

    public String getRedirectUrl() {
        return redirectUrl;
    }

    public void setRedirectUrl(String redirectUrl) {
        this.redirectUrl = redirectUrl;
    }
}
