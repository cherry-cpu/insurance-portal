package com.ratantatai.api.models;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.OffsetDateTime;

@Entity
@Table(name = "policy_contract")
public class PolicyContract {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO,generator = "SEQ_HOSPITAL_MASTER")
    @SequenceGenerator(name ="SEQ_HOSPITAL_MASTER",sequenceName = "SEQ_POLICY_CONTRACT")
    private Long id;

    @Column(name = "policy_number", nullable = false, unique = true)
    private String policyNumber;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String status = "DRAFT";

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(name = "nominee_json", columnDefinition = "TEXT")
    private String nomineeJson;

    @Column(name = "health_json", columnDefinition = "TEXT")
    private String healthJson;

    @Column(name = "address_json", columnDefinition = "TEXT")
    private String addressJson;

    @Column(name = "documents_json", columnDefinition = "TEXT")
    private String documentsJson;

    @Column(name = "digital_kyc_status", nullable = false)
    private String digitalKycStatus = "PENDING";

    @Column(name = "digital_health_json", columnDefinition = "TEXT")
    private String digitalHealthJson;

    @Column(name = "kyc_verified_at")
    private OffsetDateTime kycVerifiedAt;

    @Column(name = "kyc_verified_by")
    private String kycVerifiedBy;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getPolicyNumber() { return policyNumber; }
    public void setPolicyNumber(String policyNumber) { this.policyNumber = policyNumber; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDate getStartDate() { return startDate; }
    public void setStartDate(LocalDate startDate) { this.startDate = startDate; }
    public LocalDate getEndDate() { return endDate; }
    public void setEndDate(LocalDate endDate) { this.endDate = endDate; }
    public String getNomineeJson() { return nomineeJson; }
    public void setNomineeJson(String nomineeJson) { this.nomineeJson = nomineeJson; }
    public String getHealthJson() { return healthJson; }
    public void setHealthJson(String healthJson) { this.healthJson = healthJson; }
    public String getAddressJson() { return addressJson; }
    public void setAddressJson(String addressJson) { this.addressJson = addressJson; }
    public String getDocumentsJson() { return documentsJson; }
    public void setDocumentsJson(String documentsJson) { this.documentsJson = documentsJson; }
    public String getDigitalKycStatus() { return digitalKycStatus; }
    public void setDigitalKycStatus(String digitalKycStatus) { this.digitalKycStatus = digitalKycStatus; }
    public String getDigitalHealthJson() { return digitalHealthJson; }
    public void setDigitalHealthJson(String digitalHealthJson) { this.digitalHealthJson = digitalHealthJson; }
    public OffsetDateTime getKycVerifiedAt() { return kycVerifiedAt; }
    public void setKycVerifiedAt(OffsetDateTime kycVerifiedAt) { this.kycVerifiedAt = kycVerifiedAt; }
    public String getKycVerifiedBy() { return kycVerifiedBy; }
    public void setKycVerifiedBy(String kycVerifiedBy) { this.kycVerifiedBy = kycVerifiedBy; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
