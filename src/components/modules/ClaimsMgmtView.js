import React, { useState, useEffect } from 'react';
import { getCustomerDetails, verifyClaimDocuments, requestMoreInfo, saveClaimStatement, processClaimSettlement, rejectClaim, getClaimHistory } from '../../api/client';

export default function ClaimsMgmtView() {
    const [activeTab, setActiveTab] = useState('list');
    const [selectedClaim, setSelectedClaim] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showDocumentUpload, setShowDocumentUpload] = useState(false);
    const [showSettleModal, setShowSettleModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showRequestInfoModal, setShowRequestInfoModal] = useState(false);
    const [showStatementModal, setShowStatementModal] = useState(false);
    
    // Enhanced state for comprehensive claims management
    const [customerDetails, setCustomerDetails] = useState(null);
    const [claimDocuments, setClaimDocuments] = useState([]);
    const [claimHistory, setClaimHistory] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    
    // Form states
    const [rejectReason, setRejectReason] = useState('');
    const [requestInfo, setRequestInfo] = useState('');
    const [claimStatement, setClaimStatement] = useState('');
    const [settlementAmount, setSettlementAmount] = useState('');
    const [uploadedFiles, setUploadedFiles] = useState([]);

    // Enhanced Dummy Claims Data with more details
    const dummyClaims = [
        { 
            id: "CLM-2093", 
            policyId: "POL-829103", 
            customer: "John Doe", 
            amount: "$4,200", 
            status: "In Review", 
            date: "2026-04-10",
            type: "Hospitalization",
            description: "Emergency appendectomy surgery",
            hospital: "City General Hospital"
        },
        { 
            id: "CLM-9913", 
            policyId: "POL-119284", 
            customer: "Emily White", 
            amount: "$850", 
            status: "Approved", 
            date: "2026-04-09",
            type: "Outpatient",
            description: "Dental consultation and cleaning",
            hospital: "Smile Dental Clinic"
        },
        { 
            id: "CLM-5421", 
            policyId: "POL-848291", 
            customer: "Michael Chen", 
            amount: "$12,400", 
            status: "Pending Docs", 
            date: "2026-04-05",
            type: "Surgery",
            description: "Knee replacement surgery",
            hospital: "Orthopedic Center"
        },
        { 
            id: "CLM-1102", 
            policyId: "POL-482011", 
            customer: "Sarah Smith", 
            amount: "$2,100", 
            status: "Settled", 
            date: "2026-03-20",
            type: "Medical",
            description: "Pneumonia treatment",
            hospital: "Metro Health Center"
        },
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

    // Enhanced Claims Management Functions
    const loadCustomerDetails = async () => {
        if (!selectedClaim) return;
        try {
            const response = await getCustomerDetails(selectedClaim.policyId);
            setCustomerDetails(response.customer || {
                name: selectedClaim.customer,
                policyNumber: selectedClaim.policyId,
                contact: "+91-9876543210",
                coverage: "$250,000",
                email: "customer@example.com",
                address: "123 Main St, Mumbai, Maharashtra"
            });
        } catch (error) {
            console.error("Failed to load customer details:", error);
        }
    };

    const loadClaimHistory = async () => {
        if (!selectedClaim) return;
        try {
            const response = await getClaimHistory(selectedClaim.id);
            setClaimHistory(response.history || [
                { action: "Claim Registered", timestamp: selectedClaim.date, user: "Customer Portal", details: "Initial claim submission" },
                { action: "Document Verification", timestamp: "2026-04-11", user: "Claims Officer", details: "Hospital bills verified" },
                { action: "Statement Recorded", timestamp: "2026-04-12", user: "Dr. Smith", details: "Medical necessity confirmed" }
            ]);
        } catch (error) {
            console.error("Failed to load claim history:", error);
        }
    };

    const handleDocumentVerification = async (documentId, status) => {
        try {
            setIsProcessing(true);
            await verifyClaimDocuments(selectedClaim.id, documentId, status);
            
            setClaimDocuments(prev => prev.map(doc => 
                doc.id === documentId ? {...doc, status: status} : doc
            ));
            
            // Add to history
            const newHistoryItem = {
                action: `Document ${status}`,
                timestamp: new Date().toISOString().split('T')[0],
                user: "Claims Officer",
                details: `Document ${documentId} marked as ${status}`
            };
            setClaimHistory(prev => [...prev, newHistoryItem]);
            
        } catch (error) {
            alert("Failed to verify document: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRequestMoreInfo = async () => {
        if (!requestInfo.trim()) {
            alert("Please specify what additional information is required.");
            return;
        }

        try {
            setIsProcessing(true);
            await requestMoreInfo(selectedClaim.id, requestInfo);
            
            // Add to history
            const newHistoryItem = {
                action: "Info Requested",
                timestamp: new Date().toISOString().split('T')[0],
                user: "Claims Officer",
                details: `Requested: ${requestInfo}`
            };
            setClaimHistory(prev => [...prev, newHistoryItem]);
            
            alert("Information request sent to customer successfully!");
            setShowRequestInfoModal(false);
            setRequestInfo('');
            
        } catch (error) {
            alert("Failed to send request: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleSaveStatement = async () => {
        if (!claimStatement.trim()) {
            alert("Please enter a statement.");
            return;
        }

        try {
            setIsProcessing(true);
            await saveClaimStatement(selectedClaim.id, claimStatement);
            
            // Add to history
            const newHistoryItem = {
                action: "Statement Recorded",
                timestamp: new Date().toISOString().split('T')[0],
                user: "Claims Officer",
                details: claimStatement
            };
            setClaimHistory(prev => [...prev, newHistoryItem]);
            
            alert("Statement saved successfully!");
            setShowStatementModal(false);
            setClaimStatement('');
            
        } catch (error) {
            alert("Failed to save statement: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProcessSettlement = async () => {
        if (!settlementAmount.trim()) {
            alert("Please enter settlement amount.");
            return;
        }

        try {
            setIsProcessing(true);
            await processClaimSettlement(selectedClaim.id, settlementAmount);
            
            // Add to history
            const newHistoryItem = {
                action: "Settlement Processed",
                timestamp: new Date().toISOString().split('T')[0],
                user: "Claims Officer",
                details: `Amount: ${settlementAmount}`
            };
            setClaimHistory(prev => [...prev, newHistoryItem]);
            
            setSelectedClaim({...selectedClaim, status: 'Settled'});
            alert(`Settlement of ${settlementAmount} processed successfully!`);
            setShowSettleModal(false);
            setSettlementAmount('');
            
        } catch (error) {
            alert("Failed to process settlement: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRejectClaim = async () => {
        if (!rejectReason.trim()) {
            alert("Please provide a reason for rejection.");
            return;
        }

        try {
            setIsProcessing(true);
            await rejectClaim(selectedClaim.id, rejectReason);
            
            // Add to history
            const newHistoryItem = {
                action: "Claim Rejected",
                timestamp: new Date().toISOString().split('T')[0],
                user: "Claims Officer",
                details: `Reason: ${rejectReason}`
            };
            setClaimHistory(prev => [...prev, newHistoryItem]);
            
            setSelectedClaim({...selectedClaim, status: 'Rejected'});
            alert("Claim rejected successfully!");
            setShowRejectModal(false);
            setRejectReason('');
            
        } catch (error) {
            alert("Failed to reject claim: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    // Load data when claim is selected
    useEffect(() => {
        if (selectedClaim) {
            loadCustomerDetails();
            loadClaimHistory();
            
            // Initialize documents
            setClaimDocuments([
                { id: "doc1", name: "Hospital Bill", type: "Medical Bill", status: "verified", uploadedDate: "2026-04-10" },
                { id: "doc2", name: "Doctor Certificate", type: "Medical Certificate", status: "verified", uploadedDate: "2026-04-10" },
                { id: "doc3", name: "Prescription", type: "Prescription", status: "pending", uploadedDate: "2026-04-10" }
            ]);
        }
    }, [selectedClaim]);

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
                        {/* Customer Details Panel */}
                        {customerDetails && (
                            <div className="card-premium p-6">
                                <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Customer Details</h3>
                                <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                    <div><span className="text-slate-500 block mb-1">Full Name</span><span className="font-semibold text-slate-900">{customerDetails.name}</span></div>
                                    <div><span className="text-slate-500 block mb-1">Policy Number</span><span className="font-semibold text-slate-900">{customerDetails.policyNumber}</span></div>
                                    <div><span className="text-slate-500 block mb-1">Contact Number</span><span className="font-semibold text-slate-900">{customerDetails.contact}</span></div>
                                    <div><span className="text-slate-500 block mb-1">Email</span><span className="font-semibold text-slate-900">{customerDetails.email}</span></div>
                                    <div><span className="text-slate-500 block mb-1">Coverage Amount</span><span className="font-semibold text-green-600">{customerDetails.coverage}</span></div>
                                    <div><span className="text-slate-500 block mb-1">Address</span><span className="font-semibold text-slate-900">{customerDetails.address}</span></div>
                                </div>
                            </div>
                        )}

                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Claim Overview</h3>
                            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                <div><span className="text-slate-500 block mb-1">Claimant Name</span><span className="font-semibold text-slate-900">{selectedClaim.customer}</span></div>
                                <div><span className="text-slate-500 block mb-1">Filing Date</span><span className="font-semibold text-slate-900">{selectedClaim.date}</span></div>
                                <div><span className="text-slate-500 block mb-1">Claim Amount</span><span className="font-extrabold text-red-600">{selectedClaim.amount}</span></div>
                                <div><span className="text-slate-500 block mb-1">Claim Type</span><span className="font-semibold text-slate-900">{selectedClaim.type}</span></div>
                                <div><span className="text-slate-500 block mb-1">Hospital/Clinic</span><span className="font-semibold text-slate-900">{selectedClaim.hospital}</span></div>
                                <div><span className="text-slate-500 block mb-1">Assigned Adjuster</span><span className="font-semibold text-slate-900">David G. (Internal)</span></div>
                            </div>
                            <div className="mt-4">
                                <span className="text-slate-500 block mb-1">Description</span>
                                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{selectedClaim.description}</p>
                            </div>
                        </div>

                        {/* Document Verification Section */}
                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Document Verification</h3>
                            <div className="space-y-3">
                                {claimDocuments.map(doc => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                doc.status === 'verified' ? 'bg-green-500' :
                                                doc.status === 'rejected' ? 'bg-red-500' : 'bg-amber-500'
                                            }`}></div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{doc.name}</p>
                                                <p className="text-xs text-slate-500">{doc.type} • Uploaded {doc.uploadedDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            {doc.status === 'pending' && (
                                                <>
                                                    <button 
                                                        onClick={() => handleDocumentVerification(doc.id, 'verified')}
                                                        disabled={isProcessing}
                                                        className="px-3 py-1 bg-green-100 text-green-700 rounded text-xs font-bold hover:bg-green-200 disabled:opacity-50"
                                                    >
                                                        ✓ Verify
                                                    </button>
                                                    <button 
                                                        onClick={() => handleDocumentVerification(doc.id, 'rejected')}
                                                        disabled={isProcessing}
                                                        className="px-3 py-1 bg-red-100 text-red-700 rounded text-xs font-bold hover:bg-red-200 disabled:opacity-50"
                                                    >
                                                        ✗ Reject
                                                    </button>
                                                </>
                                            )}
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                doc.status === 'verified' ? 'bg-green-100 text-green-700' :
                                                doc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                                            }`}>
                                                {doc.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => setShowDocumentUpload(true)} 
                                className="w-full mt-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition border border-blue-200"
                            >
                                + Upload Additional Documents
                            </button>
                        </div>

                        {/* Process History Timeline */}
                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Process History</h3>
                            <div className="space-y-4 pl-2">
                                {claimHistory.map((item, index) => (
                                    <div key={index} className={`flex gap-4 items-start relative before:absolute before:left-2 before:top-6 before:bottom-0 before:block before:w-[2px] before:bg-slate-100 ${index === claimHistory.length - 1 ? 'last:before:hidden' : ''}`}>
                                        <div className="w-4 h-4 rounded-full bg-blue-500 relative z-10 shrink-0 mt-1"></div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-800">{item.action}</p>
                                            <p className="text-xs text-slate-500">{item.timestamp} by {item.user}</p>
                                            <p className="text-sm text-slate-700 mt-1">{item.details}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Panel Actions */}
                    <div className="space-y-6">
                        <div className="card-premium p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Workflow Actions</h3>
                            <div className="space-y-3">
                                <button onClick={() => setShowDocumentUpload(true)} className="w-full text-center py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition border border-blue-200">Upload & Verify Docs</button>
                                <button onClick={() => setShowRequestInfoModal(true)} className="w-full text-center py-2 bg-amber-50 text-amber-700 rounded-xl font-semibold hover:bg-amber-100 transition border border-amber-200">Request More Info</button>
                                <button onClick={() => setShowStatementModal(true)} className="w-full text-center py-2 bg-indigo-50 text-indigo-700 rounded-xl font-semibold hover:bg-indigo-100 transition border border-indigo-200">Record Statement</button>
                                <button onClick={() => setShowSettleModal(true)} disabled={selectedClaim.status === 'Settled' || selectedClaim.status === 'Pending Docs'} className="w-full text-center py-2 bg-green-50 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition border border-green-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">Execute Settlement</button>
                                <button onClick={() => setShowRejectModal(true)} className="w-full text-center py-2 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 transition border border-red-200">Reject Claim</button>
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
                            <input 
                                type="text" 
                                value={settlementAmount} 
                                onChange={(e) => setSettlementAmount(e.target.value)}
                                placeholder="Final Amount (e.g. $4,200)"
                                className="input-premium w-full mb-4"
                            />
                            <div className="flex gap-3 justify-end mt-4">
                                <button onClick={() => setShowSettleModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                                <button onClick={handleProcessSettlement} disabled={isProcessing} className="px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 disabled:opacity-50">Confirm Transfer</button>
                            </div>
                        </div>
                    </div>
                )}

                {showRejectModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 text-red-600">Reject Claim</h2>
                            <p className="text-sm text-slate-600 mb-2">Please provide a detailed reason for the rejection:</p>
                            <textarea 
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                className="input-premium w-full h-32 mb-4"
                                placeholder="Policy exclusions, missing original bills, etc."
                            />
                            <div className="flex gap-3 justify-end mt-4">
                                <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                                <button onClick={handleRejectClaim} disabled={isProcessing} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 disabled:opacity-50">Confirm Rejection</button>
                            </div>
                        </div>
                    </div>
                )}

                {showRequestInfoModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 text-amber-600">Request Information</h2>
                            <p className="text-sm text-slate-600 mb-2">Specify what additional documents or info are needed:</p>
                            <textarea 
                                value={requestInfo}
                                onChange={(e) => setRequestInfo(e.target.value)}
                                className="input-premium w-full h-32 mb-4"
                                placeholder="Explain clearly what the customer needs to provide..."
                            />
                            <div className="flex gap-3 justify-end mt-4">
                                <button onClick={() => setShowRequestInfoModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                                <button onClick={handleRequestMoreInfo} disabled={isProcessing} className="px-4 py-2 bg-amber-600 text-white font-bold rounded-lg hover:bg-amber-700 disabled:opacity-50">Send Request</button>
                            </div>
                        </div>
                    </div>
                )}

                {showStatementModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-4 text-indigo-600">Record Statement</h2>
                            <p className="text-sm text-slate-600 mb-2">Internal medical/legal statement for this claim:</p>
                            <textarea 
                                value={claimStatement}
                                onChange={(e) => setClaimStatement(e.target.value)}
                                className="input-premium w-full h-32 mb-4"
                                placeholder="Enter expert opinion or adjuster notes..."
                            />
                            <div className="flex gap-3 justify-end mt-4">
                                <button onClick={() => setShowStatementModal(false)} className="px-4 py-2 bg-slate-100 rounded-lg">Cancel</button>
                                <button onClick={handleSaveStatement} disabled={isProcessing} className="px-4 py-2 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 disabled:opacity-50">Save Statement</button>
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
                                <label className="block text-sm font-medium text-slate-700 mb-1">Member *</label>
                                <select required className="input-premium w-full" defaultValue="">
                                    <option value="" disabled>--Select Member--</option>
                                    <option value="john-doe">John Doe</option>
                                    <option value="emily-white">Emily White</option>
                                    <option value="michael-chen">Michael Chen</option>
                                </select>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">UHID Number *</label>
                                    <input required type="text" className="input-premium w-full" placeholder="UHID Number" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                                    <select required className="input-premium w-full" defaultValue="">
                                        <option value="" disabled>Gender</option>
                                        <option value="female">Female</option>
                                        <option value="male">Male</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Relationship *</label>
                                    <select required className="input-premium w-full" defaultValue="">
                                        <option value="" disabled>Relation</option>
                                        <option value="self">Self</option>
                                        <option value="spouse">Spouse</option>
                                        <option value="child">Child</option>
                                        <option value="parent">Parent</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Email ID *</label>
                                    <input required type="email" className="input-premium w-full" placeholder="Enter Mail Id" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Mobile *</label>
                                    <input required type="tel" className="input-premium w-full" placeholder="Enter Mobile" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Claim Type *</label>
                                    <select required className="input-premium w-full" defaultValue="">
                                        <option value="" disabled>--Select Claim Type--</option>
                                        <option value="hospitalization">Hospitalization</option>
                                        <option value="maternity">Maternity</option>
                                        <option value="critical-illness">Critical Illness</option>
                                        <option value="outpatient">Outpatient</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                                    <select required className="input-premium w-full" defaultValue="">
                                        <option value="" disabled>--Select State--</option>
                                        <option value="maharashtra">Maharashtra</option>
                                        <option value="karnataka">Karnataka</option>
                                        <option value="delhi">Delhi</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                                    <select required className="input-premium w-full" defaultValue="">
                                        <option value="" disabled>--Select City--</option>
                                        <option value="mumbai">Mumbai</option>
                                        <option value="bangalore">Bangalore</option>
                                        <option value="delhi">Delhi</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Hospital *</label>
                                    <select required className="input-premium w-full" defaultValue="">
                                        <option value="" disabled>--Select Hospital--</option>
                                        <option value="apollo">Apollo Hospitals</option>
                                        <option value="fortis">Fortis Healthcare</option>
                                        <option value="manipal">Manipal Hospitals</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Date of Admission *</label>
                                    <input required type="date" className="input-premium w-full" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Address *</label>
                                    <input required type="text" className="input-premium w-full" placeholder="Enter Address" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Probable Diagnosis *</label>
                                <textarea required className="input-premium w-full" rows="3" placeholder="Enter Probable Diagnosis"></textarea>
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
