-- Script SQL para criar as tabelas no Supabase
-- Execute este script no SQL Editor do Supabase: https://app.supabase.com -> SQL Editor

-- Tabela para dados do usuário (Liam ou Day)
CREATE TABLE IF NOT EXISTS user_data (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE, -- 'Liam' ou 'Day'
  data JSONB NOT NULL DEFAULT '{}'::jsonb, -- Dados completos do usuário
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela para histórico de cálculos
CREATE TABLE IF NOT EXISTS history (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL, -- 'Liam' ou 'Day'
  entry_data JSONB NOT NULL, -- Dados completos da entrada do histórico
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE
);

-- Tabela para tracker de macros (por data)
CREATE TABLE IF NOT EXISTS macro_tracker (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}'::jsonb, -- { meals: [...], totals: {...} }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date),
  CONSTRAINT fk_user_tracker FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE
);

-- Tabela para planejamento de refeições (por data)
CREATE TABLE IF NOT EXISTS meal_planner (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  meals JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de refeições
  water_glasses INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date),
  CONSTRAINT fk_user_planner FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE
);

-- Tabela para templates de refeições
CREATE TABLE IF NOT EXISTS meal_planner_template (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  template JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array de refeições do template
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user_template FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE
);

-- Tabela para metas personalizadas
CREATE TABLE IF NOT EXISTS goals (
  id BIGSERIAL PRIMARY KEY,
  user_id TEXT NOT NULL UNIQUE,
  goal_data JSONB NOT NULL DEFAULT '{}'::jsonb, -- { targetWeight, targetBodyFat, targetDate, etc }
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_user_goals FOREIGN KEY (user_id) REFERENCES user_data(user_id) ON DELETE CASCADE
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_history_user_id ON history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_timestamp ON history(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_macro_tracker_user_date ON macro_tracker(user_id, date);
CREATE INDEX IF NOT EXISTS idx_meal_planner_user_date ON meal_planner(user_id, date);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER update_user_data_updated_at BEFORE UPDATE ON user_data
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_macro_tracker_updated_at BEFORE UPDATE ON macro_tracker
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_planner_updated_at BEFORE UPDATE ON meal_planner
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meal_planner_template_updated_at BEFORE UPDATE ON meal_planner_template
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comentários nas tabelas
COMMENT ON TABLE user_data IS 'Armazena os dados principais de cada usuário (Liam ou Day)';
COMMENT ON TABLE history IS 'Histórico de cálculos nutricionais por usuário';
COMMENT ON TABLE macro_tracker IS 'Tracker de macros diário por usuário e data';
COMMENT ON TABLE meal_planner IS 'Planejamento de refeições diário por usuário e data';
COMMENT ON TABLE meal_planner_template IS 'Templates de refeições salvos por usuário';
COMMENT ON TABLE goals IS 'Metas personalizadas por usuário';

