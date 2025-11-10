-- Расширяем таблицу tasks для полной функциональности
ALTER TABLE t_p5815085_family_assistant_pro.tasks
ADD COLUMN IF NOT EXISTS assignee_id UUID REFERENCES t_p5815085_family_assistant_pro.family_members(id),
ADD COLUMN IF NOT EXISTS completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS points INTEGER DEFAULT 10,
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium',
ADD COLUMN IF NOT EXISTS category VARCHAR(50),
ADD COLUMN IF NOT EXISTS reminder_time VARCHAR(5),
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS recurring_frequency VARCHAR(20),
ADD COLUMN IF NOT EXISTS recurring_interval INTEGER,
ADD COLUMN IF NOT EXISTS recurring_days_of_week TEXT,
ADD COLUMN IF NOT EXISTS recurring_end_date DATE,
ADD COLUMN IF NOT EXISTS next_occurrence DATE,
ADD COLUMN IF NOT EXISTS cooking_day VARCHAR(20),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_tasks_family_id ON t_p5815085_family_assistant_pro.tasks(family_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assignee_id ON t_p5815085_family_assistant_pro.tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON t_p5815085_family_assistant_pro.tasks(completed);

-- Таблица для напоминаний
CREATE TABLE IF NOT EXISTS t_p5815085_family_assistant_pro.reminders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id UUID NOT NULL REFERENCES t_p5815085_family_assistant_pro.tasks(id),
    reminder_time VARCHAR(5) NOT NULL,
    notified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reminders_task_id ON t_p5815085_family_assistant_pro.reminders(task_id);