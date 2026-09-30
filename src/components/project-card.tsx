import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Project } from "@/content/projects";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const tags = project.tags ?? project.stack.slice(0, 4);

  return (
    <article
      className={cn(
        "group relative flex flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300",
        "hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5",
        "has-[a:focus-visible]:ring-2 has-[a:focus-visible]:ring-ring",
        featured && "lg:col-span-3 md:p-8"
      )}
    >
      {featured && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-br from-primary/[0.07] via-transparent to-highlight/[0.07]"
        />
      )}
      <div className="relative flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-mono uppercase tracking-wider">{project.category}</span>
        {project.company && (
          <>
            <span aria-hidden="true">·</span>
            <span>{project.company}</span>
          </>
        )}
        {featured && <Badge>Featured</Badge>}
        {project.status && <Badge variant="outline">{project.status}</Badge>}
      </div>
      <h3 className={cn("relative mt-3 font-semibold tracking-tight", featured ? "text-2xl" : "text-lg")}>
        <Link href={`/projects/${project.slug}/`} className="outline-none after:absolute after:inset-0 after:rounded-xl">
          {project.title}
        </Link>
      </h3>
      <p className={cn("relative mt-2 flex-1 text-muted-foreground", featured ? "text-base" : "text-sm")}>
        {project.hook}
      </p>
      <div className="relative mt-5 flex items-end justify-between gap-4">
        <ul className="flex flex-wrap gap-1.5" aria-label="Technologies">
          {tags.map((t) => (
            <li key={t}>
              <Badge variant="secondary">{t}</Badge>
            </li>
          ))}
        </ul>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary"
        />
      </div>
    </article>
  );
}
