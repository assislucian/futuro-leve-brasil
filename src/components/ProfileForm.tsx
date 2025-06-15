
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
import { profileSchema, ProfileFormValues } from "@/lib/validators/profile";
import { useEffect, useState } from "react";
import { useProfile } from "@/hooks/useProfile";
import { ProfileFormSkeleton } from "./ProfileFormSkeleton";
import { AvatarUpload } from "./AvatarUpload";

export function ProfileForm() {
  const { profile, isLoadingProfile, updateProfileMutation } = useProfile();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

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

  const avatarFile = form.watch("avatar_file");
  useEffect(() => {
    if (avatarFile && avatarFile.length > 0) {
      const newPreviewUrl = URL.createObjectURL(avatarFile[0]);
      setPreviewUrl(newPreviewUrl);
      return () => URL.revokeObjectURL(newPreviewUrl);
    }
  }, [avatarFile]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfileMutation.mutate(values, {
      onSuccess: () => {
        toast.success("Perfil atualizado com sucesso!");
        form.reset({ ...form.getValues(), avatar_file: undefined });
        setPreviewUrl(null);
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });
  };

  if (isLoadingProfile) {
    return <ProfileFormSkeleton />;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-2xl">
        <FormField
          control={form.control}
          name="avatar_file"
          render={({ field }) => (
            <AvatarUpload field={field} profile={profile} previewUrl={previewUrl} />
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
        
        <Button type="submit" disabled={updateProfileMutation.isPending || !form.formState.isDirty}>
          {updateProfileMutation.isPending ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </form>
    </Form>
  );
}
