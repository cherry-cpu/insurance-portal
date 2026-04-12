package com.ratantatai.api.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String email = loginRequest.getEmail();
        String password = loginRequest.getPassword();
        
        // Dummy authentication logic
        if ("admin@ratan.com".equals(email) && "admin123".equals(password)) {
            return ResponseEntity.ok(new LoginResponse("dummy-jwt-token-admin", "ADMIN", "/admin"));
        } else if ("doctor@ratan.com".equals(email)) {
            return ResponseEntity.ok(new LoginResponse("dummy-jwt-token-doctor", "DOCTOR", "/doctor"));
        } else if ("hospital@ratan.com".equals(email)) {
            return ResponseEntity.ok(new LoginResponse("dummy-jwt-token-hospital", "HOSPITAL", "/hospital"));
        } else if (password != null && !password.isEmpty()) {
            // General customer login fallback
            return ResponseEntity.ok(new LoginResponse("dummy-jwt-token-customer", "CUSTOMER", "/dashboard"));
        }
        
        return ResponseEntity.status(401).body("Invalid credentials");
    }
}
