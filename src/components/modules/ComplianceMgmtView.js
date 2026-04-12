import { useEffect, useState } from "react";
import { apiGet, apiPost } from "../../api/client";

export default function ComplianceMgmtView() {
    const [summary, setSummary] = useState({ complianceScore: '...', auditEventCount: 0, regulatoryReportCount: 0, irdaReportCount: 0, pendingAudits: 0, nextReview: '...' });
    const [auditLogs, setAuditLogs] = useState([]);
    const [reports, setReports] = useState([]);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        try {
            const [summaryData, logs, reportData] = await Promise.all([
                apiGet("/api/compliance/summary"),
                apiGet("/api/compliance/audit-logs"),
                apiGet("/api/compliance/reports"),
            ]);
            setSummary(summaryData);
            setAuditLogs(logs);
            setReports(reportData);
        } catch (error) {
            console.error(error);
            setMessage("Unable to load compliance data. Refresh to retry.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const generateIrdaReport = async () => {
        setIsSubmitting(true);
        try {
            const report = await apiPost("/api/compliance/reports/generate", {
                reportType: "IRDAI",
                period: "Q1 2026",
                generatedBy: 1,
            });
            setReports(prev => [report, ...prev]);
            setMessage("IRDAI compliance report generated successfully.");
            loadData();
        } catch (error) {
            console.error(error);
            setMessage("Failed to generate IRDAI report.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const submitReport = async (reportId) => {
        setIsSubmitting(true);
        try {
            const updated = await apiPost(`/api/compliance/reports/${reportId}/submit`, {
                submittedTo: "IRDAI",
            });
            setReports(prev => prev.map(report => report.id === updated.id ? updated : report));
            setMessage(`Report ${updated.id} submitted to IRDAI.`);
            loadData();
        } catch (error) {
            console.error(error);
            setMessage("Unable to submit the report.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <h2 className="text-xl font-semibold text-slate-900 mb-3">IRDAI Compliance</h2>
                    <p className="text-sm text-slate-500 mb-6">Track regulatory audit activity and generate filings for Indian insurance compliance.</p>
                    <div className="space-y-3 text-sm text-slate-700">
                        <div className="flex items-center justify-between"><span>Compliance Score</span><strong>{summary.complianceScore}</strong></div>
                        <div className="flex items-center justify-between"><span>Audit Events</span><strong>{summary.auditEventCount}</strong></div>
                        <div className="flex items-center justify-between"><span>Regulatory Reports</span><strong>{summary.regulatoryReportCount}</strong></div>
                        <div className="flex items-center justify-between"><span>IRDAI Reports</span><strong>{summary.irdaReportCount}</strong></div>
                    </div>
                </div>
                <div className="p-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-semibold text-slate-900 mb-3">Regulatory Readiness</h3>
                    <div className="space-y-3 text-sm text-slate-600">
                        <div className="flex items-center justify-between"><span>Pending audits</span><strong>{summary.pendingAudits}</strong></div>
                        <div className="flex items-center justify-between"><span>Next review</span><strong>{summary.nextReview}</strong></div>
                        <div className="pt-4">
                            <button
                                onClick={generateIrdaReport}
                                disabled={isSubmitting}
                                className="w-full py-3 bg-blue-600 text-white rounded-2xl font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                            >
                                {isSubmitting ? 'Generating report...' : 'Generate IRDAI Report'}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-slate-900 rounded-3xl shadow-sm text-white">
                    <h3 className="text-lg font-semibold mb-3">Audit Compliance</h3>
                    <p className="text-sm text-slate-300 mb-4">All audit logs are stored with full context for IRDAI review and internal governance.</p>
                    <div className="space-y-3 text-sm text-slate-200">
                        <div className="flex items-center justify-between"><span>Audit-ready modules</span><strong>Policy, Claim, Doc</strong></div>
                        <div className="flex items-center justify-between"><span>Retention window</span><strong>7 years</strong></div>
                    </div>
                </div>
            </div>

            {message && (
                <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-900">Audit Logs</h3>
                            <p className="text-sm text-slate-500">Latest compliance actions captured across the platform.</p>
                        </div>
                        <button
                            onClick={loadData}
                            className="text-sm px-4 py-2 border border-slate-300 rounded-full text-slate-700 hover:bg-slate-50"
                        >Refresh</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-sm text-slate-600">
                            <thead className="bg-slate-50 text-slate-500 uppercase text-xs tracking-wide">
                                <tr>
                                    <th className="px-4 py-3">Event</th>
                                    <th className="px-4 py-3">Module</th>
                                    <th className="px-4 py-3">Actor</th>
                                    <th className="px-4 py-3">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {auditLogs.slice(0, 8).map(log => (
                                    <tr key={log.id} className="border-b border-slate-100 hover:bg-slate-50">
                                        <td className="px-4 py-3 font-medium text-slate-900">{log.action}</td>
                                        <td className="px-4 py-3">{log.entityType || 'System'}</td>
                                        <td className="px-4 py-3">{log.actorUserId || 'Unknown'}</td>
                                        <td className="px-4 py-3">{new Date(log.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Regulatory Reports</h3>
                    <div className="space-y-4">
                        {reports.slice(0, 5).map(report => (
                            <div key={report.id} className="rounded-3xl border border-slate-200 p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <p className="text-sm text-slate-500">{report.reportType} report</p>
                                        <p className="font-semibold text-slate-900">{report.period || 'Current cycle'}</p>
                                        <p className="text-xs text-slate-400 mt-2">Status: {report.status}</p>
                                    </div>
                                    <button
                                        onClick={() => submitReport(report.id)}
                                        disabled={isSubmitting || report.status === 'SUBMITTED'}
                                        className="text-sm px-3 py-2 rounded-full border border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 transition disabled:opacity-40"
                                    >
                                        {report.status === 'SUBMITTED' ? 'Submitted' : 'Submit'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isLoading && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-700">
                    Loading compliance dashboard...
                </div>
            )}
        </div>
    );
}
