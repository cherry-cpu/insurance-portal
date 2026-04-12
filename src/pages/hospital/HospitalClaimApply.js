import { useState } from "react";
import PortalNavbar from "../../components/PortalNavbar";
import PageShell from "../../components/PageShell";
import { apiGet, submitClaim, checkHospitalEligibility } from "../../api/client";
import { validateAttachmentMeta } from "../../lib/claimFileValidation";

function filesToMeta(files, category) {
    return Array.from(files || []).map((f) => {
        const r = validateAttachmentMeta({ name: f.name, size: f.size, type: f.type });
        return {
            name: f.name,
            size: f.size,
            type: f.type,
            category,
            valid: r.valid,
            validationErrors: r.errors,
        };
    });
}

export default function HospitalClaimApply() {
    const [done, setDone] = useState(false);
    const [refId, setRefId] = useState("");
    const [form, setForm] = useState({
        hospitalName: "",
        patientName: "",
        policyId: "",
        claimAmount: "",
        diagnosis: "",
        serviceDate: "",
        notes: "",
    });
    const [selectedHospital, setSelectedHospital] = useState(null);
    const [searchLocation, setSearchLocation] = useState("");
    const [searchPlanId, setSearchPlanId] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [eligibility, setEligibility] = useState(null);
    const [idFiles, setIdFiles] = useState(null);
    const [rxFiles, setRxFiles] = useState(null);
    const [billFiles, setBillFiles] = useState(null);
    const [clientError, setClientError] = useState("");
    const [searchStatus, setSearchStatus] = useState("");

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        setSearchStatus("");
        setSearchResults([]);

        const query = [];
        if (searchLocation.trim()) query.push(`location=${encodeURIComponent(searchLocation.trim())}`);
        if (searchPlanId.trim()) query.push(`planId=${encodeURIComponent(searchPlanId.trim())}`);

        try {
            const payload = await apiGet(`/api/hospitals/search${query.length ? `?${query.join("&")}` : ""}`);
            const results = payload.results || [];
            setSearchResults(results);
            if (results.length === 0) {
                setSearchStatus("No hospitals found for your search criteria.");
            }
        } catch (error) {
            setSearchStatus(error.message || "Unable to search hospitals.");
        }
    };

    const selectHospital = (hospital) => {
        setSelectedHospital(hospital);
        setForm((prev) => ({ ...prev, hospitalName: hospital.name }));
        setEligibility(null);
        setClientError("");
    };

    const checkEligibility = async (hospitalId, policyNumber) => {
        const eligibility = await checkHospitalEligibility(hospitalId, policyNumber);
        setEligibility(eligibility);
        return eligibility;
    };

    const submit = async (e) => {
        e.preventDefault();
        setClientError("");

        const idMeta = filesToMeta(idFiles, "patient-id");
        const rxMeta = filesToMeta(rxFiles, "prescription");
        const billMeta = filesToMeta(billFiles, "bills");

        if (!selectedHospital) {
            setClientError("Select a hospital from the search results before submitting the claim.");
            return;
        }

        if (rxMeta.length === 0) {
            setClientError("Doctor prescription upload is required (PDF or image, max 5 MB each).");
            return;
        }

        const bad = [...idMeta, ...rxMeta, ...billMeta].filter((x) => !x.valid);
        if (bad.length) {
            setClientError(bad.map((b) => `${b.name}: ${b.validationErrors.join(", ")}`).join(" · "));
            return;
        }

        try {
            const elig = await checkEligibility(selectedHospital.id, form.policyId.trim());
            const response = await submitClaim({
                policyNumber: form.policyId.trim(),
                amountClaimedPaise: Math.round(Number(form.claimAmount) * 100),
                hospitalRef: selectedHospital.id,
                detailsJson: JSON.stringify({
                    patientName: form.patientName.trim(),
                    diagnosis: form.diagnosis.trim(),
                    serviceDate: form.serviceDate,
                    notes: form.notes.trim(),
                }),
            });

            setRefId(response.claimNumber || response.claimId);
            setDone(true);
            if (elig && !elig.cashlessEligible) {
                setClientError("Claim submitted, but the selected hospital is not cashless eligible for this policy. Use reimbursement route.");
            }
        } catch (error) {
            setClientError(error.message || "Failed to submit claim.");
        }
    };

    return (
        <PageShell>
            <PortalNavbar title="Hospital portal" badge="Intake" />

            <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Patient claim intake</h1>
                    <p className="mt-2 text-slate-600">
                        Search the network hospital list, validate cashless eligibility, and submit the claim with documentation.
                    </p>
                </div>

                <div className="space-y-5">
                    <section className="card-premium p-6">
                        <h2 className="text-lg font-bold text-slate-900">Search network hospitals</h2>
                        <form onSubmit={handleSearch} className="mt-6 grid gap-4 sm:grid-cols-2">
                            <label className="block text-sm text-slate-700">
                                City / location
                                <input
                                    className="input-premium mt-2"
                                    value={searchLocation}
                                    onChange={(e) => setSearchLocation(e.target.value)}
                                    placeholder="e.g. Mumbai"
                                />
                            </label>
                            <label className="block text-sm text-slate-700">
                                Plan / product ID
                                <input
                                    className="input-premium mt-2"
                                    value={searchPlanId}
                                    onChange={(e) => setSearchPlanId(e.target.value)}
                                    placeholder="e.g. 101"
                                />
                            </label>
                            <div className="sm:col-span-2 mt-2">
                                <button type="submit" className="btn-primary">Search hospitals</button>
                                <p className="mt-2 text-sm text-slate-500">Choose a hospital to enable cashless eligibility checks.</p>
                            </div>
                        </form>
                        {searchStatus && <p className="mt-4 text-sm text-rose-600">{searchStatus}</p>}
                        {searchResults.length > 0 && (
                            <div className="mt-6 grid gap-4">
                                {searchResults.map((hospital) => (
                                    <button
                                        key={hospital.id}
                                        type="button"
                                        onClick={() => selectHospital(hospital)}
                                        className={`rounded-2xl border px-4 py-4 text-left transition ${selectedHospital?.id === hospital.id ? "border-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:border-slate-300"}`}
                                    >
                                        <div className="flex items-center justify-between gap-4">
                                            <div>
                                                <p className="font-semibold text-slate-900">{hospital.name}</p>
                                                <p className="text-sm text-slate-500">{hospital.city}, {hospital.state || "India"}</p>
                                                <p className="text-xs text-slate-400">Network: {hospital.networkType || "NON_NETWORK"}</p>
                                            </div>
                                            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hospital.cashless ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                                {hospital.cashless ? "Cashless" : "Reimbursement"}
                                            </span>
                                        </div>
                                        <p className="mt-2 text-xs text-slate-500">Hospital ID: {hospital.id}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </section>

                    {selectedHospital && (
                        <section className="card-premium p-6">
                            <h2 className="text-lg font-bold text-slate-900">Selected hospital</h2>
                            <p className="mt-3 text-sm text-slate-600">{selectedHospital.name} — {selectedHospital.city}, {selectedHospital.state || "India"}</p>
                            <p className={`mt-2 rounded-2xl px-4 py-3 text-sm ${eligibility?.cashlessEligible ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"}`}>
                                {eligibility ? eligibility.authorizationMessage : "Eligibility will be checked when you submit the claim."}
                            </p>
                        </section>
                    )}

                    {done ? (
                        <div className="card-premium p-8 text-center">
                            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-600">Submitted</p>
                            <p className="mt-2 text-lg font-bold text-slate-900">Reference {refId}</p>
                            <p className="mt-2 text-sm text-slate-600">
                                Claim is in the hospital operations queue. You can submit another intake below.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setDone(false);
                                    setRefId("");
                                    setForm({
                                        hospitalName: "",
                                        patientName: "",
                                        policyId: "",
                                        claimAmount: "",
                                        diagnosis: "",
                                        serviceDate: "",
                                        notes: "",
                                    });
                                    setSelectedHospital(null);
                                    setEligibility(null);
                                    setIdFiles(null);
                                    setRxFiles(null);
                                    setBillFiles(null);
                                }}
                                className="btn-primary mt-6"
                            >
                                Submit another
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={submit} className="card-premium space-y-5 p-6 sm:p-8">
                            {clientError && (
                                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">{clientError}</div>
                            )}

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Patient full name</label>
                                    <input
                                        className="input-premium"
                                        required
                                        value={form.patientName}
                                        onChange={(e) => setForm({ ...form, patientName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Policy number</label>
                                    <input
                                        className="input-premium"
                                        required
                                        value={form.policyId}
                                        onChange={(e) => setForm({ ...form, policyId: e.target.value })}
                                        placeholder="POL-1001"
                                    />
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4">
                                <p className="text-sm font-bold text-slate-900">Document uploads</p>
                                <p className="mt-1 text-xs text-slate-600">PDF, JPG, or PNG · max 5 MB per file</p>
                                <div className="mt-4 space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Patient ID proof</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
                                            multiple
                                            className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
                                            onChange={(e) => setIdFiles(e.target.files)}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Doctor prescription <span className="text-rose-600">*</span>
                                        </label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
                                            multiple
                                            required
                                            className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-blue-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
                                            onChange={(e) => setRxFiles(e.target.files)}
                                        />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">Hospital bills (optional)</label>
                                        <input
                                            type="file"
                                            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/*"
                                            multiple
                                            className="text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-600 file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white"
                                            onChange={(e) => setBillFiles(e.target.files)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Claim amount (₹)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="input-premium"
                                        required
                                        value={form.claimAmount}
                                        onChange={(e) => setForm({ ...form, claimAmount: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Service / admission date</label>
                                    <input
                                        type="date"
                                        className="input-premium"
                                        required
                                        value={form.serviceDate}
                                        onChange={(e) => setForm({ ...form, serviceDate: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Diagnosis / procedure</label>
                                <input
                                    className="input-premium"
                                    required
                                    value={form.diagnosis}
                                    onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                                    placeholder="e.g. Appendectomy — elective"
                                />
                            </div>
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Notes (optional)</label>
                                <textarea
                                    className="input-premium min-h-[100px] resize-none"
                                    value={form.notes}
                                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                    placeholder="Room category, implant details, etc."
                                />
                            </div>
                            <button type="submit" className="btn-primary w-full py-3.5 text-base">
                                Submit claim to insurer
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </PageShell>
    );
}
