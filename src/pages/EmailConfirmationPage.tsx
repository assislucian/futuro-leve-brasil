
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, CheckCircle, Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageProvider";

const EmailConfirmationPage = () => {
  const [email, setEmail] = useState<string>('');
  const [isResending, setIsResending] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingEmailConfirmation');
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, []);

  const handleResendConfirmation = async () => {
    if (!email) {
      toast.error(t('common.error'));
      return;
    }

    setIsResending(true);
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });

      if (error) {
        console.error('Erro ao reenviar confirmação:', error);
        toast.error(t('common.error'));
      } else {
        toast.success(t('common.success'));
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error(t('common.error'));
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Plenus</h1>
          </Link>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-blue-100 p-3">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-xl">
              {t('language.choose').includes('Sprache') ? 'E-Mail bestätigen' : 'Confirme seu E-mail'}
            </CardTitle>
            <CardDescription className="text-base">
              {t('language.choose').includes('Sprache') 
                ? 'Wir haben einen Bestätigungslink an Ihre E-Mail-Adresse gesendet. Klicken Sie auf den Link, um Ihr Konto zu aktivieren.'
                : 'Enviamos um link de confirmação para seu e-mail. Clique no link para ativar sua conta.'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {email && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  {t('language.choose').includes('Sprache') ? 'E-Mail gesendet an:' : 'E-mail enviado para:'}
                </p>
                <p className="font-medium text-foreground">{email}</p>
              </div>
            )}

            <div className="rounded-lg bg-green-50 border border-green-200 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-green-900 mb-1">
                    {t('language.choose').includes('Sprache') ? 'Was kommt als nächstes?' : 'O que fazer agora?'}
                  </p>
                  <ul className="text-green-700 space-y-1">
                    <li>
                      {t('language.choose').includes('Sprache') 
                        ? '1. Überprüfen Sie Ihren Posteingang (und Spam-Ordner)'
                        : '1. Verifique sua caixa de entrada (e spam)'
                      }
                    </li>
                    <li>
                      {t('language.choose').includes('Sprache') 
                        ? '2. Klicken Sie auf den Bestätigungslink'
                        : '2. Clique no link de confirmação'
                      }
                    </li>
                    <li>
                      {t('language.choose').includes('Sprache') 
                        ? '3. Sie werden automatisch angemeldet'
                        : '3. Você será conectado automaticamente'
                      }
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={handleResendConfirmation}
                variant="outline" 
                className="w-full"
                disabled={isResending || !email}
              >
                {isResending 
                  ? (t('language.choose').includes('Sprache') ? 'Wird gesendet...' : 'Reenviando...')
                  : (t('language.choose').includes('Sprache') ? 'E-Mail erneut senden' : 'Reenviar E-mail')
                }
              </Button>

              <Button variant="ghost" asChild className="w-full">
                <Link to="/auth" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {t('auth.back_to_login')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmailConfirmationPage;
