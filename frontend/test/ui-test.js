const testenv = require('./testenv');
const { Builder, By, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Options } = chrome;
const { exec } = require('child_process');
const email = testenv.TEST_USER_EMAIL;
const password = testenv.TEST_USER_PASS;
const authCode = testenv.AUTH_CODE;
const COOKIE = testenv.COOKIE;

async function getCsrfToken() {
  return new Promise((resolve, reject) => {
    exec(`curl --location "https://mystifying-swirles.cloud/api/get-csrf-token" --header "Cookie: ${COOKIE}"`, (error, stdout, stderr) => {
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
    const csrfToken = await getCsrfToken();

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
      await driver.findElement(By.css('input[id="input-authenticator-code"]'));
      console.log('Login button successful.');
    } catch (error) {
      console.error('Login button failed.');
    }

    //auathentication button test
    try {
      const authInput = await driver.findElement(By.css('input[id="input-authenticator-code"]'));
      const authButton = await driver.findElement(By.css('button[id="button-submit-authenticator-code"]'));
      await authInput.sendKeys(authCode);
      await authButton.click();
      await driver.sleep(2000);
      await driver.findElement(By.xpath('//h2[contains(text(),"Home")]'));
      console.log('Authentication button successful.');
    } catch (error) {
      console.error('Authentication button failed.');
    }

    //home tabs test
    try{
      const homeDis = await driver.findElement(By.css('li[id="tab-post-types-option-discussion"]'))
      await homeDis.click();
      console.log('Discussion tab successful.');
      const homeEve = await driver.findElement(By.css('li[id="tab-post-types-option-event"]'));
      await homeEve.click();
      console.log('Event tab successful.');
      const homeDon = await driver.findElement(By.css('li[id="tab-post-types-option-donation"]'));
      await homeDon.click();
      console.log('Donation tab successful.');
      const homeAll = await driver.findElement(By.css('li[id="tab-post-types-option-all"]'));
      await homeAll.click();
      console.log('Home All tab successful.');
    } catch (error) {
      console.error('Home tabs unsuccessful.')
    }

    //menu bar test: organization
    try{
      const menuOrg = await driver.findElement(By.css('a[id="link-organisation-home"]'));
      await menuOrg.click();
      await driver.sleep(2000);
      await driver.findElement(By.xpath('//h2[contains(text(),"Organisations")]'));
      console.log('Organisation Menu button successful.');
    } catch (error) {
      console.error('Organisation Menu button unsuccessful.')
    }

    //organisation tabs test
    try{
      const orgHea = await driver.findElement(By.css('li[id="tab-organisation-categories-option-health"]'))
      await orgHea.click();
      console.log('Health tab successful.');
      const orgEdu = await driver.findElement(By.css('li[id="tab-organisation-categories-option-education"]'));
      await orgEdu.click();
      console.log('Education tab successful.');
      const orgEnv = await driver.findElement(By.css('li[id="tab-organisation-categories-option-environment"]'));
      await orgEnv.click();
      console.log('Environment tab successful.');
      const orgHum = await driver.findElement(By.css('li[id="tab-organisation-categories-option-humanitarian"]'))
      await orgHum.click();
      console.log('Humanitarian tab successful.');
      const orgAll = await driver.findElement(By.css('li[id="tab-organisation-categories-option-all"]'));
      await orgAll.click();
      console.log('Organisation All tab successful.');
    } catch (error) {
      console.error('Organisation tabs unsuccessful.')
    }
    //menu bar test: profile
    try{
      const menuPro = await driver.findElement(By.css('a[id="link-profile"]'));
      await menuPro.click()
      await driver.sleep(2000);
      await driver.findElement(By.xpath('//h2[contains(text(),"Profile")]'));
      console.log('Profile Menu button successful.');
    } catch (error) {
      console.log('Profile buttons unsuccessful.')
    }

    //home link test
    try{
      const home = await driver.findElement(By.css('a[id="link-home"]'));
      await home.click()
      await driver.sleep(2000);
      await driver.findElement(By.xpath('//h2[contains(text(),"Home")]'));
      console.log('Home link successful.');
    } catch (error) {
      console.log('Home link unsuccessful.')
    }

    //logout button test
    try{
      const logout = await driver.findElement(By.xpath('//span[contains(text(),"Logout")]'));
      await logout.click()
      await driver.sleep(2000);
      await driver.findElement(By.css('input[placeholder="Enter Email Address"]'));
      console.log('Logout button successful.');
    } catch (error) {
      console.log('Logout button unsuccessful.')
    }
  } finally {
    await driver.quit();
  }
}

runLoginTest();
