import Image from "next/image";

export const LanguageSelector = () => {
  return (
    <div className="inline-flex items-center gap-2 text-sm font-medium">
      <Image
        src="/fr.svg"
        alt="Langue française"
        width={20}
        height={20}
      />
      <span>FR</span>
    </div>
  );
};
