
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import AppHeader from '@/components/AppHeader';
import { Sparkles } from 'lucide-react';

const AppLayout = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
        <p className="text-muted-foreground">Carregando sua jornada financeira...</p>
      </div>
    );
  }

  if (!user) {
    return null; // O useEffect já está cuidando do redirecionamento
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <AppHeader />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
