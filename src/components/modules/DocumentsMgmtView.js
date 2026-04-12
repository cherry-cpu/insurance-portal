import React, { useState } from 'react';

export default function DocumentsMgmtView() {
    const [activeTab, setActiveTab] = useState('list');
    const [selectedDoc, setSelectedDoc] = useState(null);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showESignModal, setShowESignModal] = useState(false);

    // Initial State Details
    const [uploadData, setUploadData] = useState({ title: '', documentType: 'KYC', relatedId: '' });
    const [esignatureName, setEsignatureName] = useState('');

    const [dummyDocs, setDummyDocs] = useState([
        { id: "DOC-8921", title: "Aadhar Card (User #112)", type: "KYC", relatedId: "USR-112", status: "Verified", date: "2026-04-10" },
        { id: "DOC-9912", title: "Hospital Bill Invoice", type: "CLAIM DOC", relatedId: "CLM-2093", status: "Pending Verification", date: "2026-04-09" },
        { id: "DOC-4421", title: "Final Policy Contract", type: "POLICY", relatedId: "POL-848291", status: "E-Sign Required", date: "2026-04-05" },
        { id: "DOC-1102", title: "Bank Statement", type: "KYC", relatedId: "USR-99", status: "Verified", date: "2026-03-20" },
    ]);

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        alert(`Backend API Called!\nPOST /api/documents/upload\nPayload: ${JSON.stringify(uploadData)}`);
        
        const newDoc = {
            id: `DOC-${Math.floor(Math.random() * 9000) + 1000}`,
            title: uploadData.title,
            type: uploadData.documentType,
            relatedId: uploadData.relatedId,
            status: uploadData.documentType === 'POLICY' ? 'E-Sign Required' : 'Pending Verification',
            date: "Today"
        };
        setDummyDocs([newDoc, ...dummyDocs]);
        setShowUploadModal(false);
        setUploadData({ title: '', documentType: 'KYC', relatedId: '' });
    };

    const handleESignSubmit = async (e) => {
        e.preventDefault();
        if (!esignatureName.trim()) return alert("Digital signature cannot be empty.");
        
        alert(`Backend API Called!\nPOST /api/documents/${selectedDoc.id}/esign\nSuccessfully signed as: ${esignatureName}`);
        
        const updatedDocs = dummyDocs.map(d => 
            d.id === selectedDoc.id ? { ...d, status: 'E-Signed & Sealed' } : d
        );
        setDummyDocs(updatedDocs);
        setSelectedDoc({...selectedDoc, status: 'E-Signed & Sealed'});
        setShowESignModal(false);
        setEsignatureName('');
    };

    if (selectedDoc) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedDoc(null)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">{selectedDoc.id}</h2>
                            <p className="text-sm font-medium text-slate-500">{selectedDoc.title}</p>
                        </div>
                    </div>
                    <div>
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-bold ${
                            selectedDoc.status.includes('Verified') || selectedDoc.status.includes('E-Signed') ? 'bg-green-100 text-green-700' :
                            selectedDoc.status.includes('Pending') ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                        }`}>
                            {selectedDoc.status}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Fake Document Viewer Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Document Metadata</h3>
                            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-sm mb-6">
                                <div><span className="text-slate-500 block mb-1">Upload Date</span><span className="font-semibold text-slate-900">{selectedDoc.date}</span></div>
                                <div><span className="text-slate-500 block mb-1">Category</span><span className="font-semibold text-slate-900">{selectedDoc.type}</span></div>
                                <div><span className="text-slate-500 block mb-1">Context Reference</span><span className="font-semibold text-blue-600">{selectedDoc.relatedId}</span></div>
                                <div><span className="text-slate-500 block mb-1">File Size</span><span className="font-semibold text-slate-900">4.2 MB (PDF)</span></div>
                            </div>
                            
                            <div className="bg-slate-100 h-96 rounded-2xl border-2 border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400">
                                <svg width="64" height="64" fill="none" stroke="currentColor" strokeWidth="1"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                                <p className="mt-4 font-semibold text-slate-500">Document Secure Viewer</p>
                                <p className="text-sm">Cannot preview encrypted blob locally.</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card-premium p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Operations</h3>
                            <div className="space-y-3">
                                {selectedDoc.status === 'E-Sign Required' && (
                                    <button onClick={() => setShowESignModal(true)} className="w-full text-center py-3 bg-blue-600 text-white shadow-xl shadow-blue-600/30 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2">
                                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                                        Execute E-Signature
                                    </button>
                                )}
                                <button className="w-full text-center py-2 bg-slate-50 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition border border-slate-200">Download Offline</button>
                                <button className="w-full text-center py-2 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 transition border border-red-200 mt-6">Revoke & Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* E-Sign Modal */}
                {showESignModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                            <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Electronic Signature Form</h2>
                            <p className="text-sm text-slate-600 mb-6">By signing mathematically below, you are issuing a cryptographically secure token legally binding you to contract <strong>{selectedDoc.relatedId}</strong>.</p>
                            
                            <form onSubmit={handleESignSubmit}>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Type Full Name Equivalent</label>
                                <input 
                                    type="text" 
                                    className="input-premium w-full text-lg shadow-sm" 
                                    placeholder="Jane Doe" 
                                    style={{ fontFamily: 'cursive' }} // Fun visual flare for sig
                                    value={esignatureName}
                                    onChange={(e) => setEsignatureName(e.target.value)}
                                    required
                                />
                                
                                <div className="mt-4 p-4 bg-slate-50 rounded-lg text-xs text-slate-500 font-mono">
                                    <p>IP ADDR: 192.168.1.1 (Tracked)</p>
                                    <p>TIMESTAMP: {new Date().toISOString()}</p>
                                </div>

                                <div className="flex gap-3 justify-end mt-6">
                                    <button type="button" onClick={() => setShowESignModal(false)} className="px-5 py-2 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200">Cancel</button>
                                    <button type="submit" className="px-5 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700">Accept and Sign</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Storage Used</p>
                    <p className="text-3xl font-extrabold text-blue-600 mt-1">4.2 TB</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">E-Sign Requests</p>
                    <p className="text-3xl font-extrabold text-amber-500 mt-1">29</p>
                </div>
                <div className="p-4 bg-blue-600 rounded-xl shadow-sm border border-blue-700 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition lg:col-span-2" onClick={() => setShowUploadModal(true)}>
                    <p className="text-lg font-bold text-white flex items-center gap-2">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/></svg>
                        Secure Document Upload
                    </p>
                </div>
            </div>

            <div className="card-premium p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">Secure Document Repository</h3>
                    <input type="text" placeholder="Search by ID or Policy..." className="input-premium py-2 text-sm max-w-xs" />
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-600 border-collapse">
                        <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                            <tr>
                                <th className="px-4 py-3 font-semibold">Doc ID</th>
                                <th className="px-4 py-3 font-semibold">Title</th>
                                <th className="px-4 py-3 font-semibold">Category</th>
                                <th className="px-4 py-3 font-semibold">Related ID</th>
                                <th className="px-4 py-3 font-semibold">Status</th>
                                <th className="px-4 py-3 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {dummyDocs.map(c => (
                                <tr key={c.id} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                    <td className="px-4 py-3 font-semibold text-blue-600 cursor-pointer hover:underline" onClick={() => setSelectedDoc(c)}>{c.id}</td>
                                    <td className="px-4 py-3 font-medium text-slate-900">{c.title}</td>
                                    <td className="px-4 py-3 font-semibold text-slate-500">{c.type}</td>
                                    <td className="px-4 py-3 text-slate-800">{c.relatedId}</td>
                                    <td className="px-4 py-3">
                                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                                            c.status.includes('Verified') || c.status.includes('E-Signed') ? 'bg-green-100 text-green-700' :
                                            c.status.includes('Pending') ? 'bg-amber-100 text-amber-700' :
                                            'bg-blue-100 text-blue-700'
                                        }`}>{c.status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <button onClick={() => setSelectedDoc(c)} className="text-white hover:bg-blue-700 bg-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm">Manage & View</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showUploadModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Upload Insurances Documents</h2>
                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Document Title</label>
                                <input required type="text" value={uploadData.title} onChange={e => setUploadData({...uploadData, title: e.target.value})} className="input-premium w-full" placeholder="e.g. Aadhar card Front" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Document Category</label>
                                <select value={uploadData.documentType} onChange={e => setUploadData({...uploadData, documentType: e.target.value})} className="input-premium w-full">
                                    <option value="KYC">KYC Identity Proof</option>
                                    <option value="POLICY">Policy Details & Contracts</option>
                                    <option value="CLAIM DOC">Claim Proofs / Hospital Receipts</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Context Assigment (ID)</label>
                                <input required type="text" value={uploadData.relatedId} onChange={e => setUploadData({...uploadData, relatedId: e.target.value})} className="input-premium w-full" placeholder="e.g. POL-8219 or CLM-9912" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Actual File Attachment</label>
                                <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 cursor-pointer">
                                    <p className="text-sm text-slate-500 font-medium">Click to select PDF or image</p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end mt-4">
                                <button type="button" onClick={() => setShowUploadModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700">Submit Upload</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
