-- Ratantatai insurance portal — reference schema (PostgreSQL-oriented).
-- Adjust types for MySQL (e.g. BIGSERIAL -> BIGINT AUTO_INCREMENT, TIMESTAMPTZ -> DATETIME).

CREATE TABLE app_user (
    id              BIGSERIAL PRIMARY KEY,
    email           VARCHAR(320) NOT NULL UNIQUE,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(200),
    phone           VARCHAR(32),
    role            VARCHAR(32) NOT NULL DEFAULT 'CUSTOMER',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO app_user (id, email, password_hash, full_name, phone, role) VALUES
    (1, 'customer@ratantatai.com', 'demo-password', 'Demo Customer', '9000000000', 'CUSTOMER');

CREATE TABLE address (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT NOT NULL REFERENCES app_user (id) ON DELETE CASCADE,
    line1           VARCHAR(300) NOT NULL,
    line2           VARCHAR(300),
    state           VARCHAR(100) NOT NULL,
    district        VARCHAR(100) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    pincode         VARCHAR(12) NOT NULL,
    country         VARCHAR(80) NOT NULL DEFAULT 'IN',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE insurance_company (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    registration_no VARCHAR(100),
    contact_email   VARCHAR(320),
    contact_phone   VARCHAR(32),
    status          VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO insurance_company (id, name, registration_no, contact_email, contact_phone, status, created_at) VALUES
    (1, 'Ratantatai Insurance', 'IRDA123456', 'support@ratantatai.com', '1800123456', 'ACTIVE', NOW());

CREATE TABLE company_agreement (
    id                   BIGSERIAL PRIMARY KEY,
    insurance_company_id BIGINT REFERENCES insurance_company(id),
    agreement_type       VARCHAR(100),
    commission_rate      DECIMAL(5, 2),
    valid_until          DATE,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE company_network_rule (
    id                   BIGSERIAL PRIMARY KEY,
    insurance_company_id BIGINT REFERENCES insurance_company(id),
    rule_description     TEXT NOT NULL,
    region               VARCHAR(100),
    created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE policy_product (
    id              BIGSERIAL PRIMARY KEY,
    company_id      BIGINT REFERENCES insurance_company(id),
    code            VARCHAR(64) NOT NULL UNIQUE,
    name            VARCHAR(200) NOT NULL,
    category        VARCHAR(64) NOT NULL,
    sum_insured_paise BIGINT,
    base_premium_paise BIGINT,
    metadata_json   JSONB,
    active          BOOLEAN NOT NULL DEFAULT TRUE
);

INSERT INTO policy_product (id, company_id, code, name, category, sum_insured_paise, base_premium_paise, metadata_json, active) VALUES
    (1, 1, 'health_basic', 'Health Basic', 'HEALTH', 10000000, 720000, '{"tier":"Starter","category":"individual"}', TRUE),
    (2, 1, 'youth_shield', 'Youth Shield', 'HEALTH', 40000000, 720000, '{"tier":"Starter","category":"individual","minAge":"0-17","maxAge":"31-45"}', TRUE),
    (3, 1, 'family_care', 'Family Care Plus', 'HEALTH', 75000000, 1180000, '{"tier":"Popular","category":"family","minAge":"0-17","maxAge":"61+"}', TRUE),
    (4, 1, 'chronic_comfort', 'Chronic Comfort', 'HEALTH', 90000000, 1540000, '{"tier":"Chronic","category":"individual","minAge":"18-30","maxAge":"61+"}', TRUE),
    (5, 1, 'gold_secure', 'Gold Secure Health', 'HEALTH', 120000000, 1980000, '{"tier":"Gold","category":"family","minAge":"18-30","maxAge":"61+"}', TRUE),
    (6, 1, 'senior_elite', 'Senior Elite', 'HEALTH', 100000000, 2460000, '{"tier":"Senior","category":"senior","minAge":"46-60","maxAge":"61+"}', TRUE),
    (7, 1, 'oncology_guard', 'Oncology Guard Rider+', 'HEALTH', 150000000, 2890000, '{"tier":"Specialist","category":"individual","minAge":"18-30","maxAge":"61+"}', TRUE);

CREATE TABLE policy_contract (
    id              BIGSERIAL PRIMARY KEY,
    policy_number   VARCHAR(64) NOT NULL UNIQUE,
    user_id         BIGINT NOT NULL REFERENCES app_user (id),
    product_id      BIGINT NOT NULL REFERENCES policy_product (id),
    status          VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    start_date      DATE,
    end_date        DATE,
    nominee_json    JSONB,
    health_json     JSONB,
    address_json    JSONB,
    documents_json  JSONB,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE underwriting_case (
    id                      BIGSERIAL PRIMARY KEY,
    application_number      VARCHAR(64) NOT NULL UNIQUE,
    policy_number           VARCHAR(64) NOT NULL,
    applicant_name          VARCHAR(200),
    age                     INTEGER,
    gender                  VARCHAR(32),
    tobacco_use             VARCHAR(32),
    conditions_json         TEXT,
    medical_history_notes   TEXT,
    requested_sum_insured_paise BIGINT,
    base_premium_paise      BIGINT,
    recommended_premium_paise BIGINT,
    risk_score              INTEGER,
    decision                VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    decision_reason         TEXT,
    medical_check_required  BOOLEAN NOT NULL DEFAULT FALSE,
    background_check_status VARCHAR(32) NOT NULL DEFAULT 'PENDING',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE payment (
    id                  BIGSERIAL PRIMARY KEY,
    policy_contract_id  BIGINT REFERENCES policy_contract (id),
    amount_paise        BIGINT NOT NULL,
    gst_amount_paise    BIGINT DEFAULT 0,
    tax_rate_percent    INTEGER DEFAULT 18,
    currency            VARCHAR(8) NOT NULL DEFAULT 'INR',
    razorpay_order_id   VARCHAR(128),
    razorpay_payment_id VARCHAR(128),
    receipt             VARCHAR(128),
    status              VARCHAR(32) NOT NULL DEFAULT 'CREATED',
    raw_webhook_json    JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE claim (
    id                  BIGSERIAL PRIMARY KEY,
    policy_contract_id  BIGINT NOT NULL REFERENCES policy_contract (id),
    claim_number        VARCHAR(64) NOT NULL UNIQUE,
    amount_claimed_paise BIGINT,
    status              VARCHAR(32) NOT NULL DEFAULT 'SUBMITTED',
    hospital_ref        VARCHAR(128),
    doctor_ref          VARCHAR(128),
    doctor_review       VARCHAR(32) NOT NULL DEFAULT 'pending',
    pre_auth_status     VARCHAR(32),
    pre_auth_reference  VARCHAR(128),
    adjudication_notes  TEXT,
    approved_amount_paise BIGINT,
    settlement_amount_paise BIGINT,
    settlement_date     DATE,
    payout_reference    VARCHAR(128),
    details_json        JSONB,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE document (
    id              BIGSERIAL PRIMARY KEY,
    owner_user_id   BIGINT REFERENCES app_user (id),
    claim_id        BIGINT REFERENCES claim (id),
    storage_key     VARCHAR(512) NOT NULL,
    mime_type       VARCHAR(128),
    title           VARCHAR(300),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE communication_log (
    id              BIGSERIAL PRIMARY KEY,
    user_id         BIGINT REFERENCES app_user (id),
    channel         VARCHAR(32) NOT NULL,
    template_code   VARCHAR(64),
    payload_json    JSONB,
    status          VARCHAR(32) NOT NULL DEFAULT 'QUEUED',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE workflow_task (
    id              BIGSERIAL PRIMARY KEY,
    entity_type     VARCHAR(64) NOT NULL,
    entity_id       BIGINT NOT NULL,
    step            VARCHAR(64) NOT NULL,
    assignee_role   VARCHAR(32),
    status          VARCHAR(32) NOT NULL DEFAULT 'OPEN',
    due_at          TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE marketing_campaign (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    segment_json    JSONB,
    status          VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_event (
    id              BIGSERIAL PRIMARY KEY,
    actor_user_id   BIGINT REFERENCES app_user (id),
    action          VARCHAR(128) NOT NULL,
    entity_type     VARCHAR(64),
    entity_id       BIGINT,
    details_json    JSONB,
    ip_address      VARCHAR(64),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE regulatory_report (
    id                    BIGSERIAL PRIMARY KEY,
    report_type           VARCHAR(128) NOT NULL,
    period                VARCHAR(64),
    generated_by          BIGINT REFERENCES app_user (id),
    generated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    submitted_to          VARCHAR(128),
    submission_reference  VARCHAR(128),
    status                VARCHAR(32) NOT NULL DEFAULT 'DRAFT',
    summary_json          JSONB,
    created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_policy_user ON policy_contract (user_id);
CREATE INDEX idx_payment_policy ON payment (policy_contract_id);
CREATE INDEX idx_claim_policy ON claim (policy_contract_id);
CREATE INDEX idx_audit_created ON audit_event (created_at);
CREATE INDEX idx_regulatory_generated ON regulatory_report (generated_at);

CREATE TABLE crm_lead (
    id              BIGSERIAL PRIMARY KEY,
    name            VARCHAR(200) NOT NULL,
    email           VARCHAR(320),
    phone           VARCHAR(32),
    source          VARCHAR(64),
    ai_score        INTEGER NOT NULL DEFAULT 0,
    ai_intent       VARCHAR(64),
    status          VARCHAR(32) NOT NULL DEFAULT 'NEW',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE agent_performance (
    id                  BIGSERIAL PRIMARY KEY,
    agent_id            BIGINT REFERENCES app_user(id),
    total_sales_amount  BIGINT DEFAULT 0,
    policies_sold       INTEGER DEFAULT 0,
    satisfaction_score  DECIMAL(3, 2),
    report_month        VARCHAR(32) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hospital_master (
    id                      BIGSERIAL PRIMARY KEY,
    name                    VARCHAR(200) NOT NULL,
    address                 VARCHAR(300),
    city                    VARCHAR(100),
    state                   VARCHAR(100),
    tier                    VARCHAR(32) DEFAULT 'TIER_1',
    network_type            VARCHAR(32) NOT NULL DEFAULT 'NON_NETWORK',
    standard_room_rent_limit BIGINT,
    premium_room_rent_limit  BIGINT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hospital_plan_mapping (
    id              BIGSERIAL PRIMARY KEY,
    hospital_id     BIGINT REFERENCES hospital_master(id),
    product_id      BIGINT REFERENCES policy_product(id),
    is_cashless     BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hospital_tariff (
    id              BIGSERIAL PRIMARY KEY,
    hospital_id     BIGINT REFERENCES hospital_master(id),
    procedure_name  VARCHAR(200) NOT NULL,
    max_coverage    BIGINT NOT NULL,
    effective_date  DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hospital_package (
    id              BIGSERIAL PRIMARY KEY,
    hospital_id     BIGINT REFERENCES hospital_master(id),
    package_code    VARCHAR(100),
    procedure_name  VARCHAR(200) NOT NULL,
    package_rate    BIGINT NOT NULL,
    currency        VARCHAR(8) NOT NULL DEFAULT 'INR',
    effective_date  DATE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE hospital_contract (
    id                  BIGSERIAL PRIMARY KEY,
    hospital_id         BIGINT REFERENCES hospital_master(id),
    contract_name       VARCHAR(200) NOT NULL,
    contract_version    VARCHAR(64),
    contract_file_key   VARCHAR(512),
    start_date          DATE,
    end_date            DATE,
    status              VARCHAR(32) NOT NULL DEFAULT 'ACTIVE',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for General Policies
CREATE TABLE general_policies (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255),
    icon VARCHAR(10),
    benefits TEXT,
    sum_insured VARCHAR(50)
);

INSERT INTO general_policies (id, name, icon, benefits, sum_insured) VALUES
('health', 'Health Insurance', '❤️', 'Cashless hospitals,Pre/post hospitalization,Day care procedures,No-claim bonus', '₹3L – ₹25L');

-- Table for Health Plans Catalog
CREATE TABLE health_plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255),
    tier VARCHAR(50),
    category VARCHAR(50),
    summary TEXT,
    base_premium INT,
    coverage INT,
    copay VARCHAR(50),
    excluded_conditions TEXT,
    min_age_bracket VARCHAR(50),
    max_age_bracket VARCHAR(50)
);

INSERT INTO health_plans (id, name, tier, category, summary, base_premium, coverage, copay, excluded_conditions, min_age_bracket, max_age_bracket) VALUES
('youth-shield', 'Youth Shield', 'Starter', 'individual', 'Ideal for young individuals with no or low chronic load.', 7200, 400000, '10% co-pay', 'cancer,cardiac,kidney', '0-17', '31-45');

-- Table for Indian States
CREATE TABLE indian_states (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255)
);

INSERT INTO indian_states (name) VALUES
('Andhra Pradesh'),
('Arunachal Pradesh'),
('Assam'),
('Bihar'),
('Chhattisgarh'),
('Goa'),
('Gujarat'),
('Haryana'),
('Himachal Pradesh'),
('Jharkhand'),
('Karnataka'),
('Kerala'),
('Madhya Pradesh'),
('Maharashtra'),
('Manipur'),
('Meghalaya'),
('Mizoram'),
('Nagaland'),
('Odisha'),
('Punjab'),
('Rajasthan'),
('Sikkim'),
('Tamil Nadu'),
('Telangana'),
('Tripura'),
('Uttar Pradesh'),
('Uttarakhand'),
('West Bengal'),
('Andaman and Nicobar Islands'),
('Chandigarh'),
('Dadra and Nagar Haveli and Daman and Diu'),
('Delhi'),
('Jammu and Kashmir'),
('Ladakh'),
('Lakshadweep'),
('Puducherry');

-- Table for Platform Modules
CREATE TABLE platform_modules (
    id VARCHAR(50) PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    features TEXT
);

INSERT INTO platform_modules (id, title, description, features) VALUES
('policy-mgmt', 'Policy Management', 'Create and manage insurance policies with premium, coverage, documents, status, and lifecycle updates.', 'Policy creation, endorsements, renewals, and cancellations|Premium, coverage, beneficiary, and document storage|Policy status tracking, updates, and audit history|Centralized master data for all insurance contracts'),
('underwriting', 'Underwriting & Risk', 'Risk assessment, medical review, premium loading, and automated underwriting decisions.', 'Automated underwriting risk scoring and premium calculation|Medical / background check flags with review workflow|Approve, reject or load premium decisions using rule engine|Underwriting cases tracked with audit-ready status and notes');

-- Table for Policy Terms
CREATE TABLE policy_terms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    body TEXT
);

INSERT INTO policy_terms (title, body) VALUES
('1. Scope of cover', 'Hospitalization expenses for medically necessary treatment as defined in the policy schedule, subject to sum insured, co-payment, and sub-limits for specific procedures.'),
('2. Waiting periods', 'Initial 30-day waiting period for illness (except accidents). Pre-existing diseases as declared: 24–48 months depending on plan. Specific illnesses may carry additional waiting periods as per IRDAI guidelines.'),
('3. Exclusions', 'Cosmetic surgery (unless medically required), war, self-harm, undisclosed conditions at inception, experimental treatment, and items listed in the policy document are excluded.'),
('4. Claims', 'Cashless at network hospitals subject to authorization. Reimbursement claims require original bills, discharge summary, prescriptions, and investigation reports within the stipulated time.'),
('5. Free-look & renewal', '15-day free-look cancellation from receipt of policy document (terms apply). Renewal is guaranteed as per regulatory norms unless fraud or non-disclosure is established.');