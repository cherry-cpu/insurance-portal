package com.ratantatai.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    // Sales Performance Aggregation
    @GetMapping("/sales")
    public ResponseEntity<?> getSalesReports() {

        List<Map<String, Object>> salesByProduct = new ArrayList<>();

        Map<String, Object> p1 = new HashMap<>();
        p1.put("product", "Health Premium");
        p1.put("revenue", "$2.1M");

        Map<String, Object> p2 = new HashMap<>();
        p2.put("product", "Auto Protect");
        p2.put("revenue", "$1.5M");

        Map<String, Object> p3 = new HashMap<>();
        p3.put("product", "Life Term");
        p3.put("revenue", "$600K");

        salesByProduct.add(p1);
        salesByProduct.add(p2);
        salesByProduct.add(p3);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("totalRevenue", "$4.2M");
        response.put("growth", "+12.5%");
        response.put("salesByProduct", salesByProduct);

        return ResponseEntity.ok(response);
    }

    // Agent Performance Data
    @GetMapping("/agents")
    public ResponseEntity<?> getAgentPerformance() {

        List<Map<String, Object>> topPerformers = new ArrayList<>();

        Map<String, Object> a1 = new HashMap<>();
        a1.put("agentId", "AGT-101");
        a1.put("name", "David G.");
        a1.put("policiesSold", 142);
        a1.put("satisfaction", 4.9);

        Map<String, Object> a2 = new HashMap<>();
        a2.put("agentId", "AGT-108");
        a2.put("name", "Sarah M.");
        a2.put("policiesSold", 98);
        a2.put("satisfaction", 4.7);

        topPerformers.add(a1);
        topPerformers.add(a2);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("topPerformers", topPerformers);
        response.put("underperformingCount", 4);

        return ResponseEntity.ok(response);
    }

    // Customer Insights & Market Segmentation
    @GetMapping("/insights")
    public ResponseEntity<?> getCustomerInsights() {

        List<Map<String, Object>> segments = new ArrayList<>();

        Map<String, Object> s1 = new HashMap<>();
        s1.put("segment", "Young Professionals (25-34)");
        s1.put("share", "42%");
        s1.put("churnRisk", "Low");

        Map<String, Object> s2 = new HashMap<>();
        s2.put("segment", "Families (35-50)");
        s2.put("share", "38%");
        s2.put("churnRisk", "Medium");

        Map<String, Object> s3 = new HashMap<>();
        s3.put("segment", "Retirees (65+)");
        s3.put("share", "20%");
        s3.put("churnRisk", "High");

        segments.add(s1);
        segments.add(s2);
        segments.add(s3);

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("activeSegments", segments);
        response.put("retentionRate", "94.2%");

        return ResponseEntity.ok(response);
    }
}