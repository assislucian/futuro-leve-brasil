
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
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const formSchema = z.object({
  password: z.string().min(6, { message: "Das Passwort muss mindestens 6 Zeichen lang sein." }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"],
});

function UpdatePasswordForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      password: "",
      confirmPassword: "" 
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await supabase.auth.updateUser({
      password: values.password
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Passwort erfolgreich aktualisiert!");
      navigate("/dashboard");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Neues Passwort erstellen</CardTitle>
        <CardDescription>
          Geben Sie Ihr neues Passwort ein, um Ihr Konto zu sichern.
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
                  <FormLabel>Neues Passwort</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Mindestens 6 Zeichen" {...field} />
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
                  <FormLabel>Passwort bestätigen</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Passwort erneut eingeben" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Wird aktualisiert..." : "Passwort aktualisieren"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

const UpdatePasswordPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Prüfen, ob der Benutzer von einem gültigen Passwort-Reset-Link kommt
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get('access_token');
    const type = hashParams.get('type');
    
    if (!accessToken || type !== 'recovery') {
      toast.error("Ungültiger oder abgelaufener Link");
      navigate("/forgot-password");
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Plenus</h1>
          </Link>
        </div>
        <UpdatePasswordForm />
      </div>
    </div>
  );
};

export { UpdatePasswordPage };
export default UpdatePasswordPage;
