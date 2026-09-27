package com.ratantatai.api.models;
import javax.persistence.*;
import java.time.OffsetDateTime;

@Entity
@Table(name = "underwriting_case")
public class UnderwritingCase {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO,generator = "SEQ_HOSPITAL_MASTER")
    @SequenceGenerator(name ="SEQ_HOSPITAL_MASTER",sequenceName = "SEQ_UNDERWRITER")
    private Long id;

    @Column(name = "application_number", nullable = false, unique = true)
    private String applicationNumber;

    @Column(name = "policy_number", nullable = false)
    private String policyNumber;

    @Column(name = "applicant_name")
    private String applicantName;

    private Integer age;
    private String gender;

    @Column(name = "tobacco_use")
    private String tobaccoUse;

    @Column(name = "conditions_json", columnDefinition = "TEXT")
    private String conditionsJson;

    @Column(name = "medical_history_notes", columnDefinition = "TEXT")
    private String medicalHistoryNotes;

    @Column(name = "requested_sum_insured_paise")
    private Long requestedSumInsuredPaise;

    @Column(name = "base_premium_paise")
    private Long basePremiumPaise;

    @Column(name = "recommended_premium_paise")
    private Long recommendedPremiumPaise;

    @Column(name = "risk_score")
    private Integer riskScore;

    private String decision = "PENDING";

    @Column(name = "decision_reason", columnDefinition = "TEXT")
    private String decisionReason;

    @Column(name = "medical_check_required")
    private Boolean medicalCheckRequired = false;

    @Column(name = "background_check_status")
    private String backgroundCheckStatus = "PENDING";

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getApplicationNumber() {
        return applicationNumber;
    }

    public void setApplicationNumber(String applicationNumber) {
        this.applicationNumber = applicationNumber;
    }

    public String getPolicyNumber() {
        return policyNumber;
    }

    public void setPolicyNumber(String policyNumber) {
        this.policyNumber = policyNumber;
    }

    public String getApplicantName() {
        return applicantName;
    }

    public void setApplicantName(String applicantName) {
        this.applicantName = applicantName;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getTobaccoUse() {
        return tobaccoUse;
    }

    public void setTobaccoUse(String tobaccoUse) {
        this.tobaccoUse = tobaccoUse;
    }

    public String getConditionsJson() {
        return conditionsJson;
    }

    public void setConditionsJson(String conditionsJson) {
        this.conditionsJson = conditionsJson;
    }

    public String getMedicalHistoryNotes() {
        return medicalHistoryNotes;
    }

    public void setMedicalHistoryNotes(String medicalHistoryNotes) {
        this.medicalHistoryNotes = medicalHistoryNotes;
    }

    public Long getRequestedSumInsuredPaise() {
        return requestedSumInsuredPaise;
    }

    public void setRequestedSumInsuredPaise(Long requestedSumInsuredPaise) {
        this.requestedSumInsuredPaise = requestedSumInsuredPaise;
    }

    public Long getBasePremiumPaise() {
        return basePremiumPaise;
    }

    public void setBasePremiumPaise(Long basePremiumPaise) {
        this.basePremiumPaise = basePremiumPaise;
    }

    public Long getRecommendedPremiumPaise() {
        return recommendedPremiumPaise;
    }

    public void setRecommendedPremiumPaise(Long recommendedPremiumPaise) {
        this.recommendedPremiumPaise = recommendedPremiumPaise;
    }

    public Integer getRiskScore() {
        return riskScore;
    }

    public void setRiskScore(Integer riskScore) {
        this.riskScore = riskScore;
    }

    public String getDecision() {
        return decision;
    }

    public void setDecision(String decision) {
        this.decision = decision;
    }

    public String getDecisionReason() {
        return decisionReason;
    }

    public void setDecisionReason(String decisionReason) {
        this.decisionReason = decisionReason;
    }

    public Boolean getMedicalCheckRequired() {
        return medicalCheckRequired;
    }

    public void setMedicalCheckRequired(Boolean medicalCheckRequired) {
        this.medicalCheckRequired = medicalCheckRequired;
    }

    public String getBackgroundCheckStatus() {
        return backgroundCheckStatus;
    }

    public void setBackgroundCheckStatus(String backgroundCheckStatus) {
        this.backgroundCheckStatus = backgroundCheckStatus;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(OffsetDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(OffsetDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
