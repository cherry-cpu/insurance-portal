package com.ratantatai.api.repos;

import com.ratantatai.api.models.HospitalTariff;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalTariffRepository extends JpaRepository<HospitalTariff, Long> {
    List<HospitalTariff> findByHospitalId(Long hospitalId);
}
