import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import BrandLogo from "./BrandLogo";

const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
    { to: "/modules", label: "Modules", icon: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" },
    { to: "/plans", label: "Plans", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
    { to: "/buy", label: "Buy Policy", icon: "M12 6v6m0 0v6m0-6h6m-6 0H6" },
    { to: "/claims", label: "Claims", icon: "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" },
];

export default function Navbar() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="navbar-glass sticky top-0 z-50 px-4 sm:px-6 py-3">
            <div className="max-w-7xl mx-auto flex items-center gap-3">
                <div onClick={() => setMobileOpen(false)} className="min-w-0 shrink-0">
                    <BrandLogo to="/" size={36} />
                </div>

                {/* Desktop — Figma-style pill rail */}
                <div className="hidden md:flex flex-1 justify-center min-w-0 px-2">
                    <div className="inline-flex items-center gap-0.5 rounded-full bg-slate-100/90 p-1 ring-1 ring-slate-200/90 shadow-inner">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                                        isActive
                                            ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80"
                                            : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                                    }`}
                                >
                                    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d={link.icon} />
                                    </svg>
                                    <span className="hidden lg:inline">{link.label}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                <div className="flex items-center gap-1 sm:gap-3 ml-auto shrink-0">
                    <button
                        type="button"
                        className="md:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
                        aria-expanded={mobileOpen}
                        aria-label={mobileOpen ? "Close menu" : "Open menu"}
                        onClick={() => setMobileOpen((o) => !o)}
                    >
                        {mobileOpen ? (
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" /></svg>
                        ) : (
                            <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                        )}
                    </button>

                    <div className="flex items-center gap-1 sm:gap-2">
                        <button type="button" className="relative rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600" aria-label="Notifications">
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
                            </svg>
                            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
                        </button>
                        <Link
                            to="/login"
                            className="hidden items-center gap-2 border-l border-slate-200 pl-3 sm:flex"
                            title="Sign out"
                        >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-teal-600 text-sm font-bold text-white shadow-sm ring-1 ring-slate-900/5">
                                P
                            </div>
                            <svg width="16" height="16" fill="none" stroke="#94a3b8" strokeWidth="2" viewBox="0 0 24 24" aria-hidden>
                                <path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>

            {mobileOpen && (
                <div className="mt-3 border-t border-slate-100 pb-1 pt-3 animate-fade-in md:hidden">
                    <div className="flex flex-col gap-1 rounded-2xl bg-slate-50/90 p-2 ring-1 ring-slate-200/80">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    onClick={() => setMobileOpen(false)}
                                    className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold ${
                                        isActive ? "bg-white text-blue-600 shadow-sm ring-1 ring-slate-200/80" : "text-slate-700 hover:bg-white"
                                    }`}
                                >
                                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                        <path d={link.icon} />
                                    </svg>
                                    {link.label}
                                </Link>
                            );
                        })}
                        <Link
                            to="/login"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                        >
                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                            Sign out
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
