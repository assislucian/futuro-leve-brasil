
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";

import { AuthProvider } from "@/contexts/AuthProvider";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import AppLayout from "@/pages/AppLayout";
import BudgetsPage from "@/pages/BudgetsPage";
import GoalsPage from "@/pages/GoalsPage";
import SettingsPage from "@/pages/SettingsPage";
import NotFound from "@/pages/NotFound";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import UpdatePasswordPage from "@/pages/UpdatePasswordPage";
import TermsPage from "@/pages/TermsPage";
import PrivacyPage from "@/pages/PrivacyPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import EmailConfirmationPage from "@/pages/EmailConfirmationPage";

// Configuração otimizada do QueryClient para produção
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        // Não fazer retry para erros de autenticação
        if (error && typeof error === 'object' && 'status' in error) {
          return ![401, 403, 404].includes(error.status as number) && failureCount < 2;
        }
        return failureCount < 2;
      },
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  console.log("App: Inicializando aplicação Plenus v2.0");
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <ThemeProvider defaultTheme="light" storageKey="plenus-ui-theme">
            <AuthProvider>
              <Routes>
                {/* Rotas Públicas - Redireciona se logado */}
                <Route path="/" element={
                  <ProtectedRoute requireAuth={false}>
                    <Index />
                  </ProtectedRoute>
                } />
                <Route path="/auth" element={
                  <ProtectedRoute requireAuth={false}>
                    <Auth />
                  </ProtectedRoute>
                } />
                <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
                <Route path="/forgot-password" element={
                  <ProtectedRoute requireAuth={false}>
                    <ForgotPasswordPage />
                  </ProtectedRoute>
                } />
                <Route path="/update-password" element={<UpdatePasswordPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                
                {/* Rotas Protegidas - Requer autenticação */}
                <Route element={
                  <ProtectedRoute requireAuth={true}>
                    <AppLayout />
                  </ProtectedRoute>
                }>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/budgets" element={<BudgetsPage />} />
                  <Route path="/goals" element={<GoalsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                </Route>
                
                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </AuthProvider>
          </ThemeProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
