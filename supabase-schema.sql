-- Mavaree Database Schema for Supabase
-- Run this in the Supabase SQL Editor after creating your project

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users profile table (extends Supabase Auth)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  business_name TEXT,
  business_type TEXT,
  monthly_spend NUMERIC DEFAULT 0,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'professional', 'executive')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Connected accounts (Plaid)
CREATE TABLE connected_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plaid_access_token TEXT NOT NULL,
  plaid_item_id TEXT NOT NULL,
  institution_name TEXT,
  account_type TEXT,
  account_mask TEXT,
  connected_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spending data from Plaid
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  account_id UUID REFERENCES connected_accounts(id) ON DELETE CASCADE,
  plaid_transaction_id TEXT UNIQUE,
  amount NUMERIC NOT NULL,
  category TEXT,
  merchant_name TEXT,
  date DATE NOT NULL,
  card_used TEXT,
  optimal_card TEXT,
  points_earned NUMERIC DEFAULT 0,
  points_missed NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Points programs
CREATE TABLE points_balances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  program_name TEXT NOT NULL,
  balance NUMERIC DEFAULT 0,
  estimated_value NUMERIC DEFAULT 0,
  expiry_date DATE,
  last_synced TIMESTAMPTZ DEFAULT NOW()
);

-- Saved trips
CREATE TABLE saved_trips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  origin TEXT,
  destination TEXT,
  departure_date DATE,
  return_date DATE,
  cabin_class TEXT,
  points_required NUMERIC,
  estimated_taxes NUMERIC,
  airline TEXT,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'booked', 'completed')),
  ai_recommendation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Affiliate click tracking
CREATE TABLE affiliate_clicks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  card_name TEXT NOT NULL,
  issuer TEXT NOT NULL,
  affiliate_url TEXT NOT NULL,
  clicked_at TIMESTAMPTZ DEFAULT NOW(),
  converted BOOLEAN DEFAULT FALSE,
  conversion_date TIMESTAMPTZ
);

-- AI interaction logs
CREATE TABLE ai_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  ai_type TEXT NOT NULL,
  prompt TEXT,
  response TEXT,
  tokens_used INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own accounts" ON connected_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own accounts" ON connected_accounts FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own transactions" ON transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own transactions" ON transactions FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own balances" ON points_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own balances" ON points_balances FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own trips" ON saved_trips FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own trips" ON saved_trips FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own clicks" ON affiliate_clicks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own clicks" ON affiliate_clicks FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own logs" ON ai_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own logs" ON ai_logs FOR ALL USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name')
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for auto-creating profiles
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
