import { render, screen } from "@testing-library/react";
import Footer from "./Footer";

describe("Footer component", () => {
  it("should display the Helmen Design text", () => {
    render(<Footer />);
    const helmenDesignText = screen.getByText(/Helmen Design/);
    expect(helmenDesignText).toBeInTheDocument();
  });

  it("should display the Arctic Buesport logo", () => {
    render(<Footer />);
    const arcticBueLogo = screen.getByAltText(/Arctic Buesport AS Logo/);
    expect(arcticBueLogo).toBeInTheDocument();
  });

  it("should have a link to Arctic Buesport's website", () => {
    render(<Footer />);
    const arcticBueLink = screen.getByTitle(/Gå til Arctic Buesport/);
    expect(arcticBueLink).toHaveAttribute("href", "https://arcticbuesport.no/");
    expect(arcticBueLink).toHaveAttribute("target", "_blank");
    expect(arcticBueLink).toHaveAttribute("rel", "noreferrer");
  });
});
