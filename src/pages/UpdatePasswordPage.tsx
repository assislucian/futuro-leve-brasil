
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

export function UpdatePasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useLanguage();

  const formSchema = z.object({
    password: z.string().min(6, { message: t('validation.password.min', { min: 6 }) }),
    confirmPassword: z.string().min(1, { message: t('validation.required') }),
  }).refine((data) => data.password === data.confirmPassword, {
    message: t('validation.password.mismatch'),
    path: ["confirmPassword"],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const accessToken = searchParams.get('access_token');
    const refreshToken = searchParams.get('refresh_token');
    
    if (!accessToken || !refreshToken) {
      toast.error(t('auth.update_password.invalid_link'));
      navigate('/auth');
      return;
    }

    supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: refreshToken,
    });
  }, [searchParams, navigate, t]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password
      });

      if (error) {
        console.error('Erro ao atualizar senha:', error);
        toast.error(t('common.error'));
        return;
      }

      toast.success(t('auth.update_password.success'));
      navigate('/dashboard');
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
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Plenus</h1>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>{t('auth.update_password.title')}</CardTitle>
            <CardDescription>
              {t('auth.update_password.subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.update_password.new_password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder={t('auth.update_password.password_placeholder')}
                            {...field}
                            autoComplete="new-password"
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

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.update_password.confirm_password')}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder={t('auth.update_password.confirm_placeholder')}
                            {...field}
                            autoComplete="new-password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
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

                <Button 
                  type="submit" 
                  className="w-full btn-primary" 
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t('auth.update_password.updating') : t('auth.update_password.update')}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
