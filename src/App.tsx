
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthProvider";
import { LanguageProvider } from "@/contexts/LanguageProvider";
import { ThemeProvider } from "./components/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "./pages/Index";
import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";
import { GoalsPage } from "./pages/GoalsPage";
import { BudgetsPage } from "./pages/BudgetsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { Auth } from "./pages/Auth";
import { ForgotPasswordPage } from "./pages/ForgotPasswordPage";
import { UpdatePasswordPage } from "./pages/UpdatePasswordPage";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import { TermsPage } from "./pages/TermsPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { NotFound } from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AuthProvider>
            <LanguageProvider>
              <ThemeProvider defaultTheme="system" storageKey="plenus-ui-theme">
                <Toaster />
                <BrowserRouter>
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/auth" element={<Auth />} />
                    <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                    <Route path="/update-password" element={<UpdatePasswordPage />} />
                    <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
                    <Route path="/terms" element={<TermsPage />} />
                    <Route path="/privacy" element={<PrivacyPage />} />
                    <Route path="/" element={<AppLayout />}>
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="goals" element={<GoalsPage />} />
                      <Route path="budgets" element={<BudgetsPage />} />
                      <Route path="analytics" element={<AnalyticsPage />} />
                      <Route path="settings" element={<SettingsPage />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </BrowserRouter>
              </ThemeProvider>
            </LanguageProvider>
          </AuthProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
