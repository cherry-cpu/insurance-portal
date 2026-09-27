package com.ratantatai.api.models;

import javax.persistence.*;
import java.time.OffsetDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "gst_transaction")
public class GstTransaction {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO,generator = "SEQ_HOSPITAL_MASTER")
    @SequenceGenerator(name ="SEQ_HOSPITAL_MASTER",sequenceName = "SEQ_HOSPITAL_MASTER")
    private Long id;

    @Column(name = "transaction_type")
    private String transactionType;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "invoice_date")
    private LocalDate invoiceDate;

    @Column(name = "gst_amount_paise")
    private Long gstAmountPaise;

    @Column(name = "tax_rate_percent")
    private Integer taxRatePercent;

    @Column(name = "status")
    private String status = "PENDING";

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTransactionType() { return transactionType; }
    public void setTransactionType(String transactionType) { this.transactionType = transactionType; }
    public String getInvoiceNumber() { return invoiceNumber; }
    public void setInvoiceNumber(String invoiceNumber) { this.invoiceNumber = invoiceNumber; }
    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }
    public Long getGstAmountPaise() { return gstAmountPaise; }
    public void setGstAmountPaise(Long gstAmountPaise) { this.gstAmountPaise = gstAmountPaise; }
    public Integer getTaxRatePercent() { return taxRatePercent; }
    public void setTaxRatePercent(Integer taxRatePercent) { this.taxRatePercent = taxRatePercent; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
