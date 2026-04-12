import { Link, useLocation } from "react-router-dom";
import { APP_NAME } from "../brand";

const links = [
    { to: "/admin", label: "Dashboard" },
    { to: "/admin/claims", label: "Claims" },
    { to: "/admin/hospitals", label: "Hospitals" },
    { to: "/admin/users", label: "Users" },
];

export default function AdminNavbar() {
    const location = useLocation();

    return (
        <nav className="sticky top-0 z-50 border-b border-slate-700/80 bg-slate-950/95 backdrop-blur-md px-4 sm:px-6 py-3">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
                <Link to="/admin" className="flex items-center gap-2 min-w-0">
                    <span className="text-lg font-bold text-white tracking-tight">{APP_NAME}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-amber-400/90 px-2 py-0.5 rounded-md bg-amber-400/10 border border-amber-400/25">
                        Admin
                    </span>
                </Link>
                <div className="flex items-center gap-1 sm:gap-2">
                    {links.map((link) => {
                        const active =
                            link.to === "/admin"
                                ? location.pathname === "/admin"
                                : location.pathname === link.to || location.pathname.startsWith(`${link.to}/`);
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-white/10 text-white"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <Link
                        to="/login"
                        className="ml-1 sm:ml-2 px-3 py-2 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                    >
                        Logout
                    </Link>
                </div>
            </div>
        </nav>
    );
}
