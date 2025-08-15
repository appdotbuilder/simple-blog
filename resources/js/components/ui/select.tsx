import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "@/components/lucide-icons";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

interface SelectTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, isOpen, setIsOpen }}>
      <div className="relative">
        {children}
      </div>
    </SelectContext.Provider>
  );
}

export function SelectTrigger({ className, children, ...props }: SelectTriggerProps) {
  const context = React.useContext(SelectContext);
  
  return (
    <button
      type="button"
      className={cn(
        "flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-600 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      onClick={() => context?.setIsOpen(!context.isOpen)}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  );
}

export function SelectContent({ children }: SelectContentProps) {
  const context = React.useContext(SelectContext);
  
  if (!context?.isOpen) return null;

  return (
    <div className="absolute z-50 mt-1 max-h-96 min-w-full overflow-auto rounded-md border border-gray-300 bg-white py-1 shadow-lg">
      {children}
    </div>
  );
}

export function SelectItem({ value, children, className, ...props }: SelectItemProps) {
  const context = React.useContext(SelectContext);
  
  return (
    <div
      className={cn(
        "relative flex cursor-pointer select-none items-center py-1.5 pl-2 pr-8 text-sm hover:bg-gray-100 focus:bg-gray-100",
        context?.value === value && "bg-blue-50 text-blue-600",
        className
      )}
      onClick={() => {
        context?.onValueChange(value);
        context?.setIsOpen(false);
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function SelectValue({ placeholder }: SelectValueProps) {
  const context = React.useContext(SelectContext);
  
  if (!context?.value) {
    return <span className="text-gray-500">{placeholder}</span>;
  }
  
  return <span>{context.value}</span>;
}