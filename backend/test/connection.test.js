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

describe("Connetion Test where user are not supposed to be able to get a successful response from the server without logging in.", () => {
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
    it("Unsuccessfully get targeted organisation's posts, name 'test123'", async () => {
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
    it("Unsuccessfully get targeted organisation's comments, Content 'Nice'", async () => {
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