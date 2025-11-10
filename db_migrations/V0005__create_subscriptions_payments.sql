-- Таблица подписок
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    family_id UUID NOT NULL REFERENCES t_p5815085_family_assistant_pro.families(id),
    plan_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'RUB',
    start_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    end_date TIMESTAMP NOT NULL,
    auto_renew BOOLEAN DEFAULT TRUE,
    payment_method VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица платежей
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    subscription_id UUID REFERENCES t_p5815085_family_assistant_pro.subscriptions(id),
    family_id UUID NOT NULL REFERENCES t_p5815085_family_assistant_pro.families(id),
    user_id UUID NOT NULL REFERENCES t_p5815085_family_assistant_pro.users(id),
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'RUB',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    payment_id VARCHAR(255) UNIQUE,
    payment_method VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP
);

-- Индексы
CREATE INDEX IF NOT EXISTS idx_subscriptions_family ON t_p5815085_family_assistant_pro.subscriptions(family_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON t_p5815085_family_assistant_pro.subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_payments_family ON t_p5815085_family_assistant_pro.payments(family_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON t_p5815085_family_assistant_pro.payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_id ON t_p5815085_family_assistant_pro.payments(payment_id);