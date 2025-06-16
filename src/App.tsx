import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster"

import { AuthProvider } from "@/contexts/AuthProvider";
import { Index } from "@/pages/Index";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { AppLayout } from "@/layouts/AppLayout";
import { BudgetsPage } from "@/pages/BudgetsPage";
import { GoalsPage } from "@/pages/GoalsPage";
import { SettingsPage } from "@/pages/SettingsPage";
import { NotFound } from "@/pages/NotFound";
import { ForgotPasswordPage } from "@/pages/ForgotPasswordPage";
import { UpdatePasswordPage } from "@/pages/UpdatePasswordPage";
import { TermsPage } from "@/pages/TermsPage";
import { PrivacyPage } from "@/pages/PrivacyPage";
import AnalyticsPage from "@/pages/AnalyticsPage";

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/update-password" element={<UpdatePasswordPage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/budgets" element={<BudgetsPage />} />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;
