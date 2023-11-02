require("dotenv").config({ path: "../.env" });
require("dotenv").config({ path: "./.envtest" });
const chai = require("chai");
const moment = require("moment");
const { expect } = chai;
let csrfToken = null;
let cookie = null;
const email = process.env.TEST_MOD_EMAIL;
const password = process.env.TEST_MOD_PASS;
const dev_secret = process.env.DEV_SECRET;
let organisationId = process.env.TEST_ORGANISATION_1_ID;
let postId = null;
let commentId = null;
let replyId = null;

let longContent2050 = "";
for (let i = 0; i < 2050; i++) {
  longContent2050 += "A";
}
let longContent260 = "";
for (let i = 0; i < 260; i++) {
  longContent260 += "A";
}
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

describe("Connection Test", () => {
  it("Successfully Get CSRF Token", async () => {
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
      const response = await fetch(
        "http://localhost:4000/api/account/login-otp",
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
      myHeader = {
        "Content-Type": "application/json",
        "x-csrf-token": csrfToken,
        cookie: Object.values(cookie).join("; "),
      };
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully get targeted organisation for testing", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/post/all", {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify({
          organisation: organisationId,
        }),
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});

describe("Post Test on specified test organisation, name '3103 Crisis Fund'", () => {
  var formdata = new FormData();
  formdata.append("title", "test CreatePost");
  formdata.append("description", "test Description");
  formdata.append("organisation", organisationId);
  formdata.append("event", "false");
  formdata.append("event_location", "here");
  formdata.append("event_capacity", "5");
  formdata.append(
    "event_time",
    moment().add(100, "years").format("YYYY-MM-DDTHH:mm")
  );
  formdata.append("donation", "true");
  formdata.append("donation_goal", "1000");

  it("Unuccessfully CREATE post,Title, more than 256 characters long", async () => {
    formdata.set("title", longContent260);
    try {
      const response = await fetch("http://localhost:4000/api/post/new", {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: formdata,
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
    formdata.set("title", "testCreatePost");
  });
  it("Unuccessfully CREATE post, Description, more than 2048 characters long", async () => {
    formdata.set("description", longContent2050);
    try {
      const response = await fetch("http://localhost:4000/api/post/new", {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: formdata,
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
    formdata.set("description", "testDescription");
  });
  it("Unuccessfully CREATE post, A post cannot be both event and donation", async () => {
    formdata.set("event", "true");
    try {
      const response = await fetch("http://localhost:4000/api/post/new", {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: formdata,
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
    formdata.set("event", "false");
  });
  it("Successfully CREATE post", async () => {
    const apiUrl = "http://localhost:4000/api/post/new";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: formdata,
      });
      const responseJSON = await response.json();
      postId = responseJSON.post._id;
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully LIKE post", async () => {
    const apiUrl = "http://localhost:4000/api/post";
    const finalUrl = `${apiUrl}/${postId}/like`;
    try {
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully DISLIKE post", async () => {
    const apiUrl = "http://localhost:4000/api/post";
    const finalUrl = `${apiUrl}/${postId}/dislike`;
    try {
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});
describe("Donation Test, it tests /api/transatction/new", () => {
  apiUrl = "http://localhost:4000/api/transaction/new";
  it("Unsuccessful Change payment info, CVC with One Digit", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify({ post: postId, amount: "1", cvc: "1" }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, CVC with Two Digit", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify({ post: postId, amount: "1", cvc: "12" }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, CVC with more than Five Digit", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify({ post: postId, amount: "1", cvc: "12345" }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, CVC with emojis", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify({ post: postId, amount: "1", cvc: "😀😀😀" }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, amount with emojis", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify({ post: postId, amount: "😀😀😀", cvc: "123" }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, amount is negative", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify({ post: postId, amount: "-1", cvc: "123" }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessful Change payment info, amount with 3 decimal place", async () => {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: myHeader,
        body: JSON.stringify({ post: postId, amount: "1.111", cvc: "123" }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});

describe("Comment Test on the earlier created Post", () => {
  it("Unsuccessfully CREATE comment, more than 2048 characters long", async () => {
    const apiUrl = "http://localhost:4000/api/comment/new";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ post: postId, content: longContent2050 }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully CREATE comment", async () => {
    const apiUrl = "http://localhost:4000/api/comment/new";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ post: postId, content: "Testing Content" }),
      });
      const responseJSON = await response.json();
      commentId = responseJSON.comment._id;
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully LIKE comment", async () => {
    const apiUrl = "http://localhost:4000/api/comment";
    const finalUrl = `${apiUrl}/${commentId}/like`;
    try {
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully DISLIKE comment", async () => {
    const apiUrl = "http://localhost:4000/api/comment";
    const finalUrl = `${apiUrl}/${commentId}/dislike`;
    try {
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unsuccessfully CREATE reply, more than 2048 characters long", async () => {
    const apiUrl = "http://localhost:4000/api/reply/new";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ comment: commentId, content: longContent2050 }),
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully CREATE reply", async () => {
    const apiUrl = "http://localhost:4000/api/reply/new";
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({ comment: commentId, content: "Testing Reply" }),
      });
      const responseJSON = await response.json();
      replyId = responseJSON.reply._id;
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully LIKE reply", async () => {
    const apiUrl = "http://localhost:4000/api/reply";
    const finalUrl = `${apiUrl}/${replyId}/like`;
    try {
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully DISLIKE reply", async () => {
    const apiUrl = "http://localhost:4000/api/reply";
    const finalUrl = `${apiUrl}/${replyId}/dislike`;
    try {
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});

describe("Cleanup, delete Reply,Comment,Post", () => {
  it("Successfully DELETE reply", async () => {
    const apiUrl = "http://localhost:4000/api/reply";
    const finalUrl = `${apiUrl}/${replyId}`;
    try {
      const response = await fetch(finalUrl, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully DELETE comment", async () => {
    const apiUrl = "http://localhost:4000/api/comment";
    const finalUrl = `${apiUrl}/${commentId}`;
    try {
      const response = await fetch(finalUrl, {
        method: "DELETE",
        headers: {
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Successfully DELETE post", async () => {
    const apiUrl = "http://localhost:4000/api/post";
    const finalUrl = `${apiUrl}/${postId}`;
    try {
      const response = await fetch(finalUrl, {
        method: "DELETE",
        headers: myHeader,
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});

describe("Test if user is able to delete a post that does not belong to user", () => {
  it("Unsuccessfully DELETE post that does not belong to test user", async () => {
    const apiUrl = "http://localhost:4000/api/post";
    const otherPostId = process.env.TEST_EXISTING_POST_1_ID;
    const finalUrl = `${apiUrl}/${otherPostId}`;
    try {
      const response = await fetch(finalUrl, {
        method: "DELETE",
        headers: myHeader,
      });
      expect(response.status).to.equal(400);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});
