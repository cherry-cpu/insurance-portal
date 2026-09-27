/**
 * API client for Spring Boot backend (configure REACT_APP_API_BASE_URL).
 */

const BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";

export async function apiPost(path, body, options = {}) {
    const res = await fetch(`${BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...options.headers },
        body: body != null ? JSON.stringify(body) : undefined,
        ...options,
    });
    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
    }
    const ct = res.headers.get("content-type");
    if (ct && ct.includes("application/json")) return res.json();
    return res.text();
}

export async function apiGet(path, options = {}) {
    const res = await fetch(`${BASE}${path}`, { ...options });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
}

/** Create Razorpay order via backend (requires Spring Boot + keys). */
export async function createPaymentOrder({ amountPaise, receipt, notes }) {
    return apiPost("/api/payments/create-order", { amountPaise, receipt, notes });
}

export async function searchHospitals(location, planId) {
    const query = [];
    if (location) query.push(`location=${encodeURIComponent(location)}`);
    if (planId) query.push(`planId=${encodeURIComponent(planId)}`);
    return apiGet(`/api/hospitals/search${query.length ? `?${query.join("&")}` : ""}`);
}

export async function createHospital(payload) {
    return apiPost("/api/hospitals/add", payload);
}

export async function mapPlanToHospital(payload) {
    return apiPost("/api/hospitals/map-plan", payload);
}

export async function defineHospitalTariff(payload) {
    return apiPost("/api/hospitals/tariffs", payload);
}

export async function addHospitalPackage(payload) {
    return apiPost("/api/hospitals/packages", payload);
}

export async function addHospitalContract(payload) {
    return apiPost("/api/hospitals/contracts", payload);
}

export async function getHospitalPackages(hospitalId) {
    return apiGet(`/api/hospitals/${hospitalId}/packages`);
}

export async function getHospitalContracts(hospitalId) {
    return apiGet(`/api/hospitals/${hospitalId}/contracts`);
}

export async function checkHospitalEligibility(hospitalId, policyNumber) {
    return apiGet(`/api/hospitals/${hospitalId}/eligibility?policyNumber=${encodeURIComponent(policyNumber)}`);
}

export async function quoteUnderwriting(payload) {
    return apiPost("/api/underwriting/quote", payload);
}

export async function createUnderwritingCase(payload) {
    return apiPost("/api/underwriting/submit", payload);
}

export async function createPolicyContract(payload) {
    return apiPost("/api/policies", payload);
}

export async function getPolicies() {
    return apiGet("/api/policies");
}

export async function getUnderwritingCases() {
    return apiGet("/api/underwriting");
}

export async function getUnderwritingCase(caseId) {
    return apiGet(`/api/underwriting/${encodeURIComponent(caseId)}`);
}

export async function reviewUnderwritingCase(caseId, payload) {
    return apiPost(`/api/underwriting/${encodeURIComponent(caseId)}/review`, payload);
}

export async function submitClaim(payload) {
    return apiPost("/api/claims/submit", payload);
}

export async function getClaims(status) {
    const query = status && status !== "All" ? `?status=${encodeURIComponent(status)}` : "";
    return apiGet(`/api/claims${query}`);
}

export async function getClaim(claimNumber) {
    return apiGet(`/api/claims/${encodeURIComponent(claimNumber)}`);
}

export async function preauthorizeClaim(claimNumber, decision, note) {
    return apiPost(`/api/claims/${encodeURIComponent(claimNumber)}/preauthorize`, {
        decision,
        note,
    });
}

export async function adjudicateClaim(claimNumber, decision, approvedAmountPaise, notes) {
    return apiPost(`/api/claims/${encodeURIComponent(claimNumber)}/adjudicate`, {
        decision,
        approvedAmountPaise,
        notes,
    });
}

export async function settleClaim(claimNumber, amountPaise, payoutReference) {
    return apiPost(`/api/claims/${encodeURIComponent(claimNumber)}/settle`, {
        amountPaise,
        payoutReference,
    });
}

export async function processClaimSettlement(claimId, amount) {
    return apiPost(`/api/claims/${encodeURIComponent(claimId)}/settle`, {
        amount,
    });
}

export async function getCustomerDetails(policyId) {
    return apiGet(`/api/customers/policy/${encodeURIComponent(policyId)}`);
}

export async function verifyClaimDocuments(claimId, documentId, status) {
    return apiPost(`/api/claims/${encodeURIComponent(claimId)}/documents/${encodeURIComponent(documentId)}/verify`, { status });
}

export async function requestMoreInfo(claimId, info) {
    return apiPost(`/api/claims/${encodeURIComponent(claimId)}/request-info`, { info });
}

export async function saveClaimStatement(claimId, statement) {
    return apiPost(`/api/claims/${encodeURIComponent(claimId)}/statement`, { statement });
}

export async function rejectClaim(claimId, reason) {
    return apiPost(`/api/claims/${encodeURIComponent(claimId)}/reject`, { reason });
}

export async function getClaimHistory(claimId) {
    return apiGet(`/api/claims/${encodeURIComponent(claimId)}/history`);
}

export async function doctorReviewClaim(claimNumber, review, note) {
    return apiPost(`/api/claims/${encodeURIComponent(claimNumber)}/doctor-review`, {
        review,
        doctorNote: note,
    });
}

export async function getComplianceSummary() {
    return apiGet("/api/compliance/summary");
}

export async function getComplianceAuditLogs() {
    return apiGet("/api/compliance/audit-logs");
}

export async function getProducts() {
    return apiGet("/api/products");
}

export async function getProductsByCategory(category) {
    return apiGet(`/api/products/category/${encodeURIComponent(category)}`);
}

export async function getProduct(id) {
    return apiGet(`/api/products/${encodeURIComponent(id)}`);
}

export async function submitRegulatoryReport(reportId, payload) {
    return apiPost(`/api/compliance/reports/${encodeURIComponent(reportId)}/submit`, payload);
}

export async function getRegulatoryReports(status) {
    const query = status ? `?status=${encodeURIComponent(status)}` : "";
    return apiGet(`/api/compliance/reports${query}`);
}

export async function getFinanceSummary() {
    return apiGet("/api/finance/summary");
}

export async function getLedgerEntries() {
    return apiGet("/api/finance/ledger");
}

export async function getGstTransactions() {
    return apiGet("/api/finance/gst/transactions");
}

export async function getRevenueRecords() {
    return apiGet("/api/finance/revenue");
}

export async function fileGstReturn(payload) {
    return apiPost("/api/finance/gst/filing", payload);
}

export async function verifyAadhar(aadhar) {
    return apiPost("/api/policies/verify-aadhar", { aadhar });
}

export async function getPremiumOptions(category, coverage) {
    const params = new URLSearchParams({ category });
    if (coverage) params.append('coverage', coverage);
    return apiGet(`/api/policies/premium-options?${params}`);
}

export async function createComprehensivePolicy(policyData) {
    return apiPost("/api/policies/create", policyData);
}

export async function initiateCCavenuePayment(paymentData) {
    return apiPost("/api/payments/ccavenue/initiate", paymentData);
}

export async function handleCCavenueResponse(responseData) {
    return apiPost("/api/payments/ccavenue/response", responseData);
}

export async function getPendingKycPolicies() {
    return apiGet("/api/digital-kyc/pending-policies");
}

export async function getPolicyDetailsForKyc(policyNumber) {
    return apiGet(`/api/digital-kyc/policy-details/${encodeURIComponent(policyNumber)}`);
}

export async function verifyDigitalKyc(policyNumber, digitalHealthData, verifiedBy) {
    return apiPost(`/api/digital-kyc/verify/${encodeURIComponent(policyNumber)}`, {
        digitalHealth: digitalHealthData,
        verifiedBy: verifiedBy
    });
}

export async function updatePolicy(policyNumber, updates) {
    return apiPost(`/api/policies/${encodeURIComponent(policyNumber)}`, updates, { method: 'PUT' });
}

export async function renewPolicy(policyNumber, renewalData) {
    return apiPost(`/api/policies/${encodeURIComponent(policyNumber)}/renew`, renewalData);
}

export async function generateCertificate(policyNumber) {
    return apiGet(`/api/policies/${encodeURIComponent(policyNumber)}/certificate`);
}

export async function downloadCertificate(policyNumber) {
    const response = await fetch(`${BASE}/api/policies/${encodeURIComponent(policyNumber)}/certificate/download`);
    if (!response.ok) throw new Error('Failed to download certificate');
    return response.blob();
}

export async function getAuditLogs(entityType, entityId) {
    const params = new URLSearchParams({ entityType });
    if (entityId) params.append('entityId', entityId);
    return apiGet(`/api/audit/logs?${params}`);
}

export async function getStats() {
    return apiGet("/api/stats");
}

export async function getComplianceTasks(policyId) {
    return apiGet(`/api/compliance/tasks/${encodeURIComponent(policyId)}`);
}
