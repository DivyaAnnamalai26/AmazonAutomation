import { Page } from '@playwright/test';

export class ProductPage {
  constructor(private page: Page) {}
  
  async selectFirstProduct(productName: string) {
    // Wait for search results to appear
    await this.page.waitForSelector('.s-search-results', { timeout: 10000 });
    // Find the first product link containing the product name
    const firstProductLink = this.page.getByRole('link', { name: productName, exact: false }).first();
    await firstProductLink.waitFor({ state: 'visible', timeout: 10000 });
    await firstProductLink.click();
   // await console.log('Product successfully searched : ' + productName)
    await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });
  }
  async addToCart() {
    try {
      const addToCartButton = await this.page.waitForSelector('input#add-to-cart-button', {state: 'visible', timeout: 10000 });
       await addToCartButton.click();
      //  await console.log('Succcessfully added in the cart')
       await this.page.locator('#nav-cart-count').isVisible().catch(() => false);
       await this.page.locator('text=Added to Cart').isVisible().catch(() => false);
      // await console.log('Product successfully added in the cart')
    } catch (error) {
      console.error('Error in addToCart:', error);
      throw error;
    }
  }
}