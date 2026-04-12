import { Link } from "react-router-dom";

/**
 * Simple top bar for Doctor / Hospital portals (Figma-aligned slate shell).
 */
export default function PortalNavbar({ title, badge, homeTo = "/" }) {
    return (
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                    <Link to={homeTo} className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                        ← Home
                    </Link>
                    <span className="text-slate-300">|</span>
                    <span className="truncate text-lg font-extrabold tracking-tight text-slate-900">{title}</span>
                    {badge && (
                        <span className="rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-teal-800">
                            {badge}
                        </span>
                    )}
                </div>
                <Link to="/login" className="text-sm font-medium text-rose-600 hover:text-rose-700">
                    Logout
                </Link>
            </div>
        </nav>
    );
}
