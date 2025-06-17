
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useGoals() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['goals', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      console.log("useGoals: Buscando todas as metas para usuário:", user.id);
      
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error("useGoals: Erro ao buscar metas:", error);
        throw error;
      }

      console.log("useGoals: Metas encontradas:", data);

      // Retornar TODAS as metas, não apenas as ativas
      // A lógica de filtro deve ser feita nos componentes quando necessário
      return data || [];
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 5, // 5 minutos
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 2,
  });
}
