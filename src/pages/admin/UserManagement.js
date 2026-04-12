import { useEffect, useState } from "react";
import AdminNavbar from "../../components/AdminNavbar";
import { loadUsers, saveUsers } from "../../lib/insuranceStore";

const ROLES = ["Customer", "Doctor", "Hospital", "Admin"];

function nextUserId(list) {
    let max = 0;
    for (const u of list) {
        const m = /^USR-(\d+)$/.exec(u.id);
        if (m) max = Math.max(max, parseInt(m[1], 10));
    }
    return `USR-${String(max + 1).padStart(3, "0")}`;
}

export default function UserManagement() {
    const [users, setUsers] = useState(() => loadUsers());
    const [form, setForm] = useState({ name: "", email: "", role: "Customer" });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        saveUsers(users);
    }, [users]);

    const addUser = (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.email.trim()) return;
        const id = nextUserId(users);
        const row = {
            id,
            name: form.name.trim(),
            email: form.email.trim().toLowerCase(),
            role: form.role,
            status: "Active",
            created: new Date().toISOString().slice(0, 10),
        };
        setUsers((u) => [...u, row]);
        setForm({ name: "", email: "", role: "Customer" });
    };

    const toggleStatus = (id) => {
        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" } : u))
        );
    };

    const removeUser = (id) => {
        if (!window.confirm("Remove this user from the directory?")) return;
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const updateRole = (id, role) => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
        setEditingId(null);
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <AdminNavbar />

            <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Manage users</h1>
                    <p className="mt-1 text-sm text-slate-500">Add portal users, assign roles, and suspend access.</p>
                </div>

                <div className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <h2 className="text-sm font-bold uppercase tracking-wide text-slate-500">Add user</h2>
                    <form onSubmit={addUser} className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end">
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Full name</label>
                            <input
                                className="input-premium"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="Name"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                            <input
                                type="email"
                                className="input-premium"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="email@company.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="mb-1 block text-sm font-medium text-slate-700">Role</label>
                            <select
                                className="input-premium cursor-pointer"
                                value={form.role}
                                onChange={(e) => setForm({ ...form, role: e.target.value })}
                            >
                                {ROLES.map((r) => (
                                    <option key={r} value={r}>
                                        {r}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button type="submit" className="btn-primary h-[46px] w-full sm:col-span-2 lg:col-span-1">
                            Add user
                        </button>
                    </form>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-4">
                        <h2 className="text-lg font-bold text-slate-900">Directory ({users.length})</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="bg-slate-50/90 text-xs font-semibold uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-6 py-3">ID</th>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Role</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {users.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50/80">
                                        <td className="px-6 py-4 font-mono text-xs text-slate-500">{u.id}</td>
                                        <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                                        <td className="px-6 py-4 text-slate-600">{u.email}</td>
                                        <td className="px-6 py-4">
                                            {editingId === u.id ? (
                                                <select
                                                    className="input-premium max-w-[160px] py-1 text-sm"
                                                    value={u.role}
                                                    onChange={(e) => updateRole(u.id, e.target.value)}
                                                    onBlur={() => setEditingId(null)}
                                                    autoFocus
                                                >
                                                    {ROLES.map((r) => (
                                                        <option key={r} value={r}>
                                                            {r}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setEditingId(u.id)}
                                                    className="rounded-lg font-semibold text-blue-600 hover:underline"
                                                >
                                                    {u.role}
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                                                    u.status === "Active"
                                                        ? "bg-emerald-100 text-emerald-800"
                                                        : "bg-amber-100 text-amber-900"
                                                }`}
                                            >
                                                {u.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() => toggleStatus(u.id)}
                                                className="mr-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                                            >
                                                {u.status === "Active" ? "Suspend" : "Activate"}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => removeUser(u.id)}
                                                className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
