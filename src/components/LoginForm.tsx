
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLanguage } from "@/contexts/LanguageProvider";

export function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const { t } = useLanguage();

  const formSchema = z.object({
    email: z.string()
      .email({ message: t('validation.email.invalid') })
      .toLowerCase(),
    password: z.string().min(1, { message: t('validation.required') }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    setAttemptCount(prev => prev + 1);
    
    try {
      console.log('Tentando fazer login para:', values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      console.log('Resultado do login:', { data, error });

      if (error) {
        console.error('Erro no login:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          if (attemptCount >= 3) {
            toast.error(t('auth.login.many_attempts'));
          } else {
            toast.error(t('auth.login.invalid_credentials'));
          }
        } else if (error.message.includes('Email not confirmed')) {
          toast.error(t('auth.login.email_not_confirmed'));
          localStorage.setItem('pendingEmailConfirmation', values.email);
          navigate('/email-confirmation');
          return;
        } else if (error.message.includes('Too many requests')) {
          toast.error(t('auth.login.too_many_requests'));
        } else if (error.message.includes('User not found')) {
          toast.error(t('auth.login.user_not_found'));
        } else if (error.message.includes('rate limit')) {
          toast.error(t('auth.login.rate_limit'));
        } else {
          toast.error(t('auth.login.generic_error'));
        }
        return;
      }

      if (data.user) {
        console.log('Login realizado com sucesso:', data.user.email);
        
        if (!data.user.email_confirmed_at) {
          toast.error(t('auth.login.email_not_confirmed'));
          localStorage.setItem('pendingEmailConfirmation', values.email);
          navigate('/email-confirmation');
          return;
        }
        
        toast.success(t('auth.login.success'), {
          duration: 3000,
        });
        
        setAttemptCount(0);
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast.error(t('auth.login.system_error'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('auth.password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder={t('auth.password_placeholder')}
                    {...field}
                    autoComplete="current-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end">
          <Link 
            to="/forgot-password" 
            className="text-sm text-primary hover:underline"
          >
            {t('auth.forgot_password')}
          </Link>
        </div>

        {attemptCount >= 3 && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              {t('auth.login.help_text')}{' '}
              <Link to="/forgot-password" className="underline">
                {t('auth.login.reset_password')}
              </Link>{' '}
              {t('auth.login.contact_support')}
            </AlertDescription>
          </Alert>
        )}

        <Button 
          type="submit" 
          className="w-full btn-primary" 
          disabled={isSubmitting}
        >
          {isSubmitting ? t('auth.login.logging_in') : t('auth.login')}
        </Button>
      </form>
    </Form>
  );
}
