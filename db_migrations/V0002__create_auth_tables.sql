-- Создание таблицы пользователей для авторизации
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(6),
    verification_expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP,
    CONSTRAINT check_email_or_phone CHECK (email IS NOT NULL OR phone IS NOT NULL)
);

-- Создание таблицы сессий
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES t_p5815085_family_assistant_pro.users(id),
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT
);

-- Связываем пользователей с членами семьи
ALTER TABLE t_p5815085_family_assistant_pro.family_members
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES t_p5815085_family_assistant_pro.users(id);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_users_email ON t_p5815085_family_assistant_pro.users(email);
CREATE INDEX IF NOT EXISTS idx_users_phone ON t_p5815085_family_assistant_pro.users(phone);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON t_p5815085_family_assistant_pro.sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON t_p5815085_family_assistant_pro.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user_id ON t_p5815085_family_assistant_pro.family_members(user_id);