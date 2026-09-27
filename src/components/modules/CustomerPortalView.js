import React, { useState } from 'react';

export default function CustomerPortalView() {
    const [activeTab, setActiveTab] = useState('overview');
    const [showChangeRequest, setShowChangeRequest] = useState(false);
    
    // Change Request Form State
    const [requestData, setRequestData] = useState({ policyId: 'POL-99210', changeType: 'ADDRESS_CHANGE', details: '' });

    // Customer specific mock data
    const myPolicies = [
        { id: "POL-99210", product: "Comprehensive Health", premium: "$120/mo", nextDueDate: "2026-05-15", status: "Active" }
    ];

    const myClaims = [
        { id: "CLM-88219", policyId: "POL-99210", amountRequested: "$4,200", status: "In Review", submittedOn: "2026-04-10" }
    ];

    const myDocuments = [
        { id: "DOC-9912A", title: "Health Policy Certificate (POL-99210)", type: "E-CERT", date: "2026-01-15" },
        { id: "DOC-112XZ", title: "Premium Tax Receipt (2025)", type: "TAX_STATEMENT", date: "2026-02-01" },
    ];

    const handleDownloadDocument = (doc) => {
        alert(`Backend API Called!\nGET /api/portal/documents/${doc.id}/download\nSecure E-Signed fetch executed locally.`);
        // Simulate a physical download behavior in the browser natively
        console.log(`Downloading token packet: https://cdn.ratantatai.com/secure/${doc.id}?token=securexyz123`);
    };

    const handleSubmitChange = (e) => {
        e.preventDefault();
        alert(`Backend API Called!\nPOST /api/portal/requests\nSubmitting ${requestData.changeType} against ${requestData.policyId}.`);
        setShowChangeRequest(false);
        setRequestData({ ...requestData, details: '' });
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            
            {/* Customer Welcome Header */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                <div className="absolute -right-20 -top-20 opacity-10">
                    <svg width="300" height="300" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                </div>
                <div className="relative z-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-extrabold mb-1">Welcome back, Jane Doe.</h1>
                        <p className="text-slate-300 font-medium tracking-wide">Customer ID: USR-10293 • Self-Service Portal Profile</p>
                    </div>
                    <div className="text-right hidden md:block">
                        <button onClick={() => setShowChangeRequest(true)} className="bg-white text-slate-900 font-bold px-6 py-3 rounded-xl shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                            Request Policy Change
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Primary Content Board */}
                <div className="lg:col-span-2 space-y-6">
                    {/* My Policies Array */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            My Active Policies
                        </h3>
                        <div className="grid gap-4">
                            {myPolicies.map(pol => (
                                <div key={pol.id} className="border border-slate-200 rounded-2xl p-4 flex justify-between items-center hover:shadow-md transition bg-gradient-to-br from-white to-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                                            POL
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg">{pol.product}</p>
                                            <p className="text-sm text-slate-500 font-medium">{pol.id} • Next Payment: <span className="text-amber-600 font-bold">{pol.nextDueDate}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-extrabold text-slate-800">{pol.premium}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">ACTIVE</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Claims History */}
                    <div className="card-premium p-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex items-center gap-2">
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                            Active Claims
                        </h3>
                        {myClaims.length === 0 ? (
                            <p className="text-slate-500 py-4">You have no active or historical claims.</p>
                        ) : (
                            <div className="grid gap-4">
                                {myClaims.map(claim => (
                                    <div key={claim.id} className="border-l-4 border-amber-500 bg-slate-50 rounded-r-2xl p-4 flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-slate-900">Claim Incident {claim.id}</p>
                                            <p className="text-sm text-slate-500 mt-1">Submitted on {claim.submittedOn} against {claim.policyId}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-extrabold text-slate-800">{claim.amountRequested}</p>
                                            <p className="text-sm font-bold text-amber-600 animate-pulse">{claim.status}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Document Stash & Support */}
                <div className="space-y-6">
                    <div className="card-premium p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                            Document Vault
                        </h3>
                        <div className="space-y-3">
                            {myDocuments.map(doc => (
                                <div key={doc.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-blue-300 transition group flex justify-between items-center cursor-pointer" onClick={() => handleDownloadDocument(doc)}>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                                            <svg width="14" height="14" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-800 line-clamp-1">{doc.title}</p>
                                            <p className="text-[10px] text-slate-500 font-semibold">{doc.date}</p>
                                        </div>
                                    </div>
                                    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400 group-hover:text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl">
                        <h3 className="font-bold text-lg mb-2">Need Immediate Support?</h3>
                        <p className="text-sm text-blue-100 mb-6">Our agents are standing by to assist you structurally with changes or queries.</p>
                        <button className="w-full py-2 bg-white text-indigo-700 font-bold rounded-xl shadow-lg hover:bg-slate-50 transition">Launch Live Chat</button>
                    </div>
                </div>
            </div>

            {/* Change Request Modal */}
            {showChangeRequest && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Request Policy Alteration</h2>
                        <form onSubmit={handleSubmitChange} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Target Policy</label>
                                <select 
                                    value={requestData.policyId} 
                                    onChange={e => setRequestData({...requestData, policyId: e.target.value})} 
                                    className="input-premium w-full text-slate-900 font-medium"
                                >
                                    {myPolicies.map(p => <option key={p.id} value={p.id}>{p.product} ({p.id})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Category of Change</label>
                                <select 
                                    value={requestData.changeType} 
                                    onChange={e => setRequestData({...requestData, changeType: e.target.value})} 
                                    className="input-premium w-full text-slate-900 font-medium"
                                >
                                    <option value="ADDRESS_CHANGE">Update Residential Address</option>
                                    <option value="NOMINEE_UPDATE">Change Beneficiary / Nominee</option>
                                    <option value="COVERAGE_INCREASE">Request Coverage Increase</option>
                                    <option value="BANK_DETAILS">Update Bank / Mandate Info</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Description / Details</label>
                                <textarea 
                                    required 
                                    className="input-premium w-full text-sm py-3" 
                                    rows="4" 
                                    placeholder="Please explicitly provide the new details required for the endorsement..."
                                    value={requestData.details}
                                    onChange={e => setRequestData({...requestData, details: e.target.value})}
                                ></textarea>
                            </div>
                            <div className="flex gap-3 justify-end mt-4 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowChangeRequest(false)} className="px-5 py-2 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200">Cancel</button>
                                <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 flex items-center gap-2">
                                    Submit Request
                                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
