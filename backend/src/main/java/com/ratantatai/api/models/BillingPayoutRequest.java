package com.ratantatai.api.models;

public class BillingPayoutRequest {
    private Long policyContractId;
    private Long agentId;
    private Long amountPaise;
    private String currency;
    private String status;

    public Long getPolicyContractId() { return policyContractId; }
    public void setPolicyContractId(Long policyContractId) { this.policyContractId = policyContractId; }
    public Long getAgentId() { return agentId; }
    public void setAgentId(Long agentId) { this.agentId = agentId; }
    public Long getAmountPaise() { return amountPaise; }
    public void setAmountPaise(Long amountPaise) { this.amountPaise = amountPaise; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
