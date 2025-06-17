
import { ProfileForm } from '@/components/ProfileForm';
import { DeleteAccountDialog } from '@/components/DeleteAccountDialog';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Label } from '@/components/ui/label';

const SettingsPage = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Einstellungen</h1>
        <p className="text-muted-foreground">
          Verwalten Sie Ihre Kontoeinstellungen und Ihr Profil.
        </p>
      </div>
      <div className="w-full border-b"></div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Mein Profil</h2>
        <ProfileForm />
      </div>

      <div className="w-full border-b"></div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold tracking-tight">Erscheinungsbild</h2>
        <div className="flex items-center space-x-4 rounded-md border p-4">
          <Label htmlFor="theme">App-Design</Label>
          <div className="flex-grow" />
          <ThemeToggle />
        </div>
      </div>
      
      <div className="w-full border-b"></div>

      <div className="space-y-4 rounded-lg border border-destructive p-4">
        <h2 className="text-xl font-semibold tracking-tight text-destructive">Gefahrenbereich</h2>
        <p className="text-sm text-muted-foreground">
          Die unten stehenden Aktionen sind destruktiv und können nicht rückgängig gemacht werden. Bitte seien Sie vorsichtig, bevor Sie fortfahren.
        </p>
        <div className="flex justify-start">
            <DeleteAccountDialog />
        </div>
      </div>
    </div>
  );
};

export { SettingsPage };
export default SettingsPage;
