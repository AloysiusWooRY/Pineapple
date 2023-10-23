const chai = require('chai');
const { expect } = chai;

describe('Login Test', () => {
  it('Should be unsuccessful login', async () => {
    // Replace this URL with the URL you want to test
    const apiUrl = 'http://localhost:4000/api/account/login';
    const email = 'admin'
    const password = '123456'

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const jsonResponse = await response.json();
        
      // Assert that the response status code is 200 (OK)
      expect(response.status).to.equal(400);
      
    } catch (error) {
      // Handle any errors (e.g., network issues, request failure)
      throw new Error(`HTTP request failed: ${error.message}`);
    }
  });
});