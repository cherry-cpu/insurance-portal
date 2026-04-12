/**
 * Health-only buy flow: age bracket + pre-existing conditions adjust premium & eligibility.
 */

export const AGE_BRACKETS = [
    { id: "0-17", label: "0–17 (dependent / child)", factor: 0.75 },
    { id: "18-30", label: "18–30 years", factor: 0.88 },
    { id: "31-45", label: "31–45 years", factor: 1 },
    { id: "46-60", label: "46–60 years", factor: 1.38 },
    { id: "61+", label: "61 years & above", factor: 1.85 },
];

/** Pre-existing / risk conditions — multipliers stack with a cap */
export const CONDITION_OPTIONS = [
    { id: "none", label: "No pre-existing conditions", mult: 1, exclusive: true },
    { id: "diabetes", label: "Diabetes / blood sugar", mult: 1.14 },
    { id: "hypertension", label: "Hypertension (BP)", mult: 1.1 },
    { id: "cardiac", label: "Heart / cardiac history", mult: 1.28 },
    { id: "respiratory", label: "Asthma / COPD / respiratory", mult: 1.12 },
    { id: "kidney", label: "Kidney / chronic kidney disease", mult: 1.22 },
    { id: "cancer", label: "Cancer history (declared)", mult: 1.45 },
];

/**
 * Health plans — base annual premium in ₹ before age/condition factors.
 * excludedConditions: if user selected any of these, plan is hidden.
 * minAgeBracket / maxAgeBracket: bracket ids from AGE_BRACKETS
 */
export const HEALTH_PLANS = [
    {
        id: "youth-shield",
        name: "Youth Shield",
        tier: "Starter",
        summary: "Ideal for young individuals with no or low chronic load.",
        basePremium: 7200,
        coverage: 400000,
        copay: "10% co-pay",
        excludedConditions: ["cancer", "cardiac", "kidney"],
        minAgeBracket: "0-17",
        maxAgeBracket: "31-45",
    },
    {
        id: "family-care",
        name: "Family Care Plus",
        tier: "Popular",
        summary: "Balanced cover for families; accepts common lifestyle conditions.",
        basePremium: 11800,
        coverage: 750000,
        copay: "5% co-pay",
        excludedConditions: ["cancer"],
        minAgeBracket: "0-17",
        maxAgeBracket: "61+",
    },
    {
        id: "chronic-comfort",
        name: "Chronic Comfort",
        tier: "Chronic",
        summary: "Designed for diabetes, BP, and respiratory declarations.",
        basePremium: 15400,
        coverage: 900000,
        copay: "5% co-pay",
        excludedConditions: ["cancer"],
        minAgeBracket: "18-30",
        maxAgeBracket: "61+",
    },
    {
        id: "gold-secure",
        name: "Gold Secure Health",
        tier: "Gold",
        summary: "High sum insured with wider disease acceptance (except active cancer treatment).",
        basePremium: 19800,
        coverage: 1200000,
        copay: "No co-pay on cashless",
        excludedConditions: [],
        minAgeBracket: "18-30",
        maxAgeBracket: "61+",
    },
    {
        id: "senior-elite",
        name: "Senior Elite",
        tier: "Senior",
        summary: "Tailored for 46+ with enhanced domiciliary and post-discharge care.",
        basePremium: 24600,
        coverage: 1000000,
        copay: "10% co-pay",
        excludedConditions: [],
        minAgeBracket: "46-60",
        maxAgeBracket: "61+",
    },
    {
        id: "oncology-guard",
        name: "Oncology Guard Rider+",
        tier: "Specialist",
        summary: "For declared cancer history — mandatory specialist underwriting.",
        basePremium: 28900,
        coverage: 1500000,
        copay: "As per policy schedule",
        excludedConditions: [],
        requiredConditions: ["cancer"],
        minAgeBracket: "18-30",
        maxAgeBracket: "61+",
    },
];

const bracketOrder = AGE_BRACKETS.map((a) => a.id);

function bracketInRange(ageId, minId, maxId) {
    const i = bracketOrder.indexOf(ageId);
    const a = bracketOrder.indexOf(minId);
    const b = bracketOrder.indexOf(maxId);
    return i >= a && i <= b;
}

function conditionMultiplier(selectedIds) {
    if (selectedIds.includes("none") || selectedIds.length === 0) return 1;
    let m = 1;
    for (const id of selectedIds) {
        if (id === "none") continue;
        const opt = CONDITION_OPTIONS.find((o) => o.id === id);
        if (opt) m *= opt.mult;
    }
    return Math.min(m, 1.65);
}

/** Returns eligible plans with computed annual premium */
export function getEligiblePlans(ageBracketId, selectedConditionIds) {
    const conds = selectedConditionIds.includes("none") ? ["none"] : selectedConditionIds.filter((id) => id !== "none");

    return HEALTH_PLANS.filter((plan) => {
        if (!bracketInRange(ageBracketId, plan.minAgeBracket, plan.maxAgeBracket)) return false;
        const hasNoneOnly = conds.length === 0 || (conds.length === 1 && conds[0] === "none");
        if (plan.requiredConditions?.length) {
            const ok = plan.requiredConditions.every((r) => conds.includes(r));
            if (!ok) return false;
        }
        if (hasNoneOnly) return true;
        return !plan.excludedConditions.some((ex) => conds.includes(ex));
    }).map((plan) => {
        const ageF = AGE_BRACKETS.find((a) => a.id === ageBracketId)?.factor ?? 1;
        const condM = conditionMultiplier(conds);
        const raw = plan.basePremium * ageF * condM;
        const rounded = Math.round(raw / 100) * 100;
        return {
            ...plan,
            computedPremium: rounded,
            premiumLabel: `₹${rounded.toLocaleString("en-IN")}/yr`,
            coverageLabel: `₹${(plan.coverage / 100000).toFixed(plan.coverage % 100000 === 0 ? 0 : 1)}L`.replace(".0L", "L"),
        };
    });
}
