import React, { type ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Button({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) {
    return (
        <button
            className={twMerge(clsx(
                'inline-flex items-center justify-center rounded font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-body-dark focus:ring-body-accent disabled:opacity-50 disabled:cursor-not-allowed',
                {
                    'bg-body-accent text-body-dark hover:bg-opacity-90': variant === 'primary',
                    'bg-body-secondary text-white hover:bg-opacity-80': variant === 'secondary',
                    'border-2 border-body-accent text-body-accent hover:bg-body-accent hover:text-body-dark': variant === 'outline',
                    'text-body-muted hover:text-white hover:bg-body-secondary': variant === 'ghost',

                    'px-3 py-1.5 text-xs': size === 'sm',
                    'px-4 py-2 text-sm': size === 'md',
                    'px-6 py-3 text-base': size === 'lg',
                    'px-8 py-4 text-lg': size === 'xl',
                },
                className
            ))}
            {...props}
        />
    );
}
