import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PageShell from "../../components/PageShell";
import { useEffect, useState } from "react";
import axios from "axios";

const typeIcons = {
    Health: "❤️",
    // Add other types as needed
};

export default function Dashboard() {
    const [policies, setPolicies] = useState([]);
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchStatsAndPolicies() {
            try {
                const [statsResponse, policiesResponse] = await Promise.all([
                    axios.get("http://localhost:8080/api/stats"), // Replace with your stats API endpoint
                    axios.get("http://localhost:8080/api/policies"), // Replace with your policies API endpoint
                ]);

                // Ensure stats is an array
                const statsData = Array.isArray(statsResponse.data) ? statsResponse.data : Object.entries(statsResponse.data).map(([key, value]) => ({ label: key, value }));

                setStats(statsData);
                setPolicies(policiesResponse.data);
            } catch (err) {
                setError("Failed to fetch data. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchStatsAndPolicies();
    }, []);

    if (loading) {
        return (
            <PageShell>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
                    <p className="text-center text-slate-500">Loading...</p>
                </div>
            </PageShell>
        );
    }

    if (error) {
        return (
            <PageShell>
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
                    <p className="text-center text-red-500">{error}</p>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
                {/* Welcome Section */}
                <div className="mb-8 animate-fade-in-up">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Overview</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                        Good evening, Praveen <span aria-hidden>👋</span>
                    </h1>
                    <p className="mt-2 max-w-xl text-slate-600">Your health insurance portfolio, policies, and claims in one place.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8 stagger-children">
                    {stats.map((stat, i) => (
                        <div key={i} className="card-premium p-5 flex items-start gap-4">
                            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${stat.bg} ring-1 ring-slate-900/5`}>
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24" className={stat.text}>
                                    <path d={stat.icon} strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                                <p className="mt-0.5 text-2xl font-extrabold tabular-nums tracking-tight text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8 stagger-children">
                    <Link
                        to="/buy"
                        className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-card-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 55%, #172554 100%)" }}
                    >
                        <div className="bg-circle" style={{ width: 220, height: 220, background: "#fff", top: -90, right: -70, opacity: 0.1 }} />
                        <div className="relative z-10">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 transition group-hover:scale-105">
                                <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                            </div>
                            <p className="text-xl font-extrabold tracking-tight">Buy a new policy</p>
                            <p className="mt-1 text-sm text-blue-100/95">Browse plans tailored to you</p>
                        </div>
                    </Link>
                    <Link
                        to="/claims"
                        className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-card-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #14b8a6 0%, #0d9488 50%, #134e4a 100%)" }}
                    >
                        <div className="bg-circle" style={{ width: 220, height: 220, background: "#fff", top: -90, right: -70, opacity: 0.1 }} />
                        <div className="relative z-10">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 transition group-hover:scale-105">
                                <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>
                            </div>
                            <p className="text-xl font-extrabold tracking-tight">File a claim</p>
                            <p className="mt-1 text-sm text-teal-50/95">Fast review and status updates</p>
                        </div>
                    </Link>
                    <Link
                        to="/hospitals"
                        className="group relative overflow-hidden rounded-2xl p-6 text-white shadow-card-lg ring-1 ring-white/10 transition duration-300 hover:-translate-y-0.5"
                        style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 55%, #7c2d12 100%)" }}
                    >
                        <div className="bg-circle" style={{ width: 220, height: 220, background: "#fff", top: -90, right: -70, opacity: 0.1 }} />
                        <div className="relative z-10">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20 transition group-hover:scale-105">
                                <svg width="24" height="24" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 7a2 2 0 012-2h14a2 2 0 012 2v11a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/><path d="M8 4v4"/><path d="M16 4v4"/></svg>
                            </div>
                            <p className="text-xl font-extrabold tracking-tight">Search hospitals</p>
                            <p className="mt-1 text-sm text-orange-100/95">Find network hospitals and cashless options</p>
                        </div>
                    </Link>
                </div>

                {/* Policies Table */}
                <div className="card-premium overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900">Your policies</h2>
                            <p className="text-sm text-slate-500">Active coverage and renewal dates</p>
                        </div>
                        <Link to="/plans" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700">
                            View all plans
                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-slate-50/90">
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Policy</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Type</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Premium</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Coverage</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Next due</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {policies.map((policy) => (
                                    <tr key={policy.id} className="transition hover:bg-blue-50/40">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{typeIcons[policy.type]}</span>
                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900">{policy.name}</p>
                                                    <p className="text-xs text-slate-400">#{policy.policyNumber}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-600/10">
                                                {policy.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold tabular-nums text-slate-800">{policy.premium}</td>
                                        <td className="px-6 py-4 text-sm tabular-nums text-slate-600">{policy.coverage}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{policy.endDate}</td>
                                        <td className="px-6 py-4">
                                            <span className="badge badge-active">● {policy.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
