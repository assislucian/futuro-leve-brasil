
import { Form } from "@/components/ui/form";
import { useSignUpForm } from "@/hooks/useSignUpForm";
import { SignUpFormFields } from "./SignUpFormFields";

export function SignUpForm() {
  const { form, onSubmit, isSubmitting } = useSignUpForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <SignUpFormFields form={form} isSubmitting={isSubmitting} />
      </form>
    </Form>
  );
}
