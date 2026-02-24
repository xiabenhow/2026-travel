import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = ({ children, value, onValueChange, className }: any) => (
  <div className={cn("w-full", className)}>{React.Children.map(children, (child) => React.cloneElement(child, { value, onValueChange }))}</div>
)

const TabsList = ({ children, className }: any) => (
  <div className={cn("inline-flex items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>{children}</div>
)

const TabsTrigger = ({ children, value, onValueChange, className }: any) => {
  const isActive = value === (children?.props?.value || children?.key || (typeof children === 'string' ? children : ''))
  // This is a simplified version of TabsTrigger for the app.
  return (
    <button
      onClick={() => onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className
      )}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </button>
  )
}

const TabsContent = ({ children, value, currentValue, className }: any) => {
  if (value !== currentValue) return null
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>{children}</div>
}

// Re-implementing more correctly for the app's usage
const TabsRoot = ({ children, value, onValueChange, className }: any) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!child) return null;
        return React.cloneElement(child, { currentValue: value, onValueChange });
      })}
    </div>
  );
};

const TabsListRoot = ({ children, currentValue, onValueChange, className }: any) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child) => {
        if (!child) return null;
        return React.cloneElement(child, { currentValue, onValueChange });
      })}
    </div>
  );
};

const TabsTriggerRoot = ({ children, value, currentValue, onValueChange, className }: any) => {
  const isActive = value === currentValue;
  return (
    <button
      onClick={() => onValueChange(value)}
      className={className}
      data-state={isActive ? "active" : "inactive"}
    >
      {children}
    </button>
  );
};

export { TabsRoot as Tabs, TabsListRoot as TabsList, TabsTriggerRoot as TabsTrigger, TabsContent }
