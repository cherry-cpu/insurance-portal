package com.ratantatai.api.repos;

import com.ratantatai.api.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPolicyContractId(Long policyContractId);
}
