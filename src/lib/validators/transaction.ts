
import * as z from "zod";

export const transactionFormSchema = z.object({
  description: z.string().min(2, { message: "A descrição precisa ter pelo menos 2 caracteres." }),
  amount: z.coerce.number().positive({ message: "O valor deve ser um número positivo." }),
  type: z.enum(["income", "expense"], { required_error: "O tipo é obrigatório." }),
  category: z.string().min(2, { message: "A categoria precisa ter pelo menos 2 caracteres." }),
  transaction_date: z.string().min(1, { message: "A data é obrigatória." }),
});

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;
