package com.ratantatai.api.repos;

import com.ratantatai.api.models.AuditEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditEventRepository extends JpaRepository<AuditEvent, Long> {
    List<AuditEvent> findByActorUserId(Long actorUserId);
    List<AuditEvent> findByEntityType(String entityType);
}
