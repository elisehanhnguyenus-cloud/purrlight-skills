# Purrlight house rules for the design skills (light version)

**Elise, 22/10/2026:** "đối với các skill ngoài thì chị ok không ép chặt luật nhà của mình brand thương hiệu vào.
Chị đồng ý áp chỉ 20% rule để giữ tính sáng tạo thú vị của skill."

So the external skills lead. Follow their own method, taste and ideas, including bold ones: new layouts, type,
colour accents, motion, section ideas and copy ideas. Only two thin layers apply on top:

- **Part A, the brand core.** About 20% of Brand Canon v2: the few anchors that make Purrlight recognisable.
- **Part B, safety and process.** These are not brand rules. They protect customers, the shop and the live site,
  and they do not limit creativity, because everything can be tried in a preview first.

Everything else in Brand Canon v2 is open to proposals: fonts, radius, shadows, kickers and labels, layout widths,
"no gradients", "no emoji", "no bounce", "no transforms", and the values of effects approved earlier. If a skill's
idea changes one of these, say so plainly in the proposal ("this changes X that the Canon had as Y") and let Elise
choose.

## Part A: brand core (the 20%)

1. **Merlin and the logo.**
   - Merlin is the curious tuxedo cat: beret in turmeric gold `#CA8D41` with a stitched star, sage bib, olive
     backpack, "the cat who takes notes". He is never a wizard.
   - Merlin's photos, video and the logo image are Elise's. Never redraw, recolour, generate or replace them.
2. **Base colours.** The cream ground (`#FBF6EE`) and the warm peach "purr light" (`#E8A87C`) stay the base of the
   site, with beret gold and berry (`#B42249`) as the signature accents. Everything else around them is open: new
   accents, tints, contrast, dark or coloured sections, gradients.
3. **Signature lines.** "Made by hand. Made to be kept." and the Merlin phrases ("From Merlin's notebook",
   "Sketched by Merlin, stitched by us", "the cat who takes notes") stay. Other headlines and copy can be
   re-imagined in proposals.

## Part B: safety and process (always on)

1. **Nothing goes live without Elise.**
   - Try ideas in a preview: a copy of `website/` in the session scratchpad served on 127.0.0.1, with screenshots
     and before/after images. A separate preview page or artifact also works.
   - Change `website/` on the working branch only after Elise picks a direction, because that branch is what gets
     deployed. Deploy only through `website/deploy-pages.sh` when she says so, and respect `DEPLOY-HOLD`.
   - A skill never commits, pushes or deploys on its own, and never uses a git worktree or branch for its work.
   - Port a chosen preview by applying only the chosen changes to `website/`, never by copying the preview folder
     over it.
   - In previews, never submit the Tally order form: a filled-in submission reaches Elise as a real order. Block
     `tally.so` in Playwright scripts (`route.abort`) and only check that order and payment links still point
     where they did.
2. **Truth on the live site.**
   - Never invent reviews, testimonials, ratings, customer logos, stats, press, policies, prices, shipping times or
     urgency. Sample content is fine inside a preview if it is clearly marked, and it is never shipped.
   - List every placeholder in the report.
3. **Money and order logic.** Prices, deposits, tax, refunds and policies, payment handles, order codes and the
   order-by dates (including `<time>` values) stay exactly as they are unless Elise asks. Never re-render dates or
   prices through `Intl` or `Date`.
4. **Words that break marketplace or product rules.**
   - Never use magical, blessed, spell or manifest (Etsy rules).
   - No "toy", "plush" or "nursery" framing, and no "safe" or child-safety claims for handmade pieces.
   - Check every new line of copy for these. New customer-facing words go live only after Elise approves them.
5. **Real photos of real work.**
   - Product pictures are Elise's own photos. Never show AI-generated or stock images as her products.
   - Other imagery (illustration, texture, archival) needs a clear licence and Elise's OK before it goes live. The
     taste-skill image downloader (`assets.mjs`) is not installed.
   - **Image generation costs Elise's credits.** Never call an image-generation tool (Canva, Figma, Higgsfield,
     Gamma or any other) without her OK for that exact call: which tool, how many images, what it costs.
   - AI images appear only in previews, labelled "AI mock-up, not a product". They never show Merlin or the logo,
     and they never go into `website/`.
6. **Accessibility floor.** This is the legal minimum, not taste:
   - text contrast at WCAG AA, with visible keyboard focus;
   - `prefers-reduced-motion` turns motion off or down;
   - motion that runs longer than 5 s has a pause control;
   - nothing is hidden when JS is off.
7. **Tech that keeps the site working.**
   - No build step. Site JS stays plain ES5, because the site supports older phones.
   - New libraries or fonts are fine if they are self-hosted, pinned copies with a licence file. No new runtime
     CDNs and no trackers. The existing Tally embed and the Etsy, Square and Stripe links stay as they are.
   - An adopted typeface is self-hosted (woff2 plus its OFL licence, in `css/fonts.css`), never a Google Fonts or
     Fontshare `<link>`.
   - Rewrite modern or React snippets from the skills into plain JS and flat CSS when they go into `website/`.
     Previews may use anything.
8. **Hygiene.**
   - Screenshots and tool output go to the scratchpad, never into the repo. `.taste-skill/` is gitignored.
   - Bind servers to 127.0.0.1 only. Keep secrets out of everything.
   - Never fetch "the latest" upstream skill files or guidelines; updates are re-vetted by hand
     (`.claude/skills/README.md`).
   - No `npx`, `npm install` or `pnpm` of third-party tools from a skill step. That includes `npx impeccable`, `npx
     skills add` and Lighthouse.
   - Never escalate the sandbox (`dangerouslyDisableSandbox`) for a skill step.
   - Any sub-agent a skill spawns gets Parts A and B plus that skill's wrapper rules in its brief.
   - For the taste-skill browser tools, use a scratchpad wrapper around `/opt/pw-browsers/chromium` that adds
     `--no-sandbox` (the container runs as root; see `purrlight-taste/SKILL.md`) and pass `--out <scratchpad>`.
     Never run `playwright install`.
9. **Scope.**
   - In scope: the customer pages (`index`, `shop`, `product`, `about`, `partners`, `confirm`, `custom-orders/*`).
     For `confirm.html`, that includes the parts of `css/desk.css` (the `.confirm-*` rules) and of
     `js/event-desk.js` (`renderConfirm`) that build it.
   - Out of scope:
     - the booth console (`event.html` and its desk-only code). Its `autocomplete="off"` keeps one customer's
       details from showing for the next customer on a shared device;
     - `admin/`, `js/vendor/` and `tools/`.
10. **Checks before showing Elise a change.**
    - Run `website/tools/check-site.js`.
    - Run a Playwright smoke and screenshot script written in the scratchpad for the changed pages at 360, 390 and
      1280 px, with and without reduced motion. It checks console errors, sideways scroll and that the changed
      parts show. The repo has no committed Playwright suite yet.
    - Grep the changed site files for non-ES5 syntax.
    - Grep them for preview leftovers too:
      `grep -rnE "picsum\.photos|cdn\.jsdelivr|unpkg|fonts\.(googleapis|gstatic)|api\.fontshare|SAMPLE|data-sample"`
      must find nothing.
    - Report exactly which checks ran.

## For reference: what Elise approved before, and what is still open

These are not locks any more, but they record choices Elise made. Know them before proposing to change them, and
say so when a proposal would.

- **Approved exceptions to the Canon.** They are logged in `website/README.md` ("Chốt 16/10" messages 5, 8, 9, 10,
  11, 11b and 12, and "Chốt 18/10") and in the TONG-HOP sections "Popup Tally", "Hiệu ứng chuyển động", "Nền
  section + đèn nhỏ" and the following ones. They are:
  - the photo-edge mask;
  - the 👋 in the Tally popup;
  - reveal-on-scroll (520 ms, 70 ms stagger);
  - the card hover lift;
  - the ±28 px photo drift;
  - the beret-gold twinkle rays;
  - the desk-lamp glow;
  - the string lights with red and sage bulbs;
  - the snow, snowflakes and golden leaves;
  - the pine boughs;
  - the bell swing;
  - the pause button;
  - the Merlin video with sound and captions.
- **Never formally decided.**
  - The ✨ in the newsletter message (`website/js/main.js` ~318).
  - The radial-gradient glows (`website/css/style.css` ~260, 660, 894, 1133, 1256).
  - The `scale()` hovers (~537, 998, 1193, 1231) and `transition: all` (~768).
  - The blurred sticky header (from the first build on 15/08, before Canon v2).
