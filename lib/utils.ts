import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
};

export const safeDecodeJson = (value: string | null, defaultValue?: any) => {
  if (!value) {
    return defaultValue;
  }
  try {
    return JSON.parse(value);
  } catch (err) {
    console.error('[ERROR PARSING JSON]:', err);
    return defaultValue;
  }
};

// Check if localStorage is available (for example, in a browser environment)
export const isLocalStorageAvailable = typeof localStorage !== 'undefined';
