package com.ratantatai.api.repos;

import com.ratantatai.api.models.UnderwritingCase;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface UnderwritingCaseRepository extends JpaRepository<UnderwritingCase, Long> {
    List<UnderwritingCase> findByPolicyNumber(String policyNumber);
}
