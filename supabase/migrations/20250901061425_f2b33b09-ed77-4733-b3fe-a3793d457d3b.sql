-- Create trigger for welcome token distribution
CREATE TRIGGER stellar_wallet_creation_trigger
  AFTER INSERT ON public.stellar_wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_stellar_wallet_creation();