package com.ratantatai.api.controllers;

import com.ratantatai.api.models.HospitalContract;
import com.ratantatai.api.models.HospitalMaster;
import com.ratantatai.api.models.HospitalPackage;
import com.ratantatai.api.models.HospitalPlanMapping;
import com.ratantatai.api.models.HospitalTariff;
import com.ratantatai.api.models.PolicyContract;
import com.ratantatai.api.repos.HospitalContractRepository;
import com.ratantatai.api.repos.HospitalMasterRepository;
import com.ratantatai.api.repos.HospitalPackageRepository;
import com.ratantatai.api.repos.HospitalPlanMappingRepository;
import com.ratantatai.api.repos.HospitalTariffRepository;
import com.ratantatai.api.repos.PolicyContractRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/hospitals")
public class HospitalController {

    @Autowired
    private HospitalMasterRepository hospitalRepo;

    @Autowired
    private HospitalPlanMappingRepository mappingRepo;

    @Autowired
    private HospitalTariffRepository tariffRepo;

    @Autowired
    private HospitalPackageRepository packageRepo;

    @Autowired
    private HospitalContractRepository contractRepo;

    @Autowired
    private PolicyContractRepository policyRepo;

    @GetMapping
    public List<HospitalMaster> getAllHospitals() {
        return hospitalRepo.findAll();
    }

    @PostMapping("/add")
    public ResponseEntity<?> addHospital(@RequestBody Map<String, String> payload) {
        HospitalMaster hospital = new HospitalMaster();
        hospital.setName(payload.get("name"));
        hospital.setAddress(payload.get("address"));
        hospital.setCity(payload.get("city"));
        hospital.setState(payload.get("state"));
        hospital.setTier(payload.getOrDefault("tier", "TIER_1"));
        hospital.setNetworkType(payload.getOrDefault("networkType", "NON_NETWORK"));
        hospital.setStandardRoomRentLimit(parseLong(payload.get("standardRoomRentLimit")));
        hospital.setPremiumRoomRentLimit(parseLong(payload.get("premiumRoomRentLimit")));

        HospitalMaster saved = hospitalRepo.save(hospital);
        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Hospital '" + saved.getName() + "' registered to " + saved.getCity() + ".",
            "hospitalId", saved.getId()
        ));
    }

    @PostMapping("/map-plan")
    public ResponseEntity<?> mapPlanToHospital(@RequestBody Map<String, Object> payload) {
        Long hospitalId = parseLong(payload.get("hospitalId"));
        Long productId = parseLong(payload.get("productId"));
        Boolean cashless = parseBoolean(payload.get("isCashless"));

        if (hospitalId == null || productId == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "hospitalId and productId are required."));
        }

        HospitalPlanMapping mapping = new HospitalPlanMapping();
        mapping.setHospitalId(hospitalId);
        mapping.setProductId(productId);
        mapping.setIsCashless(cashless != null ? cashless : true);
        HospitalPlanMapping saved = mappingRepo.save(mapping);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Plan " + saved.getProductId() + " mapped to hospital " + saved.getHospitalId() + ".",
            "mappingId", saved.getId()
        ));
    }

    @PostMapping("/tariffs")
    public ResponseEntity<?> defineTariffs(@RequestBody Map<String, String> payload) {
        Long hospitalId = parseLong(payload.get("hospitalId"));
        String procedure = payload.get("procedureName");
        Long maxCoverage = parseLong(payload.get("maxCoverage"));
        LocalDate effectiveDate = payload.get("effectiveDate") != null ? LocalDate.parse(payload.get("effectiveDate")) : LocalDate.now();

        if (hospitalId == null || procedure == null || maxCoverage == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "hospitalId, procedureName, and maxCoverage are required."));
        }

        HospitalTariff tariff = new HospitalTariff();
        tariff.setHospitalId(hospitalId);
        tariff.setProcedureName(procedure);
        tariff.setMaxCoverage(maxCoverage);
        tariff.setEffectiveDate(effectiveDate);
        HospitalTariff saved = tariffRepo.save(tariff);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Tariff ceiling of " + saved.getMaxCoverage() + " mapped to " + saved.getProcedureName() + ".",
            "tariffId", saved.getId()
        ));
    }

    @PostMapping("/packages")
    public ResponseEntity<?> addPackage(@RequestBody Map<String, String> payload) {
        Long hospitalId = parseLong(payload.get("hospitalId"));
        String procedureName = payload.get("procedureName");
        Long packageRate = parseLong(payload.get("packageRate"));

        if (hospitalId == null || procedureName == null || packageRate == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "hospitalId, procedureName, and packageRate are required."));
        }

        HospitalPackage hospitalPackage = new HospitalPackage();
        hospitalPackage.setHospitalId(hospitalId);
        hospitalPackage.setProcedureName(procedureName);
        hospitalPackage.setPackageRate(packageRate);
        hospitalPackage.setPackageCode(payload.get("packageCode"));
        hospitalPackage.setCurrency(payload.getOrDefault("currency", "INR"));
        hospitalPackage.setEffectiveDate(payload.get("effectiveDate") != null ? LocalDate.parse(payload.get("effectiveDate")) : LocalDate.now());
        HospitalPackage saved = packageRepo.save(hospitalPackage);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Package " + saved.getProcedureName() + " added for hospital " + saved.getHospitalId() + ".",
            "packageId", saved.getId()
        ));
    }

    @GetMapping("/{hospitalId}/packages")
    public List<HospitalPackage> getHospitalPackages(@PathVariable Long hospitalId) {
        return packageRepo.findByHospitalId(hospitalId);
    }

    @PostMapping("/contracts")
    public ResponseEntity<?> addContract(@RequestBody Map<String, String> payload) {
        Long hospitalId = parseLong(payload.get("hospitalId"));
        String contractName = payload.get("contractName");

        if (hospitalId == null || contractName == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "hospitalId and contractName are required."));
        }

        HospitalContract contract = new HospitalContract();
        contract.setHospitalId(hospitalId);
        contract.setContractName(contractName);
        contract.setContractVersion(payload.get("contractVersion"));
        contract.setContractFileKey(payload.get("contractFileKey"));
        contract.setStartDate(payload.get("startDate") != null ? LocalDate.parse(payload.get("startDate")) : null);
        contract.setEndDate(payload.get("endDate") != null ? LocalDate.parse(payload.get("endDate")) : null);
        contract.setStatus(payload.getOrDefault("status", "ACTIVE"));
        HospitalContract saved = contractRepo.save(contract);

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "Contract " + saved.getContractName() + " registered for hospital " + saved.getHospitalId() + ".",
            "contractId", saved.getId()
        ));
    }

    @GetMapping("/{hospitalId}/contracts")
    public List<HospitalContract> getHospitalContracts(@PathVariable Long hospitalId) {
        return contractRepo.findByHospitalId(hospitalId);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchHospitals(@RequestParam(required = false) String location, @RequestParam(required = false) String planId) {
        List<HospitalMaster> hospitals = (location != null && !location.isBlank())
            ? hospitalRepo.findByCityIgnoreCaseContaining(location)
            : hospitalRepo.findAll();

        if (planId != null && !planId.isBlank()) {
            Long productId = parseLong(planId);
            if (productId != null) {
                Set<Long> allowedHospitalIds = mappingRepo.findByProductId(productId).stream()
                    .map(HospitalPlanMapping::getHospitalId)
                    .collect(Collectors.toSet());
                hospitals = hospitals.stream()
                    .filter(h -> allowedHospitalIds.contains(h.getId()))
                    .collect(Collectors.toList());
            }
        }

        List<Map<String, Object>> results = hospitals.stream().map(h -> {
            boolean cashless = mappingRepo.findByHospitalId(h.getId()).stream()
                .anyMatch(mapping -> Boolean.TRUE.equals(mapping.getIsCashless()));
            return Map.of(
                "id", h.getId(),
                "name", h.getName(),
                "city", h.getCity(),
                "state", h.getState(),
                "tier", h.getTier(),
                "networkType", h.getNetworkType(),
                "cashless", cashless
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(Map.of("status", "success", "results", results));
    }

    @GetMapping("/{hospitalId}/mappings")
    public List<HospitalPlanMapping> getHospitalMappings(@PathVariable Long hospitalId) {
        return mappingRepo.findByHospitalId(hospitalId);
    }

    @GetMapping("/{hospitalId}/tariffs")
    public List<HospitalTariff> getHospitalTariffs(@PathVariable Long hospitalId) {
        return tariffRepo.findByHospitalId(hospitalId);
    }

    @GetMapping("/{hospitalId}/eligibility")
    public ResponseEntity<?> checkEligibility(@PathVariable Long hospitalId, @RequestParam String policyNumber) {
        HospitalMaster hospital = hospitalRepo.findById(hospitalId).orElse(null);
        if (hospital == null) {
            return ResponseEntity.notFound().build();
        }

        PolicyContract policy = policyRepo.findByPolicyNumber(policyNumber);
        if (policy == null) {
            return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Policy not found."));
        }

        List<HospitalPlanMapping> planMappings = mappingRepo.findByHospitalIdAndProductId(hospitalId, policy.getProductId());
        boolean isMapped = !planMappings.isEmpty();
        boolean cashlessMapping = planMappings.stream().anyMatch(mapping -> Boolean.TRUE.equals(mapping.getIsCashless()));
        boolean cashlessEligible = isMapped && cashlessMapping && !"NON_NETWORK".equalsIgnoreCase(hospital.getNetworkType());

        String authorizationMessage;
        if (!isMapped) {
            authorizationMessage = "Hospital is not empaneled for this policy's product. Reimbursement only.";
        } else if (cashlessEligible) {
            authorizationMessage = "Direct Cashless Approved for the selected hospital and plan.";
        } else {
            authorizationMessage = "Hospital is empaneled, but cashless is not configured for this plan. Reimbursement only.";
        }

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "policyNumber", policyNumber,
            "hospitalId", hospital.getId(),
            "hospitalName", hospital.getName(),
            "hospitalNetworkType", hospital.getNetworkType(),
            "hospitalTier", hospital.getTier(),
            "hospitalMapped", isMapped,
            "cashlessEligible", cashlessEligible,
            "authorizationMessage", authorizationMessage
        ));
    }

    private Long parseLong(Object value) {
        if (value == null) return null;
        try {
            return Long.valueOf(value.toString());
        } catch (NumberFormatException ex) {
            return null;
        }
    }

    private Boolean parseBoolean(Object value) {
        if (value == null) return null;
        if (value instanceof Boolean) return (Boolean) value;
        return Boolean.valueOf(value.toString());
    }
}
