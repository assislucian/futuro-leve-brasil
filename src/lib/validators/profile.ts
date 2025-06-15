
import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export const profileSchema = z.object({
  full_name: z.string().min(3, { message: "O nome completo deve ter pelo menos 3 caracteres." }),
  avatar_file: z.any()
    .refine((files) => !files || files.length === 0 || files?.[0]?.size <= MAX_FILE_SIZE, `O tamanho máximo da imagem é 5MB.`)
    .refine((files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type), "Apenas os formatos .jpg, .jpeg, .png e .webp são aceitos.")
    .optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
