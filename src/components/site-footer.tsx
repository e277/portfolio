import { profile } from "@/content/profile";
import { LogoMark } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:justify-between sm:px-6">
        <p className="flex items-center gap-2">
          <LogoMark className="size-5" />
          <span>
            © {new Date().getFullYear()} {profile.name} · {profile.nickname}
          </span>
        </p>
        <p>Built with Next.js, Tailwind CSS and shadcn/ui.</p>
      </div>
    </footer>
  );
}
