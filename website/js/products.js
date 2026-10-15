/* ============================================================
   Purrlight Studio — product catalog
   ------------------------------------------------------------
   SOURCE OF TRUTH: the live Etsy shop (vietdelightfinds.etsy.com).
   Prices, listing links, photos and the facts in `details` were taken
   from the shop's RSS feed on 15/10/2026 (the feed lists the 10 most
   recent listings — the rest of the shop is not here yet; see README).
   Re-check against the listing before changing a price here.

   HOW TO EDIT (for Elise):
   - A new listing = copy one block below, set id/name/price/category,
     paste the listing URL into `etsyUrl`, drop the photo in
     assets/img/etsy/ and point `img` at it.
   - Names on the site are ours (canon words); the Etsy title can differ.
   - `addons` (bundle dropdown) is only allowed when the Etsy listing has
     the SAME variation at the same price — none do today, so none here.
   ============================================================ */

const ETSY_SHOP_URL = "https://vietdelightfinds.etsy.com";             /* verified 15/10/2026 */
const TIKTOK_SHOP_URL = "https://www.tiktok.com/@purrlightstudio";     /* TODO: verify exact handle */

const PRODUCTS = [
  {
    id: "anne-shirley-set",
    name: "Red-Braid Storybook Doll Set",
    category: "Storybook & Traditional Tales",
    price: 35,
    badge: "made-to-order",
    img: "assets/img/etsy/4367997103.jpg",
    short: "Three small crochet dolls from the red-braid story — about 15 cm each, made to order.",
    desc: "A set of three hand-crocheted dolls inspired by the red-haired dreamer of the 1908 classic — the kind of keepsake that lives on a bookshelf and gets read to. Each doll is around 15 cm tall (handmade tolerance ±1–2 cm) and made for your order.",
    details: ["Set of three dolls", "About 15 cm / 6\" each (±1–2 cm)", "Made to order", "Spot clean with a damp cloth"],
    etsyUrl: "https://www.etsy.com/listing/4367997103"
  },
  {
    id: "bennet-darcy-set",
    name: "Elizabeth Bennet & Mr Darcy Crochet Doll Pair",
    category: "Storybook & Traditional Tales",
    price: 38,
    badge: "made-to-order",
    img: "assets/img/etsy/4572077122.jpg",
    short: "A Regency pair for the bookshelf — sage empire gown, navy tailcoat, tall riding boots.",
    desc: "Elizabeth and Darcy, hand-crocheted as a pair of Regency art dolls. She wears a sage green empire-waist gown with a scalloped hem and a soft white spencer; he wears a navy tailcoat, white cravat and tall black riding boots. Every face is finished by hand, one stitch at a time, which is why no two pairs are ever quite the same.",
    details: ["Pair of two dolls", "Hand-finished faces", "Made to order", "Spot clean with a damp cloth"],
    etsyUrl: "https://www.etsy.com/listing/4572077122"
  },
  {
    id: "george-washington-doll",
    name: "George Washington Crochet Doll",
    category: "Storybook & Traditional Tales",
    price: 42,
    badge: "made-to-order",
    img: "assets/img/etsy/4467723974.jpg",
    short: "The General, crocheted stitch by stitch — first of our Founding Fathers collection, a display keepsake for America's 250th.",
    desc: "George Washington, the first piece in our Founding Fathers collection, as a crochet doll: Continental Army blue coat, tricorn hat and hand-detailed features, in 8 in (~20 cm) or 10 in (~25 cm). Thomas Jefferson and Benjamin Franklin join the collection in 2026, so the trio can be collected over time. A display keepsake for history lovers and teachers counting down to 1776 + 250 — made to order, with a preview photo for your approval before it ships.",
    details: ["George Washington doll — Jefferson & Franklin join the collection in 2026", "8 in (~20 cm) or 10 in (~25 cm) — choose on Etsy", "Display keepsake — made to order", "Spot clean with a damp cloth"],
    etsyUrl: "https://www.etsy.com/listing/4467723974"
  },
  {
    id: "christening-gown-set",
    name: "Christening Gown Set — lace & satin",
    category: "Faith & Milestones",
    price: 89,
    badge: "",
    img: "assets/img/etsy/4333988358.jpg",
    short: "Gown, bonnet, mittens and booties in embroidered lace and satin — for the quiet, shining day.",
    desc: "An heirloom christening set in embroidered lace and satin: gown, bonnet, mittens and booties, made by hand for baptism or dedication day and meant to be folded away with the photographs afterwards. Sized 3–12 months. Ships from our Texas studio.",
    details: ["Gown, bonnet, mittens and booties", "Embroidered lace and satin", "3–12 months", "Ships from our Texas studio"],
    etsyUrl: "https://www.etsy.com/listing/4333988358"
  },
  {
    id: "rosary-charm",
    name: "Crochet Decade Rosary Charm",
    category: "Faith & Milestones",
    price: 25,
    badge: "",
    img: "assets/img/etsy/4592186429.jpg",
    short: "A one-decade rosary for the rearview mirror or a bag — cotton crochet over wood beads, in your color.",
    desc: "A quiet reminder to pray on the road. Each one-decade rosary is strung by hand in our Pearland, Texas studio from cotton crochet-covered wood beads that are soft to the touch, with a metal crucifix (or a photo charm, if you'd rather) and a clasp for hanging. Comes with a cloth pouch and our prayer card.",
    details: ["Cotton crochet over wood beads, metal crucifix", "Your choice of color", "Cloth pouch + prayer card included", "Hand-strung in Pearland, Texas — ships in 2–4 business days"],
    etsyUrl: "https://www.etsy.com/listing/4592186429"
  },
  {
    id: "maine-coon-cat",
    name: "Maine Coon Crochet Cat",
    category: "Merlin's World & His Friends",
    price: 55,
    badge: "",
    img: "assets/img/etsy/4337395489.jpg",
    short: "The big shaggy one — small mane, tufted ears, a tail you can run your fingers through. About 25 cm.",
    desc: "A Maine Coon crocheted stitch by stitch: a 25 cm long-haired cat with a small mane, lightly tufted ear tips and a full fluffy tail. The same body also comes in a Ragdoll colourway — pick whichever breed you love. Boxed and ready to ship.",
    details: ["About 25 cm / 10\" seated", "Maine Coon or Ragdoll colourway", "Chenille velvet yarn — long-pile fur is +$20 on Etsy", "Knitted scarf included", "Ready to ship", "Spot clean with a damp cloth"],
    etsyUrl: "https://www.etsy.com/listing/4337395489"
  },
  {
    id: "british-shorthair-cat",
    name: "British Shorthair Crochet Cat — Sherlock outfit",
    category: "Merlin's World & His Friends",
    price: 55,
    badge: "made-to-order",
    img: "assets/img/etsy/4337895128.jpg",
    short: "Gray-and-white, pink nose, white paws — and a Sherlock-style outfit with removable accessories.",
    desc: "A British Shorthair in gray and white with a pink nose, white belly and white paws, dressed in a Sherlock-style outfit with removable accessories. Crocheted by hand for your order — not a pattern, the finished cat.",
    details: ["Gray and white, pink nose", "Sherlock-style outfit with removable accessories", "Made to order — processing time 1–2 weeks"],
    etsyUrl: "https://www.etsy.com/listing/4337895128"
  },
  {
    id: "custom-pet-grand",
    name: "Your Pet, Crocheted — Grand",
    category: "Merlin's World & His Friends",
    price: 150,
    badge: "made-to-order",
    img: "assets/img/etsy/4364432946.jpg",
    short: "Your own cat (or other pet), made from your photos — the big one, 16–21 inches.",
    desc: "The Grand size of our custom pet portraits: your cat or other pet, crocheted from the photos you send, 16–21 in (about 40–53 cm), made for your order. Send the clearest photos you have — front-on, in daylight if you can — and we work from those.",
    details: ["Grand size: 16–21 in / 40–53 cm (over 14 in)", "Personalized to your pet — made from your photos", "Made to order", "Spot clean with a damp cloth"],
    etsyUrl: "https://www.etsy.com/listing/4364432946"
  },
  {
    id: "horse-companion",
    name: "Large Knitted Horse",
    category: "Feelings & Calm",
    price: 55,
    badge: "",
    img: "assets/img/etsy/4368649382.jpg",
    short: "An oversized, hug-sized horse knitted in soft fluffy yarn — about 40 cm long.",
    desc: "A generously sized horse, about 40 cm (15.75\") long, knitted by hand in ultra-soft fluffy yarn — the kind of companion that ends up on the bed, the sofa and the reading corner in turn.",
    details: ["About 40 cm / 15.75\" long", "Hand-knitted in soft fluffy yarn", "Spot clean with a damp cloth; hand wash cold if needed, lay flat to dry"],
    etsyUrl: "https://www.etsy.com/listing/4368649382"
  },
  {
    id: "dragon-pattern",
    name: "Sleeping Dragon — Crochet Pattern (PDF)",
    category: "Patterns & Printables",
    price: 1.75,
    badge: "new",
    img: "assets/img/etsy/4399784660.jpg",
    short: "A downloadable pattern for a 120 cm sleeping dragon in super bulky chenille — for makers.",
    desc: "A digital PDF crochet pattern (US terms) for a 120 cm / 47\" Sleeping Dragon in super bulky chenille yarn with an 8 mm hook: round-by-round instructions, stitch counts, tick tables and assembly tips. This is the pattern, not a finished piece.",
    details: ["Digital PDF — instant download", "US crochet terms", "Finished size about 120 cm / 47\"", "Super bulky chenille yarn, 8 mm hook"],
    etsyUrl: "https://www.etsy.com/listing/4399784660"
  }
];

/* Which pieces the standard care/safety copy applies to (shared by product.html and the Event Desk):
   NOT_HANDMADE     — digital patterns / printed-to-order / molded items: no "made by hand", no spot-clean care, no safety line.
   SAFETY_LINE_SKIP — a christening garment cannot carry "Not suitable for children under 3", and a rosary
   charm is not a children's item. Only the verbatim safety line is ever shown; nothing replaces it. */
const NOT_HANDMADE = ["dragon-pattern"];
const SAFETY_LINE_SKIP = ["christening-gown-set", "rosary-charm"];

const CATEGORIES = [
  { name: "Storybook & Traditional Tales", img: "assets/img/etsy/4367997103.jpg" },
  { name: "Feelings & Calm", img: "assets/img/etsy/4368649382.jpg" },
  { name: "Faith & Milestones", img: "assets/img/etsy/4333988358.jpg" },
  { name: "Merlin's World & His Friends", img: "assets/img/etsy/4337395489.jpg" },
  { name: "Patterns & Printables", img: "assets/img/etsy/4399784660.jpg" }
];

/* Canon co 7 collections — 2 collection duoi day chua co listing tren Etsy
   (Little Things: linen doll bag charm, stress ball set… chua len feed),
   chi hien tile "soon" tren trang chu, KHONG vao filter (tranh trang loc rong): */
const UPCOMING_CATEGORIES = [
  { name: "Little Things", img: "assets/img/cat-keychains.svg" },
  { name: "Heritage & Celebration", img: "assets/img/tile-heritage.svg" }
];
