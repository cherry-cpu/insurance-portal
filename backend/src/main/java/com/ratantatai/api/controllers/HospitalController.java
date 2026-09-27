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
        hospital.setSpecializations(payload.get("specializations"));
        hospital.setAccreditation(payload.get("accreditation"));
        hospital.setFacilities(payload.get("facilities"));
        hospital.setStandardRoomRentLimit(parseLong(payload.get("standardRoomRentLimit")));
        hospital.setPremiumRoomRentLimit(parseLong(payload.get("premiumRoomRentLimit")));

        HospitalMaster saved = hospitalRepo.save(hospital);
        Map<String, Object> map = new HashMap<>();
        map.put( "status", "success");
        map.put("message", "Hospital '" + saved.getName() + "' registered to " + saved.getCity() + ".");
        map.put("hospitalId", saved.getId());
        return ResponseEntity.ok(map);
    }

    @PostMapping("/map-plan")
    public ResponseEntity<?> mapPlanToHospital(@RequestBody Map<String, Object> payload) {
        Long hospitalId = parseLong(payload.get("hospitalId"));
        Long productId = parseLong(payload.get("productId"));
        Boolean cashless = parseBoolean(payload.get("isCashless"));

        if (hospitalId == null || productId == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "hospitalId, procedureName, and maxCoverage are required.");
            return ResponseEntity.badRequest().body(error);
        }

        HospitalPlanMapping mapping = new HospitalPlanMapping();
        mapping.setHospitalId(hospitalId);
        mapping.setProductId(productId);
        mapping.setIsCashless(cashless != null ? cashless : true);
        HospitalPlanMapping saved = mappingRepo.save(mapping);

        Map<String, Object> map = new HashMap<>();
        map.put( "status", "success");
        map.put("message", "Hospital '" + saved.getProductId() + "' registered to " + saved.getHospitalId() + ".");
        map.put("hospitalId", saved.getId());

        return ResponseEntity.ok(map);
    }

    @PostMapping("/tariffs")
    public ResponseEntity<?> defineTariffs(@RequestBody Map<String, String> payload) {
        Long hospitalId = parseLong(payload.get("hospitalId"));
        String procedure = payload.get("procedureName");
        Long maxCoverage = parseLong(payload.get("maxCoverage"));
        LocalDate effectiveDate = payload.get("effectiveDate") != null ? LocalDate.parse(payload.get("effectiveDate")) : LocalDate.now();

        if (hospitalId == null || procedure == null || maxCoverage == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "hospitalId, procedureName, and maxCoverage are required.");
            return ResponseEntity.badRequest().body(error);
        }

        HospitalTariff tariff = new HospitalTariff();
        tariff.setHospitalId(hospitalId);
        tariff.setProcedureName(procedure);
        tariff.setMaxCoverage(maxCoverage);
        tariff.setEffectiveDate(effectiveDate);
        HospitalTariff saved = tariffRepo.save(tariff);
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("message", "Tariff ceiling of " + saved.getMaxCoverage() + " mapped to " + saved.getProcedureName() + ".");
        map.put( "tariffId", saved.getId());
        return ResponseEntity.ok(map);
    }

    @PostMapping("/packages")
    public ResponseEntity<?> addPackage(@RequestBody Map<String, String> payload) {
        Long hospitalId = parseLong(payload.get("hospitalId"));
        String procedureName = payload.get("procedureName");
        Long packageRate = parseLong(payload.get("packageRate"));

        if (hospitalId == null || procedureName == null || packageRate == null) {
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "hospitalId, procedureName, and packageRate are required.");
            return ResponseEntity.badRequest().body(error);
        }

        HospitalPackage hospitalPackage = new HospitalPackage();
        hospitalPackage.setHospitalId(hospitalId);
        hospitalPackage.setProcedureName(procedureName);
        hospitalPackage.setPackageRate(packageRate);
        hospitalPackage.setPackageCode(payload.get("packageCode"));
        hospitalPackage.setCurrency(payload.getOrDefault("currency", "INR"));
        hospitalPackage.setEffectiveDate(payload.get("effectiveDate") != null ? LocalDate.parse(payload.get("effectiveDate")) : LocalDate.now());
        HospitalPackage saved = packageRepo.save(hospitalPackage);
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("message", "Package " + saved.getProcedureName() + " added for hospital " + saved.getHospitalId() + ".");
        map.put("packageId", saved.getId());
        return ResponseEntity.ok(map);
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
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message", "hospitalId, contractName are required.");

            return ResponseEntity.badRequest().body(error);
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
        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("message", "Contract " + saved.getContractName() + "  registered for hospital " + saved.getHospitalId() + ".");
        map.put("packageId", saved.getId());

        return ResponseEntity.ok(map);
    }

    @GetMapping("/{hospitalId}/contracts")
    public List<HospitalContract> getHospitalContracts(@PathVariable Long hospitalId) {
        return contractRepo.findByHospitalId(hospitalId);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchHospitals(@RequestParam(required = false) String location, @RequestParam(required = false) String planId) {
        List<HospitalMaster> hospitals = (location != null && !location.isEmpty())
            ? hospitalRepo.findByCityIgnoreCaseContaining(location)
            : hospitalRepo.findAll();

        if (planId != null && !planId.isEmpty()) {
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
            Map<String, Object> map = new HashMap<>();
            map.put("id", h.getId());
            map.put("name", h.getName());
            map.put("city", h.getCity());
            map.put("state", h.getState());
            map.put("tier", h.getTier());
            map.put("networkType", h.getNetworkType());
            map.put("specializations", h.getSpecializations());
            map.put("accreditation", h.getAccreditation());
            map.put("facilities", h.getFacilities());
            map.put("cashless", cashless);
            return map;
        }).collect(Collectors.toList());
        Map<String, Object> error = new HashMap<>();
        error.put("status", "success");
        error.put("results", results);

        return ResponseEntity.ok(error);
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
            Map<String, Object> error = new HashMap<>();
            error.put("status", "error");
            error.put("message",  "Policy not found.");
            return ResponseEntity.badRequest().body(error);
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

        Map<String, Object> map = new HashMap<>();
        map.put("status", "success");
        map.put("policyNumber", policyNumber);
        map.put("hospitalId", hospital.getId());
        map.put("hospitalName", hospital.getName());
        map.put("hospitalNetworkType", hospital.getNetworkType());
        map.put("hospitalTier", hospital.getTier());
        map.put("hospitalMapped", isMapped);
        map.put("cashlessEligible", cashlessEligible);
        map.put("authorizationMessage", authorizationMessage);
        return ResponseEntity.ok(map);
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
