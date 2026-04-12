/** Enterprise modules surfaced in the portal (navigation / hub). */
export const PLATFORM_MODULES = [
    {
        id: "policy-mgmt",
        title: "Policy Management",
        desc: "Create and manage insurance policies with premium, coverage, documents, status, and lifecycle updates.",
        features: [
            "Policy creation, endorsements, renewals, and cancellations",
            "Premium, coverage, beneficiary, and document storage",
            "Policy status tracking, updates, and audit history",
            "Centralized master data for all insurance contracts",
        ],
    },
    {
        id: "underwriting",
        title: "Underwriting & Risk",
        desc: "Risk assessment, medical review, premium loading, and automated underwriting decisions.",
        features: [
            "Automated underwriting risk scoring and premium calculation",
            "Medical / background check flags with review workflow",
            "Approve, reject or load premium decisions using rule engine",
            "Underwriting cases tracked with audit-ready status and notes",
        ],
    },
    {
        id: "claims-mgmt",
        title: "Claims Management",
        desc: "Register claims, track status, validate documentation, and manage settlement workflows.",
        features: [
            "Claim intake with customer and policy linkage",
            "Document upload, validation, and verification workflows",
            "Status tracking, issue escalation, and admin review",
            "Claim history, settlement notes, and audit trail",
        ],
    },
    {
        id: "agent",
        title: "Agent / Broker Portal",
        desc: "Agent login, dashboards, commissions, and performance monitoring for distributors.",
        features: [
            "Agent and broker authentication with role controls",
            "Commission tracking and incentive reporting",
            "Lead assignment, sales pipeline, and performance KPIs",
            "Partner portal for policy issuance and renewals",
        ],
    },
    {
        id: "sales",
        title: "Sales & Quotation",
        desc: "Generate quotes, compare plans, and convert offers into policies quickly.",
        features: [
            "Quote generation and premium calculation",
            "Plan comparison and product recommendation",
            "Convert quote to policy with one click",
            "Sales funnel tracking and proposal history",
        ],
    },
    {
        id: "renewal",
        title: "Renewal & Follow-up",
        desc: "Automated renewal reminders, follow-up scheduling, and lapse prevention alerts.",
        features: [
            "Renewal reminder automation via SMS, email, WhatsApp",
            "Follow-up scheduling and agent assignment",
            "Policy lapse prevention workflows",
            "Renewal analytics and retention tracking",
        ],
    },
    {
        id: "billing",
        title: "Payment & Billing",
        desc: "Track premium collection, invoices, payment status, and billing history.",
        features: [
            "Premium receipt tracking and invoice generation",
            "Payment status, history, refunds, and reconciliations",
            "Integration-ready for Razorpay and bank payments",
            "Billing dashboard for finance and collections",
        ],
    },
    {
        id: "finance",
        title: "Finance & Accounting",
        desc: "General ledger, revenue tracking, GST filings, and accounting control.",
        features: [
            "Ledger journal entries for premium and claims accounting",
            "Revenue tracking with GST tax breakdown",
            "GST transaction reporting and filing readiness",
            "Finance dashboards for compliance and P&L review",
        ],
    },
    {
        id: "communication",
        title: "Communication",
        desc: "Log emails, calls, WhatsApp messages, notifications, and customer interactions.",
        features: [
            "Centralized communication history per customer",
            "Template-based SMS, email and WhatsApp alerts",
            "Notification and task alerts for renewals and claims",
            "Customer interaction logs for service and audit",
        ],
    },
    {
        id: "documents",
        title: "Document Management",
        desc: "Upload policy docs, KYC documents, claim files, and support e-signatures securely.",
        features: [
            "Secure upload and storage for policy, claim, and KYC documents",
            "E-signature support and document status tracking",
            "Document indexing, search, and audit-ready access",
            "Access controls for sensitive files",
        ],
    },
    {
        id: "reports",
        title: "Reports & Analytics",
        desc: "Sales reports, agent performance, customer insights and segmentation analytics.",
        features: [
            "Executive dashboards for sales and operations",
            "Agent performance and commission reports",
            "Customer segmentation and portfolio insights",
            "Policy, claims and renewal analytics",
        ],
    },
    {
        id: "marketing",
        title: "Marketing Automation",
        desc: "Manage campaigns, bulk messaging, leads, and nurture journeys.",
        features: [
            "Campaign creation and segmentation",
            "Bulk SMS, email and WhatsApp messaging",
            "Lead nurturing and follow-up workflows",
            "Performance tracking for marketing outreach",
        ],
    },
    {
        id: "workflow",
        title: "Workflow Automation",
        desc: "Auto task assignment, approval workflows, and business rules automation.",
        features: [
            "Auto-assignment of policy, claim, and renewal tasks",
            "Approval workflows for underwriting and claims",
            "Business rules engine for routing and escalation",
            "SLA alerts and exception handling",
        ],
    },
    {
        id: "customer-portal",
        title: "Customer Self-Service Portal",
        desc: "Customer login to view policies, claims, documents, and request changes.",
        features: [
            "Customer authentication and self-service login",
            "Policy and claim status visibility",
            "Download documents and submit service requests",
            "Request endorsements, renewals, and support updates",
        ],
    },
    {
        id: "compliance",
        title: "Compliance & Audit",
        desc: "Audit trails, regulatory logs, and retention policies for insurance governance.",
        features: [
            "IRDAI compliance logging and audit reports",
            "Document retention and access audit trails",
            "Policy and claim change history",
            "Regulatory readiness and governance controls",
        ],
    },
    {
        id: "company-master",
        title: "Company Master",
        desc: "Insurance Company Master to manage carrier integrations and agreements.",
        features: [
            "Carrier core configuration and registry maps",
            "Maintain associated products / plans offered natively",
            "Track commission matrices and brokerage contacts",
            "Build and govern Network Coverage Logical rules",
        ],
    },
];
