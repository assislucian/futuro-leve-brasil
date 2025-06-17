
// Tipos para autenticação e cadastro

// Interface para estado do hook de cadastro
export interface UseSignUpFormState {
  isSubmitting: boolean;
  lastAttemptEmail: string | null;
}

// Interface para resultado do cadastro
export interface SignUpResult {
  success: boolean;
  requiresEmailConfirmation: boolean;
  error?: string;
}
