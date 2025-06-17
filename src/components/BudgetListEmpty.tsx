
import { CircleDollarSign } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageProvider";

interface BudgetListEmptyProps {
  monthName: string;
}

export function BudgetListEmpty({ monthName }: BudgetListEmptyProps) {
  const { t } = useLanguage();
  
  return (
    <div className="text-center py-16 border-2 border-dashed rounded-lg">
      <CircleDollarSign className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">
        {t('budgets.empty.title', { month: monthName })}
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        {t('budgets.empty.subtitle')}
      </p>
    </div>
  );
}
