import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import PageShell from "../../components/PageShell";
import { getClaims, submitClaim } from "../../api/client";

const statusBadge = {
    APPROVED: "badge-approved",
    PENDING: "badge-pending",
    REJECTED: "badge-rejected",
    PRE_AUTH_REQUESTED: "badge-pending",
    PRE_AUTHORIZED: "badge-approved",
    SETTLED: "badge-approved",
    SUBMITTED: "badge-pending",
};

function fmt(iso) {
    try {
        return new Date(iso).toLocaleString();
    } catch {
        return iso;
    }
}

function formatAmount(value) {
    if (typeof value !== "number") return "₹0.00";
    return `₹${(value / 100).toFixed(2)}`;
}

export default function Claims() {
    const [form, setForm] = useState({ policyId: "", description: "", amount: "" });
    const [submitted, setSubmitted] = useState(false);
    const [claims, setClaims] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadClaims();
    }, []);

    const loadClaims = async () => {
        try {
            const result = await getClaims();
            setClaims(Array.isArray(result) ? result : []);
        } catch (error) {
            setMessage(error.message || "Unable to load claims.");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(false);
        setMessage("Submitting claim...");

        try {
            await submitClaim({
                policyNumber: form.policyId.trim(),
                amountClaimedPaise: Math.round(Number(form.amount) * 100),
                detailsJson: JSON.stringify({ description: form.description }),
            });
            setSubmitted(true);
            setForm({ policyId: "", description: "", amount: "" });
            setMessage("Claim submitted successfully.");
            await loadClaims();
        } catch (error) {
            setMessage(error.message || "Claim submission failed.");
        }
    };

    return (
        <PageShell>
            <Navbar />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
                <div className="mb-8 animate-fade-in-up">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Claims</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">File and track claims</h1>
                    <p className="mt-2 text-slate-600">
                        Claims submitted through this form are stored in the backend and tracked in real time.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
                    <div className="card-premium animate-fade-in-up p-6 sm:p-8" style={{ animationDelay: "0.05s" }}>
                        <h2 className="mb-1 text-lg font-extrabold text-slate-900">File a new claim</h2>
                        <p className="mb-6 text-sm text-slate-600">We typically respond within one business day.</p>

                        {message && (
                            <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Policy</label>
                                <select
                                    value={form.policyId}
                                    onChange={(e) => setForm({ ...form, policyId: e.target.value })}
                                    className="input-premium cursor-pointer appearance-none bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
                                    required
                                >
                                    <option value="">Select a policy</option>
                                    <option value="POL-1001">#POL-1001 — Health Shield</option>
                                    <option value="POL-1002">#POL-1002 — Vehicle Guard</option>
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Claim amount (₹)</label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="Enter amount"
                                    value={form.amount}
                                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                    className="input-premium"
                                    required
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Description</label>
                                <textarea
                                    placeholder="Describe what happened and any documents you have attached…"
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    rows={4}
                                    className="input-premium min-h-[120px] resize-none"
                                    required
                                />
                            </div>

                            <button type="submit" className="btn-primary w-full py-3.5 text-base">
                                Submit claim
                            </button>
                        </form>
                    </div>

                    <div className="card-premium animate-fade-in-up overflow-hidden" style={{ animationDelay: "0.1s" }}>
                        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-6 py-5">
                            <div>
                                <h2 className="text-lg font-extrabold text-slate-900">Your claims</h2>
                                <p className="mt-0.5 text-sm text-slate-500">Status, pre-auth, adjudication, and payout tracking.</p>
                            </div>
                            <button
                                type="button"
                                onClick={loadClaims}
                                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Refresh
                            </button>
                        </div>
                        <ul className="max-h-[640px] divide-y divide-slate-100 overflow-y-auto">
                            {claims.map((claim) => (
                                <li key={claim.claimNumber || claim.id} className="px-6 py-5 transition hover:bg-slate-50/80">
                                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                                        <div className="min-w-0">
                                            <p className="font-mono text-sm font-bold text-slate-900">{claim.claimNumber || claim.id}</p>
                                            <p className="mt-0.5 text-sm text-slate-600">
                                                {claim.policyNumber || claim.policy} · {claim.hospitalRef ? "Hospital" : "Member"}
                                            </p>
                                            <p className="mt-2 text-xs text-slate-400">Filed {fmt(claim.createdAt || claim.created_at || new Date().toISOString())}</p>

                                            <div className="mt-3 flex flex-wrap gap-2 text-sm">
                                                <span className="font-semibold">{formatAmount(claim.amountClaimedPaise)}</span>
                                                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">{claim.status}</span>
                                                {claim.preAuthStatus && (
                                                    <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                                                        Pre-auth {claim.preAuthStatus}
                                                    </span>
                                                )}
                                            </div>

                                            <p className="mt-3 text-sm text-slate-600">
                                                {claim.detailsJson ? JSON.parse(claim.detailsJson).description : claim.description}
                                            </p>
                                        </div>
                                        <div className="shrink-0 text-left sm:text-right">
                                            <span className={`badge mt-2 inline-flex ${statusBadge[claim.status] || "badge-pending"}`}>
                                                {claim.status}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
