import React, { useState } from 'react';

export default function ReportsMgmtView() {
    const [activeTab, setActiveTab] = useState('sales');

    const fetchBackendData = (endpoint) => {
        alert(`Backend API Linked!\nGET /api/reports/${endpoint}\n(Simulating pulling fresh analytics...)`);
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
            {/* Global Executive Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"/></svg>
                        Analytics Intelligence
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Enterprise reporting, agent metrics, and live segmentation.</p>
                </div>
                <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-50 text-slate-700 font-bold border border-slate-200 rounded-lg hover:bg-slate-100 transition">Export CSV</button>
                    <button className="px-4 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 shadow-lg shadow-blue-600/30 transition">Download PDF Report</button>
                </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="flex gap-4 border-b border-slate-200 pb-2">
                <button 
                    onClick={() => { setActiveTab('sales'); fetchBackendData('sales'); }} 
                    className={`font-bold text-sm pb-2 px-2 transition ${activeTab === 'sales' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >Sales & Revenue</button>
                <button 
                    onClick={() => { setActiveTab('agents'); fetchBackendData('agents'); }} 
                    className={`font-bold text-sm pb-2 px-2 transition ${activeTab === 'agents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >Agent Performance</button>
                <button 
                    onClick={() => { setActiveTab('insights'); fetchBackendData('insights'); }} 
                    className={`font-bold text-sm pb-2 px-2 transition ${activeTab === 'insights' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >Customer Insights</button>
            </div>

            {/* Dynamic Rendering Based on Tab */}
            {activeTab === 'sales' && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card-premium p-6 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                            <p className="text-sm font-semibold opacity-90">Q2 Total Revenue</p>
                            <p className="text-4xl font-extrabold mt-2">$4.2M</p>
                            <p className="text-sm font-bold flex items-center gap-1 mt-4 text-green-300">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 7a1 1 0 110-2h5v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L6 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0L10 10.586 13.586 7H12z" clipRule="evenodd"/></svg>
                                +12.5% vs Last Quarter
                            </p>
                        </div>
                        <div className="card-premium p-6">
                            <p className="text-sm font-semibold text-slate-500">New Policies Written</p>
                            <p className="text-4xl font-extrabold mt-2 text-slate-900">1,842</p>
                            <p className="text-sm font-bold flex items-center gap-1 mt-4 text-slate-400">
                                Across 4 product lines
                            </p>
                        </div>
                        <div className="card-premium p-6">
                            <p className="text-sm font-semibold text-slate-500">Gross Written Premium (GWP)</p>
                            <p className="text-4xl font-extrabold mt-2 text-slate-900">$5.8M</p>
                            <p className="text-sm font-bold flex items-center gap-1 mt-4 text-red-500">
                                <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M12 13a1 1 0 100 2h5v-5a1 1 0 10-2 0v1.586l-4.293-4.293a1 1 0 00-1.414 0L6 10.586l-3.293-3.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0L10 9.414 13.586 13H12z" clipRule="evenodd"/></svg>
                                2% short of target
                            </p>
                        </div>
                    </div>

                    <div className="card-premium p-6">
                        <h3 className="text-lg font-bold text-slate-900 mb-6">Revenue by Product Line</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-sm font-bold mb-2"><span className="text-slate-700">Health Premium</span><span className="text-blue-600">$2.8M</span></div>
                                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: '100%' }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-bold mb-2"><span className="text-slate-700">Wellness Services</span><span className="text-amber-500">$750K</span></div>
                                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-amber-500 h-2 rounded-full" style={{ width: '25%' }}></div></div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm font-bold mb-2"><span className="text-slate-700">Member Services</span><span className="text-purple-600">$320K</span></div>
                                <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-purple-600 h-2 rounded-full" style={{ width: '12%' }}></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'agents' && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="card-premium p-6 border-l-4 border-green-500">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Top Performers (Leaderboard)</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 text-green-700 rounded-full flex items-center justify-center font-bold">#1</div>
                                        <div><p className="font-bold text-slate-900">David G. (AGT-101)</p><p className="text-xs text-slate-500">Health Specialist</p></div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-green-600">142 Policies</p>
                                        <p className="text-xs font-bold text-amber-500">⭐ 4.9 CSAT</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center font-bold">#2</div>
                                        <div><p className="font-bold text-slate-900">Sarah M. (AGT-108)</p><p className="text-xs text-slate-500">Health Wellness Lead</p></div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-slate-700">98 Policies</p>
                                        <p className="text-xs font-bold text-amber-500">⭐ 4.7 CSAT</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="card-premium p-6 border-l-4 border-amber-500">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Agent Resource Distribution</h3>
                            <div className="flex items-center justify-center py-4">
                                <div className="relative w-40 h-40 rounded-full border-[16px] border-blue-100 flex items-center justify-center outline-blue-600 outline-4 outline-offset-[-16px]">
                                    <div className="text-center">
                                        <p className="text-2xl font-extrabold text-slate-800">42</p>
                                        <p className="text-xs text-slate-500 font-bold uppercase">Total Agents</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-center gap-6 mt-4">
                                <div className="text-center"><p className="text-sm font-bold text-blue-600">32%</p><p className="text-xs text-slate-500">Tier 1</p></div>
                                <div className="text-center"><p className="text-sm font-bold text-slate-700">58%</p><p className="text-xs text-slate-500">Tier 2</p></div>
                                <div className="text-center"><p className="text-sm font-bold text-amber-600">10%</p><p className="text-xs text-slate-500">Underperforming</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'insights' && (
                <div className="space-y-6 animate-fade-in-up">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card-premium p-6 md:col-span-2">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Market Segmentation Share</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-blue-500 rounded-sm shrink-0"></div>
                                        <span className="font-bold text-slate-700">Young Professionals (25-34)</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-sm font-bold w-12 text-right">42%</span>
                                        <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">LOW CHURN RISK</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-indigo-500 rounded-sm shrink-0"></div>
                                        <span className="font-bold text-slate-700">Families & Couples (35-50)</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-sm font-bold w-12 text-right">38%</span>
                                        <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded">MED CHURN RISK</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-4 h-4 bg-slate-300 rounded-sm shrink-0"></div>
                                        <span className="font-bold text-slate-700">Retirees (65+)</span>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-sm font-bold w-12 text-right">20%</span>
                                        <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">HIGH CHURN RISK</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="card-premium p-6 bg-slate-800 text-white shadow-xl text-center flex flex-col justify-center">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Global Retention Rate</p>
                                <p className="text-6xl font-extrabold text-blue-400 mt-4 my-2">94.2%</p>
                                <p className="text-xs text-slate-300">Industry benchmark: 88.0%</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
