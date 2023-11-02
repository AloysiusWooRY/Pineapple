const testenv = require('./testenv');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Options } = chrome;
const { exec } = require('child_process');
const { log } = require('console');
const email = testenv.TEST_USER_EMAIL;
const password = testenv.TEST_USER_PASS;

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
 

  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  //login button testing
  try {
    const csrfToken = await getCsrToken();

    driver.get('https://mystifying-swirles.cloud/login');

    // Use XPath or CSS selectors to locate the React-generated HTML elements
    const emailField = await driver.findElement(By.css('input[placeholder="Enter Email Address"]'));
    const passwordField = await driver.findElement(By.css('input[placeholder="Enter Password"]'));
    const loginButton = await driver.findElement(By.css('button[id="button-log-in"]'));

    // Include the CSRF token in the login request
    const csrfHeader = { 'X-CSRF-TOKEN': csrfToken };
    const headers = new Headers({
      ...csrfHeader,
      // Other headers, if needed
    });
    
    await emailField.sendKeys(email);
    await passwordField.sendKeys(password);
    await loginButton.click();
    
    // Include the CSRF token in the request headers
    await driver.executeScript(function (headers,email,password) {
      fetch('/login', {
        method: 'POST', 
        headers: headers,  // Include the CSRF token in the headers
        body: JSON.stringify({
          email: email,
          password: password,
          // Include other login data as needed
        }),
      });
    }, headers,email,password);
    
    try {
      await driver.sleep(2000);
      await driver.findElement(By.css('a[id="link-home"]'));
      console.log('Login button successful.');
    } catch (error) {
      console.error('Login button failed.');
    }
    //menu bar test
    try{
      const menuOrg = await driver.findElement(By.css('a[id="link-organisation-home"]'));
      await menuOrg.click()
      await driver.sleep(2000);
      await driver.findElement(By.xpath('//h2[contains(text(),"Organisations")]'));
      console.log('Organisation Menu button successful.');
    } catch (error) {
      console.error('Organisation Menu button unsuccessful.')
    }

    try{
      const menuPro = await driver.findElement(By.css('a[id="link-profile"]'));
      await menuPro.click()
      await driver.sleep(2000);
      await driver.findElement(By.xpath('//h2[contains(text(),"Profile")]'));
      console.log('Profile Menu button successful.');
    } catch (error) {
      console.log('Profile buttons unsuccessful.')
    }

  } finally {
    await driver.quit();
  }
}

runLoginTest();
