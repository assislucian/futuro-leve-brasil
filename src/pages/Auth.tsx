
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LoginForm } from "@/components/LoginForm";
import { SignUpForm } from "@/components/SignUpForm";
import { Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageProvider";

const AuthPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && user) {
      navigate('/dashboard');
    }
  }, [user, loading, navigate]);

  if (loading || (!loading && user)) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-background">
        <Sparkles className="h-10 w-10 animate-pulse text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Link to="/" className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Plenus</h1>
          </Link>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
            <TabsTrigger value="signup">{t('auth.signup')}</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.welcome_back')}</CardTitle>
                <CardDescription>
                  {t('auth.welcome_back.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LoginForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>{t('auth.create_account')}</CardTitle>
                <CardDescription>
                  {t('auth.create_account.subtitle')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SignUpForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export { AuthPage as Auth };
export default AuthPage;
