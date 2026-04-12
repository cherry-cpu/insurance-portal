package com.ratantatai.api.models;

public class FinanceLedgerEntryRequest {
    private Long policyContractId;
    private String accountCode;
    private String accountName;
    private String entryType;
    private Long amountPaise;
    private Long gstAmountPaise;
    private Integer taxRatePercent;
    private String reference;
    private String description;
    private Long entryDateTimestamp;

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
    public Long getEntryDateTimestamp() { return entryDateTimestamp; }
    public void setEntryDateTimestamp(Long entryDateTimestamp) { this.entryDateTimestamp = entryDateTimestamp; }
}
