import React, { useState } from 'react';

export default function ClaimsMgmtView() {
    const [activeTab, setActiveTab] = useState('list');
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);
    const [showSettleModal, setShowSettleModal] = useState(false);

    // Dummy Claims Data
    const dummyClaims = [
        { id: "CLM-2093", policyId: "POL-829103", customer: "John Doe", amount: "$4,200", status: "In Review", date: "2026-04-10" },
        { id: "CLM-9913", policyId: "POL-119284", customer: "Emily White", amount: "$850", status: "Approved", date: "2026-04-09" },
        { id: "CLM-5421", policyId: "POL-848291", customer: "Michael Chen", amount: "$12,400", status: "Pending Docs", date: "2026-04-05" },
        { id: "CLM-1102", policyId: "POL-482011", customer: "Sarah Smith", amount: "$2,100", status: "Settled", date: "2026-03-20" },
    ];

    const registerClaim = async (e) => {
        e.preventDefault();
        alert("Backend API Called!\nClaim successfully registered via POST /api/claims");
        setShowRegisterForm(false);
    };

    const uploadDocument = async () => {
        alert(`Backend API Called!\nDocument successfully uploaded and verified via POST /api/claims/${selectedClaim.id}/documents`);
        setSelectedClaim({...selectedClaim, status: 'In Review'});
        setShowDocumentUpload(false);
    };

    const settleClaim = async () => {
        alert(`Backend API Called!\nSettlement of ${selectedClaim.amount} successfully processed via POST /api/claims/${selectedClaim.id}/settle`);
        setSelectedClaim({...selectedClaim, status: 'Settled'});
        setShowSettleModal(false);
    };

    // Detail View Layout
    if (selectedClaim) {
        return (
            <div className="space-y-6 animate-fade-in">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedClaim(null)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">{selectedClaim.id}</h2>
                            <p className="text-sm font-medium text-slate-500">Related Policy: {selectedClaim.policyId}</p>
                        </div>
                    </div>
                    <div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${
                            selectedClaim.status === 'Settled' ? 'bg-green-100 text-green-700' :
                            selectedClaim.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                            selectedClaim.status === 'Pending Docs' ? 'bg-amber-100 text-amber-700' :
                            'bg-slate-100 text-slate-700'
                        }`}>
                            {selectedClaim.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Claim Overview</h3>
                            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div><span className="text-slate-500 block mb-1">Claimant Name</span><span className="font-semibold text-slate-900">{selectedClaim.customer}</span></div>
                                <div><span className="text-slate-500 block mb-1">Filing Date</span><span className="font-semibold text-slate-900">{selectedClaim.date}</span></div>
                                <div><span className="text-slate-500 block mb-1">Claim Amount</span><span className="font-extrabold text-red-600">{selectedClaim.amount}</span></div>
                                <div><span className="text-slate-500 block mb-1">Assigned Adjuster</span><span className="font-semibold text-slate-900">David G. (Internal)</span></div>
                            </div>
                        </div>

                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Status Tracker</h3>
                            <div className="space-y-4 pl-2">
                                <div className="flex gap-4 items-start relative before:absolute before:left-2 before:top-6 before:bottom-0 before:block before:w-[2px] before:bg-slate-100">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 relative z-10 shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Claim Registered</p>
                                        <p className="text-xs text-slate-500">{selectedClaim.date} via Customer Portal</p>
                                    </div>
                                </div>
                                <div className={`flex gap-4 items-start relative before:absolute before:left-2 before:top-6 before:bottom-0 before:block before:w-[2px] before:bg-slate-100 last:before:hidden`}>
                                    <div className={`w-4 h-4 rounded-full ${selectedClaim.status === 'Pending Docs' ? 'bg-amber-400' : 'bg-blue-500'} relative z-10 shrink-0 mt-1`}></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Document Verification</p>
                                        <p className="text-xs text-slate-500">
                                            {selectedClaim.status === 'Pending Docs' ? 'Awaiting hospital bills...' : 'Documents verified and approved.'}
                                        </p>
                                    </div>
                                </div>
                                {(selectedClaim.status === 'Approved' || selectedClaim.status === 'Settled') && (
                                    <div className={`flex gap-4 items-start relative last:before:hidden`}>
                                        <div className={`w-4 h-4 rounded-full ${selectedClaim.status === 'Settled' ? 'bg-green-500' : 'bg-slate-300'} relative z-10 shrink-0 mt-1`}></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">Settlement Execution</p>
                                            <p className="text-xs text-slate-500">{selectedClaim.status === 'Settled' ? `Funds disbursed to ${selectedClaim.customer}` : 'Awaiting finance approval'}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel Actions */}
                    <div className="space-y-6">
                        <div className="card-premium p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Workflow Actions</h3>
                            <div className="space-y-3">
                                <button onClick={() => setShowDocumentUpload(true)} className="w-full text-center py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition border border-blue-200">Upload & Verify Docs</button>
                                <button className="w-full text-center py-2 bg-amber-50 text-amber-700 rounded-xl font-semibold hover:bg-amber-100 transition border border-amber-200">Request More Info</button>
                                <button onClick={() => setShowSettleModal(true)} disabled={selectedClaim.status === 'Settled' || selectedClaim.status === 'Pending Docs'} className="w-full text-center py-2 bg-green-50 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition border border-green-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">Execute Settlement</button>
                                <button className="w-full text-center py-2 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 transition border border-red-200">Reject Claim</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modals */}
                {showDocumentUpload && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Upload Documents</h2>
                            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 cursor-pointer mb-6">
                                <p className="text-sm text-slate-500 font-medium">Click to select files (PDF, JPG)</p>
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                                <button onClick={() => setShowDocumentUpload(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                                <button onClick={uploadDocument} className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Verify & Save</button>
                            </div>
                        </div>
                    </div>
                )}

                {showSettleModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4">Confirm Settlement</h2>
                            <p className="text-sm text-slate-600 mb-4">You are about to transfer <strong>{selectedClaim.amount}</strong> to the claimant's registered bank account. This action cannot be reversed.</p>
                            <div className="flex gap-3 justify-end mt-4">
                                <button onClick={() => setShowSettleModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                                <button onClick={settleClaim} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700">Confirm Transfer</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default List View
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Total Claims</p>
                    <p className="text-3xl font-extrabold text-blue-600 mt-1">8,392</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Pending Docs</p>
                    <p className="text-3xl font-extrabold text-amber-500 mt-1">412</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Settled Today</p>
                    <p className="text-3xl font-extrabold text-green-500 mt-1">89</p>
                </div>
                <div className="p-4 bg-blue-600 rounded-xl shadow-sm border border-blue-700 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition" onClick={() => setShowRegisterForm(true)}>
                    <p className="text-lg font-bold text-white flex items-center gap-2">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        Register Claim
                    </p>
                </div>
            </div>

            <div className="card-premium p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Active Claims Database</h3>
                    <input type="text" placeholder="Search Claims..." className="input-premium py-2 text-sm max-w-xs" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Claim ID</th>
                                <th className="px-4 py-3 font-semibold">Policy ID</th>
                                <th className="px-4 py-3 font-semibold">Claimant</th>
                                <th className="px-4 py-3 font-semibold">Amount</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyClaims.map(c => (
                                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="px-4 py-3 font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedClaim(c)}>{c.id}</td>
                                    <td className="px-4 py-3">{c.policyId}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{c.customer}</td>
                                    <td className="px-4 py-3 text-slate-800 font-semibold">{c.amount}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                                            c.status === 'Settled' ? 'bg-green-100 text-green-700' :
                                            c.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                                            c.status === 'Pending Docs' ? 'bg-amber-100 text-amber-700' :
                                            'bg-slate-100 text-slate-700'
                                        }`}>{c.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => setSelectedClaim(c)} className="text-white hover:bg-blue-700 bg-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm">Manage & View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showRegisterForm && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Register New Claim</h2>
                        <form onSubmit={registerClaim} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Policy Contract ID</label>
                                <input required type="text" className="input-premium w-full" placeholder="e.g. POL-8219" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Estimated Claim Amount ($)</label>
                                <input required type="number" className="input-premium w-full" placeholder="0.00" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Incident Description</label>
                                <textarea required className="input-premium w-full" rows="3" placeholder="Provide details..."></textarea>
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                                <button type="button" onClick={() => setShowRegisterForm(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Submit Registration</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
