import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import PageShell from "../../components/PageShell";
import {
  createUnderwritingCase,
  getUnderwritingCases,
  quoteUnderwriting,
  reviewUnderwritingCase,
} from "../../api/client";

const CONDITION_OPTIONS = [
  "none",
  "diabetes",
  "hypertension",
  "heart disease",
  "cancer",
  "kidney disorder",
];

const STATUS_BADGE = {
  PENDING: "badge-pending",
  APPROVE: "badge-approved",
  LOAD_PREMIUM: "badge-warning",
  REJECT: "badge-rejected",
};

function formatMoney(paise) {
  if (!paise || Number.isNaN(paise)) return "₹0.00";
  return `₹${(paise / 100).toFixed(2)}`;
}

function UnderwritingMgmtView() {
  const [form, setForm] = useState({
    applicantName: "",
    policyNumber: "",
    age: "",
    gender: "Male",
    tobaccoUse: "no",
    requestedSumInsured: "",
    conditions: ["none"],
    medicalHistoryNotes: "",
  });
  const [quote, setQuote] = useState(null);
  const [cases, setCases] = useState([]);
  const [statusMessage, setStatusMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    try {
      const result = await getUnderwritingCases();
      setCases(Array.isArray(result) ? result : []);
    } catch (error) {
      setStatusMessage(error.message || "Unable to load underwriting cases.");
    }
  };

  const toggleCondition = (condition) => {
    setForm((prev) => {
      const current = new Set(prev.conditions || []);
      if (condition === "none") {
        return { ...prev, conditions: ["none"] };
      }
      current.delete("none");
      if (current.has(condition)) {
        current.delete(condition);
      } else {
        current.add(condition);
      }
      return { ...prev, conditions: current.size > 0 ? Array.from(current) : ["none"] };
    });
  };

  const handleQuote = async () => {
    setStatusMessage("");
    setQuote(null);
    setLoading(true);
    try {
      const payload = {
        applicantName: form.applicantName,
        policyNumber: form.policyNumber,
        age: Number(form.age),
        gender: form.gender,
        tobaccoUse: form.tobaccoUse,
        requestedSumInsuredPaise: Math.round(Number(form.requestedSumInsured) * 100),
        conditions: form.conditions,
        medicalHistoryNotes: form.medicalHistoryNotes,
      };
      const result = await quoteUnderwriting(payload);
      setQuote(result);
      setStatusMessage("Risk assessment completed.");
    } catch (error) {
      setStatusMessage(error.message || "Unable to calculate premium.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setStatusMessage("");
    setLoading(true);
    try {
      const payload = {
        applicantName: form.applicantName,
        policyNumber: form.policyNumber,
        age: Number(form.age),
        gender: form.gender,
        tobaccoUse: form.tobaccoUse,
        requestedSumInsuredPaise: Math.round(Number(form.requestedSumInsured) * 100),
        conditions: form.conditions,
        medicalHistoryNotes: form.medicalHistoryNotes,
      };
      const saved = await createUnderwritingCase(payload);
      setStatusMessage(`Underwriting case ${saved.applicationNumber} submitted successfully.`);
      setForm({
        applicantName: "",
        policyNumber: "",
        age: "",
        gender: "Male",
        tobaccoUse: "no",
        requestedSumInsured: "",
        conditions: ["none"],
        medicalHistoryNotes: "",
      });
      setQuote(null);
      await loadCases();
    } catch (error) {
      setStatusMessage(error.message || "Failed to submit underwriting case.");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (underwritingCase, decision) => {
    setStatusMessage("");
    setLoading(true);
    try {
      const payload = {
        decision,
        decisionReason:
          decision === "APPROVE"
            ? "Policy approved after risk assessment."
            : decision === "LOAD_PREMIUM"
            ? "Premium load approved pending carrier review."
            : "Application rejected by underwriting rule engine.",
        backgroundCheckStatus: "COMPLETED",
      };
      await reviewUnderwritingCase(underwritingCase.id, payload);
      setStatusMessage(`Case ${underwritingCase.applicationNumber} updated to ${decision}.`);
      await loadCases();
    } catch (error) {
      setStatusMessage(error.message || "Unable to update underwriting case.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageShell>
      <Navbar />
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
        <div className="mb-8 animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Underwriting</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Risk assessment & premium engine</h1>
          <p className="mt-2 text-slate-600">
            Evaluate applications, calculate premium load, capture medical checks and rule-based decisions from a single underwriting dashboard.
          </p>
        </div>

        {statusMessage && (
          <div className="mb-6 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
            {statusMessage}
          </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="card-premium p-6 sm:p-8">
            <h2 className="mb-4 text-lg font-bold text-slate-900">New underwriting request</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-slate-700">
                Policy number
                <input
                  className="input-premium mt-2"
                  value={form.policyNumber}
                  onChange={(e) => setForm({ ...form, policyNumber: e.target.value })}
                  placeholder="POL-1001"
                />
              </label>
              <label className="block text-sm text-slate-700">
                Applicant name
                <input
                  className="input-premium mt-2"
                  value={form.applicantName}
                  onChange={(e) => setForm({ ...form, applicantName: e.target.value })}
                  placeholder="Jane Doe"
                />
              </label>
              <label className="block text-sm text-slate-700">
                Age
                <input
                  type="number"
                  min="18"
                  className="input-premium mt-2"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />
              </label>
              <label className="block text-sm text-slate-700">
                Gender
                <select
                  className="input-premium mt-2"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </label>
              <label className="block text-sm text-slate-700">
                Tobacco use
                <select
                  className="input-premium mt-2"
                  value={form.tobaccoUse}
                  onChange={(e) => setForm({ ...form, tobaccoUse: e.target.value })}
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </label>
              <label className="block text-sm text-slate-700">
                Requested sum insured (₹)
                <input
                  type="number"
                  min="100000"
                  className="input-premium mt-2"
                  value={form.requestedSumInsured}
                  onChange={(e) => setForm({ ...form, requestedSumInsured: e.target.value })}
                  placeholder="500000"
                />
              </label>
            </div>

            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-800">Declared health conditions</p>
              <div className="mt-3 grid gap-2 sm:grid-cols-3">
                {CONDITION_OPTIONS.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleCondition(option)}
                    className={`rounded-2xl border px-3 py-2 text-sm font-medium transition ${
                      form.conditions.includes(option)
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {option === "none" ? "No declared conditions" : option}
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-5 block text-sm text-slate-700">
              Medical / background notes
              <textarea
                rows={4}
                className="input-premium mt-2 min-h-[120px] resize-none"
                value={form.medicalHistoryNotes}
                onChange={(e) => setForm({ ...form, medicalHistoryNotes: e.target.value })}
                placeholder="Enter any known medical history, previous underwriting notes or background flags."
              />
            </label>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={handleQuote}
                disabled={loading}
                className="btn-primary w-full py-3.5 text-base"
              >
                {loading ? "Assessing risk…" : "Assess risk & quote premium"}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-secondary w-full py-3.5 text-base"
              >
                Submit underwriting case
              </button>
            </div>

            {quote && (
              <div className="mt-7 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <h3 className="text-base font-bold text-slate-900">Underwriting recommendation</h3>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Risk score</p>
                    <p className="mt-2 text-3xl font-bold text-slate-900">{quote.riskScore}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Decision</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{quote.decision}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Base premium</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{formatMoney(quote.basePremiumPaise)}</p>
                  </div>
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <p className="text-sm text-slate-500">Recommended premium</p>
                    <p className="mt-2 text-xl font-bold text-slate-900">{formatMoney(quote.recommendedPremiumPaise)}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-slate-600">
                  <p>{quote.decisionReason}</p>
                  {quote.rules?.length > 0 && (
                    <ul className="list-disc pl-5">
                      {quote.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="card-premium p-6 sm:p-8">
              <h2 className="mb-4 text-lg font-bold text-slate-900">Underwriting cases</h2>
              <div className="space-y-4">
                {cases.length === 0 ? (
                  <p className="text-sm text-slate-500">No underwriting cases exist yet. Submit an application to start the review workflow.</p>
                ) : (
                  cases.map((uw) => (
                    <div key={uw.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{uw.applicationNumber}</p>
                          <p className="mt-1 text-sm text-slate-500">Policy {uw.policyNumber} · {uw.applicantName}</p>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${STATUS_BADGE[uw.decision] || "badge-pending"}`}>{uw.decision}</span>
                        </div>
                      </div>
                      <div className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-slate-600">
                        <div>Risk score: <span className="font-semibold text-slate-900">{uw.riskScore}</span></div>
                        <div>Load premium: <span className="font-semibold text-slate-900">{formatMoney(uw.recommendedPremiumPaise)}</span></div>
                        <div>Medical check: <span className="font-semibold text-slate-900">{uw.medicalCheckRequired ? "Required" : "Not required"}</span></div>
                        <div>Background: <span className="font-semibold text-slate-900">{uw.backgroundCheckStatus || "PENDING"}</span></div>
                      </div>
                      <div className="mt-4 space-y-3 text-sm text-slate-600">
                        <p>{uw.decisionReason || "No decision notes yet."}</p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => handleReview(uw, "APPROVE")}
                            className="rounded-xl bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReview(uw, "LOAD_PREMIUM")}
                            className="rounded-xl bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-700 hover:bg-amber-100"
                          >
                            Load premium
                          </button>
                          <button
                            type="button"
                            onClick={() => handleReview(uw, "REJECT")}
                            className="rounded-xl bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}

export default UnderwritingMgmtView;
