import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageShell from "../components/PageShell";
import { PLATFORM_MODULES } from "../data/platformModules";
import { useState } from "react";
import PolicyMgmtView from "../components/modules/PolicyMgmtView";
import GenericModuleView from "../components/modules/GenericModuleView";
import ClaimsMgmtView from "../components/modules/ClaimsMgmtView";
import DocumentsMgmtView from "../components/modules/DocumentsMgmtView";
import CommunicationMgmtView from "../components/modules/CommunicationMgmtView";
import CustomerPortalView from "../components/modules/CustomerPortalView";
import ReportsMgmtView from "../components/modules/ReportsMgmtView";
import CompanyMasterMgmtView from "../components/modules/CompanyMasterMgmtView";
import UnderwritingMgmtView from "../components/modules/UnderwritingMgmtView";
import FinanceMgmtView from "../components/modules/FinanceMgmtView";
import ComplianceMgmtView from "../components/modules/ComplianceMgmtView";

export default function ModuleDetail() {
    const { moduleId } = useParams();
    const moduleInfo = PLATFORM_MODULES.find(m => m.id === moduleId);
    
    // Some dummy state for interactive feel
    const [search, setSearch] = useState("");

    if (!moduleInfo) {
        return (
            <PageShell>
                <Navbar />
                <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 text-center">
                    <h1 className="text-2xl font-bold text-slate-900">Module not found</h1>
                    <Link to="/modules" className="text-blue-600 hover:underline mt-4 inline-block">Back to Modules</Link>
                </div>
            </PageShell>
        );
    }

    return (
        <PageShell>
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link to="/modules" className="text-slate-400 hover:text-blue-600 transition">
                        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
                    </Link>
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Enterprise Module</p>
                        <h1 className="mt-1 text-3xl font-extrabold text-slate-900">{moduleInfo.title}</h1>
                    </div>
                </div>

                {/* Main Content Area */}
                {moduleInfo.id === 'policy-mgmt' ? (
                    <PolicyMgmtView />
                ) : moduleInfo.id === 'claims-mgmt' ? (
                    <ClaimsMgmtView />
                ) : moduleInfo.id === 'documents' ? (
                    <DocumentsMgmtView />
                ) : moduleInfo.id === 'communication' ? (
                    <CommunicationMgmtView />
                ) : moduleInfo.id === 'customer-portal' ? (
                    <CustomerPortalView />
                ) : moduleInfo.id === 'reports' ? (
                    <ReportsMgmtView />
                ) : moduleInfo.id === 'company-master' ? (
                    <CompanyMasterMgmtView />
                ) : moduleInfo.id === 'underwriting' ? (
                    <UnderwritingMgmtView />
                ) : moduleInfo.id === 'finance' ? (
                    <FinanceMgmtView />
                ) : moduleInfo.id === 'compliance' ? (
                    <ComplianceMgmtView />
                ) : (
                    <GenericModuleView moduleInfo={moduleInfo} />
                )}
            </div>
        </PageShell>
    );
}
