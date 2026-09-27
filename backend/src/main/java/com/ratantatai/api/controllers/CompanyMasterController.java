package com.ratantatai.api.controllers;

import com.ratantatai.api.models.CompanyMaster;
import com.ratantatai.api.models.PolicyProduct;
import com.ratantatai.api.repos.CompanyMasterRepository;
import com.ratantatai.api.repos.PolicyProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/company-master")
public class CompanyMasterController {

    @Autowired
    private CompanyMasterRepository companyRepo;

    @Autowired
    private PolicyProductRepository productRepo;

    @GetMapping
    public ResponseEntity<?> getAllCompanies() {
        List<CompanyMaster> companies = companyRepo.findAll();
        
        if (companies.isEmpty()) {
            CompanyMaster c1 = new CompanyMaster();
            c1.setCode("INS-001");
            c1.setName("HDFC Ergo General Insurance");
            c1.setRegistration("IRDAI-146");
            c1.setStatus("ACTIVE");
            c1.setContactEmail("b2b@hdfcergo.com");
            c1.setContactPhone("+91-22-66383600");
            companyRepo.save(c1);

            CompanyMaster c2 = new CompanyMaster();
            c2.setCode("INS-002");
            c2.setName("Star Health & Allied Insurance");
            c2.setRegistration("IRDAI-129");
            c2.setStatus("ACTIVE");
            c2.setContactEmail("support@starhealth.in");
            companyRepo.save(c2);
            
            companies = companyRepo.findAll();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("companies", companies);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{code}/details")
    public ResponseEntity<?> getCompanyDetails(@PathVariable String code) {
        CompanyMaster company = companyRepo.findByCode(code).orElse(null);
        if (company == null) {
            try {
                company = companyRepo.findById(Long.parseLong(code)).orElse(null);
            } catch (Exception e) {}
        }
        
        if (company == null) return ResponseEntity.notFound().build();

        // Contact details
        Map<String, Object> details = new HashMap<>();
        details.put("contactEmail", company.getContactEmail());
        details.put("contactPhone", company.getContactPhone());

        // Products (fetch from DB)
        List<PolicyProduct> products = productRepo.findAll(); 

        // Agreements (mocked for now as we don't have a model yet, but based on company)
        List<Map<String, Object>> agreements = new ArrayList<>();
        Map<String, Object> a1 = new HashMap<>();
        a1.put("type", "Primary Brokerage Commission");
        a1.put("commissionRate", "15.00%");
        a1.put("validUntil", "2028-12-31");
        agreements.add(a1);

        // Network rules (mocked)
        List<Map<String, Object>> networkRules = new ArrayList<>();
        Map<String, Object> n1 = new HashMap<>();
        n1.put("region", "PAN-INDIA");
        n1.put("description", "Network hospitals restricted to Tier-1 strictly for cashless claims.");
        networkRules.add(n1);

        // Response
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("companyId", company.getCode());
        response.put("details", details);
        response.put("products", products);
        response.put("agreements", agreements);
        response.put("networkRules", networkRules);

        return ResponseEntity.ok(response);
    }
}
