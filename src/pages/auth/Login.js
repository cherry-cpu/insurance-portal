import { useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { APP_NAME, APP_TAGLINE, LOGO_SRC } from "../../brand";
import { setSession } from "../../lib/session";

function safeRedirectPath(raw) {
    if (!raw || typeof raw !== "string") return null;
    const decoded = decodeURIComponent(raw.trim());
    if (!decoded.startsWith("/") || decoded.startsWith("//")) return null;
    return decoded;
}

export default function Login() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        try {
            const apiRes = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            if (!apiRes.ok) {
                const text = await apiRes.text();
                setErrorMsg(text || "Invalid credentials");
                return;
            }

            const data = await apiRes.json();
            
            // Set session with the retrieved dummy token and role
            const nameFromEmail = email.includes("@") ? email.split("@")[0] : email || "Customer";
            setSession({ email: email, name: nameFromEmail, role: data.userRole, token: data.token });
            
            // Redirect based on backend suggestion or requested URL
            const next = safeRedirectPath(searchParams.get("redirect")) || data.redirectUrl || "/dashboard";
            navigate(next, { replace: true });
        } catch (err) {
            console.error("Login failed:", err);
            setErrorMsg("Could not connect to the backend server. Please ensure Spring Boot is running.");
        }
    };

    return (
        <div className="min-h-screen flex relative overflow-hidden">
            {/* Decorative background */}
            <div className="bg-circle" style={{ width: 400, height: 400, background: "#2563eb", top: -100, right: -100 }} />
            <div className="bg-circle" style={{ width: 300, height: 300, background: "#14b8a6", bottom: -50, left: -80 }} />

            {/* Left Panel - Branding */}
            <div
                className="relative hidden w-1/2 items-center justify-center lg:flex"
                style={{ background: "linear-gradient(145deg, #1e3a8a 0%, #2563eb 42%, #0f766e 100%)" }}
            >
                <div className="bg-circle" style={{ width: 500, height: 500, background: '#fff', top: '10%', left: '-10%', opacity: 0.08 }} />
                <div className="bg-circle" style={{ width: 300, height: 300, background: '#00C6AE', bottom: '10%', right: '-5%', opacity: 0.2 }} />

                <div className="relative z-10 text-center px-12 animate-fade-in-up">
                    {/* Shield icon */}
                    <div className="mx-auto mb-6 animate-float">
                        <img src={LOGO_SRC} alt="" className="mx-auto h-28 w-28 drop-shadow-lg" />
                    </div>

                    <h1 className="mb-4 text-4xl font-extrabold tracking-tight text-white">{APP_NAME}</h1>
                    <p className="mx-auto max-w-md text-lg leading-relaxed text-blue-100/95">{APP_TAGLINE}</p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap justify-center gap-3 mt-10">
                        {["Health Coverage", "Instant Claims", "24/7 Support", "Cashless Network"].map((item, i) => (
                            <span key={i} className="px-4 py-2 rounded-full text-sm font-medium"
                                  style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)' }}>
                                {item}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel - Form */}
            <div className="auth-canvas relative flex flex-1 items-center justify-center p-6 lg:p-12">
                <div className="w-full max-w-md animate-fade-in-up">
                    {/* Mobile logo */}
                    <div className="mb-8 text-center lg:hidden">
                        <img src={LOGO_SRC} alt="" className="mx-auto h-16 w-16" />
                        <h1 className="mt-3 text-3xl font-extrabold text-gradient">{APP_NAME}</h1>
                        <p className="mt-1 text-sm text-slate-500">{APP_TAGLINE}</p>
                    </div>

                    {/* Card */}
                    <div className="card-premium p-8 lg:p-10">
                        <div className="mb-8">
                            <h2 className="text-2xl font-extrabold text-slate-900">
                                {isLogin ? "Welcome back" : "Create account"}
                            </h2>
                            <p className="mt-1 text-slate-600">
                                {isLogin ? "Sign in to manage your policies" : "Start your insurance journey today"}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {errorMsg && (
                                <div className="rounded-md bg-red-50 p-4">
                                    <p className="text-sm text-red-700">{errorMsg}</p>
                                </div>
                            )}

                            {!isLogin && (
                                <div className="animate-fade-in">
                                    <label className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        className="input-premium"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="input-premium"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="input-premium pr-12"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-600"
                                    >
                                        {showPassword ? (
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                                        ) : (
                                            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {isLogin && (
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="text-sm text-slate-600">Remember me</span>
                                    </label>
                                    <a href="#forgot" className="text-sm text-blue-600 hover:text-blue-700 font-medium">Forgot password?</a>
                                </div>
                            )}

                            <button type="submit" className="btn-primary w-full text-center py-3.5 text-base">
                                {isLogin ? "Sign In" : "Create Account"}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 font-medium">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Social login */}
                        <button type="button" className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white py-3 font-semibold text-slate-800 shadow-sm transition hover:bg-slate-50">
                            <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                            Continue with Google
                        </button>

                        {/* Toggle */}
                        <p className="mt-6 text-center text-sm text-slate-600">
                            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="font-semibold text-blue-600 hover:text-blue-700"
                            >
                                {isLogin ? "Sign Up" : "Sign In"}
                            </button>
                        </p>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t border-slate-100 pt-6 text-xs text-slate-500">
                        <span className="text-slate-400">Partner access:</span>
                        <Link to="/doctor" className="font-semibold text-slate-700 hover:text-blue-600">
                            Doctor desk
                        </Link>
                        <span className="text-slate-300">·</span>
                        <Link to="/hospital" className="font-semibold text-slate-700 hover:text-blue-600">
                            Hospital intake
                        </Link>
                        <span className="text-slate-300">·</span>
                        <Link to="/admin" className="font-semibold text-slate-700 hover:text-blue-600">
                            Admin
                        </Link>
                    </div>

                    <p className="mt-4 text-center text-xs text-slate-400">
                        Protected by industry-standard encryption
                    </p>
                </div>
            </div>
        </div>
    );
}