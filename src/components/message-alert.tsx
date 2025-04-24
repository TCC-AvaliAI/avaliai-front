"use client";

import React from "react";
import { CheckCircle, XCircle, AlertTriangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type MessageVariant = "success" | "error" | "warning";

export interface MessageAlertProps {
  variant: MessageVariant;
  title?: string;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

export function MessageAlert({
  variant = "success",
  title,
  message,
  dismissible = true,
  onDismiss,
  className,
}: MessageAlertProps) {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) {
    return null;
  }

  const variantStyles = {
    success: {
      container: "bg-green-50 border-green-500 text-green-800",
      icon: <CheckCircle className="h-5 w-5 text-green-500" />,
      title: "text-green-800 font-medium",
    },
    error: {
      container: "bg-red-50 border-red-500 text-red-800",
      icon: <XCircle className="h-5 w-5 text-red-500" />,
      title: "text-red-800 font-medium",
    },
    warning: {
      container: "bg-yellow-50 border-yellow-500 text-yellow-800",
      icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
      title: "text-yellow-800 font-medium",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className={cn(
        "flex items-start p-4 rounded-md border-l-4 mb-4 mt-3",
        styles.container,
        className
      )}
      role="alert"
    >
      <div className="flex-shrink-0 mr-3 pt-0.5">{styles.icon}</div>
      <div className="flex-1">
        {title && <p className={cn("font-semibold", styles.title)}>{title}</p>}
        <p className="text-sm mt-1">{message}</p>
      </div>
      {dismissible && (
        <button
          type="button"
          className="flex-shrink-0 ml-3 -mt-1 -mr-1 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent focus:ring-gray-400 hover:cursor-pointer"
          onClick={handleDismiss}
          aria-label="Fechar"
        >
          <X className="h-4 w-4 text-gray-500" />
        </button>
      )}
    </div>
  );
}
