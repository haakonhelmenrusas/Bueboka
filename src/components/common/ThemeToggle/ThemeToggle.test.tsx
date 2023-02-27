import { fireEvent, render } from "@testing-library/react";
import ThemeToggle, { ThemeToggleProps } from "./ThemeToggle";

describe("ThemeToggle component", () => {
  const mockToggleColorScheme = jest.fn();
  const darkProps: ThemeToggleProps = {
    colorScheme: "dark",
    toggleColorScheme: mockToggleColorScheme,
  };
  const lightProps: ThemeToggleProps = {
    colorScheme: "light",
    toggleColorScheme: mockToggleColorScheme,
  };

  it("should render a Sun icon for the light theme", () => {
    const { getByTestId } = render(<ThemeToggle {...darkProps} />);
    const sunIcon = getByTestId("sun-icon");
    expect(sunIcon).toBeInTheDocument();
  });

  it("should render a Moon and Stars icon for the dark theme", () => {
    const { getByTestId } = render(<ThemeToggle {...lightProps} />);
    const moonStarsIcon = getByTestId("moon-stars-icon");
    expect(moonStarsIcon).toBeInTheDocument();
  });

  it("should call the toggleColorScheme function when clicked", () => {
    const { getByTestId } = render(<ThemeToggle {...lightProps} />);
    const actionIcon = getByTestId("action-icon");
    fireEvent.click(actionIcon);
    expect(mockToggleColorScheme).toHaveBeenCalledTimes(1);
  });
});
