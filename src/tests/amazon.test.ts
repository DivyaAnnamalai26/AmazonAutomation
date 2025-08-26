import { test, expect } from '@playwright/test';
import { config } from '../config/env.config';
import { LoginPage } from '../pages/LoginPage';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { error } from 'console';

// POM Test for Amazon login, search, cart, and sign out

test.describe('Amazon Automation', () => {
  test('Scenario : Login, search , add , verify, delete, sign out', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);
  
    try {
      // 1. Navigate to login page
      await loginPage.gotoLogin(config.baseURL);
      await loginPage.login(config.username, config.password);

      // 2. Validate elements after login
      const usernameText = await homePage.getLoggedInUsername();
      const username = usernameText.replace('Hello, ', '').trim();
      console.log('Logged in user : ' + username);
      expect(usernameText).toContain('Hello');

      // 3. Search product
      await homePage.searchProduct(config.product);
      await page.waitForLoadState('domcontentloaded');
      const currentUrl = page.url();
      expect(currentUrl).toContain('/s?k=');
      
      // 4. Select and add product to cart
      await productPage.selectFirstProduct(config.product);
      await productPage.addToCart();
      // console.log('Product successfully added to cart:', config.product);

      // 5. Verify product added to cart
        await Promise.all([
        page.waitForURL(/.*\/gp\/cart\/view\.html.*/),
        page.click('#nav-cart')
      ]);
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle');
      const cartContent = await page.textContent('.sc-list-body');
      const productFound = await cartPage.verifyProductInCart(config.product);
      expect(productFound, 'Product should be found in cart').toBeTruthy();

      // 6. Delete product from cart
      await cartPage.deleteProductByName(config.product); 
      // 7. Sign out
      await homePage.signOut();
    
    } catch (error) {
      console.error('Test failed:', error);
      throw error;
    }
  });
});
