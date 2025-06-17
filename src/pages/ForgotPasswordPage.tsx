
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

export function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { t } = useLanguage();

  const formSchema = z.object({
    email: z.string()
      .min(1, { message: t('validation.required') })
      .email({ message: t('validation.email.invalid') })
      .toLowerCase(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
        redirectTo: `${window.location.origin}/update-password`,
      });

      if (error) {
        console.error('Erro ao enviar email:', error);
        toast.error(t('common.error'));
        return;
      }

      toast.success(t('auth.forgot_password.success'));
      form.reset();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error(t('common.error'));
    } finally {
      setIsSubmitting(false);
    }
  }

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
          <CardHeader>
            <CardTitle>{t('auth.forgot_password.title')}</CardTitle>
            <CardDescription>
              {t('auth.forgot_password.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.email')}</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder={t('auth.email_placeholder')}
                          type="email"
                          {...field}
                          autoComplete="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('auth.forgot_password.sending') : t('auth.reset_link')}
                </Button>

                <div className="text-center">
                  <Link 
                    to="/auth" 
                    className="text-sm text-primary hover:underline"
                  >
                    {t('auth.forgot_password.remembered')} {t('auth.back_to_login')}
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
