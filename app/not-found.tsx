import Link from "next/link";
import { localizedPath } from "@/lib/i18n/paths";
import { defaultLocale } from "@/lib/i18n/config";

export default function NotFound() {
  return (
    <div className="container-main flex flex-col items-center justify-center py-24 text-center">
      <h1 className="text-6xl font-bold text-brand-600">404</h1>
      <p className="mt-4 text-xl text-news-muted">Page non trouvée</p>
      <Link href={localizedPath(defaultLocale)} className="btn-primary mt-8">
        Retour à l&apos;accueil
      </Link>
    </div>
  );
}
