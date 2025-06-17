
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { PasswordStrengthIndicator } from "@/components/PasswordStrengthIndicator";
import { validatePasswordStrength } from "@/lib/validators/signup";
import { cn } from "@/lib/utils";

type SignUpState = 'idle' | 'checking' | 'creating' | 'success' | 'error';

export function SignUpForm() {
  const { form, onSubmit, isSubmitting } = useSignUpForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signUpState, setSignUpState] = useState<SignUpState>('idle');
  const [intelligentFeedback, setIntelligentFeedback] = useState<string>("");
  const [suggestionMessage, setSuggestionMessage] = useState<string>("");

  const watchedPassword = form.watch("password");
  const passwordValidation = validatePasswordStrength(watchedPassword || "");

  // Monitorar mudanças nos campos para dar feedback inteligente
  const watchedEmail = form.watch("email");
  const watchedFullName = form.watch("fullName");
  const watchedConfirmPassword = form.watch("confirmPassword");

  React.useEffect(() => {
    // Feedback inteligente baseado no progresso do usuário
    if (watchedEmail && watchedFullName && watchedPassword && watchedConfirmPassword) {
      if (watchedPassword === watchedConfirmPassword && passwordValidation.isValid) {
        setIntelligentFeedback("Perfeito! Todos os campos estão preenchidos corretamente.");
        setSuggestionMessage("Você está pronto para criar sua conta no Plenus.");
        setSignUpState('idle');
      } else {
        setIntelligentFeedback("");
        setSuggestionMessage("");
      }
    }
  }, [watchedEmail, watchedFullName, watchedPassword, watchedConfirmPassword, passwordValidation.isValid]);

  const handleSubmitWithFeedback = async (values: any) => {
    setSignUpState('checking');
    setIntelligentFeedback("Verificando disponibilidade do email...");
    setSuggestionMessage("Isso pode levar alguns segundos.");

    try {
      setTimeout(() => {
        if (signUpState === 'checking') {
          setSignUpState('creating');
          setIntelligentFeedback("Criando sua conta no Plenus...");
          setSuggestionMessage("Preparando seu ambiente financeiro personalizado.");
        }
      }, 1000);

      await onSubmit(values);
      
      setSignUpState('success');
      setIntelligentFeedback("Conta criada com sucesso! 🎉");
      setSuggestionMessage("Verifique seu email para ativar sua conta.");
    } catch (error) {
      setSignUpState('error');
      setIntelligentFeedback("Algo deu errado durante o cadastro.");
      setSuggestionMessage("Tente novamente ou verifique se o email já está em uso.");
    }
  };

  const getButtonText = () => {
    switch (signUpState) {
      case 'checking': return "Verificando...";
      case 'creating': return "Criando conta...";
      case 'success': return "Conta criada! ✓";
      default: return "Criar minha conta gratuita";
    }
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmitWithFeedback)} className="space-y-6">
      {/* Campo Nome Completo */}
      <div className="space-y-2">
        <Label htmlFor="fullName">Nome completo</Label>
        <Input
          id="fullName"
          placeholder="Seu nome completo"
          {...form.register("fullName")}
          disabled={isSubmitting}
          className={cn(
            form.formState.errors.fullName && "border-red-500 focus:border-red-500"
          )}
        />
        {form.formState.errors.fullName && (
          <p className="text-sm text-red-600">
            {form.formState.errors.fullName.message}
          </p>
        )}
      </div>

      {/* Campo Email */}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...form.register("email")}
          disabled={isSubmitting}
          className={cn(
            form.formState.errors.email && "border-red-500 focus:border-red-500"
          )}
        />
        {form.formState.errors.email && (
          <p className="text-sm text-red-600">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      {/* Campo Senha com Indicador */}
      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Crie uma senha forte"
            {...form.register("password")}
            disabled={isSubmitting}
            className={cn(
              form.formState.errors.password && "border-red-500 focus:border-red-500"
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isSubmitting}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        {watchedPassword && (
          <PasswordStrengthIndicator 
            password={watchedPassword} 
            validation={passwordValidation}
          />
        )}
        
        {form.formState.errors.password && (
          <p className="text-sm text-red-600">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {/* Campo Confirmar Senha */}
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar senha</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Digite a senha novamente"
            {...form.register("confirmPassword")}
            disabled={isSubmitting}
            className={cn(
              form.formState.errors.confirmPassword && "border-red-500 focus:border-red-500",
              watchedPassword && watchedConfirmPassword && watchedPassword === watchedConfirmPassword && "border-green-500"
            )}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isSubmitting}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </div>
        
        {/* Feedback visual para confirmação de senha */}
        {watchedPassword && watchedConfirmPassword && (
          <div className={cn(
            "text-sm flex items-center gap-2",
            watchedPassword === watchedConfirmPassword ? "text-green-600" : "text-red-600"
          )}>
            {watchedPassword === watchedConfirmPassword ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Senhas coincidem</span>
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4" />
                <span>Senhas não coincidem</span>
              </>
            )}
          </div>
        )}
        
        {form.formState.errors.confirmPassword && (
          <p className="text-sm text-red-600">
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Termos e Condições */}
      <div className="flex items-start space-x-3">
        <Checkbox
          id="terms"
          {...form.register("terms")}
          disabled={isSubmitting}
          className={cn(
            form.formState.errors.terms && "border-red-500"
          )}
        />
        <div className="grid gap-1.5 leading-none">
          <Label
            htmlFor="terms"
            className="text-sm font-normal leading-5 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Aceito os{" "}
            <Link
              to="/terms"
              className="text-primary underline hover:text-primary/80"
              target="_blank"
            >
              termos de uso
            </Link>{" "}
            e{" "}
            <Link
              to="/privacy"
              className="text-primary underline hover:text-primary/80"
              target="_blank"
            >
              política de privacidade
            </Link>
          </Label>
          {form.formState.errors.terms && (
            <p className="text-sm text-red-600">
              {form.formState.errors.terms.message}
            </p>
          )}
        </div>
      </div>

      {/* Feedback Inteligente */}
      {intelligentFeedback && (
        <Alert className={cn(
          "border-l-4",
          signUpState === 'success' ? "border-green-500 bg-green-50" :
          signUpState === 'error' ? "border-red-500 bg-red-50" :
          "border-blue-500 bg-blue-50"
        )}>
          <div className="flex items-center gap-2">
            {signUpState === 'checking' || signUpState === 'creating' ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : signUpState === 'success' ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : signUpState === 'error' ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <CheckCircle className="h-4 w-4 text-blue-600" />
            )}
            <AlertDescription className="space-y-1">
              <p className="font-medium">{intelligentFeedback}</p>
              {suggestionMessage && (
                <p className="text-sm text-muted-foreground">{suggestionMessage}</p>
              )}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <Button 
        type="submit" 
        className="w-full btn-primary" 
        disabled={isSubmitting || signUpState === 'success'}
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            {getButtonText()}
          </div>
        ) : (
          getButtonText()
        )}
      </Button>

      {/* Informação adicional */}
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Já tem uma conta?{" "}
          <Link to="/auth" className="text-primary underline hover:text-primary/80">
            Fazer login
          </Link>
        </p>
      </div>
    </form>
  );
}
