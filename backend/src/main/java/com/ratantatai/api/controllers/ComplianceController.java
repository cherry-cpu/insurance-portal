package com.ratantatai.api.controllers;

import com.ratantatai.api.models.AuditEvent;
import com.ratantatai.api.models.RegulatoryReport;
import com.ratantatai.api.repos.AuditEventRepository;
import com.ratantatai.api.repos.RegulatoryReportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/compliance")
public class ComplianceController {

    @Autowired
    private AuditEventRepository auditEventRepository;

    @Autowired
    private RegulatoryReportRepository reportRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getComplianceSummary() {
        long auditCount = auditEventRepository.count();
        long reportCount = reportRepository.count();
        long irdaReports = reportRepository.findByReportType("IRDAI").size();

        Map<String, Object> summary = Map.of(
                "complianceScore", "97%",
                "auditEventCount", auditCount,
                "regulatoryReportCount", reportCount,
                "irdaReportCount", irdaReports,
                "pendingAudits", 2,
                "nextReview", "2026-04-18"
        );
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/audit-logs")
    public List<AuditEvent> getAuditLogs(@RequestParam(required = false) String entityType,
                                         @RequestParam(required = false) Long actorUserId) {
        if (entityType != null) {
            return auditEventRepository.findByEntityType(entityType);
        }
        if (actorUserId != null) {
            return auditEventRepository.findByActorUserId(actorUserId);
        }
        return auditEventRepository.findAll();
    }

    @PostMapping("/audit-logs")
    public AuditEvent createAuditLog(@RequestBody AuditEvent event) {
        if (event.getCreatedAt() == null) {
            event.setCreatedAt(OffsetDateTime.now());
        }
        return auditEventRepository.save(event);
    }

    @GetMapping("/reports")
    public List<RegulatoryReport> getRegulatoryReports(@RequestParam(required = false) String status) {
        if (status != null) {
            return reportRepository.findByStatus(status);
        }
        return reportRepository.findAll();
    }

    @PostMapping("/reports/generate")
    public RegulatoryReport generateRegulatoryReport(@RequestBody Map<String, String> payload) {
        RegulatoryReport report = new RegulatoryReport();
        report.setReportType(payload.getOrDefault("reportType", "IRDAI"));
        report.setPeriod(payload.getOrDefault("period", "Current Quarter"));
        report.setGeneratedBy(Long.valueOf(payload.getOrDefault("generatedBy", "1")));
        report.setGeneratedAt(OffsetDateTime.now());
        report.setStatus("READY");
        report.setSummaryJson("{\"summary\": \"IRDAI compliance metrics for current cycle\", \"exceptions\": 1}");
        report.setCreatedAt(OffsetDateTime.now());
        return reportRepository.save(report);
    }

    @PostMapping("/reports/{id}/submit")
    public ResponseEntity<RegulatoryReport> submitRegulatoryReport(@PathVariable Long id,
                                                                   @RequestBody Map<String, String> payload) {
        Optional<RegulatoryReport> optional = reportRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        RegulatoryReport report = optional.get();
        report.setSubmittedTo(payload.getOrDefault("submittedTo", "IRDAI"));
        report.setSubmissionReference(payload.getOrDefault("submissionReference", "IRDAI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()));
        report.setStatus("SUBMITTED");
        reportRepository.save(report);
        return ResponseEntity.ok(report);
    }
}
