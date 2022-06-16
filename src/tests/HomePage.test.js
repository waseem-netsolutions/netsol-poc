import { render, screen } from "@testing-library/react";
import React from "react";
import HomePage from "../pages/HomePage";
import { useAuth } from "../contexts/AuthContext";

jest.mock("../contexts/AuthContext.js");

describe("HomePage", () => {
  it("When not logged in , please login should be shown", () => {
    //*Arrange
    useAuth.mockReturnValue({
      currentUser: null,
      logout: jest.fn()
    })

    //*Act
    render(<HomePage/>)
    const text = screen.queryByText("Please, login").innerHTML;

    //Assertion
    expect(text).toBe("Please, login")
  });


  it("When user is logged in , show Welcome, (useremail)", () => {
    //*Arrange
    useAuth.mockReturnValue({
      currentUser: {
        email: "test@gmail.com"
      },
      logout: jest.fn()
    })

    //*Act
    render(<HomePage/>)
    const text = screen.queryByText("Welcome, test@gmail.com").innerHTML;

    //Assertion
    expect(text).toBe("Welcome, test@gmail.com");
  });
})