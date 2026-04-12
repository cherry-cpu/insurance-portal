package com.ratantatai.api.repos;

import com.ratantatai.api.models.HospitalContract;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalContractRepository extends JpaRepository<HospitalContract, Long> {
    List<HospitalContract> findByHospitalId(Long hospitalId);
}
