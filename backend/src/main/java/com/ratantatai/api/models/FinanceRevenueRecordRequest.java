package com.ratantatai.api.models;

public class FinanceRevenueRecordRequest {
    private Long policyContractId;
    private String invoiceNumber;
    private Long grossAmountPaise;
    private Long gstAmountPaise;
    private Long netAmountPaise;
    private String category;
    private String period;
    private Long invoiceDateTimestamp;

    public Long getPolicyContractId() { return policyContractId; }
    public void setPolicyContractId(Long policyContractId) { this.policyContractId = policyContractId; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public Long getGrossAmountPaise() { return grossAmountPaise; }
    public void setGrossAmountPaise(Long grossAmountPaise) { this.grossAmountPaise = grossAmountPaise; }
    public Long getGstAmountPaise() { return gstAmountPaise; }
    public void setGstAmountPaise(Long gstAmountPaise) { this.gstAmountPaise = gstAmountPaise; }
    public Long getNetAmountPaise() { return netAmountPaise; }
    public void setNetAmountPaise(Long netAmountPaise) { this.netAmountPaise = netAmountPaise; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public Long getInvoiceDateTimestamp() { return invoiceDateTimestamp; }
    public void setInvoiceDateTimestamp(Long invoiceDateTimestamp) { this.invoiceDateTimestamp = invoiceDateTimestamp; }
}
