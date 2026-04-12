/**
 * Client-side store: users + claims (localStorage).
 * Claims include attachments metadata, process history, and customer-facing issues.
 */

const USERS_KEY = "insurePortal_users_v1";
const CLAIMS_KEY = "insurePortal_claims_v2";

export const seedUsers = () => [
    { id: "USR-001", name: "Praveen K", email: "praveen@example.com", role: "Customer", status: "Active", created: "2026-01-10" },
    { id: "USR-002", name: "Rahul Sharma", email: "rahul@example.com", role: "Customer", status: "Active", created: "2026-02-01" },
    { id: "USR-003", name: "Dr. Ananya Rao", email: "doctor@example.com", role: "Doctor", status: "Active", created: "2025-11-15" },
    { id: "USR-004", name: "City General Hospital", email: "hospital@example.com", role: "Hospital", status: "Active", created: "2025-10-20" },
    { id: "USR-005", name: "Admin Ops", email: "admin@example.com", role: "Admin", status: "Active", created: "2025-06-01" },
];

function historyEntry(actor, action, detail) {
    return { at: new Date().toISOString(), actor, action, detail };
}

export const seedClaims = () => [
    {
        id: "CLM-2001",
        customer: "Rahul Sharma",
        policy: "#POL-1001",
        type: "Health",
        amount: "₹45,000",
        date: "2026-03-15",
        status: "Approved",
        description: "Hospitalization for surgery",
        source: "customer",
        hospitalName: "",
        doctorReview: "cleared",
        doctorNote: "Records verified.",
        attachments: [
            { name: "discharge.pdf", size: 890000, type: "application/pdf", category: "discharge", valid: true, validationErrors: [] },
        ],
        fileValidationStatus: "passed",
        customerIssues: [],
        processHistory: [
            { at: "2026-03-15T09:00:00.000Z", actor: "Member", action: "Claim submitted", detail: "Online filing" },
            { at: "2026-03-15T11:00:00.000Z", actor: "Doctor desk", action: "Medical clearance", detail: "Cleared" },
            { at: "2026-03-16T08:00:00.000Z", actor: "Admin", action: "Approved", detail: "Payout authorised" },
        ],
    },
    {
        id: "CLM-2002",
        customer: "Priya Patel",
        policy: "#POL-1002",
        type: "Vehicle",
        amount: "₹22,000",
        date: "2026-04-02",
        status: "Pending",
        description: "Accident repair cost",
        source: "customer",
        hospitalName: "",
        doctorReview: "n/a",
        doctorNote: "",
        attachments: [{ name: "garage-invoice.pdf", size: 2100000, type: "application/pdf", category: "invoice", valid: true, validationErrors: [] }],
        fileValidationStatus: "passed",
        customerIssues: [],
        processHistory: [
            { at: "2026-04-02T10:00:00.000Z", actor: "Member", action: "Claim submitted", detail: "Documents uploaded" },
        ],
    },
    {
        id: "CLM-2003",
        customer: "Amit Kumar",
        policy: "#POL-1003",
        type: "Health",
        amount: "₹15,000",
        date: "2026-04-05",
        status: "Pending",
        description: "Emergency treatment",
        source: "customer",
        hospitalName: "",
        doctorReview: "pending",
        doctorNote: "",
        attachments: [
            { name: "wrong-format.txt", size: 1200, type: "text/plain", category: "bills", valid: false, validationErrors: ["Only PDF, JPG, or PNG files are accepted"] },
            { name: "bill.pdf", size: 450000, type: "application/pdf", category: "bills", valid: true, validationErrors: [] },
        ],
        fileValidationStatus: "failed",
        customerIssues: [
            {
                at: "2026-04-06T10:00:00.000Z",
                message: "Please replace `wrong-format.txt` with a PDF or image of the hospital bill (max 5 MB).",
                from: "admin",
            },
        ],
        processHistory: [
            { at: "2026-04-05T14:00:00.000Z", actor: "Member", action: "Claim submitted", detail: "Initial documents" },
            { at: "2026-04-06T10:00:00.000Z", actor: "Admin", action: "Validation issue", detail: "Requested re-upload of bill document" },
        ],
    },
    {
        id: "CLM-2004",
        customer: "Sneha Reddy",
        policy: "#POL-1004",
        type: "Home",
        amount: "₹1,20,000",
        date: "2026-04-08",
        status: "Pending",
        description: "Flood damage repair",
        source: "customer",
        hospitalName: "",
        doctorReview: "n/a",
        doctorNote: "",
        attachments: [],
        fileValidationStatus: "pending",
        customerIssues: [],
        processHistory: [{ at: "2026-04-08T09:00:00.000Z", actor: "Member", action: "Claim submitted", detail: "Awaiting survey report" }],
    },
    {
        id: "CLM-2005",
        customer: "Vikram Singh",
        policy: "#POL-1005",
        type: "Life",
        amount: "₹5,00,000",
        date: "2026-03-20",
        status: "Rejected",
        description: "Policy lapsed before claim date",
        source: "customer",
        hospitalName: "",
        doctorReview: "n/a",
        doctorNote: "",
        attachments: [],
        fileValidationStatus: "pending",
        customerIssues: [],
        processHistory: [
            { at: "2026-03-20T11:00:00.000Z", actor: "Member", action: "Claim submitted", detail: "Death claim intake" },
            { at: "2026-03-21T09:00:00.000Z", actor: "Admin", action: "Rejected", detail: "Policy not in force on incident date" },
        ],
    },
];

function readJson(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
    } catch {
        return fallback;
    }
}

function writeJson(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function loadUsers() {
    const data = readJson(USERS_KEY, null);
    if (!data || !Array.isArray(data)) {
        const seed = seedUsers();
        writeJson(USERS_KEY, seed);
        return seed;
    }
    return data;
}

export function saveUsers(users) {
    writeJson(USERS_KEY, users);
}

function normalizeClaim(c) {
    return {
        ...c,
        source: c.source ?? "customer",
        hospitalName: c.hospitalName ?? "",
        doctorReview: c.doctorReview ?? (c.type === "Health" ? "pending" : "n/a"),
        doctorNote: c.doctorNote ?? "",
        attachments: Array.isArray(c.attachments) ? c.attachments : [],
        processHistory: Array.isArray(c.processHistory) ? c.processHistory : [],
        customerIssues: Array.isArray(c.customerIssues) ? c.customerIssues : [],
        fileValidationStatus: c.fileValidationStatus ?? "pending",
    };
}

export function loadClaims() {
    const data = readJson(CLAIMS_KEY, null);
    if (!data || !Array.isArray(data)) {
        const seed = seedClaims();
        writeJson(CLAIMS_KEY, seed);
        return seed.map(normalizeClaim);
    }
    return data.map(normalizeClaim);
}

export function saveClaims(claims) {
    writeJson(CLAIMS_KEY, claims);
}

/** Append a hospital-submitted claim with attachment metadata */
export function addHospitalClaim(entry) {
    const claims = loadClaims();
    const id = `CLM-H-${Date.now()}`;
    const attachments = (entry.attachments || []).map((a) => ({
        name: a.name,
        size: a.size,
        type: a.type,
        category: a.category,
        valid: a.valid,
        validationErrors: a.validationErrors || [],
    }));

    const row = {
        id,
        customer: entry.patientName,
        policy: entry.policyId.startsWith("#") ? entry.policyId : `#${entry.policyId}`,
        type: "Health",
        amount: `₹${Number(entry.claimAmount).toLocaleString("en-IN")}`,
        date: entry.serviceDate || new Date().toISOString().slice(0, 10),
        status: "Pending",
        description: `${entry.diagnosis} — ${entry.notes || "Hospital intake"}`,
        source: "hospital",
        hospitalName: entry.hospitalName,
        doctorReview: "pending",
        doctorNote: "",
        attachments,
        fileValidationStatus: attachments.length ? (attachments.every((x) => x.valid) ? "passed" : "failed") : "pending",
        customerIssues: [],
        processHistory: [
            historyEntry(entry.hospitalName || "Hospital", "Intake submitted", `Prescription & patient details uploaded (${attachments.length} file(s))`),
        ],
    };

    claims.unshift(row);
    saveClaims(claims);
    return id;
}
