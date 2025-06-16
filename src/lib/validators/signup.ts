
import * as z from "zod";

export const signUpFormSchema = z.object({
  fullName: z.string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, { message: "O nome deve conter apenas letras e espaços" }),
  email: z.string()
    .email({ message: "Por favor, insira um email válido" })
    .toLowerCase(),
  password: z.string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" }),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e condições",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

// Função auxiliar para validar força da senha
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  }
  
  if (!/\d/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial (@$!%*?&)");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}
