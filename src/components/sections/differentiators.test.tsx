import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { DifferentiatorsSection } from "./differentiators";

describe("DifferentiatorsSection", () => {
  it("renders at least 3 differentiators and no testimonials block when testimonials is empty", () => {
    render(<DifferentiatorsSection testimonials={[]} />);

    expect(
      screen.getByText("Você fala com quem constrói"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Entrega documentada, sem caixa-preta"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Preço fechado por entrega, sem hora extra escondida",
      ),
    ).toBeInTheDocument();
    expect(screen.queryAllByRole("blockquote")).toHaveLength(0);
    expect(
      screen.queryByTestId("testimonials-block"),
    ).not.toBeInTheDocument();
  });

  it("renders the testimonials block when testimonials has at least one item", () => {
    render(
      <DifferentiatorsSection
        testimonials={[
          {
            quote: "A entrega chegou exatamente como combinado.",
            author: "Cliente Exemplo",
            role: "Fundador",
          },
        ]}
      />,
    );

    expect(
      screen.getByText("A entrega chegou exatamente como combinado."),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("blockquote")).toHaveLength(1);
    expect(
      screen.getByText("Você fala com quem constrói"),
    ).toBeInTheDocument();
  });
});
