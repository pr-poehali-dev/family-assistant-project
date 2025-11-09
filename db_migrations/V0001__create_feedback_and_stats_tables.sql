-- Таблица для отзывов, техподдержки и предложений
CREATE TABLE IF NOT EXISTS feedback (
  id SERIAL PRIMARY KEY,
  type VARCHAR(20) NOT NULL CHECK (type IN ('review', 'support', 'suggestion')),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255),
  title VARCHAR(500) NOT NULL,
  description TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для статистики кликов по кнопкам
CREATE TABLE IF NOT EXISTS user_feedback_stats (
  id SERIAL PRIMARY KEY,
  feedback_type VARCHAR(50) NOT NULL CHECK (feedback_type IN ('will_use', 'not_interested')),
  user_session VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица для настроек пользователей (темы оформления)
CREATE TABLE IF NOT EXISTS user_preferences (
  id SERIAL PRIMARY KEY,
  user_session VARCHAR(255) UNIQUE NOT NULL,
  theme VARCHAR(50) DEFAULT 'middle' CHECK (theme IN ('young', 'middle', 'senior', 'apple')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_stats_type ON user_feedback_stats(feedback_type);
CREATE INDEX IF NOT EXISTS idx_stats_created ON user_feedback_stats(created_at);