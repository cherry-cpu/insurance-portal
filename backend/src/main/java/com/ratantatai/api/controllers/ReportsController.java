package com.ratantatai.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportsController {

    // Sales Performance Aggregation
    @GetMapping("/sales")
    public ResponseEntity<?> getSalesReports() {
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "totalRevenue", "$4.2M",
            "growth", "+12.5%",
            "salesByProduct", List.of(
                Map.of("product", "Health Premium", "revenue", "$2.1M"),
                Map.of("product", "Auto Protect", "revenue", "$1.5M"),
                Map.of("product", "Life Term", "revenue", "$600K")
            )
        ));
    }

    // Agent Performance Data
    @GetMapping("/agents")
    public ResponseEntity<?> getAgentPerformance() {
        // This simulates a JOIN between app_user and agent_performance tables
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "topPerformers", List.of(
                Map.of("agentId", "AGT-101", "name", "David G.", "policiesSold", 142, "satisfaction", 4.9),
                Map.of("agentId", "AGT-108", "name", "Sarah M.", "policiesSold", 98, "satisfaction", 4.7)
            ),
            "underperformingCount", 4
        ));
    }

    // Customer Insights & Market Segmentation
    @GetMapping("/insights")
    public ResponseEntity<?> getCustomerInsights() {
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "activeSegments", List.of(
                Map.of("segment", "Young Professionals (25-34)", "share", "42%", "churnRisk", "Low"),
                Map.of("segment", "Families (35-50)", "share", "38%", "churnRisk", "Medium"),
                Map.of("segment", "Retirees (65+)", "share", "20%", "churnRisk", "High")
            ),
            "retentionRate", "94.2%"
        ));
    }
}
