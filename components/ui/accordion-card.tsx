// components/ui/accordion-card.tsx
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

type AccordionCardProps = {
  value: string;
  defaultOpen?: boolean;
  icon?: ReactNode;
  title: ReactNode;
  badges?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AccordionCard({
  value,
  defaultOpen = false,
  icon,
  title,
  badges,
  children,
  className,
}: AccordionCardProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? value : undefined}
    >
      <AccordionItem value={value}>
        <div
          className={cn(
            "flex-col gap-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg border hover:shadow-sm transition-all duration-200",
            className
          )}
        >
          <AccordionTrigger>
            <div className="flex w-full items-center justify-between gap-2 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3 text-left">
                {icon}
                <span className="font-medium text-sm sm:text-base">
                  {title}
                </span>
                {badges}
              </div>
            </div>
          </AccordionTrigger>

          <AccordionContent>{children}</AccordionContent>
        </div>
      </AccordionItem>
    </Accordion>
  );
}
