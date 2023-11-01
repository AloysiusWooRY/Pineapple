require("dotenv").config({ path: "../.env" });
const chai = require("chai");
const moment = require("moment");
const fs = require('fs');
const { expect } = chai;
let csrfToken = null;
let cookie = null;
let postId = null;
let commentId = null;
let replyId = null;

let longContent = "";
for (let i = 0; i < 2050; i++) {
  longContent += "A";
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
      cookie = { ...cookie, ...cookieFilter(cookieString) };
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});

describe("Successful login with test account", () => {
  it("Test Account Credentials", async () => {
    const apiUrl = "http://localhost:4000/api/account/login";
    const email = process.env.TEST_USER;
    const password = process.env.TEST_PASS;
    try {
      const response = await fetch(apiUrl, {
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
});
// it("Unsuccessfully create post onto organisation that has yet to approve", async () => {

describe("Post Test on specified test organisation, name 'test123', id '653be73543f648ef8e7c17ae'", () => {
  var formdata = new FormData();
  formdata.append("title", "testCreatePost");
  formdata.append("description", "testDescription");
  formdata.append("organisation", "653be73543f648ef8e7c17ae");
  formdata.append("event", "true");
  formdata.append("event_location", "here");
  formdata.append("event_capacity", "5");
  formdata.append("event_time",moment().add(100, "years").format("YYYY-MM-DDTHH:mm"));
  formdata.append("donation", "false");
  formdata.append("donation_goal", "1000");
  const organisation = "653be73543f648ef8e7c17ae";
  it("Successfully get targeted organisation for testing, name 'test123', id '653be73543f648ef8e7c17ae'", async () => {
    try {
      const response = await fetch("http://localhost:4000/api/post/all", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": csrfToken,
          cookie: Object.values(cookie).join("; "),
        },
        body: JSON.stringify({
          organisation: organisation,
        }),
      });
      expect(response.status).to.equal(200);
    } catch (error) {
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
  it("Unuccessfully CREATE post,Title, more than 256 characters long", async () => {
    formdata.set("title", longContent);
    try {
      const response = await fetch("http://localhost:4000/api/post/all", {
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
    formdata.set("description", longContent);
    try {
      const response = await fetch("http://localhost:4000/api/post/all", {
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
    formdata.set("donation", "true");
    try {
      const response = await fetch("http://localhost:4000/api/post/all", {
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
    formdata.set("donation", "false");
  });
  it("Unuccessfully CREATE post, A post cannot be both event and donation", async () => {
    formdata.set("donation", "true");
    try {
      const response = await fetch("http://localhost:4000/api/post/all", {
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
    formdata.set("donation", "false");
  });
  // it("Successfully CREATE post", async () => {
  //   const apiUrl = "http://localhost:4000/api/post/new";
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //       body: formdata,
  //     });
  //     const responseJSON = await response.json();
  //     postId = responseJSON.post._id;
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully LIKE post", async () => {
  //   const apiUrl = "http://localhost:4000/api/post";
  //   const finalUrl = `${apiUrl}/${postId}/like`;
  //   try {
  //     const response = await fetch(finalUrl, {
  //       method: "POST",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //     });
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully DISLIKE post", async () => {
  //   const apiUrl = "http://localhost:4000/api/post";
  //   const finalUrl = `${apiUrl}/${postId}/dislike`;
  //   try {
  //     const response = await fetch(finalUrl, {
  //       method: "POST",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //     });
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Unsuccessfully CREATE comment, more than 2048 characters long", async () => {
  //   const apiUrl = "http://localhost:4000/api/comment/new";
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //       body: JSON.stringify({ post: postId, content: longContent }),
  //     });
  //     expect(response.status).to.equal(400);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully CREATE comment", async () => {
  //   const apiUrl = "http://localhost:4000/api/comment/new";
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //       body: JSON.stringify({ post: postId, content: "Testing Content" }),
  //     });
  //     const responseJSON = await response.json();
  //     commentId = responseJSON.comment._id;
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully LIKE comment", async () => {
  //   const apiUrl = "http://localhost:4000/api/comment";
  //   const finalUrl = `${apiUrl}/${commentId}/like`;
  //   try {
  //     const response = await fetch(finalUrl, {
  //       method: "POST",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //     });
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully DISLIKE comment", async () => {
  //   const apiUrl = "http://localhost:4000/api/comment";
  //   const finalUrl = `${apiUrl}/${commentId}/dislike`;
  //   try {
  //     const response = await fetch(finalUrl, {
  //       method: "POST",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //     });
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Unsuccessfully CREATE reply, more than 2048 characters long", async () => {
  //   const apiUrl = "http://localhost:4000/api/reply/new";
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //       body: JSON.stringify({ comment: commentId, content: longContent }),
  //     });
  //     expect(response.status).to.equal(400);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully CREATE reply", async () => {
  //   const apiUrl = "http://localhost:4000/api/reply/new";
  //   try {
  //     const response = await fetch(apiUrl, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //       body: JSON.stringify({ comment: commentId, content: "Testing Reply" }),
  //     });
  //     const responseJSON = await response.json();
  //     replyId = responseJSON.reply._id;
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully LIKE reply", async () => {
  //   const apiUrl = "http://localhost:4000/api/reply";
  //   const finalUrl = `${apiUrl}/${replyId}/like`;
  //   try {
  //     const response = await fetch(finalUrl, {
  //       method: "POST",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //     });
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully DISLIKE reply", async () => {
  //   const apiUrl = "http://localhost:4000/api/reply";
  //   const finalUrl = `${apiUrl}/${replyId}/dislike`;
  //   try {
  //     const response = await fetch(finalUrl, {
  //       method: "POST",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //     });
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully DELETE reply", async () => {
  //   const apiUrl = "http://localhost:4000/api/reply";
  //   const finalUrl = `${apiUrl}/${replyId}`;
  //   try {
  //     const response = await fetch(finalUrl, {
  //       method: "DELETE",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //     });
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully DELETE comment", async () => {
  //   const apiUrl = "http://localhost:4000/api/comment";
  //   const finalUrl = `${apiUrl}/${commentId}`;
  //   try {
  //     const response = await fetch(finalUrl, {
  //       method: "DELETE",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //     });
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
  // it("Successfully DELETE post", async () => {
  //   const apiUrl = "http://localhost:4000/api/post";
  //   const finalUrl = `${apiUrl}/${postId}`;
  //   try {
  //     const response = await fetch(finalUrl, {
  //       method: "DELETE",
  //       headers: {
  //         "x-csrf-token": csrfToken,
  //         cookie: Object.values(cookie).join("; "),
  //       },
  //     });
  //     expect(response.status).to.equal(200);
  //   } catch (error) {
  //     throw new Error(`HTTP request failed: ${error.message}`);
  //   }
  // });
});
