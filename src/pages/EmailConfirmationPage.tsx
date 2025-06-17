
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Sparkles, Mail, CheckCircle, XCircle, Loader2, RefreshCw, Clock } from "lucide-react";
import { toast } from "sonner";

const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'pending'>('pending');
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    const handleEmailConfirmation = async () => {
      const token = searchParams.get('token');
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type');
      const error = searchParams.get('error');
      const errorDescription = searchParams.get('error_description');

      console.log('Parâmetros da URL:', { token, tokenHash, type, error, errorDescription });

      if (error) {
        setStatus('error');
        if (error === 'access_denied') {
          setMessage('Link expirado ou inválido. Solicite um novo email de confirmação.');
        } else {
          setMessage(errorDescription || 'Erro na confirmação do e-mail');
        }
        return;
      }

      if (tokenHash && type) {
        setStatus('loading');
        try {
          console.log('Verificando token:', { tokenHash, type });
          
          const { data, error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as any,
          });

          console.log('Resultado da verificação:', { data, error: verifyError });

          if (verifyError) {
            console.error('Erro na verificação:', verifyError);
            setStatus('error');
            if (verifyError.message.includes('expired')) {
              setMessage('Link de confirmação expirado. Solicite um novo email de confirmação.');
            } else if (verifyError.message.includes('invalid')) {
              setMessage('Link de confirmação inválido. Verifique se você clicou no link correto do email.');
            } else {
              setMessage('Erro na confirmação. Tente solicitar um novo email de confirmação.');
            }
          } else if (data.user) {
            console.log('E-mail confirmado com sucesso:', data.user.email);
            setStatus('success');
            setMessage('E-mail confirmado com sucesso! Sua conta está ativa.');
            toast.success('🎉 Bem-vindo(a) ao Plenus! Sua conta foi ativada com sucesso.');
            
            localStorage.removeItem('pendingEmailConfirmation');
            
            setTimeout(() => {
              navigate('/dashboard');
            }, 2000);
          } else {
            setStatus('error');
            setMessage('Erro inesperado na confirmação. Tente novamente.');
          }
        } catch (error) {
          console.error('Erro inesperado:', error);
          setStatus('error');
          setMessage('Erro do sistema. Tente novamente em alguns minutos.');
        }
      } else {
        setStatus('pending');
        setMessage('Aguardando confirmação de e-mail...');
      }
    };

    handleEmailConfirmation();
  }, [searchParams, navigate]);

  // Cooldown para reenvio
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCooldown]);

  const resendConfirmation = async () => {
    const email = localStorage.getItem('pendingEmailConfirmation');
    if (!email) {
      toast.error('E-mail não encontrado. Tente fazer o cadastro novamente.');
      navigate('/auth');
      return;
    }

    if (resendCooldown > 0) {
      toast.error(`Aguarde ${resendCooldown} segundos antes de tentar novamente.`);
      return;
    }

    setIsResending(true);
    try {
      console.log('Reenviando e-mail para:', email);
      
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
        },
      });

      if (error) {
        console.error('Erro ao reenviar:', error);
        if (error.message.includes('rate limit')) {
          toast.error('Limite de reenvios atingido. Aguarde alguns minutos.');
          setResendCooldown(300); // 5 minutos
        } else {
          toast.error('Erro ao reenviar e-mail. Tente novamente.');
        }
      } else {
        toast.success('📧 Email reenviado! Verifique sua caixa de entrada e spam.');
        setMessage('Novo e-mail de confirmação enviado! Verifique sua caixa de entrada e pasta de spam.');
        setResendCooldown(60); // 1 minuto
      }
    } catch (error) {
      console.error('Erro inesperado ao reenviar:', error);
      toast.error('Erro do sistema. Tente novamente.');
    } finally {
      setIsResending(false);
    }
  };

  const goToAuth = () => {
    localStorage.removeItem('pendingEmailConfirmation');
    navigate('/auth');
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
              {status === 'success' && 'E-mail confirmado! 🎉'}
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
              <Alert className={status === 'error' ? 'border-red-200 bg-red-50' : status === 'success' ? 'border-emerald-200 bg-emerald-50' : 'border-blue-200 bg-blue-50'}>
                <AlertDescription className={status === 'error' ? 'text-red-700' : status === 'success' ? 'text-emerald-700' : 'text-blue-700'}>
                  {message}
                </AlertDescription>
              </Alert>
            )}

            {status === 'pending' && (
              <div className="space-y-4">
                <div className="text-center text-sm text-slate-600 space-y-2">
                  <p className="font-medium">📧 E-mail de confirmação enviado!</p>
                  <p>Clique no link do e-mail para ativar sua conta.</p>
                  <p className="text-xs text-slate-500">
                    Não esqueça de verificar a pasta de spam.
                  </p>
                </div>
                
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={resendConfirmation} 
                    variant="outline" 
                    className="w-full"
                    disabled={isResending || resendCooldown > 0}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Reenviando...
                      </>
                    ) : resendCooldown > 0 ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Aguarde {resendCooldown}s
                      </>
                    ) : (
                      'Reenviar e-mail de confirmação'
                    )}
                  </Button>
                  <Button onClick={goToAuth} variant="ghost" className="w-full">
                    Voltar para login
                  </Button>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-3">
                <div className="flex flex-col gap-3">
                  <Button 
                    onClick={resendConfirmation} 
                    className="w-full"
                    disabled={isResending || resendCooldown > 0}
                  >
                    {isResending ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Reenviando...
                      </>
                    ) : resendCooldown > 0 ? (
                      <>
                        <Clock className="w-4 h-4 mr-2" />
                        Aguarde {resendCooldown}s
                      </>
                    ) : (
                      'Solicitar novo e-mail'
                    )}
                  </Button>
                  <Button onClick={goToAuth} variant="outline" className="w-full">
                    Fazer novo cadastro
                  </Button>
                </div>
              </div>
            )}

            {status === 'success' && (
              <div className="text-center space-y-4">
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-emerald-700 font-medium">🚀 Conta ativada com sucesso!</p>
                  <p className="text-sm text-emerald-600 mt-1">
                    Redirecionando para o dashboard...
                  </p>
                </div>
                <Button onClick={() => navigate('/dashboard')} className="w-full">
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
