/* ============================================================
   Purrlight Studio — product catalog
   ------------------------------------------------------------
   SOURCE OF TRUTH: the live Etsy shop (vietdelightfinds.etsy.com).
   20/10/2026: ALL 31 active listings (the shop shows 32 — the 8 USD
   "International shipping service" listing is a shipping fee, not a piece,
   so it is left out). Read from the shop page + one RSS feed per shop
   section; order = the shop's own order on Etsy. Copy was written from each
   listing's description only (facts only, Brand Canon v2 words) and checked
   a second time against the listing. Re-check the listing before changing a
   price here.

   HOW TO EDIT (for Elise):
   - A new listing = copy one block below, set id/name/price/category,
     paste the listing URL into `etsyUrl`, put a square photo in
     assets/img/products/ (<id>-600.webp, and <id>.webp up to 1000 px if the
     photo is bigger) and point `img` / `imgLarge` at them.
   - Names on the site are ours (canon words); the Etsy title can differ.
   - `price` is the regular price; a sale goes in SALES below, with its end date.
   - `priceFrom: true` when Etsy options change the price (sizes, single doll or pair, set of 3 or 6…):
     `price` is then the lowest option, the site shows "from $X" and the Event Desk asks for the option's price.
   - `addons` (bundle dropdown) is only allowed when the Etsy listing has
     the SAME variation at the same price — none do today, so none here.
   ============================================================ */

const ETSY_SHOP_URL = "https://vietdelightfinds.etsy.com";             /* verified 15/10/2026 */
const TIKTOK_SHOP_URL = "https://www.tiktok.com/@purrlightstudio";     /* TODO: verify exact handle */

const PRODUCTS = [
  {
    id: "christening-gown-set",
    name: "Lace & Satin Christening Gown Set",
    category: "Faith & Milestones",
    price: 89,
    badge: "",
    img: "assets/img/products/christening-gown-set-600.webp",
    imgLarge: "assets/img/products/christening-gown-set.webp",
    short: "A christening gown, bonnet, mittens, booties and socks in embroidered lace and satin, sized 3–12 months.",
    desc: "An heirloom christening set in embroidered lace and satin: a gown with cross and floral embroidery, a lace-trimmed bonnet, embroidered mittens, satin-trimmed booties and socks. Made by hand for a baptism, christening or dedication day, and meant to be kept and passed down afterwards. Sized 3–12 months, it comes in a keepsake box, in stock and ready to ship from Texas.",
    details: ["Gown, bonnet, mittens, booties and socks", "Gown in a cotton, linen, muslin, lace and satin blend", "Cross and floral embroidery; lace-trimmed bonnet, satin-trimmed booties", "Sizes 3–12 months", "Packaged in a keepsake box", "In stock in the USA — ships from Texas"],
    etsyUrl: "https://www.etsy.com/listing/4333988358"
  },
  {
    id: "maine-coon-cat",
    name: "Maine Coon Crochet Cat",
    category: "Merlin's World & His Friends",
    price: 55,
    priceFrom: true,
    badge: "",
    img: "assets/img/products/maine-coon-cat-600.webp",
    short: "The big shaggy one, about 25 cm seated, with a small mane, tufted ear tips and a full tail you can run your fingers through.",
    desc: "A Maine Coon crocheted stitch by stitch: a 25 cm long-haired cat with a small mane, lightly tufted ear tips and a full fluffy tail. The same body also comes in a Ragdoll colorway, so you can pick the breed you love. The body is worked at a tight tension, roughly 18 hours per cat, so it holds its shape on a shelf instead of slumping. A knitted scarf comes with it.",
    details: ["About 25 cm / 10 in seated, about 450 g", "Maine Coon or Ragdoll colorway", "Chenille velvet yarn included; long-pile fur is +$20 on Etsy", "Knitted scarf included", "Ships from our studio in Nha Trang, Vietnam", "Spot clean with a damp cloth, then air dry"],
    etsyUrl: "https://www.etsy.com/listing/4337395489"
  },
  {
    id: "linen-pocket-doll",
    name: "Linen Pocket Doll Bag Charm",
    category: "Little Things",
    price: 22,
    badge: "",
    img: "assets/img/products/linen-pocket-doll-600.webp",
    short: "A pocket-size linen doll with soft yarn hair and a lace-trimmed floral dress, about 14–17 cm (5.5–6.7 in) tall.",
    desc: "A pocket-size doll with a natural linen body, soft yarn hair and a cotton floral dress with lace trim and hand-embroidered details, made in small batches. Light and soft, she can ride along in a backpack, hang as a bag charm or sit on a shelf. Each doll is slightly unique, and you choose the dress print and hair color on Etsy.",
    details: ["About 14–17 cm (5.5–6.7 in) tall", "Natural linen body, cotton dress, soft yarn hair, fiberfill, hand embroidery; lace hem and bow accents", "Choose dress print and hair color on Etsy, or message for a custom mix; name/date gift card at no extra cost", "Care: spot clean gently with a damp cloth; do not machine wash or tumble dry", "Processing: 1–3 business days for in-stock styles, 6–7 days for personalized orders", "US storage available at our Pearland, Texas hub"],
    etsyUrl: "https://www.etsy.com/listing/4378892426"
  },
  {
    id: "anne-shirley-set",
    name: "Red-Braid Storybook Doll Set",
    category: "Storybook & Traditional Tales",
    price: 35,
    badge: "made-to-order",
    img: "assets/img/products/anne-shirley-set-600.webp",
    imgLarge: "assets/img/products/anne-shirley-set.webp",
    short: "Three crochet dolls inspired by the red-haired dreamer of the 1908 classic — about 15 cm each, made to order.",
    desc: "A set of three hand-crocheted dolls inspired by the spirited red-haired heroine of a 1908 classic novel, her friends and their country life. The outfits have a vintage feel — straw hats, aprons, tiny books and flowers — and the mini accessories are removable. Each doll is around 15 cm tall (handmade tolerance ±1–2 cm) and is made for your order.",
    details: ["Set of three crochet dolls", "About 15 cm / 6 in each (handmade tolerance ±1–2 cm)", "Removable mini accessories — book, flowers, hat as shown", "Optional: choose a dress color palette (pastel, lavender, blue, neutral) and add a short gift note", "Made to order — typical processing 7–12 business days", "Spot clean with a damp cloth; air dry"],
    etsyUrl: "https://www.etsy.com/listing/4367997103"
  },
  {
    id: "dashwood-ferrars-set",
    name: "Elinor Dashwood & Edward Ferrars Crochet Dolls",
    category: "Storybook & Traditional Tales",
    price: 40.99,
    priceFrom: true,
    badge: "made-to-order",
    img: "assets/img/products/dashwood-ferrars-set-600.webp",
    short: "Elinor and Edward, hand-crocheted Regency art dolls inspired by Sense and Sensibility — about 18 cm each, made to order.",
    desc: "Elinor Dashwood and Edward Ferrars, inspired by Jane Austen's Sense and Sensibility (1811) and crocheted stitch by stitch as Regency art dolls for the bookshelf. Elinor wears a slate-blue gown with a scalloped hem, a sage-green crossover shawl and a scalloped blue bonnet over long dark ringlets; Edward wears a moss-green tailcoat over a charcoal buttoned waistcoat, a dark neckcloth, sage breeches, black riding boots and a brown top hat that lifts off. Take the pair, or either doll on its own.",
    details: ["The pair, or Elinor or Edward on their own — choose on Etsy", "About 18 cm / 7 in each", "Edward's top hat is removable", "Cotton yarn, polyester fiberfill", "Made to order — crocheted over 3–4 weeks, then ships tracked from our artisan partners in Vietnam", "Dust gently or spot clean with a damp cloth, then air dry; do not machine wash or tumble dry; keep out of direct sun to protect the colors"],
    etsyUrl: "https://www.etsy.com/listing/4597361808"
  },
  {
    id: "bennet-darcy-set",
    name: "Elizabeth Bennet & Mr Darcy Crochet Doll Pair",
    category: "Storybook & Traditional Tales",
    price: 44,
    badge: "made-to-order",
    img: "assets/img/products/bennet-darcy-set-600.webp",
    short: "Elizabeth and Darcy, hand-crocheted Regency art dolls inspired by Pride and Prejudice — about 18 cm each, with wood stands.",
    desc: "Elizabeth Bennet and Mr Darcy, inspired by Jane Austen's Pride and Prejudice (1813) and hand-crocheted as a pair of Regency art dolls for the bookshelf. She wears a sage green empire-waist gown with a scalloped hem and a soft white spencer; he wears a navy tailcoat, a white cravat and tall black riding boots. Every face is embroidered by hand, so no two pairs are ever quite the same, and each doll comes with its own turned wooden stand.",
    details: ["Elizabeth Bennet and Mr Darcy dolls, plus 2 natural turned wood display stands", "About 18 cm / 7 in each, not counting the stand", "Cotton blend yarn, polyester fiberfill, embroidery floss faces", "Made to order — crochet time 2–3 weeks; ships from Vietnam with tracking", "Spot clean only, with a barely damp cloth and a little mild soap; do not machine wash, soak or tumble dry; reshape gently and air dry away from direct sunlight"],
    etsyUrl: "https://www.etsy.com/listing/4572077122"
  },
  {
    id: "ginger-tabby-cat",
    name: "Ginger Tabby Crochet Cat",
    category: "Merlin's World & His Friends",
    price: 55,
    badge: "made-to-order",
    img: "assets/img/products/ginger-tabby-cat-600.webp",
    imgLarge: "assets/img/products/ginger-tabby-cat.webp",
    imgLargeW: 680,
    short: "A 10 in orange tabby with a pink nose, white belly and white paws, dressed in an outfit with removable accessories.",
    desc: "A ginger tabby crocheted by hand, with orange fur, a pink nose, a white belly and white paws. It comes dressed in an outfit with removable accessories. Made for your order, so size and shape vary slightly from piece to piece.",
    details: ["10 in", "Orange fur, pink nose, white belly and paws", "Outfit with removable accessories", "Made to order; processing time 1–2 weeks", "Handmade, so size and shape vary slightly"],
    etsyUrl: "https://www.etsy.com/listing/4337392483"
  },
  {
    id: "rosary-charm",
    name: "Crochet Decade Rosary Charm",
    category: "Faith & Milestones",
    price: 25,
    badge: "made-to-order",
    img: "assets/img/products/rosary-charm-600.webp",
    short: "A one-decade rosary for the rearview mirror, a bag strap or a keyring: cotton crochet over wood beads, in your color.",
    desc: "A quiet reminder to pray on the road. Each one-decade rosary is strung by hand in our Pearland, Texas studio from cotton crochet-covered wood beads with natural wood spacers, a metal crucifix (or a photo charm, if you'd rather) and a clasp for hanging. It comes with a cloth pouch and our prayer card in English. Please hang it where it does not block your view of the road.",
    details: ["Cotton yarn over wood beads, wood spacers, metal alloy crucifix", "About 7–9.5 in (18–24 cm) long, with a clasp for hanging", "About 30 colors — choose on Etsy, or write \"surprise me\"", "Cloth pouch and English prayer card included; gift box, custom card or photo charm optional on Etsy", "Spot clean only", "Hand-strung to order in Pearland, Texas — ships in 2–4 business days"],
    etsyUrl: "https://www.etsy.com/listing/4592186429"
  },
  {
    id: "george-washington-doll",
    name: "George Washington Crochet Doll",
    category: "Heritage & Celebration",
    price: 42,
    priceFrom: true,
    badge: "made-to-order",
    img: "assets/img/products/george-washington-doll-600.webp",
    short: "George Washington in Continental Army blue and a tricorn hat — a hand-crocheted keepsake for America's 250th.",
    desc: "George Washington, the first piece in our Founding Fathers collection, crocheted by hand with a Continental Army blue coat, tricorn hat and hand-detailed features. This listing is for Washington; Thomas Jefferson and Benjamin Franklin, shown beside him, belong to the same collection. A display keepsake for history lovers, teachers and collectors marking 250 years of American independence (1776–2026) — made to order, with a preview photo for your approval before it ships.",
    details: ["George Washington doll — Jefferson and Franklin in the photo are part of the same collection", "8 in (~20 cm) standard or 10 in (~25 cm) large — choose on Etsy", "Hand-crocheted in acrylic/wool blend yarn", "Optional hand-stitched American flag or sword accessory — message us before your doll is made", "Made to order — processing 3–5 business days", "Spot clean gently with a damp cloth; keep away from moisture; do not machine wash"],
    etsyUrl: "https://www.etsy.com/listing/4467723974"
  },
  {
    id: "custom-pet-grand",
    name: "Your Pet, Crocheted — Grand",
    category: "Merlin's World & His Friends",
    price: 150,
    badge: "made-to-order",
    img: "assets/img/products/custom-pet-grand-600.webp",
    imgLarge: "assets/img/products/custom-pet-grand.webp",
    imgLargeW: 800,
    short: "Your own cat or other pet, crocheted by hand from your photos in our Grand size: 16–21 inches, big enough to hug.",
    desc: "The Grand size of our personalized pet pieces: your own cat or other pet, crocheted by hand at 16–21 inches (over 14 inches) from the photos you send. It is customized for you and made for your order, a big, huggable likeness of your own companion.",
    details: ["Grand size: 16–21 in / about 40–53 cm (over 14 in)", "Personalized to your cat or other pet — made from your photos", "Crocheted by hand", "Made to order"],
    etsyUrl: "https://www.etsy.com/listing/4364432946"
  },
  {
    id: "british-shorthair-cat",
    name: "British Shorthair Crochet Cat — Sherlock-style outfit",
    category: "Merlin's World & His Friends",
    price: 55,
    badge: "made-to-order",
    img: "assets/img/products/british-shorthair-cat-600.webp",
    short: "Gray and white with a pink nose and white paws, dressed in a Sherlock Holmes-inspired outfit with removable accessories.",
    desc: "A British Shorthair in gray and white, with a pink nose, a white belly and white paws. It comes dressed in an outfit inspired by Sherlock Holmes, with removable accessories. Crocheted by hand for your order; this is the finished cat, not a pattern.",
    details: ["Gray and white, pink nose, white belly and paws", "Sherlock Holmes-inspired outfit with removable accessories", "The finished cat, not a pattern", "Made to order; processing time 1–2 weeks", "Handmade, so size and shape vary slightly"],
    etsyUrl: "https://www.etsy.com/listing/4337895128"
  },
  {
    id: "dragon-pattern",
    name: "Sleeping Dragon — Crochet Pattern (PDF)",
    category: "Patterns & Printables",
    price: 1.75,
    badge: "",
    img: "assets/img/products/dragon-pattern-600.webp",
    imgLarge: "assets/img/products/dragon-pattern.webp",
    imgLargeW: 660,
    short: "A downloadable PDF pattern for a 120 cm sleeping dragon in super bulky chenille — for makers, not a finished piece.",
    desc: "A digital PDF crochet pattern (US terms) for a big-bellied Sleeping Dragon about 120 cm / 47 in from snout to tail, worked in super bulky chenille yarn with an 8.0 mm hook. The body is worked in one piece from snout to tail, with separate legs, ears, horns, wings and spine spikes, stitch counts at the end of every round, tick tables and an assembly guide. Suited to confident beginners through intermediate makers. This is the pattern only; no physical item is sent.",
    details: ["Digital PDF in English, US crochet terms — instant download via Etsy after payment", "Finished size about 120 cm / 47 in; varies with tension, yarn and stuffing", "Uses super bulky chenille yarn (Category 6/7), an 8.0 mm hook and polyester fiberfill — materials not included", "Skill level: confident beginner to intermediate", "Personal-use pattern; finished pieces you make by hand may be sold in small batches with credit to the designer", "Digital download — all sales final"],
    etsyUrl: "https://www.etsy.com/listing/4399784660"
  },
  {
    id: "horse-companion",
    name: "Large Knitted Horse",
    category: "Feelings & Calm",
    price: 55,
    badge: "",
    img: "assets/img/products/horse-companion-600.webp",
    imgLarge: "assets/img/products/horse-companion.webp",
    imgLargeW: 720,
    short: "An oversized horse knitted by hand in soft, fluffy yarn, about 40 cm (15.75 in) long.",
    desc: "A generously sized horse, about 40 cm (15.75 in) long, knitted by hand in Vietnam in ultra-soft fluffy yarn and stuffed with fiberfill. It is big enough for warm hugs, with a rustic charm that suits a farm- or woodland-themed room and any horse lover.",
    details: ["About 40 cm / 15.75 in long", "Hand-knitted in Vietnam in ultra-soft fluffy yarn", "Stuffed with fiberfill", "Spot clean with a damp cloth; air dry"],
    etsyUrl: "https://www.etsy.com/listing/4368649382"
  },
  {
    id: "knitted-giraffe",
    name: "Large Knitted Giraffe",
    category: "Feelings & Calm",
    price: 55,
    badge: "",
    img: "assets/img/products/knitted-giraffe-600.webp",
    imgLarge: "assets/img/products/knitted-giraffe.webp",
    imgLargeW: 770,
    short: "A tall giraffe hand-knitted in soft, fluffy yarn, about 60 cm (23.6 in), in pink, blue or yellow.",
    desc: "Our large giraffe stands about 60 cm (23.6 in) tall, hand-knitted in Vietnam in soft, fluffy yarn with a stretchy, squishy texture. It is stuffed with fiberfill to keep its chunky shape and comes in pastel pink, blue or yellow. A gentle, huggable companion for a safari-themed room or anyone who loves the art of hand-knitting.",
    details: ["About 60 cm / 23.6 in tall", "Hand-knitted in Vietnam in soft, fluffy yarn", "Stuffed with fiberfill", "Pastel colors: Pink, Blue or Yellow (choose on Etsy)", "Spot clean gently with mild soap; do not rub the stitches harshly or wring; lay flat to air dry"],
    etsyUrl: "https://www.etsy.com/listing/4364454125"
  },
  {
    id: "crochet-feelings-faces",
    name: "Crochet Feelings Faces Set",
    category: "Feelings & Calm",
    price: 14,
    priceFrom: true,
    badge: "made-to-order",
    img: "assets/img/products/crochet-feelings-faces-600.webp",
    short: "Palm-sized crochet balls with hand-embroidered feelings faces, in a set of 3 or 6, to name a mood and squeeze it out.",
    desc: "Some days are happy; some are angry, sleepy, dizzy or worried, and that's okay. Each palm-sized ball is hand-crocheted in cotton yarn and wears one hand-embroidered expression, so you can pick the mood you're in or the one you're working toward. Use them for a daily mood check-in, a calm-down corner or a fidget set for your desk. A companion for feelings & fidgeting, made with care, not a medical device.",
    details: ["Choose on Etsy: Set of 3 or Set of 6 emotion balls, with drawstring \"Emotion Sacks\" pouch", "Choose your fill: unfilled shells (standard), bean-filled, or soft cotton-filled", "100% cotton yarn, hand-crocheted; about 5 cm / 2 in each", "Faces: Happy, Sad, Angry, Sleepy, Dizzy, Worried", "Care: Spot clean only; keep dry. Do not machine wash.", "Handmade to order: processing 3–5 business days; ships from Pearland, Texas"],
    etsyUrl: "https://www.etsy.com/listing/4548879570"
  },
  {
    id: "tuxedo-cat",
    name: "Tuxedo Crochet Cat — From Your Photo",
    category: "Merlin's World & His Friends",
    price: 55,
    badge: "made-to-order",
    img: "assets/img/products/tuxedo-cat-600.webp",
    short: "A 10 in black-and-white cat with a pink nose and white paws, crocheted to look like your own cat from a photo.",
    desc: "A tuxedo cat crocheted by hand, with black fur, a white belly, white paws and a pink nose, made to look like your own cat from your photo. It comes in an outfit with a mini gift pocket and removable accessories. Made for your order, so size and shape vary slightly from piece to piece.",
    details: ["10 in", "Black fur, pink nose, white belly and paws", "Made to look like your cat from your photo", "Outfit with a mini gift pocket and removable accessories", "Made to order; processing time 1–2 weeks", "Handmade, so size and shape vary slightly"],
    etsyUrl: "https://www.etsy.com/listing/1889976910"
  },
  {
    id: "knitted-woodland-garden",
    name: "Knitted Woodland Garden Friends",
    category: "Feelings & Calm",
    price: 16,
    priceFrom: true,
    badge: "",
    img: "assets/img/products/knitted-woodland-garden-600.webp",
    imgLarge: "assets/img/products/knitted-woodland-garden.webp",
    imgLargeW: 800,
    short: "Hand-knitted garden friends with embroidered faces: a big tree, hedgehog, carrot, broccoli, mushroom, pear and more.",
    desc: "Little veggies with happy faces and soft woodland creatures, hand-knitted in fluffy textured yarn. Pick your favorites or collect the whole garden, from the 25 cm tree to the pocket-sized hedgehog. Each piece is 100% hand-knitted, so all sizes are approximate, and they're made as keepsakes to be passed down.",
    details: ["Giant tree about 25 cm (10 in); carrot about 10 cm (4 in)", "Broccoli about 12 cm; hedgehog about 8 cm", "Garden friends (acorn, mushroom, pear, pineapple, pumpkin): about 10–12 cm (3.9–4.7 in)", "Pick your favorites or collect the whole garden (choose on Etsy)", "Care: Spot clean with mild soap and cold water to preserve the fuzzy texture and happy embroidered faces; lay flat to dry"],
    etsyUrl: "https://www.etsy.com/listing/4427969443"
  },
  {
    id: "knitted-daisy-duck",
    name: "Knitted Daisy-Pocket Duck",
    category: "Feelings & Calm",
    price: 40,
    badge: "",
    img: "assets/img/products/knitted-daisy-duck-600.webp",
    imgLarge: "assets/img/products/knitted-daisy-duck.webp",
    imgLargeW: 800,
    short: "A hand-knitted duck with long floppy yellow legs, a fluffy white scarf and a daisy-embroidered belly pocket.",
    desc: "A long-necked duck, hand-knitted in Vietnam in soft yarn, with a flat, pillowy body that is cozy to hug. It has long, floppy mustard-yellow legs, a fluffy white scarf and a little belly pocket hand-embroidered with daisies. A sweet companion for duck, goose and farm-animal fans, as room decor or a soft travel pillow.",
    details: ["About 40 cm / 15.7 in from head to toe", "Hand-knitted in Vietnam in soft yarn; stuffed with fiberfill", "Long floppy mustard-yellow legs, fluffy white scarf, belly pocket with hand-embroidered daisies", "Spot clean gently with mild soap and cold water; lay flat to air dry; do not machine wash or wring"],
    etsyUrl: "https://www.etsy.com/listing/4427983754"
  },
  {
    id: "knitted-sheep",
    name: "Fluffy Knitted Sheep",
    category: "Feelings & Calm",
    price: 49,
    badge: "",
    img: "assets/img/products/knitted-sheep-600.webp",
    short: "A curly-coated sheep hand-knitted with textured loop yarn, about 25 cm (10 in), with a bag-charm option.",
    desc: "A little sheep about 25 cm (9.8–10 in) tall, hand-knitted in Vietnam with a special textured loop yarn that gives it a curly, fleece-like coat. It is finished with embroidered details and little knitted legs. Keep it as a classic stuffed piece, or add a metal keychain or leather strap to carry it as a bag charm.",
    details: ["About 25 cm / 9.8–10 in tall", "Hand-knitted in Vietnam with textured loop yarn; stuffed with fiberfill", "Choose on Etsy: classic stuffed, or with a metal keychain or leather strap as a bag charm", "Shades: Cream White, Cherry Red or Warm Caramel (choose on Etsy)", "Spot clean only with a damp cloth and mild soap; do not rub the fleece vigorously; air dry"],
    etsyUrl: "https://www.etsy.com/listing/4361808711"
  },
  {
    id: "siamese-cat",
    name: "Siamese Crochet Cat",
    category: "Merlin's World & His Friends",
    price: 58,
    badge: "made-to-order",
    img: "assets/img/products/siamese-cat-600.webp",
    imgLarge: "assets/img/products/siamese-cat.webp",
    imgLargeW: 680,
    short: "A Siamese with a pink nose, offered in a mini romper with removable accessories or as the cat on its own.",
    desc: "A Siamese cat crocheted by hand, with a pink nose. It comes dressed in a mini romper with removable accessories, or as the body only. Made for your order, so size and shape vary slightly from piece to piece.",
    details: ["Siamese cat with a pink nose", "Mini romper with removable accessories, or body only", "Made to order; processing time 1–2 weeks", "Handmade, so size and shape vary slightly", "Colors may vary slightly from the photos due to studio lighting"],
    etsyUrl: "https://www.etsy.com/listing/4337384028"
  },
  {
    id: "crochet-animal-friends-set",
    name: "Crochet Animal Friends — Set of Four",
    category: "Feelings & Calm",
    price: 24,
    badge: "made-to-order",
    img: "assets/img/products/crochet-animal-friends-set-600.webp",
    imgLarge: "assets/img/products/crochet-animal-friends-set.webp",
    imgLargeW: 800,
    short: "Four 10 cm crochet friends (Amelia, Benny, Bella and Zara), each in its own little outfit with a letter.",
    desc: "Meet Amelia the cat, Benny the dog, Bella and Zara the bunny: four little crochet friends made by hand in cotton yarn. Each wears its own outfit with a letter and a small extra, from a pink headband and a striped scarf to earmuffs and a side bag. At about 10 cm tall, they suit a collector's shelf or make a heartfelt gift.",
    details: ["Set of 4, each about 10 cm tall, crocheted in cotton yarn", "Amelia: grey cat, yellow sweater with a daisy and \"A\", pink headband", "Benny: beige dog, green sweater with \"B\" and a paw print, striped pink scarf", "Bella in pink overalls with earmuffs; Zara the bunny with a tassel scarf and side bag", "Care: Spot clean with mild soap and cool water; air dry completely to keep their shape and colors; avoid long exposure to direct sunlight", "Made to order: processing 1–2 weeks"],
    etsyUrl: "https://www.etsy.com/listing/4335293461"
  },
  {
    id: "saint-joan-of-arc-doll",
    name: "Saint Joan of Arc Crochet Doll",
    category: "Faith & Milestones",
    price: 79,
    priceFrom: true,
    badge: "made-to-order",
    img: "assets/img/products/saint-joan-of-arc-doll-600.webp",
    imgLarge: "assets/img/products/saint-joan-of-arc-doll.webp",
    imgLargeW: 765,
    short: "A hand-crocheted Saint Joan of Arc, about 9 in tall, for anyone who takes Joan or Jeanne as their name saint.",
    desc: "Hand-crocheted in her honor, this Saint Joan of Arc is a keepsake for anyone who takes Joan or Jeanne as their name saint, given at Confirmation, Baptism, First Communion or on her feast day. Each doll is made to order with hand-embroidered details, so no two are quite alike. Choose the doll on her own, a Standard version on a wooden display base with a custom name and cross embroidery, or a version with her fleur-de-lis banner and a custom name. Designed in Texas, made in Vietnam and finished in Texas.",
    details: ["About 23 cm / 9 in tall", "Cotton/acrylic yarn and poly-fill, with hand-embroidered details", "Versions on Etsy: Regular (doll only); Standard (wooden display base, custom name and cross embroidery, listed at $120); and a banner version (fleur-de-lis banner embroidery and custom name)", "Spot clean only. Keep the wooden base dry. Display away from direct sun to keep colors vivid.", "Made to order — 14–20 business days before it ships", "Ships from our Vietnam workshop or our storage hub in Pearland, Texas"],
    etsyUrl: "https://www.etsy.com/listing/4558481857"
  },
  {
    id: "bride-groom-crochet-couple",
    name: "Personalized Bride & Groom Crochet Couple",
    category: "Faith & Milestones",
    price: 200,
    badge: "made-to-order",
    img: "assets/img/products/bride-groom-crochet-couple-600.webp",
    short: "A hand-crocheted bride and groom, about 9 in tall, with skin tones, hair and outfit colors chosen to look like the couple.",
    desc: "A bride and groom in hand-crocheted amigurumi, made to look like the couple you're celebrating: you choose skin tones, hair color and style, and outfit colors. They stand together on a solid wooden display base, with faux pearl accents, a bouquet and a boutonnière, and come in a keepsake gift box with a personalized anniversary card. For a wedding, an engagement, a 5th, 25th or 50th anniversary, or a gift for parents or grandparents. Each couple is handmade to your personalization, then finished and packed in our Pearland, Texas studio.",
    details: ["Bride and groom, about 8.7–9.4 in (22–24 cm) tall each", "Cotton yarn, faux pearl beads, polyester fill, wooden display base", "Personalize on Etsy: skin tones, hair color and style, outfit/dress color, names and date on the box, a short card message", "Keepsake gift box and personalized anniversary card included", "Spot clean with a slightly damp cloth; do not machine wash. Keep your keepsake dry and out of direct sunlight.", "Made to order — about 4 weeks crafting time, then finished and packed in Pearland, Texas; ships from Texas"],
    etsyUrl: "https://www.etsy.com/listing/4467726345"
  },
  {
    id: "americana-doll-bag-charm",
    name: "Americana Linen Doll Bag Charm",
    category: "Heritage & Celebration",
    price: 20,
    badge: "",
    img: "assets/img/products/americana-doll-bag-charm-600.webp",
    short: "A small linen folk-art doll in red, white and blue on a stainless-steel ring — about 15 cm, for a bag or a tiered tray.",
    desc: "A handmade Americana doll made for America's 250th anniversary (1776–2026), inspired by primitive folk art and the spirit of Betsy Ross. She has a linen body, a coarse cotton homespun-style dress and yarn hair, and hangs from a stainless-steel keychain ring — clip her to a handbag or backpack, hang her from a car mirror, or sit her on a shelf or a 4th of July tiered tray. No two are exactly alike.",
    details: ["About 15 cm / 5.9 in tall", "Linen doll body, coarse cotton (homespun-style) dress and accessories, yarn hair", "Stainless-steel keychain ring", "Ships from Pearland, Texas — processing 1 business day", "Spot clean only with a damp cloth + mild soap. Air dry flat. Do not machine wash."],
    etsyUrl: "https://www.etsy.com/listing/4493251609"
  },
  {
    id: "white-cat",
    name: "White Crochet Cat",
    category: "Merlin's World & His Friends",
    price: 55,
    badge: "made-to-order",
    img: "assets/img/products/white-cat-600.webp",
    imgLarge: "assets/img/products/white-cat.webp",
    imgLargeW: 650,
    short: "A 10 in white cat with a pink nose and paws, dressed in an outfit with removable accessories.",
    desc: "A white cat crocheted by hand, with white fur and a pink nose and paws. It comes dressed in an outfit with removable accessories. Made for your order, so size and shape vary slightly from piece to piece.",
    details: ["10 in", "White fur, pink nose and paws", "Outfit with removable accessories", "Made to order; processing time 1–2 weeks", "Handmade, so size and shape vary slightly"],
    etsyUrl: "https://www.etsy.com/listing/4336898722"
  },
  {
    id: "custom-soccer-doll",
    name: "Your Soccer Player, Crocheted",
    category: "Heritage & Celebration",
    price: 64,
    priceFrom: true,
    badge: "made-to-order",
    img: "assets/img/products/custom-soccer-doll-600.webp",
    short: "A crochet look-alike of your player, fan or coach from your photo — team colors, any number and a removable kit.",
    desc: "Send a photo and our artisan team crochets a look-alike soccer player: yourself, a loved one, a coach or the team's MVP. The jersey, shorts and socks come in your team colors with any player number, with skin tone, hair and facial hair to match, and the kit comes off so the doll can be re-dressed. Tiny details include cleats, wristbands and a mini crochet soccer ball.",
    details: ["About 8 in / 20 cm or 10 in / 25 cm — choose on Etsy", "Personalize jersey colors, number, optional name on back, skin tone and hair; upload 1–2 clear front photos", "Cotton yarn, fiberfill; removable outfit", "Made to order — allow 10–12 days to craft; personalized items can't be returned, so message within 24 hours for changes", "Spot clean gently with a damp cloth and mild soap. Air dry flat. Do not machine wash or tumble dry."],
    etsyUrl: "https://www.etsy.com/listing/4467740813"
  },
  {
    id: "quilted-cat-pouch",
    name: "Quilted Appliqué Cat Pouch",
    category: "Little Things",
    price: 28,
    badge: "",
    img: "assets/img/products/quilted-cat-pouch-600.webp",
    short: "A hand-quilted cotton/linen coin pouch with a 3D appliqué cat, zipper and hanging strap; add a name if you like.",
    desc: "A small quilted coin purse with a 3D appliqué cat, hand quilted and hand-stitched in a soft cotton/linen mix, made in small batches. Choose a round cat or a standing cat. The zipper keeps coins, cards, lip balm or earbuds inside, and the strap clips to a tote or backpack as a bag charm or keychain. Fabric placement and faces vary slightly, so your cat will be one of a kind.",
    details: ["Choose 1 round cat (12 x 11 cm / 4.7 x 4.3 in) or 1 standing cat (18 x 10 cm / 7.1 x 3.9 in)", "Zipper closure; hanging strap 17 cm (6.7 in)", "Hand quilted, hand-stitched appliqué; soft cotton/linen mix", "Optional embroidered name/initials, up to 10 characters (default brown thread); adds 1–2 business days", "Care: Spot clean gently with mild soap; air dry. Do not bleach."],
    etsyUrl: "https://www.etsy.com/listing/4345205143"
  },
  {
    id: "ribbon-corduroy-bag",
    name: "Ribbon-Embroidered Corduroy Handbag",
    category: "Little Things",
    price: 55,
    badge: "",
    img: "assets/img/products/ribbon-corduroy-bag-600.webp",
    imgLarge: "assets/img/products/ribbon-corduroy-bag.webp",
    imgLargeW: 605,
    short: "A compact corduroy handbag with raised 3D ribbon-embroidered flowers, a top handle and a detachable crossbody strap.",
    desc: "Raised 3D flowers in silk ribbon bloom against soft corduroy on this compact handbag, hand-embroidered by an artisan from Vietnam with more than 10 years of ribbon-embroidery experience. Carry it by the sturdy top handle, or add the detachable strap to wear it crossbody or on the shoulder. It holds a phone up to 7 x 5.4 in, a compact wallet, lipstick and keys, with a zipper and a small inner pocket. Each bag is 100% handmade, so the embroidery varies slightly.",
    details: ["Top width 22.5 cm (8.8 in); body height 15 cm (6 in); height with handle 22 cm (8.6 in); bottom width 7.5 cm (3 in)", "Detachable strap 100 cm (39.5 in) for crossbody or shoulder wear", "Corduroy, silk ribbons, gold-tone hardware", "Zipper closure and a small inner pocket", "Care: Gentle spot clean or dry clean only to protect the embroidery."],
    etsyUrl: "https://www.etsy.com/listing/4455357436"
  },
  {
    id: "angel-portrait-doll",
    name: "Custom Crochet Angel Portrait Doll",
    category: "Faith & Milestones",
    price: 79,
    badge: "made-to-order",
    img: "assets/img/products/angel-portrait-doll-600.webp",
    imgLarge: "assets/img/products/angel-portrait-doll.webp",
    imgLargeW: 690,
    short: "A hand-crocheted angel made to look like someone you love, about 8 in tall on a wooden stand — a memorial keepsake.",
    desc: "A hand-crocheted angel portrait of someone you love, with white wings and a small handmade bouquet, on a sturdy wooden stand. The angel in the photo was a custom order: a grandmother in a light blue shirt embroidered with tiny flowers, a cross necklace, soft gray Brazil wool hair and a pink-and-white rose bouquet. For a desk, a shelf, a bedside table or a memorial altar — a memorial keepsake, a sympathy gift, or a present for a grandmother.",
    details: ["About 20 cm / 8 in tall", "Crocheted by hand in cotton yarn", "Wooden stand included", "Custom portrait, made to your loved one's features", "Gently spot clean with mild soap. Air dry flat in the shade. Please do not machine wash or tumble dry.", "Made to order — allow 14 days crafting time"],
    etsyUrl: "https://www.etsy.com/listing/4467697803"
  },
  {
    id: "christmas-elf",
    name: "Crochet Christmas Elf",
    category: "Heritage & Celebration",
    price: 45,
    badge: "made-to-order",
    img: "assets/img/products/christmas-elf-600.webp",
    imgLarge: "assets/img/products/christmas-elf.webp",
    imgLargeW: 790,
    short: "A hand-crocheted Christmas elf in a striped pointy hat, mustard scarf and red boots — about 26 cm tall with the hat.",
    desc: "A handmade crochet Christmas elf in a classic holiday palette: striped pointy hat, cozy mustard scarf, green trousers, red boots and tiny button details. About 26 cm tall including the hat, the elf stands or sits on a shelf, in a tiered tray or beside the tree. For a boy-and-girl pair or custom colors, send a message on Etsy.",
    details: ["About 26 cm / 10.2 in tall, including hat", "Cotton/acrylic yarn, fiberfill, wooden/plastic buttons", "Boy + girl pair or custom colors on request — message on Etsy", "Made to order in small batches; processing 3–5 business days", "Spot clean with a damp cloth; lay flat to dry. Do not machine wash."],
    etsyUrl: "https://www.etsy.com/listing/4382239441"
  },
  {
    id: "calico-crochet-cat",
    name: "Calico Crochet Cat",
    category: "Merlin's World & His Friends",
    price: 55,
    badge: "made-to-order",
    img: "assets/img/products/calico-crochet-cat-600.webp",
    short: "A crocheted calico cat, about 10 inches, with three-color fur, a pink nose and white paws, made for your order.",
    desc: "A calico cat crocheted by hand, with three-color fur, a pink nose, a white belly and white paws. It is about 10 inches and is made for your order: a finished crocheted piece, not a digital pattern. Because each one is handmade, size and shape may vary slightly.",
    details: ["About 10 in", "Crocheted by hand: three-color calico fur, pink nose, white belly, white paws", "A finished crocheted piece, not a digital pattern", "Made to order; processing time 1–2 weeks", "Handmade, so size and shape may vary slightly; colors in photos may vary slightly with studio lighting"],
    etsyUrl: "https://www.etsy.com/listing/4336274863"
  }
];

/* Sales (Elise 16/10 and 20/10: the same discount as on Etsy). While a sale runs, p.price is the sale price everywhere
   that reads it (shop cards, the product page, the Event Desk) and p.regular keeps the full price for the struck-through
   display. A "from" price (priceFrom) is the lowest option's sale price; the booth types the chosen option's sale price.
   The Christening Gown Set sale is also in custom-orders/prices.js (gownSale) — change both together. */
const SALES = {
  "christening-gown-set": { off: 25, ends: "2026-10-26T05:00:00Z", through: "Sun, Oct 25 (Central Time)" },   /* midnight CDT */
  "maine-coon-cat": { off: 25, ends: "2026-10-26T05:00:00Z", through: "Sun, Oct 25 (Central Time)" },
  "rosary-charm": { off: 25, ends: "2026-10-26T05:00:00Z", through: "Sun, Oct 25 (Central Time)" },
  "saint-joan-of-arc-doll": { off: 25, ends: "2026-10-26T05:00:00Z", through: "Sun, Oct 25 (Central Time)" },
  "americana-doll-bag-charm": { off: 25, ends: "2026-10-26T05:00:00Z", through: "Sun, Oct 25 (Central Time)" }
};
/* a typo here must never show "$NaN" in the shop or price a piece at $0 at the booth: an entry with an unknown id, an
   `off` that is not a number from 1 to 90 (write 25, not "25%") or an `ends` that is not a real date and time like
   "2026-10-26T05:00:00Z" ("Oct 25" would read as the year 2001, "2026-02-31" as March 3) is skipped, with a console
   warning (tools/check-site.js stops a deploy on the same mistakes) */
function isSaleTime(t) {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/.exec(typeof t === "string" ? t : "");
  if (!m || isNaN(Date.parse(t))) return false;
  const days = new Date(Date.UTC(+m[1], +m[2], 0)).getUTCDate();   /* days in that month */
  return +m[2] >= 1 && +m[2] <= 12 && +m[3] >= 1 && +m[3] <= days && +m[4] < 24 && +m[5] < 60 && !(m[6] && +m[6] > 59);
}
Object.keys(SALES).forEach(function (id) {
  const s = SALES[id];
  const known = PRODUCTS.some(function (p) { return p.id === id; });
  if (!known || !s || typeof s.off !== "number" || !(s.off >= 1 && s.off <= 90) || !isSaleTime(s.ends)) {
    if (typeof console !== "undefined") console.warn("SALES: skipped \"" + id + "\" (unknown id, off not a number 1-90, or ends not a time like 2026-10-26T05:00:00Z)");
    delete SALES[id];
  }
});
PRODUCTS.forEach(function (p) {
  const sale = SALES[p.id];
  if (sale && Date.now() < Date.parse(sale.ends)) {
    p.regular = p.price;
    p.price = Math.round(p.price * (100 - sale.off)) / 100;
    p.sale = sale;
  }
});
/* a page left open past a sale's end (the Event Desk on the booth phone, a shop tab): the full price comes back and the
   page hears "purrlight:prices" — the shop pages reload, the Event Desk re-prices its chips and a new sale's lines */
function endSales() {
  let ended = false;
  PRODUCTS.forEach(function (p) {
    if (p.sale && Date.now() >= Date.parse(p.sale.ends)) { p.price = p.regular; delete p.regular; delete p.sale; ended = true; }
  });
  if (ended) document.dispatchEvent(new CustomEvent("purrlight:prices"));
}
(function () {
  const ends = PRODUCTS.filter(function (p) { return p.sale; }).map(function (p) { return Date.parse(p.sale.ends); });
  if (!ends.length || typeof document === "undefined") return;
  const wait = Math.min.apply(null, ends) - Date.now() + 1000;
  if (wait < 2147483647) setTimeout(endSales, wait);
  document.addEventListener("visibilitychange", function () { if (!document.hidden) endSales(); });   /* sleeping tabs miss timers */
  window.addEventListener("pageshow", endSales);
})();

/* Which pieces the standard care/safety copy applies to (shared by product.html and the Event Desk):
   NOT_HANDMADE     — digital patterns / printed-to-order / molded items: no "made by hand", no spot-clean care, no safety line.
   SAFETY_LINE_SKIP — a christening garment cannot carry "keepsake for adults… keep away from young children", a rosary
   charm is not a children's item, and neither is a coin pouch or a handbag. Only the verbatim safety line is ever shown; nothing replaces it. */
const NOT_HANDMADE = ["dragon-pattern"];
const SAFETY_LINE_SKIP = ["christening-gown-set", "rosary-charm", "quilted-cat-pouch", "ribbon-corduroy-bag"];

/* Listed but never featured (Elise 20/10): these sit at the end of the shop and of every collection, and are never picked
   for the home page or "You may also like". Sheep and angel: the photos are not Elise's own. Ginger, British Shorthair,
   animal friends, white cat: the photos look like renders. Dragon: the one pattern, kept low-key as a test of whether
   shop visitors want patterns. */
const QUIET = ["ginger-tabby-cat", "british-shorthair-cat", "dragon-pattern", "knitted-sheep", "crochet-animal-friends-set", "white-cat", "angel-portrait-doll"];

/* the 7 canon collections — every one has listings since 20/10/2026; each tile shows a real product photo */
const CATEGORIES = [
  { name: "Storybook & Traditional Tales", img: "assets/img/products/bennet-darcy-set-600.webp" },
  { name: "Feelings & Calm", img: "assets/img/products/knitted-giraffe-600.webp" },
  { name: "Faith & Milestones", img: "assets/img/products/christening-gown-set-600.webp" },
  { name: "Merlin's World & His Friends", img: "assets/img/products/calico-crochet-cat-600.webp" },
  { name: "Little Things", img: "assets/img/products/linen-pocket-doll-600.webp" },
  { name: "Heritage & Celebration", img: "assets/img/products/christmas-elf-600.webp" },
  { name: "Patterns & Printables", img: "assets/img/home/story-yarn-hand-640.webp" }
];

/* a collection with no listing yet would show here as a "soon" tile (home page only, never in the shop filter) */
const UPCOMING_CATEGORIES = [];
