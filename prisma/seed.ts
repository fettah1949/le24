import { PrismaClient, ArticleStatus } from "@prisma/client";
import { hashPassword } from "../lib/auth";
import { generateSlug } from "../lib/utils";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@le24.ma";
  const adminPasswordPlain = process.env.ADMIN_PASSWORD;

  if (!adminPasswordPlain || adminPasswordPlain.length < 12) {
    throw new Error(
      "ADMIN_PASSWORD must be set in .env and be at least 12 characters"
    );
  }

  const adminPassword = await hashPassword(adminPasswordPlain);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { password: adminPassword },
    create: {
      email: adminEmail,
      password: adminPassword,
      name: "Admin",
      role: "admin",
    },
  });

  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: "politique" },
      update: {},
      create: {
        name: "Politique",
        slug: "politique",
        description: "Actualités politiques nationales et internationales",
      },
    }),
    prisma.category.upsert({
      where: { slug: "economie" },
      update: {},
      create: {
        name: "Économie",
        slug: "economie",
        description: "Finance, marchés et économie",
      },
    }),
    prisma.category.upsert({
      where: { slug: "technologie" },
      update: {},
      create: {
        name: "Technologie",
        slug: "technologie",
        description: "Innovation, IA et tech",
      },
    }),
    prisma.category.upsert({
      where: { slug: "sport" },
      update: {},
      create: {
        name: "Sport",
        slug: "sport",
        description: "Actualités sportives",
      },
    }),
    prisma.category.upsert({
      where: { slug: "culture" },
      update: {},
      create: {
        name: "Culture",
        slug: "culture",
        description: "Arts, cinéma et culture",
      },
    }),
  ]);

  const authors = await Promise.all([
    prisma.author.upsert({
      where: { slug: "marie-dubois" },
      update: {},
      create: {
        name: "Marie Dubois",
        slug: "marie-dubois",
        bio: "Journaliste politique avec 15 ans d'expérience.",
        email: "marie@le24.ma",
      },
    }),
    prisma.author.upsert({
      where: { slug: "jean-martin" },
      update: {},
      create: {
        name: "Jean Martin",
        slug: "jean-martin",
        bio: "Correspondant économique et analyste financier.",
        email: "jean@le24.ma",
      },
    }),
    prisma.author.upsert({
      where: { slug: "sophie-laurent" },
      update: {},
      create: {
        name: "Sophie Laurent",
        slug: "sophie-laurent",
        bio: "Spécialiste tech et innovation numérique.",
        email: "sophie@le24.ma",
      },
    }),
  ]);

  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: "urgent" },
      update: {},
      create: { name: "Urgent", slug: "urgent" },
    }),
    prisma.tag.upsert({
      where: { slug: "analyse" },
      update: {},
      create: { name: "Analyse", slug: "analyse" },
    }),
    prisma.tag.upsert({
      where: { slug: "interview" },
      update: {},
      create: { name: "Interview", slug: "interview" },
    }),
    prisma.tag.upsert({
      where: { slug: "international" },
      update: {},
      create: { name: "International", slug: "international" },
    }),
  ]);

  const sampleArticles = [
    {
      title: "Réforme constitutionnelle : les enjeux du débat parlementaire",
      excerpt:
        "Le gouvernement présente sa réforme constitutionnelle devant l'Assemblée nationale. Analyse des principaux points de friction.",
      content: `<p>Le débat parlementaire sur la réforme constitutionnelle s'ouvre dans un contexte politique tendu. Les principaux points de la réforme concernent le mode de scrutin, la durée des mandats et les pouvoirs exécutifs.</p>
<p>Les oppositions dénoncent une réforme qu'elles jugent insuffisante, tandis que la majorité défend un texte qu'elle présente comme un compromis historique.</p>
<p>Les experts constitutionnels s'interrogent sur l'impact à long terme de ces modifications sur l'équilibre des pouvoirs.</p>`,
      categoryId: categories[0].id,
      authorId: authors[0].id,
      isBreaking: true,
      views: 1250,
      tagIds: [tags[0].id, tags[1].id],
    },
    {
      title: "Les marchés européens en hausse après les annonces de la BCE",
      excerpt:
        "La Banque centrale européenne maintient ses taux directeurs, provoquant un rallye sur les places boursières.",
      content: `<p>Les indices boursiers européens ont clôturé en forte hausse jeudi, après la décision de la BCE de maintenir ses taux directeurs inchangés.</p>
<p>Le CAC 40 a gagné 1,8% tandis que le DAX allemand a progressé de 2,1%. Les investisseurs saluent cette décision qui laisse présager une stabilisation économique.</p>
<p>Les analystes restent toutefois prudents face aux incertitudes géopolitiques persistantes.</p>`,
      categoryId: categories[1].id,
      authorId: authors[1].id,
      isBreaking: false,
      views: 890,
      tagIds: [tags[1].id],
    },
    {
      title: "L'IA générative transforme le journalisme : opportunités et risques",
      excerpt:
        "Comment les rédactions adaptent leurs workflows face à l'essor de l'intelligence artificielle générative.",
      content: `<p>L'intelligence artificielle générative bouleverse les rédactions du monde entier. De la rédaction assistée à la vérification des faits, les usages se multiplient.</p>
<p>Les journalistes doivent repenser leurs compétences tout en préservant l'éthique et la qualité de l'information.</p>
<p>Plusieurs médias ont déjà mis en place des chartes éditoriales encadrant l'usage de l'IA dans leur processus de production.</p>`,
      categoryId: categories[2].id,
      authorId: authors[2].id,
      isBreaking: false,
      views: 2100,
      tagIds: [tags[1].id, tags[2].id],
    },
    {
      title: "Coupe du monde : la sélection nationale se qualifie pour les huitièmes",
      excerpt:
        "Victoire 3-1 face à un adversaire redoutable. La qualification est assurée pour la phase finale.",
      content: `<p>La sélection nationale a validé sa qualification pour les huitièmes de finale en s'imposant 3-1 lors d'un match intense.</p>
<p>Les trois buteurs ont montré une efficacité remarquable, confirmant la forme excellente de l'équipe.</p>
<p>Le sélectionneur a salué la cohésion du groupe et la qualité du jeu proposé.</p>`,
      categoryId: categories[3].id,
      authorId: authors[0].id,
      isBreaking: true,
      views: 3400,
      tagIds: [tags[0].id],
    },
    {
      title: "Festival de Cannes : le palmarès suscite le débat",
      excerpt:
        "La Palme d'or décernée à un film d'auteur divise critiques et public.",
      content: `<p>Le Festival de Cannes s'est clos sur un palmarès qui ne laisse personne indifférent. La Palme d'or est revenue à un cinéaste reconnu pour son approche avant-gardiste.</p>
<p>Les critiques sont partagées entre admiration pour l'audace artistique et interrogations sur l'accessibilité du film.</p>
<p>Le box-office reste à confirmer, mais l'effet Cannes devrait propulser le film en salles.</p>`,
      categoryId: categories[4].id,
      authorId: authors[2].id,
      isBreaking: false,
      views: 780,
      tagIds: [tags[2].id],
    },
    {
      title: "Sommet climatique : un accord historique sur la décarbonation",
      excerpt:
        "195 pays s'accordent sur des objectifs contraignants de réduction des émissions carbone d'ici 2035.",
      content: `<p>Le sommet climatique international a abouti à un accord sans précédent. 195 pays se sont engagés à réduire leurs émissions de 50% d'ici 2035.</p>
<p>Les financements pour les pays en développement ont été triplés, marquant une avancée significative sur la question de la justice climatique.</p>
<p>Les ONG environnementales saluent un progrès tout en appelant à une mise en œuvre rapide et vérifiable.</p>`,
      categoryId: categories[0].id,
      authorId: authors[0].id,
      isBreaking: true,
      views: 1800,
      tagIds: [tags[0].id, tags[3].id],
    },
  ];

  for (const article of sampleArticles) {
    const slug = generateSlug(article.title);
    const { tagIds, ...data } = article;

    await prisma.article.upsert({
      where: { slug },
      update: {},
      create: {
        ...data,
        slug,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        seoTitle: article.title,
        seoDescription: article.excerpt,
        tags: {
          create: tagIds.map((tagId) => ({ tagId })),
        },
      },
    });
  }

  console.log("✅ Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
