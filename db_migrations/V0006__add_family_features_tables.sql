-- Расширяем таблицу tasks для поддержки всех функций
ALTER TABLE t_p5815085_family_assistant_pro.tasks 
ADD COLUMN IF NOT EXISTS deadline TIMESTAMP,
ADD COLUMN IF NOT EXISTS reminder_time VARCHAR(10),
ADD COLUMN IF NOT EXISTS shopping_list TEXT,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recurring_pattern JSONB,
ADD COLUMN IF NOT EXISTS next_occurrence DATE;

-- Таблица для детских профилей
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.children_profiles (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL,
    child_member_id INTEGER NOT NULL,
    interests TEXT[],
    strengths TEXT[],
    goals TEXT[],
    personality TEXT,
    grade VARCHAR(10),
    achievements TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для результатов тестов
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.test_results (
    id SERIAL PRIMARY KEY,
    child_member_id INTEGER NOT NULL,
    test_type VARCHAR(100),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    scores JSONB,
    total_score INTEGER,
    max_score INTEGER,
    time_spent INTEGER,
    answers JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для календарных событий
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.calendar_events (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    time VARCHAR(10),
    duration VARCHAR(50),
    location VARCHAR(255),
    category VARCHAR(100),
    created_by INTEGER,
    assigned_to INTEGER[],
    visibility VARCHAR(20) DEFAULT 'family',
    color VARCHAR(20),
    reminder_time VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для семейных ценностей
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.family_values (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(10),
    practices TEXT[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для традиций
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.traditions (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    frequency VARCHAR(100),
    icon VARCHAR(10),
    participants INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для блога
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.blog_posts (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author_id INTEGER,
    category VARCHAR(100),
    excerpt TEXT,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для альбома
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.family_album (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL,
    file_name VARCHAR(255),
    file_url TEXT NOT NULL,
    uploaded_by INTEGER,
    type VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для генеалогического древа
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.family_tree (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL,
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(100),
    birth_year INTEGER,
    death_year INTEGER,
    bio TEXT,
    photo_url TEXT,
    parent_id INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для чата
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.chat_messages (
    id SERIAL PRIMARY KEY,
    family_id INTEGER NOT NULL,
    sender_id INTEGER,
    content TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'text',
    file_url TEXT,
    file_name VARCHAR(255),
    file_size VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_children_profiles_family ON t_p5815085_family_assistant_pro.children_profiles(family_id);
CREATE INDEX IF NOT EXISTS idx_test_results_child ON t_p5815085_family_assistant_pro.test_results(child_member_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_family ON t_p5815085_family_assistant_pro.calendar_events(family_id);
CREATE INDEX IF NOT EXISTS idx_calendar_events_date ON t_p5815085_family_assistant_pro.calendar_events(date);
CREATE INDEX IF NOT EXISTS idx_chat_messages_family ON t_p5815085_family_assistant_pro.chat_messages(family_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created ON t_p5815085_family_assistant_pro.chat_messages(created_at);