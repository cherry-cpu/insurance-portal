package com.ratantatai.api.repos;

import com.ratantatai.api.models.PolicyContract;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PolicyContractRepository extends JpaRepository<PolicyContract, Long> {
    List<PolicyContract> findByUserId(Long userId);
    PolicyContract findByPolicyNumber(String policyNumber);
}
