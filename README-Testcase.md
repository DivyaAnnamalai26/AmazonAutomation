
# TEST_CASES.md — Amazon UI Automation (Playwright)

> **Scope:** Login, search, add to cart, cart delete (most recent), and sign out, with cross‑domain (.com/.ca) and OTP handling notes.

## 1. Test Plan Overview
**Objectives**
- Validate critical shopping flow across Amazon `.com` and `.ca` with minimal config changes.
- Demonstrate robust selectors, deterministic viewport, and graceful handling of popups/OTP.
**Environments**
- Chromium primary
**Risks & Mitigations**
- OTP prompts on untrusted devices → manual input path documented.

## 2. Test Data
| Key              | Example                        | Notes                                  
| baseURL          | https://www.amazon.ca         | 
| username         | ***test.user@example.com***    | Stored in local config file config/env.config.ts
| password         | ***••••••••***                 | Stored in local config file config/env.config.ts                    

## 3. Preconditions

- IDE(VSCode), Playwright installed and browsers downloaded (chrome)
- Valid credentials in local env.config.ts file.  
- Account is signed out before each run

## 4. Test Cases

### TC‑001 — Login (Amazon, .com or .ca)
**Goal:** User can log in on `.com` or .ca  without OTP/ with OTP.  
**Pre‑Steps:** Navigate to `baseURL` (`.com`).  
**Steps & Expected Results:**
1. Go to home → Home loads; cookie banner **may** appear.    
2. Navigate **Your Account → Sign In** → Sign‑in form is visible.
3. Enter valid username/password → Account home is displayed;  
**Notes:** If OTP appears, defer to **TC‑002**.

---

### TC‑002 — Login with OTP (Untrusted Device)
**Goal:** Handle OTP prompt via manual entry.  
**Steps & Expected Results:**
1. Trigger login as in **TC‑001** → OTP prompt appears.  
2. **Manual action:** Tester enters the OTP and clicks **Submit** → Login proceeds to account home.  

---

### TC‑003 — Search & Add to Cart
**Goal:** Search a book and added to cart.  
**Pre steps ** Enter product name from env.config.ts file
**Steps & Expected Results:**
1. Enter `productname` submit → Results list appears.  
2. select the product  
3. Click **Add to Cart** → Inline or cart confirmation appears; cart count increments by 1.
  
---

### TC‑004 — Cart: Delete Most Recently Added Item
**Goal:** Delete the last added item and verify it’s removed only once.  
**Steps & Expected Results:**
1. Navigate to **Cart** → Cart items listed.  
2. Assert target item exists (by product title) → Item is present.  
3. Click **Delete** for the most recent item → Item shows “removed” confirmation.  
4. Verify the deleted item is no longer in the list; other items remain unaffected.  
---

### TC‑005 — Sign Out
**Goal:** User can sign out from account menu.  
**Steps & Expected Results:**
1. Hover **Account & Lists** → Menu shows **Sign Out**.  
2. Click **Sign Out** → Redirected to a signed‑out landing/sign‑in page.  
---

### TC‑006 — Domain Handling (.ca vs .com)
**Goal:** Validate minimal‑change support for `.ca`.  
**Steps & Expected Results:**
1. Start on `.ca`. If locale popup appears, close to remain on `.com` (or follow sample to switch to `.ca`).  
2. Flow continues analogous to **TC‑001..005** with the **Sign In** path difference on `.ca`.  
**Pass Criteria:** Same outcomes as `.com` with domain‑specific navigation nuance.





