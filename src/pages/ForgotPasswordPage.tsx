
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

const formSchema = z.object({
  email: z.string().email({ message: "Bitte geben Sie eine gültige E-Mail-Adresse ein." }),
});

function ForgotPasswordForm() {
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
      toast.success("Wenn die E-Mail korrekt ist, haben wir einen Link zum Zurücksetzen Ihres Passworts gesendet.");
      form.reset();
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Passwort vergessen?</CardTitle>
        <CardDescription>
          Kein Problem. Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Erstellen eines neuen Passworts.
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
                  <FormLabel>E-Mail</FormLabel>
                  <FormControl>
                    <Input placeholder="ihre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Wird gesendet..." : "Zurücksetzungslink senden"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const ForgotPasswordPage = () => {
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
            Passwort wieder eingefallen?{" "}
            <Link to="/auth" className="underline hover:text-primary">
              Zurück zur Anmeldung
            </Link>
          </div>
      </div>
    </div>
  );
};

export { ForgotPasswordPage };
export default ForgotPasswordPage;
