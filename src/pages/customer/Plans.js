import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import PageShell from "../../components/PageShell";

const plans = [
    {
        id: 1,
        name: "Health Shield",
        type: "Health",
        emoji: "❤️",
        premium: "₹12,000",
        period: "year",
        coverage: "₹5,00,000",
        popular: true,
        features: ["Hospitalization up to ₹5L", "Cashless at 5000+ hospitals", "Pre & post hospitalization", "Day care procedures", "No room rent capping"],
        gradient: "from-blue-500 to-blue-600",
    },
    {
        id: 2,
        name: "Health Essentials",
        type: "Health",
        emoji: "🩺",
        premium: "₹9,500",
        period: "year",
        coverage: "₹3,00,000",
        popular: false,
        features: ["Broad OPD cover", "Pre-existing condition waiting period", "Maternity add-on available", "Cashless pre-authorization", "Day care procedure support"],
        gradient: "from-teal-500 to-cyan-600",
    },
    {
        id: 3,
        name: "Family Care Plus",
        type: "Health",
        emoji: "👨‍👩‍👧‍👦",
        premium: "₹18,000",
        period: "year",
        coverage: "₹10,00,000",
        popular: false,
        features: ["Family floater cover", "Maternity support", "Wellness benefits", "Cashless illness coverage", "Health check-up vouchers"],
        gradient: "from-emerald-500 to-green-600",
    },
];

export default function Plans() {
    return (
        <PageShell>
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-10">
                {/* Header */}
                <div className="mb-10 text-center animate-fade-in-up">
                    <span className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-700 ring-1 ring-blue-600/10">
                        Plans
                    </span>
                    <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Choose coverage that fits</h1>
                    <p className="mx-auto mt-3 max-w-lg text-slate-600">
                        Compare health insurance plans and coverage options — built for clarity.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 stagger-children">
                    {plans.map((plan) => (
                        <div key={plan.id} className={`card-premium relative flex flex-col overflow-hidden ${plan.popular ? "ring-2 ring-teal-400/90 ring-offset-2 ring-offset-[#f8fafc]" : ""}`}>
                            {/* Popular Badge */}
                            {plan.popular && (
                                <div className="absolute right-4 top-4 z-10">
                                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-600 px-3 py-1 text-xs font-bold text-white shadow-md">
                                        Most popular
                                    </span>
                                </div>
                            )}

                            {/* Card Header */}
                            <div className={`p-6 pb-5 bg-gradient-to-br ${plan.gradient} text-white relative`}>
                                <div className="bg-circle" style={{ width: 120, height: 120, background: '#fff', top: -40, right: -30, opacity: 0.1 }} />
                                <span className="text-3xl mb-3 block">{plan.emoji}</span>
                                <h3 className="text-xl font-bold">{plan.name}</h3>
                                <p className="text-white/70 text-sm mt-0.5">{plan.type} Insurance</p>
                            </div>

                            {/* Pricing */}
                            <div className="border-b border-slate-100 px-6 py-5">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-extrabold tabular-nums text-slate-900">{plan.premium}</span>
                                    <span className="text-sm text-slate-400">/{plan.period}</span>
                                </div>
                                <p className="mt-1 text-sm text-slate-600">
                                    Coverage up to <span className="font-semibold text-slate-900">{plan.coverage}</span>
                                </p>
                            </div>

                            {/* Features */}
                            <div className="px-6 py-5 flex-1">
                                <ul className="space-y-3">
                                    {plan.features.map((feature, i) => (
                                        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-600">
                                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5 text-emerald-500">
                                                <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15"/>
                                                <path d="M8 12l2.5 2.5L16 9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <div className="px-6 pb-6">
                                <Link
                                    to="/buy"
                                    className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition ${
                                        plan.popular
                                            ? "btn-primary"
                                            : "border border-slate-200 bg-white text-slate-800 shadow-sm hover:bg-slate-50"
                                    }`}
                                >
                                    Get started
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Trust Banner */}
                <div className="mt-12 card-premium animate-fade-in-up p-8 text-center" style={{ animationDelay: "0.4s" }}>
                    <div className="flex flex-wrap items-center justify-center gap-8 text-slate-500">
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                            <span className="text-sm font-medium">256-bit Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                            <span className="text-sm font-medium">IRDAI Registered</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                            <span className="text-sm font-medium">1M+ Customers</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span className="text-sm font-medium">30-min Claim Settlement</span>
                        </div>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
