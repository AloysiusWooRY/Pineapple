const chai = require("chai");
const { expect } = chai;

describe("Connection Test for smtp, gmail", () => {
    it("Successfully send Reset PW Email", async () => {
    const email = "vatilod807@hondabbs.com"; // https://temp-mail.org/en/
    const apiUrl = `http://localhost:4000/api/email?email=${encodeURIComponent(email)}`;
       try {
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        expect(response.status).to.equal(200);
      } catch (error) {
        throw new Error(`HTTP request failed: ${error.message}`);
      }
    });
});