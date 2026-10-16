import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: 'bg-brand-600 text-white shadow-md shadow-brand-900/15 hover:bg-brand-700',
  secondary: 'border-2 border-brand-600 bg-surface text-brand-700 hover:bg-brand-50',
  ghost: 'text-brand-700 hover:bg-brand-50',
};

/** Large, touch-friendly pill button. */
export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={[
        'inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-lg font-semibold',
        'transition-[background-color,transform,opacity] active:scale-[0.98]',
        'disabled:pointer-events-none disabled:opacity-40',
        VARIANT_CLASSES[variant],
        fullWidth ? 'w-full' : '',
        className,
      ].join(' ')}
      {...props}
    />
  );
}
