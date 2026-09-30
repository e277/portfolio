import { ArrowRight, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProjectCard } from "@/components/project-card";
import { GitHubIcon, LinkedInIcon } from "@/components/icons";
import { projects } from "@/content/projects";
import { profile } from "@/content/profile";

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-10">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}

export default function HomePage() {
  const [featured, ...rest] = projects;

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden="true" className="bg-grid absolute inset-0" />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-primary/20 blur-3xl dark:bg-primary/15"
        />
        <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-24 sm:px-6 sm:pt-32">
          <Badge variant="outline" className="gap-2 bg-background/60 px-3 py-1 backdrop-blur">
            <span className="size-1.5 rounded-full bg-highlight" aria-hidden="true" />
            {profile.name} · {profile.title}
          </Badge>
          <h1 className="mt-6 max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl">
            I build <span className="text-gradient">reliable backends</span> for messy, real-world data.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-muted-foreground">{profile.positioning}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <a href="#work">
                View case studies <ArrowRight />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="#contact">Get in touch</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Work */}
      <section id="work" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <SectionHeading eyebrow="Selected work" title="Case studies" />
        <div className="grid gap-5 lg:grid-cols-3">
          <ProjectCard project={featured} featured />
          {rest.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="border-y border-border/60 bg-muted/40">
        <div className="mx-auto grid max-w-5xl gap-12 px-4 py-20 sm:px-6 md:grid-cols-5">
          <div className="md:col-span-2">
            <SectionHeading eyebrow="About" title="What I do" />
            <div className="space-y-4 text-muted-foreground">
              {profile.about.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <dl className="grid gap-x-8 gap-y-6 sm:grid-cols-2 md:col-span-3">
            {profile.skills.map((s) => (
              <div key={s.group}>
                <dt className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{s.group}</dt>
                <dd className="mt-3 flex flex-wrap gap-1.5">
                  {s.items.map((i) => (
                    <Badge key={i} variant="outline" className="bg-background text-foreground">
                      {i}
                    </Badge>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">Contact</p>
        <h2 className="mx-auto mt-2 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
          Have an API, platform or data workflow that needs building?
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          I&apos;m open to backend and full-stack roles. The fastest way to reach me is email.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button size="lg" asChild>
            <a href={`mailto:${profile.email}`}>
              <Mail /> Email me
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon /> LinkedIn
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">
              <GitHubIcon /> GitHub
            </a>
          </Button>
        </div>
      </section>
    </>
  );
}
