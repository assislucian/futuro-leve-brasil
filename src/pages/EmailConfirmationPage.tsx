
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Mail, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token = searchParams.get('token');
      const type = searchParams.get('type');
      const redirectTo = searchParams.get('redirect_to');

      if (token && type) {
        try {
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type as any,
          });

          if (error) {
            setStatus('error');
            setMessage('Erro ao confirmar e-mail: ' + error.message);
          } else {
            setStatus('success');
            setMessage('E-mail confirmado com sucesso! Redirecionando...');
            toast.success('E-mail confirmado com sucesso!');
            
            // Redireciona após 2 segundos
            setTimeout(() => {
              navigate(redirectTo || '/dashboard');
            }, 2000);
          }
        } catch (error) {
          setStatus('error');
          setMessage('Erro inesperado ao confirmar e-mail.');
          console.error('Erro na confirmação:', error);
        }
      } else {
        setStatus('pending');
        setMessage('Aguardando confirmação de e-mail...');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  const resendConfirmation = async () => {
    const email = localStorage.getItem('pendingEmailConfirmation');
    if (email) {
      try {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: email,
          options: {
            emailRedirectTo: `${window.location.origin}/email-confirmation`,
          },
        });

        if (error) {
          toast.error('Erro ao reenviar e-mail: ' + error.message);
        } else {
          toast.success('E-mail de confirmação reenviado!');
        }
      } catch (error) {
        toast.error('Erro ao reenviar e-mail de confirmação');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Plenus
              </h1>
              <span className="text-xs text-slate-500 -mt-1">Confirmação de E-mail</span>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              {status === 'loading' && <Loader2 className="h-12 w-12 text-emerald-500 animate-spin" />}
              {status === 'success' && <CheckCircle className="h-12 w-12 text-emerald-500" />}
              {status === 'error' && <XCircle className="h-12 w-12 text-red-500" />}
              {status === 'pending' && <Mail className="h-12 w-12 text-slate-400" />}
            </div>
            
            <CardTitle className="text-xl font-bold text-slate-900">
              {status === 'loading' && 'Confirmando seu e-mail...'}
              {status === 'success' && 'E-mail confirmado!'}
              {status === 'error' && 'Erro na confirmação'}
              {status === 'pending' && 'Confirme seu e-mail'}
            </CardTitle>
            
            <CardDescription className="text-slate-600">
              {status === 'loading' && 'Aguarde enquanto verificamos seu e-mail'}
              {status === 'success' && 'Sua conta foi ativada com sucesso'}
              {status === 'error' && 'Houve um problema na confirmação'}
              {status === 'pending' && 'Verifique sua caixa de entrada'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {message && (
              <Alert className={status === 'error' ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}>
                <AlertDescription className={status === 'error' ? 'text-red-700' : 'text-emerald-700'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'pending' && (
              <div className="space-y-4">
                <div className="text-center text-sm text-slate-600">
                  <p>Enviamos um e-mail de confirmação para você.</p>
                  <p>Clique no link do e-mail para ativar sua conta.</p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button onClick={resendConfirmation} variant="outline" className="w-full">
                    Reenviar e-mail de confirmação
                  </Button>
                  <Button onClick={() => navigate('/auth')} variant="ghost" className="w-full">
                    Voltar para login
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col gap-3">
                <Button onClick={resendConfirmation} className="w-full btn-primary">
                  Reenviar e-mail de confirmação
                </Button>
                <Button onClick={() => navigate('/auth')} variant="outline" className="w-full">
                  Voltar para login
                </Button>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center">
                <p className="text-sm text-slate-600 mb-4">
                  Redirecionando para o dashboard...
                </p>
                <Button onClick={() => navigate('/dashboard')} className="w-full btn-primary">
                  Ir para o Dashboard
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-slate-500">
            Problemas com o e-mail? Entre em contato conosco.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
