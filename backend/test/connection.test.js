require("dotenv").config({ path: "../.env" });
require("dotenv").config({ path: "./.envtest" });
const chai = require("chai");
const { expect } = chai;
let csrfToken = null;
let cookie = null;
const aEmail = process.env.TEST_ADMIN_EMAIL;
const aPassword = process.env.TEST_ADMIN_PASS;
const dev_secret = process.env.DEV_SECRET;
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

describe("Connection Test where user are not supposed to be able to get a successful response from the server without logging in.", () => {
    it("Successfully Ping the server", async () => {
        try {
          const response = await fetch("http://localhost:4000/api/ping", {
            method: "GET",
          });
          expect(response.status).to.equal(200);
        } catch (error) {
          throw new Error(`HTTP request failed: ${error.message}`);
        }
      });
    it("Successfully GET CSRF Token", async () => {
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
        myHeaders = {
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join('; '),
          };
      } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
      }
    });
    it("Unsuccessfully get all organisation information", async () => {
        try {
        const response = await fetch("http://localhost:4000/api/organisation/all", {
            method: "POST",
            headers: myHeaders
        });
        expect(response.status).to.equal(401);
        } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
        }
    });
    it("Unsuccessfully get targeted organisation's posts", async () => {
        try {
        const response = await fetch("http://localhost:4000/api/post/all", {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                organisation: process.env.TEST_ORGANISATION_1_ID,
              }),
        });
        expect(response.status).to.equal(401);
        } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
        }
    });
    it("Unsuccessfully get targeted organisation's comments", async () => {
        try {
        const response = await fetch("http://localhost:4000/api/comment/all", {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({
                post: process.env.TEST_COMMENT_1_ID,
              }),
        });
        expect(response.status).to.equal(401);
        } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
        }
    });
  });
describe("Action Rate Limit (20). Flood the login request 20 times with wrong credentials, 21th to meet with a response of Too many Requests.", () => {
  for (let i = 1; i <= 21; i++) {
    let email;
    let password;
    if (i <= 20) {
      email = "wrongemail";
      password = "wrongpassword";
    } else {
      email = process.env.TEST_USER_EMAIL;
      password = process.env.TEST_USER_PASS;
    }
    it(`Login attempt #${i}, check if Session timeout error will be thrown at the last attempt`, async () => {
      try {
        const response = await fetch("http://localhost:4000/api/account/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join('; '),
          },
          body: JSON.stringify({ email, password }),
        });

        if (i <= 20) {
          expect(response.status).to.equal(400);
        } else {
          expect(response.status).to.equal(429);
        }
      } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
      }
    });
  }
});