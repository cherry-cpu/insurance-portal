package com.ratantatai.api.models;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "claim")
public class Claim {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO,generator = "SEQ_HOSPITAL_MASTER")
    @SequenceGenerator(name ="SEQ_HOSPITAL_MASTER",sequenceName = "SEQ_HOSPITAL_MASTER")
    private Long id;

    @Column(name = "policy_contract_id", nullable = false)
    private Long policyContractId;

    @Column(name = "claim_number", nullable = false, unique = true)
    private String claimNumber;

    @Column(name = "amount_claimed_paise")
    private Long amountClaimedPaise;

    @Column(nullable = false)
    private String status = "SUBMITTED";

    @Column(name = "claim_type")
    private String claimType;

    @Column(name = "claim_category")
    private String claimCategory;

    @Column(name = "treatment_type")
    private String treatmentType;

    @Column(name = "patient_name")
    private String patientName;

    @Column(name = "diagnosis")
    private String diagnosis;

    @Column(name = "admission_date")
    private LocalDate admissionDate;

    @Column(name = "discharge_date")
    private LocalDate dischargeDate;

    @Column(name = "hospital_ref")
    private String hospitalRef;

    @Column(name = "doctor_ref")
    private String doctorRef;

    @Column(name = "doctor_review")
    private String doctorReview = "pending";

    @Column(name = "pre_auth_status")
    private String preAuthStatus;

    @Column(name = "pre_auth_reference")
    private String preAuthReference;

    @Column(name = "adjudication_notes")
    private String adjudicationNotes;

    @Column(name = "approved_amount_paise")
    private Long approvedAmountPaise;

    @Column(name = "settlement_amount_paise")
    private Long settlementAmountPaise;

    @Column(name = "settlement_date")
    private java.time.LocalDate settlementDate;

    @Column(name = "payout_reference")
    private String payoutReference;

    @Column(name = "details_json")
    private String detailsJson;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPolicyContractId() { return policyContractId; }
    public void setPolicyContractId(Long policyContractId) { this.policyContractId = policyContractId; }
    public String getClaimNumber() { return claimNumber; }
    public void setClaimNumber(String claimNumber) { this.claimNumber = claimNumber; }
    public Long getAmountClaimedPaise() { return amountClaimedPaise; }
    public void setAmountClaimedPaise(Long amountClaimedPaise) { this.amountClaimedPaise = amountClaimedPaise; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getClaimType() { return claimType; }
    public void setClaimType(String claimType) { this.claimType = claimType; }
    public String getClaimCategory() { return claimCategory; }
    public void setClaimCategory(String claimCategory) { this.claimCategory = claimCategory; }
    public String getTreatmentType() { return treatmentType; }
    public void setTreatmentType(String treatmentType) { this.treatmentType = treatmentType; }
    public String getPatientName() { return patientName; }
    public void setPatientName(String patientName) { this.patientName = patientName; }
    public String getDiagnosis() { return diagnosis; }
    public void setDiagnosis(String diagnosis) { this.diagnosis = diagnosis; }
    public LocalDate getAdmissionDate() { return admissionDate; }
    public void setAdmissionDate(LocalDate admissionDate) { this.admissionDate = admissionDate; }
    public LocalDate getDischargeDate() { return dischargeDate; }
    public void setDischargeDate(LocalDate dischargeDate) { this.dischargeDate = dischargeDate; }
    public String getHospitalRef() { return hospitalRef; }
    public void setHospitalRef(String hospitalRef) { this.hospitalRef = hospitalRef; }
    public String getDoctorRef() { return doctorRef; }
    public void setDoctorRef(String doctorRef) { this.doctorRef = doctorRef; }
    public String getDoctorReview() { return doctorReview; }
    public void setDoctorReview(String doctorReview) { this.doctorReview = doctorReview; }
    public String getPreAuthStatus() { return preAuthStatus; }
    public void setPreAuthStatus(String preAuthStatus) { this.preAuthStatus = preAuthStatus; }
    public String getPreAuthReference() { return preAuthReference; }
    public void setPreAuthReference(String preAuthReference) { this.preAuthReference = preAuthReference; }
    public String getAdjudicationNotes() { return adjudicationNotes; }
    public void setAdjudicationNotes(String adjudicationNotes) { this.adjudicationNotes = adjudicationNotes; }
    public Long getApprovedAmountPaise() { return approvedAmountPaise; }
    public void setApprovedAmountPaise(Long approvedAmountPaise) { this.approvedAmountPaise = approvedAmountPaise; }
    public Long getSettlementAmountPaise() { return settlementAmountPaise; }
    public void setSettlementAmountPaise(Long settlementAmountPaise) { this.settlementAmountPaise = settlementAmountPaise; }
    public LocalDate getSettlementDate() { return settlementDate; }
    public void setSettlementDate(LocalDate settlementDate) { this.settlementDate = settlementDate; }
    public String getPayoutReference() { return payoutReference; }
    public void setPayoutReference(String payoutReference) { this.payoutReference = payoutReference; }
    public String getDetailsJson() { return detailsJson; }
    public void setDetailsJson(String detailsJson) { this.detailsJson = detailsJson; }
}
