
import React from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Mail, UserPlus, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface AuthErrorDisplayProps {
  message: string;
  suggestion: string;
  severity: 'info' | 'warning' | 'error';
  action?: string;
  onRetry?: () => void;
  onClear?: () => void;
  className?: string;
}

/**
 * Componente especializado para exibir erros de autenticação
 * com sugestões inteligentes e ações contextuais
 */
export function AuthErrorDisplay({
  message,
  suggestion,
  severity,
  action,
  onRetry,
  onClear,
  className
}: AuthErrorDisplayProps) {
  const getIcon = () => {
    switch (severity) {
      case 'info': return <Mail className="h-4 w-4" />;
      case 'warning': return <AlertCircle className="h-4 w-4" />;
      case 'error': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getAlertClassName = () => {
    switch (severity) {
      case 'info': return "border-blue-200 bg-blue-50 text-blue-800";
      case 'warning': return "border-amber-200 bg-amber-50 text-amber-800";
      case 'error': return "border-red-200 bg-red-50 text-red-800";
      default: return "border-gray-200 bg-gray-50";
    }
  };

  const getActionButton = () => {
    switch (action) {
      case 'retry_or_reset':
        return (
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <Button onClick={onRetry} size="sm" variant="outline">
                <RefreshCw className="h-3 w-3 mr-1" />
                Tentar Novamente
              </Button>
            )}
            <Button asChild size="sm" variant="outline">
              <Link to="/forgot-password">
                Redefinir Senha
              </Link>
            </Button>
          </div>
        );
      
      case 'confirm_email':
        return (
          <div className="flex gap-2 mt-3">
            <Button asChild size="sm" variant="outline">
              <Link to="/email-confirmation">
                <Mail className="h-3 w-3 mr-1" />
                Reenviar Email
              </Link>
            </Button>
          </div>
        );
      
      case 'signup':
        return (
          <div className="flex gap-2 mt-3">
            <Button asChild size="sm" variant="outline">
              <Link to="/auth">
                <UserPlus className="h-3 w-3 mr-1" />
                Criar Conta
              </Link>
            </Button>
          </div>
        );
      
      case 'login':
        return (
          <div className="flex gap-2 mt-3">
            <Button asChild size="sm" variant="outline">
              <Link to="/auth">
                Fazer Login
              </Link>
            </Button>
          </div>
        );
      
      case 'retry':
        return onRetry ? (
          <div className="flex gap-2 mt-3">
            <Button onClick={onRetry} size="sm" variant="outline">
              <RefreshCw className="h-3 w-3 mr-1" />
              Tentar Novamente
            </Button>
          </div>
        ) : null;
      
      case 'contact_support':
        return (
          <div className="flex gap-2 mt-3">
            {onRetry && (
              <Button onClick={onRetry} size="sm" variant="outline">
                <RefreshCw className="h-3 w-3 mr-1" />
                Tentar Novamente
              </Button>
            )}
            <Button asChild size="sm" variant="outline">
              <Link to="mailto:suporte@plenus.app">
                <HelpCircle className="h-3 w-3 mr-1" />
                Contato
              </Link>
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Alert className={cn(getAlertClassName(), className)}>
      {getIcon()}
      <AlertDescription className="space-y-2">
        <p className="font-medium">{message}</p>
        <p className="text-sm opacity-90">{suggestion}</p>
        {getActionButton()}
        {onClear && (
          <button
            onClick={onClear}
            className="text-xs underline opacity-75 hover:opacity-100 mt-2"
          >
            Dispensar
          </button>
        )}
      </AlertDescription>
    </Alert>
  );
}
