package com.ratantatai.api.repos;

import com.ratantatai.api.models.RevenueRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RevenueRecordRepository extends JpaRepository<RevenueRecord, Long> {
    List<RevenueRecord> findByPeriod(String period);
    List<RevenueRecord> findByPolicyContractId(Long policyContractId);
}
