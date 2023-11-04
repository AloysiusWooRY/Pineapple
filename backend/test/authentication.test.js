require("dotenv").config({ path: "../.env" });
require("dotenv").config({ path: "./.envtest" });
const chai = require("chai");
const { expect } = chai;
let csrfToken = null;
let cookie = null;
const email = process.env.TEST_USER_EMAIL;
const password = process.env.TEST_USER_PASS;
const dev_secret = process.env.DEV_SECRET;
const organisationId = process.env.TEST_ORGANISATION_1_ID;
const otherPostId = process.env.TEST_EXISTING_POST_1_ID;
let userId = null;

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

describe("Authentication Test where user are not supposed to be able to get a successful response from the server without logging in.", () => {
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
        cookie: Object.values(cookie).join("; "),
      };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully get all organisation information", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/organisation/all",
        {
          method: "POST",
          headers: myHeaders,
        }
      );
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
describe("Authentication Test where user are able api call Admin/Moderator related API's.", () => {
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
      const response = await fetch("http://localhost:4000/api/account/login-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
          body: JSON.stringify({ token: dev_secret }),
        }
      );
      cookieString = response.headers.get("set-cookie");
      cookie = { ...cookie, ...cookieFilter(cookieString) };
      const responseJSON = await response.json();
      userId = responseJSON._id;
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully get all account information", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/account/all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
        }
      );
      expect(response.status).to.equal(401);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully escalates to a moderator", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/account/all",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
          body: JSON.stringify({
            account: userId,
            role: "moderator",
            moderation: [organisationId],
          }),
        }
      );
      expect(response.status).to.equal(401);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully get all data for application", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
        }
      );
      expect(response.status).to.equal(401);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully approve organisation's application", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
        }
      );
      expect(response.status).to.equal(401);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully get all data for organisation's application", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/admin/application",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
        }
      );
      expect(response.status).to.equal(401);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully approve organisation's application", async () => {
    const apiUrl = "http://localhost:4000/api/admin/application";
    const finalUrl = `${apiUrl}/${organisationId}/approve`;
    try {
      const response = await fetch(finalUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
        }
      );
      expect(response.status).to.equal(401);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully reject organisation's application", async () => {
    const apiUrl = "http://localhost:4000/api/admin/application";
    const finalUrl = `${apiUrl}/${organisationId}/reject`;
    try {
      const response = await fetch(finalUrl,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
        }
      );
      expect(response.status).to.equal(401);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully DELETE post where the tester isn't a moderator of", async () => {
    const apiUrl = "http://localhost:4000/api/post";
    const finalUrl = `${apiUrl}/${otherPostId}`;
    try {
      const response = await fetch(finalUrl, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "x-csrf-token": csrfToken,
            cookie: Object.values(cookie).join("; "),
          },
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});