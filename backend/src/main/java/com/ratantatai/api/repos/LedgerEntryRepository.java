package com.ratantatai.api.repos;

import com.ratantatai.api.models.FinanceLedgerEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LedgerEntryRepository extends JpaRepository<FinanceLedgerEntry, Long> {
    List<FinanceLedgerEntry> findByAccountCode(String accountCode);
    List<FinanceLedgerEntry> findByPolicyContractId(Long policyContractId);
}
