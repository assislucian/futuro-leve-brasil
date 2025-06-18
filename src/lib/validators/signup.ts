
import * as z from "zod";

// Schema de validação do formulário de cadastro
export const signUpFormSchema = z.object({
  fullName: z.string()
    .min(2, { message: "O nome deve ter pelo menos 2 caracteres" })
    .max(100, { message: "O nome não pode exceder 100 caracteres" })
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, { 
      message: "O nome deve conter apenas letras, espaços, hífens e apostrofes" 
    })
    .transform(val => val.trim()),
  
  email: z.string()
    .email({ message: "Por favor, insira um email válido" })
    .max(255, { message: "Email muito longo" })
    .toLowerCase()
    .transform(val => val.trim()),
  
  password: z.string()
    .min(8, { message: "A senha deve ter pelo menos 8 caracteres" })
    .max(128, { message: "A senha não pode exceder 128 caracteres" }),
  
  confirmPassword: z.string()
    .min(1, { message: "Confirmação de senha é obrigatória" }),
  
  terms: z.boolean().refine(val => val === true, {
    message: "Você deve aceitar os termos e condições",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

// Tipo inferido do schema
export type SignUpFormData = z.infer<typeof signUpFormSchema>;

// Interface para resultado da validação de senha
export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
  score: number;
}

/**
 * Valida a força da senha com critérios rigorosos
 * @param password - Senha a ser validada
 * @returns Resultado da validação com força e erros
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;
  
  // Critérios obrigatórios
  if (password.length < 8) {
    errors.push("A senha deve ter pelo menos 8 caracteres");
  } else {
    score += 1;
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra minúscula");
  } else {
    score += 1;
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push("A senha deve conter pelo menos uma letra maiúscula");
  } else {
    score += 1;
  }
  
  if (!/\d/.test(password)) {
    errors.push("A senha deve conter pelo menos um número");
  } else {
    score += 1;
  }
  
  if (!/[@$!%*?&]/.test(password)) {
    errors.push("A senha deve conter pelo menos um caractere especial (@$!%*?&)");
  } else {
    score += 1;
  }
  
  // Critérios de força adicional
  if (password.length >= 12) score += 1;
  if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;
  
  // Determinar força
  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  if (score >= 5) strength = 'medium';
  if (score >= 6) strength = 'strong';
  
  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score
  };
}

/**
 * Verifica se o email tem formato válido mais rigoroso
 * @param email - Email a ser validado
 * @returns true se válido
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 255;
}
