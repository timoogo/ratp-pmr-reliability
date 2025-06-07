"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export const MobileMenuButton = ({ onClick }: { onClick?: () => void }) => {
  return (
    <Button variant="ghost" size="icon" onClick={onClick}>
      <Menu className="h-6 w-6" />
      <span className="sr-only">Ouvrir le menu</span>
    </Button>
  );
};
