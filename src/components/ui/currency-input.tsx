
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateCurrencyInput } from "@/lib/validators/enhanced-transaction";
import { cn } from "@/lib/utils";

interface CurrencyInputProps {
  label?: string;
  value: number | string;
  onChange: (value: number) => void;
  placeholder?: string;
  error?: string;
  className?: string;
  required?: boolean;
}

/**
 * Input de moeda com validação em tempo real e formatação automática
 * Melhora significativamente a UX para entrada de valores monetários
 */
export function CurrencyInput({
  label,
  value,
  onChange,
  placeholder = "R$ 0,00",
  error,
  className,
  required = false
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");
  const [validationError, setValidationError] = useState<string | undefined>();

  useEffect(() => {
    if (value && typeof value === "number") {
      setDisplayValue(value.toLocaleString("pt-BR", { 
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 
      }));
    } else if (!value) {
      setDisplayValue("");
    }
  }, [value]);

  const formatCurrency = (inputValue: string) => {
    // Remove tudo exceto números
    const numbers = inputValue.replace(/[^\d]/g, '');
    
    if (!numbers) return "";
    
    // Converte para número com duas casas decimais
    const number = parseInt(numbers, 10) / 100;
    
    // Formata como moeda brasileira
    return number.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatCurrency(inputValue);
    
    setDisplayValue(formatted);
    
    if (formatted) {
      // Converte de volta para número
      const numericValue = parseFloat(formatted.replace(/\./g, '').replace(',', '.'));
      
      const validation = validateCurrencyInput(formatted);
      
      if (validation.isValid) {
        setValidationError(undefined);
        onChange(numericValue);
      } else {
        setValidationError(validation.error);
      }
    } else {
      setValidationError(undefined);
      onChange(0);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  const finalError = error || validationError;

  return (
    <div className="space-y-2">
      {label && (
        <Label className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm font-medium">
          R$
        </div>
        <Input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder.replace("R$ ", "")}
          className={cn(
            "pl-10 text-right font-medium",
            finalError && "border-red-300 focus:border-red-500",
            !finalError && displayValue && "border-green-300 focus:border-green-500",
            className
          )}
        />
      </div>
      {finalError && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <span className="text-red-500">⚠</span>
          {finalError}
        </p>
      )}
    </div>
  );
}
