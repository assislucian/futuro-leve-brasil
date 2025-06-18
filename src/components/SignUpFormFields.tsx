
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
import { Eye, EyeOff, AlertCircle, CheckCircle, Shield } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { SignUpFormData } from "@/lib/validators/signup";

interface SignUpFormFieldsProps {
  form: UseFormReturn<SignUpFormData>;
  isSubmitting: boolean;
}

/**
 * Componente que renderiza os campos do formulário de cadastro
 * Inclui validação em tempo real e indicadores visuais de qualidade
 */
export function SignUpFormFields({ form, isSubmitting }: SignUpFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const password = form.watch("password");
  const confirmPassword = form.watch("confirmPassword");
  const terms = form.watch("terms");
  
  // Verificar se senhas coincidem
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const showPasswordMismatch = confirmPassword && !passwordsMatch;

  return (
    <div className="space-y-6">
      {/* Campo Nome Completo */}
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Nome Completo *
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="Digite seu nome completo" 
                {...field}
                autoComplete="name"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-600" />
          </FormItem>
        )}
      />

      {/* Campo Email */}
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Email *
            </FormLabel>
            <FormControl>
              <Input 
                placeholder="seu@email.com" 
                type="email"
                {...field}
                autoComplete="email"
                className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                disabled={isSubmitting}
              />
            </FormControl>
            <FormMessage className="text-sm text-red-600" />
          </FormItem>
        )}
      />

      {/* Campo Senha */}
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Senha *
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Crie uma senha forte" 
                  {...field}
                  autoComplete="new-password"
                  className="h-11 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSubmitting}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
              </div>
            </FormControl>
            
            {/* Indicador de força da senha */}
            {password && <PasswordStrengthIndicator password={password} />}
            
            <FormMessage className="text-sm text-red-600" />
          </FormItem>
        )}
      />

      {/* Campo Confirmar Senha */}
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-gray-700">
              Confirmar Senha *
            </FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Digite a senha novamente" 
                  {...field}
                  autoComplete="new-password"
                  className={`h-11 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                    showPasswordMismatch ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
                  } ${passwordsMatch ? 'border-green-500 focus:border-green-500 focus:ring-green-500' : ''}`}
                  disabled={isSubmitting}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isSubmitting}
                  tabIndex={-1}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-gray-400" />
                  )}
                </Button>
                
                {/* Indicador visual de confirmação */}
                {confirmPassword && (
                  <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                    {passwordsMatch ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            
            {/* Mensagem de confirmação */}
            {showPasswordMismatch && (
              <p className="text-sm text-red-600 mt-1">
                As senhas não coincidem
              </p>
            )}
            
            <FormMessage className="text-sm text-red-600" />
          </FormItem>
        )}
      />

      {/* Campo Termos e Condições */}
      <FormField
        control={form.control}
        name="terms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={isSubmitting}
                className="mt-1"
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal text-gray-600 leading-relaxed">
                Eu li e aceito os{' '}
                <Link 
                  to="/terms" 
                  target="_blank" 
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Termos de Serviço
                </Link>{' '}
                e a{' '}
                <Link 
                  to="/privacy" 
                  target="_blank" 
                  className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Política de Privacidade
                </Link>
                . *
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      {/* Alerta de Segurança */}
      <Alert className="border-blue-200 bg-blue-50">
        <Shield className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-sm text-blue-800">
          <strong>100% Seguro:</strong> Seus dados são criptografados com protocolo TLS 1.3 
          e protegidos por autenticação multifator. Nunca compartilhamos informações pessoais 
          com terceiros.
        </AlertDescription>
      </Alert>

      {/* Botão de Submissão */}
      <Button 
        type="submit" 
        className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200" 
        disabled={isSubmitting || !form.formState.isValid || !terms}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Criando conta...
          </div>
        ) : (
          "Criar Conta Gratuita"
        )}
      </Button>
      
      {/* Texto informativo */}
      <p className="text-xs text-gray-500 text-center leading-relaxed">
        Ao criar sua conta, você terá acesso a 7 dias gratuitos de todas as funcionalidades Premium.
      </p>
    </div>
  );
}
