export interface ValidationRule {
  required?: boolean | string;
  minLength?: { value: number; message: string };
  maxLength?: { value: number; message: string };
  pattern?: { value: RegExp; message: string };
  custom?: (value: any) => string | null;
}

export interface FormErrors {
  [key: string]: string;
}

export interface FormValues {
  [key: string]: any;
}

export const useForm = <T extends FormValues>(
  initialValues: T,
  onSubmit: (values: T) => void | Promise<void>,
  validationRules?: Record<string, ValidationRule>
) => {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [touched, setTouched] = React.useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const validateField = (name: string, value: any): string | null => {
    const rules = validationRules?.[name];
    if (!rules) return null;

    // Required
    if (rules.required) {
      if (typeof value !== 'string' && typeof value !== 'number') {
        return typeof rules.required === 'string' ? rules.required : 'This field is required';
      }
      if (String(value).trim() === '') {
        return typeof rules.required === 'string' ? rules.required : 'This field is required';
      }
    }

    // MinLength
    if (rules.minLength && String(value).length < rules.minLength.value) {
      return rules.minLength.message;
    }

    // MaxLength
    if (rules.maxLength && String(value).length > rules.maxLength.value) {
      return rules.maxLength.message;
    }

    // Pattern
    if (rules.pattern && !rules.pattern.value.test(String(value))) {
      return rules.pattern.message;
    }

    // Custom
    if (rules.custom) {
      const customError = rules.custom(value);
      if (customError) return customError;
    }

    return null;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    Object.keys(values).forEach((key) => {
      const error = validateField(key, values[key as keyof T]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const fieldValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setValues((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, fieldValue);
      setErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, values[name as keyof T]);
    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name: string, value: any) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const setFieldError = (name: string, error: string | null) => {
    setErrors((prev) => ({
      ...prev,
      [name]: error || undefined,
    }));
  };

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setValues,
  };
};

import React from 'react';

// Common validation rules
export const ValidationRules = {
  email: {
    required: 'Email is required',
    pattern: {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      message: 'Invalid email address',
    },
  },
  password: {
    required: 'Password is required',
    minLength: { value: 8, message: 'Password must be at least 8 characters' },
  },
  phone: {
    pattern: {
      value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
      message: 'Invalid phone number',
    },
  },
  name: {
    required: 'Name is required',
    minLength: { value: 2, message: 'Name must be at least 2 characters' },
    maxLength: { value: 50, message: 'Name must be less than 50 characters' },
  },
};
