
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

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(1, { message: "A senha é obrigatória." }),
});

export function LoginForm() {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log('Tentando fazer login para:', values.email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      console.log('Resultado do login:', { data, error });

      if (error) {
        console.error('Erro no login:', error);
        
        // Tratar erros específicos com mensagens em português
        if (error.message.includes('Invalid login credentials')) {
          toast.error('E-mail ou senha incorretos. Verifique e tente novamente.');
        } else if (error.message.includes('Email not confirmed')) {
          toast.error('E-mail não confirmado. Verifique sua caixa de entrada.');
          // Armazenar e-mail para reenvio
          localStorage.setItem('pendingEmailConfirmation', values.email);
          navigate('/email-confirmation');
          return;
        } else if (error.message.includes('Too many requests')) {
          toast.error('Muitas tentativas. Aguarde alguns minutos e tente novamente.');
        } else {
          toast.error(`Erro no login: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        console.log('Login realizado com sucesso:', data.user.email);
        toast.success("Login realizado com sucesso!");
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Erro inesperado no login:', error);
      toast.error("Erro inesperado. Tente novamente.");
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
                <Input type="password" placeholder="Sua senha" {...field} />
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
            Esqueceu a senha?
          </Link>
        </div>
        <Button type="submit" className="w-full btn-primary" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>
    </Form>
  );
}
