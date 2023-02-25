import { render, screen } from "@testing-library/react";
import ArcherNumber, { IArcherNumber } from "./ArcherNumber";

describe("ArcherNumber component", () => {
  const defaultProps: IArcherNumber = {
    archerNumber: null,
  };

  it("should render '-' when archerNumber is null", () => {
    render(<ArcherNumber {...defaultProps} />);
    const numberElement = screen.getByText("- 0 -");
    expect(numberElement).toBeInTheDocument();
  });

  it("should render the archer number when it's not null", () => {
    const props: IArcherNumber = {
      archerNumber: "123",
    };
    render(<ArcherNumber {...props} />);
    const numberElement = screen.getByText("123");
    expect(numberElement).toBeInTheDocument();
  });
});
