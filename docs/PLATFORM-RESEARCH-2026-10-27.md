# Purrlight: move to WordPress or Cloudflare? Research and recommendation (2026-10-27)

> Full research behind `docs/PLATFORM-DECISION-2026-10-27.md` (the Vietnamese summary for Elise). Three researchers
> (current stack from this repo; every channel Elise listed; WordPress vs Shopify vs Cloudflare), two independent
> fact-checkers re-checking prices and rules against official pages, one synthesis. Prices and rules change: re-check
> before paying for anything.

## 1. Short answer

**Don't move to WordPress. Cloudflare can't replace WordPress, because Cloudflare is a web host, not a store.** Do this instead:

1. **Keep the custom site as the storefront.** Move its hosting from GitHub Pages to Cloudflare on your own domain. Hosting costs $0 a month. GitHub's terms say Pages may not be used "to run your online business, e-commerce site" [1], and the site already has a shop and deposit links.
2. **Add Shopify Basic as the back office ("hub").** It would hold ready-made products, orders, stock and the selling channels. Start it in January, after the 15/11–02/01 freeze, and only once you commit to at least one new channel beyond Etsy and TikTok.
3. **Leave these exactly as they are:** Custom Orders (the price calculator, Tally form and Zelle/Square deposits), Event Desk, and the check-site/DEPLOY-HOLD approval gates.

Your sense that the dashboard isn't finished is correct. The "dashboard" (the Sveltia admin) is a test version with one section, the follow strip. It has never published anything, and it was never designed for orders, payments or customers. What's missing isn't a new website. It's a real sales back office, and Shopify already is one.

## 2. Why: checked against your real needs

| Need | Recommended: custom site on Cloudflare + Shopify hub | Move everything to WordPress/WooCommerce |
|---|---|---|
| **Multichannel sync** | Free official apps for TikTok [28], Meta [29], Google/YouTube [31] and Faire [35]. Shopify's own app, Marketplace Connect, handles Amazon, eBay, Walmart and Target Plus [13]. Etsy needs a third-party app [14][15]. | Faire, Meta and Google have official plugins. TikTok orders arrive read-only [57]. Amazon, eBay, Walmart and Etsy are third-party only. Codisto was closed on 1/12/2025 for a security issue [54]. CedCommerce Multichannel is rated 3.5/5 [52]. The CedCommerce Etsy plugin can't send tracking for new US sellers [52]. M2E has no Etsy [53]. |
| **Payments** | Shopify Payments: 2.9% + 30¢ online on Basic [11]. PayPal works as PayPal Wallet with no Shopify fee [17][19]. Stripe can't be added separately in the US [18]. Square has no Shopify checkout (unverified) [20]. Custom deposits keep using the Zelle/Square links on the site, at $0 extra. | **WooCommerce is better here.** Stripe, PayPal, Square and WooPayments all have free official plugins [56][55]. |
| **Custom orders with deposits** | The 2,200-line price calculator and the Tally form stay untouched. | Full rebuild. WooCommerce Deposits costs $219/yr, is rated 2/5, and doesn't collect the balance automatically [50]. Add-Ons costs $79/yr [51]. |
| **Booth sales** | Event Desk stays. Shopify includes casual in-person selling on every paid plan; reader prices were not listed [23]. | The WooCommerce app has Tap to Pay. Each active card reader costs $5/mo [55]. |
| **Your time** | Shopify is hosted for you and has a phone app [24]. A static site has nothing to patch. | 11,334 new WordPress vulnerabilities in 2025, 91% of them in plugins, with a median of 5 hours to first exploit [62]. You or Claude would be patching it all the time. |
| **Cost** | Phase 0: $0/mo. Phase 2: about $29–98/mo (see §5). | Self-hosted, basic: about $12.50–26/mo (Hostinger $3.49/mo for 48 months prepaid, $167.52 [61], renewing at $16.99, plus CedCommerce from $9 [52]). With deposits and options: about $37–42/mo at first and about $51–56/mo after renewal. WordPress.com Commerce is $45/mo billed yearly; whether Deposits is included is unknown [60]. |
| **AI-agent operability** | The Shopify connector is already in this session (its tools are listed, but signing into your store is untested). Sidekick (Shopify's AI helper) is on every plan [25], and there is an AI Toolkit for Claude Code [26]. The site stays fully run by Claude through the repo, behind the gates. | WooCommerce's AI connector is still a "developer preview" [58]. WordPress.com's Claude connector doesn't mention WooCommerce [59]. |
| **Brand and speed** | Keeps the custom design, the accessibility (WCAG AA) work, the motion rules and the no-trackers rule. | The theme would be rebuilt, and plugins can add third-party scripts. There is no speed benchmark either way; speed depends on host, caching and plugins (inference). |
| **"Nothing goes live without Elise"** | check-site and DEPLOY-HOLD survive. | Lost. In WordPress, Save/Publish goes live immediately. |

**Bottom line:** WooCommerce has two real advantages: it is cheaper in cash, and it works with Stripe and Square directly. It loses on everything that costs your time and your safety: plugin patching, weaker marketplace plugins, a full rebuild, and losing the approval gates.

**What about "connecting many SaaS apps like the Purrlight harness"?** The harness (Claude plus its connectors) connects to services through MCP connectors, wherever the website is hosted. The host doesn't limit it.

- **Already connected:** Shopify, Square, Supabase, Tally, Klaviyo, Zapier, Meta Ads, Buffer, vidIQ and Windsor.ai. Windsor.ai lists Amazon Seller Central, Stripe, PayPal, Instagram and YouTube; none of this has been tested.
- **No connector:** Etsy, WooCommerce, eBay, Walmart, Faire, Mercari and KDP. Shopify covers most of these indirectly.

## 3. Cloudflare: what it is and isn't for you

**What it is:**
- Free hosting for the same website folder. Free-plan limits are 500 builds a month, 20,000 files and 25 MiB per file [3]. Cloudflare now recommends its "Workers" product over "Pages" for new projects [2].
- DNS, CDN, SSL, firewall and DDoS protection on the $0 plan [5].
- Domain registration at cost [8].
- An official connector Claude can use (mcp.cloudflare.com/mcp) to replace the outdated one in this session [10].

**What it isn't:**
- A store: it has no product, order or stock admin and no marketplace connections [2].
- A WordPress host. Cloudflare can't run PHP [7]. It can only sit in front of a WordPress host (APO, $5/mo) [5].
- EmDash 1.0, Cloudflare's new CMS, has no built-in store, and its only shop plugin is from another company [9]. It's too new to run a store on.

**One rule to respect:** the Free plan's terms forbid collecting card data on a site served by the Free plan [4]. Keep card entry on the hosted pages of Square, Stripe or Shopify, as today. That reading of the clause is our own interpretation.

## 4. Channel by channel

| Channel | How it connects (recommended) | Gate before you can sell | Can it be automated? |
|---|---|---|---|
| **Etsy** (live, main channel) | Stay on Etsy. Keep the Supabase read-only nightly sync. Linking to Shopify takes a third-party app, because Marketplace Connect accepts no new Etsy connections [14]. CedCommerce is $9/mo for 10 products or $59/mo for 1,000 products and 500 orders [15]. Shuttle has real-time stock sync from $19/mo [16]. | None | Yes, with an app. Test it first. |
| **TikTok Shop** (live) | TikTok's free Shopify app syncs products, orders and stock (rated 4.8 from 16,002 reviews) [28] | One store condition on the listing was unreadable (unverified) | Yes |
| **Instagram / Facebook** | Meta's free Shopify app syncs the catalog [29] | Meta's commerce eligibility | Catalog: yes. In-app checkout: no. Meta removed it in 2025 and buyers pay on your site (likely) [30]. You collect and pay sales tax on these orders since 26/8/2025 [29]. |
| **Amazon** (Seller Central / main marketplace) | Marketplace Connect [13] | Professional plan $39.99/mo. Referral fees 8–45%, most often 15% [39]. | Yes |
| **Amazon Handmade** | Same seller account. Whether Marketplace Connect can create Handmade listings: unverified. | Application and audit. 15% or $0.30 referral. The monthly fee is waived after the first month if approved [40]. Whether pieces made by family artisans in Vietnam qualify: unverified. Hand-altered items (e.g. a mug with a graphic) can qualify [40]. | Yes, after approval |
| **Amazon KDP** | None. KDP is books only. | Open to anyone | **No.** No listing API found [42], so books are uploaded by hand. Claude can prepare the files. Third-party upload extensions may break the terms (unverified), so don't use them. |
| **eBay** | Marketplace Connect [13] | Open. The developer program is free [44]. | Yes |
| **Walmart** | Marketplace Connect (US only) [13] | Business tax ID or license, a history of marketplace sales, fulfillment by Walmart (WFS) or a US warehouse that handles returns, and a barcode (GTIN) or the handmade exemption [43] | Yes, after approval. Shipping direct from Vietnam fails the US-warehouse rule. |
| **Target Plus** | Marketplace Connect, after approval [14] | Invite-only. Ship within 24 hours, deliver within 5 business days (source is a Shopify blog, not Target) [45]. | Only if invited. Not a 2027 plan. |
| **Faire** | Faire's free Shopify app brings orders and stock into Shopify. Fulfillment, cancellations and refunds don't sync back to Faire [35]. | Brand application and approval [36]. Fees unverified [37]. | Mostly |
| **YouTube Shopping** | Shopify's Google & YouTube channel [31] | 1,000 subscribers plus the YouTube Partner Program. In-app checkout is US only. | Yes, after the gate |
| **X** | Marketing only. X's Shopify app does ads and a tracking pixel [34], and the pixel clashes with the no-trackers rule. | — | No shopping channel confirmed |
| **Mercari (US)** | Nothing official | — | **No.** No official API found (unverified) [46]. Cross-listing tools are unofficial. List by hand or skip it. |
| **Stripe** | Can't be added separately on a US Shopify store, because Shopify Payments runs on Stripe [18]. On your own site, a Stripe link for deposits is coded but hidden. | — | Official Stripe connector. Older API keys stop working in December, so new agent keys are needed by 30/11/2026 [63]. |
| **PayPal** | PayPal Wallet inside Shopify Payments, with no Shopify fee [17][19]. You dropped PayPal on 21/10. | — | — |
| **Square** | No Shopify checkout (community answers, unverified) [20]. Keep the Square link for deposits. | — | Square connector already present |

**Summary:**
- **Never automatable:** KDP, Mercari, X, and in-app checkout on Facebook and Instagram.
- **Approval gates:** Amazon Handmade, Faire, Walmart, Target Plus and YouTube Shopping.
- **Technically easy:** TikTok, Meta, eBay, Amazon main, and Etsy (with a third-party app).

## 5. Phased plan

**Phase 0: now until about 5/11, before the Nov 8 order-by date, and only after you say "đưa lên"**
1. **You** register purrlight.studio (Cloudflare sells domains at cost; the price wasn't checked) and open a free Cloudflare account. Claude can't create accounts or pay for things.
2. **Claude** moves the deploy to Cloudflare: the same website folder, with check-site and DEPLOY-HOLD kept. Then Claude updates everything in one pass: the Etsy and Linktree links, booth QR codes and confirm links, the Tally redirect (?sent=1#pay) and the Square redirect. The old github.io pages will point to the new address. Claude also swaps the outdated Cloudflare connector for the official one.
3. **You** answer the questions in §8.

If step 1 can't happen by about 5/11, stay on github.io through the season and move in January. Earlier docs rate the GitHub terms risk as low but real. Changing the links on printed QR codes during the order-by window is the bigger risk.

Cost: $0/mo, plus the domain each year.

**Phase 1: 15/11–02/01 (freeze).** No platform work. The Supabase Etsy sync should finish its 7 good nights in a row, which tells you which items actually sell.

**Phase 2: January 2027, Shopify Basic trial** (3 days free, then $1/mo for 3 months [11]; whether a card is needed isn't stated)
- First, check that the Shopify connector can sign into your store. Then Claude imports the ready-made items.
- Turn on the TikTok and Meta apps, and test them on a few products.
- Test one Etsy sync app on 10 or fewer listings before trusting it with all 31. CedCommerce's $9 plan covers exactly 10.
- "Buy" buttons on the site become plain links to the Shopify product pages. Shopify's Buy Button puts Shopify code on your page (inference), which breaks the no-third-party-scripts rule unless you choose to waive it.

Cost: $29/mo billed yearly or $39 monthly, plus $0–59 for the Etsy app, so about **$29–98/mo**, plus card fees.

**Phase 3: spring 2027 onward, one channel at a time.** eBay, then Amazon (and the Handmade application), through Marketplace Connect: free up to 50 synced orders a month, then 1% per order, capped at $99/mo [13]. Then Faire (apply), then YouTube once you have 1,000 subscribers and the Partner Program. Walmart only if stock and returns are in the US. Target only if invited.

| Stage | Monthly cost (before card and channel fees) |
|---|---|
| Today | $0 hosting, Supabase Free, Tally (likely free) |
| Phase 0–1 | $0, plus the domain each year |
| Phase 2 | about $29–98 |
| Optional later | Downpay deposits $29+ [21]; product-options app about $9.90–12.99 [22]; Amazon Professional $39.99 [39]; Supabase Pro $25 if the free project pauses |

The team budget is about $57/mo, but what it already covers isn't recorded (unverified). Phase 2 at the top of the range would go over it.

## 6. Keep vs. retire

**Keep:**
- The custom site and its design rules.
- Custom Orders: the calculator, Tally, and the Zelle/Square links (plus Stripe if you turn it on).
- check-site.js, DEPLOY-HOLD and the deploy script (only its target changes).
- Event Desk.
- The Supabase Etsy sync and the village's anonymous totals.
- The follow strip.
- Etsy as the main channel.
- The GitHub repo as the source of the code.

**Retire or stop:**
- **The Sveltia admin plan, Phases 0–2 (22–30 Claude hours).** Don't build it. Remove the /admin/ test once Shopify holds the products.
- **GitHub Pages as the public host**, after the move.
- **The catalog.csv idea**, replaced by the TikTok and Meta apps.
- **products.js as the master product list.** In Phase 2, Shopify becomes the master for ready-made items.

**Don't add:** WooCommerce, EmDash, the Buy Button script, or Downpay for now.

## 7. Risks, and what would change this

**Risks:**
- **Overselling one-of-a-kind pieces** if a sync app misbehaves. Keep Etsy as the master until the app is proven.
- **Prices and tax drifting apart.** check-site can't see Shopify. Shopify must reproduce Texas tax at 8.25%, no Texas tax on out-of-state orders, and no tax on fruit (not checked).
- **Etsy's Off-Platform Transactions Policy.** Put no Shopify or Custom Orders links in Etsy messages, listings or package inserts until it has been checked word for word.
- **Vendors change the rules.** Marketplace Connect closed to Etsy, Codisto was shut down, Meta removed checkout. So Etsy and Custom Orders stay independent of any one hub.
- **Shopify Basic has 0 staff accounts.** POS-only staff don't count toward the limit only on POS Pro at $89/mo [12][23].
- **Supabase Free may pause** the project (unverified).

**What would change the recommendation:**
- **No new channel in 2027 beyond Etsy and TikTok:** skip Shopify. Do only the Cloudflare move, at $0.
- **You want card checkout built into Custom Orders, with Stripe or Square:** WordPress.com Commerce ($45/mo) [60], not self-hosted WordPress.
- **Etsy-to-Shopify apps prove unreliable:** test Sellbrite. It's free up to 30 orders a month and lists Etsy, Shopify, Amazon, eBay and Walmart [48]. Whether it fits this use is untested.
- **GitHub contacts you about the site:** move the host immediately.

## 8. Open questions for you

1. Which "dashboard" did you mean: the Sveltia admin, Event Desk, or Văn phòng Merlin? What do you want to do yourself that you can't do today?
2. Which 2–3 channels do you really plan to open in 2027?
3. Do the crochet pieces sit in stock in Pearland, or does each one ship from Vietnam? (Walmart, Target, Faire and Amazon Handmade depend on this.)
4. Is each piece one-of-a-kind or repeatable? (This decides how much stock sync matters.)
5. Can you register the domain and Cloudflare account by about 5/11, or should the move wait until January?
6. How do you take card payments at the booth today?
7. What does the ~$57/mo budget already pay for, and can you add $30–100 a month from February?
8. Should Stripe deposits be switched on?
9. Will you allow Shopify scripts or pixels on your site, or keep plain links?

## Sources

All seen 2026-10-27 unless noted.

1. https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits (2026-10-27)
2. https://developers.cloudflare.com/pages/ (2026-10-27)
3. https://developers.cloudflare.com/pages/platform/limits/ (2026-10-27)
4. https://www.cloudflare.com/terms/ (2026-10-27)
5. https://www.cloudflare.com/plans/network-cdn.md (2026-10-27)
6. https://developers.cloudflare.com/workers/platform/pricing/ (2026-10-27)
7. https://developers.cloudflare.com/workers/languages/ (2026-10-27)
8. https://www.cloudflare.com/products/registrar/ (2026-10-27)
9. https://blog.cloudflare.com/emdash-cms-plugin-registry/ ; https://blog.cloudflare.com/emdash-wordpress/ (2026-10-27)
10. https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/ (2026-10-27)
11. https://www.shopify.com/pricing (2026-10-27)
12. https://help.shopify.com/en/manual/your-account/users/users-plan-requirements (2026-10-27)
13. https://apps.shopify.com/marketplace-connect (2026-10-27)
14. https://help.shopify.com/en/manual/online-sales-channels/marketplace-connect/requirements ; https://help.shopify.com/en/manual/online-sales-channels/marketplaces/marketplace-connect (2026-10-27)
15. https://apps.shopify.com/etsy-marketplace-integration (2026-10-27)
16. https://apps.shopify.com/shuttle-transfer-from-etsy (2026-10-27)
17. https://help.shopify.com/en/manual/payments/third-party-providers (2026-10-27)
18. https://help.shopify.com/en/manual/payments/third-party-providers/payment-gateway-availability (2026-10-27)
19. https://help.shopify.com/en/manual/payments/paypal ; https://help.shopify.com/en/manual/payments/shopify-payments/supported-countries/united-states/paypal-wallet (2026-10-27)
20. https://community.shopify.com/t/how-can-i-integrate-square-payment-with-my-ecommerce-platform/81334 (2026-10-27, community answers, unverified)
21. https://apps.shopify.com/downpay (2026-10-27)
22. https://apps.shopify.com/product-options-pro ; https://apps.shopify.com/easify-product-options ; https://apps.shopify.com/customization-information-for-products (2026-10-27)
23. https://www.shopify.com/pos/pricing (2026-10-27)
24. https://help.shopify.com/en/manual/shopify-admin/shopify-app (2026-10-27)
25. https://help.shopify.com/en/manual/shopify-admin/productivity-tools/sidekick ; https://www.shopify.com/build-with-ai (2026-10-27)
26. https://shopify.dev/docs/apps/build/ai-toolkit (2026-10-27)
27. https://help.shopify.com/en/manual/online-sales-channels/buy-button (2026-10-27)
28. https://apps.shopify.com/tiktok (2026-10-27)
29. https://apps.shopify.com/facebook ; https://help.shopify.com/en/manual/online-sales-channels/social-commerce/facebook-instagram-by-meta (2026-10-27)
30. https://www.bigcommerce.com/blog/updates-to-meta-shops-checkout-for-bigcommerce/ (2026-10-27, likely)
31. https://help.shopify.com/en/manual/online-sales-channels/google/youtube-shopping (2026-10-27)
32. https://support.google.com/youtube/answer/12258186?hl=en (2026-10-27)
33. https://woocommerce.com/document/youtube-shopping-google-for-woocommerce/ (2026-10-27)
34. https://apps.shopify.com/x (2026-10-27)
35. https://apps.shopify.com/faire-sell-wholesale ; https://help.shopify.com/en/manual/online-sales-channels/faire/brands ; https://help.shopify.com/en/manual/online-sales-channels/faire/brands/fulfillment (2026-10-27)
36. https://www.faire.com/support/articles/18525420655003 (2026-10-27, search snippet only; direct fetch returned 403)
37. https://craftybase.com/blog/how-much-does-faire-charge (2026-10-27, third-party, unverified)
38. https://wordpress.org/plugins/faire-for-woocommerce/ (2026-10-27)
39. https://sell.amazon.com/pricing (2026-10-27)
40. https://sell.amazon.com/programs/handmade (2026-10-27)
41. https://developer-docs.amazon/sp-api/docs/onboarding-overview (2026-10-27)
42. https://kdp.amazon.com/en_US/ ; https://kdp.amazon.com/terms-and-conditions (2026-10-27)
43. https://marketplace.walmart.com/ ; https://marketplacelearn.walmart.com/guides/request-a-gtin-exemption ; https://developer.walmart.com/ (2026-10-27)
44. https://developer.ebay.com/develop/guides/sell/get-started-with-ebay-apis (2026-10-27)
45. https://www.shopify.com/blog/what-is-target-plus (blog dated 2026-09-23; seen 2026-10-27)
46. https://www.mercari.com/help_center/article/341 ; https://crosslist.com/integrations/shopify-to-mercari (2026-10-27, unverified)
47. https://developers.etsy.com/documentation/ (2026-10-27)
48. https://www.sellbrite.com/pricing/ ; https://sellbrite.com/pricing-pro (2026-10-27)
49. https://wordpress.org/plugins/woocommerce/ (2026-10-27)
50. https://woocommerce.com/products/woocommerce-deposits/ (2026-10-27)
51. https://woocommerce.com/products/product-add-ons/ (2026-10-27)
52. https://woocommerce.com/products/multichannel-by-cedcommerce-ebay-amazon-walmart-etsy-integration/ ; https://woocommerce.com/products/etsy-integration-for-woocommerce/ (2026-10-27)
53. https://woocommerce.com/products/amazon-ebay-walmart-integration-plugin-for-woocommerce-by-m2e/ (2026-10-27)
54. https://wordpress.org/plugins/codistoconnect/ (2026-10-27)
55. https://woocommerce.com/document/woopayments/fees-and-debits/fees/ (2026-10-27)
56. https://woocommerce.com/products/stripe/ ; https://woocommerce.com/products/woocommerce-paypal-payments/ ; https://woocommerce.com/products/square/ (2026-10-27)
57. https://woocommerce.com/document/tiktok-for-woocommerce/ (2026-10-27)
58. https://developer.woocommerce.com/docs/features/mcp/ (2026-10-27)
59. https://wordpress.com/support/mcp/ (2026-10-27)
60. https://wordpress.com/pricing/ (2026-10-27)
61. https://www.hostinger.com/woocommerce-hosting (2026-10-27)
62. https://patchstack.com/whitepaper/state-of-wordpress-security-in-2026/ (2026-10-27)
63. https://stripe.com/pricing ; https://docs.stripe.com/mcp (2026-10-27)
64. https://www.paypal.com/us/business/paypal-business-fees (2026-10-27)
65. https://squareup.com/us/en/payments/our-fees ; https://developer.squareup.com/docs/mcp (2026-10-27)
66. Internal repo, read 2026-10-27:
    - /home/user/purrlight-skills/website/README.md
    - /home/user/purrlight-skills/docs/PURRLIGHT-WEBSITE-TONG-HOP.md
    - /home/user/purrlight-skills/docs/ADMIN-DASHBOARD-PLAN-2026-10-20.md
    - /home/user/purrlight-skills/docs/PAYMENT-MERLIN-PLAN-2026-10-21.md
    - /home/user/purrlight-skills/docs/GOOGLE-UCP-2026-10-21.md
    - /home/user/purrlight-skills/.claude/skills/HOUSE-RULES.md
    - /home/user/purrlight-skills/website/tools/check-site.js
    - /home/user/purrlight-skills/DEPLOY-HOLD