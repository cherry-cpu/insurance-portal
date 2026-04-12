import React, { useState } from 'react';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { id: 1, sender: 'bot', text: 'Hello! I am Ratan AI, your intelligent insurance assistant. How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg = { id: Date.now(), sender: 'user', text: inputValue };
        setMessages(prev => [...prev, userMsg]);
        setInputValue('');

        // Simulate AI response
        setTimeout(() => {
            const botResponse = { 
                id: Date.now() + 1, 
                sender: 'bot', 
                text: getSimulatedResponse(inputValue)
            };
            setMessages(prev => [...prev, botResponse]);
        }, 1000);
    };

    const getSimulatedResponse = (text) => {
        const lower = text.toLowerCase();
        if (lower.includes('quote') || lower.includes('price')) {
            return "I can certainly help you generate a new quote. Would you like to proceed to the Sales & Quotation module, or should I gather some basic details here?";
        }
        if (lower.includes('claim')) {
            return "For claims, please ensure you have your Policy ID and Hospital Reference ready. I can guide you to the Claims Management page.";
        }
        if (lower.includes('lead') || lower.includes('score')) {
            return "Our AI Lead Scoring engine analyzes customer data to predict intent. Check out the Sales module to see it in action!";
        }
        return "That's an interesting question. I'm currently a simulated AI assistant for this demo, designed to help you navigate our enterprise modules.";
    };

    return (
        <>
            {/* Floating Chat Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 p-4 bg-gradient-to-tr from-blue-600 to-teal-500 text-white rounded-full shadow-2xl hover:shadow-blue-500/50 hover:scale-105 transition-all z-50 flex items-center justify-center group"
                >
                    <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:animate-bounce"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2v10z"/></svg>
                </button>
            )}

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden flex flex-col animate-fade-in-up" style={{ height: '500px', maxHeight: 'calc(100vh - 4rem)' }}>
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-700 to-teal-600 p-4 flex justify-between items-center text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM12 16v-4M12 8h.01"/></svg>
                            </div>
                            <div>
                                <h3 className="font-bold">Ratan AI</h3>
                                <p className="text-xs text-blue-100 opacity-90"><span className="inline-block w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>Online</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white hover:text-blue-200 transition p-1">
                            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                        {messages.map((m) => (
                            <div key={m.id} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${
                                    m.sender === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-sm' 
                                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-sm shadow-sm'
                                }`}>
                                    {m.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-white border-t border-slate-100">
                        <form onSubmit={handleSend} className="flex items-center gap-2">
                            <input 
                                type="text" 
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Ask Ratan AI..." 
                                className="flex-1 p-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                            />
                            <button type="submit" disabled={!inputValue.trim()} className="p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
