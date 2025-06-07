import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link href="/" className="inline-flex items-center gap-2">
      <Image
        src="/logo.svg"
        alt="Logo RATP"
        width={40}
        height={40}
        priority
      />
      <span className="sr-only">Retour à l’accueil</span>
    </Link>
  );
};
