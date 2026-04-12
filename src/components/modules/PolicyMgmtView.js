import React, { useState } from 'react';

export default function PolicyMgmtView() {
    const [activeTab, setActiveTab] = useState('list');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    
    // Aadhar Form State
    const [createData, setCreateData] = useState({ name: '', dob: '', aadhar: '' });
    const [isAadharVerified, setIsAadharVerified] = useState(false);

    const dummyPolicies = [
        { id: "POL-829103", customer: "John Doe", type: "Health Premium", premium: "$120/mo", status: "Active", date: "2026-03-12" },
        { id: "POL-482011", customer: "Sarah Smith", type: "Life Term", premium: "$45/mo", status: "Pending", date: "2026-04-10" },
        { id: "POL-992019", customer: "Michael Chen", type: "Family Floater", premium: "$210/mo", status: "Lapsed", date: "2025-11-05" },
        { id: "POL-550192", customer: "Emma Wilson", type: "Critical Illness", premium: "$80/mo", status: "Active", date: "2026-01-20" },
    ];

    const handleGenerateCertificate = async () => {
        try {
            // Simulated backend call 
            // const res = await fetch(`http://localhost:8080/api/policies/${selectedPolicy.id}/certificate`);
            alert(`Backend API Called! \nE-Certificate successfully generated for ${selectedPolicy.id}.\nIt has been sent to ${selectedPolicy.customer}.`);
        } catch(e) {
            console.error(e);
        }
    };

    const submitCancelPolicy = async () => {
        if (!cancelReason.trim()) return alert("Please provide a reason for cancellation.");
        try {
            // Simulated backend call mapping to the new Spring Boot endpoint
            // await fetch(`http://localhost:8080/api/policies/${selectedPolicy.id}/cancel`, { method: 'POST', body: JSON.stringify({ reason: cancelReason }) });
            
            alert(`Backend API Called! \nPolicy ${selectedPolicy.id} has been CANCELLED.\nReason logged: ${cancelReason}`);
            setSelectedPolicy({...selectedPolicy, status: 'CANCELLED'});
            setShowCancelModal(false);
            setCancelReason('');
        } catch(e) {
            console.error(e);
        }
    };

    const handleVerifyAadhar = async () => {
        if (createData.aadhar.length !== 12) return alert("Aadhar must be exactly 12 digits.");
        // Simulated Backend Fetch replacing /api/policies/verify-aadhar
        alert("Backend API Called!\nPOST /api/policies/verify-aadhar\nStatus: 200 OK");
        
        setIsAadharVerified(true);
        setCreateData(prev => ({ ...prev, name: "Jane Doe", dob: "1990-05-15" }));
    };

    if (selectedPolicy) {
        return (
            <div className="space-y-6 animate-fade-in">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedPolicy(null)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">{selectedPolicy.id}</h2>
                            <p className="text-sm font-medium text-slate-500">Contract Owner: {selectedPolicy.customer}</p>
                        </div>
                    </div>
                    <div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${
                            selectedPolicy.status === 'Active' ? 'bg-green-100 text-green-700' :
                            selectedPolicy.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                        }`}>
                            {selectedPolicy.status}
                        </span>
                    </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel: Info Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Coverage Summary</h3>
                            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div><span className="text-slate-500 block mb-1">Product Type</span><span className="font-semibold text-slate-900">{selectedPolicy.type}</span></div>
                                <div><span className="text-slate-500 block mb-1">Inception Date</span><span className="font-semibold text-slate-900">{selectedPolicy.date}</span></div>
                                <div><span className="text-slate-500 block mb-1">Premium Rate</span><span className="font-semibold text-blue-600">{selectedPolicy.premium}</span></div>
                                <div><span className="text-slate-500 block mb-1">Next Payment Due</span><span className="font-semibold text-amber-600">2026-05-15</span></div>
                                <div><span className="text-slate-500 block mb-1">Nominee Name</span><span className="font-semibold text-slate-900">Jane {selectedPolicy.customer.split(' ')[1] || 'Relative'}</span></div>
                                <div><span className="text-slate-500 block mb-1">Sum Insured</span><span className="font-semibold text-slate-900">$250,000</span></div>
                            </div>
                        </div>

                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Recent Timeline</h3>
                            <div className="space-y-4 pl-2">
                                <div className="flex gap-4 items-start relative before:absolute before:left-2 before:top-6 before:bottom-0 before:block before:w-[2px] before:bg-slate-100">
                                    <div className="w-4 h-4 rounded-full bg-blue-500 relative z-10 shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Policy Document Generated</p>
                                        <p className="text-xs text-slate-500">Today, 09:12 AM by Auto-System</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start relative before:absolute before:left-2 before:top-6 before:bottom-0 before:block before:w-[2px] before:bg-slate-100 last:before:hidden">
                                    <div className="w-4 h-4 rounded-full bg-slate-300 relative z-10 shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">First Premium Payment Success</p>
                                        <p className="text-xs text-slate-500">Yesterday, 14:02 PM via Credit Card</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 items-start relative last:before:hidden">
                                    <div className="w-4 h-4 rounded-full bg-slate-300 relative z-10 shrink-0 mt-1"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-800">Digital KYC Verified</p>
                                        <p className="text-xs text-slate-500">{selectedPolicy.date} by Compliance Dept</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Actions */}
                    <div className="space-y-6">
                        <div className="card-premium p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Contract Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full text-center py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition border border-blue-200">Edit Details</button>
                                <button className="w-full text-center py-2 bg-green-50 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition border border-green-200">Process Renewal</button>
                                <button onClick={handleGenerateCertificate} className="w-full text-center py-2 bg-slate-50 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition border border-slate-200">Generate E-Certificate</button>
                                <button onClick={() => setShowCancelModal(true)} disabled={selectedPolicy.status === 'CANCELLED'} className="w-full text-center py-2 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 transition border border-red-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">Cancel / Lapsation</button>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-xl">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                Priority Flags
                            </h3>
                            <p className="text-sm text-slate-300 opacity-90 mb-4">Ensure beneficiary declarations are re-verified by {selectedPolicy.date} to comply with IRDAI standards.</p>
                            <button className="text-slate-900 bg-white px-4 py-2 text-sm font-bold rounded-lg w-full hover:bg-slate-200 transition">View Compliance Task</button>
                        </div>
                    </div>
                </div>

                {/* Cancel Modal */}
                {showCancelModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-red-50">
                                <h2 className="text-xl font-bold text-red-700">Cancel Policy {selectedPolicy.id}</h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <p className="text-sm text-slate-600">You are about to submit a permanent cancellation / lapsation request for this policy. Please provide the reason below (compliance requirement).</p>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Reason for Cancellation</label>
                                    <textarea 
                                        value={cancelReason}
                                        onChange={e => setCancelReason(e.target.value)}
                                        className="input-premium w-full" 
                                        rows="3" 
                                        placeholder="e.g. Customer requested via phone, Premium unpaid for 90 days..."
                                    ></textarea>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button onClick={() => { setShowCancelModal(false); setCancelReason(''); }} className="px-5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition">Go Back</button>
                                <button onClick={submitCancelPolicy} className="px-5 py-2 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 transition">Confirm Cancellation</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Module Context */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Total Policies</p>
                    <p className="text-3xl font-extrabold text-blue-600 mt-1">14,291</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Active Policies</p>
                    <p className="text-3xl font-extrabold text-green-500 mt-1">11,042</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Pending Review</p>
                    <p className="text-3xl font-extrabold text-amber-500 mt-1">34</p>
                </div>
                <div className="p-4 bg-blue-600 rounded-xl shadow-sm border border-blue-700 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition" onClick={() => setShowCreateForm(true)}>
                    <p className="text-lg font-bold text-white flex items-center gap-2">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        Create Policy
                    </p>
                </div>
            </div>

            {/* Quick Actions & Tabs */}
            <div className="card-premium p-6">
                <div className="flex border-b border-slate-200 mb-6">
                    <button 
                        className={`pb-3 px-4 font-semibold text-sm ${activeTab === 'list' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('list')}
                    >
                        Policy Master List
                    </button>
                    <button 
                        className={`pb-3 px-4 font-semibold text-sm ${activeTab === 'renewals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('renewals')}
                    >
                        Upcoming Renewals
                    </button>
                    <button 
                        className={`pb-3 px-4 font-semibold text-sm ${activeTab === 'audit' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                        onClick={() => setActiveTab('audit')}
                    >
                        Audit / Endorsements
                    </button>
                </div>

                {activeTab === 'list' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <input type="text" placeholder="Search by ID or Customer..." className="input-premium py-2 max-w-sm text-sm" />
                            <button className="text-sm px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50">Filter</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 rounded-tl-lg">Policy ID</th>
                                        <th className="px-4 py-3">Customer</th>
                                        <th className="px-4 py-3">Coverage Type</th>
                                        <th className="px-4 py-3">Premium</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 rounded-tr-lg">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dummyPolicies.map(p => (
                                        <tr key={p.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                                            <td className="px-4 py-3 font-semibold text-blue-600 cursor-pointer hover:underline">{p.id}</td>
                                            <td className="px-4 py-3 font-medium text-slate-900">{p.customer}</td>
                                            <td className="px-4 py-3">{p.type}</td>
                                            <td className="px-4 py-3 font-medium">{p.premium}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                                                    p.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    p.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => setSelectedPolicy(p)} className="text-white hover:bg-blue-700 bg-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm">Manage & View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab === 'renewals' && (
                    <div className="py-8 text-center text-slate-500">
                        <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <p>No upcoming renewals within the next 7 days.</p>
                    </div>
                )}

                {activeTab === 'audit' && (
                    <div className="py-8 text-center text-slate-500">
                        <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        <p>Audit trail records will appear here.</p>
                    </div>
                )}
            </div>

            {/* Modal for Creating Policy */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Create New Policy</h2>
                            <button onClick={() => setShowCreateForm(false)} className="text-slate-400 hover:text-slate-600">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Aadhar Block */}
                            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                <label className="block text-sm font-bold text-slate-800 mb-2">UIDAI Aadhar Authentication</label>
                                <div className="flex gap-3">
                                    <input 
                                        type="password" 
                                        maxLength="12"
                                        value={createData.aadhar}
                                        onChange={(e) => setCreateData({ ...createData, aadhar: e.target.value.replace(/\D/g, '') })}
                                        className="input-premium flex-1 font-mono tracking-widest text-lg" 
                                        placeholder="Enter 12-Digit Aadhar (Auto-Masked)" 
                                        disabled={isAadharVerified}
                                    />
                                    <button 
                                        type="button" 
                                        onClick={handleVerifyAadhar}
                                        disabled={isAadharVerified || createData.aadhar.length !== 12}
                                        className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isAadharVerified ? (
                                            <><svg width="20" height="20" fill="none" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7"/></svg> Verified</>
                                        ) : 'Authenticate'}
                                    </button>
                                </div>
                                {!isAadharVerified && <p className="text-xs text-slate-500 mt-2">Entering Aadhar will securely fetch KYC and auto-fill demographic details.</p>}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Customer Full Name (via KYC)</label>
                                    <input type="text" value={createData.name} onChange={e => setCreateData({...createData, name: e.target.value})} className="input-premium w-full" placeholder="e.g. John Doe" disabled={isAadharVerified} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth (via KYC)</label>
                                    <input type="date" value={createData.dob} onChange={e => setCreateData({...createData, dob: e.target.value})} className="input-premium w-full" disabled={isAadharVerified} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Coverage Type</label>
                                    <select className="input-premium w-full">
                                        <option>Health Premium</option>
                                        <option>Family Floater</option>
                                        <option>Life Term</option>
                                        <option>Critical Illness</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Initial Premium Quote</label>
                                    <input type="text" className="input-premium w-full" placeholder="$0.00" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Beneficiary Information</label>
                                <input type="text" className="input-premium w-full mb-2" placeholder="Beneficiary Name" />
                                <input type="text" className="input-premium w-full" placeholder="Relationship to Insured" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Attachments / Documents</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                                    <p className="text-sm text-slate-500 font-medium">Click to upload KYC and Proposal forms</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setShowCreateForm(false)} className="px-5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
                            <button onClick={() => setShowCreateForm(false)} className="btn-primary">Generate Policy</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
