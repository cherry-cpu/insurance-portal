package com.ratantatai.api.models;

import jakarta.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "regulatory_report")
public class RegulatoryReport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "report_type")
    private String reportType;

    private String period;

    @Column(name = "generated_by")
    private Long generatedBy;

    @Column(name = "generated_at")
    private OffsetDateTime generatedAt = OffsetDateTime.now();

    @Column(name = "submitted_to")
    private String submittedTo;

    @Column(name = "submission_reference")
    private String submissionReference;

    private String status = "DRAFT";

    @Column(name = "summary_json", columnDefinition = "jsonb")
    private String summaryJson;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getReportType() { return reportType; }
    public void setReportType(String reportType) { this.reportType = reportType; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public Long getGeneratedBy() { return generatedBy; }
    public void setGeneratedBy(Long generatedBy) { this.generatedBy = generatedBy; }
    public OffsetDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(OffsetDateTime generatedAt) { this.generatedAt = generatedAt; }
    public String getSubmittedTo() { return submittedTo; }
    public void setSubmittedTo(String submittedTo) { this.submittedTo = submittedTo; }
    public String getSubmissionReference() { return submissionReference; }
    public void setSubmissionReference(String submissionReference) { this.submissionReference = submissionReference; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getSummaryJson() { return summaryJson; }
    public void setSummaryJson(String summaryJson) { this.summaryJson = summaryJson; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
