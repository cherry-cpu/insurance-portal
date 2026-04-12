import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PageShell from "../../components/PageShell";
import RazorpayButton from "../../components/RazorpayButton";
import { APP_NAME } from "../../brand";
import { AGE_BRACKETS, CONDITION_OPTIONS, getEligiblePlans, HEALTH_PLANS } from "../../data/healthPlansCatalog";
import { GENERAL_POLICY_GRID } from "../../data/generalPolicies";
import { HEALTH_CHECKUP_RULE, POLICY_TERMS_SECTIONS } from "../../data/policyTerms";
import { INDIAN_STATES } from "../../data/indianStates";
import { buildPolicyScheduleHtml, downloadPolicyHtml } from "../../lib/policyDocument";
import { clearPendingPurchase, getPendingPurchase, getSession, setPendingPurchase } from "../../lib/session";

const STEPS = [
    { n: 1, label: "Personal" },
    { n: 2, label: "Health" },
    { n: 3, label: "Nominee" },
    { n: 4, label: "Review & Pay" },
];

export default function BuyPolicy() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    /** marketplace → health (configure) → wizard → done */
    const [view, setView] = useState("marketplace");
    const [step, setStep] = useState(1);

    const [ageBracket, setAgeBracket] = useState("31-45");
    const [conditions, setConditions] = useState(["none"]);
    const [selectedPlanId, setSelectedPlanId] = useState("");

    const [personal, setPersonal] = useState({
        name: "",
        email: "",
        phone: "",
        dob: "",
        addressLine1: "",
        state: "",
        district: "",
        city: "",
        pincode: "",
    });
    const [health, setHealth] = useState({
        heightCm: "",
        weightKg: "",
        tobacco: "no",
    });
    const [nominee, setNominee] = useState({
        name: "",
        relationship: "",
        phone: "",
    });

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [medicalAck, setMedicalAck] = useState(false);
    const [purchased, setPurchased] = useState(false);
    const [policyNumber] = useState(() => `POL-RT-${Date.now().toString(36).toUpperCase().slice(-10)}`);

    const eligiblePlans = useMemo(() => getEligiblePlans(ageBracket, conditions), [ageBracket, conditions]);
    const selected = eligiblePlans.find((p) => p.id === selectedPlanId);

    const needsMedicalExam =
        ["46-60", "61+"].includes(ageBracket) || (conditions.length > 0 && !conditions.every((c) => c === "none"));

    useEffect(() => {
        const p = getPendingPurchase();
        const s = getSession();
        if (p && s && p.selectedPlanId) {
            setAgeBracket(p.ageBracket || "31-45");
            setConditions(p.conditions || ["none"]);
            setSelectedPlanId(p.selectedPlanId);
            setView("wizard");
            setStep(1);
            clearPendingPurchase();
        }
    }, [searchParams]);

    const toggleCondition = (id) => {
        if (id === "none") {
            setConditions(["none"]);
            return;
        }
        setConditions((prev) => {
            const withoutNone = prev.filter((x) => x !== "none");
            if (withoutNone.includes(id)) return withoutNone.length <= 1 ? ["none"] : withoutNone.filter((x) => x !== id);
            return [...withoutNone, id];
        });
    };

    const continueToApplication = () => {
        if (!selectedPlanId || !selected) return;
        if (!getSession()) {
            setPendingPurchase({ ageBracket, conditions, selectedPlanId });
            navigate(`/login?redirect=${encodeURIComponent("/buy")}`);
            return;
        }
        setView("wizard");
        setStep(1);
    };

    const nextStep = () => {
        if (step === 1) {
            if (
                !personal.name.trim() ||
                !personal.email.trim() ||
                !personal.phone.trim() ||
                !personal.addressLine1.trim() ||
                !personal.state ||
                !personal.district.trim() ||
                !personal.city.trim() ||
                !personal.pincode.trim()
            )
                return;
            if (!/^\d{6}$/.test(personal.pincode.trim())) return;
        }
        if (step === 2) {
            if (!health.heightCm || !health.weightKg) return;
        }
        if (step === 3) {
            if (!nominee.name.trim() || !nominee.relationship.trim() || !nominee.phone.trim()) return;
        }
        setStep((s) => Math.min(4, s + 1));
    };

    const prevStep = () => setStep((s) => Math.max(1, s - 1));

    const personalForDoc = {
        ...personal,
        address: `${personal.addressLine1}, ${personal.city}, ${personal.district}, ${personal.state} — ${personal.pincode}`,
    };

    const handleDownloadSchedule = () => {
        if (!selected) return;
        const html = buildPolicyScheduleHtml({
            plan: selected,
            personal: personalForDoc,
            health: {
                ...health,
                medicalExamNote: needsMedicalExam
                    ? "Medical / tele-underwriting required before issuance."
                    : "Not required based on declared profile.",
            },
            nominee,
            premiumLabel: selected.premiumLabel,
            coverageLabel: `₹${selected.coverage.toLocaleString("en-IN")}`,
            policyNumber,
        });
        downloadPolicyHtml(html, `${policyNumber}-schedule.html`);
    };

    const amountPaise = selected ? Math.round(selected.computedPremium * 100) : 0;

    const paymentSuccess = () => {
        setPurchased(true);
        setTimeout(() => navigate("/dashboard"), 2500);
    };

    return (
        <PageShell>
            <Navbar />

            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-10">
                <div className="mb-8 animate-fade-in-up">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{APP_NAME} — Insurance</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Buy a policy</h1>
                    <p className="mt-2 text-slate-600">
                        Browse products, review benefits, sign in, then complete your application and pay securely with Razorpay.
                    </p>
                </div>

                {purchased ? (
                    <div className="card-premium animate-fade-in-up p-10 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-3xl">✓</div>
                        <h2 className="mb-2 text-2xl font-bold text-emerald-700">Payment successful</h2>
                        <p className="text-slate-600">
                            Policy <span className="font-mono font-bold">{policyNumber}</span> is recorded. Redirecting…
                        </p>
                    </div>
                ) : (
                    <>
                        {/* 1) Marketplace — general policies grid */}
                        {view === "marketplace" && (
                            <div className="space-y-8">
                                <div className="card-premium p-6 sm:p-8">
                                    <h2 className="text-lg font-extrabold text-slate-900">General policy categories</h2>
                                    <p className="mt-1 text-sm text-slate-600">Compare coverage types. Health purchase continues below.</p>
                                    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                        {GENERAL_POLICY_GRID.map((g) => (
                                            <div
                                                key={g.id}
                                                className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 transition hover:border-blue-200 hover:shadow-sm"
                                            >
                                                <div className="text-2xl">{g.icon}</div>
                                                <p className="mt-2 font-bold text-slate-900">{g.name}</p>
                                                <p className="mt-1 text-xs font-medium text-slate-500">Sum insured: {g.sumInsured}</p>
                                                <ul className="mt-3 space-y-1 text-sm text-slate-600">
                                                    {g.benefits.map((b) => (
                                                        <li key={b}>• {b}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setView("health")}
                                        className="btn-primary mt-8 w-full py-3.5 sm:w-auto"
                                    >
                                        Continue to health plan selection →
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* 2) Health — plan details from catalog */}
                        {view === "health" && (
                            <div className="card-premium space-y-8 p-6 sm:p-8">
                                <div>
                                    <button type="button" onClick={() => setView("marketplace")} className="text-sm font-semibold text-blue-600">
                                        ← Back to categories
                                    </button>
                                    <h2 className="mt-4 text-xl font-extrabold text-slate-900">Health — benefits &amp; eligibility</h2>
                                    <p className="mt-1 text-sm text-slate-600">All plans below follow IRDAI guidelines (demo data).</p>
                                </div>

                                <div className="overflow-x-auto rounded-xl border border-slate-200">
                                    <table className="w-full min-w-[640px] text-left text-sm">
                                        <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wide text-slate-500">
                                            <tr>
                                                <th className="px-4 py-3">Plan</th>
                                                <th className="px-4 py-3">Tier</th>
                                                <th className="px-4 py-3">Base cover</th>
                                                <th className="px-4 py-3">Highlights</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {HEALTH_PLANS.map((hp) => (
                                                <tr key={hp.id} className="hover:bg-slate-50/80">
                                                    <td className="px-4 py-3 font-semibold text-slate-900">{hp.name}</td>
                                                    <td className="px-4 py-3">{hp.tier}</td>
                                                    <td className="px-4 py-3 tabular-nums">₹{hp.coverage.toLocaleString("en-IN")}</td>
                                                    <td className="px-4 py-3 text-slate-600">{hp.summary}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <section>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Your profile</h3>
                                    <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                        {AGE_BRACKETS.map((b) => (
                                            <button
                                                key={b.id}
                                                type="button"
                                                onClick={() => {
                                                    setAgeBracket(b.id);
                                                    setSelectedPlanId("");
                                                }}
                                                className={`rounded-xl border-2 px-4 py-3 text-left text-sm font-semibold transition ${
                                                    ageBracket === b.id
                                                        ? "border-blue-600 bg-blue-50/90 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                                                        : "border-slate-200 bg-slate-50/80 hover:border-slate-300"
                                                }`}
                                            >
                                                {b.label}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Pre-existing conditions</h3>
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {CONDITION_OPTIONS.map((c) => {
                                            const on = conditions.includes(c.id);
                                            return (
                                                <button
                                                    key={c.id}
                                                    type="button"
                                                    onClick={() => {
                                                        toggleCondition(c.id);
                                                        setSelectedPlanId("");
                                                    }}
                                                    className={`rounded-full border px-3 py-1.5 text-sm font-medium transition ${
                                                        on
                                                            ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                                                    }`}
                                                >
                                                    {c.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </section>

                                <section>
                                    <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Matching plans (priced)</h3>
                                    {eligiblePlans.length === 0 ? (
                                        <p className="mt-2 text-sm text-amber-800">No plan matches — adjust age or conditions.</p>
                                    ) : (
                                        <div className="mt-3 space-y-3">
                                            {eligiblePlans.map((plan) => {
                                                const active = selectedPlanId === plan.id;
                                                return (
                                                    <button
                                                        key={plan.id}
                                                        type="button"
                                                        onClick={() => setSelectedPlanId(plan.id)}
                                                        className={`w-full rounded-2xl border-2 p-4 text-left transition ${
                                                            active
                                                                ? "border-blue-600 bg-blue-50/90 shadow-[0_0_0_3px_rgba(37,99,235,0.12)]"
                                                                : "border-slate-200 bg-white hover:border-slate-300"
                                                        }`}
                                                    >
                                                        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                                                            <div>
                                                                <span className="rounded-md bg-slate-900 px-2 py-0.5 text-xs font-bold uppercase text-white">
                                                                    {plan.tier}
                                                                </span>
                                                                <p className="mt-2 text-lg font-extrabold text-slate-900">{plan.name}</p>
                                                                <p className="text-sm text-slate-600">{plan.summary}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="text-xl font-extrabold tabular-nums text-slate-900">{plan.premiumLabel}</p>
                                                                <p className="text-sm text-slate-600">₹{plan.coverage.toLocaleString("en-IN")}</p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </section>

                                {selected && (
                                    <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-4 py-4">
                                        <p className="font-semibold text-slate-900">Selected: {selected.name}</p>
                                        <p className="text-sm text-slate-600">
                                            {selected.premiumLabel} · Co-pay: {selected.copay}
                                        </p>
                                        <button type="button" onClick={continueToApplication} className="btn-primary mt-4 w-full py-3 sm:w-auto">
                                            {getSession() ? "Fill application form" : "Sign in to continue"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* 3) Wizard */}
                        {view === "wizard" && selected && (
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                                    {STEPS.map((s, i) => (
                                        <div key={s.n} className="flex items-center gap-2">
                                            <div
                                                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold ${
                                                    step === s.n
                                                        ? "bg-blue-600 text-white"
                                                        : step > s.n
                                                          ? "bg-emerald-100 text-emerald-800"
                                                          : "bg-slate-100 text-slate-500"
                                                }`}
                                            >
                                                {step > s.n ? "✓" : s.n}
                                            </div>
                                            <span className={`text-sm font-semibold ${step === s.n ? "text-slate-900" : "text-slate-500"}`}>
                                                {s.label}
                                            </span>
                                            {i < STEPS.length - 1 && <span className="mx-1 hidden text-slate-300 sm:inline">→</span>}
                                        </div>
                                    ))}
                                </div>

                                <div className="card-premium p-6 sm:p-8">
                                    {step === 1 && (
                                        <section className="space-y-4">
                                            <h2 className="text-lg font-extrabold text-slate-900">1. Personal &amp; address</h2>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div className="md:col-span-2">
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Street / building</label>
                                                    <input
                                                        className="input-premium"
                                                        value={personal.addressLine1}
                                                        onChange={(e) => setPersonal({ ...personal, addressLine1: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">State / UT</label>
                                                    <select
                                                        className="input-premium"
                                                        value={personal.state}
                                                        onChange={(e) => setPersonal({ ...personal, state: e.target.value })}
                                                        required
                                                    >
                                                        <option value="">Select state</option>
                                                        {INDIAN_STATES.map((st) => (
                                                            <option key={st} value={st}>
                                                                {st}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">District</label>
                                                    <input
                                                        className="input-premium"
                                                        value={personal.district}
                                                        onChange={(e) => setPersonal({ ...personal, district: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">City / Town</label>
                                                    <input
                                                        className="input-premium"
                                                        value={personal.city}
                                                        onChange={(e) => setPersonal({ ...personal, city: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">PIN code</label>
                                                    <input
                                                        className="input-premium"
                                                        inputMode="numeric"
                                                        maxLength={6}
                                                        value={personal.pincode}
                                                        onChange={(e) => setPersonal({ ...personal, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Full name</label>
                                                    <input
                                                        className="input-premium"
                                                        value={personal.name}
                                                        onChange={(e) => setPersonal({ ...personal, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Email</label>
                                                    <input
                                                        type="email"
                                                        className="input-premium"
                                                        value={personal.email}
                                                        onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Phone</label>
                                                    <input
                                                        className="input-premium"
                                                        value={personal.phone}
                                                        onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Date of birth</label>
                                                    <input
                                                        type="date"
                                                        className="input-premium"
                                                        value={personal.dob}
                                                        onChange={(e) => setPersonal({ ...personal, dob: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {step === 2 && (
                                        <section className="space-y-4">
                                            <h2 className="text-lg font-extrabold text-slate-900">2. Health information</h2>
                                            <div className="grid gap-4 sm:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Height (cm)</label>
                                                    <input
                                                        type="number"
                                                        min="50"
                                                        className="input-premium"
                                                        value={health.heightCm}
                                                        onChange={(e) => setHealth({ ...health, heightCm: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Weight (kg)</label>
                                                    <input
                                                        type="number"
                                                        min="10"
                                                        className="input-premium"
                                                        value={health.weightKg}
                                                        onChange={(e) => setHealth({ ...health, weightKg: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Tobacco</label>
                                                    <select
                                                        className="input-premium"
                                                        value={health.tobacco}
                                                        onChange={(e) => setHealth({ ...health, tobacco: e.target.value })}
                                                    >
                                                        <option value="no">No</option>
                                                        <option value="yes">Yes</option>
                                                    </select>
                                                </div>
                                            </div>
                                            {needsMedicalExam && (
                                                <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                                                    <p className="font-bold">Medical examination may be required</p>
                                                    <p className="mt-1">{HEALTH_CHECKUP_RULE}</p>
                                                </div>
                                            )}
                                        </section>
                                    )}

                                    {step === 3 && (
                                        <section className="space-y-4">
                                            <h2 className="text-lg font-extrabold text-slate-900">3. Nominee</h2>
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Nominee name</label>
                                                    <input
                                                        className="input-premium"
                                                        value={nominee.name}
                                                        onChange={(e) => setNominee({ ...nominee, name: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Relationship</label>
                                                    <input
                                                        className="input-premium"
                                                        value={nominee.relationship}
                                                        onChange={(e) => setNominee({ ...nominee, relationship: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="mb-2 block text-sm font-medium text-slate-700">Nominee phone</label>
                                                    <input
                                                        className="input-premium"
                                                        value={nominee.phone}
                                                        onChange={(e) => setNominee({ ...nominee, phone: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </section>
                                    )}

                                    {step === 4 && (
                                        <section className="space-y-5">
                                            <h2 className="text-lg font-extrabold text-slate-900">4. Review, terms &amp; payment</h2>
                                            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                                                <p className="font-mono text-xs text-slate-500">Reference</p>
                                                <p className="text-lg font-bold text-slate-900">{policyNumber}</p>
                                                <p className="mt-2 font-semibold">{selected.name}</p>
                                                <p className="text-slate-600">
                                                    {selected.premiumLabel} · ₹{selected.coverage.toLocaleString("en-IN")} sum insured
                                                </p>
                                                <p className="mt-2 text-slate-700">
                                                    {personal.city}, {personal.state} — {personal.pincode}
                                                </p>
                                            </div>

                                            <div>
                                                <p className="mb-2 text-sm font-semibold text-slate-800">Terms &amp; conditions (summary)</p>
                                                <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
                                                    {POLICY_TERMS_SECTIONS.map((t) => (
                                                        <div key={t.title} className="mb-3 last:mb-0">
                                                            <p className="font-semibold text-slate-800">{t.title}</p>
                                                            <p className="mt-1">{t.body}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={handleDownloadSchedule}
                                                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm font-semibold text-slate-800 shadow-sm hover:bg-slate-50 sm:w-auto"
                                            >
                                                Download schedule (HTML)
                                            </button>

                                            <label className="flex cursor-pointer items-start gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                                                    checked={termsAccepted}
                                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                                />
                                                <span className="text-sm text-slate-700">I accept the terms and product conditions.</span>
                                            </label>

                                            {needsMedicalExam && (
                                                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-3">
                                                    <input
                                                        type="checkbox"
                                                        className="mt-1 h-4 w-4 rounded border-amber-400 text-amber-600"
                                                        checked={medicalAck}
                                                        onChange={(e) => setMedicalAck(e.target.checked)}
                                                    />
                                                    <span className="text-sm text-amber-950">I agree to medical / tele-underwriting if required.</span>
                                                </label>
                                            )}

                                            <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                                <p className="text-sm text-slate-600">
                                                    Amount due: <span className="font-bold text-slate-900">{selected.premiumLabel}</span>
                                                </p>
                                                <RazorpayButton
                                                    amountPaise={amountPaise}
                                                    receipt={policyNumber}
                                                    description={`${APP_NAME} — ${selected.name}`}
                                                    policyNumber={policyNumber}
                                                    customerName={personal.name}
                                                    customerEmail={personal.email}
                                                    customerPhone={personal.phone}
                                                    disabled={!termsAccepted || (needsMedicalExam && !medicalAck)}
                                                    onSuccess={paymentSuccess}
                                                />
                                            </div>
                                        </section>
                                    )}

                                    <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:justify-between">
                                        <div>
                                            {step > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={prevStep}
                                                    className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
                                                >
                                                    Back
                                                </button>
                                            )}
                                        </div>
                                        <div>
                                            {step < 4 && (
                                                <button type="button" onClick={nextStep} className="btn-primary px-8 py-3">
                                                    Next
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </PageShell>
    );
}
