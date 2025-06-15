
import { ProfileForm } from '@/components/ProfileForm';

const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="text-muted-foreground">
          Gerencie as configurações da sua conta e seu perfil.
        </p>
      </div>
      <div className="w-full border-b"></div>
      <ProfileForm />
    </div>
  );
};

export default SettingsPage;
