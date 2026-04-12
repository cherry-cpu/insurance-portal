package com.ratantatai.api.models;

import jakarta.persistence.*;

@Entity
@Table(name = "hospital_plan_mapping")
public class HospitalPlanMapping {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "hospital_id", nullable = false)
    private Long hospitalId;

    @Column(name = "product_id", nullable = false)
    private Long productId;

    @Column(name = "is_cashless")
    private Boolean isCashless = true;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Long getHospitalId() { return hospitalId; }
    public void setHospitalId(Long hospitalId) { this.hospitalId = hospitalId; }
    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }
    public Boolean getIsCashless() { return isCashless; }
    public void setIsCashless(Boolean isCashless) { this.isCashless = isCashless; }
}
