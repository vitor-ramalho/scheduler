import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-teal-500",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export { Input };
