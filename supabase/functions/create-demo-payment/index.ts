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

// Allowed amounts are fixed server-side so the client can't pick an arbitrary price.
const DEMO_AMOUNTS_CENTS: Record<string, number> = {
  '500': 50000, // 500.00 USD
  '100': 10000, // 100.00 USD
}
const DEFAULT_TIER = '500'
const DEMO_CURRENCY = 'usd'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, tier } = await req.json().catch(() => ({}))
    const receiptEmail =
      typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? email : undefined

    const tierKey = tier === undefined ? DEFAULT_TIER : String(tier)
    const amount = DEMO_AMOUNTS_CENTS[tierKey]
    if (!amount) throw new Error('Invalid demo amount')

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: DEMO_CURRENCY,
      automatic_payment_methods: { enabled: true },
      receipt_email: receiptEmail,
      description: 'BodyBar demo payment',
      metadata: { demo: 'true', demoTier: tierKey },
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
