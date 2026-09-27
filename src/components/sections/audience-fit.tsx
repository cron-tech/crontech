import { fitFor, notFitFor } from "@/content/audienceFit";

export function AudienceFitSection() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2">
        <div className="rounded-sm bg-card p-6">
          <h2 className="font-heading text-2xl">Pra quem é</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {fitFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-sm border border-border/60 p-6">
          <h2 className="font-heading text-2xl">Pra quem não é</h2>
          <ul className="mt-4 space-y-3 text-muted-foreground">
            {notFitFor.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
