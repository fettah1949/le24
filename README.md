# Le24 — Site d'actualités professionnel

Site de news moderne **Le24** (style le360.ma), construit avec **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, **Prisma** et **PostgreSQL**.

## Fonctionnalités

### Public
- Page d'accueil (top stories, latest, breaking, tendances, catégories)
- Pages catégorie, article, auteur, tag
- Moteur de recherche
- Articles liés + breadcrumbs
- Newsletter
- Pages statiques (About, Contact, Privacy)

### SEO
- `generateMetadata` sur chaque page
- Canonical URLs, Open Graph, Twitter Cards
- `sitemap.xml` dynamique, `robots.txt`
- JSON-LD : NewsArticle, BreadcrumbList, Organization, Person, WebSite

### Admin (`/admin`)
- Authentification JWT (cookie httpOnly)
- CRUD articles (brouillon / publié / planifié)
- CRUD catégories, tags, auteurs
- Upload d'images
- Slug auto + champs SEO
- Dashboard statistiques

## Installation

### 1. Prérequis
- Node.js 20+
- PostgreSQL (local ou cloud)

### 2. Configuration

```bash
cp .env.example .env
```

Modifiez `.env` :

```env
DATABASE_URL="postgresql://postgres:VOTRE_MOT_DE_PASSE@localhost:5432/newssou?schema=public"
NEXTAUTH_SECRET="une-chaine-secrete-longue-et-aleatoire"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
NEXT_PUBLIC_SITE_NAME="Le24"
ADMIN_EMAIL="admin@le24.ma"
ADMIN_PASSWORD="admin123"
```

### 3. Base de données

Créez la base PostgreSQL :

```sql
CREATE DATABASE newssou;
```

Puis :

```bash
npm install
npm run db:push
npm run db:seed
```

### 4. Lancement

```bash
npm run dev
```

- Site public : http://localhost:3000
- Admin : http://localhost:3000/admin/login
- Identifiants par défaut : `admin@le24.ma` / (mot de passe défini dans `.env`)

## Structure du projet

```
app/
├── (public)/          # Routes publiques
│   ├── page.tsx       # Accueil
│   ├── news/[slug]/   # Article
│   ├── category/[slug]/
│   ├── author/[slug]/
│   ├── tag/[slug]/
│   ├── search/
│   ├── about/
│   ├── contact/
│   └── privacy/
├── admin/
│   ├── login/
│   └── (dashboard)/   # Back-office protégé
├── api/               # Routes API REST
├── sitemap.ts
└── robots.ts

components/
├── news/              # Composants publics
├── admin/             # Composants back-office
└── seo/

lib/
├── db/prisma.ts       # Client Prisma singleton
├── queries/articles.ts
├── seo/metadata.ts
├── auth.ts
├── utils.ts
└── validations.ts

prisma/
├── schema.prisma
└── seed.ts
```

## Scripts

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build production |
| `npm run db:push` | Sync schéma Prisma → DB |
| `npm run db:seed` | Données de démonstration |
| `npm run db:studio` | Interface Prisma Studio |

## Production

1. Configurez PostgreSQL en production (Neon, Supabase, Railway…)
2. Définissez toutes les variables d'environnement
3. `npm run db:push && npm run db:seed`
4. `npm run build && npm start`

## Sécurité

- Changez `ADMIN_PASSWORD` et `NEXTAUTH_SECRET` en production
- Les routes `/admin` et `/api` (sauf newsletter) sont protégées par session JWT
- Upload limité à 5 Mo, types image uniquement
