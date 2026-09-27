package com.ratantatai.api.controllers;

import com.ratantatai.api.models.FinanceGstTransactionRequest;
import com.ratantatai.api.models.FinanceLedgerEntryRequest;
import com.ratantatai.api.models.FinanceRevenueRecordRequest;
import com.ratantatai.api.models.FinanceLedgerEntry;
import com.ratantatai.api.models.RevenueRecord;
import com.ratantatai.api.models.GstTransaction;
import com.ratantatai.api.repos.GstTransactionRepository;
import com.ratantatai.api.repos.LedgerEntryRepository;
import com.ratantatai.api.repos.RevenueRecordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping("/api/finance")
public class FinanceController {

    @Autowired
    private LedgerEntryRepository ledgerEntryRepository;

    @Autowired
    private RevenueRecordRepository revenueRecordRepository;

    @Autowired
    private GstTransactionRepository gstTransactionRepository;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getFinanceSummary() {
        long totalRevenue = revenueRecordRepository.findAll().stream().mapToLong(r -> Optional.ofNullable(r.getGrossAmountPaise()).orElse(0L)).sum();
        long totalGst = gstTransactionRepository.findAll().stream().mapToLong(g -> Optional.ofNullable(g.getGstAmountPaise()).orElse(0L)).sum();
        long pendingGst = gstTransactionRepository.findByStatus("PENDING").stream().mapToLong(g -> Optional.ofNullable(g.getGstAmountPaise()).orElse(0L)).sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", totalRevenue);
        summary.put("totalGstCaptured", totalGst);
        summary.put("pendingGstLiability", pendingGst);
        summary.put("ledgerEntries", ledgerEntryRepository.count());
        summary.put("revenueRecords", revenueRecordRepository.count());
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/ledger")
    public List<FinanceLedgerEntry> getLedgerEntries(@RequestParam(required = false) String accountCode,
                                                     @RequestParam(required = false) Long policyContractId) {
        if (accountCode != null) {
            return ledgerEntryRepository.findByAccountCode(accountCode);
        }
        if (policyContractId != null) {
            return ledgerEntryRepository.findByPolicyContractId(policyContractId);
        }
        return ledgerEntryRepository.findAll();
    }

    @PostMapping("/ledger/entry")
    public FinanceLedgerEntry createLedgerEntry(@RequestBody FinanceLedgerEntryRequest request) {
        FinanceLedgerEntry entry = new FinanceLedgerEntry();
        entry.setPolicyContractId(request.getPolicyContractId());
        entry.setAccountCode(request.getAccountCode());
        entry.setAccountName(request.getAccountName());
        entry.setEntryType(Optional.ofNullable(request.getEntryType()).orElse("DEBIT"));
        entry.setAmountPaise(request.getAmountPaise());
        entry.setGstAmountPaise(request.getGstAmountPaise());
        entry.setTaxRatePercent(request.getTaxRatePercent());
        entry.setReference(request.getReference());
        entry.setDescription(request.getDescription());
        if (request.getEntryDateTimestamp() != null) {
            entry.setEntryDate(Instant.ofEpochMilli(request.getEntryDateTimestamp()).atZone(ZoneId.systemDefault()).toLocalDate());
        } else {
            entry.setEntryDate(LocalDate.now());
        }
        entry.setCreatedAt(OffsetDateTime.now());
        entry.setUpdatedAt(OffsetDateTime.now());
        return ledgerEntryRepository.save(entry);
    }

    @GetMapping("/revenue")
    public List<RevenueRecord> getRevenueRecords(@RequestParam(required = false) String period,
                                                 @RequestParam(required = false) Long policyContractId) {
        if (period != null) {
            return revenueRecordRepository.findByPeriod(period);
        }
        if (policyContractId != null) {
            return revenueRecordRepository.findByPolicyContractId(policyContractId);
        }
        return revenueRecordRepository.findAll();
    }

    @GetMapping("/revenue/{id}")
    public ResponseEntity<RevenueRecord> getRevenueById(@PathVariable Long id) {
        return revenueRecordRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/revenue/record")
    public RevenueRecord createRevenueRecord(@RequestBody FinanceRevenueRecordRequest request) {
        RevenueRecord record = new RevenueRecord();
        record.setPolicyContractId(request.getPolicyContractId());
        record.setInvoiceNumber(request.getInvoiceNumber());
        record.setGrossAmountPaise(request.getGrossAmountPaise());
        record.setGstAmountPaise(request.getGstAmountPaise());
        record.setNetAmountPaise(request.getNetAmountPaise());
        record.setCategory(request.getCategory());
        record.setPeriod(Optional.ofNullable(request.getPeriod()).orElse("Current Quarter"));
        if (request.getInvoiceDateTimestamp() != null) {
            record.setInvoiceDate(Instant.ofEpochMilli(request.getInvoiceDateTimestamp()).atZone(ZoneId.systemDefault()).toLocalDate());
        } else {
            record.setInvoiceDate(LocalDate.now());
        }
        record.setCreatedAt(OffsetDateTime.now());
        return revenueRecordRepository.save(record);
    }

    @PutMapping("/revenue/{id}")
    public ResponseEntity<RevenueRecord> updateRevenue(@PathVariable Long id, @RequestBody FinanceRevenueRecordRequest request) {
        return revenueRecordRepository.findById(id).map(record -> {
            record.setGrossAmountPaise(request.getGrossAmountPaise());
            record.setGstAmountPaise(request.getGstAmountPaise());
            record.setPeriod(request.getPeriod());
            return ResponseEntity.ok(revenueRecordRepository.save(record));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/revenue/{id}")
    public ResponseEntity<?> deleteRevenue(@PathVariable Long id) {
        return revenueRecordRepository.findById(id).map(record -> {
            revenueRecordRepository.delete(record);
            return ResponseEntity.ok(Collections.singletonMap("message", "Revenue record deleted"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/revenue/{id}/export-pdf")
    public ResponseEntity<?> exportRevenuePdf(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "success");
        response.put("message", "Financial report PDF export initiated for revenue record: " + id);
        response.put("downloadUrl", "/api/files/financial-report-" + id + ".pdf");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/gst/transactions")
    public List<GstTransaction> getGstTransactions(@RequestParam(required = false) String status,
                                                   @RequestParam(required = false) String transactionType) {
        if (status != null) {
            return gstTransactionRepository.findByStatus(status);
        }
        if (transactionType != null) {
            return gstTransactionRepository.findByTransactionType(transactionType);
        }
        return gstTransactionRepository.findAll();
    }

    @PostMapping("/gst/transaction")
    public GstTransaction createGstTransaction(@RequestBody FinanceGstTransactionRequest request) {
        GstTransaction txn = new GstTransaction();
        txn.setTransactionType(Optional.ofNullable(request.getTransactionType()).orElse("SALE"));
        txn.setInvoiceNumber(request.getInvoiceNumber());
        if (request.getInvoiceDateTimestamp() != null) {
            txn.setInvoiceDate(Instant.ofEpochMilli(request.getInvoiceDateTimestamp()).atZone(ZoneId.systemDefault()).toLocalDate());
        } else {
            txn.setInvoiceDate(LocalDate.now());
        }
        txn.setGstAmountPaise(request.getGstAmountPaise());
        txn.setTaxRatePercent(request.getTaxRatePercent());
        txn.setStatus(Optional.ofNullable(request.getStatus()).orElse("PENDING"));
        return gstTransactionRepository.save(txn);
    }

    @PostMapping("/gst/filing")
    public Map<String, Object> generateGstFilingReport(@RequestBody Map<String, String> payload) {
        Map<String, Object> result = new HashMap<>();
        result.put("status", "READY");
        result.put("period", payload.getOrDefault("period", "April 2026"));
        result.put("totalTaxableValue", 12450000);
        result.put("totalGstLiability", 2245000);
        result.put("submissionReference", "GSTIN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        return result;
    }
}
