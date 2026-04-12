package com.ratantatai.api.models;

public class BillingScheduleRequest {
    private Long policyContractId;
    private Long totalAmountPaise;
    private Integer installmentCount;
    private Long firstDueDateTimestamp;
    private String currency;
    private String status;

    public Long getPolicyContractId() { return policyContractId; }
    public void setPolicyContractId(Long policyContractId) { this.policyContractId = policyContractId; }
    public Long getTotalAmountPaise() { return totalAmountPaise; }
    public void setTotalAmountPaise(Long totalAmountPaise) { this.totalAmountPaise = totalAmountPaise; }
    public Integer getInstallmentCount() { return installmentCount; }
    public void setInstallmentCount(Integer installmentCount) { this.installmentCount = installmentCount; }
    public Long getFirstDueDateTimestamp() { return firstDueDateTimestamp; }
    public void setFirstDueDateTimestamp(Long firstDueDateTimestamp) { this.firstDueDateTimestamp = firstDueDateTimestamp; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
