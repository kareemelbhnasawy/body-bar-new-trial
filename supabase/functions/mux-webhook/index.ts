import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import Mux from "https://esm.sh/@mux/mux-node@7.3.1"

const muxSecret = Deno.env.get('MUX_WEBHOOK_SECRET');

serve(async (req) => {
    try {
        const payload = await req.text();
        const signature = req.headers.get("mux-signature");

        if (!signature || !muxSecret) {
            return new Response("Missing signature or secret", { status: 400 });
        }

        let event;
        try {
            event = Mux.Webhooks.verifySignature(payload, req.headers, muxSecret);
        } catch (err) {
            console.error("Webhook Error:", err.message);
            return new Response(`Webhook Error: ${err.message}`, { status: 400 });
        }

        if (event.type === 'video.asset.ready') {
            const asset = event.data;
            const playbackId = asset.playback_ids?.find((p: any) => p.policy === 'public')?.id;
            
            let userId = null;
            try {
                if (asset.passthrough) {
                    const passData = JSON.parse(asset.passthrough);
                    userId = passData.userId;
                }
            } catch (e) {
                console.log("No valid passthrough JSON found.");
            }

            if (playbackId) {
                // Connect to Supabase using the SERVICE_ROLE key (bypasses RLS to write the completed video)
                const supabaseClient = createClient(
                    Deno.env.get('SUPABASE_URL') ?? '',
                    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
                );

                if (userId) {
                    // Example: Update the user's profile or insert into a `videos` table
                    // You would customize this table logic based on the app's needs.
                    console.log(`Video ready for User: ${userId}. Playback ID: ${playbackId}`);
                }
            }
        }

        return new Response(JSON.stringify({ received: true }), { status: 200 })
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }
});
