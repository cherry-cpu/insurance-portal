package com.ratantatai.api.repos;

import com.ratantatai.api.models.CommissionPayout;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommissionPayoutRepository extends JpaRepository<CommissionPayout, Long> {
    List<CommissionPayout> findByAgentId(Long agentId);
    List<CommissionPayout> findByPolicyContractId(Long policyContractId);
}
