import { cn } from "@/lib/utils"; // si tu utilises la fonction cn() de ShadCN
import React from "react";

type ContentCardWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export const ContentCardWrapper = ({ children, className }: ContentCardWrapperProps) => {
  return (
    <div
      className={cn(
        "rounded-xl bg-white p-4 shadow-sm border",
        className
      )}
    >
      {children}
    </div>
  );
};
