import Link from "next/link";
import { getSiteName } from "@/lib/utils";
import { localizedPath } from "@/lib/i18n/paths";
import { NewsletterForm } from "./NewsletterForm";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/types";

interface FooterProps {
  locale: Locale;
  dict: Dictionary;
}

export function Footer({ locale, dict }: FooterProps) {
  const siteName = getSiteName();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-16 border-t border-news-border bg-news-text text-white">
      <div className="container-main py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="text-xl font-bold">
              <span className="font-semibold text-white/90">Le</span>24
            </h3>
            <p className="mt-2 text-sm text-white/70">{dict.footer.description}</p>
          </div>

          <div>
            <h4 className="font-semibold">{dict.footer.usefulLinks}</h4>
            <ul className="mt-3 space-y-2 text-sm text-white/70">
              <li>
                <Link href={localizedPath(locale, "/about")} className="hover:text-white transition-colors">
                  {dict.nav.about}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, "/contact")} className="hover:text-white transition-colors">
                  {dict.nav.contact}
                </Link>
              </li>
              <li>
                <Link href={localizedPath(locale, "/privacy")} className="hover:text-white transition-colors">
                  {dict.nav.privacy}
                </Link>
              </li>
            </ul>
          </div>

          <NewsletterForm />
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/50">
          © {year} {siteName}. {dict.footer.rights}
        </div>
      </div>
    </footer>
  );
}
