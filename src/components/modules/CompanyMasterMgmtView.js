import React, { useState } from 'react';

export default function CompanyMasterMgmtView() {
    const [activeTab, setActiveTab] = useState('profile');
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [commissionRate, setCommissionRate] = useState('15.00');

    const companies = [
        { id: "INS-001", name: "HDFC Ergo General Insurance", code: "IRDAI-146", status: "ACTIVE" },
        { id: "INS-002", name: "Star Health & Allied Insurance", code: "IRDAI-129", status: "ACTIVE" },
        { id: "INS-003", name: "Life Insurance Corporation (LIC)", code: "IRDAI-512", status: "INACTIVE" }
    ];

    const mockCompanyTarget = {
        details: { email: 'b2b-support@hdfcergo.partner.com', phone: '+91-8029102919' },
        products: [
            { code: "HLTH-COMP", name: "Comprehensive Family Health", cat: "HEALTH", premium: "$120/mo" },
            { code: "FAM-CARE", name: "Family Care Plus", cat: "HEALTH", premium: "$140/mo" }
        ],
        agreements: [
            { type: "Tier-1 Brokerage Commission", valid: "2028-12-31" }
        ],
        rules: [
            { region: "PAN-INDIA", desc: "Network hospitals restricted strictly to Tier-1 listed providers for completely cashless claims." },
            { region: "STATE-MH", desc: "Preferred hospital referral network with verified cashless care pathways." }
        ]
    };

    const handleUpdateAgreement = (e) => {
        e.preventDefault();
        alert(`Backend API Called!\nPOST /api/company-master/${selectedCompany.id}/agreements\nPayload: { commissionRate: '${commissionRate}%' }`);
    };

    if (selectedCompany) {
        return (
            <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedCompany(null)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">{selectedCompany.name}</h2>
                            <p className="text-sm font-medium text-slate-500">Registry Code: {selectedCompany.code} • Master ID: {selectedCompany.id}</p>
                        </div>
                    </div>
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${selectedCompany.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {selectedCompany.status}
                    </span>
                </div>

                {/* Sub Navigation */}
                <div className="flex gap-4 border-b border-slate-200">
                    <button onClick={() => setActiveTab('profile')} className={`pb-3 px-4 font-bold text-sm transition ${activeTab === 'profile' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Company Profile</button>
                    <button onClick={() => setActiveTab('products')} className={`pb-3 px-4 font-bold text-sm transition ${activeTab === 'products' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Products & Plans Offered</button>
                    <button onClick={() => setActiveTab('agreements')} className={`pb-3 px-4 font-bold text-sm transition ${activeTab === 'agreements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Contracts & Agreements</button>
                    <button onClick={() => setActiveTab('rules')} className={`pb-3 px-4 font-bold text-sm transition ${activeTab === 'rules' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Network Coverage Rules</button>
                </div>

                <div className="py-2">
                    {/* View: Profile */}
                    {activeTab === 'profile' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                            <div className="card-premium p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Core Contact Information</h3>
                                <div className="space-y-4 text-sm">
                                    <div><span className="block text-slate-500 mb-1">Corporate Registration Number</span><span className="font-semibold text-slate-900">{selectedCompany.code}</span></div>
                                    <div><span className="block text-slate-500 mb-1">B2B Support Email</span><span className="font-semibold text-blue-600">{mockCompanyTarget.details.email}</span></div>
                                    <div><span className="block text-slate-500 mb-1">Dedicated APEX Phone Line</span><span className="font-semibold text-slate-900">{mockCompanyTarget.details.phone}</span></div>
                                </div>
                            </div>
                            <div className="card-premium p-6 bg-slate-800 text-white shadow-xl">
                                <h3 className="text-lg font-bold mb-4 border-b border-slate-600 pb-2">System Integrations</h3>
                                <div className="space-y-4 text-sm">
                                    <div className="flex justify-between items-center"><span className="text-slate-300">Quote Engine API</span><span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded font-bold">ONLINE</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-300">Claims Forwarding Gateway</span><span className="bg-green-500/20 text-green-300 px-2 py-0.5 rounded font-bold">ONLINE</span></div>
                                    <div className="flex justify-between items-center"><span className="text-slate-300">Document Verification Webhook</span><span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">DEGRADED</span></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View: Products / Plans */}
                    {activeTab === 'products' && (
                        <div className="card-premium p-6 animate-fade-in-up">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-slate-800">Licensed Products & Plans</h3>
                                <button className="px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition">Sync Product Catalog (+)</button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {mockCompanyTarget.products.map(p => (
                                    <div key={p.code} className="border border-slate-200 rounded-xl p-4 bg-slate-50 hover:shadow-md transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-slate-900 text-lg">{p.name}</p>
                                                <p className="text-xs font-semibold text-slate-500 mt-0.5">Product Code: {p.code}</p>
                                            </div>
                                            <span className="text-[10px] font-bold tracking-wider text-blue-700 bg-blue-100 px-2 py-1 rounded">{p.cat}</span>
                                        </div>
                                        <div className="mt-4 pt-3 border-t border-slate-200 flex justify-between items-center">
                                            <span className="text-sm font-bold text-slate-700">Base Premium Floor</span>
                                            <span className="font-extrabold text-slate-900">{p.premium}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* View: Agreements */}
                    {activeTab === 'agreements' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
                            <div className="card-premium p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">B2B Financial Agreements</h3>
                                <div className="space-y-4">
                                    {mockCompanyTarget.agreements.map((a, idx) => (
                                        <div key={idx} className="p-4 rounded-xl bg-blue-50 border border-blue-100">
                                            <p className="font-bold text-blue-900 mb-1">{a.type}</p>
                                            <p className="text-sm font-semibold text-blue-700 mb-3">Target Valid Until: {a.valid}</p>
                                            <p className="text-xs text-blue-800 font-medium">This carrier legally binds to payout logic mapping upon execution of policies via our portal.</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="card-premium p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b border-slate-100">Update Commission Matrix</h3>
                                <form onSubmit={handleUpdateAgreement} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Standard Cut Rate (%)</label>
                                        <input type="number" step="0.01" value={commissionRate} onChange={e => setCommissionRate(e.target.value)} className="input-premium w-full font-bold text-lg" required />
                                    </div>
                                    <p className="text-xs text-slate-500">Updating this field forces a backend pipeline sync adjusting accounting maps for all upcoming quotes natively generated against {selectedCompany.name}.</p>
                                    <button type="submit" className="w-full py-2 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:bg-black transition">Mutate Contract Rate</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {/* View: Network Rules */}
                    {activeTab === 'rules' && (
                        <div className="card-premium p-6 animate-fade-in-up">
                            <h3 className="text-lg font-bold text-slate-800 mb-6">Service Network Logical Rules</h3>
                            <div className="space-y-4">
                                {mockCompanyTarget.rules.map((r, idx) => (
                                    <div key={idx} className="flex gap-4 items-start p-4 border border-slate-200 rounded-xl bg-slate-50">
                                        <span className="shrink-0 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded truncate w-24 text-center">{r.region}</span>
                                        <p className="text-sm font-medium text-slate-700">{r.desc}</p>
                                    </div>
                                ))}
                                <button className="w-full py-3 mt-4 border-2 border-dashed border-slate-300 text-slate-500 font-bold rounded-xl hover:bg-slate-50 hover:text-slate-700 transition">
                                    + Add Geographical Routing Rule
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Default Master List
    return (
        <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Insurance Company Master</h1>
                    <p className="text-sm font-medium text-slate-500">Manage aggregate partner carriers, their configurations, and their active plans natively.</p>
                </div>
                <button className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition flex items-center gap-2">
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                    Onboard New Partner
                </button>
            </div>

            <div className="card-premium overflow-hidden">
                <table className="w-full text-left text-sm text-slate-600">
                    <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4">Integration ID</th>
                            <th className="px-6 py-4">Corporate Carrier Name</th>
                            <th className="px-6 py-4">IRDAI Registry Code</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {companies.map(c => (
                            <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                <td className="px-6 py-4 font-bold text-slate-900">{c.id}</td>
                                <td className="px-6 py-4 font-semibold text-slate-700">{c.name}</td>
                                <td className="px-6 py-4 text-slate-500 font-mono text-xs">{c.code}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded-sm text-xs font-bold ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{c.status}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <button onClick={() => setSelectedCompany(c)} className="px-4 py-1.5 bg-blue-50 text-blue-700 font-bold rounded hover:bg-blue-100 transition border border-blue-200">Configure Dashboard</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
