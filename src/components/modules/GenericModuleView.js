import React, { useState } from 'react';

export default function GenericModuleView({ moduleInfo }) {
    const [activeTab, setActiveTab] = useState('main');
    const [showActionModal, setShowActionModal] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);

    // Configuration map for all modules to provide an awesome dynamic tailored experience
    const moduleConfigs = {
        'claims-mgmt': {
            stats: [ { label: 'Total Claims', value: '8,392', color: 'text-blue-600' }, { label: 'Pending Docs', value: '412', color: 'text-amber-500' }, { label: 'Settled Today', value: '89', color: 'text-green-500' } ],
            actionLabel: 'Register Claim',
            tabs: [ { id: 'main', label: 'Active Claims' }, { id: 'history', label: 'Settlements' }, { id: 'audit', label: 'Fraud Check' } ],
            tableCols: ['Claim ID', 'Policy ID', 'Amount', 'Status', 'Date'],
            tableData: [
                ['CLM-2093', 'POL-829103', '$4,200', 'In Review', '2026-04-10'],
                ['CLM-9913', 'POL-119284', '$850', 'Approved', '2026-04-09'],
                ['CLM-5421', 'POL-848291', '$12,400', 'Pending Docs', '2026-04-05'],
            ]
        },
        'agent': {
            stats: [ { label: 'Total Agents', value: '1,204', color: 'text-blue-600' }, { label: 'Active This Month', value: '840', color: 'text-green-500' }, { label: 'Pending Onboarding', value: '24', color: 'text-amber-500' } ],
            actionLabel: 'Onboard Agent',
            tabs: [ { id: 'main', label: 'Agent Directory' }, { id: 'history', label: 'Commission payouts' }, { id: 'audit', label: 'Performance KPIs' } ],
            tableCols: ['Agent Code', 'Name', 'Region', 'Sales YTD', 'Status'],
            tableData: [
                ['AGT-001', 'Alice Johnson', 'North', '$420K', 'Active'],
                ['AGT-042', 'Bob Smith', 'West', '$190K', 'Active'],
                ['AGT-089', 'Charlie Davis', 'East', '$0', 'Onboarding'],
            ]
        },
        'sales': {
            stats: [ { label: 'Total Leads Handled', value: '412', color: 'text-blue-600' }, { label: 'High Intent (AI Score > 80)', value: '89', color: 'text-green-500' }, { label: 'Conversion Rate', value: '24.2%', color: 'text-purple-600' } ],
            actionLabel: 'Score New Lead (AI)',
            tabs: [ { id: 'main', label: 'AI Lead Scoring Engine' }, { id: 'history', label: 'Converted Policies' }, { id: 'audit', label: 'Drop-off Analysis' } ],
            tableCols: ['Prospect Name', 'Product Interest', 'AI Score', 'Predicted Intent', 'Status'],
            tableData: [
                ['Emily White', 'Health Family', '94', 'Ready to Buy', 'Follow-up Required'],
                ['David Green', 'Life Term', '42', 'Browsing', 'Nurture'],
                ['Sarah King', 'Auto', '81', 'Comparing Quotes', 'Emailed Quote'],
            ]
        },
        'renewal': {
            stats: [ { label: 'Renewals 30 Days', value: '4,102', color: 'text-blue-600' }, { label: 'Retained', value: '3,800', color: 'text-green-500' }, { label: 'At Risk', value: '302', color: 'text-amber-500' } ],
            actionLabel: 'Send Bulk Reminder',
            tabs: [ { id: 'main', label: 'Upcoming Renewals' }, { id: 'history', label: 'Lapsed Policies' }, { id: 'audit', label: 'Retention Campaigns' } ],
            tableCols: ['Policy ID', 'Customer', 'Expiry Date', 'Prem. Due', 'Reminders Sent'],
            tableData: [
                ['POL-2231', 'Tom Clark', '2026-04-15', '$200', '2 (SMS, Email)'],
                ['POL-9281', 'Rachel Zane', '2026-04-18', '$50', '1 (Email)'],
                ['POL-1192', 'Mike Ross', '2026-04-11', '$300', '3 (SMS, WhatsApp)'],
            ]
        },
        'billing': {
            stats: [ { label: 'MTD Collection', value: '$2.4M', color: 'text-blue-600' }, { label: 'Failed TXNs', value: '12', color: 'text-red-500' }, { label: 'Pending Refund', value: '4', color: 'text-amber-500' } ],
            actionLabel: 'Create Invoice',
            tabs: [ { id: 'main', label: 'Recent Transactions' }, { id: 'history', label: 'Invoices' }, { id: 'audit', label: 'Reconciliation' } ],
            tableCols: ['TXN ID', 'Policy / Invoice ID', 'Date', 'Amount', 'Status'],
            tableData: [
                ['TXN-00192', 'INV-8821', '2026-04-11', '$150.00', 'Success'],
                ['TXN-00193', 'INV-9923', '2026-04-11', '$89.00', 'Failed'],
                ['TXN-00194', 'INV-1102', '2026-04-10', '$320.00', 'Success'],
            ]
        },
        'communication': {
            stats: [ { label: 'Msg Sent (Today)', value: '8,402', color: 'text-blue-600' }, { label: 'Delivery Rate', value: '99.1%', color: 'text-green-500' }, { label: 'Bounce', value: '0.9%', color: 'text-amber-500' } ],
            actionLabel: 'New Broadcast',
            tabs: [ { id: 'main', label: 'Delivery Logs' }, { id: 'history', label: 'Templates' }, { id: 'audit', label: 'WhatsApp Webhooks' } ],
            tableCols: ['Log ID', 'Recipient', 'Channel', 'Template', 'Status'],
            tableData: [
                ['LOG-402', '+190283123', 'SMS', 'Renewal_Rem_v2', 'Delivered'],
                ['LOG-403', 'user@mail.com', 'Email', 'Payment_Success', 'Delivered'],
                ['LOG-404', '+190284411', 'WhatsApp', 'Claim_Update', 'Read'],
            ]
        },
        'documents': {
            stats: [ { label: 'Total Storage', value: '4.2 TB', color: 'text-blue-600' }, { label: 'Docs Uploaded', value: '891K', color: 'text-green-500' }, { label: 'Unverified KYC', value: '120', color: 'text-amber-500' } ],
            actionLabel: 'Upload Document',
            tabs: [ { id: 'main', label: 'Document Repository' }, { id: 'history', label: 'E-Sign Requests' }, { id: 'audit', label: 'Access Logs' } ],
            tableCols: ['Doc ID', 'Related To', 'Type', 'Size', 'Upload Date'],
            tableData: [
                ['DOC-112', 'POL-829103', 'Policy Contract', '2.1 MB', '2026-03-12'],
                ['DOC-113', 'CLM-2093', 'Hospital Bill', '4.5 MB', '2026-04-10'],
                ['DOC-114', 'USR-992', 'Aadhar / SSN', '1.2 MB', '2026-04-11'],
            ]
        },
        'reports': {
            stats: [ { label: 'Active Dashboards', value: '14', color: 'text-blue-600' }, { label: 'Scheduled Jobs', value: '6', color: 'text-green-500' }, { label: 'Exports Today', value: '82', color: 'text-amber-500' } ],
            actionLabel: 'Build Custom Report',
            tabs: [ { id: 'main', label: 'Standard Reports' }, { id: 'history', label: 'My Saved Views' }, { id: 'audit', label: 'Data Export Schedules' } ],
            tableCols: ['Report Name', 'Category', 'Last Run', 'Format', 'Access'],
            tableData: [
                ['Daily Premium Coll.', 'Finance', 'Today, 06:00 AM', 'CSV', 'Restricted'],
                ['Agent Performance MTD', 'Sales', 'Yesterday, 23:59 PM', 'PDF', 'Public'],
                ['Loss Ratio Q1', 'Actuarial', '2026-04-01', 'Excel', 'Restricted'],
            ]
        },
        'marketing': {
            stats: [ { label: 'Active Campaigns', value: '3', color: 'text-blue-600' }, { label: 'Open Rate', value: '28%', color: 'text-green-500' }, { label: 'Leads Generated', value: '412', color: 'text-amber-500' } ],
            actionLabel: 'Create Campaign',
            tabs: [ { id: 'main', label: 'Campaign Manager' }, { id: 'history', label: 'Lead Scoring' }, { id: 'audit', label: 'Audience Segments' } ],
            tableCols: ['Campaign', 'Channel', 'Audience', 'Sent', 'Engaged'],
            tableData: [
                ['Q2 Health Promo', 'Email', 'Lapsed_Past_Year', '12,000', '1,402'],
                ['Auto Cross-sell', 'SMS', 'Health_Holders_Only', '8,400', '920'],
                ['Diwali Term Pitch', 'WhatsApp', 'Age_30_45', '4,200', '801'],
            ]
        },
        'workflow': {
            stats: [ { label: 'Active Rules', value: '42', color: 'text-blue-600' }, { label: 'Tasks Auto-Routed', value: '1.2K', color: 'text-green-500' }, { label: 'SLA Breaches', value: '0', color: 'text-amber-500' } ],
            actionLabel: 'New Rule',
            tabs: [ { id: 'main', label: 'Rules Engine' }, { id: 'history', label: 'Task Queues' }, { id: 'audit', label: 'SLA Monitor' } ],
            tableCols: ['Rule Name', 'Trigger', 'Action', 'Priority', 'Status'],
            tableData: [
                ['Auto-Approve Claim <$100', 'Claim Filed', 'Approve & Pay', 'High', 'Active'],
                ['Route VIP Renewals', 'Renewal -30D', 'Assign to Sr. Agent', 'Medium', 'Active'],
                ['Flag High Risk', 'Score > 80', 'Manual Underwriting', 'Highest', 'Active'],
            ]
        },
        'customer-portal': {
            stats: [ { label: 'Active Logins 24h', value: '12K', color: 'text-blue-600' }, { label: 'Self-Serve Rate', value: '64%', color: 'text-green-500' }, { label: 'Support Tickets', value: '89', color: 'text-amber-500' } ],
            actionLabel: 'Portal Settings',
            tabs: [ { id: 'main', label: 'User Sessions' }, { id: 'history', label: 'Service Requests' }, { id: 'audit', label: 'Portal Analytics' } ],
            tableCols: ['User', 'Last Login', 'Browser', 'Location', 'Action Taken'],
            tableData: [
                ['johndoe@app.com', '10 mins ago', 'Chrome / Mobile', 'Mumbai', 'Downloaded Cert.'],
                ['sarah@company.com', '1 hour ago', 'Safari / Mac', 'Delhi', 'Paid Premium'],
                ['mike199@web.com', '4 hours ago', 'App / iOS', 'Bangalore', 'Filed Claim'],
            ]
        },
        'compliance': {
            stats: [ { label: 'Compliance Score', value: '100%', color: 'text-green-500' }, { label: 'Logs Indexed', value: '2.4M', color: 'text-blue-600' }, { label: 'Pending Audits', value: '2', color: 'text-amber-500' } ],
            actionLabel: 'Generate IRDAI Report',
            tabs: [ { id: 'main', label: 'Audit Logs' }, { id: 'history', label: 'Data Retention' }, { id: 'audit', label: 'Regulatory Docs' } ],
            tableCols: ['Event ID', 'Module', 'Action Type', 'Actor', 'Timestamp'],
            tableData: [
                ['EVT-00912', 'claims-mgmt', 'Payment Released', 'SysAdmin', '2026-04-11 14:02:00'],
                ['EVT-00913', 'policy-mgmt', 'Endorsement Add', 'AGT-042', '2026-04-11 13:45:11'],
                ['EVT-00914', 'system', 'Login Failed', 'Unknown IP', '2026-04-11 12:00:21'],
            ]
        }
    };

    // Fallback config if module not perfectly matched
    const config = moduleConfigs[moduleInfo.id] || {
        stats: [ { label: 'Total Records', value: '1,000+', color: 'text-blue-600' }, { label: 'Completed', value: '80%', color: 'text-green-500' }, { label: 'Pending', value: '20%', color: 'text-amber-500' } ],
        actionLabel: 'Create New Entry',
        tabs: [ { id: 'main', label: 'Dashboard Overview' }, { id: 'history', label: 'Recent Activity' }, { id: 'audit', label: 'System Logs' } ],
        tableCols: ['Record ID', 'Description', 'Assigned To', 'Date', 'Status'],
        tableData: [
            ['REC-001', 'Initialization task', 'Admin', 'Today', 'Done'],
            ['REC-002', 'Data sync', 'System', 'Yesterday', 'Done'],
        ]
    };

    if (selectedRecord) {
        return (
            <div className="space-y-6 animate-fade-in">
                {/* Header & Breadcrumb */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedRecord(null)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">{selectedRecord[0]}</h2>
                            <p className="text-sm font-medium text-slate-500">{config.tableCols[0]}</p>
                        </div>
                    </div>
                </div>

                {/* Main Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Panel: Generic Info Cards */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Record Overview</h3>
                            <div className="grid md:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                                {config.tableCols.map((colName, idx) => (
                                    <div key={idx}>
                                        <span className="text-slate-500 block mb-1">{colName}</span>
                                        <span className="font-semibold text-slate-900">{selectedRecord[idx]}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="card-premium p-6">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Related Events</h3>
                            <div className="py-6 text-center text-slate-500">
                                <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p>No recent timeline events found for this record.</p>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Generic Actions */}
                    <div className="space-y-6">
                        <div className="card-premium p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">Available Actions</h3>
                            <div className="space-y-3">
                                <button className="w-full text-center py-2 bg-blue-50 text-blue-700 rounded-xl font-semibold hover:bg-blue-100 transition border border-blue-200">Edit Details</button>
                                <button className="w-full text-center py-2 bg-slate-50 text-slate-700 rounded-xl font-semibold hover:bg-slate-100 transition border border-slate-200">Export PDF</button>
                                <button className="w-full text-center py-2 bg-red-50 text-red-700 rounded-xl font-semibold hover:bg-red-100 transition border border-red-200 mt-6">Delete / Archive</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                {config.stats.map((stat, i) => (
                    <div key={i} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                        <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
                        <p className={`text-3xl font-extrabold ${stat.color} mt-1`}>{stat.value}</p>
                    </div>
                ))}
                
                <div 
                    className="p-4 bg-blue-600 rounded-xl shadow-sm border border-blue-700 flex items-center justify-center cursor-pointer hover:bg-blue-700 transition" 
                    onClick={() => setShowActionModal(true)}
                >
                    <p className="text-lg font-bold text-white flex items-center gap-2">
                        <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>
                        {config.actionLabel}
                    </p>
                </div>
            </div>

            {/* Main Tabs and Content */}
            <div className="card-premium p-6">
                <div className="flex border-b border-slate-200 mb-6">
                    {config.tabs.map(tab => (
                        <button 
                            key={tab.id}
                            className={`pb-3 px-4 font-semibold text-sm ${activeTab === tab.id ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'main' && (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <input type="text" placeholder="Search..." className="input-premium py-2 max-w-sm text-sm" />
                            <div className="flex gap-2">
                                <button className="text-sm px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50">Export</button>
                                <button className="text-sm px-4 py-2 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50">Filter</button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600 border-collapse">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500 border-b border-slate-200">
                                    <tr>
                                        {config.tableCols.map((col, idx) => (
                                            <th key={idx} className="px-4 py-3 font-semibold">{col}</th>
                                        ))}
                                        <th className="px-4 py-3 font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {config.tableData.map((row, rowIdx) => (
                                        <tr key={rowIdx} className="border-b border-slate-100 hover:bg-slate-50 transition">
                                            {row.map((cell, cellIdx) => (
                                                <td key={cellIdx} className={`px-4 py-3 ${cellIdx === 0 ? 'font-semibold text-blue-600 cursor-pointer hover:underline' : ''}`}>
                                                    {cell}
                                                </td>
                                            ))}
                                            <td className="px-4 py-3">
                                                <button onClick={() => setSelectedRecord(row)} className="text-white hover:bg-blue-700 bg-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm">Manage & View</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
                
                {activeTab !== 'main' && (
                    <div className="py-12 text-center text-slate-500">
                        <svg className="w-12 h-12 mx-auto text-slate-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        <p className="text-lg font-medium text-slate-700">Detailed View Construction</p>
                        <p className="text-sm mt-1">This detailed subsection for "{config.tabs.find(t => t.id === activeTab)?.label}" is currently connected to backend processes and rendering UI structure.</p>
                    </div>
                )}
            </div>

            {/* Generic Action Modal */}
            {showActionModal && (
                <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900">{config.actionLabel}</h2>
                            <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-slate-600">
                                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-sm text-blue-700">
                                Complete the form to successfully execute <strong>{config.actionLabel}</strong> action.
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Primary Identifier / Name</label>
                                <input type="text" className="input-premium w-full" placeholder="Enter details..." />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Context / Category</label>
                                <select className="input-premium w-full">
                                    <option>Standard Default</option>
                                    <option>High Priority / Urgent</option>
                                    <option>Internal Review</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Additional Notes</label>
                                <textarea className="input-premium w-full" rows="3" placeholder="Description..."></textarea>
                            </div>
                        </div>
                        <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                            <button onClick={() => setShowActionModal(false)} className="px-5 py-2 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition">Cancel</button>
                            <button onClick={() => setShowActionModal(false)} className="btn-primary">Confirm & Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
