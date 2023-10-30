const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Options } = chrome;
const { exec } = require('child_process');
const { log } = require('console');

async function getCsrToken() {
  return new Promise((resolve, reject) => {
    exec('curl --location "https://mystifying-swirles.cloud/api/get-csrf-token" --header "Cookie: jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NGYwNGU3NzQ5YmI5YWVkMzBhNWZmMmQiLCJpYXQiOjE2OTg1NTU3MDgsImV4cCI6MTY5ODY0MjEwOH0.NqIxJRicf-ItEcBxxCCpe0SJkaYKKj8wpWK80j_x_uY"', (error, stdout, stderr) => {
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
  chromeOptions.addArguments('--no-sandbox');
  chromeOptions.addArguments('--ignore-certificate-errors')
  chromeOptions.setChromeBinaryPath('/usr/bin/google-chrome-stable')
 

  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  try {
    const csrfToken = await getCsrToken();
    const emailUser = 'pineapplehelpdesk@gmail.com';
    const emailPass = 'bmqeuxyprjqbsydd';

    driver.get('https://mystifying-swirles.cloud/login');

    // Use XPath or CSS selectors to locate the React-generated HTML elements
    const emailField = await driver.findElement(By.css('input[placeholder="Enter Email Address"]'));
    const passwordField = await driver.findElement(By.css('input[placeholder="Enter Password"]'));
    const loginButton = await driver.finalElement(By.css('button[title="Log IN"]'));


    // Include the CSRF token in the login request
    const csrfHeader = { 'X-CSRF-TOKEN': csrfToken };
    const headers = new Headers({
      ...csrfHeader,
      // Other headers, if needed
    });
    
    await emailField.sendKeys('pineapplehelpdesk@gmail.com');
    await passwordField.sendKeys('bmqeuxyprjqbsydd');
    await loginButton.click();

    // Include the CSRF token in the request headers
    await driver.executeScript(function (headers) {
      fetch('/login', {
        method: 'POST', 
        headers: headers,  // Include the CSRF token in the headers
        body: JSON.stringify({
          email: 'pineapplehelpdesk@gmail.com',
          password: 'bmqeuxyprjqbsydd',
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
