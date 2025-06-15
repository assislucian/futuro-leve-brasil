
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0';
import { Resend } from 'npm:resend@3.4.0';
import { renderAsync } from 'npm:@react-email/render@0.0.17';
import React from 'npm:react@18.3.1';

import { ConfirmEmail } from '../_shared/templates/ConfirmEmail.tsx';
import { ResetPasswordEmail } from '../_shared/templates/ResetPasswordEmail.tsx';

// Cabeçalhos CORS para permitir chamadas do navegador
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Cliente Resend inicializado com a chave secreta
const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

// Segredo do Webhook para verificação
const hookSecret = Deno.env.get('AUTH_WEBHOOK_SECRET') as string;

serve(async (req) => {
  // Trata a requisição OPTIONS (pre-flight) do CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const wh = new Webhook(hookSecret);
    const payload = await req.json();
    const headers = Object.fromEntries(req.headers);
    
    // Verifica a assinatura do webhook
    const verifiedPayload = wh.verify(payload, headers) as { type: string; data: any };
    const { type, data } = verifiedPayload;
    
    console.log(`[Auth Webhook] Received event: ${type}`);

    const { user, email_data } = data;
    if (!user || !email_data) {
      throw new Error('Payload do webhook inválido: user ou email_data faltando.');
    }

    let html: string;
    let subject: string;
    const link = `${email_data.site_url}/auth/v1/verify?token=${email_data.token_hash}&type=${email_data.email_action_type}&redirect_to=${email_data.redirect_to}`;

    switch (type) {
      case 'auth.email.signup':
        html = await renderAsync(React.createElement(ConfirmEmail, {
          userName: user.raw_user_meta_data?.full_name,
          confirmationLink: link,
        }));
        subject = 'Bem-vindo ao Plenus! Confirme seu e-mail.';
        break;

      case 'auth.email.recovery_requested':
        html = await renderAsync(React.createElement(ResetPasswordEmail, {
          userName: user.raw_user_meta_data?.full_name,
          resetLink: link,
        }));
        subject = 'Redefina sua senha do Plenus.';
        break;

      default:
        console.warn(`[Auth Webhook] Evento não tratado: ${type}`);
        return new Response(JSON.stringify({ message: 'Evento não tratado' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
    }

    // Envia o e-mail usando Resend
    const { error: resendError } = await resend.emails.send({
      from: 'Plenus <onboarding@resend.dev>', // IMPORTANTE: Mude para seu domínio verificado
      to: [user.email],
      subject,
      html,
    });

    if (resendError) {
      console.error('[Resend Error]', resendError);
      throw resendError;
    }

    console.log(`[Auth Webhook] E-mail do tipo '${type}' enviado para ${user.email}`);
    
    return new Response(JSON.stringify({ message: 'E-mail enviado com sucesso' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });

  } catch (err) {
    console.error('[Webhook Error]', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});
