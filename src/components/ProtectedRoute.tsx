
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import { Sparkles } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export const ProtectedRoute = ({ children, requireAuth = true }: ProtectedRouteProps) => {
  const { user, session, loading } = useAuth();
  const location = useLocation();

  // ✅ TAREFA 3: Log de auditoria para debugging
  console.debug("🚀 ProtectedRoute:", {
    pathname: location.pathname,
    requireAuth,
    hasUser: !!user,
    hasSession: !!session,
    sessionValid: session ? new Date(session.expires_at! * 1000) > new Date() : false,
    loading
  });

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    console.debug("🚀 ProtectedRoute: Mostrando loading");
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Verificando acesso...</p>
      </div>
    );
  }

  // ✅ TAREFA 4: Verificação mais robusta de sessão válida
  const hasValidSession = session && user && new Date(session.expires_at! * 1000) > new Date();

  // Se requer autenticação mas usuário não está logado
  if (requireAuth && !hasValidSession) {
    console.debug("🚀 ProtectedRoute: Redirecionando para /auth - sem sessão válida");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Se não requer autenticação mas usuário está logado (páginas públicas)
  if (!requireAuth && hasValidSession) {
    console.debug("🚀 ProtectedRoute: Redirecionando para /dashboard - usuário já logado");
    return <Navigate to="/dashboard" replace />;
  }

  console.debug("🚀 ProtectedRoute: Renderizando children");
  return <>{children}</>;
};
