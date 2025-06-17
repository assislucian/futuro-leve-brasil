
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Shield } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageProvider";

interface SignUpFormFieldsProps {
  form: UseFormReturn<any>;
  isSubmitting: boolean;
}

export function SignUpFormFields({ form, isSubmitting }: SignUpFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('auth.signup.full_name')}</FormLabel>
            <FormControl>
              <Input 
                placeholder={t('auth.signup.full_name_placeholder')}
                {...field}
                autoComplete="name"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('auth.email')}</FormLabel>
            <FormControl>
              <Input 
                placeholder={t('auth.email_placeholder')}
                type="email"
                {...field}
                autoComplete="email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('auth.password')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"} 
                  placeholder={t('auth.signup.password_placeholder')}
                  {...field}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('auth.signup.confirm_password')}</FormLabel>
            <FormControl>
              <div className="relative">
                <Input 
                  type={showConfirmPassword ? "text" : "password"} 
                  placeholder={t('auth.signup.confirm_password_placeholder')}
                  {...field}
                  autoComplete="new-password"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="acceptTerms"
        render={({ field }) => (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel className="text-sm font-normal">
                {t('auth.signup.terms_text')}{' '}
                <Link to="/terms" className="text-primary hover:underline">
                  {t('auth.signup.terms')}
                </Link>{' '}
                {t('auth.signup.and')}{' '}
                <Link to="/privacy" className="text-primary hover:underline">
                  {t('auth.signup.privacy')}
                </Link>.
              </FormLabel>
              <FormMessage />
            </div>
          </FormItem>
        )}
      />

      <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">
              {t('auth.signup.security_title')}
            </p>
            <p className="text-blue-700 leading-relaxed">
              {t('auth.signup.security_text')}
            </p>
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="w-full btn-primary" 
        disabled={isSubmitting}
      >
        {isSubmitting ? t('auth.signup.creating') : t('auth.signup.create_account')}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t('auth.signup.free_trial_text')}
        </p>
      </div>
    </>
  );
}
