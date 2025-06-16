
import { CheckCircle, XCircle } from "lucide-react";

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const checks = [
    { test: password.length >= 8, label: "Pelo menos 8 caracteres" },
    { test: /[a-z]/.test(password), label: "Uma letra minúscula" },
    { test: /[A-Z]/.test(password), label: "Uma letra maiúscula" },
    { test: /\d/.test(password), label: "Um número" },
    { test: /[@$!%*?&]/.test(password), label: "Um caractere especial (@$!%*?&)" },
  ];
  
  const passedChecks = checks.filter(check => check.test).length;
  
  const getStrengthColor = () => {
    if (passedChecks <= 2) return 'bg-red-500';
    if (passedChecks <= 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthText = () => {
    if (passedChecks <= 2) return 'Fraca';
    if (passedChecks <= 3) return 'Média';
    if (passedChecks <= 4) return 'Forte';
    return 'Muito Forte';
  };

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Barra de força */}
      <div className="flex items-center gap-2">
        <div className="flex gap-1 flex-1">
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              className={`h-1 flex-1 rounded ${
                level <= passedChecks ? getStrengthColor() : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        <span className="text-xs font-medium text-gray-600">
          {getStrengthText()}
        </span>
      </div>
      
      {/* Lista de requisitos */}
      <div className="text-xs space-y-1">
        {checks.map((check, index) => (
          <div key={index} className="flex items-center gap-2">
            {check.test ? (
              <CheckCircle className="h-3 w-3 text-green-500" />
            ) : (
              <XCircle className="h-3 w-3 text-gray-400" />
            )}
            <span className={check.test ? "text-green-600" : "text-gray-500"}>
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
