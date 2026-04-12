/** Client-side rules for claim attachments (metadata only in this demo). */

export const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB

export const ALLOWED_MIME_TYPES = new Set([
    "application/pdf",
    "image/jpeg",
    "image/png",
    "image/jpg",
]);

export const ALLOWED_EXTENSIONS = /\.(pdf|jpe?g|png)$/i;

/**
 * @param {{ name: string, size: number, type: string }} fileMeta
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateAttachmentMeta(fileMeta) {
    const errors = [];
    if (!fileMeta?.name) {
        errors.push("Missing file name");
        return { valid: false, errors };
    }
    if (!ALLOWED_EXTENSIONS.test(fileMeta.name) && !ALLOWED_MIME_TYPES.has(fileMeta.type || "")) {
        errors.push("Only PDF, JPG, or PNG files are accepted");
    }
    if (fileMeta.size > MAX_FILE_BYTES) {
        errors.push("File must be 5 MB or smaller");
    }
    if (fileMeta.size <= 0) {
        errors.push("Empty file");
    }
    return { valid: errors.length === 0, errors };
}

/**
 * Run validation on all attachments. Returns new attachment objects with `validationErrors` and `valid`.
 * @returns {{ attachments: object[], summary: { status: 'passed'|'failed'|'pending', messages: string[] } }}
 */
export function validateClaimAttachments(claim) {
    const raw = claim.attachments || [];
    if (raw.length === 0) {
        return {
            attachments: [],
            summary: { status: "pending", messages: ["No documents uploaded yet"] },
        };
    }
    const messages = [];
    let failed = false;
    const attachments = raw.map((a) => {
        const r = validateAttachmentMeta(a);
        const next = {
            ...a,
            validationErrors: r.errors,
            valid: r.valid,
        };
        if (!r.valid) {
            failed = true;
            messages.push(`${a.name}: ${r.errors.join("; ")}`);
        }
        return next;
    });
    return {
        attachments,
        summary: {
            status: failed ? "failed" : "passed",
            messages: failed ? messages : ["All uploaded files pass validation rules"],
        },
    };
}
