import { useEffect, useState } from "react";
import PortalNavbar from "../../components/PortalNavbar";
import PageShell from "../../components/PageShell";
import { loadClaims, saveClaims } from "../../lib/insuranceStore";

const reviewBadge = {
    pending: "bg-amber-100 text-amber-900",
    cleared: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
    "n/a": "bg-slate-100 text-slate-600",
};

export default function DoctorClaimCheck() {
    const [claims, setClaims] = useState(() => loadClaims());
    const [noteById, setNoteById] = useState({});

    useEffect(() => {
        saveClaims(claims);
    }, [claims]);

    const queue = claims.filter((c) => c.type === "Health" && c.doctorReview === "pending");

    const setReview = (id, review, note) => {
        const text = note?.trim() ?? "";
        setClaims((prev) =>
            prev.map((c) => (c.id === id ? { ...c, doctorReview: review, doctorNote: text || c.doctorNote } : c))
        );
    };

    return (
        <PageShell>
            <PortalNavbar title="Doctor desk" badge="Claim check" />

            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Medical verification queue</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Review health claims for clinical appropriateness before admin settlement.{" "}
                        <span className="font-semibold text-slate-800">{queue.length} pending</span>
                    </p>
                </div>

                <div className="space-y-4">
                    {queue.length === 0 && (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                            No health claims awaiting doctor review.
                        </div>
                    )}

                    {queue.map((c) => (
                        <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                <div>
                                    <p className="font-mono text-sm font-bold text-slate-900">{c.id}</p>
                                    <p className="mt-1 text-sm text-slate-600">
                                        Patient / member: <span className="font-semibold text-slate-900">{c.customer}</span>
                                    </p>
                                    {c.source === "hospital" && c.hospitalName && (
                                        <p className="mt-1 text-sm text-teal-700">
                                            Submitted by hospital: <span className="font-semibold">{c.hospitalName}</span>
                                        </p>
                                    )}
                                    <p className="mt-3 text-sm leading-relaxed text-slate-700">
                                        <span className="font-medium text-slate-500">Clinical summary:</span> {c.description}
                                    </p>
                                    <div className="mt-3 flex flex-wrap gap-3 text-sm">
                                        <span>
                                            Policy <span className="font-semibold">{c.policy}</span>
                                        </span>
                                        <span className="text-slate-300">|</span>
                                        <span>
                                            Amount <span className="font-semibold tabular-nums">{c.amount}</span>
                                        </span>
                                        <span className="text-slate-300">|</span>
                                        <span className="text-slate-500">Filed {c.date}</span>
                                    </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-bold ${reviewBadge.pending}`}>Pending review</span>
                            </div>

                            <label className="mt-4 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                                Doctor notes (visible to admin)
                            </label>
                            <textarea
                                className="input-premium mt-1 min-h-[80px] resize-none"
                                placeholder="e.g. Diagnosis aligns with policy terms; bills verified."
                                value={noteById[c.id] ?? ""}
                                onChange={(e) => setNoteById((prev) => ({ ...prev, [c.id]: e.target.value }))}
                            />

                            <div className="mt-4 flex flex-wrap gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReview(c.id, "cleared", noteById[c.id] ?? "");
                                        setNoteById((p) => {
                                            const n = { ...p };
                                            delete n[c.id];
                                            return n;
                                        });
                                    }}
                                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
                                >
                                    Verify &amp; clear
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setReview(c.id, "rejected", noteById[c.id] ?? "");
                                        setNoteById((p) => {
                                            const n = { ...p };
                                            delete n[c.id];
                                            return n;
                                        });
                                    }}
                                    className="rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-sm font-semibold text-rose-800 hover:bg-rose-100"
                                >
                                    Reject (medical grounds)
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Recently decided (health)</h2>
                    <ul className="mt-3 space-y-2 text-sm text-slate-600">
                        {claims
                            .filter((c) => c.type === "Health" && c.doctorReview !== "pending")
                            .slice(0, 6)
                            .map((c) => (
                                <li key={c.id} className="flex flex-wrap justify-between gap-2 border-b border-slate-50 py-2 last:border-0">
                                    <span className="font-mono text-xs">{c.id}</span>
                                    <span className="font-medium text-slate-800">{c.customer}</span>
                                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${reviewBadge[c.doctorReview] || reviewBadge["n/a"]}`}>
                                        {c.doctorReview}
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
        </PageShell>
    );
}
