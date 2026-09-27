import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * Scopes the shadcn dark-theme tokens (AD-002) to this element's subtree,
 * reusing the same `.dark` mechanism the preset already ships - not tied to
 * the OS/user color-scheme preference, just to this section's content.
 */
export function DarkSection({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("dark bg-background text-foreground", className)}
      {...props}
    >
      {children}
    </div>
  );
}
