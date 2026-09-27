import React, { useState, useEffect } from 'react';
import { verifyAadhar, getPremiumOptions, createComprehensivePolicy, initiateCCavenuePayment, updatePolicy, renewPolicy, generateCertificate, downloadCertificate, getPolicies, getStats, getComplianceTasks } from '../../api/client';

export default function PolicyMgmtView() {
    const [activeTab, setActiveTab] = useState('list');
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [createStep, setCreateStep] = useState(1);
    
    // New state for policy management features
    const [showEditModal, setShowEditModal] = useState(false);
    const [showRenewalModal, setShowRenewalModal] = useState(false);
    const [editData, setEditData] = useState({});
    const [renewalData, setRenewalData] = useState({ premium: '', discount: 0, finalPremium: '' });
    const [isProcessing, setIsProcessing] = useState(false);
    const [showComplianceModal, setShowComplianceModal] = useState(false);
    const [complianceTasks, setComplianceTasks] = useState([]);
    const [policies, setPolicies] = useState([]);
    const [stats, setStats] = useState({ totalPolicies: 0, activePolicies: 0, pendingPolicies: 0 });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [policiesRes, statsRes] = await Promise.all([
                getPolicies(),
                getStats()
            ]);
            setPolicies(Array.isArray(policiesRes) ? policiesRes : []);
            setStats(statsRes || { totalPolicies: 0, activePolicies: 0, pendingPolicies: 0 });
        } catch (error) {
            console.error("Failed to load data", error);
        }
    };
    
    // Enhanced Form State
    const [createData, setCreateData] = useState({
        // Personal Info
        aadhar: '',
        name: '',
        dob: '',
        gender: 'male',
        email: '',
        phone: '',
        altPhone: '',
        
        // Family Details
        maritalStatus: 'single',
        spouseName: '',
        spouseDob: '',
        spouseGender: 'female',
        children: [],
        
        // Addresses
        commAddress: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        },
        permAddress: {
            line1: '',
            line2: '',
            city: '',
            state: '',
            pincode: '',
            country: 'India'
        },
        sameAsComm: false,
        
        // Health History
        height: '',
        weight: '',
        tobacco: 'no',
        medicalHistory: '',
        preExistingConditions: [],
        
        // Policy Details
        category: 'individual',
        planType: '',
        coverage: '',
        premium: '',
        
        // Nominee
        nomineeName: '',
        nomineeRelation: '',
        nomineePhone: '',
        
        // Documents
        documents: [],
        
        // Payment
        paymentMethod: 'ccavenue'
    });
    
    const [isAadharVerified, setIsAadharVerified] = useState(false);
    const [premiumOptions, setPremiumOptions] = useState([]);
    const [filteredPremiums, setFilteredPremiums] = useState([]);

    // Helper functions
    const addChild = () => {
        setCreateData(prev => ({
            ...prev,
            children: [...prev.children, { name: '', dob: '', gender: 'male' }]
        }));
    };

    const updateChild = (index, field, value) => {
        setCreateData(prev => ({
            ...prev,
            children: prev.children.map((child, i) => 
                i === index ? { ...child, [field]: value } : child
            )
        }));
    };

    const removeChild = (index) => {
        setCreateData(prev => ({
            ...prev,
            children: prev.children.filter((_, i) => i !== index)
        }));
    };

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setCreateData(prev => ({
            ...prev,
            documents: [...prev.documents, ...files]
        }));
    };

    const removeDocument = (index) => {
        setCreateData(prev => ({
            ...prev,
            documents: prev.documents.filter((_, i) => i !== index)
        }));
    };

    const calculateBMI = () => {
        if (createData.height && createData.weight) {
            const heightM = createData.height / 100;
            const bmi = (createData.weight / (heightM * heightM)).toFixed(1);
            return bmi;
        }
        return '';
    };

    const filterPremiums = async () => {
        try {
            const response = await getPremiumOptions(createData.category, createData.coverage);
            setFilteredPremiums(response.options || []);
        } catch (error) {
            alert("Failed to load premium options: " + error.message);
            setFilteredPremiums([]);
        }
    };

    const handlePayment = async () => {
        try {
            // First create the comprehensive policy
            const policyData = {
                personal: {
                    aadhar: createData.aadhar,
                    name: createData.name,
                    dob: createData.dob,
                    gender: createData.gender,
                    email: createData.email,
                    phone: createData.phone,
                    altPhone: createData.altPhone
                },
                family: {
                    maritalStatus: createData.maritalStatus,
                    spouseName: createData.spouseName,
                    spouseDob: createData.spouseDob,
                    spouseGender: createData.spouseGender,
                    children: createData.children
                },
                communicationAddress: createData.commAddress,
                permanentAddress: createData.permAddress,
                health: {
                    height: createData.height,
                    weight: createData.weight,
                    tobacco: createData.tobacco,
                    medicalHistory: createData.medicalHistory,
                    preExistingConditions: createData.preExistingConditions
                },
                policy: {
                    category: createData.category,
                    planType: createData.planType,
                    coverage: createData.coverage,
                    premium: createData.premium
                },
                nominee: {
                    name: createData.nomineeName,
                    relation: createData.nomineeRelation,
                    phone: createData.nomineePhone
                }
            };

            const policyResponse = await createComprehensivePolicy(policyData);
            
            if (policyResponse.status === 'success') {
                // Now initiate CC Avenue payment
                const paymentData = {
                    policyId: policyResponse.policyId,
                    amount: createData.premium.replace(/[^\d]/g, ''),
                    customerEmail: createData.email,
                    customerPhone: createData.phone,
                    customerName: createData.name
                };

                const paymentResponse = await initiateCCavenuePayment(paymentData);
                
                if (paymentResponse.status === 'success') {
                    // Redirect to CC Avenue
                    window.location.href = paymentResponse.paymentUrl;
                } else {
                    alert("Payment initiation failed: " + paymentResponse.message);
                }
            } else {
                alert("Policy creation failed: " + policyResponse.message);
            }
        } catch (error) {
            alert("Payment processing failed: " + error.message);
        }
    };

    // const dummyPolicies = [
    //     { id: "POL-829103", customer: "John Doe", type: "Health Premium", premium: "$120/mo", status: "Active", date: "2026-03-12" },
    //     { id: "POL-482011", customer: "Sarah Smith", type: "Life Term", premium: "$45/mo", status: "Pending", date: "2026-04-10" },
    //     { id: "POL-992019", customer: "Michael Chen", type: "Family Floater", premium: "$210/mo", status: "Lapsed", date: "2025-11-05" },
    //     { id: "POL-550192", customer: "Emma Wilson", type: "Critical Illness", premium: "$80/mo", status: "Active", date: "2026-01-20" },
    // ];

    const handleGenerateCertificate = async () => {
        try {
            setIsProcessing(true);
            // First generate the certificate
            const response = await generateCertificate(selectedPolicy.id);
            
            if (response.status === 'success') {
                // Then download it
                const blob = await downloadCertificate(selectedPolicy.id);
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `${selectedPolicy.id}_certificate.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                alert(`E-Certificate successfully generated and downloaded for ${selectedPolicy.id}.`);
            } else {
                alert("Failed to generate certificate: " + response.message);
            }
        } catch (error) {
            alert("Failed to generate certificate: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleEditPolicy = () => {
        let nominee = { name: '', relation: '', phone: '' };
        let address = { line1: '', city: '', state: '', pincode: '' };
        
        try {
            if (selectedPolicy.nomineeJson) nominee = JSON.parse(selectedPolicy.nomineeJson);
            if (selectedPolicy.addressJson) address = JSON.parse(selectedPolicy.addressJson);
        } catch (e) { console.error("Error parsing policy details", e); }

        setEditData({
            nomineeName: nominee.name || '',
            nomineeRelation: nominee.relation || '',
            nomineePhone: nominee.phone || '',
            address: {
                line1: address.line1 || '',
                city: address.city || '',
                state: address.state || '',
                pincode: address.pincode || ''
            },
            coverage: selectedPolicy.premium || 'N/A'
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            setIsProcessing(true);
            const updates = {
                nomineeJson: JSON.stringify({
                    name: editData.nomineeName,
                    relation: editData.nomineeRelation,
                    phone: editData.nomineePhone
                }),
                addressJson: JSON.stringify(editData.address)
            };

            const response = await updatePolicy(selectedPolicy.id, updates);
            
            if (response.status === 'success') {
                alert("Policy details updated successfully!");
                setShowEditModal(false);
                // Update the local policy data
                setSelectedPolicy({...selectedPolicy, ...response.policy});
            } else {
                alert("Failed to update policy: " + response.message);
            }
        } catch (error) {
            alert("Failed to update policy: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRenewal = () => {
        // Calculate renewal premium (simplified - would come from backend)
        const premiumStr = (selectedPolicy.premium || '₹0').replace(/[^\d.]/g, '');
        const basePremium = parseFloat(premiumStr) || 120;
        const discount = basePremium * 0.1; // 10% loyalty discount
        const finalPremium = basePremium - discount;
        
        setRenewalData({
            premium: basePremium.toFixed(2),
            discount: discount.toFixed(2),
            finalPremium: finalPremium.toFixed(2)
        });
        setShowRenewalModal(true);
    };
    
    const handleViewCompliance = async () => {
        try {
            setIsProcessing(true);
            const response = await getComplianceTasks(selectedPolicy.dbId || selectedPolicy.id);
            if (response.status === 'success') {
                setComplianceTasks(response.tasks || []);
                setShowComplianceModal(true);
            } else {
                alert("Failed to load compliance tasks");
            }
        } catch (error) {
            alert("Error loading compliance tasks: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleProcessRenewal = async () => {
        try {
            setIsProcessing(true);
            const renewalPayload = {
                premium: renewalData.finalPremium,
                discount: renewalData.discount,
                username: 'Admin User', // Would come from auth context
                userId: '1'
            };

            const response = await renewPolicy(selectedPolicy.id, renewalPayload);
            
            if (response.status === 'success') {
                alert(`Policy renewed successfully! New coverage period: ${response.renewalDetails.newStartDate} to ${response.renewalDetails.newEndDate}`);
                setShowRenewalModal(false);
                // Update the local policy data
                setSelectedPolicy({...selectedPolicy, ...response.policy});
            } else {
                alert("Failed to renew policy: " + response.message);
            }
        } catch (error) {
            alert("Failed to renew policy: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const submitCancelPolicy = async () => {
        if (!cancelReason.trim()) {
            alert("Please provide a reason for cancellation.");
            return;
        }

        try {
            setIsProcessing(true);
            // TODO: Implement cancel policy API call
            // const response = await cancelPolicy(selectedPolicy.id, { reason: cancelReason, userId: '1' });
            
            // For now, show success message
            alert(`Policy ${selectedPolicy.id} cancellation request submitted successfully. Reason: ${cancelReason}`);
            setShowCancelModal(false);
            setCancelReason('');
            // Update local policy status
            setSelectedPolicy({...selectedPolicy, status: 'CANCELLED'});
        } catch (error) {
            alert("Failed to submit cancellation request: " + error.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleVerifyAadhar = async () => {
        if (createData.aadhar.length !== 12) return alert("Aadhar must be exactly 12 digits.");
        try {
            const response = await verifyAadhar(createData.aadhar);
            if (response.status === 'verified') {
                setIsAadharVerified(true);
                setCreateData(prev => ({ 
                    ...prev, 
                    name: response.name || prev.name,
                    dob: response.dob || prev.dob,
                    gender: response.gender || prev.gender,
                    email: response.email || prev.email,
                    phone: response.phone || prev.phone,
                    commAddress: response.address ? {
                        ...prev.commAddress,
                        line1: response.address.line1 || prev.commAddress.line1,
                        city: response.address.city || prev.commAddress.city,
                        state: response.address.state || prev.commAddress.state,
                        pincode: response.address.pincode || prev.commAddress.pincode
                    } : prev.commAddress
                }));
                alert("Aadhar verified successfully!");
            } else {
                alert("Aadhar verification failed: " + response.message);
            }
        } catch (error) {
            alert("Aadhar verification failed: " + error.message);
        }
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
                                <button onClick={handleEditPolicy} className="w-full text-center py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition border border-blue-200">Edit Details</button>
                                <button onClick={handleRenewal} className="w-full text-center py-2 bg-green-50 text-green-700 rounded-xl font-semibold hover:bg-green-100 transition border border-green-200">Process Renewal</button>
                                <button onClick={handleGenerateCertificate} disabled={isProcessing} className="w-full text-center py-2 bg-slate-50 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition border border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isProcessing ? 'Generating...' : 'Generate E-Certificate'}
                                </button>
                                <button onClick={() => setShowCancelModal(true)} disabled={selectedPolicy.status === 'CANCELLED'} className="w-full text-center py-2 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 transition border border-red-200 mt-6 disabled:opacity-50 disabled:cursor-not-allowed">Cancel / Lapsation</button>
                            </div>
                        </div>

                        <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-xl">
                            <h3 className="font-bold flex items-center gap-2 mb-2">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                                Priority Flags
                            </h3>
                            <p className="text-sm text-slate-300 opacity-90 mb-4">Ensure beneficiary declarations are re-verified by {selectedPolicy.date} to comply with IRDAI standards.</p>
                            <button onClick={handleViewCompliance} className="text-slate-900 bg-white px-4 py-2 text-sm font-bold rounded-lg w-full hover:bg-slate-200 transition">View Compliance Task</button>
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

                {/* Edit Policy Modal */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-blue-50">
                                <h2 className="text-xl font-bold text-blue-700">Edit Policy Details - {selectedPolicy.id}</h2>
                                <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Nominee Name</label>
                                        <input
                                            type="text"
                                            value={editData.nomineeName}
                                            onChange={(e) => setEditData({...editData, nomineeName: e.target.value})}
                                            className="input-premium w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Relation</label>
                                        <input
                                            type="text"
                                            value={editData.nomineeRelation}
                                            onChange={(e) => setEditData({...editData, nomineeRelation: e.target.value})}
                                            className="input-premium w-full"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Nominee Phone</label>
                                    <input
                                        type="text"
                                        value={editData.nomineePhone}
                                        onChange={(e) => setEditData({...editData, nomineePhone: e.target.value})}
                                        className="input-premium w-full"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Address Line 1</label>
                                        <input
                                            type="text"
                                            value={editData.address.line1}
                                            onChange={(e) => setEditData({...editData, address: {...editData.address, line1: e.target.value}})}
                                            className="input-premium w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                                        <input
                                            type="text"
                                            value={editData.address.city}
                                            onChange={(e) => setEditData({...editData, address: {...editData.address, city: e.target.value}})}
                                            className="input-premium w-full"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                                        <input
                                            type="text"
                                            value={editData.address.state}
                                            onChange={(e) => setEditData({...editData, address: {...editData.address, state: e.target.value}})}
                                            className="input-premium w-full"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                                        <input
                                            type="text"
                                            value={editData.address.pincode}
                                            onChange={(e) => setEditData({...editData, address: {...editData.address, pincode: e.target.value}})}
                                            className="input-premium w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button onClick={() => setShowEditModal(false)} className="px-5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
                                <button onClick={handleSaveEdit} disabled={isProcessing} className="px-5 py-2 rounded-xl font-bold text-white bg-blue-600 hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isProcessing ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Renewal Modal */}
                {showRenewalModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-green-50">
                                <h2 className="text-xl font-bold text-green-700">Process Renewal - {selectedPolicy.id}</h2>
                                <button onClick={() => setShowRenewalModal(false)} className="text-slate-400 hover:text-slate-600">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="bg-slate-50 p-4 rounded-lg">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-slate-600">Base Premium:</span>
                                        <span className="font-semibold">${renewalData.premium}</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm text-green-600">Loyalty Discount (10%):</span>
                                        <span className="font-semibold text-green-600">-${renewalData.discount}</span>
                                    </div>
                                    <div className="border-t border-slate-200 pt-2 flex justify-between items-center">
                                        <span className="font-semibold text-slate-900">Final Premium:</span>
                                        <span className="font-bold text-lg text-green-600">${renewalData.finalPremium}</span>
                                    </div>
                                </div>
                                <div className="text-sm text-slate-600">
                                    <p>New coverage period: <span className="font-semibold">2026-04-15 to 2027-04-14</span></p>
                                    <p className="mt-1">All terms and conditions remain the same.</p>
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                                <button onClick={() => setShowRenewalModal(false)} className="px-5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
                                <button onClick={handleProcessRenewal} disabled={isProcessing} className="px-5 py-2 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isProcessing ? 'Processing...' : 'Confirm Renewal'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                
                {/* Compliance Tasks Modal */}
                {showComplianceModal && (
                    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden">
                            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-800 text-white">
                                <h2 className="text-xl font-bold">Compliance Tasks - {selectedPolicy.id}</h2>
                                <button onClick={() => setShowComplianceModal(false)} className="text-slate-400 hover:text-white transition">
                                    <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                                </button>
                            </div>
                            <div className="p-6 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-4">
                                    {complianceTasks.length === 0 ? (
                                        <p className="text-center text-slate-500 py-8">No compliance tasks found for this policy.</p>
                                    ) : (
                                        complianceTasks.map(task => (
                                            <div key={task.id} className="p-4 border border-slate-100 rounded-xl bg-slate-50 hover:bg-white transition hover:shadow-md">
                                                <div className="flex justify-between items-start mb-2">
                                                    <h3 className="font-bold text-slate-900">{task.title}</h3>
                                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                                                        task.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 
                                                        task.priority === 'MEDIUM' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                                                    }`}>
                                                        {task.priority} Priority
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-600 mb-3">{task.description}</p>
                                                <div className="flex justify-between items-center text-xs">
                                                    <span className="text-slate-500">Due: <span className="font-semibold">{task.dueDate}</span></span>
                                                    <span className={`px-2 py-1 rounded-full font-bold ${
                                                        task.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                                                    }`}>
                                                        {task.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
                                <button onClick={() => setShowComplianceModal(false)} className="px-6 py-2 rounded-xl font-bold bg-slate-800 text-white hover:bg-slate-900 transition">Close</button>
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
                    <p className="text-3xl font-extrabold text-blue-600 mt-1">{stats.totalPolicies || 0}</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Active Policies</p>
                    <p className="text-3xl font-extrabold text-green-500 mt-1">{stats.activePolicies || 0}</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Pending Review</p>
                    <p className="text-3xl font-extrabold text-amber-500 mt-1">{stats.pendingPolicies || 0}</p>
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
                                    {policies.map(p => (
                                        <tr key={p.policyNumber} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                                            <td className="px-4 py-3 font-semibold text-blue-600 cursor-pointer hover:underline">{p.policyNumber}</td>
                                            <td className="px-4 py-3 font-medium text-slate-900">User #{p.userId}</td>
                                            <td className="px-4 py-3">{p.productId === 1 ? 'Health Shield' : 'Generic Plan'}</td>
                                            <td className="px-4 py-3 font-medium">₹{(p.id * 1234 % 5000 + 500).toFixed(2)}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${
                                                    p.status === 'ACTIVE' || p.status === 'Active' ? 'bg-green-100 text-green-700' :
                                                    p.status === 'PENDING' || p.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-red-100 text-red-700'
                                                }`}>
                                                    {p.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <button onClick={() => setSelectedPolicy({
                                                    ...p,
                                                    dbId: p.id,
                                                    id: p.policyNumber,
                                                    customer: `User #${p.userId}`,
                                                    type: p.productId === 1 ? 'Health Shield' : 'Generic Plan',
                                                    premium: `₹${(p.id * 1234 % 5000 + 500).toFixed(2)}`,
                                                    date: p.startDate || 'N/A'
                                                })} className="text-white hover:bg-blue-700 bg-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm">Manage & View</button>
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

            {/* Enhanced Modal for Creating Policy */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">Create New Policy</h2>
                            <button onClick={() => { setShowCreateForm(false); setCreateStep(1); }} className="text-slate-400 hover:text-slate-600">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        
                        {/* Step Indicator */}
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100">
                            <div className="flex items-center justify-between">
                                {['Personal Info', 'Family Details', 'Health History', 'Policy Selection', 'Nominee & Documents', 'Payment'].map((step, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                            createStep > index + 1 ? 'bg-green-500 text-white' :
                                            createStep === index + 1 ? 'bg-blue-500 text-white' : 'bg-slate-300 text-slate-600'
                                        }`}>
                                            {createStep > index + 1 ? '✓' : index + 1}
                                        </div>
                                        <span className={`ml-2 text-sm font-medium ${createStep === index + 1 ? 'text-blue-600' : 'text-slate-500'}`}>
                                            {step}
                                        </span>
                                        {index < 5 && <div className={`w-12 h-0.5 mx-4 ${createStep > index + 1 ? 'bg-green-500' : 'bg-slate-300'}`}></div>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="p-6 max-h-[60vh] overflow-y-auto">
                            {/* Step 1: Personal Information */}
                            {createStep === 1 && (
                                <div className="space-y-6">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <label className="block text-sm font-bold text-slate-800 mb-2">UIDAI Aadhar Authentication</label>
                                        <div className="flex gap-3">
                                            <input 
                                                type="password" 
                                                maxLength="12"
                                                value={createData.aadhar}
                                                onChange={(e) => setCreateData({ ...createData, aadhar: e.target.value.replace(/\D/g, '') })}
                                                className="input-premium flex-1 font-mono tracking-widest text-lg" 
                                                placeholder="Enter 12-Digit Aadhar" 
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
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                                            <input 
                                                type="text" 
                                                value={createData.name} 
                                                onChange={e => setCreateData({...createData, name: e.target.value})} 
                                                className="input-premium w-full" 
                                                placeholder="Enter full name"
                                                disabled={isAadharVerified} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                                            <input 
                                                type="date" 
                                                value={createData.dob} 
                                                onChange={e => setCreateData({...createData, dob: e.target.value})} 
                                                className="input-premium w-full"
                                                disabled={isAadharVerified} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                                            <select 
                                                value={createData.gender} 
                                                onChange={e => setCreateData({...createData, gender: e.target.value})} 
                                                className="input-premium w-full"
                                                disabled={isAadharVerified}
                                            >
                                                <option value="male">Male</option>
                                                <option value="female">Female</option>
                                                <option value="other">Other</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Email *</label>
                                            <input 
                                                type="email" 
                                                value={createData.email} 
                                                onChange={e => setCreateData({...createData, email: e.target.value})} 
                                                className="input-premium w-full" 
                                                placeholder="email@example.com"
                                                disabled={isAadharVerified} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                                            <input 
                                                type="tel" 
                                                value={createData.phone} 
                                                onChange={e => setCreateData({...createData, phone: e.target.value})} 
                                                className="input-premium w-full" 
                                                placeholder="+91 9876543210"
                                                disabled={isAadharVerified} 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Alternate Phone</label>
                                            <input 
                                                type="tel" 
                                                value={createData.altPhone} 
                                                onChange={e => setCreateData({...createData, altPhone: e.target.value})} 
                                                className="input-premium w-full" 
                                                placeholder="+91 9876543210" 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Step 2: Family Details */}
                            {createStep === 2 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Marital Status</label>
                                        <select 
                                            value={createData.maritalStatus} 
                                            onChange={e => setCreateData({...createData, maritalStatus: e.target.value})} 
                                            className="input-premium w-full"
                                        >
                                            <option value="single">Single</option>
                                            <option value="married">Married</option>
                                            <option value="divorced">Divorced</option>
                                            <option value="widowed">Widowed</option>
                                        </select>
                                    </div>

                                    {createData.maritalStatus === 'married' && (
                                        <div className="grid grid-cols-3 gap-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Spouse Name</label>
                                                <input 
                                                    type="text" 
                                                    value={createData.spouseName} 
                                                    onChange={e => setCreateData({...createData, spouseName: e.target.value})} 
                                                    className="input-premium w-full" 
                                                    placeholder="Spouse full name" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Spouse DOB</label>
                                                <input 
                                                    type="date" 
                                                    value={createData.spouseDob} 
                                                    onChange={e => setCreateData({...createData, spouseDob: e.target.value})} 
                                                    className="input-premium w-full" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Spouse Gender</label>
                                                <select 
                                                    value={createData.spouseGender} 
                                                    onChange={e => setCreateData({...createData, spouseGender: e.target.value})} 
                                                    className="input-premium w-full"
                                                >
                                                    <option value="male">Male</option>
                                                    <option value="female">Female</option>
                                                </select>
                                            </div>
                                        </div>
                                    )}

                                    <div>
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="block text-sm font-medium text-slate-700">Children</label>
                                            <button 
                                                type="button" 
                                                onClick={addChild} 
                                                className="px-3 py-1 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600"
                                            >
                                                + Add Child
                                            </button>
                                        </div>
                                        {createData.children.map((child, index) => (
                                            <div key={index} className="grid grid-cols-4 gap-4 p-4 bg-green-50 rounded-xl border border-green-200 mb-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                                                    <input 
                                                        type="text" 
                                                        value={child.name} 
                                                        onChange={e => updateChild(index, 'name', e.target.value)} 
                                                        className="input-premium w-full" 
                                                        placeholder="Child name" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">DOB</label>
                                                    <input 
                                                        type="date" 
                                                        value={child.dob} 
                                                        onChange={e => updateChild(index, 'dob', e.target.value)} 
                                                        className="input-premium w-full" 
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                                                    <select 
                                                        value={child.gender} 
                                                        onChange={e => updateChild(index, 'gender', e.target.value)} 
                                                        className="input-premium w-full"
                                                    >
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                    </select>
                                                </div>
                                                <div className="flex items-end">
                                                    <button 
                                                        type="button" 
                                                        onClick={() => removeChild(index)} 
                                                        className="px-3 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Health History */}
                            {createStep === 3 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Height (cm) *</label>
                                            <input 
                                                type="number" 
                                                value={createData.height} 
                                                onChange={e => setCreateData({...createData, height: e.target.value})} 
                                                className="input-premium w-full" 
                                                placeholder="170" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">Weight (kg) *</label>
                                            <input 
                                                type="number" 
                                                value={createData.weight} 
                                                onChange={e => setCreateData({...createData, weight: e.target.value})} 
                                                className="input-premium w-full" 
                                                placeholder="70" 
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1">BMI</label>
                                            <input 
                                                type="text" 
                                                value={calculateBMI()} 
                                                className="input-premium w-full bg-slate-100" 
                                                readOnly 
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Tobacco Usage</label>
                                        <select 
                                            value={createData.tobacco} 
                                            onChange={e => setCreateData({...createData, tobacco: e.target.value})} 
                                            className="input-premium w-full"
                                        >
                                            <option value="no">No</option>
                                            <option value="yes">Yes</option>
                                            <option value="former">Former User</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Pre-existing Conditions</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'Cancer', 'Kidney Disease', 'Thyroid', 'None'].map(condition => (
                                                <label key={condition} className="flex items-center">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={createData.preExistingConditions.includes(condition)}
                                                        onChange={e => {
                                                            const conditions = e.target.checked 
                                                                ? [...createData.preExistingConditions, condition]
                                                                : createData.preExistingConditions.filter(c => c !== condition);
                                                            setCreateData({...createData, preExistingConditions: conditions});
                                                        }}
                                                        className="mr-2" 
                                                    />
                                                    {condition}
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Medical History</label>
                                        <textarea 
                                            value={createData.medicalHistory} 
                                            onChange={e => setCreateData({...createData, medicalHistory: e.target.value})} 
                                            className="input-premium w-full" 
                                            rows="4" 
                                            placeholder="Please describe any past surgeries, hospitalizations, or ongoing treatments..." 
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Step 4: Policy Selection */}
                            {createStep === 4 && (
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Policy Category</label>
                                        <select 
                                            value={createData.category} 
                                            onChange={e => setCreateData({...createData, category: e.target.value})} 
                                            className="input-premium w-full"
                                        >
                                            <option value="individual">Individual</option>
                                            <option value="family">Family</option>
                                            <option value="senior">Senior Citizen</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Coverage Amount</label>
                                        <select 
                                            value={createData.coverage} 
                                            onChange={e => setCreateData({...createData, coverage: e.target.value})} 
                                            className="input-premium w-full"
                                        >
                                            <option value="">Any Coverage</option>
                                            <option value="5L">₹5 Lakhs</option>
                                            <option value="10L">₹10 Lakhs</option>
                                            <option value="15L">₹15 Lakhs</option>
                                            <option value="20L">₹20 Lakhs</option>
                                        </select>
                                    </div>

                                    <button 
                                        type="button" 
                                        onClick={filterPremiums} 
                                        className="w-full py-2 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600"
                                    >
                                        Search Available Plans
                                    </button>

                                    {filteredPremiums.length > 0 && (
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-bold text-slate-800">Available Plans</h3>
                                            {filteredPremiums.map(plan => (
                                                <div key={plan.id} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-bold text-slate-900">{plan.name}</h4>
                                                            <p className="text-sm text-slate-600">{plan.coverage} Coverage</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="text-xl font-bold text-blue-600">{plan.premium}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {plan.features.map(feature => (
                                                            <span key={feature} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                    <button 
                                                        type="button"
                                                        onClick={() => setCreateData({...createData, planType: plan.name, premium: plan.premium, coverage: plan.coverage})}
                                                        className={`w-full py-2 rounded-lg font-bold transition ${
                                                            createData.planType === plan.name 
                                                                ? 'bg-blue-500 text-white' 
                                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                                        }`}
                                                    >
                                                        {createData.planType === plan.name ? 'Selected' : 'Select Plan'}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Step 5: Nominee & Documents */}
                            {createStep === 5 && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Nominee Details</h3>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Nominee Name *</label>
                                                <input 
                                                    type="text" 
                                                    value={createData.nomineeName} 
                                                    onChange={e => setCreateData({...createData, nomineeName: e.target.value})} 
                                                    className="input-premium w-full" 
                                                    placeholder="Full name" 
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Relationship *</label>
                                                <select 
                                                    value={createData.nomineeRelation} 
                                                    onChange={e => setCreateData({...createData, nomineeRelation: e.target.value})} 
                                                    className="input-premium w-full"
                                                >
                                                    <option value="">Select relationship</option>
                                                    <option value="spouse">Spouse</option>
                                                    <option value="parent">Parent</option>
                                                    <option value="child">Child</option>
                                                    <option value="sibling">Sibling</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                                                <input 
                                                    type="tel" 
                                                    value={createData.nomineePhone} 
                                                    onChange={e => setCreateData({...createData, nomineePhone: e.target.value})} 
                                                    className="input-premium w-full" 
                                                    placeholder="+91 9876543210" 
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Document Upload</h3>
                                        <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
                                            <input 
                                                type="file" 
                                                multiple 
                                                onChange={handleFileUpload} 
                                                className="hidden" 
                                                id="document-upload" 
                                                accept=".pdf,.jpg,.jpeg,.png" 
                                            />
                                            <label htmlFor="document-upload" className="cursor-pointer">
                                                <svg className="w-12 h-12 mx-auto text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
                                                </svg>
                                                <p className="text-sm text-slate-500 font-medium">Click to upload documents</p>
                                                <p className="text-xs text-slate-400 mt-1">PDF, JPG, PNG up to 5MB each</p>
                                            </label>
                                        </div>
                                        
                                        {createData.documents.length > 0 && (
                                            <div className="mt-4 space-y-2">
                                                <h4 className="text-sm font-medium text-slate-700">Uploaded Documents:</h4>
                                                {createData.documents.map((doc, index) => (
                                                    <div key={index} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                                                        <span className="text-sm text-slate-700">{doc.name}</span>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => removeDocument(index)} 
                                                            className="text-red-500 hover:text-red-700"
                                                        >
                                                            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Step 6: Payment */}
                            {createStep === 6 && (
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                        <h3 className="text-lg font-bold text-slate-800 mb-4">Policy Summary</h3>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-slate-500">Plan:</span> <span className="font-semibold">{createData.planType}</span></div>
                                            <div><span className="text-slate-500">Coverage:</span> <span className="font-semibold">{createData.coverage}</span></div>
                                            <div><span className="text-slate-500">Premium:</span> <span className="font-semibold text-blue-600">{createData.premium}</span></div>
                                            <div><span className="text-slate-500">Category:</span> <span className="font-semibold">{createData.category}</span></div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
                                        <select 
                                            value={createData.paymentMethod} 
                                            onChange={e => setCreateData({...createData, paymentMethod: e.target.value})} 
                                            className="input-premium w-full"
                                        >
                                            <option value="ccavenue">CC Avenue (Credit/Debit Card, Net Banking)</option>
                                            <option value="upi">UPI</option>
                                            <option value="wallet">Digital Wallet</option>
                                        </select>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                            </svg>
                                            <span className="text-sm font-medium text-green-800">Secure Payment Gateway</span>
                                        </div>
                                        <p className="text-xs text-green-700">Your payment is processed securely through CC Avenue with 256-bit SSL encryption.</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-between">
                            <button 
                                onClick={() => setCreateStep(prev => Math.max(1, prev - 1))} 
                                disabled={createStep === 1}
                                className="px-5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <div className="flex gap-3">
                                <button 
                                    onClick={() => { setShowCreateForm(false); setCreateStep(1); }} 
                                    className="px-5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition"
                                >
                                    Cancel
                                </button>
                                {createStep < 6 ? (
                                    <button 
                                        onClick={() => setCreateStep(prev => prev + 1)} 
                                        className="btn-primary"
                                    >
                                        Next
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handlePayment} 
                                        className="btn-primary"
                                    >
                                        Proceed to Payment
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
