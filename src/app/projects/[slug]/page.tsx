import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons";
import { getProject, projects } from "@/content/projects";
import { asset } from "@/lib/utils";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  return project ? { title: project.title, description: project.hook } : {};
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="border-t border-border/60 py-10">
      <h2 id={`${id}-title`} className="mb-5 text-xl font-semibold tracking-tight">
        {title}
      </h2>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-muted-foreground">
          <span aria-hidden="true" className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(index + 1) % projects.length];

  const toc = [
    ["context", "Context"],
    ["role", "Role"],
    project.architecture && ["architecture", "Architecture"],
    project.decisions && ["decisions", "Key decisions"],
    project.challenges && ["challenges", "Challenges"],
    project.approach && ["approach", "Approach"],
    project.hardParts && ["hard-parts", "The hard part"],
    project.implementation && ["implementation", "Implementation"],
    project.testing && ["testing", "Testing"],
    project.operations && ["operations", "Deployment & ops"],
    (project.metrics || project.outcomes) && ["outcomes", "Outcomes"],
    project.retrospective && ["retrospective", "What I'd change"],
  ].filter(Boolean) as [string, string][];

  return (
    <article className="mx-auto max-w-5xl px-4 sm:px-6">
      <div className="pt-10">
        <Button variant="ghost" size="sm" asChild className="-ml-3 text-muted-foreground">
          <Link href="/#work">
            <ArrowLeft /> All case studies
          </Link>
        </Button>
      </div>

      {/* Header */}
      <header className="pb-10 pt-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span className="font-mono uppercase tracking-wider text-primary">{project.category}</span>
          {project.company && (
            <>
              <span aria-hidden="true">·</span>
              <span>{project.company}</span>
            </>
          )}
          {project.status && <Badge variant="outline">{project.status}</Badge>}
        </div>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{project.title}</h1>
        <p className="mt-5 max-w-3xl text-lg leading-relaxed text-muted-foreground sm:text-xl">{project.hook}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
            {project.stack.map((t) => (
              <li key={t}>
                <Badge variant="secondary">{t}</Badge>
              </li>
            ))}
          </ul>
          {project.repo && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.repo} target="_blank" rel="noopener noreferrer">
                <GitHubIcon /> View source
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Headline numbers */}
      {project.metrics && (
        <div className="mb-10">
          <dl className="grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {project.metrics.items.map((m) => (
              <div key={m.label} className="bg-card p-5">
                <dt className="text-sm text-muted-foreground">{m.label}</dt>
                <dd className="mt-1 text-3xl font-semibold tracking-tight">{m.value}</dd>
                {m.note && <dd className="mt-2 text-xs leading-relaxed text-muted-foreground">{m.note}</dd>}
              </div>
            ))}
          </dl>
          <p className="mt-2 text-xs text-muted-foreground">{project.metrics.title}</p>
        </div>
      )}

      <div className="grid gap-10 lg:grid-cols-[1fr_12rem]">
        <div className="min-w-0 pb-16">
          <Section id="context" title="Context">
            <p className="leading-relaxed text-muted-foreground">{project.context}</p>
          </Section>

          <Section id="role" title="My role & ownership">
            <p className="leading-relaxed text-muted-foreground">{project.role}</p>
          </Section>

          {project.architecture && (
            <Section id="architecture" title="Architecture">
              <Bullets items={project.architecture.summary} />
              {project.architecture.diagrams?.map((d) => (
                <figure key={d.src} className="mt-8">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(d.src)}
                    alt={d.alt}
                    loading="lazy"
                    className="mx-auto max-h-[40rem] w-auto max-w-full rounded-xl border border-border bg-white"
                  />
                  {d.caption && (
                    <figcaption className="mt-2 text-center text-sm text-muted-foreground">{d.caption}</figcaption>
                  )}
                </figure>
              ))}
            </Section>
          )}

          {project.decisions && (
            <Section id="decisions" title="Key decisions & trade-offs">
              <div className="space-y-4">
                {project.decisions.map((d) => (
                  <div key={d.title} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="font-medium">{d.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d.why}</p>
                    {d.rejected && (
                      <p className="mt-3 text-sm leading-relaxed">
                        <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
                          Rejected ·{" "}
                        </span>
                        <span className="text-muted-foreground">{d.rejected}</span>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </Section>
          )}

          {project.challenges && (
            <Section id="challenges" title="Challenges">
              <Bullets items={project.challenges} />
            </Section>
          )}

          {project.approach && (
            <Section id="approach" title="Approach">
              <Bullets items={project.approach} />
            </Section>
          )}

          {project.hardParts && (
            <Section id="hard-parts" title="The hard part">
              <div className="space-y-6">
                {project.hardParts.map((h) => (
                  <div key={h.title} className="border-l-2 border-highlight pl-5">
                    <h3 className="font-medium">{h.title}</h3>
                    <p className="mt-2 leading-relaxed text-muted-foreground">{h.body}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {project.implementation && (
            <Section id="implementation" title="Implementation details">
              <div className="grid gap-4 sm:grid-cols-2">
                {project.implementation.map((i) => (
                  <div key={i.title} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="font-medium">{i.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.body}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {project.testing && (
            <Section id="testing" title="Testing & quality">
              <Bullets items={project.testing} />
            </Section>
          )}

          {project.operations && (
            <Section id="operations" title="Deployment & operations">
              <Bullets items={project.operations} />
            </Section>
          )}

          {project.outcomes && (
            <Section id="outcomes" title={project.status ? "Expected impact" : "Outcomes"}>
              <Bullets items={project.outcomes} />
            </Section>
          )}
          {!project.outcomes && project.metrics && (
            <Section id="outcomes" title="Outcomes">
              <p className="leading-relaxed text-muted-foreground">
                The headline figures above are computed live from public data on every fetch — not estimates or
                projections.
              </p>
            </Section>
          )}

          {project.retrospective && (
            <Section id="retrospective" title="What I'd do differently">
              <Bullets items={project.retrospective} />
            </Section>
          )}

          <Link
            href={`/projects/${next.slug}/`}
            className="group mt-6 flex items-center justify-between rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/40"
          >
            <div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Next case study</p>
              <p className="mt-1 font-medium">{next.title}</p>
            </div>
            <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        </div>

        {/* Section nav */}
        <nav aria-label="On this page" className="hidden lg:block">
          <div className="sticky top-24 border-l border-border pl-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">On this page</p>
            <ul className="space-y-2 text-sm">
              {toc.map(([id, label]) => (
                <li key={id}>
                  <a href={`#${id}`} className="text-muted-foreground transition-colors hover:text-foreground">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </article>
  );
}
