import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"
import Mux from "https://esm.sh/@mux/mux-node@7.3.1"

const mux = new Mux({
    tokenId: Deno.env.get('MUX_TOKEN_ID'),
    tokenSecret: Deno.env.get('MUX_TOKEN_SECRET')
});

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight requests
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Authenticate the user
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) throw new Error('Unauthorized');

        // Create a direct upload URL
        const upload = await mux.video.uploads.create({
            cors_origin: '*',
            new_asset_settings: {
                playback_policy: ['public'],
                mp4_support: 'standard',
                passthrough: JSON.stringify({ userId: user.id }), // Custom metadata to map it back on webhook
            },
        });

        return new Response(JSON.stringify({ uploadUrl: upload.url, uploadId: upload.id }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        })
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        })
    }
});
