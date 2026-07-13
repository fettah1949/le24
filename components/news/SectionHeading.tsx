import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-4 sm:mb-6", className)}>
      <h2 className="text-xl font-bold text-news-text sm:text-2xl">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-news-muted">{subtitle}</p>
      )}
      <div className="mt-2 h-1 w-12 rounded bg-brand-600 sm:mt-3 sm:w-16" />
    </div>
  );
}
