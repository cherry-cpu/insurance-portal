package com.ratantatai.api.repos;

import com.ratantatai.api.models.Claim;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByPolicyContractId(Long policyContractId);
    List<Claim> findByStatus(String status);
    Claim findByClaimNumber(String claimNumber);
    long countByStatus(String status);
}
