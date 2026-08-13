import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'withdrawal' | 'purchase' | 'kyc' | 'deposit';
  userId: string;
  userEmail?: string;
  userName?: string;
  amount?: number;
  method?: string;
  cryptoType?: string;
  walletAddress?: string;
  details?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase service configuration is missing');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const {
      type,
      userId,
      userEmail,
      userName,
      amount,
      method,
      cryptoType,
      walletAddress,
      details,
    } = (await req.json()) as EmailRequest;

    const { data: emailSetting } = await supabase
      .from('admin_settings')
      .select('setting_value')
      .eq('setting_key', 'admin_notification_email')
      .maybeSingle();

    const adminEmail = emailSetting?.setting_value || 'admin@tamicgroup.com';

    let email = userEmail;
    let name = userName;
    if (!email || !name) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('email, full_name')
        .eq('id', userId)
        .maybeSingle();

      email = profile?.email || 'Unknown';
      name = profile?.full_name || profile?.email || 'Unknown User';
    }

    let subject = '';
    let htmlContent = '';

    switch (type) {
      case 'withdrawal':
        subject = `🔔 New Withdrawal Request - $${amount?.toFixed(2)}`;
        htmlContent = `
          <h1>New Withdrawal Request</h1>
          <p><strong>User:</strong> ${name} (${email})</p>
          <p><strong>Amount:</strong> $${amount?.toFixed(2)}</p>
          <p><strong>Method:</strong> ${method === 'bank' ? 'Bank Transfer' : `Crypto (${cryptoType?.toUpperCase()})`}</p>
          ${walletAddress ? `<p><strong>Wallet Address:</strong> ${walletAddress}</p>` : ''}
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <p>Please process this withdrawal in the admin panel.</p>
        `;
        break;

      case 'purchase':
        subject = `💰 New Purchase - $${amount?.toFixed(2)}`;
        htmlContent = `
          <h1>New Purchase Alert</h1>
          <p><strong>User:</strong> ${name} (${email})</p>
          <p><strong>Amount:</strong> $${amount?.toFixed(2)}</p>
          <p><strong>Type:</strong> ${details || 'Purchase'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <p>Please verify and update the user's balance in the admin panel.</p>
        `;
        break;

      case 'kyc':
        subject = '📋 New KYC Submission';
        htmlContent = `
          <h1>New KYC Application</h1>
          <p><strong>User:</strong> ${name} (${email})</p>
          <p><strong>Type:</strong> ${details || 'Individual'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <p>Please review this KYC application in the admin panel.</p>
        `;
        break;

      case 'deposit':
        subject = `💵 New Deposit Request - $${amount?.toFixed(2)}`;
        htmlContent = `
          <h1>New Deposit Notification</h1>
          <p><strong>User:</strong> ${name} (${email})</p>
          <p><strong>Amount:</strong> $${amount?.toFixed(2)}</p>
          <p><strong>Method:</strong> ${method || 'Unknown'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          <hr />
          <p>Please verify and credit the user's account in the admin panel.</p>
        `;
        break;

      default:
        subject = '🔔 TamicGroups Alert';
        htmlContent = `
          <h1>Admin Alert</h1>
          <p><strong>User:</strong> ${name} (${email})</p>
          <p><strong>Details:</strong> ${details || 'No details provided'}</p>
          <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
        `;
    }

    if (resendApiKey) {
      const emailResponse = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'TamicGroups <notifications@tamicgroup.com>',
          to: [adminEmail],
          subject,
          html: htmlContent,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.text();
        console.error('Resend API error:', errorData);
      } else {
        console.log('Email sent successfully to:', adminEmail);
      }
    } else {
      console.log('RESEND_API_KEY not configured. Email notification skipped.');
      console.log('Would have sent to:', adminEmail);
      console.log('Subject:', subject);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Notification processed' }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: unknown) {
    console.error("Error in send-admin-email function:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
