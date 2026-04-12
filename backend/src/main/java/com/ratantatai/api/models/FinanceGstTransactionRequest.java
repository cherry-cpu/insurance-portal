package com.ratantatai.api.models;

public class FinanceGstTransactionRequest {
    private String transactionType;
    private String invoiceNumber;
    private Long invoiceDateTimestamp;
    private Long gstAmountPaise;
    private Integer taxRatePercent;
    private String status;

    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public Long getInvoiceDateTimestamp() { return invoiceDateTimestamp; }
    public void setInvoiceDateTimestamp(Long invoiceDateTimestamp) { this.invoiceDateTimestamp = invoiceDateTimestamp; }
    public Long getGstAmountPaise() { return gstAmountPaise; }
    public void setGstAmountPaise(Long gstAmountPaise) { this.gstAmountPaise = gstAmountPaise; }
    public Integer getTaxRatePercent() { return taxRatePercent; }
    public void setTaxRatePercent(Integer taxRatePercent) { this.taxRatePercent = taxRatePercent; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
