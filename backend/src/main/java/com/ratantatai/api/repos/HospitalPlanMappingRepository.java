package com.ratantatai.api.repos;

import com.ratantatai.api.models.HospitalPlanMapping;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalPlanMappingRepository extends JpaRepository<HospitalPlanMapping, Long> {
    List<HospitalPlanMapping> findByProductId(Long productId);
    List<HospitalPlanMapping> findByHospitalId(Long hospitalId);
    List<HospitalPlanMapping> findByHospitalIdAndProductId(Long hospitalId, Long productId);
}
