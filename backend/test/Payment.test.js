require("dotenv").config({ path: "../.env" });
const chai = require("chai");
const { expect } = chai;
let csrfToken = null;
let cookie = null;

const cookieFilter = (cookieString) => {
  const cookies = cookieString
    .split(", ")
    .map((x) => x.substring(0, x.indexOf(";")).trim())
    .filter((y) => !y.endsWith("GMT") );

  const cookieObject = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookieObject[key] = cookie;
  });

  return cookieObject;
};

describe("Connection Test", () => {
  it("Ping Test", async () => {
    const apiUrl = "http://localhost:4000/api/ping";
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      // Handle any errors (e.g., network issues, request failure)
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Get CSRF Token", async () => {
    const apiUrl = "http://localhost:4000/api/get-csrf-token";
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
      });
      expect(response.status).to.equal(200);
      const jsonResponse = await response.json();
      const { csrfToken: tempCsrfToken } = jsonResponse;
      csrfToken = tempCsrfToken;
      cookieString = response.headers.get("set-cookie");
      cookie = {...cookie, ...cookieFilter(cookieString)};
    } catch (error) {
      // Handle any errors (e.g., network issues, request failure)
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});
describe("Login Test", () => {
  it("Successful login", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/login";
    const email = process.env.ADMIN_USER;
    const password = process.env.ADMIN_PASS;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ email, password }),
      });
      // Add additional assertions for a successful login if needed
      cookieString = response.headers.get("set-cookie");
      cookie = {...cookie, ...cookieFilter(cookieString)};
      // Assert that the response status code is 200 (OK) for a successful login
      expect(response.status).to.equal(200);
    } catch (error) {
      // Handle any errors (e.g., network issues, request failure)
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});

describe("Payment Test", () => {
  it("Successful Get payment info", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
      });
      const jsonResponse = await response.json();
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });

  it("Unsuccessful Change payment info, cardNumber with invalid length of 15", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "411111111111111";
    const expirationDate = "23/24";
    const cvc = "123";
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ cardNumber, expirationDate, cvc }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
    });

it("Unsuccessful Change payment info, cardNumber with invalid length of 17", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "41111111111111111";
    const expirationDate = "23/24";
    const cvc = "123";
    try {
        const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ cardNumber, expirationDate, cvc }),
        });
        expect(response.status).to.equal(400);
    } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
    }
    });
        
  it("Unsuccessful Change payment info, Date with invalid month of 13", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "4111111111111111";
    const expirationDate = "13/24";
    const cvc = "123";
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ cardNumber, expirationDate, cvc }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });

  it("Unsuccessful Change payment info, Date with invalid month of 00", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "4111111111111111";
    const expirationDate = "00/24";
    const cvc = "123";
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ cardNumber, expirationDate, cvc }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });

  it("Unsuccessful Change payment info, Date with invalid year thats in the past of 22", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "4111111111111111";
    const expirationDate = "12/22";
    const cvc = "123";
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ cardNumber, expirationDate, cvc }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });

  it("Unsuccessful Change payment info, CVC with One Digit", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "4111111111111111";
    const expirationDate = "12/24";
    const cvc = "1";
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ cardNumber, expirationDate, cvc }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });

  it("Unsuccessful Change payment info, CVC with Two Digit", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "4111111111111111";
    const expirationDate = "12/24";
    const cvc = "12";
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ cardNumber, expirationDate, cvc }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });

  it("Unsuccessful Change payment info, CVC with more than Five Digit", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "4111111111111111";
    const expirationDate = "12/24";
    const cvc = "12345";
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ cardNumber, expirationDate, cvc }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });

  it("Unsuccessful Change payment info, CVC with emojis", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "4111111111111111";
    const expirationDate = "12/24";
    const cvc = "😀😀😀";
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
        body: JSON.stringify({ cardNumber, expirationDate, cvc }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });

  it("Successful Change payment info, cardNumber length - 6, expirationDate - 23/24, cvc - 112", async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = "http://localhost:4000/api/account/payment-info";
    const cardNumber = "4111111111111111";
    const expirationDate = "12/24";
    const cvc = "123";
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join('; '),
        },
              body: JSON.stringify({ cardNumber, expirationDate, cvc }),
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});
