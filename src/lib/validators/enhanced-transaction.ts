
import { z } from "zod";

/**
 * Validador aprimorado para transações com feedback em tempo real
 * Garante qualidade dos dados e melhor UX
 */
export const enhancedTransactionSchema = z.object({
  description: z
    .string()
    .min(3, "Descrição deve ter pelo menos 3 caracteres")
    .max(100, "Descrição não pode exceder 100 caracteres")
    .refine(
      (value) => value.trim().length >= 3,
      "Descrição não pode ser apenas espaços em branco"
    ),
  
  amount: z
    .number({
      required_error: "Valor é obrigatório",
      invalid_type_error: "Valor deve ser um número válido"
    })
    .positive("Valor deve ser maior que zero")
    .max(999999999, "Valor muito alto - máximo R$ 999.999.999")
    .refine(
      (value) => Number(value.toFixed(2)) === value || value.toString().split('.')[1]?.length <= 2,
      "Valor não pode ter mais de 2 casas decimais"
    ),
  
  type: z.enum(["income", "expense"], {
    required_error: "Tipo é obrigatório",
    invalid_type_error: "Tipo deve ser 'receita' ou 'despesa'"
  }),
  
  category: z
    .string()
    .min(1, "Categoria é obrigatória")
    .max(50, "Categoria não pode exceder 50 caracteres"),
  
  transaction_date: z
    .string()
    .min(1, "Data é obrigatória")
    .refine(
      (date) => {
        const parsedDate = new Date(date);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        return parsedDate <= today && parsedDate >= oneYearAgo;
      },
      "Data deve estar entre hoje e 1 ano atrás"
    ),

  notes: z
    .string()
    .max(500, "Observações não podem exceder 500 caracteres")
    .optional()
});

export type EnhancedTransactionData = z.infer<typeof enhancedTransactionSchema>;

/**
 * Validador para valores monetários em tempo real
 */
export const validateCurrencyInput = (value: string): { isValid: boolean; error?: string } => {
  const numericValue = value.replace(/[^\d.,]/g, '').replace(',', '.');
  const number = parseFloat(numericValue);
  
  if (isNaN(number)) {
    return { isValid: false, error: "Digite um valor válido" };
  }
  
  if (number <= 0) {
    return { isValid: false, error: "Valor deve ser maior que zero" };
  }
  
  if (number > 999999999) {
    return { isValid: false, error: "Valor muito alto" };
  }
  
  const decimalPlaces = numericValue.split('.')[1]?.length || 0;
  if (decimalPlaces > 2) {
    return { isValid: false, error: "Máximo 2 casas decimais" };
  }
  
  return { isValid: true };
};
