import { techStack } from "@/content/techStack";

export function TechStrip() {
  return (
    <section className="border-y border-border/60 bg-muted px-4 py-6">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-8 gap-y-3">
        {techStack.map((tech) => (
          <span
            key={tech.name}
            title={tech.name}
            className="font-mono text-sm text-muted-foreground"
          >
            {tech.label}
          </span>
        ))}
      </div>
    </section>
  );
}
