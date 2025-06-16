
-- Drop all existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can create their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can update their own budgets" ON public.budgets;
DROP POLICY IF EXISTS "Users can delete their own budgets" ON public.budgets;

DROP POLICY IF EXISTS "Users can view their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can create their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can update their own transactions" ON public.transactions;
DROP POLICY IF EXISTS "Users can delete their own transactions" ON public.transactions;

DROP POLICY IF EXISTS "Users can view their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can create their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.goals;

DROP POLICY IF EXISTS "Users can view their own goal contributions" ON public.goal_contributions;
DROP POLICY IF EXISTS "Users can create their own goal contributions" ON public.goal_contributions;
DROP POLICY IF EXISTS "Users can update their own goal contributions" ON public.goal_contributions;
DROP POLICY IF EXISTS "Users can delete their own goal contributions" ON public.goal_contributions;

DROP POLICY IF EXISTS "Users can view their own installment plans" ON public.installment_plans;
DROP POLICY IF EXISTS "Users can create their own installment plans" ON public.installment_plans;
DROP POLICY IF EXISTS "Users can update their own installment plans" ON public.installment_plans;
DROP POLICY IF EXISTS "Users can delete their own installment plans" ON public.installment_plans;

DROP POLICY IF EXISTS "Users can view their own installment payments" ON public.installment_payments;
DROP POLICY IF EXISTS "Users can create their own installment payments" ON public.installment_payments;
DROP POLICY IF EXISTS "Users can update their own installment payments" ON public.installment_payments;
DROP POLICY IF EXISTS "Users can delete their own installment payments" ON public.installment_payments;

DROP POLICY IF EXISTS "Users can view their own recurring transactions" ON public.recurring_transactions;
DROP POLICY IF EXISTS "Users can create their own recurring transactions" ON public.recurring_transactions;
DROP POLICY IF EXISTS "Users can update their own recurring transactions" ON public.recurring_transactions;
DROP POLICY IF EXISTS "Users can delete their own recurring transactions" ON public.recurring_transactions;

DROP POLICY IF EXISTS "Users can view their own classification patterns" ON public.classification_patterns;
DROP POLICY IF EXISTS "Users can create their own classification patterns" ON public.classification_patterns;
DROP POLICY IF EXISTS "Users can update their own classification patterns" ON public.classification_patterns;
DROP POLICY IF EXISTS "Users can delete their own classification patterns" ON public.classification_patterns;

DROP POLICY IF EXISTS "Users can view and manage their own profile" ON public.profiles;

-- Create unified RLS policies using a simpler naming convention
CREATE POLICY "user_budgets_policy"
  ON public.budgets FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_transactions_policy"
  ON public.transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_goals_policy"
  ON public.goals FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_goal_contributions_policy"
  ON public.goal_contributions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_installment_plans_policy"
  ON public.installment_plans FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_installment_payments_policy"
  ON public.installment_payments FOR ALL
  USING (EXISTS (
    SELECT 1 FROM public.installment_plans ip 
    WHERE ip.id = installment_plan_id AND ip.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.installment_plans ip 
    WHERE ip.id = installment_plan_id AND ip.user_id = auth.uid()
  ));

CREATE POLICY "user_recurring_transactions_policy"
  ON public.recurring_transactions FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_classification_patterns_policy"
  ON public.classification_patterns FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "user_profiles_policy"
  ON public.profiles FOR ALL
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create the security audit log table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  table_name TEXT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Enable RLS on audit log table
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Policies for audit log
DROP POLICY IF EXISTS "System can insert audit logs" ON public.security_audit_log;
DROP POLICY IF EXISTS "Users can view their own audit logs" ON public.security_audit_log;

CREATE POLICY "audit_log_insert_policy"
  ON public.security_audit_log FOR INSERT
  WITH CHECK (true);

CREATE POLICY "audit_log_select_policy"
  ON public.security_audit_log FOR SELECT
  USING (auth.uid() = user_id);
