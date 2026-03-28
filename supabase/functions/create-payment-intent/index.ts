import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import Stripe from "https://esm.sh/stripe@11.1.0?target=deno"

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') ?? '', {
  apiVersion: '2022-11-15',
  httpClient: Stripe.createFetchHttpClient(),
})

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { orderId } = await req.json()

    // Use service role to fetch the order — works for both guests (no auth token)
    // and logged-in users without RLS blocking the lookup.
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, user_id, guest_email, guest_name')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    // Build receipt_email: prefer guest_email, then look up auth user email
    let receiptEmail: string | undefined
    if (order.guest_email) {
      receiptEmail = order.guest_email
    } else if (order.user_id) {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(order.user_id)
      receiptEmail = userData?.user?.email
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total_amount * 100), // AED → fils
      currency: 'aed',
      automatic_payment_methods: { enabled: true },
      receipt_email: receiptEmail,
      metadata: {
        orderId: order.id,
        userId:  order.user_id ?? 'guest',
      },
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})
