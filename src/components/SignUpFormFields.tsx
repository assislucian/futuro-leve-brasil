
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { SignUpFormData } from "@/hooks/useSignUpForm";

interface SignUpFormFieldsProps {
  form: UseFormReturn<SignUpFormData>;
  isSubmitting: boolean;
}

export function SignUpFormFields({ form, isSubmitting }: SignUpFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const password = form.watch("password");

  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nome Completo</FormLabel>
            <FormControl>
              <Input 
                placeholder="Seu nome completo" 
                {...field}
                autoComplete="name"
              />
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
              <Input 
                placeholder="seu@email.com" 
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
            <FormLabel>Senha</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Crie uma senha forte" 
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
            
            <PasswordStrengthIndicator password={password} />
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirmar Senha</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Digite a senha novamente" 
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

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-sm">
          <strong>100% Seguro:</strong> Seus dados são criptografados e protegidos. 
          Nunca compartilhamos informações pessoais com terceiros.
        </AlertDescription>
      </Alert>

      <Button 
        type="submit" 
        className="w-full btn-primary" 
        disabled={isSubmitting || !form.formState.isValid}
      >
        {isSubmitting ? "Criando conta..." : "Criar Conta Gratuita"}
      </Button>
    </>
  );
}
