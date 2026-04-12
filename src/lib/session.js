const KEY = "ratantatai_session_v1";

export function getSession() {
    try {
        const raw = sessionStorage.getItem(KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

export function setSession(user) {
    sessionStorage.setItem(KEY, JSON.stringify({ ...user, at: Date.now() }));
}

export function clearSession() {
    sessionStorage.removeItem(KEY);
}

const PENDING = "ratantatai_pending_purchase_v1";

export function setPendingPurchase(data) {
    sessionStorage.setItem(PENDING, JSON.stringify(data));
}

export function getPendingPurchase() {
    try {
        const raw = sessionStorage.getItem(PENDING);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

export function clearPendingPurchase() {
    sessionStorage.removeItem(PENDING);
}
