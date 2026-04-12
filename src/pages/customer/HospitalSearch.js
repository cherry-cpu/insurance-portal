import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PageShell from "../../components/PageShell";
import { apiGet } from "../../api/client";

export default function HospitalSearch() {
  const [location, setLocation] = useState("");
  const [planId, setPlanId] = useState("");
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const runSearch = async (event) => {
    if (event) event.preventDefault();
    setMessage("");
    try {
      const query = [];
      if (location.trim()) query.push(`location=${encodeURIComponent(location.trim())}`);
      if (planId.trim()) query.push(`planId=${encodeURIComponent(planId.trim())}`);
      const payload = await apiGet(`/api/hospitals/search${query.length ? `?${query.join("&")}` : ""}`);
      setResults(payload.results || []);
      if (!payload.results || payload.results.length === 0) {
        setMessage("No hospitals found for the selected criteria.");
      }
    } catch (error) {
      setMessage(error.message || "Search failed.");
      setResults([]);
    }
  };

  return (
    <PageShell>
      <Navbar />

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Customer service</p>
          <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Search network hospitals</h1>
          <p className="mt-2 text-slate-600">Find hospitals mapped to your insurance plan and check cashless eligibility.</p>
        </div>

        <form onSubmit={runSearch} className="card-premium p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm text-slate-700">
              Location / city
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="input-premium mt-2"
                placeholder="e.g. Mumbai"
              />
            </label>
            <label className="block text-sm text-slate-700">
              Plan / product ID
              <input
                value={planId}
                onChange={(e) => setPlanId(e.target.value)}
                className="input-premium mt-2"
                placeholder="e.g. 101"
              />
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" className="btn-primary">Search hospitals</button>
            <span className="text-sm text-slate-500">Leave plan ID blank to list all hospitals in the city.</span>
          </div>
        </form>

        <div className="mt-6 space-y-4">
          {message && <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{message}</div>}

          {results.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {results.map((hospital) => (
                <div key={hospital.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-slate-900">{hospital.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">{hospital.city}, {hospital.state || "India"}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${hospital.cashless ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {hospital.cashless ? "Cashless" : "Reimbursement"}
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-slate-600">
                    <p>Tier: {hospital.tier}</p>
                    <p>Network: {hospital.networkType || "NON_NETWORK"}</p>
                    <p>Hospital ID: {hospital.id}</p>
                  </div>
                  <Link
                    to="/hospital"
                    className="mt-4 inline-flex rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Start claim intake
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
}
