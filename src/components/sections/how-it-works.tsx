import { howItWorksSteps } from "@/content/howItWorks";

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="px-4 py-24">
      <div className="mx-auto max-w-3xl">
        <h2 className="max-w-xl text-3xl sm:text-4xl">Como funciona</h2>

        <ol className="mt-12 space-y-8">
          {howItWorksSteps.map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="font-mono text-sm text-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-heading text-xl">{step.title}</h3>
                <p className="mt-1 text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
