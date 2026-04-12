package com.ratantatai.api.repos;

import com.ratantatai.api.models.RefundRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RefundRepository extends JpaRepository<RefundRecord, Long> {
    List<RefundRecord> findByPaymentId(Long paymentId);
}
