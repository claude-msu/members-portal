import * as React from "react";
import { type VariantProps } from "class-variance-authority";

import { cn, createBadgeVariants } from "@/lib/utils";

const badgeVariants = createBadgeVariants();

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> { }

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

// eslint-disable-next-line react-refresh/only-export-components
export { Badge, badgeVariants };