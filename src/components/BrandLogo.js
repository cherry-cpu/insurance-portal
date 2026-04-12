import { Link } from "react-router-dom";
import { APP_NAME, LOGO_SRC } from "../brand";

export default function BrandLogo({ to = "/", size = 36, showText = true, className = "" }) {
    return (
        <Link to={to} className={`flex items-center gap-2.5 min-w-0 ${className}`}>
            <img src={LOGO_SRC} width={size} height={size} alt="" className="shrink-0 rounded-xl shadow-sm ring-1 ring-slate-900/5" />
            {showText && <span className="text-lg font-extrabold tracking-tight text-gradient sm:text-xl">{APP_NAME}</span>}
        </Link>
    );
}
