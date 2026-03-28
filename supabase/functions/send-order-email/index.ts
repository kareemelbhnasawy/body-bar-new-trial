import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

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

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch order + items
    const { data: order, error: orderErr } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, status, payment_method, guest_email, guest_name, user_id, created_at')
      .eq('id', orderId)
      .single()

    if (orderErr || !order) throw new Error('Order not found')

    const { data: orderItems } = await supabaseAdmin
      .from('order_items')
      .select('product_name, quantity, price')
      .eq('order_id', orderId)

    // Resolve recipient email
    let toEmail: string | undefined
    let toName = 'Valued Customer'

    if (order.guest_email) {
      toEmail = order.guest_email
      toName  = order.guest_name ?? toName
    } else if (order.user_id) {
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(order.user_id)
      toEmail = userData?.user?.email
      toName  = userData?.user?.user_metadata?.full_name ?? toName
    }

    if (!toEmail) throw new Error('No recipient email found')

    const isCOD     = order.payment_method === 'cash_on_delivery'
    const shortId   = order.id.slice(0, 8).toUpperCase()
    const orderDate = new Date(order.created_at).toLocaleDateString('en-AE', {
      day: 'numeric', month: 'long', year: 'numeric',
    })

    // Build items rows HTML
    const itemsHtml = (orderItems ?? []).map(item => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#e5e7eb;font-size:14px;">${item.product_name}</td>
        <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#9ca3af;font-size:14px;text-align:center;">×${item.quantity}</td>
        <td style="padding:10px 0;border-bottom:1px solid #2a2a2a;color:#e5e7eb;font-size:14px;text-align:right;">AED ${(item.price * item.quantity).toFixed(0)}</td>
      </tr>`).join('')

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#111111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;padding:40px 20px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1a1a1a;border-radius:16px;border:1px solid #2a2a2a;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#f97316;padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#000;font-size:24px;font-weight:900;letter-spacing:-0.5px;text-transform:uppercase;">
            ${isCOD ? 'Order Received!' : 'Payment Confirmed!'}
          </h1>
          <p style="margin:6px 0 0;color:#000;opacity:0.7;font-size:13px;">Body Bar — Order #${shortId}</p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:32px;">
          <p style="margin:0 0 20px;color:#d1d5db;font-size:15px;line-height:1.6;">
            Hi ${toName},<br><br>
            ${isCOD
              ? 'Thanks for your order! Our team will contact you shortly to arrange delivery and collect payment.'
              : 'Your payment was successful and your order is confirmed. We\'re getting everything ready for you.'}
          </p>

          <!-- Order meta -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#111111;border-radius:10px;padding:16px;margin-bottom:24px;">
            <tr>
              <td style="color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;padding:4px 0;">Order ID</td>
              <td style="color:#f97316;font-size:13px;font-weight:700;text-align:right;padding:4px 0;">#${shortId}</td>
            </tr>
            <tr>
              <td style="color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;padding:4px 0;">Date</td>
              <td style="color:#e5e7eb;font-size:13px;text-align:right;padding:4px 0;">${orderDate}</td>
            </tr>
            <tr>
              <td style="color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;padding:4px 0;">Payment</td>
              <td style="color:#e5e7eb;font-size:13px;text-align:right;padding:4px 0;">${isCOD ? 'Cash on Delivery' : 'Paid Online'}</td>
            </tr>
          </table>

          <!-- Items -->
          <p style="margin:0 0 10px;color:#9ca3af;font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Items Ordered</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemsHtml}
            <tr>
              <td colspan="2" style="padding:14px 0 4px;color:#9ca3af;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;">Total</td>
              <td style="padding:14px 0 4px;color:#f97316;font-size:18px;font-weight:900;text-align:right;">AED ${order.total_amount.toFixed(0)}</td>
            </tr>
          </table>

          <!-- CTA -->
          <div style="text-align:center;margin-top:32px;">
            <a href="https://bodybar.ae" style="display:inline-block;background:#f97316;color:#000;font-weight:900;font-size:14px;text-transform:uppercase;letter-spacing:0.05em;padding:14px 32px;border-radius:10px;text-decoration:none;">
              Continue Shopping
            </a>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:20px 32px;border-top:1px solid #2a2a2a;text-align:center;">
          <p style="margin:0;color:#6b7280;font-size:12px;">Body Bar · Dubai, UAE · support@bodybar.ae</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`

    // Send via Resend
    const resendKey = Deno.env.get('RESEND_API_KEY')
    if (!resendKey) throw new Error('RESEND_API_KEY not set')

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from:    'Body Bar <orders@bodybar.ae>',
        to:      [toEmail],
        subject: `Order Confirmed — #${shortId} · AED ${order.total_amount.toFixed(0)}`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Resend error: ${err}`)
    }

    return new Response(JSON.stringify({ sent: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400
    })
  }
})
