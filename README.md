# Amazon Playwright Automation Project

## Overview
This project automates Amazon.com and Amazon.ca using Playwright with TypeScript. It follows the Page Object Model (POM) design pattern to ensure modularity and maintainability. The automation covers key functionalities like login, product search, cart operations, and sign-out, while also handling popups and addressing potential flakiness in tests.

## Project Structure
- **`src/pages/`**: Contains POM classes (e.g., `LoginPage`, `ProductPage`, `CartPage`, `HomePage`) that encapsulate page-specific actions.
- **`src/config/env.config.ts`**: Centralized configuration file for environment-specific settings like `baseURL`, `username`, `password`, and `product`.
- **`src/tests/`**: Contains test scripts for various scenarios.
- **`playwright.config.ts`**: Configuration file for Playwright settings.
- **`playwright-report/`**: Stores HTML reports generated after test execution.
- **`test-results.json` / `results.xml`**: Contains test results in JSON and XML formats.

## Prerequisites for Running on a New Machine

1. **Node.js** (v16 or newer)
   - Download and install from [nodejs.org](https://nodejs.org/)
   - Includes npm (Node Package Manager)
2. **npm**
   - Used to install project dependencies
3. **Playwright Browsers**
   - Install with: `npx playwright install`
4. **(Optional) Git**
   - For cloning the repository
5. **No Java required**
   - Playwright is a Node.js library; Java is not needed

## Setup Steps
Follow these steps to set up and run the project:

1. Clone the repository (if not already):
   ```bash
   git clone <repo-url>
   cd PlayWrightAutomation
   ```
2. **Install dependencies:**
    Open a terminal in the project directory and run:
    ```bash
    npm install
    ```
3. **Install Playwright browsers:**
    ```bash
    npx playwright install
    ```
4. **Configure the environment:**
    - Edit the `src/config/env.config.ts` file to set values for `baseURL`, `username`, `password`, and `product`.
    - Alternatively, you can set these values as environment variables:
      ```bash
      export BASE_URL=https://www.amazon.ca
      export AMAZON_USERNAME=your_username
      export AMAZON_PASSWORD=your_password
      export AMAZON_PRODUCT=product_name 
      > **Note:** 
      If the `BASE_URL` is left empty. ex: = ' ', the default value will be set to `https://www.amazon.ca`.
      Use the product listed in the `env.config.ts` file. See the `### Product Selection` section for the reason.
      

5. **Run tests:**
    - To execute all tests, run:
      ```bash
      npx playwright test
      ```
    - To run tests in headed mode (with a browser window visible), use:
      ```bash
      npx playwright test --headed
      ```
    - To run tests for a specific environment, set the `BASE_URL` variable:
      ```bash
      BASE_URL=https://www.amazon.ca/ npx playwright test
      ```
> **Very important Note:** Amazon uses a device trust model, so storage state is not used. 
First time run the code using headed mode "npx playwright test --headed"
After a successful login, the test runs in headed mode and will prompt for OTP on new devices—manually enter the OTP and click "Next." Once verified, automation continues without further OTP prompts on trusted devices in the even in the future.

6. **View reports:**
    - To view the HTML report after running tests:
      ```bash
      npx playwright show-report
    - For XML reports, check the `results.xml` file in the project directory.

## Scenario List
- **✅ Login with valid credentials.**
- **✅ Print the logged-in username (e.g., "Hello, Jack").**
- **✅ Search for a product.**
- **✅ Add a product to the cart.**
- **✅ Verify the product in the cart.**
- **✅ Delete the product from the cart.**
- **✅ Verify the product is deleted.**
- **✅ Sign out.**

**Flakiness Handling:**
- Retry logic for selectors and actions.
- Use multiple selectors for dynamic elements.
- Avoid relying on `networkidle` where possible.
- Implement robust popup handling.
- Use configurable timeouts.

## Test Scenarios & Handling Details

### Cookie Consent Handling
- If a cookie consent popup appears, the automation continues without requiring approval or rejection.
- The login page also contains logic to accept cookies if needed, but the main flow does not depend on clicking the cookie button.

### Handling .CA vs .COM URLs with Minimal Changes
- **.CA:** Directly clicks the Sign In button.
- **.COM:** Two login flows:
  - Direct navigation through Your Account → Sign In.
  - Popup asking to choose either .com or .ca.
    - For this popup, we use the close button to stay on .com.
    - Sample code is also provided in the login page to switch to .ca if needed.

### Product Selection
- Select a product available on both .COM and .CA.
- Different product categories may need specific handling (e.g., electronics may prompt for warranty, clothing may require size selection).
- To simplify automation, books are preferable.
- Both short names and long names are tested to ensure the code handles search queries consistently.

### Search and Add to Cart
- Search for the product and add it to the cart.
- Verify the product is successfully added.

### Cart Handling
- Navigate to the cart and remove the most recently added product.
- Ensure only the intended product is deleted.
- Product deletion confirmation flow:
  a. Check the cart to confirm the product is present.
  b. Delete the product.
  c. Verify the product is deleted successfully.

### Sign Out
- Hover over the account menu and sign out.


## Timeout Usage (Important Note)
You will notice multiple instances of ex: `timeout: 2000` in the test code.
- This was done intentionally to ensure stability across different environments, since network speed and machine performance may vary.
- Using an explicit timeout helps avoid false failures when tests are executed on slower networks or machines.
- In a production-grade project, these timeouts are usually managed globally in `playwright.config.ts` (via `actionTimeout`, `navigationTimeout`, or `expect.timeout`) instead of being repeated inline.
- For this demo project and for easier readability, timeouts were left inline rather than refactoring into global configuration.

