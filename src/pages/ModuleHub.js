import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageShell from "../components/PageShell";
import { APP_NAME } from "../brand";
import { PLATFORM_MODULES } from "../data/platformModules";

export default function ModuleHub() {
    return (
        <PageShell>
            <Navbar />
            <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Enterprise suite</p>
                <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Policy Management &amp; operations</h1>
                <p className="mt-2 max-w-3xl text-slate-600">
                    {APP_NAME} maps core insurance operations into modular capabilities. Explore policy, claims, sales, renewal, billing,
                    communications, documents, analytics, and more — all built to support a modern insurance platform.
                </p>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {PLATFORM_MODULES.map((m) => (
                        <Link to={`/modules/${m.id}`} key={m.id} className="card-premium flex flex-col p-5 hover:-translate-y-1 transition duration-200 cursor-pointer block">
                            <h2 className="text-lg font-bold text-slate-900">{m.title}</h2>
                            <p className="mt-2 flex-1 text-sm text-slate-600">{m.desc}</p>
                            <span className="mt-4 inline-flex text-xs font-semibold uppercase tracking-wide text-blue-500">View Platform Module &rarr;</span>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 rounded-2xl border border-blue-100 bg-blue-50/50 p-6">
                    <p className="font-semibold text-slate-900">Quick links</p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold">
                        <Link to="/dashboard" className="text-blue-600 hover:underline">
                            Customer dashboard
                        </Link>
                        <Link to="/buy" className="text-blue-600 hover:underline">
                            Buy policy
                        </Link>
                        <Link to="/admin" className="text-blue-600 hover:underline">
                            Admin
                        </Link>
                        <Link to="/doctor" className="text-blue-600 hover:underline">
                            Doctor desk
                        </Link>
                        <Link to="/hospital" className="text-blue-600 hover:underline">
                            Hospital intake
                        </Link>
                    </div>
                </div>
            </div>
        </PageShell>
    );
}
