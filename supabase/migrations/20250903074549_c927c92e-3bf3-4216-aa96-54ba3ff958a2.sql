-- Add security_settings column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN security_settings jsonb;