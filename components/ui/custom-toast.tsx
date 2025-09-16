import * as React from "react";
import { CheckCircle, XCircle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomToastProps {
  title: string;
  description?: string;
  type?: "success" | "error" | "warning" | "info";
  className?: string;
}

export function CustomToast({
  title,
  description,
  type = "success",
  className,
}: CustomToastProps) {
  const getIcon = () => {
    switch (type) {
      case "success":
        return (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
      case "error":
        return <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />;
      case "warning":
        return (
          <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
        );
      case "info":
        return <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />;
      default:
        return (
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
        );
    }
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200";
      case "error":
        return "bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200";
      case "info":
        return "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200";
      default:
        return "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200";
    }
  };

  return (
    <div
      className={cn(
        "flex items-start gap-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm w-full h-full",
        getStyles(),
        className
      )}
    >
      {getIcon()}
      <div className="flex-1 min-w-0">
        <h4 className="font-semibold text-sm leading-tight">{title}</h4>
        {description && (
          <p className="text-sm opacity-90 mt-1 leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
