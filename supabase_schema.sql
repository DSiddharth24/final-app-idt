-- Digital Workforce & Mechanisation Platform - Supabase Schema (Idempotent Version)

-- 1. Profiles Table (Extends Auth.Users)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('MANAGER', 'SUPERVISOR', 'WORKER');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role user_role DEFAULT 'WORKER' NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Plantations Table
CREATE TABLE IF NOT EXISTS plantations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    manager_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Zones Table
CREATE TABLE IF NOT EXISTS zones (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    plantation_id UUID REFERENCES plantations(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    supervisor_id UUID REFERENCES profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. IoT Devices Table
CREATE TABLE IF NOT EXISTS iot_devices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    device_name TEXT NOT NULL,
    zone_id UUID REFERENCES zones(id),
    api_key TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'active',
    last_ping TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. RFID Cards Table
CREATE TABLE IF NOT EXISTS rfid_cards (
    rfid_uid TEXT PRIMARY KEY,
    worker_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Shifts Table (Check-in/Check-out)
CREATE TABLE IF NOT EXISTS shifts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    zone_id UUID REFERENCES zones(id),
    check_in_time TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    check_out_time TIMESTAMP WITH TIME ZONE,
    total_hours NUMERIC(5, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Attendance Logs (Raw logs for audit)
CREATE TABLE IF NOT EXISTS attendance_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id UUID REFERENCES profiles(id),
    device_id UUID REFERENCES iot_devices(id),
    rfid_uid TEXT,
    tap_type TEXT CHECK (tap_type IN ('IN', 'OUT')),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Wages Table
CREATE TABLE IF NOT EXISTS wages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    worker_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    shift_id UUID REFERENCES shifts(id),
    amount NUMERIC(10, 2) NOT NULL,
    payment_status TEXT DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    details JSONB,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ENABLE ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE plantations ENABLE ROW LEVEL SECURITY;
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE rfid_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE wages ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- POLICIES (Using DROP IF EXISTS + CREATE to avoid "already exists" errors)

-- Profiles
DROP POLICY IF EXISTS "Profiles are viewable by everyone" ON profiles;
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
CREATE POLICY "Users can update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Plantations
DROP POLICY IF EXISTS "Plantations viewable by Managers" ON plantations;
CREATE POLICY "Plantations viewable by Managers" ON plantations FOR ALL USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'MANAGER'
);
DROP POLICY IF EXISTS "Plantations viewable by Supervisors/Workers" ON plantations;
CREATE POLICY "Plantations viewable by Supervisors/Workers" ON plantations FOR SELECT USING (true);

-- Shifts
DROP POLICY IF EXISTS "Workers can view their own shifts" ON shifts;
CREATE POLICY "Workers can view their own shifts" ON shifts FOR SELECT USING (auth.uid() = worker_id);
DROP POLICY IF EXISTS "Managers/Supervisors can view shifts" ON shifts;
CREATE POLICY "Managers/Supervisors can view shifts" ON shifts FOR SELECT USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) IN ('MANAGER', 'SUPERVISOR')
);

-- Attendance Logs
DROP POLICY IF EXISTS "IoT Devices can insert logs" ON attendance_logs;
CREATE POLICY "IoT Devices can insert logs" ON attendance_logs FOR INSERT WITH CHECK (true);

-- FUNCTIONS & TRIGGERS

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', 'WORKER')
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

