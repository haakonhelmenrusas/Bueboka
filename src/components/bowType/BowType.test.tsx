import { render, screen } from "@testing-library/react";
import BowType, { BowTypeProps } from "./BowType";

describe("BowType component", () => {
  const defaultProps: BowTypeProps = {
    bowType: null,
  };

  it("should display 'Ingen bue lagret' when bowType is null", () => {
    render(<BowType {...defaultProps} />);
    const noBowMessage = screen.getByText("Ingen bue lagret");
    expect(noBowMessage).toBeInTheDocument();
  });

  it("should display the bow type when bowType is not null", () => {
    const props: BowTypeProps = {
      bowType: "Compound",
    };
    render(<BowType {...props} />);
    const bowTypeMessage = screen.getByText("Compound");
    expect(bowTypeMessage).toBeInTheDocument();
  });

  it("should display a bow icon when bowType is not null", () => {
    const props: BowTypeProps = {
      bowType: "Recurve",
    };
    render(<BowType {...props} />);
    const bowIcon = screen.getByTestId("bow-icon");
    expect(bowIcon).toBeInTheDocument();
  });
});
