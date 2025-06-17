
import { useLanguage } from '@/contexts/LanguageProvider';
import * as z from 'zod';

export const useValidation = () => {
  const { t } = useLanguage();

  const createValidationSchema = () => {
    return {
      email: z.string()
        .min(1, { message: t('validation.required') })
        .email({ message: t('validation.email.invalid') })
        .toLowerCase(),
      
      password: (minLength = 6) => z.string()
        .min(minLength, { message: t('validation.password.min', { min: minLength }) }),
      
      confirmPassword: (passwordField: string) => z.string()
        .min(1, { message: t('validation.required') }),
      
      required: z.string().min(1, { message: t('validation.required') }),
      
      number: (min?: number, max?: number) => {
        let schema = z.number();
        if (min !== undefined) {
          schema = schema.min(min, { message: t('validation.number.min', { min }) });
        }
        if (max !== undefined) {
          schema = schema.max(max, { message: t('validation.number.max', { max }) });
        }
        return schema;
      },
      
      passwordsMatch: (data: { password: string; confirmPassword: string }) => {
        if (data.password !== data.confirmPassword) {
          return {
            message: t('validation.password.mismatch'),
            path: ["confirmPassword"],
          };
        }
        return true;
      }
    };
  };

  return { createValidationSchema };
};
