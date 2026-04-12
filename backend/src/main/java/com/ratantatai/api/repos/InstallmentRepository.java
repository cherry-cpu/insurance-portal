package com.ratantatai.api.repos;

import com.ratantatai.api.models.InstallmentSchedule;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InstallmentRepository extends JpaRepository<InstallmentSchedule, Long> {
    List<InstallmentSchedule> findByPolicyContractId(Long policyContractId);
}
