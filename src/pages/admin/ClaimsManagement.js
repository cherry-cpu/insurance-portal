import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { getClaims, preauthorizeClaim, adjudicateClaim, settleClaim } from "../../api/client";

const statusStyles = {
    SUBMITTED: "bg-yellow-100 text-yellow-700",
    PRE_AUTH_REQUESTED: "bg-amber-100 text-amber-800",
    PRE_AUTHORIZED: "bg-sky-100 text-sky-700",
    APPROVED: "bg-emerald-100 text-emerald-800",
    SETTLED: "bg-green-100 text-green-700",
    REJECTED: "bg-rose-100 text-rose-800",
};

const fileStatusStyles = {
    passed: "bg-emerald-100 text-emerald-800",
    failed: "bg-rose-100 text-rose-800",
    pending: "bg-slate-100 text-slate-700",
};

const filterOptions = ["All", "SUBMITTED", "PRE_AUTH_REQUESTED", "PRE_AUTHORIZED", "APPROVED", "SETTLED", "REJECTED"];

function formatAmount(paise) {
    if (!paise && paise !== 0) return "₹0";
    return `₹${(Number(paise) / 100).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function ClaimsManagement() {
    const [claims, setClaims] = useState([]);
    const [filter, setFilter] = useState("All");
    const [statusMessage, setStatusMessage] = useState("Loading claims...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadClaims(filter);
    }, [filter]);

    const loadClaims = async (status) => {
        setLoading(true);
        try {
            const items = await getClaims(status);
            setClaims(Array.isArray(items) ? items : []);
            setStatusMessage("");
        } catch (error) {
            setStatusMessage(error.message || "Unable to load claims.");
            setClaims([]);
        } finally {
            setLoading(false);
        }
    };

    const handlePreAuth = async (claim, decision) => {
        try {
            setStatusMessage(`Updating pre-authorization for ${claim.claimNumber || claim.id}...`);
            await preauthorizeClaim(claim.claimNumber || claim.id, decision, `Pre-auth ${decision.toLowerCase()} by claims ops.`);
            await loadClaims(filter);
            setStatusMessage(`Pre-authorization ${decision.toLowerCase()} successfully.`);
        } catch (error) {
            setStatusMessage(error.message || "Pre-authorization failed.");
        }
    };

    const handleApproveClaim = async (claim) => {
        try {
            const approvedAmount = window.prompt("Enter approved amount in paise:", claim.approvedAmountPaise || "");
            if (!approvedAmount) return;
            setStatusMessage(`Adjudicating claim ${claim.claimNumber || claim.id}...`);
            await adjudicateClaim(claim.claimNumber || claim.id, "APPROVE", Number(approvedAmount), "Final claim approval granted.");
            await loadClaims(filter);
            setStatusMessage("Claim approved.");
        } catch (error) {
            setStatusMessage(error.message || "Claim adjudication failed.");
        }
    };

    const handleRejectClaim = async (claim) => {
        try {
            const reason = window.prompt("Enter rejection reason:", "Policy not covered for this event.");
            if (reason === null) return;
            setStatusMessage(`Rejecting claim ${claim.claimNumber || claim.id}...`);
            await adjudicateClaim(claim.claimNumber || claim.id, "REJECT", null, reason);
            await loadClaims(filter);
            setStatusMessage("Claim rejected.");
        } catch (error) {
            setStatusMessage(error.message || "Claim rejection failed.");
        }
    };

    const handleSettle = async (claim) => {
        try {
            const payoutAmount = window.prompt("Enter payout amount in paise:", claim.settlementAmountPaise || claim.approvedAmountPaise || "");
            if (!payoutAmount) return;
            const payoutRef = window.prompt("Enter payout reference:", `PAYOUT-${Date.now()}`);
            if (payoutRef === null) return;
            setStatusMessage(`Settling claim ${claim.claimNumber || claim.id}...`);
            await settleClaim(claim.claimNumber || claim.id, Number(payoutAmount), payoutRef);
            await loadClaims(filter);
            setStatusMessage("Claim settled successfully.");
        } catch (error) {
            setStatusMessage(error.message || "Settlement failed.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminNavbar />
            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Claims management</h1>
                        <p className="mt-1 text-sm text-slate-500">
                            Review claim submissions, approve hospital pre-authorizations, adjudicate decisions, and settle payouts.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-700 shadow-sm border border-slate-200">
                        {loading ? "Loading claims..." : statusMessage || "Ready to manage claims."}
                    </div>
                </div>

                <div className="mb-6 flex flex-wrap gap-2">
                    {filterOptions.map((option) => (
                        <button
                            key={option}
                            type="button"
                            onClick={() => setFilter(option)}
                            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                                filter === option
                                    ? "bg-blue-600 text-white shadow-sm"
                                    : "border border-slate-200 bg-white text-slate-600 shadow-sm hover:bg-slate-50"
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {claims.length === 0 && !loading && (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                            No claims found for this filter.
                        </div>
                    )}

                    {claims.map((claim) => (
                        <div key={claim.claimNumber || claim.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                <div className="min-w-0 flex-1">
                                    <div className="mb-3 flex flex-wrap items-center gap-2">
                                        <h2 className="text-lg font-bold text-slate-900">{claim.claimNumber || claim.id}</h2>
                                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyles[claim.status] || "bg-slate-100 text-slate-700"}`}>
                                            {claim.status}
                                        </span>
                                        {claim.preAuthStatus && (
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                Pre-auth {claim.preAuthStatus}
                                            </span>
                                        )}
                                        {claim.preAuthReference && (
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                                                {claim.preAuthReference}
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Customer</p>
                                            <p className="mt-0.5 font-medium text-slate-800">{claim.customer || claim.patientName || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Policy</p>
                                            <p className="mt-0.5 font-medium text-slate-800">{claim.policyNumber || claim.policy || "N/A"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Hospital</p>
                                            <p className="mt-0.5 font-medium text-slate-800">{claim.hospitalRef || "None"}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Claim amount</p>
                                            <p className="mt-0.5 font-semibold tabular-nums text-slate-800">{formatAmount(claim.amountClaimedPaise)}</p>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm leading-relaxed text-slate-600">
                                        <span className="font-medium text-slate-500">Remarks:</span>{" "}
                                        {claim.detailsJson ? JSON.parse(claim.detailsJson).description : claim.description || "No description provided."}
                                    </p>

                                    {claim.adjudicationNotes && (
                                        <p className="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                                            <span className="font-semibold text-slate-500">Adjudication note:</span> {claim.adjudicationNotes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex shrink-0 flex-col gap-3 text-right">
                                    {claim.status === "APPROVED" && (
                                        <p className="text-sm text-slate-500">Ready for settlement</p>
                                    )}
                                    {(claim.status === "SETTLED" || claim.status === "APPROVED") && (
                                        <p className="text-sm text-slate-500">
                                            Settled: {claim.settlementAmountPaise ? formatAmount(claim.settlementAmountPaise) : "pending"}
                                        </p>
                                    )}
                                    {claim.payoutReference && (
                                        <p className="text-sm text-slate-500">Payout ref: {claim.payoutReference}</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-3">
                                {['SUBMITTED', 'PRE_AUTH_REQUESTED', 'PENDING'].includes(claim.status) && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handlePreAuth(claim, 'APPROVE')}
                                            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                                        >
                                            Approve pre-auth
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handlePreAuth(claim, 'REJECT')}
                                            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100"
                                        >
                                            Reject pre-auth
                                        </button>
                                    </>
                                )}

                                {claim.status === 'PRE_AUTHORIZED' && (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => handleApproveClaim(claim)}
                                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                        >
                                            Approve claim
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => handleRejectClaim(claim)}
                                            className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-800 hover:bg-rose-100"
                                        >
                                            Reject claim
                                        </button>
                                    </>
                                )}

                                {claim.status === 'APPROVED' && (
                                    <button
                                        type="button"
                                        onClick={() => handleSettle(claim)}
                                        className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-700"
                                    >
                                        Settle payout
                                    </button>
                                )}

                                {claim.status === 'REJECTED' && (
                                    <span className="text-sm text-slate-500">No further actions available.</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
