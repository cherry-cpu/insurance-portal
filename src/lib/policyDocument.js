import { POLICY_TERMS_SECTIONS } from "../data/policyTerms";

/**
 * Generates a simple HTML schedule for download (print / save as HTML).
 */
export function buildPolicyScheduleHtml({ plan, personal, health, nominee, premiumLabel, coverageLabel, policyNumber }) {
    const termsHtml = POLICY_TERMS_SECTIONS.map(
        (s) => `<h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.body)}</p>`
    ).join("");

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <title>Policy Schedule — ${escapeHtml(plan.name)}</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 720px; margin: 24px auto; padding: 16px; color: #0f172a; line-height: 1.5; }
    h1 { font-size: 1.35rem; border-bottom: 2px solid #2563eb; padding-bottom: 8px; }
    h2 { font-size: 1.05rem; margin-top: 24px; }
    h3 { font-size: 0.95rem; margin-top: 16px; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 0.9rem; }
    td { padding: 6px 8px; border: 1px solid #e2e8f0; }
    td:first-child { width: 38%; background: #f8fafc; font-weight: 600; }
    .muted { color: #64748b; font-size: 0.85rem; }
  </style>
</head>
<body>
  <p class="muted">Ratantatai — Health insurance (demo document)</p>
  <h1>Policy schedule</h1>
  <p><strong>Policy number:</strong> ${escapeHtml(policyNumber)}</p>
  <p><strong>Plan:</strong> ${escapeHtml(plan.name)} (${escapeHtml(plan.tier)})</p>
  <h2>Financials</h2>
  <table>
    <tr><td>Annual premium</td><td>${escapeHtml(premiumLabel)}</td></tr>
    <tr><td>Sum insured</td><td>${escapeHtml(coverageLabel)}</td></tr>
    <tr><td>Co-pay</td><td>${escapeHtml(plan.copay || "As per plan")}</td></tr>
  </table>
  <h2>Proposer</h2>
  <table>
    <tr><td>Full name</td><td>${escapeHtml(personal.name)}</td></tr>
    <tr><td>Email</td><td>${escapeHtml(personal.email)}</td></tr>
    <tr><td>Phone</td><td>${escapeHtml(personal.phone)}</td></tr>
    <tr><td>Date of birth</td><td>${escapeHtml(personal.dob || "—")}</td></tr>
    <tr><td>Address</td><td>${escapeHtml(personal.address || "—")}</td></tr>
  </table>
  <h2>Health declaration</h2>
  <table>
    <tr><td>Height / Weight</td><td>${escapeHtml(health.height || "—")} / ${escapeHtml(health.weight || "—")}</td></tr>
    <tr><td>Tobacco use</td><td>${escapeHtml(health.tobacco)}</td></tr>
    <tr><td>Medical exam</td><td>${escapeHtml(health.medicalExamNote || "—")}</td></tr>
  </table>
  <h2>Nominee</h2>
  <table>
    <tr><td>Name</td><td>${escapeHtml(nominee.name)}</td></tr>
    <tr><td>Relationship</td><td>${escapeHtml(nominee.relationship)}</td></tr>
    <tr><td>Phone</td><td>${escapeHtml(nominee.phone)}</td></tr>
  </table>
  <h2>Terms &amp; conditions (summary)</h2>
  ${termsHtml}
  <p class="muted" style="margin-top:32px;">This is a demonstration document. Not legally binding.</p>
</body>
</html>`;
}

function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

export function downloadPolicyHtml(html, filename = "policy-schedule.html") {
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
