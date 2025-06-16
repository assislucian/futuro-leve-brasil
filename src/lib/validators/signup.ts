
import * as z from "zod";

const passwordSchema = z.string()
  .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
  .refine((password) => {
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    
    return hasLowercase && hasUppercase && hasNumber && hasSpecialChar;
  }, {
    message: "A senha deve conter pelo menos: uma letra minúscula, uma maiúscula, um número e um caractere especial (@$!%*?&)"
  });

export const signUpFormSchema = z.object({
  fullName: z.string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "O nome deve conter apenas letras e espaços" }),
  email: z.string()
    .email({ message: "Por favor, insira um email válido" })
    .toLowerCase(),
  password: passwordSchema,
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e condições",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;
