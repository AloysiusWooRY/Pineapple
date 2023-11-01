require("dotenv").config({ path: "../.env" });
const chai = require("chai");
const { expect } = chai;
let csrfToken = null;
let cookie = null;
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASS;

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

describe("To test normal user's related functionality", () => {
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
  it("Checks if input has been sanitized with bad name syntax", async () => {
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
      expect(response.status).to.equal(200);
      const jsonResponse = await response.json();
      expect(jsonResponse["name"]).to.not.equal("<alert>HELLO</alert>");
    } catch (error) {
      throw new Error(
        `Input field for name is not sanitized: ${error.message}`
      );
    }
  });
});
