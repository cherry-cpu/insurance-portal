import { Link } from "react-router-dom";
import { APP_NAME, APP_TAGLINE } from "../brand";
import BrandLogo from "../components/BrandLogo";
import { GENERAL_POLICY_GRID } from "../data/generalPolicies";
import { PLATFORM_MODULES } from "../data/platformModules";

export default function Landing() {
    return (
        <div className="min-h-screen page-app">
            <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
                <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
                    <BrandLogo to="/" size={44} />
                    <div className="flex items-center gap-3">
                        <Link
                            to="/modules"
                            className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                            Modules
                        </Link>
                        <Link to="/login" className="btn-primary py-2.5 text-sm">
                            Login
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
                <div className="text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">{APP_NAME}</p>
                    <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">{APP_TAGLINE}</h1>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
                        Policy lifecycle, partner portals, payments, and compliance — unified. Explore products below or sign in for the
                        full platform.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                        <Link to="/buy" className="btn-primary px-8 py-3.5 text-base">
                            Buy health policy
                        </Link>
                        <Link
                            to="/login"
                            className="rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 text-base font-semibold text-slate-800 shadow-sm hover:bg-slate-50"
                        >
                            Access portal
                        </Link>
                    </div>
                </div>

                <section className="mt-16">
                    <h2 className="text-center text-2xl font-extrabold text-slate-900">Insurance products (overview)</h2>
                    <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-600">General benefits grid — detailed quotes after login.</p>
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {GENERAL_POLICY_GRID.map((g) => (
                            <div key={g.id} className="card-premium p-5 transition hover:-translate-y-0.5">
                                <div className="text-3xl">{g.icon}</div>
                                <h3 className="mt-3 text-lg font-bold text-slate-900">{g.name}</h3>
                                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">{g.sumInsured}</p>
                                <ul className="mt-4 space-y-2 text-sm text-slate-600">
                                    {g.benefits.map((b) => (
                                        <li key={b} className="flex gap-2">
                                            <span className="text-emerald-600">✓</span> {b}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="mt-20">
                    <h2 className="text-center text-2xl font-extrabold text-slate-900">Platform modules</h2>
                    <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-slate-600">
                        Available in the enterprise suite — see <Link to="/modules" className="font-semibold text-blue-600 hover:underline">module directory</Link>.
                    </p>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {PLATFORM_MODULES.slice(0, 6).map((m) => (
                            <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <p className="font-bold text-slate-900">{m.title}</p>
                                <p className="mt-2 text-sm text-slate-600">{m.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <footer className="mt-20 border-t border-slate-200 py-8 text-center text-xs text-slate-500">
                © {new Date().getFullYear()} {APP_NAME}. Praveen application.
            </footer>
        </div>
    );
}
