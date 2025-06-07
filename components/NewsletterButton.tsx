import { Button } from "@/components/ui/button";
import { MailPlus } from "lucide-react";
import Link from "next/link";

export const NewsletterButton = () => {
  return (
    <Button asChild variant="outline" className="gap-2">
      <Link href="/newsletter">
        <MailPlus className="h-4 w-4" />
        <span className="font-medium">
          S’inscrire à la newsletter <span className="text-green-600">maRATP</span>
        </span>
      </Link>
    </Button>
  );
};
