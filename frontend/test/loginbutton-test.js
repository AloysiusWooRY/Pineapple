const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Options } = chrome;
const { exec } = require('child_process');
const binary = new chrome.Binary('/usr/bin/google-chrome');

async function getCsrToken() {
  return new Promise((resolve, reject) => {
    exec('curl --location "http://localhost:4000/api/get-csrf-token" --header "Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGYwNGU3NzQ5YmI5YWVkMzBhNWZmMmQiLCJpYXQiOjE2OTg1NTU3MDgsImV4cCI6MTY5ODY0MjEwOH0.NqIxJRicf-ItEcBxxCCpe0SJkaYKKj8wpWK80j_x_uY"', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error running curl: ${error}`);
        reject(error);
      } else {
        const csrfToken = JSON.parse(stdout).csrfToken;
        resolve(csrfToken);
      }
    });
  });
}

async function runLoginTest() {
  const chromeOptions = new Options();
  chromeOptions.addArguments('--headless');
  chromeOptions.addArguments('--disable-gpu');

  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .setChromeOptions(new chrome.Options().setChromeBinaryPath(binary))
    .build();

  try {
    const csrfToken = await getCsrToken();

    driver.get('http://localhost:4000/login');

    // Use XPath or CSS selectors to locate the React-generated HTML elements
    const emailField = await driver.findElement(By.xpath('//input[@placeholder="Enter Email Address"]'));
    const passwordField = await driver.findElement(By.xpath('//input[@placeholder="Enter Password"]'));
    const loginButton = await driver.findElement(By.xpath('//button[text()="Log In"]'));

    // Include the CSRF token in the login request
    const csrfHeader = { 'X-CSRF-TOKEN': csrfToken };
    const headers = new Headers({
      ...csrfHeader,
      // Other headers, if needed
    });

    await emailField.sendKeys(process.env.ADMIN_USER);
    await passwordField.sendKeys(process.env.ADMIN_PASS);

    // Include the CSRF token in the request headers
    await driver.executeScript(function (headers) {
      fetch('/login', {
        method: 'POST',
        headers: headers,  // Include the CSRF token in the headers
        body: JSON.stringify({
          email: process.env.ADMIN_USER,
          password: process.env.ADMIN_PASS,
          // Include other login data as needed
        }),
      });
    }, headers);

    try {
      await driver.wait(until.elementLocated(By.xpath('//input[@placeholder="Enter Recovery Code"]'), 10000));
      console.log('Login button successful.');
    } catch (error) {
      console.error('Login button failed.');
    }
  } finally {
    await driver.quit();
  }
}

runLoginTest();
