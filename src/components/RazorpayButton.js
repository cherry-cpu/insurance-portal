import { useEffect, useState } from "react";
import { createPaymentOrder } from "../api/client";

function loadRazorpayScript() {
    return new Promise((resolve) => {
        if (window.Razorpay) {
            resolve(window.Razorpay);
            return;
        }
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = () => resolve(window.Razorpay);
        s.onerror = () => resolve(null);
        document.body.appendChild(s);
    });
}

/**
 * @param {{ amountPaise: number, receipt: string, description: string, policyNumber: string, customerName: string, customerEmail: string, customerPhone: string, onSuccess: (paymentId: string) => void, onFailure?: () => void }}
 */
export default function RazorpayButton({
    amountPaise,
    receipt,
    description,
    policyNumber,
    customerName,
    customerEmail,
    customerPhone,
    onSuccess,
    onFailure,
    disabled,
    className = "",
}) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        loadRazorpayScript().then(() => setReady(true));
    }, []);

    const pay = async () => {
        let keyId = process.env.REACT_APP_RAZORPAY_KEY_ID;
        let orderId = null;
        let amount = amountPaise;
        let currency = "INR";

        try {
            const order = await createPaymentOrder({
                amountPaise,
                receipt,
                notes: { policyNumber, description },
            });
            keyId = order.keyId || keyId;
            orderId = order.orderId;
            amount = order.amount ?? amountPaise;
            currency = order.currency || currency;
        } catch {
            /* Backend offline or keys missing — demo mode */
        }

        const Rz = await loadRazorpayScript();
        if (!Rz || !keyId) {
            const ok = window.confirm(
                "Payment gateway is in demo mode (set REACT_APP_RAZORPAY_KEY_ID and run Spring Boot API). Simulate successful payment?"
            );
            if (ok) onSuccess("pay_demo_" + Date.now());
            else onFailure?.();
            return;
        }

        const options = {
            key: keyId,
            amount,
            currency,
            name: "Ratantatai",
            description: description || policyNumber,
            order_id: orderId || undefined,
            prefill: {
                name: customerName,
                email: customerEmail,
                contact: customerPhone,
            },
            notes: { policyNumber },
            handler(response) {
                onSuccess(response.razorpay_payment_id);
            },
            modal: {
                ondismiss() {
                    onFailure?.();
                },
            },
        };

        if (!orderId) {
            delete options.order_id;
            options.amount = amountPaise;
        }

        const rzp = new Rz(options);
        rzp.open();
    };

    return (
        <button
            type="button"
            disabled={disabled}
            onClick={pay}
            className={`rounded-xl bg-[#0d4f8c] px-6 py-3.5 text-base font-bold text-white shadow-lg transition hover:bg-[#0a3f73] disabled:opacity-40 ${className}`}
        >
            {!ready ? "Loading payment…" : "Pay with Razorpay"}
        </button>
    );
}
