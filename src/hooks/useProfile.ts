
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { ProfileFormValues } from "@/lib/validators/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useProfile = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!user,
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
        if (!user) throw new Error("Usuário não autenticado.");
      
        const { data: currentProfile, error: fetchError } = await supabase
          .from('profiles')
          .select('avatar_url, avatar_path')
          .eq('id', user.id)
          .single();
  
        if (fetchError || !currentProfile) throw new Error("Perfil não encontrado para atualização.");

      let avatarUrl = currentProfile.avatar_url;
      let avatarPath = currentProfile.avatar_path;

      if (values.avatar_file && values.avatar_file.length > 0) {
        const file = values.avatar_file[0];
        const newAvatarPath = `${user.id}/${Date.now()}_${file.name}`;
        
        const { error: uploadError } = await supabase.storage
          .from('avatars')
          .upload(newAvatarPath, file);

        if (uploadError) throw new Error(`Erro no upload: ${uploadError.message}`);
        
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(newAvatarPath);
          
        const oldAvatarPath = avatarPath;
        avatarUrl = publicUrl;
        avatarPath = newAvatarPath;

        if (oldAvatarPath) {
          const { error: deleteError } = await supabase.storage
            .from('avatars')
            .remove([oldAvatarPath]);
          if (deleteError) {
            console.error("Erro ao deletar avatar antigo:", deleteError.message);
          }
        }
      }
      
      const { error: userUpdateError } = await supabase.auth.updateUser({
        data: {
          full_name: values.full_name,
          avatar_url: avatarUrl,
          avatar_path: avatarPath,
        },
      });

      if (userUpdateError) throw new Error(`Erro ao atualizar usuário: ${userUpdateError.message}`);
      
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({
          full_name: values.full_name,
          avatar_url: avatarUrl,
          avatar_path: avatarPath,
        })
        .eq('id', user.id);

      if (profileUpdateError) throw new Error(`Erro ao atualizar perfil: ${profileUpdateError.message}`);
    },
    onSuccess: async () => {
        await queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
        await supabase.auth.refreshSession();
    },
  });

  return { profile, isLoadingProfile, updateProfileMutation };
}
