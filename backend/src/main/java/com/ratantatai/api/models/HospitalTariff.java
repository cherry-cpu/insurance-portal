package com.ratantatai.api.models;
import javax.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "hospital_tariff")
public class HospitalTariff {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO,generator = "SEQ_HOSPITAL_MASTER")
    @SequenceGenerator(name ="SEQ_HOSPITAL_MASTER",sequenceName = "SEQ_HOSPITAL_TARIFF")
    private Long id;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "procedure_name", nullable = false)
    private String procedureName;

    @Column(name = "max_coverage", nullable = false)
    private Long maxCoverage;

    @Column(name = "effective_date")
    private LocalDate effectiveDate;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }
    public String getProcedureName() { return procedureName; }
    public void setProcedureName(String procedureName) { this.procedureName = procedureName; }
    public Long getMaxCoverage() { return maxCoverage; }
    public void setMaxCoverage(Long maxCoverage) { this.maxCoverage = maxCoverage; }
    public LocalDate getEffectiveDate() { return effectiveDate; }
    public void setEffectiveDate(LocalDate effectiveDate) { this.effectiveDate = effectiveDate; }
}
