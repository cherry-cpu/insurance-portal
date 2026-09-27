package com.ratantatai.api.controllers;

import com.ratantatai.api.models.AuditEvent;
import com.ratantatai.api.models.RegulatoryReport;
import com.ratantatai.api.repos.AuditEventRepository;
import com.ratantatai.api.repos.RegulatoryReportRepository;
import com.ratantatai.api.models.ComplianceTask;
import com.ratantatai.api.repos.ComplianceTaskRepository;
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

    @Autowired
    private ComplianceTaskRepository taskRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getComplianceSummary() {
        long auditCount = auditEventRepository.count();
        long reportCount = reportRepository.count();
        long irdaReports = reportRepository.findByReportType("IRDAI").size();
        long pendingTasks = taskRepository.countByStatus("PENDING");
        
        Map<String, Object> summary = new HashMap<>();

        // Calculate a dynamic compliance score
        long baseScore = 100;
        long penalty = pendingTasks * 3;
        long score = Math.max(0, baseScore - penalty);

        summary.put("complianceScore", score + "%");
        summary.put("auditEventCount", auditCount);
        summary.put("regulatoryReportCount", reportCount);
        summary.put("irdaReportCount", irdaReports);
        summary.put("pendingAudits", pendingTasks);
        summary.put("nextReview", java.time.LocalDate.now().plusDays(15).toString());
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
        if (optional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        RegulatoryReport report = optional.get();
        report.setSubmittedTo(payload.getOrDefault("submittedTo", "IRDAI"));
        report.setSubmissionReference(payload.getOrDefault("submissionReference", "IRDAI-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase()));
        report.setStatus("SUBMITTED");
        reportRepository.save(report);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/tasks/{policyId}")
    public ResponseEntity<Map<String, Object>> getComplianceTasks(@PathVariable String policyId) {
        List<ComplianceTask> tasks = taskRepository.findByPolicyId(policyId);
        
        // If empty, create initial mock data in DB for this policyId to simulate reality
        if (tasks.isEmpty()) {
            ComplianceTask t1 = new ComplianceTask();
            t1.setTaskId("TASK-101");
            t1.setPolicyId(policyId);
            t1.setTitle("Beneficiary Re-verification");
            t1.setDescription("Re-verify primary and secondary beneficiaries as per IRDAI 2026 circular.");
            t1.setDueDate(java.time.LocalDate.now().plusDays(30));
            t1.setStatus("PENDING");
            t1.setPriority("HIGH");
            taskRepository.save(t1);

            ComplianceTask t2 = new ComplianceTask();
            t2.setTaskId("TASK-102");
            t2.setPolicyId(policyId);
            t2.setTitle("Aadhar Linkage Confirmation");
            t2.setDescription("Confirm Aadhar mapping with UIDAI vault for the contract owner.");
            t2.setDueDate(java.time.LocalDate.now().plusDays(60));
            t2.setStatus("COMPLETED");
            t2.setPriority("MEDIUM");
            taskRepository.save(t2);
            
            tasks = taskRepository.findByPolicyId(policyId);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("policyId", policyId);
        response.put("tasks", tasks);
        return ResponseEntity.ok(response);
    }
}
