import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from '../_shared/cors.ts';
import { createHash } from 'https://deno.land/std@0.177.0/hash/mod.ts';

const PAYMENT_SECRET = Deno.env.get('PAYMENT_SECRET') || '';
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') || '';
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') || '';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const params = await req.json();
    const {
      pid,
      trade_no,
      out_trade_no,
      type,
      name,
      money,
      trade_status,
      sign,
      sign_type
    } = params;

    // Verify the payment signature
    const signString = `money=${money}&name=${name}&out_trade_no=${out_trade_no}&pid=${pid}&trade_no=${trade_no}&trade_status=${trade_status}&type=${type}${PAYMENT_SECRET}`;
    const calculatedSign = createHash('md5').update(signString).toString();

    if (calculatedSign !== sign || sign_type !== 'MD5') {
      throw new Error('Invalid signature');
    }

    // Extract user_id from pid (format: user_id_timestamp)
    const [userId] = pid.split('_');
    if (!userId) {
      throw new Error('Invalid user ID format');
    }

    // Check if this payment has already been processed
    const { data: existingPayment } = await supabase
      .from('payment_records')
      .select('id')
      .eq('payment_id', pid)
      .single();

    if (existingPayment) {
      return new Response(
        JSON.stringify({ success: false, message: 'Payment already processed' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Begin transaction
    const { data: user, error: userError } = await supabase
      .from('users')
      .update({ usage_limit: supabase.sql`usage_limit + 3` })
      .eq('id', userId)
      .select()
      .single();

    if (userError) {
      throw userError;
    }

    // Record the payment
    const { error: paymentError } = await supabase
      .from('payment_records')
      .insert({
        payment_id: pid,
        user_id: userId,
        amount: money,
        trade_no,
        trade_status,
        payment_type: type
      });

    if (paymentError) {
      throw paymentError;
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Payment processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error processing payment:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});