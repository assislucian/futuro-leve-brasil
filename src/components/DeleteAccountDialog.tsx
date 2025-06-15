
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

export function DeleteAccountDialog() {
  const { session } = useAuth();
  const navigate = useNavigate();

  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("Usuário não autenticado.");

      const { data, error } = await supabase.functions.invoke('delete-user', {
        headers: {
            'Authorization': `Bearer ${session.access_token}`
        }
      });
      
      if (error || data.error) {
        throw new Error(error?.message || data.error);
      }

      return data;
    },
    onSuccess: async () => {
      toast.success("Sua conta foi excluída com sucesso.");
      await supabase.auth.signOut();
      navigate("/");
    },
    onError: (error) => {
      toast.error(`Erro ao excluir a conta: ${error.message}`);
    },
  });

  const handleDelete = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Excluir Minha Conta</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Você tem certeza absoluta?</AlertDialogTitle>
          <AlertDialogDescription>
            Essa ação não pode ser desfeita. Isso excluirá permanentemente sua conta e todos os seus dados de nossos servidores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteAccountMutation.isPending}
            className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            {deleteAccountMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Sim, excluir minha conta
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
