// Import necessary dependencies for testing
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Banner from "../src/components/Banner"; // Make sure to provide the correct path to your Banner component

// Mock the Heroicons component
jest.mock("@heroicons/react/24/solid", () => {
  return {
    QuestionMarkCircleIcon: () => <svg data-testid="mock-hero-icon" />,
  };
});

// Define a test case
test("Banner component renders correctly", () => {
  // Define props for the Banner component
  const bannerProps = {
    title: "Test Title",
    image: "../assets/home-banner.png",
    button: {
      icon: <QuestionMarkCircleIcon />,
      text: "Test Button",
      onClick: jest.fn(), // You can use jest.fn() to mock a click handler
    },
  };

  // Render the Banner component with the defined props
  render(<Banner {...bannerProps} />);

  // Check if the title is displayed
  const titleElement = screen.getByText("Test Title");
  expect(titleElement).toBeInTheDocument();

  // Check if the image is displayed
  const imageElement = screen.getByRole("img");
  expect(imageElement).toBeInTheDocument();
  expect(imageElement).toHaveAttribute("src", "../assets/home-banner.png");

  // Check if the button is displayed
  const buttonElement = screen.getByText("Test Button");
  expect(buttonElement).toBeInTheDocument();

  // Check if the Heroicon is displayed
  const heroIconElement = screen.getByTestId("mock-hero-icon");
  expect(heroIconElement).toBeInTheDocument();

  // Simulate a button click and test if the onClick function is called
  fireEvent.click(buttonElement);
  expect(bannerProps.button.onClick).toHaveBeenCalled();
});
