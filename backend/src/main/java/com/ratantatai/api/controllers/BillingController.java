package com.ratantatai.api.controllers;

import com.ratantatai.api.models.BillingPaymentRequest;
import com.ratantatai.api.models.BillingRefundRequest;
import com.ratantatai.api.models.BillingScheduleRequest;
import com.ratantatai.api.models.BillingPayoutRequest;
import com.ratantatai.api.models.Payment;
import com.ratantatai.api.models.InstallmentSchedule;
import com.ratantatai.api.models.RefundRecord;
import com.ratantatai.api.models.CommissionPayout;
import com.ratantatai.api.repos.PaymentRepository;
import com.ratantatai.api.repos.InstallmentRepository;
import com.ratantatai.api.repos.RefundRepository;
import com.ratantatai.api.repos.CommissionPayoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.*;

@RestController
@RequestMapping("/api/billing")
public class BillingController {

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private InstallmentRepository installmentRepo;

    @Autowired
    private RefundRepository refundRepo;

    @Autowired
    private CommissionPayoutRepository commissionRepo;

    @GetMapping("/payments")
    public List<Payment> getPayments(@RequestParam(required = false) Long policyContractId) {
        if (policyContractId != null) {
            return paymentRepo.findByPolicyContractId(policyContractId);
        }
        return paymentRepo.findAll();
    }

    @PostMapping("/payments/record")
    public Payment recordPayment(@RequestBody BillingPaymentRequest request) {
        Payment payment = new Payment();
        payment.setPolicyContractId(request.getPolicyContractId());
        payment.setAmountPaise(request.getAmountPaise());
        payment.setGstAmountPaise(Optional.ofNullable(request.getGstAmountPaise()).orElse(0L));
        payment.setTaxRatePercent(Optional.ofNullable(request.getTaxRatePercent()).orElse(18));
        payment.setCurrency(Optional.ofNullable(request.getCurrency()).orElse("INR"));
        payment.setReceipt(request.getReceipt());
        payment.setStatus(Optional.ofNullable(request.getStatus()).orElse("COMPLETED"));
        payment.setPaymentType(Optional.ofNullable(request.getPaymentType()).orElse("PREMIUM"));
        payment.setPaymentMethod(Optional.ofNullable(request.getPaymentMethod()).orElse("RAZORPAY"));
        payment.setInstallmentNumber(request.getInstallmentNumber());
        payment.setRazorpayOrderId(request.getRazorpayOrderId());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setCreatedAt(OffsetDateTime.now());
        payment.setUpdatedAt(OffsetDateTime.now());
        return paymentRepo.save(payment);
    }

    @GetMapping("/installments")
    public List<InstallmentSchedule> getInstallments(@RequestParam(required = false) Long policyContractId) {
        if (policyContractId != null) {
            return installmentRepo.findByPolicyContractId(policyContractId);
        }
        return installmentRepo.findAll();
    }

    @PostMapping("/installments/schedule")
    public List<InstallmentSchedule> scheduleInstallments(@RequestBody BillingScheduleRequest request) {
        List<InstallmentSchedule> schedule = new ArrayList<>();
        long roundedAmount = Math.round(request.getTotalAmountPaise() / (double) request.getInstallmentCount());
        LocalDate dueDate = LocalDate.now();
        if (request.getFirstDueDateTimestamp() != null) {
            dueDate = Instant.ofEpochMilli(request.getFirstDueDateTimestamp())
                    .atZone(ZoneId.systemDefault())
                    .toLocalDate();
        }

        for (int i = 1; i <= request.getInstallmentCount(); i++) {
            InstallmentSchedule installment = new InstallmentSchedule();
            installment.setPolicyContractId(request.getPolicyContractId());
            installment.setInstallmentNumber(i);
            installment.setAmountPaise(roundedAmount);
            installment.setDueDate(dueDate.plusMonths(i - 1));
            installment.setStatus("PENDING");
            installment.setCreatedAt(OffsetDateTime.now());
            installment.setUpdatedAt(OffsetDateTime.now());
            schedule.add(installmentRepo.save(installment));
        }

        return schedule;
    }

    @PostMapping("/installments/{id}/pay")
    public ResponseEntity<InstallmentSchedule> payInstallment(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        Optional<InstallmentSchedule> optional = installmentRepo.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        InstallmentSchedule installment = optional.get();
        installment.setStatus("PAID");
        installment.setPaidAt(OffsetDateTime.now());
        installment.setPaymentReference(payload.get("paymentReference"));
        installment.setUpdatedAt(OffsetDateTime.now());
        installmentRepo.save(installment);

        return ResponseEntity.ok(installment);
    }

    @GetMapping("/refunds")
    public List<RefundRecord> getRefunds(@RequestParam(required = false) Long paymentId) {
        if (paymentId != null) {
            return refundRepo.findByPaymentId(paymentId);
        }
        return refundRepo.findAll();
    }

    @PostMapping("/refunds")
    public RefundRecord createRefund(@RequestBody BillingRefundRequest request) {
        RefundRecord refund = new RefundRecord();
        refund.setPaymentId(request.getPaymentId());
        refund.setAmountPaise(request.getAmountPaise());
        refund.setRefundReference("REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        refund.setStatus("REQUESTED");
        refund.setCreatedAt(OffsetDateTime.now());
        return refundRepo.save(refund);
    }

    @GetMapping("/commissions")
    public List<CommissionPayout> getCommissions(@RequestParam(required = false) Long agentId,
                                                  @RequestParam(required = false) Long policyContractId) {
        if (agentId != null) {
            return commissionRepo.findByAgentId(agentId);
        }
        if (policyContractId != null) {
            return commissionRepo.findByPolicyContractId(policyContractId);
        }
        return commissionRepo.findAll();
    }

    @PostMapping("/commissions/payout")
    public CommissionPayout submitCommissionPayout(@RequestBody BillingPayoutRequest request) {
        CommissionPayout payout = new CommissionPayout();
        payout.setAgentId(request.getAgentId());
        payout.setPolicyContractId(request.getPolicyContractId());
        payout.setAmountPaise(request.getAmountPaise());
        payout.setStatus("PAID");
        payout.setPayoutReference("COM-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        payout.setPaidAt(OffsetDateTime.now());
        payout.setCreatedAt(OffsetDateTime.now());
        return commissionRepo.save(payout);
    }
}
