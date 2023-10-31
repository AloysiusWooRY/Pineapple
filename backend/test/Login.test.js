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
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});

describe("Login Test, Successful login", () => {
  it("Exiting Credentials", async () => {
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
      cookieString = response.headers.get("set-cookie");
      cookie = {...cookie, ...cookieFilter(cookieString)};
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});

describe("Login Test, Action Rate Limit (20). Flood the login request 19 times with wrong credentials, 20th to meet with a response of Too many Requests. (1st Login request was used to test for Successful Login)", () => {
  const apiUrl = "http://localhost:4000/api/account/login";

  for (let i = 1; i <= 20; i++) {
    let email;
    let password;

    if (i <= 20) {
      email = "wrongemail";
      password = "wrongpassword";
    } else {
      email = process.env.ADMIN_USER;
      password = process.env.ADMIN_PASS;
    }

    it(`Login attempt #${i}`, async () => {
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

        if (i <= 19) {
          expect(response.status).to.equal(400);
        } else {
          expect(response.status).to.equal(429);
        }
      } catch (error) {
        // Handle any errors (e.g., network issues, request failure)
        throw new Error(`HTTP request failed: ${error.message}`);
      }
    });
  }
});