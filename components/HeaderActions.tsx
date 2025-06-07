"use client";

import { NewsletterButton } from "./NewsletterButton";
import { SearchBar } from "./SearchBar";
import { LanguageSelector } from "./LanguageSelector";
import { MobileMenuButton } from "./MobileMenuButton";

export const HeaderActions = () => {
  return (
    <div className="flex items-center gap-4">
      <div className="hidden lg:flex items-center gap-4">
        <NewsletterButton />
        <SearchBar />
        <LanguageSelector />
      </div>
      <div className="lg:hidden">
        <MobileMenuButton />
      </div>
    </div>
  );
};
