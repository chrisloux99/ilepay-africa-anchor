-- Create profiles table for additional user information
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  country_code TEXT DEFAULT 'ZM',
  wallet_address TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create wallets table for storing wallet balances
CREATE TABLE public.wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  asset_code TEXT NOT NULL DEFAULT 'iLede',
  asset_issuer TEXT,
  balance DECIMAL(20, 7) NOT NULL DEFAULT 0,
  frozen BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, asset_code, asset_issuer)
);

-- Enable RLS on wallets
ALTER TABLE public.wallets ENABLE ROW LEVEL SECURITY;

-- Create wallet policies
CREATE POLICY "Users can view their own wallets" 
ON public.wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallets" 
ON public.wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wallets" 
ON public.wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create transactions table
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('send', 'receive', 'deposit', 'withdraw', 'telecom_purchase')),
  amount DECIMAL(20, 7) NOT NULL,
  asset_code TEXT NOT NULL,
  asset_issuer TEXT,
  recipient_address TEXT,
  sender_address TEXT,
  memo TEXT,
  stellar_tx_hash TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  telecom_provider TEXT,
  phone_number TEXT,
  service_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create transaction policies
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create telecom services table
CREATE TABLE public.telecom_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider TEXT NOT NULL CHECK (provider IN ('MTN', 'Airtel', 'Zamtel', 'ZedMobile')),
  service_type TEXT NOT NULL CHECK (service_type IN ('data', 'airtime')),
  package_name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  data_amount TEXT,
  validity_days INTEGER,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on telecom services
ALTER TABLE public.telecom_services ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view telecom services
CREATE POLICY "Anyone can view telecom services" 
ON public.telecom_services 
FOR SELECT 
USING (active = true);

-- Insert sample telecom packages
INSERT INTO public.telecom_services (provider, service_type, package_name, amount, data_amount, validity_days) VALUES
-- MTN Packages
('MTN', 'data', 'Daily Bundle 100MB', 2.00, '100MB', 1),
('MTN', 'data', 'Weekly Bundle 1GB', 15.00, '1GB', 7),
('MTN', 'data', 'Monthly Bundle 5GB', 50.00, '5GB', 30),
('MTN', 'airtime', 'K5 Airtime', 5.00, NULL, NULL),
('MTN', 'airtime', 'K10 Airtime', 10.00, NULL, NULL),
('MTN', 'airtime', 'K20 Airtime', 20.00, NULL, NULL),

-- Airtel Packages
('Airtel', 'data', 'Daily 200MB', 3.00, '200MB', 1),
('Airtel', 'data', 'Weekly 1.5GB', 18.00, '1.5GB', 7),
('Airtel', 'data', 'Monthly 6GB', 55.00, '6GB', 30),
('Airtel', 'airtime', 'K5 Airtime', 5.00, NULL, NULL),
('Airtel', 'airtime', 'K15 Airtime', 15.00, NULL, NULL),
('Airtel', 'airtime', 'K25 Airtime', 25.00, NULL, NULL),

-- Zamtel Packages
('Zamtel', 'data', 'Daily 150MB', 2.50, '150MB', 1),
('Zamtel', 'data', 'Weekly 1.2GB', 16.00, '1.2GB', 7),
('Zamtel', 'data', 'Monthly 4GB', 45.00, '4GB', 30),
('Zamtel', 'airtime', 'K3 Airtime', 3.00, NULL, NULL),
('Zamtel', 'airtime', 'K10 Airtime', 10.00, NULL, NULL),
('Zamtel', 'airtime', 'K20 Airtime', 20.00, NULL, NULL),

-- ZedMobile Packages  
('ZedMobile', 'data', 'Daily 120MB', 2.20, '120MB', 1),
('ZedMobile', 'data', 'Weekly 800MB', 12.00, '800MB', 7),
('ZedMobile', 'data', 'Monthly 3GB', 35.00, '3GB', 30),
('ZedMobile', 'airtime', 'K5 Airtime', 5.00, NULL, NULL),
('ZedMobile', 'airtime', 'K12 Airtime', 12.00, NULL, NULL),
('ZedMobile', 'airtime', 'K25 Airtime', 25.00, NULL, NULL);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_wallets_updated_at
  BEFORE UPDATE ON public.wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
  BEFORE UPDATE ON public.transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email));
  
  -- Create default iLede wallet
  INSERT INTO public.wallets (user_id, asset_code, balance)
  VALUES (NEW.id, 'iLede', 0);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();