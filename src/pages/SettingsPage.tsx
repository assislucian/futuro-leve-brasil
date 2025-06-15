
import { ProfileForm } from '@/components/ProfileForm';
import { DeleteAccountDialog } from '@/components/DeleteAccountDialog';

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
      
      <h2 className="text-xl font-semibold tracking-tight">Meu Perfil</h2>
      <ProfileForm />

      <div className="w-full border-b"></div>

      <div className="space-y-4 rounded-lg border border-destructive p-4">
        <h2 className="text-xl font-semibold tracking-tight text-destructive">Zona de Perigo</h2>
        <p className="text-sm text-muted-foreground">
          As ações abaixo são destrutivas e não podem ser revertidas. Por favor, tenha certeza antes de prosseguir.
        </p>
        <div className="flex justify-start">
            <DeleteAccountDialog />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
