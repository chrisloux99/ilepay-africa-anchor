import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { 
  Keypair, 
  Networks, 
  TransactionBuilder, 
  Operation, 
  Memo,
  BASE_FEE 
} from 'https://esm.sh/stellar-sdk@13.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const account = url.searchParams.get('account');
    const home_domain = url.searchParams.get('home_domain');
    const client_domain = url.searchParams.get('client_domain');

    if (req.method === 'GET') {
      // GET /auth - Return challenge transaction for SEP-10
      if (!account) {
        return new Response(JSON.stringify({ error: 'account parameter is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // Generate challenge transaction
      const serverKeypair = Keypair.fromSecret(Deno.env.get('STELLAR_SECRET_KEY') || Keypair.random().secret());
      const networkPassphrase = Networks.TESTNET;
      
      // Create a challenge transaction
      const now = Math.floor(Date.now() / 1000);
      const timeout = 300; // 5 minutes
      
      const transaction = new TransactionBuilder(
        {
          accountId: () => serverKeypair.publicKey(),
          sequenceNumber: () => '0',
          incrementSequenceNumber: () => {},
        } as any,
        {
          fee: BASE_FEE,
          networkPassphrase,
          timebounds: {
            minTime: now,
            maxTime: now + timeout,
          },
        }
      )
        .addOperation(
          Operation.manageData({
            name: `iLede auth`,
            value: crypto.getRandomValues(new Uint8Array(48)),
            source: account,
          })
        )
        .addOperation(
          Operation.manageData({
            name: 'web_auth_domain',
            value: home_domain || 'localhost:3000',
            source: serverKeypair.publicKey(),
          })
        )
        .setTimeout(timeout)
        .build();

      transaction.sign(serverKeypair);
      
      return new Response(JSON.stringify({
        transaction: transaction.toXDR(),
        network_passphrase: networkPassphrase
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
      
    } else if (req.method === 'POST') {
      // POST /auth - Verify signed challenge and return JWT
      const { transaction } = await req.json();
      
      if (!transaction) {
        return new Response(JSON.stringify({ error: 'transaction is required' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }

      // For testnet, return a mock JWT
      // In production, you would verify the transaction signature here
      const mockJWT = 'mock_jwt_token_for_testnet';
      
      return new Response(JSON.stringify({
        token: mockJWT
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in sep10-auth function:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});