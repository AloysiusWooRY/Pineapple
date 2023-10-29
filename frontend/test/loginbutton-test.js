const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const { Options } = chrome;

// Function to run the login test
async function runLoginTest() {
  const chromeOptions = new Options();
  chromeOptions.addArguments('--headless'); // Run Chrome in headless mode (no GUI)
  chromeOptions.addArguments('--disable-gpu'); // Disable GPU to prevent crashes in headless mode

  const driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(chromeOptions)
    .build();

  try {
    // Navigate to the login page
    await driver.get('http://localhost:4000/api/account/login'); // Replace with the actual URL

    // Locate the email and password fields and the login button
    const emailField = await driver.findElement(By.name('email')); // Adjust the selector as needed
    const passwordField = await driver.findElement(By.name('password')); // Adjust the selector as needed
    const loginButton = await driver.findElement(By.css('button[type="submit"]')); // Adjust the selector as needed

    // Enter email and password
    await emailField.sendKeys('process.env.ADMIN_USER'); // Replace with your test email
    await passwordField.sendKeys('process.env.ADMIN_PASS'); // Replace with your test password

    // Click the login button
    await loginButton.click();

    // Wait for an HTTP success code element to appear
    await driver.wait(until.elementLocated(By.css('.http-success-code')), 10000);

    // Get the HTTP success code element
    const successCodeElement = await driver.findElement(By.css('.http-success-code'));

    // Retrieve the text content of the success code element
    const successCode = await successCodeElement.getText();

    // Verify that the success code matches the expected value
    if (successCode === '200 OK') {
    console.log('Login successful. HTTP success code is 200 OK.');
    } else {
    console.error('Login failed. Unexpected HTTP success code:', successCode);
    }

  } finally {
    await driver.quit();
  }
}

// Run the login test
runLoginTest();
