import Link from "next/link";

const NAV_LINKS = [
  { href: "/itinéraires", label: "Itinéraires" },
  { href: "/horaires", label: "Horaires" },
  { href: "/plans", label: "Plans" },
  { href: "/trafic", label: "Trafic" },
  { href: "/tarifs", label: "Tarifs" },
  { href: "/visiter-paris", label: "Visiter Paris" },
];

export const MainNav = () => {
  return (
    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
      {NAV_LINKS.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="text-muted-foreground hover:text-foreground transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
};
