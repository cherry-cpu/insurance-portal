package com.ratantatai.api.repos;

import com.ratantatai.api.models.HospitalMaster;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface HospitalMasterRepository extends JpaRepository<HospitalMaster, Long> {
    List<HospitalMaster> findByCityIgnoreCaseContaining(String city);
}
