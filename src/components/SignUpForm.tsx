
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
import { Checkbox } from "@/components/ui/checkbox";
import { Link, useNavigate } from "react-router-dom";

const formSchema = z.object({
  fullName: z.string().min(3, { message: "O nome completo é obrigatório." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
  terms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e condições.",
  }),
});

export function SignUpForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      terms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Armazenar o e-mail para possível reenvio
      localStorage.setItem('pendingEmailConfirmation', values.email);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
          emailRedirectTo: `${window.location.origin}/email-confirmation`,
        },
      });

      if (error) {
        console.error('Erro no cadastro:', error);
        toast.error(`Erro no cadastro: ${error.message}`);
        return;
      }

      // Se o usuário foi criado mas precisa confirmar e-mail
      if (data.user && !data.session) {
        toast.success("Cadastro realizado! Verifique seu e-mail para confirmar a conta.");
        form.reset();
        // Redireciona para a página de confirmação
        navigate('/email-confirmation');
      } else if (data.session) {
        // Se o e-mail foi confirmado automaticamente
        toast.success("Cadastro realizado e conta confirmada!");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado ao criar conta. Tente novamente.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="seu@email.com" {...field} />
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
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Crie uma senha forte" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  <span className="text-sm font-normal text-muted-foreground">
                    Eu li e aceito os{' '}
                    <Link to="/terms" target="_blank" className="font-medium text-primary hover:underline">
                      Termos de Serviço
                    </Link>{' '}
                    e a{' '}
                    <Link to="/privacy" target="_blank" className="font-medium text-primary hover:underline">
                      Política de Privacidade
                    </Link>
                    .
                  </span>
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full btn-primary" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Criando conta..." : "Criar Conta Gratuita"}
        </Button>
      </form>
    </Form>
  );
}
