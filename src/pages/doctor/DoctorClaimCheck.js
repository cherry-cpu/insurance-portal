import { useEffect, useState } from "react";
import PortalNavbar from "../../components/PortalNavbar";
import PageShell from "../../components/PageShell";
import { loadClaims, saveClaims } from "../../lib/insuranceStore";
import { getPendingKycPolicies, getPolicyDetailsForKyc, verifyDigitalKyc } from "../../api/client";

const reviewBadge = {
    pending: "bg-amber-100 text-amber-900",
    cleared: "bg-emerald-100 text-emerald-800",
    rejected: "bg-rose-100 text-rose-800",
    "n/a": "bg-slate-100 text-slate-600",
};

export default function DoctorClaimCheck() {
    const [activeTab, setActiveTab] = useState('claims');
    const [claims, setClaims] = useState(() => loadClaims());
    const [noteById, setNoteById] = useState({});

    // Digital KYC state
    const [pendingPolicies, setPendingPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [policyDetails, setPolicyDetails] = useState(null);
    const [digitalHealthData, setDigitalHealthData] = useState({
        medicalRecords: '',
        healthStatus: 'good',
        chronicConditions: '',
        allergies: '',
        medications: '',
        lastCheckup: '',
        bmi: '',
        bloodPressure: '',
        additionalNotes: ''
    });
    const [isVerified, setIsVerified] = useState(false);

    useEffect(() => {
        saveClaims(claims);
    }, [claims]);

    // Load pending KYC policies
    useEffect(() => {
        if (activeTab === 'kyc') {
            loadPendingPolicies();
        }
    }, [activeTab]);

    const loadPendingPolicies = async () => {
        try {
            const response = await getPendingKycPolicies();
            setPendingPolicies(response.policies || []);
        } catch (error) {
            alert("Failed to load pending KYC policies: " + error.message);
        }
    };

    const handlePolicySelect = async (policyNumber) => {
        try {
            const response = await getPolicyDetailsForKyc(policyNumber);
            setSelectedPolicy(policyNumber);
            setPolicyDetails(response);
            setIsVerified(false);

            // Reset digital health form
            setDigitalHealthData({
                medicalRecords: '',
                healthStatus: 'good',
                chronicConditions: '',
                allergies: '',
                medications: '',
                lastCheckup: '',
                bmi: '',
                bloodPressure: '',
                additionalNotes: ''
            });
        } catch (error) {
            alert("Failed to load policy details: " + error.message);
        }
    };

    const handleVerifyKyc = async () => {
        if (!selectedPolicy) return;

        try {
            await verifyDigitalKyc(selectedPolicy, digitalHealthData, "Doctor");
            setIsVerified(true);
            alert("Digital KYC verified successfully!");
            // Reload pending policies
            loadPendingPolicies();
            // Clear selection
            setSelectedPolicy(null);
            setPolicyDetails(null);
        } catch (error) {
            alert("Failed to verify Digital KYC: " + error.message);
        }
    };

    const queue = claims.filter((c) => c.type === "Health" && c.doctorReview === "pending");

    const setReview = (id, review, note) => {
        const text = note?.trim() ?? "";
        setClaims((prev) =>
            prev.map((c) => (c.id === id ? { ...c, doctorReview: review, doctorNote: text || c.doctorNote } : c))
        );
    };

    return (
        <PageShell>
            <PortalNavbar title="Doctor desk" badge="Claim check & Digital KYC" />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                {/* Tab Navigation */}
                <div className="mb-8">
                    <div className="border-b border-slate-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('claims')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'claims'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                Claim Reviews ({queue.length})
                            </button>
                            <button
                                onClick={() => setActiveTab('kyc')}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === 'kyc'
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                                }`}
                            >
                                Digital KYC ({pendingPolicies.length})
                            </button>
                        </nav>
                    </div>
                </div>

                {activeTab === 'claims' && (
                    <>
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
            </>
        )}

        {activeTab === 'kyc' && (
            <>
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900">Digital KYC Verification</h1>
                    <p className="mt-1 text-sm text-slate-600">
                        Verify digital health details for new policy holders.{" "}
                        <span className="font-semibold text-slate-800">{pendingPolicies.length} pending</span>
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pending Policies List */}
                    <div className="lg:col-span-1">
                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">Pending Policies</h2>
                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {pendingPolicies.length === 0 ? (
                                    <p className="text-sm text-slate-500 text-center py-4">No pending KYC policies</p>
                                ) : (
                                    pendingPolicies.map((policy) => (
                                        <button
                                            key={policy.policyNumber}
                                            onClick={() => handlePolicySelect(policy.policyNumber)}
                                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                                                selectedPolicy === policy.policyNumber
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <p className="font-mono text-sm font-bold text-slate-900">{policy.policyNumber}</p>
                                            <p className="text-xs text-slate-500 mt-1">
                                                Created: {new Date(policy.createdAt).toLocaleDateString()}
                                            </p>
                                        </button>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Policy Details and KYC Form */}
                    <div className="lg:col-span-2">
                        {selectedPolicy && policyDetails ? (
                            <div className="space-y-6">
                                {/* Policy Holder Details */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Policy Holder Details</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Policy Number</label>
                                            <p className="font-mono text-sm text-slate-900">{policyDetails.policyNumber}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Status</label>
                                            <p className="text-sm text-slate-900">{policyDetails.status}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Name</label>
                                            <p className="text-sm text-slate-900">{policyDetails.personal.name}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Email</label>
                                            <p className="text-sm text-slate-900">{policyDetails.personal.email}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Phone</label>
                                            <p className="text-sm text-slate-900">{policyDetails.personal.phone}</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700">Aadhar</label>
                                            <p className="font-mono text-sm text-slate-900">{policyDetails.personal.aadhar}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Digital Health Details Form */}
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Digital Health Details</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Health Status</label>
                                            <select
                                                value={digitalHealthData.healthStatus}
                                                onChange={(e) => setDigitalHealthData({...digitalHealthData, healthStatus: e.target.value})}
                                                className="input-premium w-full"
                                            >
                                                <option value="excellent">Excellent</option>
                                                <option value="good">Good</option>
                                                <option value="fair">Fair</option>
                                                <option value="poor">Poor</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">BMI</label>
                                            <input
                                                type="text"
                                                value={digitalHealthData.bmi}
                                                onChange={(e) => setDigitalHealthData({...digitalHealthData, bmi: e.target.value})}
                                                className="input-premium w-full"
                                                placeholder="e.g. 22.5"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Blood Pressure</label>
                                            <input
                                                type="text"
                                                value={digitalHealthData.bloodPressure}
                                                onChange={(e) => setDigitalHealthData({...digitalHealthData, bloodPressure: e.target.value})}
                                                className="input-premium w-full"
                                                placeholder="e.g. 120/80"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Last Checkup</label>
                                            <input
                                                type="date"
                                                value={digitalHealthData.lastCheckup}
                                                onChange={(e) => setDigitalHealthData({...digitalHealthData, lastCheckup: e.target.value})}
                                                className="input-premium w-full"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Chronic Conditions</label>
                                            <textarea
                                                value={digitalHealthData.chronicConditions}
                                                onChange={(e) => setDigitalHealthData({...digitalHealthData, chronicConditions: e.target.value})}
                                                className="input-premium w-full resize-none"
                                                rows="2"
                                                placeholder="List any chronic conditions..."
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Allergies</label>
                                            <textarea
                                                value={digitalHealthData.allergies}
                                                onChange={(e) => setDigitalHealthData({...digitalHealthData, allergies: e.target.value})}
                                                className="input-premium w-full resize-none"
                                                rows="2"
                                                placeholder="List any allergies..."
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Current Medications</label>
                                            <textarea
                                                value={digitalHealthData.medications}
                                                onChange={(e) => setDigitalHealthData({...digitalHealthData, medications: e.target.value})}
                                                className="input-premium w-full resize-none"
                                                rows="2"
                                                placeholder="List current medications..."
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Medical Records Summary</label>
                                            <textarea
                                                value={digitalHealthData.medicalRecords}
                                                onChange={(e) => setDigitalHealthData({...digitalHealthData, medicalRecords: e.target.value})}
                                                className="input-premium w-full resize-none"
                                                rows="3"
                                                placeholder="Summary of medical records..."
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                                            <textarea
                                                value={digitalHealthData.additionalNotes}
                                                onChange={(e) => setDigitalHealthData({...digitalHealthData, additionalNotes: e.target.value})}
                                                className="input-premium w-full resize-none"
                                                rows="2"
                                                placeholder="Any additional observations..."
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                id="kyc-verified"
                                                checked={isVerified}
                                                onChange={(e) => setIsVerified(e.target.checked)}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-slate-300 rounded"
                                            />
                                            <label htmlFor="kyc-verified" className="ml-2 text-sm font-medium text-slate-700">
                                                Digital KYC Verified
                                            </label>
                                        </div>
                                        <button
                                            onClick={handleVerifyKyc}
                                            disabled={!isVerified}
                                            className="px-6 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Verify & Complete KYC
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-slate-500">
                                Select a policy from the list to begin Digital KYC verification
                            </div>
                        )}
                    </div>
                </div>
            </>
        )}
            </div>
        </PageShell>
    );
}
