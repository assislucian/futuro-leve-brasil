import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { profileSchema, ProfileFormValues } from "@/lib/validators/profile";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Edit } from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "./ui/skeleton";

const getInitials = (name: string | undefined | null) => {
  if (!name) return "";
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export function ProfileForm() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: "",
      avatar_file: undefined,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        full_name: profile.full_name || "",
      });
    }
  }, [profile, form]);

  const mutation = useMutation({
    mutationFn: async (values: ProfileFormValues) => {
      if (!user || !profile) throw new Error("Usuário não encontrado.");
      
      const currentProfile = profile as any;
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
      toast.success("Perfil atualizado com sucesso!");
      await queryClient.invalidateQueries({ queryKey: ['profile', user?.id] });
      await supabase.auth.refreshSession();
      form.reset({ ...form.getValues(), avatar_file: undefined });
      setPreviewUrl(null);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = (values: ProfileFormValues) => {
    mutation.mutate(values);
  };

  const avatarFile = form.watch("avatar_file");
  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
        const newPreviewUrl = URL.createObjectURL(avatarFile[0]);
        setPreviewUrl(newPreviewUrl);
        return () => URL.revokeObjectURL(newPreviewUrl);
    }
  }, [avatarFile]);

  if (isLoadingProfile) {
    return (
      <div className="space-y-8 max-w-2xl">
        <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="avatar_file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto de Perfil</FormLabel>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={previewUrl || (profile as any)?.avatar_url || ""} alt={(profile as any)?.full_name || ""} />
                  <AvatarFallback className="text-2xl">
                    {getInitials((profile as any)?.full_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="relative">
                    <Button type="button" variant="outline">
                        <Edit className="mr-2 h-4 w-4" />
                        Alterar Foto
                    </Button>
                    <Input
                        type="file"
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={(e) => field.onChange(e.target.files)}
                    />
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome Completo</FormLabel>
              <FormControl>
                <Input placeholder="Seu nome completo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" disabled={mutation.isPending || !form.formState.isDirty}>
          {mutation.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </Form>
  );
}
