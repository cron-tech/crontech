import { painPoints } from "@/content/pain";

export function PainSection() {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-xl text-3xl sm:text-4xl">
          O problema não é falta de gente. É falta de entrega.
        </h2>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {painPoints.map((pain) => (
            <div key={pain.title} className="border-t-2 border-primary pt-4">
              <h3 className="font-heading text-xl">{pain.title}</h3>
              <p className="mt-2 text-muted-foreground">{pain.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
