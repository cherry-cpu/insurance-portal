package com.ratantatai.api.repos;

import com.ratantatai.api.models.HospitalPackage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalPackageRepository extends JpaRepository<HospitalPackage, Long> {
    List<HospitalPackage> findByHospitalId(Long hospitalId);
}
