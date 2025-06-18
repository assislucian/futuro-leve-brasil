import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const formSchema = z.object({
  password: z.string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres." })
    .max(128, { message: "A senha não pode exceder 128 caracteres." })
    .regex(/[a-z]/, { message: "A senha deve conter pelo menos uma letra minúscula." })
    .regex(/[A-Z]/, { message: "A senha deve conter pelo menos uma letra maiúscula." })
    .regex(/\d/, { message: "A senha deve conter pelo menos um número." })
    .regex(/[^a-zA-Z0-9]/, { message: "A senha deve conter pelo menos um caractere especial (ex: !@#$%^&*()_+-=)" }),
});

const UpdatePasswordPage = () => {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { password: "" },
  });

  useEffect(() => {
    if (!loading && !session) {
      toast.error("Link de redefinição inválido ou expirado. Por favor, tente novamente.");
      navigate("/forgot-password");
    }
  }, [session, loading, navigate]);


  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { error } = await supabase.auth.updateUser({
      password: values.password,
    });

    if (error) {
      toast.error(`Erro ao atualizar a senha: ${error.message}`);
    } else {
      toast.success("Sua senha foi atualizada com sucesso!");
      navigate("/dashboard");
    }
  }

  if (loading || !session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Verificando seu link...</p>
      </div>
    );
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
            <CardTitle>Crie sua nova senha</CardTitle>
            <CardDescription>
              Escolha uma senha forte e segura para proteger sua conta.
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
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Sua nova senha" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Salvando..." : "Salvar nova senha"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export { UpdatePasswordPage };
export default UpdatePasswordPage;
