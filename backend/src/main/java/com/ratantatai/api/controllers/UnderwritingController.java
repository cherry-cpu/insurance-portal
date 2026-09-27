package com.ratantatai.api.controllers;

import com.ratantatai.api.models.UnderwritingCase;
import com.ratantatai.api.repos.UnderwritingCaseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/underwriting")
public class UnderwritingController {

    @Autowired
    private UnderwritingCaseRepository underwritingRepo;

    @GetMapping
    public List<UnderwritingCase> getAllCases() {
        return underwritingRepo.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UnderwritingCase> getCase(@PathVariable Long id) {
        return underwritingRepo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/quote")
    public ResponseEntity<Map<String, Object>> quote(@RequestBody Map<String, Object> payload) {
        return ResponseEntity.ok(evaluateRisk(payload));
    }

    @PostMapping("/submit")
    public ResponseEntity<UnderwritingCase> submit(@RequestBody Map<String, Object> payload) {
        Map<String, Object> assessed = evaluateRisk(payload);

        UnderwritingCase underwriting = new UnderwritingCase();
        underwriting.setApplicationNumber("UW-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        underwriting.setPolicyNumber(Objects.toString(payload.get("policyNumber"), "UNSPECIFIED"));
        underwriting.setApplicantName(Objects.toString(payload.get("applicantName"), ""));
        underwriting.setAge(parseInteger(payload.get("age")));
        underwriting.setGender(Objects.toString(payload.get("gender"), "Unknown"));
        underwriting.setTobaccoUse(Objects.toString(payload.get("tobaccoUse"), "no"));
        underwriting.setConditionsJson(Objects.toString(payload.get("conditions"), "[]"));
        underwriting.setMedicalHistoryNotes(Objects.toString(payload.get("medicalHistoryNotes"), ""));
        underwriting.setRequestedSumInsuredPaise(parseLong(payload.get("requestedSumInsuredPaise")));
        underwriting.setBasePremiumPaise((Long) assessed.get("basePremiumPaise"));
        underwriting.setRecommendedPremiumPaise((Long) assessed.get("recommendedPremiumPaise"));
        underwriting.setRiskScore((Integer) assessed.get("riskScore"));
        underwriting.setDecision(Objects.toString(assessed.get("decision"), "PENDING"));
        underwriting.setDecisionReason(Objects.toString(assessed.get("decisionReason"), ""));
        underwriting.setMedicalCheckRequired((Boolean) assessed.get("medicalCheckRequired"));
        underwriting.setBackgroundCheckStatus("PENDING");
        underwriting.setCreatedAt(OffsetDateTime.now());
        underwriting.setUpdatedAt(OffsetDateTime.now());

        UnderwritingCase saved = underwritingRepo.save(underwriting);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/review")
    public ResponseEntity<Map<String, Object>> review(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Optional<UnderwritingCase> optionalCase = underwritingRepo.findById(id);
        if (optionalCase.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        UnderwritingCase underwriting = optionalCase.get();
        String decision = Objects.toString(payload.get("decision"), underwriting.getDecision());
        underwriting.setDecision(decision);
        underwriting.setDecisionReason(Objects.toString(payload.get("decisionReason"), underwriting.getDecisionReason()));

        if (payload.containsKey("medicalCheckRequired")) {
            underwriting.setMedicalCheckRequired(Boolean.TRUE.equals(payload.get("medicalCheckRequired")));
        }
        if (payload.containsKey("backgroundCheckStatus")) {
            underwriting.setBackgroundCheckStatus(Objects.toString(payload.get("backgroundCheckStatus"), underwriting.getBackgroundCheckStatus()));
        }
        underwriting.setUpdatedAt(OffsetDateTime.now());
        underwritingRepo.save(underwriting);
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("id", underwriting.getId());
        map.put("decision", underwriting.getDecision());
        map.put("backgroundCheckStatus", underwriting.getBackgroundCheckStatus());
        map.put("message", "Underwriting case updated.");
        return ResponseEntity.ok(map);
    }

    private Map<String, Object> evaluateRisk(Map<String, Object> payload) {
        int age = parseInteger(payload.get("age"));
        String tobaccoUse = Objects.toString(payload.get("tobaccoUse"), "no").toLowerCase(Locale.ROOT);
        long requestedPaise = parseLong(payload.get("requestedSumInsuredPaise"));
        List<String> conditions = parseConditions(payload.get("conditions"));

        long basePremiumPaise = Math.max(5000L, requestedPaise / 50);
        int riskScore = 20;
        riskScore += Math.min(40, Math.max(0, age - 30) / 2);
        if (tobaccoUse.contains("yes") || tobaccoUse.contains("tobacco")) {
            riskScore += 18;
        }
        for (String condition : conditions) {
            if (condition.isEmpty() || "none".equalsIgnoreCase(condition)) continue;
            riskScore += 14;
            if (condition.toLowerCase(Locale.ROOT).contains("heart") || condition.toLowerCase(Locale.ROOT).contains("cancer")) {
                riskScore += 8;
            }
        }
        if (requestedPaise > 10_000_000L) {
            riskScore += 10;
        }
        riskScore = Math.min(riskScore, 100);

        boolean medicalCheckRequired = age >= 46 || tobaccoUse.contains("yes") || conditions.stream().anyMatch(c -> !c.equalsIgnoreCase("none"));
        String decision;
        String reason;
        long recommendedPremiumPaise = basePremiumPaise;

        if (riskScore >= 85) {
            decision = "REJECT";
            recommendedPremiumPaise = Math.round(basePremiumPaise * 1.45);
            reason = "High risk detected; manual underwriting or decline is recommended.";
        } else if (riskScore >= 65) {
            decision = "LOAD_PREMIUM";
            recommendedPremiumPaise = Math.round(basePremiumPaise * 1.30);
            reason = "Risk is elevated; premium loading suggested.";
        } else {
            decision = "APPROVE";
            recommendedPremiumPaise = basePremiumPaise;
            reason = "Profile fits standard underwriting rules.";
        }

        List<String> rules = new ArrayList<>();
        rules.add("Base premium set at 2% of requested sum insured.");
        if (age > 45) rules.add("Age above 45 triggers additional risk review.");
        if (tobaccoUse.contains("yes")) rules.add("Tobacco use increases premium and may require medical review.");
        if (conditions.stream().anyMatch(c -> !c.equalsIgnoreCase("none"))) {
            rules.add("Declared health conditions require specialist underwriting.");
        }
        if (requestedPaise > 10_000_000L) rules.add("High sum insured leads to elevated risk loading.");
        Map<String, Object> map = new HashMap<>();
        map.put("riskScore", riskScore);
        map.put("basePremiumPaise", basePremiumPaise);
        map.put("recommendedPremiumPaise", recommendedPremiumPaise);
        map.put("decision", decision);
        map.put("decisionReason", reason);
        map.put("medicalCheckRequired", medicalCheckRequired);
        map.put("rules", rules);
        return map;
    }

    private int parseInteger(Object raw) {
        try {
            return raw == null ? 0 : Integer.parseInt(Objects.toString(raw));
        } catch (NumberFormatException ex) {
            return 0;
        }
    }

    private long parseLong(Object raw) {
        try {
            return raw == null ? 0L : Long.parseLong(Objects.toString(raw));
        } catch (NumberFormatException ex) {
            return 0L;
        }
    }

    @SuppressWarnings("unchecked")
    private List<String> parseConditions(Object raw) {
        if (raw instanceof List) {
            List<Object> source = (List<Object>) raw;
            List<String> results = new ArrayList<>();
            for (Object item : source) {
                if (item != null) {
                    results.add(Objects.toString(item).trim());
                }
            }
            return results;
        }
        if (raw instanceof String) {
            String text = (String) raw;

            if (text == null || text.isEmpty()) {
                return Collections.emptyList();
            }

            return Arrays.stream(text.split(","))
                    .map(String::trim)
                    .filter(new java.util.function.Predicate<String>() {
                        @Override
                        public boolean test(String s) {
                            return !s.isEmpty();
                        }
                    })
                    .collect(Collectors.toList());
        }
        return new ArrayList<>();
    }
}
