package com.ratantatai.api.models;

public class BillingPaymentRequest {
    private Long policyContractId;
    private Long amountPaise;
    private Long gstAmountPaise;
    private Integer taxRatePercent;
    private String currency;
    private String receipt;
    private String status;
    private String paymentType;
    private String paymentMethod;
    private Integer installmentNumber;
    private String razorpayOrderId;
    private String razorpayPaymentId;

    public Long getPolicyContractId() { return policyContractId; }
    public void setPolicyContractId(Long policyContractId) { this.policyContractId = policyContractId; }
    public Long getAmountPaise() { return amountPaise; }
    public void setAmountPaise(Long amountPaise) { this.amountPaise = amountPaise; }
    public Long getGstAmountPaise() { return gstAmountPaise; }
    public void setGstAmountPaise(Long gstAmountPaise) { this.gstAmountPaise = gstAmountPaise; }
    public Integer getTaxRatePercent() { return taxRatePercent; }
    public void setTaxRatePercent(Integer taxRatePercent) { this.taxRatePercent = taxRatePercent; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public String getReceipt() { return receipt; }
    public void setReceipt(String receipt) { this.receipt = receipt; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    public Integer getInstallmentNumber() { return installmentNumber; }
    public void setInstallmentNumber(Integer installmentNumber) { this.installmentNumber = installmentNumber; }
    public String getRazorpayOrderId() { return razorpayOrderId; }
    public void setRazorpayOrderId(String razorpayOrderId) { this.razorpayOrderId = razorpayOrderId; }
    public String getRazorpayPaymentId() { return razorpayPaymentId; }
    public void setRazorpayPaymentId(String razorpayPaymentId) { this.razorpayPaymentId = razorpayPaymentId; }
}
