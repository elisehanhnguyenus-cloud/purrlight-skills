/* ============================================================
   Purrlight Studio — product catalog
   ------------------------------------------------------------
   HOW TO EDIT (for Elise):
   - ETSY_SHOP_URL / TIKTOK_SHOP_URL: replace with your real shop
     links before publishing.
   - Prices below are drawn from your current Etsy ranges — verify
     each one against the live listing before launch.
   - To swap in real photos: replace the .svg paths in `img` with
     your photo files (put them in assets/img/), keep square crops.
   - `etsyUrl` per product: paste the listing URL so "Buy on Etsy"
     goes straight to that listing instead of the shop home.
   - `addons` (optional): bundle options shown as a "make it a set"
     dropdown on the product page. Each Etsy listing MUST have a matching
     variation with the same price before publishing.
   ============================================================ */

const ETSY_SHOP_URL = "https://www.etsy.com/shop/PurrlightStudio"; /* TODO: verify exact shop URL */
const TIKTOK_SHOP_URL = "https://www.tiktok.com/@purrlightstudio"; /* TODO: verify exact handle */

const PRODUCTS = [
  {
    id: "storybook-doll",
    name: "Storybook Red-Braid Crochet Doll",
    category: "Dolls & Plush",
    price: 38,
    badge: "made-to-order",
    img: "assets/img/product-doll-redbraid.svg",
    short: "A hand-crocheted heroine with rosy cheeks and long red braids, stitched loop by loop.",
    desc: "Every Storybook Doll begins as a sketch and a skein of soft cotton yarn. Our artisans crochet her face, braids, and pinafore entirely by hand — no two dolls are ever exactly alike. She stands about 12 inches tall and loves being read to.",
    details: ["Soft cotton yarn, polyester fill", "About 12\" / 30 cm tall", "Embroidered face — no small parts", "Spot clean with a damp cloth"],
    addons: [{ label: "Doll only", delta: 0 }, { label: "Make it a set · + Matching mini doll keychain", delta: 15 }],
    etsyUrl: ""
  },
  {
    id: "baptism-set",
    name: "Baptism Keepsake Outfit",
    category: "Baby & Keepsake",
    price: 42,
    badge: "made-to-order",
    img: "assets/img/product-baptism.svg",
    short: "A soft heirloom outfit for baptism day — made to be kept long after.",
    desc: "Sewn in creamy white cotton with delicate detailing, this little outfit is made for the quiet, shining moments. Made to be folded away with the photographs and kept for the next generation.",
    details: ["Soft cotton fabric", "Sizes 0–3m, 3–6m, 6–12m", "Gentle hand wash recommended", "Arrives gift-folded in tissue"],
    addons: [{ label: "Outfit only", delta: 0 }, { label: "Make it a set · + Bunny Lovey keepsake", delta: 25 }],
    etsyUrl: ""
  },
  {
    id: "mini-doll-keychain",
    name: "Mini Fabric Doll Keychain",
    category: "Keychains",
    price: 19,
    badge: "",
    img: "assets/img/product-keychain-doll.svg",
    short: "A tiny fabric friend for your keys, bag, or backpack zipper.",
    desc: "Small enough to ride along everywhere — each mini doll is cut, sewn, and finished by hand, then fitted with a sturdy ring. Pick one that looks like someone you love.",
    details: ["Cotton fabric, embroidered details", "About 4\" / 10 cm", "Metal keyring hardware", "Not a toy — decorative accessory"],
    etsyUrl: ""
  },
  {
    id: "cat-pvc-keychain",
    name: "Merlin Moon Keychain",
    category: "Keychains",
    price: 12,
    badge: "new",
    img: "assets/img/product-keychain-cat.svg",
    short: "Merlin in his beret, dozing on a crescent moon — soft-touch PVC.",
    desc: "Some evenings Merlin sits very still on the windowsill and stares up at the moon. This little charm is that exact mood, cast in flexible soft-touch PVC with a matte finish. Sturdy enough for daily keys, curious enough to make you smile at the door.",
    details: ["Soft-touch PVC charm", "About 2.5\" / 6 cm", "Metal keyring hardware", "Wipe clean"],
    etsyUrl: ""
  },
  {
    id: "crochet-cat",
    name: "Sleepy Merlin Plush",
    category: "Dolls & Plush",
    price: 34,
    badge: "the-original",
    img: "assets/img/product-cat-plush.svg",
    short: "Our studio cat, mid-nap — tuxedo coat, little blue beret, one white whisker.",
    desc: "This is Merlin, the curious tuxedo cat who supervises our worktable (when he isn't sleeping on the patterns). Hand-crocheted in his signature blue beret, with his single white whisker embroidered on the left — just like the real one. From the cat who takes notes.",
    details: ["Soft acrylic-blend yarn, polyester fill", "About 8\" / 20 cm curled", "Embroidered face — no small parts", "Spot clean with a damp cloth"],
    addons: [{ label: "Cat only", delta: 0 }, { label: "Make it a set · + Felt fish toy", delta: 12 }],
    etsyUrl: ""
  },
  {
    id: "bunny-lovey",
    name: "Bunny Lovey Doll",
    category: "Dolls & Plush",
    price: 29,
    badge: "",
    img: "assets/img/product-bunny.svg",
    short: "A floppy-eared bunny sized for small arms and big feelings.",
    desc: "With long soft ears made for holding, this hand-finished bunny becomes the friend that goes everywhere. Sewn from soft fabric with an embroidered face.",
    details: ["Soft plush fabric, embroidered face", "About 10\" / 25 cm", "Machine wash cold, air dry", "For ages 3+"],
    etsyUrl: ""
  },
  {
    id: "flower-doll",
    name: "Little Blossom Fabric Doll",
    category: "Dolls & Plush",
    price: 22,
    badge: "",
    img: "assets/img/product-flower-doll.svg",
    short: "A pocket-sized fabric doll in a flower bonnet, sewn by hand.",
    desc: "She wears a petal bonnet and a permanent little smile. Hand-cut, hand-sewn, and small enough to live in a coat pocket or on a bedside shelf.",
    details: ["Cotton fabric, embroidered details", "About 6\" / 15 cm", "Spot clean", "For ages 3+"],
    etsyUrl: ""
  },
  {
    id: "pet-bandana",
    name: "Handmade Pet Bandana",
    category: "Pet Accessories",
    price: 16,
    badge: "",
    img: "assets/img/product-bandana.svg",
    short: "A snap-on bandana that turns any walk into an occasion.",
    desc: "Cut and hemmed by hand in our studio prints, with a snap closure that sits comfortably over the collar. For cats and dogs who take their neighborhood rounds seriously.",
    details: ["Cotton fabric", "Sizes S / M / L — see size chart photos", "Snap closure", "Machine wash cold"],
    etsyUrl: ""
  },
  {
    id: "bow-collar",
    name: "Crochet Bow Pet Collar",
    category: "Pet Accessories",
    price: 18,
    badge: "made-to-order",
    img: "assets/img/product-bow-collar.svg",
    short: "A hand-crocheted bow on a soft collar band — formalwear for whiskers.",
    desc: "Each bow is crocheted by hand and mounted on a soft, adjustable band. Breakaway-style buckle for safety. Portrait day approved.",
    details: ["Crocheted cotton bow, soft band", "Adjustable, breakaway buckle", "For cats and small dogs", "Spot clean"],
    etsyUrl: ""
  },
  {
    id: "cat-mom-tee",
    name: "Cat Mom Club Tee",
    category: "Apparel",
    price: 24,
    badge: "",
    img: "assets/img/product-tee-catmom.svg",
    short: "A soft everyday tee for the proudly cat-governed household.",
    desc: "Our original Cat Mom Club design, printed on a soft unisex tee. Relaxed fit, holds up wash after wash — the unofficial uniform of snack-time negotiations.",
    details: ["Soft cotton-blend tee", "Unisex sizes S–3XL — see size chart", "Printed to order", "Machine wash cold, inside out"],
    etsyUrl: ""
  },
  {
    id: "whisker-tee",
    name: "Whiskers & Moonlight Tee",
    category: "Apparel",
    price: 26,
    badge: "new",
    img: "assets/img/product-tee-whisker.svg",
    short: "Whiskers, moonlight, and a page from Merlin's notebook — on a tee for evening people.",
    desc: "A quiet little graphic — whiskers, a crescent moon, a scatter of stars — straight from Merlin's notebook. Printed to order on a soft unisex tee.",
    details: ["Soft cotton-blend tee", "Unisex sizes S–3XL — see size chart", "Printed to order", "Machine wash cold, inside out"],
    etsyUrl: ""
  },
  {
    id: "felt-fish-toy",
    name: "Felt Fish Cat Toy",
    category: "Pet Accessories",
    price: 14,
    badge: "",
    img: "assets/img/product-fish-toy.svg",
    short: "A hand-sewn felt fish that has accepted its fate with dignity.",
    desc: "Sturdy felt, tight stitching, and a satisfying flip — this little fish is built for enthusiastic paws. No loose plastic parts.",
    details: ["Wool-blend felt, polyester fill", "About 5\" / 13 cm", "No small plastic parts", "Supervise play; replace if worn"],
    etsyUrl: ""
  }
];

const CATEGORIES = [
  { name: "Dolls & Plush", img: "assets/img/cat-dolls.svg" },
  { name: "Baby & Keepsake", img: "assets/img/cat-baby.svg" },
  { name: "Keychains", img: "assets/img/cat-keychains.svg" },
  { name: "Pet Accessories", img: "assets/img/cat-pet.svg" },
  { name: "Apparel", img: "assets/img/cat-apparel.svg" }
];
