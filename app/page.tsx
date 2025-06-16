import Link from "next/link";

export default function HomePage() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-12 space-y-12">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Accessibilité et fiabilité des équipements PMR</h1>
        <p className="text-muted-foreground">
          Bienvenue sur la plateforme de suivi de l&apos; état des équipements destinés aux personnes à mobilité réduite (PMR) dans les stations de transport de la RATP.
        </p>
        <Link href="/etat-equipement">Voir l'état des équipements</Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">🎯 Objectif du projet</h2>
        <p>
          L’objectif principal est <strong>d’améliorer la transparence et la lisibilité des données liées à la disponibilité des équipements</strong> (ascenseurs, escalators, etc.) pour les usagers PMR.
        </p>
        <p>
          Il ne s’agit pas simplement de visualiser des données, mais de <strong>fournir une représentation intelligible, utile et actionnable</strong>.
        </p>
        <blockquote className="border-l-4 pl-4 italic text-muted-foreground">
          Ce projet se positionne comme un <strong>outil citoyen</strong> destiné à pointer les défaillances structurelles, et non comme une simple surcouche visuelle.
        </blockquote>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">⚙️ Choix structurels</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>Approche orientée données</strong> — Le cœur du projet repose sur l’exploitation de données publiques ou semi-publiques, et sur leur fiabilité réelle.
          </li>
          <li>
            <strong>Récupération et historisation des incidents</strong> — Archivage de l’état des équipements dans le temps pour permettre des analyses sur la durée.
          </li>
          <li>
            <strong>Pas de dépendance front-tech</strong> — Le fond prime sur la forme. Le design est sobre, sans dépendance à des technologies d’interface avancées.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">🚧 En cours de développement</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>Affichage historique par station</li>
          <li>Statistiques mensuelles/hebdomadaires</li>
          <li>Signalement participatif</li>
          <li>Vue carte interactive</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">💡 En savoir plus</h2>
        <ul className="list-disc pl-6 space-y-2 text-blue-600 underline">
          <li><a href="#">Données utilisées</a></li>
          <li><a href="#">FAQ</a></li>
          <li><a href="https://github.com/ton-github/ratp-pmr-reliability" target="_blank">Code source</a></li>
        </ul>
      </section>
    </main>
  );
}
