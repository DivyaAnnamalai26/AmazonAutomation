import { Page } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

async getLoggedInUsername(): Promise<string> {
    // Wait for the element that contains just the Hello text
    await this.page.waitForSelector('#nav-link-accountList-nav-line-1', { 
      state: 'visible',
      timeout: 30000 
    }); 
    // Get only the Hello, Name part
    const welcomeText = await this.page.textContent('#nav-link-accountList-nav-line-1');
    // Clean up the text to only include Hello, Name
    return welcomeText ? welcomeText.split('\n')[0].trim() : '';
}
  async searchProduct(product: string) {
    try {
      // Wait for search box to be visible and interactable
      const searchBox = this.page.locator('#twotabsearchtextbox');
      await searchBox.waitFor({ state: 'visible', timeout: 30000 });
      // Clear and fill the search box
      await searchBox.click();
      await searchBox.fill('');
      await searchBox.fill(product);
      // Click the search button (more reliable than Enter key)
      const searchButton = this.page.locator('#nav-search-submit-button');
      await searchButton.waitFor({ state: 'visible', timeout: 30000 });
      await searchButton.click(); 
      // Wait for results container
      await this.page.waitForSelector('.s-main-slot', { 
        state: 'visible', 
        timeout: 30000 
      }); 
      await this.page.waitForLoadState('domcontentloaded');
    } catch (error) {
      throw error;
    }
  }
  async signOut(): Promise<void> {
    try {
      // Hover over the account list to show sign out option
      await this.page.hover('#nav-link-accountList');
      const signoutButton = this.page.getByRole('link', { name: 'Sign Out' })
      await signoutButton.waitFor({ state: 'visible', timeout: 10000 });
      await signoutButton.click();
      //console.log('Successfully logged out');
      await this.page.waitForLoadState('networkidle');
    } catch (error) {
      throw new Error('Failed to sign out');
    }
  }
}

