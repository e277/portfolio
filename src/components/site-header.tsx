import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { GitHubIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { profile } from "@/content/profile";

const links = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/#contact", label: "Contact" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group rounded-md" aria-label={`${profile.nickname} — ${profile.name}, home`}>
          <Logo />
        </Link>
        <div className="flex items-center gap-1">
          <ul className="flex items-center">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="rounded-md px-2.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground sm:px-3"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <Button variant="ghost" size="icon" asChild className="hidden sm:inline-flex">
            <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GitHubIcon />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
