require("dotenv").config({ path: "../.env" });
require("dotenv").config({ path: "./.envtest" });
const chai = require("chai");
const { expect } = chai;
let csrfToken = null;
let cookie = null;
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASS;
const dev_secret = process.env.DEV_SECRET;

const cookieFilter = (cookieString) => {
  const cookies = cookieString
    .split(", ")
    .map((x) => x.substring(0, x.indexOf(";")).trim())
    .filter((y) => !y.endsWith("GMT"));

  const cookieObject = {};

  cookies.forEach((cookie) => {
    const [key, value] = cookie.split("=");
    cookieObject[key] = cookie;
  });

  return cookieObject;
};

describe("To test normal user's update account information details", () => {
  it("Get CSRF Token", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/get-csrf-token", {
        method: "GET",
      });
      expect(response.status).to.equal(200);
      const jsonResponse = await response.json();
      const { csrfToken: tempCsrfToken } = jsonResponse;
      csrfToken = tempCsrfToken;
      cookieString = response.headers.get("set-cookie");
      cookie = { ...cookie, ...cookieFilter(cookieString) };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully Login to Test User Account", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ email, password }),
      });
      cookieString = response.headers.get("set-cookie");
      cookie = { ...cookie, ...cookieFilter(cookieString) };
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully verify OTP validation", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/account/login-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ token: dev_secret }),
      });
      cookieString = response.headers.get("set-cookie");
      cookie = { ...cookie, ...cookieFilter(cookieString) };
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully update password, WeakPassword", async () => {
    try {
      const response = await fetch(
        "http://localhost:4000/api/account/update-password",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
          body: JSON.stringify({ password: "WeakPassword" }),
        }
      );
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully update account, bad email syntax, 😀@gmail.com", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/account/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ name: "test", email: "😀@gmail.com" }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully update account, correct name syntax, Tester", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/account/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ name: "Tester", email }),
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully update account, bad name syntax, <alert>HELLO</alert>", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/account/update", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ name: "<alert>HELLO</alert>", email }),
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});

describe("Login to get Name to check for Name", () => {
  it("Get CSRF Token", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/get-csrf-token", {
        method: "GET",
      });
      expect(response.status).to.equal(200);
      const jsonResponse = await response.json();
      const { csrfToken: tempCsrfToken } = jsonResponse;
      csrfToken = tempCsrfToken;
      cookieString = response.headers.get("set-cookie");
      cookie = { ...cookie, ...cookieFilter(cookieString) };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully Login to Test User Account", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/account/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ email, password }),
      });
      cookieString = response.headers.get("set-cookie");
      cookie = { ...cookie, ...cookieFilter(cookieString) };
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully checks if the name given by server is equal to our bad syntax, expects to be different and sanitised", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/account/login-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ token: dev_secret }),
      });
      cookieString = response.headers.get("set-cookie");
      cookie = { ...cookie, ...cookieFilter(cookieString) };
      const jsonResponse = await response.json();
      expect(jsonResponse["name"]).to.not.equal("<alert>HELLO</alert>");
    } catch (error) {
      throw new Error(`Input field for name is not sanitized: ${error.message}`
      );
    }
  });
  
});
describe("To test normal user's update Payment Info", () => {
  const apiUrl = "http://localhost:4000/api/account/payment-info";
  it("Successful Get payment info", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
      });
      const jsonResponse = await response.json();
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, cardNumber with invalid length of 15", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ cardNumber: "411111111111111", expirationDate: "23/24", cvc: "123"}),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, cardNumber with invalid length of 17", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ cardNumber: "41111111111111111", expirationDate: "23/24", cvc: "123"}),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, Date with invalid month of 13", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ cardNumber: "4111111111111111", expirationDate: "13/24", cvc: "123"}),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, Date with invalid month of 00", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ cardNumber: "4111111111111111", expirationDate: "00/24", cvc: "123"}),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, Date with invalid year thats in the past of 22", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ cardNumber: "4111111111111111", expirationDate: "12/22", cvc: "123"}),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});