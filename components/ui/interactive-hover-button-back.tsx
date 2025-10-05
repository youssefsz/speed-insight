import { ArrowLeft } from "lucide-react"

import { cn } from "@/lib/utils"

export function InteractiveHoverButtonBack({
  children,
  className,
  disabled,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "group bg-background relative w-auto overflow-hidden rounded-full border p-2 px-6 text-center font-semibold",
        disabled ? "cursor-not-allowed" : "cursor-pointer",
        className
      )}
      disabled={disabled}
      {...props}
    >
      <div className="flex items-center gap-2">
        <div className={cn(
          "bg-primary h-2 w-2 rounded-full transition-all duration-300",
          !disabled && "group-hover:scale-[100.8]"
        )}></div>
        <span className={cn(
          "inline-block transition-all duration-300",
          !disabled && "group-hover:-translate-x-12 group-hover:opacity-0"
        )}>
          {children}
        </span>
      </div>
      <div className={cn(
        "text-primary-foreground absolute top-0 left-0 z-10 flex h-full w-full -translate-x-12 items-center justify-center gap-2 opacity-0 transition-all duration-300",
        !disabled && "group-hover:translate-x-0 group-hover:opacity-100"
      )}>
        <ArrowLeft />
        <span>{children}</span>
      </div>
    </button>
  )
}
