
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FormItem, FormLabel, FormMessage } from "./ui/form";
import { Edit } from "lucide-react";
import { ControllerRenderProps } from "react-hook-form";
import { ProfileFormValues } from "@/lib/validators/profile";

const getInitials = (name: string | undefined | null) => {
  if (!name) return "";
  const names = name.split(" ");
  if (names.length > 1) {
    return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

interface AvatarUploadProps {
    field: ControllerRenderProps<ProfileFormValues, "avatar_file">;
    profile: any;
    previewUrl: string | null;
}

export function AvatarUpload({ field, profile, previewUrl }: AvatarUploadProps) {
    return (
        <FormItem>
            <FormLabel>Foto de Perfil</FormLabel>
            <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                    <AvatarImage src={previewUrl || profile?.avatar_url || ""} alt={profile?.full_name || ""} />
                    <AvatarFallback className="text-2xl">
                        {getInitials(profile?.full_name)}
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
    );
}
