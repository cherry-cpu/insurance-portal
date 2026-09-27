package com.ratantatai.api.models;
import javax.persistence.*;
import java.time.OffsetDateTime;
import java.time.LocalDate;

@Entity
@Table(name = "revenue_record")
public class RevenueRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO,generator = "SEQ_HOSPITAL_MASTER")
    @SequenceGenerator(name ="SEQ_HOSPITAL_MASTER",sequenceName = "SEQ_REVENUE_RECORD")
    private Long id;

    @Column(name = "policy_contract_id")
    private Long policyContractId;

    @Column(name = "invoice_number")
    private String invoiceNumber;

    @Column(name = "gross_amount_paise")
    private Long grossAmountPaise;

    @Column(name = "gst_amount_paise")
    private Long gstAmountPaise;

    @Column(name = "net_amount_paise")
    private Long netAmountPaise;

    private String category;
    private String period;
    private LocalDate invoiceDate;

    @Column(name = "created_at")
    private OffsetDateTime createdAt = OffsetDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public LocalDate getInvoiceDate() { return invoiceDate; }
    public void setInvoiceDate(LocalDate invoiceDate) { this.invoiceDate = invoiceDate; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
}
