package com.ratantatai.api.models;

import jakarta.persistence.*;
import java.time.OffsetDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "ledger_entry")
public class FinanceLedgerEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "policy_contract_id")
    private Long policyContractId;

    @Column(name = "account_code")
    private String accountCode;

    @Column(name = "account_name")
    private String accountName;

    @Column(name = "entry_type")
    private String entryType;

    @Column(name = "amount_paise")
    private Long amountPaise;

    @Column(name = "gst_amount_paise")
    private Long gstAmountPaise;

    @Column(name = "tax_rate_percent")
    private Integer taxRatePercent;

    private String reference;
    private String description;
    private LocalDate entryDate;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updatedAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getPolicyContractId() { return policyContractId; }
    public void setPolicyContractId(Long policyContractId) { this.policyContractId = policyContractId; }
    public String getAccountCode() { return accountCode; }
    public void setAccountCode(String accountCode) { this.accountCode = accountCode; }
    public String getAccountName() { return accountName; }
    public void setAccountName(String accountName) { this.accountName = accountName; }
    public String getEntryType() { return entryType; }
    public void setEntryType(String entryType) { this.entryType = entryType; }
    public Long getAmountPaise() { return amountPaise; }
    public void setAmountPaise(Long amountPaise) { this.amountPaise = amountPaise; }
    public Long getGstAmountPaise() { return gstAmountPaise; }
    public void setGstAmountPaise(Long gstAmountPaise) { this.gstAmountPaise = gstAmountPaise; }
    public Integer getTaxRatePercent() { return taxRatePercent; }
    public void setTaxRatePercent(Integer taxRatePercent) { this.taxRatePercent = taxRatePercent; }
    public String getReference() { return reference; }
    public void setReference(String reference) { this.reference = reference; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public LocalDate getEntryDate() { return entryDate; }
    public void setEntryDate(LocalDate entryDate) { this.entryDate = entryDate; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
