
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

  console.log("🛡️ ProtectedRoute: Verificando acesso", {
    requireAuth,
    hasUser: !!user,
    hasSession: !!session,
    loading,
    pathname: location.pathname
  });

  // Mostra loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Verificando acesso...</p>
      </div>
    );
  }

  // Se requer autenticação mas usuário não está logado
  if (requireAuth && (!user || !session)) {
    console.log("🔒 ProtectedRoute: Redirecionando para /auth - usuário não autenticado");
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Se não requer autenticação mas usuário está logado (páginas públicas)
  if (!requireAuth && user && session) {
    console.log("🏠 ProtectedRoute: Redirecionando para /dashboard - usuário já autenticado");
    return <Navigate to="/dashboard" replace />;
  }

  console.log("✅ ProtectedRoute: Acesso autorizado");
  return <>{children}</>;
};
