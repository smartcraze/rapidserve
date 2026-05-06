import Image from "next/image";
import Link from "next/link";

const footerLinks = [
  { href: "#features", label: "Features" },
  { href: "#workflow", label: "Workflow" },
  { href: "/deploy", label: "Console" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background py-8">
      <div className="container mx-auto flex flex-col items-start justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Image
            src="/rapidserve-cicon.png"
            alt="RapidServe"
            width={18}
            height={18}
            className="size-[18px] object-contain"
          />
          <p>&copy; 2024 RapidServe. Built for deployment flow clarity.</p>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
