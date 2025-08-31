-- Create table to track wallet creation and token distributions
CREATE TABLE public.stellar_wallets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  public_key TEXT NOT NULL UNIQUE,
  tokens_distributed BOOLEAN NOT NULL DEFAULT false,
  welcome_tokens_amount NUMERIC DEFAULT 100,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on stellar_wallets table
ALTER TABLE public.stellar_wallets ENABLE ROW LEVEL SECURITY;

-- Create policies for stellar_wallets
CREATE POLICY "Users can view their own stellar wallets" 
ON public.stellar_wallets 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own stellar wallets" 
ON public.stellar_wallets 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stellar wallets" 
ON public.stellar_wallets 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for automatic timestamp updates on stellar_wallets
CREATE TRIGGER update_stellar_wallets_updated_at
BEFORE UPDATE ON public.stellar_wallets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle token distribution when stellar wallet is created
CREATE OR REPLACE FUNCTION public.handle_stellar_wallet_creation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Update the user's iLede wallet balance with welcome tokens
  UPDATE public.wallets 
  SET balance = balance + NEW.welcome_tokens_amount,
      updated_at = now()
  WHERE user_id = NEW.user_id AND asset_code = 'iLede';
  
  -- Mark tokens as distributed
  NEW.tokens_distributed = true;
  
  RETURN NEW;
END;
$function$;

-- Create trigger for stellar wallet creation to distribute tokens
CREATE TRIGGER on_stellar_wallet_created
  BEFORE INSERT ON public.stellar_wallets
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_stellar_wallet_creation();