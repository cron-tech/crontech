export interface TechStackItem {
  name: string;
  /** Short mono-style tag shown in the tech strip (terminal motif). */
  label: string;
}

export const techStack: TechStackItem[] = [
  { name: "Next.js", label: "next" },
  { name: "TypeScript", label: "ts" },
  { name: "React", label: "react" },
  { name: "Tailwind CSS", label: "tailwind" },
  { name: "shadcn/ui", label: "shadcn/ui" },
];
