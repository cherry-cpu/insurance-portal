package com.ratantatai.api.models;

import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "hospital_package")
public class HospitalPackage {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO,generator = "SEQ_HOSPITAL_MASTER")
    @SequenceGenerator(name ="SEQ_HOSPITAL_MASTER",sequenceName = "SEQ_HOSPITAL_MASTER")
    private Long id;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "package_code")
    private String packageCode;

    @Column(name = "procedure_name", nullable = false)
    private String procedureName;

    @Column(name = "package_rate", nullable = false)
    private Long packageRate;

    @Column(nullable = false)
    private String currency = "INR";

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }
    public String getPackageCode() { return packageCode; }
    public void setPackageCode(String packageCode) { this.packageCode = packageCode; }
    public String getProcedureName() { return procedureName; }
    public void setProcedureName(String procedureName) { this.procedureName = procedureName; }
    public Long getPackageRate() { return packageRate; }
    public void setPackageRate(Long packageRate) { this.packageRate = packageRate; }
    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }
    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }
}
