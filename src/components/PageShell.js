/**
 * Shared customer layout shell — matches Figma-style app canvas (soft mesh, slate typography).
 */
import Chatbot from "./Chatbot";

export default function PageShell({ children }) {
    return (
        <div className="min-h-screen page-app">
            {children}
            <Chatbot />
        </div>
    );
}
