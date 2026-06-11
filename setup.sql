-- ================================================================
-- FAT LOSS TRACKER — SUPABASE DATABASE SETUP
-- ================================================================
-- Paste this entire file into:
-- Supabase Dashboard → SQL Editor → New Query → Run
-- ================================================================

-- ===== WEIGH-INS =====
CREATE TABLE IF NOT EXISTS weigh_ins (
    id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date       date NOT NULL,
    weight     numeric(5,1) NOT NULL,
    notes      text,
    created_at timestamptz DEFAULT now(),
    UNIQUE(user_id, date)
);
ALTER TABLE weigh_ins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own weigh_ins" ON weigh_ins
    FOR ALL USING (auth.uid() = user_id);

-- ===== GYM LOGS =====
CREATE TABLE IF NOT EXISTS gym_logs (
    id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id     uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date        date NOT NULL,
    day_id      text NOT NULL,
    day_name    text,
    exercises   jsonb NOT NULL DEFAULT '[]',
    body_weight numeric(5,1),
    created_at  timestamptz DEFAULT now(),
    UNIQUE(user_id, date, day_id)
);
ALTER TABLE gym_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own gym_logs" ON gym_logs
    FOR ALL USING (auth.uid() = user_id);

-- ===== PERSONAL RECORDS =====
CREATE TABLE IF NOT EXISTS personal_records (
    id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id      uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    exercise     text NOT NULL,
    best_weight  numeric(6,1),
    best_reps    integer,
    best_volume  numeric(10,1),
    date         date,
    created_at   timestamptz DEFAULT now(),
    UNIQUE(user_id, exercise)
);
ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own personal_records" ON personal_records
    FOR ALL USING (auth.uid() = user_id);

-- ===== USER SETTINGS =====
CREATE TABLE IF NOT EXISTS user_settings (
    id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id        uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    start_date     date,
    start_weight   numeric(5,1),
    goal_weight    numeric(5,1),
    weekly_target  numeric(3,2),
    units          text DEFAULT 'lbs',
    updated_at     timestamptz DEFAULT now()
);
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own user_settings" ON user_settings
    FOR ALL USING (auth.uid() = user_id);

-- ===== CUSTOM PROGRAMS =====
CREATE TABLE IF NOT EXISTS custom_programs (
    id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    program    jsonb NOT NULL,
    updated_at timestamptz DEFAULT now()
);
ALTER TABLE custom_programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own custom_programs" ON custom_programs
    FOR ALL USING (auth.uid() = user_id);

-- ================================================================
-- DONE! All tables created with Row Level Security enabled.
-- Each user can only ever read and write their own data.
-- ================================================================
