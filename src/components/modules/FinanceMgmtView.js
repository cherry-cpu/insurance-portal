import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/client";

export default function FinanceMgmtView() {
    const [summary, setSummary] = useState({ totalRevenue: 0, totalGstCaptured: 0, pendingGstLiability: 0, ledgerEntries: 0, revenueRecords: 0 });
    const [ledgerEntries, setLedgerEntries] = useState([]);
    const [gstTransactions, setGstTransactions] = useState([]);
    const [revenueRecords, setRevenueRecords] = useState([]);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [summaryData, ledgerData, gstData, revenueData] = await Promise.all([
                apiGet("/api/finance/summary"),
                apiGet("/api/finance/ledger"),
                apiGet("/api/finance/gst/transactions"),
                apiGet("/api/finance/revenue"),
            ]);
            setSummary(summaryData);
            setLedgerEntries(ledgerData);
            setGstTransactions(gstData);
            setRevenueRecords(revenueData);
        } catch (error) {
            setMessage("Unable to load finance data. Please refresh.");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const submitGstFiling = async () => {
        try {
            const result = await apiPost("/api/finance/gst/filing", { period: "April 2026" });
            setMessage(`GST filing ready: ${result.submissionReference}`);
        } catch (error) {
            setMessage("GST filing generation failed.");
            console.error(error);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Total Revenue</p>
                    <p className="text-3xl font-extrabold text-slate-900 mt-3">₹{(summary.totalRevenue / 100).toLocaleString()}</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">GST Captured</p>
                    <p className="text-3xl font-extrabold text-green-600 mt-3">₹{(summary.totalGstCaptured / 100).toLocaleString()}</p>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <p className="text-sm font-semibold text-slate-500">Pending GST Liability</p>
                    <p className="text-3xl font-extrabold text-amber-600 mt-3">₹{(summary.pendingGstLiability / 100).toLocaleString()}</p>
                </div>
                <div className="p-6 bg-slate-900 text-white rounded-3xl shadow-sm border border-slate-800">
                    <p className="text-sm font-semibold uppercase text-slate-300">Accounting Health</p>
                    <p className="text-3xl font-extrabold mt-3">{summary.ledgerEntries} entries</p>
                    <p className="text-sm text-slate-400 mt-2">{summary.revenueRecords} revenue records</p>
                </div>
            </div>

            {message && (
                <div className="rounded-3xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-slate-900">Ledger Overview</h2>
                            <p className="text-sm text-slate-500">Debit / credit entries and GST allocations for policy accounting.</p>
                        </div>
                        <button onClick={loadData} className="px-4 py-2 text-sm font-semibold rounded-full border border-slate-300 hover:bg-slate-50 transition">Refresh</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                                <tr>
                                    <th className="px-4 py-3">Account</th>
                                    <th className="px-4 py-3">Type</th>
                                    <th className="px-4 py-3">Amount</th>
                                    <th className="px-4 py-3">GST</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledgerEntries.slice(0, 8).map(entry => (
                                    <tr key={entry.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">{entry.accountName}</td>
                                        <td className="px-4 py-3">{entry.entryType}</td>
                                        <td className="px-4 py-3">₹{(entry.amountPaise ?? 0) / 100}</td>
                                        <td className="px-4 py-3">₹{(entry.gstAmountPaise ?? 0) / 100}</td>
                                        <td className="px-4 py-3">{entry.entryDate || '—'}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <h2 className="text-xl font-semibold text-slate-900 mb-4">GST Filing</h2>
                    <p className="text-sm text-slate-500 mb-6">Generate the next GST filing summary for IRDAI / GSTN audit review.</p>
                    <button onClick={submitGstFiling} className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition">Generate GST Filing</button>
                    <div className="mt-6 text-sm text-slate-500">
                        <p><span className="font-semibold">Transactions</span>: {gstTransactions.length}</p>
                        <p className="mt-2">Needs reconciliation and tax reporting for input/output GST.</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900">Revenue Tracking</h2>
                        <p className="text-sm text-slate-500">Invoice-level revenue and GST performance across policies.</p>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-600">
                        <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                            <tr>
                                <th className="px-4 py-3">Invoice</th>
                                <th className="px-4 py-3">Gross</th>
                                <th className="px-4 py-3">GST</th>
                                <th className="px-4 py-3">Net</th>
                                <th className="px-4 py-3">Period</th>
                            </tr>
                        </thead>
                        <tbody>
                            {revenueRecords.slice(0, 8).map(record => (
                                <tr key={record.id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium text-slate-900">{record.invoiceNumber}</td>
                                    <td className="px-4 py-3">₹{(record.grossAmountPaise ?? 0) / 100}</td>
                                    <td className="px-4 py-3">₹{(record.gstAmountPaise ?? 0) / 100}</td>
                                    <td className="px-4 py-3">₹{(record.netAmountPaise ?? 0) / 100}</td>
                                    <td className="px-4 py-3">{record.period}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {isLoading && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">Loading finance dashboard...</div>
            )}
        </div>
    );
}
