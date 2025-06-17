
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, Sparkles, Gift } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { PasswordStrengthIndicator } from "./PasswordStrengthIndicator";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignUpFormFieldsProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
}

export function SignUpFormFields({ form, isSubmitting }: SignUpFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <>
      {/* Trial Highlight */}
      <Alert className="border-teal-200 bg-gradient-to-r from-teal-50 to-emerald-50">
        <Gift className="h-4 w-4 text-teal-600" />
        <AlertDescription className="text-sm">
          <span className="font-semibold text-teal-700">🎉 Oferta Especial!</span><br />
          <span className="text-teal-600">Teste todas as funcionalidades Premium por 7 dias, totalmente grátis!</span>
        </AlertDescription>
      </Alert>

      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-medium text-foreground">Nome Completo</FormLabel>
            <FormControl>
              <Input 
                placeholder="Seu nome completo" 
                {...field}
                className="border-slate-200 focus:border-teal-500 focus:ring-teal-500"
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
            <FormLabel className="text-sm font-medium text-foreground">Email</FormLabel>
            <FormControl>
              <Input 
                placeholder="seu@email.com" 
                type="email"
                {...field}
                autoComplete="email"
                className="border-slate-200 focus:border-teal-500 focus:ring-teal-500"
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
            <FormLabel className="text-sm font-medium text-foreground">Senha</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Crie uma senha segura" 
                    {...field}
                    autoComplete="new-password"
                    className="border-slate-200 focus:border-teal-500 focus:ring-teal-500 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <PasswordStrengthIndicator password={field.value || ""} />
              </div>
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
            <FormLabel className="text-sm font-medium text-foreground">Confirmar Senha</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder="Confirme sua senha" 
                  {...field}
                  autoComplete="new-password"
                  className="border-slate-200 focus:border-teal-500 focus:ring-teal-500 pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-slate-400 hover:text-slate-600"
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

      <Button 
        type="submit" 
        className="w-full plenus-btn-primary text-white font-medium h-11" 
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
            Criando conta...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            Começar Trial Grátis de 7 Dias
          </>
        )}
      </Button>
    </>
  );
}
