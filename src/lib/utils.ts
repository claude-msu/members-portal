import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { cva } from "class-variance-authority";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Centralized interface attributes for consistent styling across components
export const interfaceAttributes = {
  variants: {
    default: "bg-primary border-2 border-primary text-primary-foreground hover:bg-cream hover:text-primary",
    secondary: "border-2 border-primary hover:bg-primary text-primary hover:text-cream",

    green: "bg-green-600 border-2 border-green-600 text-white hover:bg-cream hover:text-green-600",
    red: "bg-background border-2 border-destructive text-destructive hover:bg-destructive hover:text-cream",

    outline: "border-2 border-black hover:bg-black hover:text-cream",
    ghost: "hover:bg-primary hover:text-cream",
    link: "text-primary underline-offset-4 hover:underline",
  },
  sizes: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  },
  defaults: {
    variant: "default" as const,
    size: "default" as const,
  },
} as const;

// Type helpers for variant and size
export type InterfaceVariant = keyof typeof interfaceAttributes.variants;
export type InterfaceSize = keyof typeof interfaceAttributes.sizes;

// Helper to create consistent button-like variants using CVA
export const createButtonVariants = (baseClasses: string = "") => {
  return cva(
    cn(
      "inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
      baseClasses
    ),
    {
      variants: {
        variant: interfaceAttributes.variants,
        size: interfaceAttributes.sizes,
      },
      defaultVariants: interfaceAttributes.defaults,
    }
  );
};

// Helper to create badge variants (rounded-full, with borders matching button style)
export const createBadgeVariants = (baseClasses: string = "") => {
  return cva(
    cn(
      "inline-flex items-center rounded-full border-2 px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      baseClasses
    ),
    {
      variants: {
        variant: {
          board: "border-primary bg-primary text-primary-foreground",
          member: "bg-secondary text-secondary-foreground",
          prospect: "text-foreground",

          default: "bg-secondary text-secondary-foreground",
          secondary: "bg-secondary text-primary",

          green: "bg-green-600/5 text-green-600",
          red: "bg-red-600/5 text-red-600",
          blue: "bg-blue-600/5 text-blue-800",
          gray: "bg-gray-600/5 text-gray-600",

          outline: "text-foreground",
          ghost: "border-primary",
          link: "text-primary underline-offset-4",
        },
      },
      defaultVariants: {
        variant: "default",
      },
    }
  );
};