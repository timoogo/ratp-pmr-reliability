# RATP PMR Reliability

## 🚀 Démarrage Rapide

Ce guide vous permettra de lancer l'application en environnement de développement local.

### Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)
- `make`

### 1. Configuration de l'environnement

1.  **Clonez le dépôt :**
    ```bash
    git clone <URL_DU_REPO>
    cd ratp-pmr-reliability
    ```

2.  **Créez le fichier d'environnement :**
    Le projet utilise un fichier `.env` pour gérer les clés VAPID nécessaires aux notifications push web.

    *   Générez les clés VAPID avec le script fourni :
        ```bash
        npx tsx generate-vapid.ts
        ```
    *   Copiez la sortie de la commande et collez-la dans un nouveau fichier nommé `.env` à la racine du projet. Le fichier devrait ressembler à ceci :
        ```
        VAPID_PUBLIC_KEY=BEl...
        VAPID_PRIVATE_KEY=a_i...
        ```

### 2. Lancement de l'application

La commande suivante s'occupe de tout : construction des images Docker, démarrage des conteneurs, application des migrations de la base de données et lancement de Prisma Studio.

```bash
make start-dev
```

Cette commande exécute les étapes suivantes :
- 🐳 Arrête les anciens conteneurs (`docker compose down -v`).
- 📂 Supprime les anciennes migrations Prisma pour un démarrage propre.
- 🚀 Démarre tous les services définis dans `docker-compose.yml` (`web`, `ws`, `db`, `notifier`).
- 💾 Applique les migrations de la base de données (`prisma migrate dev`).
- ✨ Lance Prisma Studio pour la gestion de la base de données.

### 3. Accès aux services

Une fois le lancement terminé, les services sont accessibles aux adresses suivantes :

-   **Application Web :** [http://localhost:3000](http://localhost:3000)
-   **Serveur WebSocket :** `ws://localhost:3001`
-   **Prisma Studio (Base de données) :** [http://localhost:5555](http://localhost:5555)

### Commandes `make` utiles

-   `make stop-dev` : Arrête tous les conteneurs de développement.
-   `make reset-db` : Réinitialise complètement la base de données, applique les migrations et la remplit avec les données de test (`seed`).
-   `make reseed` : Remplit la base de données avec les données de test sans la réinitialiser.
-   `make prune` : Nettoie votre environnement Docker (conteneurs, images, volumes et réseaux non utilisés).