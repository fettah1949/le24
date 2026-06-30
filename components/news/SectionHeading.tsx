import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeading({ title, subtitle, className }: SectionHeadingProps) {
  return (
    <div className={cn("mb-6", className)}>
      <h2 className="text-2xl font-bold text-news-text">{title}</h2>
      {subtitle && (
        <p className="mt-1 text-sm text-news-muted">{subtitle}</p>
      )}
      <div className="mt-3 h-1 w-16 rounded bg-brand-600" />
    </div>
  );
}
