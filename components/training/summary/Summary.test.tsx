import React from "react";
import { render } from "@testing-library/react-native";
import Summary from "./Summary";
import { sumArrows } from "../helpers/sumArrows";
import { Training } from "@/types";

// Mock sumArrows
jest.mock("../helpers/sumArrows");
const mockedSumArrows = sumArrows as jest.MockedFunction<typeof sumArrows>;

const mockTrainings: Training[] = [
    { id: 1, arrows: 10, date: new Date("2024-06-01") } as Training,
    { id: 2, arrows: 20, date: new Date("2024-06-02") } as Training,
];

describe("Summary", () => {
    beforeEach(() => {
        mockedSumArrows.mockReset();
    });

    it("renders the title", () => {
        mockedSumArrows.mockReturnValue(0);
        const { getByText } = render(<Summary trainings={mockTrainings} />);
        expect(getByText("Oppsummering")).toBeTruthy();
    });

    it("calls sumArrows with '7days' and displays the result", () => {
        mockedSumArrows.mockImplementation((trainings, period) => {
            if (period === "7days") return 15;
            return 0;
        });
        const { getByText } = render(<Summary trainings={mockTrainings} />);
        expect(getByText(/Siste 7 dagene: 15/)).toBeTruthy();
        expect(mockedSumArrows).toHaveBeenCalledWith(mockTrainings, "7days");
    });

    it("calls sumArrows with 'month' and displays the result", () => {
        mockedSumArrows.mockImplementation((trainings, period) => {
            if (period === "month") return 25;
            return 0;
        });
        const { getByText } = render(<Summary trainings={mockTrainings} />);
        expect(getByText(/Denne måneden: 25/)).toBeTruthy();
        expect(mockedSumArrows).toHaveBeenCalledWith(mockTrainings, "month");
    });

    it("calls sumArrows with no period for total and displays the result", () => {
        mockedSumArrows.mockImplementation((trainings, period) => {
            if (!period) return 30;
            return 0;
        });
        const { getByText } = render(<Summary trainings={mockTrainings} />);
        expect(getByText(/Totalt: 30/)).toBeTruthy();
        expect(mockedSumArrows).toHaveBeenCalledWith(mockTrainings);
    });

    it("renders correctly with empty trainings", () => {
        mockedSumArrows.mockReturnValue(0);
        const { getByText } = render(<Summary trainings={[]} />);
        expect(getByText(/Siste 7 dagene: 0/)).toBeTruthy();
        expect(getByText(/Denne måneden: 0/)).toBeTruthy();
        expect(getByText(/Totalt: 0/)).toBeTruthy();
    });
});

