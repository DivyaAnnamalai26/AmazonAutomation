import { Page, Locator, BrowserContext } from '@playwright/test';

export class LoginPage {
  private readonly page: Page;
  private readonly context?: BrowserContext;

  constructor(page: Page, context?: BrowserContext) {
    this.page = page;
    this.context = context;
  }
  getBrowserContext(): BrowserContext | undefined {
    return this.context;
  }

  private async appears(locator: Locator, timeout = 2000): Promise<boolean> {
    try {
      // Check if the locator resolves to any element before waiting
      const count = await locator.count();
      if (count === 0) return false;
      await locator.waitFor({ state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  async gotoLogin(baseURL: string): Promise<void> {
    try {
      await this.page.goto(baseURL);
      // await this.page.getByRole('button', { name: 'Continue shopping' }).click();
      await this.page.waitForLoadState('domcontentloaded');
      const yourAccountLink = this.page.getByRole('link', { name: 'Your Account' });
      const visitingBanner  = this.page.getByText('Visiting from Canada? Choose', { exact: false });
      const shopOnCaLink    = this.page.getByRole('link', { name: ' Shop on Amazon.ca ' });
      const closelocationPopup = this.page.locator("#redir-overlay > div.redir-title > span.redir-dismiss-x");
      const accountList     = this.page.locator('#nav-link-accountList');
      // Helper function to wait and click accountList
      const waitAndClickAccountList = async () => {
        await accountList.waitFor({ state: 'visible', timeout: 30000 });
        await accountList.click();
      };
      if (await this.appears(closelocationPopup)) {
        await closelocationPopup.click();
        await waitAndClickAccountList();
      } else if (await this.appears(yourAccountLink)) {
        await yourAccountLink.click();
        await waitAndClickAccountList();
      } else {
        await waitAndClickAccountList();
      }
    } catch (error) {
      console.error('Failed to navigate to login page:', error);
      throw error;
    }
  }
  async login(username: string, password: string): Promise<void> {
    try {
      // Handle Email Input
      const usernameField = this.page.locator("//input[@name='email']").or(this.page.locator("input[type='email']")).or
      (this.page.locator('#ap_email')).or(this.page.locator('#ap_email_login'));
      await usernameField.waitFor({ state: 'visible', timeout: 30000 });
      await usernameField.fill(username);
      // Click Continue
      const continueButton = this.page.getByRole('button', { name: 'Continue' });
      await continueButton.waitFor({ state: 'visible', timeout: 30000 });
      await continueButton.click();
      // Wait for password field to be visible
      const passwordField = this.page.locator('#ap_password');
      await passwordField.waitFor({ state: 'visible', timeout: 30000 });
      // Handle Password
      await passwordField.fill(password);
      // Click Sign In
      const signInButton = this.page.locator('#signInSubmit');
      await signInButton.waitFor({ state: 'visible', timeout: 30000 });
      // Ensure button is enabled and not covered
      if (await signInButton.isEnabled() && await signInButton.isVisible()) {
        await signInButton.click();
      } else {
        throw new Error('Sign In button is not clickable');
      }
      // Wait for successful login
      const accountElement = this.page.locator('#nav-link-accountList-nav-line-1');
      await accountElement.waitFor({ state: 'visible', timeout: 30000 });
      // OTP Handling: Pause for manual entry if OTP field appears
      const otpBox = this.page.getByRole('textbox', { name: 'OTP' }).or(this.page.locator('#input-box-otp'));
      if (await otpBox.isVisible()) {
        console.log('OTP required. Please enter OTP manually in the browser and resume.');
        await this.page.pause(); // Pauses for manual OTP entry
        // Optionally, click submit after resume if needed
        const submitButton = this.page.getByRole('button', { name: 'Submit' });
        if (await submitButton.isVisible()) {
          await submitButton.click();
          console.log('OTP submitted successfully');
        }
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

}

