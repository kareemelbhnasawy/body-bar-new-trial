import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@11.1.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Fixed server-side so the client can't change the amount.
const DEMO_AMOUNT_CENTS = 50000 // 500.00 USD
const DEMO_CURRENCY = 'usd'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json().catch(() => ({}))
    const receiptEmail =
      typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined

    const paymentIntent = await stripe.paymentIntents.create({
      amount: DEMO_AMOUNT_CENTS,
      currency: DEMO_CURRENCY,
      automatic_payment_methods: { enabled: true },
      receipt_email: receiptEmail,
      description: 'BodyBar demo payment',
      metadata: { demo: 'true' },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
