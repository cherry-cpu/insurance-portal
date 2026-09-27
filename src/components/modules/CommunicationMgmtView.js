import React, { useState } from 'react';

export default function CommunicationMgmtView() {
    const [activeTab, setActiveTab] = useState('hub');
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [replyMode, setReplyMode] = useState(null); // 'EMAIL', 'WHATSAPP', 'CALL'
    const [messageText, setMessageText] = useState('');

    const [customersMap, setCustomersMap] = useState([
        { id: "USR-112", name: "John Doe", lastContact: "Today", unread: 2 },
        { id: "USR-99", name: "Sarah Smith", lastContact: "2 days ago", unread: 0 },
        { id: "USR-44", name: "Michael Chen", lastContact: "Last week", unread: 5 },
    ]);

    const [simulatedHistory, setSimulatedHistory] = useState([
        { channel: 'WHATSAPP', target: 'Inbound', text: 'I need help filing a claim for my health policy.', time: '10:42 AM' },
        { channel: 'EMAIL', target: 'Outbound', text: 'Your policy document #POL-112 has been successfully issued. Please find the E-certificate attached.', time: 'Yesterday, 04:12 PM' },
        { channel: 'CALL', target: 'Outbound', text: 'Call connected securely. Agent noted customer requested change of address. Duration: 04m 12s.', time: 'Mon, 11:00 AM' }
    ]);

    const handleSendCommunication = async (e) => {
        e.preventDefault();
        if (!messageText.trim()) return alert("Message cannot be empty!");
        
        alert(`Backend API Called!\nPOST /api/communications/send\nRouting ${replyMode} to Customer: ${selectedCustomer.id}\nContent: "${messageText}"`);
        
        const newLog = { 
            channel: replyMode, 
            target: 'Outbound', 
            text: replyMode === 'CALL' ? `Call log saved statically: ${messageText}` : messageText, 
            time: 'Just Now' 
        };
        
        setSimulatedHistory([newLog, ...simulatedHistory]);
        setReplyMode(null);
        setMessageText('');
    };

    if (selectedCustomer) {
        return (
            <div className="space-y-6 animate-fade-in">
                {/* Header Profile */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSelectedCustomer(null)} className="p-2 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition text-slate-500 hover:text-slate-700">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <div>
                            <h2 className="text-2xl font-extrabold text-slate-900">{selectedCustomer.name}</h2>
                            <p className="text-sm font-medium text-slate-500">Customer ID: {selectedCustomer.id}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Interactive History Timeline */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="card-premium p-6 min-h-[600px] flex flex-col">
                            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2 flex justify-between">
                                Omnichannel History
                                <button className="text-sm px-4 py-1 bg-slate-100 text-slate-600 rounded-md hover:bg-slate-200 font-semibold">Fetch /history Sync</button>
                            </h3>
                            
                            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                                {simulatedHistory.map((log, i) => (
                                    <div key={i} className={`flex flex-col ${log.target === 'Outbound' ? 'items-end' : 'items-start'}`}>
                                        <div className={`max-w-[85%] rounded-2xl p-4 shadow-sm border ${
                                            log.target === 'Outbound' ? 'bg-blue-50 border-blue-100 rounded-tr-sm' : 'bg-white border-slate-200 rounded-tl-sm'
                                        }`}>
                                            <div className="flex items-center justify-between gap-4 mb-2">
                                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                                    log.channel === 'WHATSAPP' ? 'bg-green-100 text-green-700' :
                                                    log.channel === 'EMAIL' ? 'bg-amber-100 text-amber-700' :
                                                    'bg-purple-100 text-purple-700'
                                                }`}>
                                                    {log.channel}
                                                </span>
                                                <span className="text-xs font-semibold text-slate-400">{log.time}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 font-medium">{log.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Operational Action Panel */}
                    <div className="space-y-6">
                        <div className="bg-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <svg width="80" height="80" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                            </div>
                            <h3 className="font-bold flex items-center gap-2 mb-2">Alerts & Rules </h3>
                            <p className="text-sm text-slate-300 opacity-90 mb-4">Customer expressed high frustration regarding claim validation via WhatsApp. Recommend calling securely to defuse tension.</p>
                            <button className="text-slate-900 bg-white px-4 py-2 text-sm font-bold rounded-lg w-full hover:bg-slate-200 transition">View Threat Alerts</button>
                        </div>
                        
                        <div className="card-premium p-6">
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">New Interaction</h3>
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                <button onClick={() => setReplyMode('EMAIL')} className={`py-2 flex flex-col items-center justify-center rounded-lg border ${replyMode === 'EMAIL' ? 'border-amber-500 bg-amber-50 text-amber-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                                    <span className="text-[10px] mt-1 uppercase">Email</span>
                                </button>
                                <button onClick={() => setReplyMode('WHATSAPP')} className={`py-2 flex flex-col items-center justify-center rounded-lg border ${replyMode === 'WHATSAPP' ? 'border-green-500 bg-green-50 text-green-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                                    <span className="text-[10px] mt-1 uppercase">WhatsApp</span>
                                </button>
                                <button onClick={() => setReplyMode('CALL')} className={`py-2 flex flex-col items-center justify-center rounded-lg border ${replyMode === 'CALL' ? 'border-purple-500 bg-purple-50 text-purple-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                                    <span className="text-[10px] mt-1 uppercase">Call Log</span>
                                </button>
                            </div>

                            {replyMode && (
                                <form onSubmit={handleSendCommunication} className="animate-fade-in">
                                    <textarea 
                                        required 
                                        value={messageText}
                                        onChange={e => setMessageText(e.target.value)}
                                        className="input-premium w-full text-sm py-3 mb-3" 
                                        rows="4" 
                                        placeholder={replyMode === 'CALL' ? "Detail the explicit phone transcript for tracking..." : `Draft secure ${replyMode} to send directly to customer...`}
                                    ></textarea>
                                    <button type="submit" className={`w-full py-2.5 rounded-lg font-bold text-white shadow-lg transition flex justify-center items-center gap-2 ${
                                        replyMode === 'WHATSAPP' ? 'bg-green-600 hover:bg-green-700 shadow-green-600/30' :
                                        replyMode === 'EMAIL' ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30' :
                                        'bg-purple-600 hover:bg-purple-700 shadow-purple-600/30'
                                    }`}>
                                        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/></svg>
                                        Execute Action
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Hub View Layout
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-slate-500">Unread WhatsApp</p>
                    <p className="text-3xl font-extrabold text-green-600 mt-1">1,241</p>
                </div>
                <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col justify-center">
                    <p className="text-sm font-semibold text-slate-500">Open Email Threads</p>
                    <p className="text-3xl font-extrabold text-amber-500 mt-1">42</p>
                </div>
                <div className="p-4 bg-purple-600 rounded-xl shadow-sm border border-purple-700 flex items-center justify-center cursor-pointer hover:bg-purple-700 transition md:col-span-2">
                    <p className="text-lg font-bold text-white flex items-center gap-2">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                        Global Notification Broadcast
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left Listing */}
                <div className="md:col-span-2 card-premium p-6">
                    <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                        <h3 className="text-lg font-bold text-slate-800">Omnichannel Customer Hub</h3>
                        <input type="text" placeholder="Search customer ID..." className="input-premium py-2 max-w-sm text-sm" />
                    </div>
                    
                    <div className="space-y-3">
                        {customersMap.map((user) => (
                            <div key={user.id} onClick={() => setSelectedCustomer(user)} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition relative group">
                                {user.unread > 0 && (
                                    <div className="absolute top-0 right-0 -mt-2 -mr-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white">
                                        {user.unread}
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-lg">
                                        {user.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 group-hover:text-blue-700 transition">{user.name}</p>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{user.id}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-semibold text-slate-600">{user.lastContact}</p>
                                    <p className="text-xs text-slate-400">Last activity</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications & System Alerts Dashboard */}
                <div className="space-y-6">
                    <div className="card-premium p-6">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 border-b border-slate-100 pb-2">Global System Alerts</h3>
                        
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-red-500 animate-pulse"></span>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">WhatsApp Gateway Failed</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Integration down. Last 10 outbound messages queued locally.</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">10 min ago</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-amber-500"></span>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">KYC Bounce Warning</p>
                                    <p className="text-xs text-slate-500 mt-0.5">High rate of rejection mapping to USR-1021. Investigate identity matches.</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">1 hour ago</p>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <span className="w-2 h-2 mt-2 shrink-0 rounded-full bg-blue-500"></span>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">System Deployment</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Version 2.0 UI templates successfully distributed to mail channels.</p>
                                    <p className="text-[10px] font-bold text-slate-400 mt-1">Yesterday</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
