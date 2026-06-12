import Link from "next/link";

export function SectionHeading({
  title,
  subtitle,
  href
}: {
  title: string;
  subtitle?: string;
  href?: string;
}) {
  return (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-normal text-slate-950 dark:text-white">{title}</h2>
        {subtitle && <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-300">{subtitle}</p>}
      </div>
      {href && (
        <Link href={href} className="text-sm font-bold text-amazon-teal hover:text-amazon-orange">
          See all
        </Link>
      )}
    </div>
  );
}
