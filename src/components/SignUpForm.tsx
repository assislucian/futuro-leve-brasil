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
      console.log('Iniciando cadastro para:', values.email);
      
      // Armazenar o e-mail para possível reenvio
      localStorage.setItem('pendingEmailConfirmation', values.email);
      
      // Usar a URL correta baseada no ambiente
      const redirectUrl = `${window.location.origin}/email-confirmation`;
      console.log('URL de redirecionamento:', redirectUrl);
      
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName,
          },
          emailRedirectTo: redirectUrl,
        },
      });

      console.log('Resultado do cadastro:', { data, error });

      if (error) {
        console.error('Erro no cadastro:', error);
        
        // Tratar erros específicos com mensagens em português
        if (error.message.includes('User already registered')) {
          toast.error('Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.');
        } else if (error.message.includes('Invalid email')) {
          toast.error('E-mail inválido. Verifique e tente novamente.');
        } else if (error.message.includes('Password')) {
          toast.error('Senha muito fraca. Use pelo menos 6 caracteres.');
        } else {
          toast.error(`Erro no cadastro: ${error.message}`);
        }
        return;
      }

      // Se chegou até aqui, o cadastro foi bem-sucedido
      if (data.user) {
        console.log('Usuário criado:', data.user.email, 'Confirmado:', data.user.email_confirmed_at);
        
        if (data.user.email_confirmed_at) {
          // E-mail já confirmado (improvável com configuração atual)
          toast.success("Cadastro realizado e conta confirmada!");
          localStorage.removeItem('pendingEmailConfirmation');
          navigate('/dashboard');
        } else {
          // E-mail precisa ser confirmado (cenário normal)
          toast.success("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar a conta.");
          form.reset();
          navigate('/email-confirmation');
        }
      } else {
        toast.error("Erro inesperado ao criar conta. Tente novamente.");
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
