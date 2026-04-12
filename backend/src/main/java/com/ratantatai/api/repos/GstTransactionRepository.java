package com.ratantatai.api.repos;

import com.ratantatai.api.models.GstTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface GstTransactionRepository extends JpaRepository<GstTransaction, Long> {
    List<GstTransaction> findByTransactionType(String transactionType);
    List<GstTransaction> findByStatus(String status);
}
