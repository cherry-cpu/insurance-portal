import React, { useState } from 'react';

export default function HospitalNetworkMgmtView() {
    const [personaFocus, setPersonaFocus] = useState('ADMIN'); // 'ADMIN' or 'CUSTOMER'
    const [adminContext, setAdminContext] = useState('ADD'); // ADD, MAP, TARIFF
    
    const [hospitalData, setHospitalData] = useState({ name: '', city: '', tier: 'TIER_1' });
    const [mapData, setMapData] = useState({ hospitalId: 'HOSP-101', planId: 'HLTH-COMP', isCashless: true });
    const [tariffData, setTariffData] = useState({ hospitalId: 'HOSP-101', procedureName: 'Cardiac Bypass', coverage: '500000' });

    const [locationSearch, setLocationSearch] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    
    // Admin Handlers
    const handleAddHospital = (e) => {
        e.preventDefault();
        alert(`Admin Config Simulated:\nPOST /api/hospitals/add\nHospital "${hospitalData.name}" inserted to master grid.`);
    };
    const handleMapPlan = (e) => {
        e.preventDefault();
        alert(`Admin Config Simulated:\nPOST /api/hospitals/map-plan\nPlan ${mapData.planId} securely mapped to ${mapData.hospitalId} (Cashless: ${mapData.isCashless}).`);
    };
    const handleSetTariff = (e) => {
        e.preventDefault();
        alert(`Admin Config Simulated:\nPOST /api/hospitals/tariffs\nProcedure ${tariffData.procedureName} capped at ₹${tariffData.coverage}.`);
    };

    // Customer / System Handlers
    const handleSearchHospitals = (e) => {
        e.preventDefault();
        alert(`Customer Search Hit:\nGET /api/hospitals/search?location=${locationSearch}\nNetwork logic returning arrays.`);
        setSearchResults([
            { id: "HOSP-101", name: "Apollo City Life", city: locationSearch || "Mumbai", tier: "TIER_1", cashless: true },
            { id: "HOSP-202", name: "Sunrise General", city: locationSearch || "Mumbai", tier: "TIER_2", cashless: false }
        ]);
    };
    const handleCheckEligibility = (hospitalId) => {
        alert(`System Eligibility Node Checked:\nGET /api/hospitals/${hospitalId}/eligibility?policyNumber=POL-XYZ123`);
        if (hospitalId === 'HOSP-101') {
            alert(`✅ STATUS: 200 OK\n"Direct Cashless Approved for standard procedures."`);
        } else {
            alert(`⚠️ STATUS: 200 OK\n"Reimbursement Route ONLY. Network match failed."`);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
            {/* Header Switching Personas */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/></svg>
                        Hospital Network Engine
                    </h1>
                    <p className="text-sm font-medium text-slate-500 mt-1">Configure systemic network rules or experience customer lookup simulations.</p>
                </div>
                <div className="flex bg-slate-100 p-1 rounded-xl">
                    <button onClick={() => setPersonaFocus('ADMIN')} className={`px-6 py-2 text-sm font-bold rounded-lg transition ${personaFocus === 'ADMIN' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Admin View</button>
                    <button onClick={() => setPersonaFocus('CUSTOMER')} className={`px-6 py-2 text-sm font-bold rounded-lg transition ${personaFocus === 'CUSTOMER' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-800'}`}>Customer / System View</button>
                </div>
            </div>

            {/* ADMIN CONFIGURATION WORKSPACE */}
            {personaFocus === 'ADMIN' && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up">
                    <div className="card-premium p-6 space-y-2">
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Network Actions</h3>
                        <button onClick={() => setAdminContext('ADD')} className={`w-full text-left px-4 py-3 font-bold rounded-lg transition border ${adminContext === 'ADD' ? 'bg-blue-50 border-blue-600 text-blue-700' : 'border-transparent text-slate-700 hover:bg-slate-50'}`}>Register Provider</button>
                        <button onClick={() => setAdminContext('MAP')} className={`w-full text-left px-4 py-3 font-bold rounded-lg transition border ${adminContext === 'MAP' ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'border-transparent text-slate-700 hover:bg-slate-50'}`}>Plan Mapping Matrix</button>
                        <button onClick={() => setAdminContext('TARIFF')} className={`w-full text-left px-4 py-3 font-bold rounded-lg transition border ${adminContext === 'TARIFF' ? 'bg-amber-50 border-amber-500 text-amber-700' : 'border-transparent text-slate-700 hover:bg-slate-50'}`}>Adjudication Tariffs</button>
                    </div>
                    
                    <div className="md:col-span-3">
                        {adminContext === 'ADD' && (
                            <div className="card-premium p-8 animate-fade-in">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Master Registration - New Hospital</h3>
                                <form onSubmit={handleAddHospital} className="space-y-4 max-w-xl">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Corporate/Hospital Name</label>
                                        <input type="text" required value={hospitalData.name} onChange={e => setHospitalData({...hospitalData, name: e.target.value})} className="input-premium w-full" placeholder="e.g. Apollo City Life" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Operational City</label>
                                            <input type="text" required value={hospitalData.city} onChange={e => setHospitalData({...hospitalData, city: e.target.value})} className="input-premium w-full" placeholder="e.g. Mumbai" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Grid Tier</label>
                                            <select className="input-premium w-full" value={hospitalData.tier} onChange={e => setHospitalData({...hospitalData, tier: e.target.value})}>
                                                <option value="TIER_1">Tier 1 (Premium)</option>
                                                <option value="TIER_2">Tier 2 (Standard)</option>
                                            </select>
                                        </div>
                                    </div>
                                    <button type="submit" className="px-6 py-2 mt-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition">Save to Master Grid</button>
                                </form>
                            </div>
                        )}

                        {adminContext === 'MAP' && (
                            <div className="card-premium p-8 animate-fade-in border-t-4 border-indigo-600">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Plan-to-Hospital Routing Map</h3>
                                <form onSubmit={handleMapPlan} className="space-y-4 max-w-xl">
                                    <p className="text-sm text-slate-500 mb-4">Attach specific product pipelines directly to provider nodes to handle auto-adjudication routing natively.</p>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Provider Node (Hospital ID)</label>
                                        <input type="text" className="input-premium w-full" value={mapData.hospitalId} onChange={e => setMapData({...mapData, hospitalId: e.target.value})} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Product Plan Line</label>
                                        <input type="text" className="input-premium w-full" value={mapData.planId} onChange={e => setMapData({...mapData, planId: e.target.value})} />
                                    </div>
                                    <label className="flex items-center gap-3 mt-4 cursor-pointer bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <input type="checkbox" checked={mapData.isCashless} onChange={e => setMapData({...mapData, isCashless: e.target.checked})} className="w-5 h-5 text-indigo-600 rounded" />
                                        <span className="font-bold text-slate-800">Support Direct Cashless Pipeline</span>
                                    </label>
                                    <button type="submit" className="px-6 py-2 mt-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition">Map Routes</button>
                                </form>
                            </div>
                        )}

                        {adminContext === 'TARIFF' && (
                            <div className="card-premium p-8 animate-fade-in border-t-4 border-amber-500">
                                <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-100 pb-2">Configure Claim Adjudication Tariffs</h3>
                                <form onSubmit={handleSetTariff} className="space-y-4 max-w-xl">
                                    <p className="text-sm text-slate-500 mb-4">Sets mathematical caps natively during systemic claim eligibility sweeps mapping against procedure vectors.</p>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-700 mb-1">Provider Node (Hospital ID)</label>
                                        <input type="text" className="input-premium w-full" value={tariffData.hospitalId} onChange={e => setTariffData({...tariffData, hospitalId: e.target.value})} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Logical Procedure Block</label>
                                            <input type="text" className="input-premium w-full" value={tariffData.procedureName} onChange={e => setTariffData({...tariffData, procedureName: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-1">Coverage Ceiling (₹)</label>
                                            <input type="number" className="input-premium w-full font-mono font-bold" value={tariffData.coverage} onChange={e => setTariffData({...tariffData, coverage: e.target.value})} />
                                        </div>
                                    </div>
                                    <button type="submit" className="px-6 py-2 mt-4 bg-amber-500 text-white font-bold rounded-xl shadow-lg hover:bg-amber-600 transition text-slate-900">Push Rule Constraints</button>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* CUSTOMER SEARCH & SYSTEM CLAIMS VIEW */}
            {personaFocus === 'CUSTOMER' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
                    <div className="card-premium p-8">
                        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                            Network Provider Search
                        </h3>
                        <form onSubmit={handleSearchHospitals} className="mb-6 flex gap-3">
                            <input type="text" className="input-premium flex-1" placeholder="Search by Location (e.g. Mumbai)" value={locationSearch} onChange={e => setLocationSearch(e.target.value)} required />
                            <button type="submit" className="px-5 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition">Locate</button>
                        </form>
                        
                        {searchResults.length > 0 && (
                            <div className="space-y-4 animate-fade-in">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{searchResults.length} Verified Hits Resulted From Database</p>
                                {searchResults.map(res => (
                                    <div key={res.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 flex justify-between items-center group hover:border-blue-400 transition">
                                        <div>
                                            <p className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition">{res.name}</p>
                                            <p className="text-sm font-semibold text-slate-500 mt-1">{res.city} • <span className="bg-slate-200 text-slate-700 px-1 rounded text-[10px]">{res.tier}</span></p>
                                        </div>
                                        <div className="text-right flex flex-col items-end">
                                            {res.cashless ? (
                                                <span className="bg-green-100 text-green-700 text-xs font-extrabold px-3 py-1 rounded-full border border-green-200 mb-2">CASHLESS ENABLED</span>
                                            ) : (
                                                <span className="bg-amber-100 text-amber-700 text-xs font-extrabold px-3 py-1 rounded-full border border-amber-200 mb-2">REIMBURSEMENT ONLY</span>
                                            )}
                                            <button onClick={() => handleCheckEligibility(res.id)} className="text-xs text-blue-600 font-bold hover:underline">Execute Claims Eligibility Mapping >></button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-8 opacity-10">
                            <svg width="100" height="100" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v-2h-2v4zm0-6h-2V7h2v4z"/></svg>
                        </div>
                        <h3 className="font-bold text-2xl mb-2 relative z-10">Systemic Claim Adjudication Node</h3>
                        <p className="text-sm text-slate-300 font-medium mb-6 relative z-10">Clicking "Execute Claims Eligibility Mapping" simulates what happens natively inside the system when an actual claim arrives mapped against a specific hospital node block!</p>
                        <div className="bg-white/10 backdrop-blur border border-white/20 p-4 rounded-xl text-xs font-mono mb-4 text-slate-200 relative z-10">
                            > [SYSTEM CORE]: Awaiting manual trigger...<br/>
                            > [SYSTEM CORE]: Eligibility requires active Policy Validation and Tariff Array confirmation.
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
