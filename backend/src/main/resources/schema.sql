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

