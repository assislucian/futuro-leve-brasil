
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageProvider";

const formSchema = z.object({
  email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
});

function ForgotPasswordForm() {
  const { t } = useLanguage();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await supabase.auth.resetPasswordForEmail(values.email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success(t('auth.forgot_password.success'));
      form.reset();
    }
  }

  return (
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
                    <Input placeholder={t('auth.email_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? t('auth.forgot_password.sending') : t('auth.reset_link')}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const ForgotPasswordPage = () => {
  const { t } = useLanguage();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Plenus</h1>
          </Link>
        </div>
        <ForgotPasswordForm />
         <div className="mt-4 text-center text-sm">
            {t('auth.forgot_password.remembered')}{" "}
            <Link to="/auth" className="underline hover:text-primary">
              {t('auth.back_to_login')}
            </Link>
          </div>
      </div>
    </div>
  );
};

export { ForgotPasswordPage };
export default ForgotPasswordPage;
