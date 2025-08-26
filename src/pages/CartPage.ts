import { Page } from '@playwright/test';

export class CartPage {
  constructor(private page: Page) {}

  async verifyProductInCart(product: string): Promise<boolean> {
    try {
      // console.log('Verifying product in cart:', product);
      
      await this.page.waitForLoadState('domcontentloaded');
      await this.page.waitForLoadState('networkidle');
      const selectors = [
        '.sc-list-item-content',
        '.sc-product-title',
        '.a-truncate-cut',
        '.sc-product-link',
        '.a-link-normal'
      ]; 
      const pageContent = await this.page.textContent('.sc-list-body');
      // console.log('Cart content:', pageContent);
      for (const selector of selectors) {
        try {
          await this.page.waitForSelector(selector, { timeout: 15000 });
          const elements = await this.page.$$(selector);
          
          for (const element of elements) {
            const text = await element.textContent();
            if (text) {
              // console.log(`Found item with selector ${selector}:`, text.trim());
              if (text.toLowerCase().includes(product.toLowerCase())) {
               // console.log('Product successfully verified in the cart!');
                return true;
              }
            }
          }
        } catch (e) {
          // console.log(`Selector ${selector} not found, trying next...`);
          continue;
        }
      }
     // console.log('Product not found in cart after trying all selectors');
      return false;
    } catch (error) {
     // console.error('Error verifying product in cart:', error);
      throw error;
    }
  }



  // delete Product By Name

  async deleteProductByName(productName: string): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded');

    const items = this.page.locator('.sc-list-item-content, .sc-list-item');

    const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const nameRegex = new RegExp(
      productName.trim().split(/\s+/).map(escape).join('\\s+'),
      'i'
    );

    const item = items.filter({ hasText: nameRegex }).first();
    if (await item.count() === 0) {
      const snapshot = (await items.allTextContents())
        .map(t => t.replace(/\s+/g, ' ').trim()).filter(Boolean);
      throw new Error(`Product '${productName}' not found in cart. Items: ${JSON.stringify(snapshot)}`);
    }

    const deleteButton = item.getByRole('button', { name: 'Delete' }).and(item.locator('input[data-action="delete-active"]')) 
    

    await deleteButton.waitFor({ state: 'visible', timeout: 10000 });
    await deleteButton.click();

    if (!(await deleteButton.isVisible())) {
     // console.log('Product successfully deleted!');
      return;
    }
  }
  async deleteAndVerifyProduct(productName: string): Promise<void> {
    await this.deleteProductByName(productName);
    const isAvailable = await this.verifyProductInCart(productName);
    
    if (isAvailable) {
      console.log(`Product "${productName}" is still available in the cart.`);
      }else {
      console.log(`Product "${productName}" is not available in the cart.`);
    }
  }
}
