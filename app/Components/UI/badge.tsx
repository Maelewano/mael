import * as React from "react";

import { cn } from "@/lib/utils/utils";

const badgeVariantClasses: Record<string, string> = {
    default:
        "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
    secondary:
        "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
    destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
    outline: "text-foreground",
};

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement> {
    variant?: keyof typeof badgeVariantClasses;
}

function Badge({
    className,
    variant = "default",
    ...props
}: BadgeProps) {
    return (
        <div
            className={cn(
                // base classes
                "focus:ring-ring inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
                // variant classes
                badgeVariantClasses[variant],
                // custom classes
                className
            )}
            {...props}
        />
    );
}

export { Badge };
