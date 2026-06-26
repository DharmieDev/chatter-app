import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize('NFD')                
    .replace(/[\u0300-\u036f]/g, '') 
    .replace(/[^a-z0-9 -]/g, '')     
    .replace(/\s+/g, '-')            
    .replace(/-+/g, '-')             
    .replace(/^-+|-+$/g, '');        
}  
