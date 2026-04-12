import { Link } from "react-router-dom";
import AdminNavbar from "../../components/AdminNavbar";

const stats = [
    { label: "Total Policies", value: "1,248", color: "border-blue-500" },
    { label: "Active Claims", value: "56", color: "border-yellow-500" },
    { label: "Approved Claims", value: "892", color: "border-green-500" },
    { label: "Revenue (Monthly)", value: "₹18.5L", color: "border-purple-500" },
];

const recentPolicies = [
    { id: "#POL-1048", customer: "Rahul Sharma", type: "Health", premium: "₹12,000", date: "2026-04-10" },
    { id: "#POL-1047", customer: "Priya Patel", type: "Vehicle", premium: "₹8,500", date: "2026-04-09" },
    { id: "#POL-1046", customer: "Amit Kumar", type: "Life", premium: "₹15,000", date: "2026-04-08" },
    { id: "#POL-1045", customer: "Sneha Reddy", type: "Home", premium: "₹6,000", date: "2026-04-07" },
    { id: "#POL-1044", customer: "Vikram Singh", type: "Health", premium: "₹12,000", date: "2026-04-06" },
];

export default function AdminDashboard() {
    return (
        <div className="min-h-screen bg-slate-100">
            <AdminNavbar />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
                    <p className="text-slate-500 text-sm mt-1">Policies and claims at a glance</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                    {stats.map((stat, i) => (
                        <div key={i} className={`bg-white rounded-2xl shadow-sm border border-slate-200/80 p-6 border-l-4 ${stat.color}`}>
                            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                            <p className="text-3xl font-bold text-slate-900 mt-1 tabular-nums">{stat.value}</p>
                        </div>
                    ))}
                </div>

                {/* Recent Policies Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden mb-8">
                    <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                        <h2 className="text-lg font-bold text-slate-900">Recent policies</h2>
                        <span className="text-sm text-slate-400">Latest 5</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[640px]">
                            <thead className="bg-slate-50/90">
                                <tr>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Policy ID</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Premium</th>
                                    <th className="px-6 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentPolicies.map((policy) => (
                                    <tr key={policy.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 text-sm font-semibold text-blue-600">{policy.id}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{policy.customer}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700">{policy.type}</td>
                                        <td className="px-6 py-4 text-sm text-slate-700 tabular-nums">{policy.premium}</td>
                                        <td className="px-6 py-4 text-sm text-slate-400">{policy.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <Link
                        to="/admin/claims"
                        className="rounded-2xl p-6 text-center transition shadow-sm border border-amber-500/20 bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:from-amber-600 hover:to-amber-700 hover:shadow-md"
                    >
                        <p className="text-lg font-bold">Manage claims</p>
                        <p className="text-amber-50 text-sm mt-1">Review and process pending claims</p>
                    </Link>
                    <Link
                        to="/admin/users"
                        className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:border-blue-200 hover:shadow-md"
                    >
                        <p className="text-lg font-bold text-slate-900">Manage users</p>
                        <p className="mt-1 text-sm text-slate-500">Roles, suspend access, and onboarding</p>
                    </Link>
                </div>
            </div>
        </div>
    );
}
