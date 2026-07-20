import type { InertiaLinkProps } from '@inertiajs/react';
import { clsx } from 'clsx';
import type { ClassValue } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(url: NonNullable<InertiaLinkProps['href']>): string {
    return typeof url === 'string' ? url : url.url;
}

export function monthName(year: string, month: string) {
    if (month && year) {
        const date = new Date(Number(year), Number(month) - 1, 1);
        return `${format(date, 'MMM')} ${year}`;
    }

    return format(new Date(), 'MMM yyyy');
}
