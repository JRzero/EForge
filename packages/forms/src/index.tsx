import type {ReactNode} from 'react';
import {
  useController,
  useForm,
  type Control,
  type FieldPath,
  type FieldValues,
  type Resolver,
  type UseFormProps,
} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Input, type InputProps} from '@eforge/ui';

export {Controller, FormProvider, useFormContext, useWatch} from 'react-hook-form';
export type {FieldErrors, FieldValues, SubmitHandler, UseFormReturn} from 'react-hook-form';
export {z} from 'zod';

export function useZodForm<TValues extends FieldValues>(
  schema: z.ZodType<TValues, TValues>,
  options: Omit<UseFormProps<TValues>, 'resolver'> = {},
) {
  return useForm<TValues>({
    ...options,
    resolver: zodResolver(schema) as Resolver<TValues>,
  });
}

export interface FormTextFieldProps<TValues extends FieldValues>
  extends Omit<InputProps, 'value' | 'onChange' | 'label' | 'status'> {
  name: FieldPath<TValues>;
  control: Control<TValues>;
  label: string;
}

export function FormTextField<TValues extends FieldValues>({
  name,
  control,
  label,
  ...props
}: FormTextFieldProps<TValues>) {
  const {field, fieldState} = useController({name, control});
  const value = field.value == null ? '' : String(field.value);
  return (
    <Input
      {...props}
      label={label}
      value={value}
      onChange={nextValue => field.onChange(nextValue)}
      {...(fieldState.error?.message
        ? {status: {type: 'error' as const, message: fieldState.error.message}}
        : {})}
    />
  );
}

export interface FormSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function FormSection({title, description, children}: FormSectionProps) {
  return (
    <section className="ef-form-section">
      {(title || description) && (
        <header className="ef-form-section__header">
          {title && <h2>{title}</h2>}
          {description && <p>{description}</p>}
        </header>
      )}
      <div className="ef-form-section__body">{children}</div>
    </section>
  );
}

export interface FormActionsProps {
  children: ReactNode;
  align?: 'start' | 'end' | 'between';
}

export function FormActions({children, align = 'end'}: FormActionsProps) {
  return <div className={`ef-form-actions ef-form-actions--${align}`}>{children}</div>;
}
