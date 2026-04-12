package com.ratantatai.api.repos;

import com.ratantatai.api.models.RegulatoryReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RegulatoryReportRepository extends JpaRepository<RegulatoryReport, Long> {
    List<RegulatoryReport> findByStatus(String status);
    List<RegulatoryReport> findByReportType(String reportType);
}
