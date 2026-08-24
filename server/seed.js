const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.join(__dirname, ".env") });

const Category = require("./models/Category");
const Product = require("./models/Product");
const User = require("./models/User");

// ---------------------------------------------------------------------------
// Reliable image URLs — all served from CORS-friendly CDNs (no Unsplash)
// Sources: fakestoreapi.com, placeimg (via placeholder.com), dummyjson.com
// ---------------------------------------------------------------------------

const categoriesData = [
  { name: "Toys & Games",       image: "https://cdn.dummyjson.com/products/images/home-decoration/Candle/1.webp" },
  { name: "Kids' Fashion",      image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg" },
  { name: "Men's Fashion",      image: "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg" },
  { name: "Women's Fashion",    image: "https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg" },
  { name: "Tech & Gadgets",     image: "https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg" },
  { name: "Home & Living",      image: "https://cdn.dummyjson.com/products/images/home-decoration/3-Tier+Corner+Shelf/1.webp" },
  { name: "Sports & Fitness",   image: "https://cdn.dummyjson.com/products/images/sports-accessories/Baseball+Glove/1.webp" },
  { name: "Beauty & Cosmetics", image: "https://cdn.dummyjson.com/products/images/beauty/Essence+Mascara+Lash+Princess/1.webp" },
  { name: "Books & Stationery", image: "https://cdn.dummyjson.com/products/images/stationery/Sticky+Notes+Set/1.webp" },
  { name: "Shoes & Footwear",   image: "https://cdn.dummyjson.com/products/images/mens-shoes/Nike+Air+Max+SC/1.webp" },
];

const productsByCategoryData = {

  // ─────────────────────────────────────────────────────────────────────────
  // 1. TOYS & GAMES
  // ─────────────────────────────────────────────────────────────────────────
  "Toys & Games": [
    {
      name: "Remote Control Drone 4K",
      description: "Explore the skies with our premium high-speed quadcopter. Equipped with an ultra-high definition 4K camera and stable gimbal technology, it captures breathtaking aerial videos and photos with ease. Perfect for beginners and advanced flyers alike.",
      price: 189, brand: "SkyPhantom", stock: 35, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/sports-accessories/Cricket+Helmet/1.webp"],
    },
    {
      name: "Wooden Building Blocks Set",
      description: "100-piece natural wood building blocks for creative children. High-quality smooth finish with organic paints ensures complete safety. Encourages spatial coordination, mechanical imagination, and engineering instincts in kids aged 2 and above.",
      price: 29, brand: "EcoPlay", stock: 80, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/3-Tier+Corner+Shelf/1.webp"],
    },
    {
      name: "Interactive AI Robot Companion",
      description: "A smart talking robot with built-in voice control, sensors, and dancing patterns. Connects to smart devices for visual coding exercises, making learning logic and computing exciting for young minds aged 5 and above.",
      price: 89, brand: "RoboKids", stock: 22, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/laptops/Apple+MacBook+Pro+14+Inch+Space+Grey/1.webp"],
    },
    {
      name: "Giant Plush Teddy Bear",
      description: "A premium, super-soft giant teddy bear standing 4 feet tall. Made with hypoallergenic premium fabrics and ultra-plush stuffing, perfect for cuddles, nursery decoration, or a very special birthday gift.",
      price: 49, brand: "HuggyCore", stock: 45, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/Candle/1.webp"],
    },
    {
      name: "Electric Slot Car Racing Track",
      description: "Exciting dual-lane slot car track with high-speed looping tracks, bridge extensions, and electronic lap counters. Includes two detailed sports cars with working LED headlights for thrilling head-to-head race action.",
      price: 75, brand: "ApexDrift", stock: 18, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/vehicle/Blue+Electric+Tesla+Model+3/1.webp"],
    },
    {
      name: "STEM Ultimate Chemistry Kit",
      description: "Delve into science with over 30 safe and fun chemistry experiments. Comes with high-quality child-safe test tubes, reagents, protective goggles, and a detailed step-by-step guidebook for budding scientists.",
      price: 34, brand: "LabSmart", stock: 50, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/sports-accessories/Baseball+Glove/1.webp"],
    },
    {
      name: "Classic Monopoly Board Game",
      description: "The fast-dealing property trading board game families love. Buy, sell, and trade properties to build your fortune. Updated edition includes high-quality metal tokens and revised property cards for better game nights.",
      price: 24, brand: "Hasbro", stock: 120, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/Boho+Decor+Set/1.webp"],
    },
    {
      name: "Three-Wheel Kick Scooter",
      description: "Adjustable height three-wheel kick scooter for toddlers and kids ages 2 to 5. Features dynamic light-up wheels that flash while rolling and an easy lean-to-steer mechanism for safe, fun outdoor riding.",
      price: 59, brand: "GliderGo", stock: 30, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/sports-accessories/Cricket+Stumps/1.webp"],
    },
    {
      name: "3D Wooden Puzzle Castle",
      description: "Brain-teasing laser-cut wood puzzle that builds into a beautiful medieval castle model. Requires no glue or nails and offers a therapeutic, rewarding building experience for children and adults who love crafts.",
      price: 19, brand: "WoodCraft", stock: 65, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/Zinc+Aluminium+Spinning+Top/1.webp"],
    },
    {
      name: "Kids Digital Video Camera",
      description: "Rechargeable shockproof video camera designed specifically for small hands. Captures high-resolution photos and 1080p video with funny filters, frames, and interactive simple games that kids age 4 and above will adore.",
      price: 39, brand: "PixelTike", stock: 40, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/tablets/Apple+iPad+Air+(2022)/1.webp"],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 2. KIDS' FASHION
  // ─────────────────────────────────────────────────────────────────────────
  "Kids' Fashion": [
    {
      name: "Classic Denim Jacket for Kids",
      description: "Cool and rugged distressed denim jacket featuring standard button closures, chest pockets, and comfortable stretch fabric. Easy to machine wash and durable enough for rough-and-tumble everyday outdoor play.",
      price: 45, brand: "LittleRiders", stock: 25, isFeatured: true,
      images: ["https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"],
    },
    {
      name: "Floral Summer Cotton Dress",
      description: "Bright and airy cotton summer dress with hand-drawn floral patterns. Sleeveless design with back bow tie-up, ideal for outdoor birthdays, sunny picnics, and warm summer outings with friends.",
      price: 32, brand: "MeadowKids", stock: 35, isFeatured: false,
      images: ["https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"],
    },
    {
      name: "Kids Fleece-Lined Hoodie",
      description: "Extra warm unisex pullover hoodie with a soft brushed fleece lining. Features a spacious kangaroo front pocket and ribbed cuffs to trap body heat on chilly autumn outdoor excursions and playground days.",
      price: 28, brand: "CozyCrew", stock: 60, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg"],
    },
    {
      name: "Yellow Raincoat & Puddle Boots Set",
      description: "Waterproof bright yellow raincoat with adorable animal prints, paired with matching heavy-duty slip-resistant rain boots. Completely keeps kids dry while puddle jumping on rainy school days.",
      price: 49, brand: "StormyTykes", stock: 20, isFeatured: true,
      images: ["https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg"],
    },
    {
      name: "Organic Cotton Pyjama Set",
      description: "Two-piece sleepwear set made of 100% organic knit cotton. Extremely breathable and soft on sensitive baby skin, with elastic waistbands and flatlock seams that prevent irritation during sleep.",
      price: 22, brand: "NiteOwl", stock: 75, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg"],
    },
    {
      name: "Flexible Frame Kids Sunglasses",
      description: "Polarized infant and toddler sunglasses with virtually indestructible rubber frames and 100% UVA/UVB protection. Includes a comfortable silicone adjustable headstrap to keep them securely on little faces.",
      price: 15, brand: "BabiShades", stock: 100, isFeatured: false,
      images: ["https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_FMwebp_QL65_.jpg"],
    },
    {
      name: "Easy-Strap Canvas Sneakers",
      description: "Lightweight canvas shoes with double hook-and-loop strap adjustments for quick and easy slip-on. Solid vulcanised rubber soles provide strong, reliable grip for active and energetic children at play.",
      price: 26, brand: "StrideRite", stock: 45, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mens-shoes/Nike+Air+Max+SC/1.webp"],
    },
    {
      name: "Superhero Graphic T-Shirt Pack",
      description: "Pack of three soft organic cotton graphic shirts featuring retro-styled comic book heroes. Advanced colorfast print technology ensures designs never fade or crack even after repeated machine wash cycles.",
      price: 29, brand: "HeroWears", stock: 90, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"],
    },
    {
      name: "Knitted Beanie & Scarf Set",
      description: "Cozy cable-knit set featuring a fleece-lined beanie topped with a cute faux-fur pom-pom and a matching infinity loop scarf. Keeps ears and neck perfectly insulated during deep winter outdoor play.",
      price: 18, brand: "SnowPals", stock: 55, isFeatured: false,
      images: ["https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg"],
    },
    {
      name: "Cotton Chino Shorts Pack of 3",
      description: "Versatile stretch cotton chino shorts in navy, khaki, and olive colors. Features adjustable interior elastic waist tabs to comfortably accommodate growing children through multiple seasons.",
      price: 38, brand: "ClassyTad", stock: 40, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 3. MEN'S FASHION
  // ─────────────────────────────────────────────────────────────────────────
  "Men's Fashion": [
    {
      name: "Slim Fit Stretch Denim Jeans",
      description: "Premium cotton denim trousers with a modern slim fit profile. Features 2% spandex for added flex and daily mobility, reinforced seams at stress points, and the classic five-pocket construction you love.",
      price: 59, brand: "IndigoAura", stock: 65, isFeatured: true,
      images: ["https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"],
    },
    {
      name: "Asymmetrical Leather Biker Jacket",
      description: "Crafted from genuine full-grain lambskin leather. Features heavy-duty silver zippers, lapel collar snaps, quilted shoulder detailing, and multiple secure zippered pockets for the modern rebel look.",
      price: 199, brand: "RogueLeather", stock: 15, isFeatured: true,
      images: ["https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"],
    },
    {
      name: "Classic Oxford Button-down Shirt",
      description: "Tailored fit formal shirt made of breathable long-staple cotton Oxford fabric. Features a neat button-down collar, structured cuffs, and a single patch pocket for a clean, professional look.",
      price: 45, brand: "Vanguard", stock: 80, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg"],
    },
    {
      name: "Water-Resistant Aviator Bomber",
      description: "Classic flight jacket profile made of heavy-duty nylon shell. Features premium insulation for autumn, reversible orange lining, a utility arm pocket, and sturdy rib-knit cuffs and waistband.",
      price: 85, brand: "AeroCore", stock: 25, isFeatured: false,
      images: ["https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_FMwebp_QL65_.jpg"],
    },
    {
      name: "Premium Crewneck Cotton Tee",
      description: "Made from ultra-soft Pima cotton with a smooth hand feel. Breathable, durable, and designed to retain its perfect shape wash after wash. The essential basic tee for building luxury layered outfits.",
      price: 24, brand: "Basix", stock: 150, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg"],
    },
    {
      name: "Slim Fit Wool Suit Blazer",
      description: "Half-canvased structured suit jacket crafted from fine Italian wool blend. Modern slim fit styling, double vent, notch lapels, and a fully silky cupro lining for an exceptional tailored silhouette.",
      price: 175, brand: "MilanSartorial", stock: 20, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg"],
    },
    {
      name: "Athletic Quick-Dry Gym Shorts",
      description: "High-performance training shorts featuring moisture-wicking synthetic fibers. Includes side zip pockets, an elastic drawstring waist, and side split hems for deep leg extensions during intense workouts.",
      price: 29, brand: "VeloFit", stock: 90, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mens-shirts/Blue+&+Black+Check+Shirt/1.webp"],
    },
    {
      name: "Double-Breasted Woolen Trench Coat",
      description: "Heavy winter overcoat made of thick wool-blend tweed. Double-breasted button closures, a protective storm flap, waist-cinching belt, and deep interior pockets keep you warm and stylish all winter.",
      price: 160, brand: "Vanguard", stock: 12, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg"],
    },
    {
      name: "Pique Cotton Sport Polo Shirt",
      description: "Knit from breathable textured pique cotton with a slim collar band and fitted armbands. The perfect versatile piece that moves easily between smart-casual office settings and weekend sports activities.",
      price: 39, brand: "VeloFit", stock: 70, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mens-shirts/Pale+Pink+Shirt/1.webp"],
    },
    {
      name: "Cargo Utility Tapered Joggers",
      description: "Heavyweight cargo pants featuring bold utility side pockets, tapered ankle cuffs, and reinforced knees for durability. Designed for street-smart active fashion and long-distance travel comfort.",
      price: 49, brand: "IndigoAura", stock: 45, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mens-shirts/Cobalt+Blue+Formal+Shirt/1.webp"],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 4. WOMEN'S FASHION
  // ─────────────────────────────────────────────────────────────────────────
  "Women's Fashion": [
    {
      name: "Elegant Floral Silk Maxi Dress",
      description: "Flowing floor-length dress made of premium mulberry silk. Features a gorgeous watercolor floral print, plunging V-neckline, tasteful side slit, and adjustable waist tie for the perfect fit.",
      price: 110, brand: "AuraFlora", stock: 22, isFeatured: true,
      images: ["https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg"],
    },
    {
      name: "Oversized Knitted Woolen Cardigan",
      description: "Thick hand-knit chunky cardigan with elegant tortoiseshell buttons and wide drop shoulders. Super soft merino wool construction makes it the perfect cozy layer for cold autumn and winter evenings.",
      price: 68, brand: "SiennaWools", stock: 40, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg"],
    },
    {
      name: "High-Waist Shaping Skinny Jeans",
      description: "Comfort stretch denim with an advanced tummy-control panel and modern lifting technology. These jeans hug your curves beautifully from hip to ankle while maintaining full flexibility for daily life.",
      price: 65, brand: "SculptDenim", stock: 50, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71HblAHs1xL._AC_UY879_-2.jpg"],
    },
    {
      name: "Classic Belted Trench Coat",
      description: "Water-resistant gabardine cotton trench coat with elegant double-breasted profile, wrist straps, tortoiseshell buttons, protective storm flaps, and a structured waist belt for timeless styling.",
      price: 135, brand: "VogueLine", stock: 18, isFeatured: true,
      images: ["https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg"],
    },
    {
      name: "Satin V-Neck Elegant Blouse",
      description: "Lustrous heavy satin blouse with a delicate drape, flowing sleeves, and curved hemline. Translates effortlessly from daytime corporate boardroom meetings to sophisticated evening dinner outings.",
      price: 45, brand: "AuraFlora", stock: 60, isFeatured: false,
      images: ["https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg"],
    },
    {
      name: "Pleated A-Line Midi Skirt",
      description: "High-waisted flowing midi skirt featuring sharp accordion pleats and a comfortable elastic waistband. The lightweight crepe fabric provides beautiful swing and elegant dynamic motion as you walk.",
      price: 39, brand: "VogueLine", stock: 45, isFeatured: false,
      images: ["https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg"],
    },
    {
      name: "High-Rise Yoga Leggings Pro",
      description: "Buttery-soft compression fabric that is completely squat-proof with a four-way stretch. Features a high wide waistband that lies flat against your skin and hidden side pockets for cards and keys.",
      price: 49, brand: "FitSport", stock: 85, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"],
    },
    {
      name: "Cozy Oversized Fleece Hoodie",
      description: "Relaxed slouchy fit hoodie built from premium heavy-weight organic cotton fleece. Wide drop shoulders, a double-layered hood, and a warm brushed inner texture for maximum cozy comfort.",
      price: 55, brand: "SiennaWools", stock: 70, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg"],
    },
    {
      name: "Off-Shoulder Silk Evening Gown",
      description: "Breathtaking floor-length gown featuring structured off-the-shoulder draping, built-in corset boning, and a dramatic thigh-high slit. Perfect for formal galas, weddings, and special evening celebrations.",
      price: 189, brand: "GlamourCo", stock: 10, isFeatured: false,
      images: ["https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_FMwebp_QL65_.jpg"],
    },
    {
      name: "Linen Drawstring Summer Jumpsuit",
      description: "Breathable pure linen utility jumpsuit with an adjustable drawstring waist, a classic collar, chest pockets, and a relaxed straight-leg profile — the ultimate stylish choice for warm climates.",
      price: 59, brand: "AuraFlora", stock: 30, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_FMwebp_QL65_.jpg"],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 5. TECH & GADGETS
  // ─────────────────────────────────────────────────────────────────────────
  "Tech & Gadgets": [
    {
      name: "Noise-Cancelling Wireless Headphones",
      description: "Premium over-ear headphones featuring industry-leading active noise cancellation (ANC), 40-hour battery life, lightning-fast quick charging, and dual high-fidelity microphones for crystal-clear calls.",
      price: 249, brand: "SonicX", stock: 45, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/mobile-accessories/Apple+AirPods/1.webp"],
    },
    {
      name: "Mechanical Gaming Keyboard RGB",
      description: "Tactile mechanical switches with customizable per-key dynamic RGB backlighting, a brushed aluminium top plate, and dedicated macro/media keys for the ultimate intense gaming session experience.",
      price: 89, brand: "ClickPro", stock: 60, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/laptops/Apple+MacBook+Pro+14+Inch+Space+Grey/1.webp"],
    },
    {
      name: "Ergonomic Wireless Mouse",
      description: "Precision optical wireless mouse with a comfortable hand-rest grip, ultra-silent clicks, adjustable DPI settings from 800 to 2400, and a long-life rechargeable battery for all-day comfortable use.",
      price: 35, brand: "ClickPro", stock: 120, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mobile-accessories/Apple+MagSafe+Battery+Pack/1.webp"],
    },
    {
      name: "HD Portable Smart Projector",
      description: "Ultra-compact LED projector capable of throwing a stunning 120-inch HD display anywhere. Built-in Android TV OS, integrated stereo speakers, auto keystone correction, and wireless casting support.",
      price: 179, brand: "OmniView", stock: 15, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/tablets/Apple+iPad+Air+(2022)/1.webp"],
    },
    {
      name: "Smart Fitness Watch Sport",
      description: "Sleek AMOLED smartwatch tracking heart rate, blood oxygen levels, sleep quality patterns, and over 20 sports activities automatically. IP68 fully waterproof with built-in GPS route mapping.",
      price: 129, brand: "ChronoFit", stock: 55, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mobile-accessories/Smart+Watch+Series+8/1.webp"],
    },
    {
      name: "4K Waterproof Action Camera",
      description: "Capture your greatest adventures in 4K UHD video at 60 FPS. Includes a 170-degree ultra-wide lens, advanced electronic image stabilization (EIS), and a rugged 30-meter fully waterproof casing.",
      price: 99, brand: "OmniView", stock: 30, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mobile-accessories/GoPro+HERO9+Black/1.webp"],
    },
    {
      name: "Bluetooth Mini Speaker Pro",
      description: "Pocket-sized wireless speaker that delivers rich 360-degree stereo sound with thumping bass. Features an IPX7 fully waterproof and dustproof design with 15 hours of continuous music playback.",
      price: 49, brand: "SonicX", stock: 80, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mobile-accessories/Apple+AirPods/1.webp"],
    },
    {
      name: "High Capacity Power Bank 30k",
      description: "30,000mAh external battery bank with dual USB-C Power Delivery (PD) outputs. Rapidly charges smartphones, tablets, and lightweight laptops to keep you powered through long journeys and travels.",
      price: 45, brand: "ChargeCore", stock: 95, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mobile-accessories/Apple+MagSafe+Battery+Pack/1.webp"],
    },
    {
      name: "USB-C Multi-port Hub 8-in-1",
      description: "Sleek brushed aluminum adapter expanding a single USB-C port to 4K HDMI, Gigabit Ethernet, SD/TF card readers, 100W power pass-through, and three high-speed USB 3.0 ports simultaneously.",
      price: 39, brand: "ChargeCore", stock: 110, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/laptops/Lenovo+IdeaPad+330/1.webp"],
    },
    {
      name: "Virtual Reality Headset Elite",
      description: "All-in-one standalone VR headset featuring ultra-high-resolution display panels, full 6DOF inside-out tracking, intuitive touch controllers, and access to a rich library of interactive VR apps and games.",
      price: 299, brand: "OmniView", stock: 12, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/laptops/Apple+MacBook+Pro+14+Inch+Space+Grey/1.webp"],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 6. HOME & LIVING
  // ─────────────────────────────────────────────────────────────────────────
  "Home & Living": [
    {
      name: "Scented Soy Wax Candles Set",
      description: "Set of three luxury aromatherapy candles crafted from natural biodegradable soy wax. Curated scent profiles include Lavender Breeze, Citrus Wood, and warm Vanilla Bean for a spa-like home experience.",
      price: 24, brand: "ZenHome", stock: 85, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/Candle/1.webp"],
    },
    {
      name: "Minimalist Ceramic Mug Set",
      description: "Four artisan-made ceramic mugs finished in beautiful matte earth-toned glazes. Ergonomic circular handles and a safe microwave and dishwasher construction makes them perfect for morning coffees and teas.",
      price: 29, brand: "TerraCraft", stock: 60, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/kitchen-accessories/Apple+Corer/1.webp"],
    },
    {
      name: "Velvet Decorative Throw Pillows",
      description: "Pack of two ultra-soft velvet throw pillow covers in deep emerald green. Features hidden zippers and premium reinforced stitching, adding instant timeless class to any living room sofa or bed.",
      price: 19, brand: "ZenHome", stock: 140, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/Boho+Decor+Set/1.webp"],
    },
    {
      name: "Geometric Cotton Living Room Rug",
      description: "Hand-woven cotton area rug measuring a generous 5x7 feet, decorated with sharp minimalist geometric motifs. Extremely durable, comfortable to walk on barefoot, and easy to shake or vacuum clean.",
      price: 89, brand: "TerraCraft", stock: 20, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/3-Tier+Corner+Shelf/1.webp"],
    },
    {
      name: "Modern Silent Wall Clock",
      description: "12-inch circular wall clock featuring a premium quartz mechanism for completely noiseless, sweep-second operation. Clean minimalist dial and a glass cover make it perfect for bedrooms and offices.",
      price: 35, brand: "Chronos", stock: 50, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/Zinc+Aluminium+Spinning+Top/1.webp"],
    },
    {
      name: "Indoor Self-Watering Planter",
      description: "Smart dual-layer planter with an integrated water reservoir and a natural cotton wick wicking system. Keeps your favorite houseplants perfectly hydrated automatically without the risk of overwatering.",
      price: 18, brand: "FloraLife", stock: 100, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/Candle/1.webp"],
    },
    {
      name: "Stainless Steel French Press",
      description: "Double-walled insulated French press coffee maker with a generous 1-liter capacity. Features an advanced 4-level filtration mesh system for maximum rich flavor extraction without grinds in your cup.",
      price: 34, brand: "TerraCraft", stock: 45, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/kitchen-accessories/Apple+Corer/1.webp"],
    },
    {
      name: "Insulated Stainless Water Bottle",
      description: "Double-walled vacuum insulated canteen keeping drinks icy cold for 24 hours or piping hot for up to 12. The durable powder coat finish is chip-resistant and the loop cap is completely leakproof.",
      price: 22, brand: "AeroCore", stock: 120, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/kitchen-accessories/Colander/1.webp"],
    },
    {
      name: "Premium Bamboo Bed Sheet Set",
      description: "Silky soft, naturally hypoallergenic bed sheets woven from 100% organic bamboo viscose. Highly breathable and moisture-wicking, ensuring a perfectly cool and refreshing full night of deep sleep.",
      price: 79, brand: "ZenHome", stock: 35, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/Boho+Decor+Set/1.webp"],
    },
    {
      name: "Ultrasonic Essential Oil Diffuser",
      description: "Elegant ceramic ultrasonic diffuser producing a gentle, cool aromatherapy mist. Operates in complete silence, features 7 color LED lights, auto safety shutoff, and runs for up to 8 continuous hours.",
      price: 39, brand: "ZenHome", stock: 60, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/home-decoration/Candle/1.webp"],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 7. SPORTS & FITNESS
  // ─────────────────────────────────────────────────────────────────────────
  "Sports & Fitness": [
    {
      name: "Non-Slip Alignment Yoga Mat",
      description: "Eco-friendly natural rubber yoga mat featuring physical alignment laser-etched guide lines, a premium cushioning layer, and a reliable bi-directional slip-resistant surface for confident wet or dry use.",
      price: 49, brand: "AuraFit", stock: 75, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/sports-accessories/Cricket+Helmet/1.webp"],
    },
    {
      name: "Adjustable Heavy Dumbbell Set",
      description: "Compact selector dumbbells adjustable from 5 to 52.5 lbs per hand with a simple single-dial mechanism. Replace an entire rack of 15 separate dumbbell pairs and save valuable home gym floor space.",
      price: 220, brand: "IronPower", stock: 10, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/sports-accessories/Cricket+Stumps/1.webp"],
    },
    {
      name: "Resistance Loop Bands Pack of 5",
      description: "Heavy-duty natural latex loop resistance bands in five difficulty levels from Light to XX-Heavy. Ideal for physical therapy recovery, home workouts, yoga flow, strength conditioning, and dynamic warmups.",
      price: 15, brand: "AuraFit", stock: 200, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/sports-accessories/Baseball+Glove/1.webp"],
    },
    {
      name: "Outdoor Trail Running Hydration Vest",
      description: "Lightweight, body-hugging running vest with multiple quick-access front pockets, including two included 500ml soft flasks and ample rear space for a 2-liter hydration bladder for long trail runs.",
      price: 65, brand: "ApexTrail", stock: 30, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/sports-accessories/Cricket+Helmet/1.webp"],
    },
    {
      name: "Stainless Steel Protein Shaker",
      description: "Double-walled vacuum insulated protein bottle keeping drinks cold for up to 24 hours. Features a leakproof snap-tight cap and a surgical-grade stainless steel wire whisk blending ball inside.",
      price: 24, brand: "IronPower", stock: 150, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/kitchen-accessories/Colander/1.webp"],
    },
    {
      name: "High Density Foam Roller",
      description: "Deep tissue massage foam roller for targeted muscle recovery and physical therapy sessions. Grid-patterned surface targets specific sore muscle nodules, relieving deep tightness after intense gym workouts.",
      price: 19, brand: "AuraFit", stock: 80, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/sports-accessories/Cricket+Stumps/1.webp"],
    },
    {
      name: "Waterproof Wireless Sports Earbuds",
      description: "Secure-fit over-ear hook sport headphones with IPX7 complete sweatproofing, deep stereo bass, one-touch controls on the earcup, and up to 8 hours of continuous playback on a single charge.",
      price: 59, brand: "SonicX", stock: 50, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mobile-accessories/Apple+AirPods/1.webp"],
    },
    {
      name: "Smart Counting Jump Rope",
      description: "Digital jump rope with an integrated backlit LCD display tracking elapsed time, total jump count, and calories burned per session. Uses weighted handles and a premium tangle-free steel wire rope.",
      price: 18, brand: "AuraFit", stock: 110, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/sports-accessories/Baseball+Glove/1.webp"],
    },
    {
      name: "Aero Smart Fitness Tracker Band",
      description: "Ultra-slim wristband tracking step counts, total distance walked, daily calories burned, and continuous heart rate patterns throughout the day. Syncs directly to Apple Health and Google Fit via Bluetooth.",
      price: 39, brand: "ChronoFit", stock: 65, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mobile-accessories/Smart+Watch+Series+8/1.webp"],
    },
    {
      name: "Water-Resistant Gym Duffel Bag",
      description: "Heavy-duty gym and travel duffel bag (40L capacity) with a dedicated shoe compartment, a separate wet pocket for damp towels, and a comfortable padded adjustable shoulder strap for easy carry.",
      price: 35, brand: "ApexTrail", stock: 45, isFeatured: false,
      images: ["https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg"],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 8. BEAUTY & COSMETICS
  // ─────────────────────────────────────────────────────────────────────────
  "Beauty & Cosmetics": [
    {
      name: "Hydrating Hyaluronic Face Serum",
      description: "Dermatologist-tested face serum loaded with pure hyaluronic acid and vitamin B5. Intensely plumps dehydrated skin, smooths surface texture, and visibly diminishes fine wrinkles within just two weeks.",
      price: 29, brand: "AuraGlow", stock: 90, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Essence+Mascara+Lash+Princess/1.webp"],
    },
    {
      name: "Velvet Matte Liquid Lipstick Set",
      description: "Pack of 6 stunning, truly waterproof long-lasting liquid lipsticks in a curated range of classic nudes, romantic pinks, and bold reds. Creamy smooth formula dries matte without uncomfortable cracking.",
      price: 38, brand: "GlamourCo", stock: 55, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Red+Lipstick/1.webp"],
    },
    {
      name: "Organic Raw Aloe Vera Soothing Gel",
      description: "100% natural cold-pressed pure aloe vera gel. Rapidly calms and soothes sunburns, reduces redness on sensitive skin, and also doubles as an excellent lightweight daily face and body moisturizer.",
      price: 15, brand: "Herbals", stock: 120, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Essence+Mascara+Lash+Princess/1.webp"],
    },
    {
      name: "Rosewater Refreshing Facial Toner",
      description: "Completely alcohol-free hydrating face spray distilled from organic Bulgarian damask rose petals. Instantly revives tired and dull skin, balances natural pH levels, and sets makeup for a radiant finish.",
      price: 19, brand: "AuraGlow", stock: 80, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Chanel+Chance+Eau+Fraiche/1.webp"],
    },
    {
      name: "Soothing Avocado Clay Face Mask",
      description: "Deep pore cleansing clay mask formulated with creamy bentonite clay blended with nourishing avocado oil. Absorbs excess sebum from pores and leaves skin genuinely soft and visibly refined after use.",
      price: 22, brand: "Herbals", stock: 75, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Essence+Mascara+Lash+Princess/1.webp"],
    },
    {
      name: "Professional Makeup Brush Set",
      description: "15 premium synthetic fiber makeup brushes including foundation, loose powder, blending, eyeshadow, and precision brow liners. Full set comes packaged inside a beautiful chic leather zipper travel roll.",
      price: 35, brand: "GlamourCo", stock: 40, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Red+Lipstick/1.webp"],
    },
    {
      name: "Moisturizing Shea Hand Cream Pack",
      description: "Rich, intensely nourishing hand cream enriched with pure organic shea butter and soothing lavender extracts. Instantly hydrates rough cuticles, dry palms, and cracked knuckles without any greasy residue.",
      price: 12, brand: "AuraGlow", stock: 150, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Chanel+Chance+Eau+Fraiche/1.webp"],
    },
    {
      name: "Anti-Aging Vitamin C Eye Cream",
      description: "Advanced brightening under-eye treatment packed with stabilized vitamin C, energizing caffeine, and hyaluronic acid. Visibly reduces dark circles, morning puffiness, and actively supports natural collagen production.",
      price: 26, brand: "AuraGlow", stock: 65, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Essence+Mascara+Lash+Princess/1.webp"],
    },
    {
      name: "Cold-Pressed Organic Coconut Oil",
      description: "Extra virgin pure coconut oil for deep hair conditioning treatments, relaxing body massage, and daily skincare. Rich in antioxidants and beneficial medium-chain fatty acids for genuinely soft, nourished skin.",
      price: 18, brand: "Herbals", stock: 110, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Chanel+Chance+Eau+Fraiche/1.webp"],
    },
    {
      name: "Activated Charcoal Teeth Whitener",
      description: "All-natural organic teeth whitening powder formulated from activated coconut shell charcoal. Safely and effectively lifts stubborn coffee, tea, wine, and tobacco stains without harsh chemical bleaches.",
      price: 14, brand: "GlamourCo", stock: 130, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/beauty/Red+Lipstick/1.webp"],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 9. BOOKS & STATIONERY
  // ─────────────────────────────────────────────────────────────────────────
  "Books & Stationery": [
    {
      name: "Premium Leather Journal Notebook",
      description: "Elegant hardback writing journal featuring a genuine handcrafted leather cover with intricate embossing, 200 pages of thick acid-free cream paper, and a secure wraparound leather strap closure.",
      price: 22, brand: "PaperLux", stock: 80, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Sticky+Notes+Set/1.webp"],
    },
    {
      name: "Calligraphy Fountain Pen Set",
      description: "Handcrafted vintage fountain pen set with three interchangeable iridium nib sizes, an ink converter pump, premium black ink bottle, and a beautiful mahogany presentation gift box.",
      price: 45, brand: "PaperLux", stock: 35, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Notebook+with+Pencil/1.webp"],
    },
    {
      name: "Minimalist Mesh Desk Organizer",
      description: "Five-compartment steel mesh desktop organizer with sliding tray drawers, dedicated pencil and pen cups, and tall document file racks. Keeps even the most chaotic workspaces clean and well-organized.",
      price: 19, brand: "Organiq", stock: 90, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Sticky+Notes+Set/1.webp"],
    },
    {
      name: "Pastel Aesthetic Highlighters Pack",
      description: "Pack of 6 dreamy soft-hued pastel highlighters. Water-based quick-dry pigment ink prevents paper bleed-through and ghosting, making them perfect for bullet journaling and detailed study note annotating.",
      price: 9, brand: "PaperLux", stock: 160, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Marker+Pen+Set/1.webp"],
    },
    {
      name: "Hardcover Sci-Fi Novel: The Star Maker",
      description: "An epic, imaginative sci-fi adventure exploring the boundaries of space, the rise of artificial intelligence, and the destiny of humanity across thousands of galaxies. Deluxe collector's edition with silver foil.",
      price: 24, brand: "NovaPress", stock: 45, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Notebook+with+Pencil/1.webp"],
    },
    {
      name: "Illustrated Hardcover World Atlas",
      description: "Large-format premium world atlas packed with stunning NASA satellite imagery maps, detailed geographic facts, demographic population graphs, economic data visualizations, and flags of every sovereign nation.",
      price: 49, brand: "NovaPress", stock: 15, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Sticky+Notes+Set/1.webp"],
    },
    {
      name: "Self-Stick Notes Color Wheel",
      description: "Stylish circular desktop tray containing 800 individual sheets of colorful sticky notes across multiple fun sizes and geometric shapes, backed with a strong repositionable adhesive leaving zero residue.",
      price: 12, brand: "Organiq", stock: 110, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Marker+Pen+Set/1.webp"],
    },
    {
      name: "Professional Sketching Pencils Set",
      description: "Complete set of 12 sketching graphite pencils spanning from ultra-soft 8B to precise hard 2H grades. Includes sketch blending stumps, a soft eraser, a precision sharpener, and a portable zip pouch.",
      price: 18, brand: "PaperLux", stock: 75, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Notebook+with+Pencil/1.webp"],
    },
    {
      name: "Metal Custom Bookmarks Pack of 3",
      description: "Exquisitely laser-cut hollowed brass metal bookmarks depicting delicate lotus leaves, sakura blossom buds, and autumn maple leaves. A deeply thoughtful and beautiful gift for any devoted bookworm.",
      price: 15, brand: "PaperLux", stock: 140, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Sticky+Notes+Set/1.webp"],
    },
    {
      name: "Flexible LED Reading Desk Lamp",
      description: "Rechargeable clip-on book reading lamp with a fully flexible 360-degree gooseneck arm, three color warmth settings, eye-protection diffusion filters, and a micro-USB charging cable included.",
      price: 16, brand: "Organiq", stock: 60, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/stationery/Marker+Pen+Set/1.webp"],
    },
  ],

  // ─────────────────────────────────────────────────────────────────────────
  // 10. SHOES & FOOTWEAR
  // ─────────────────────────────────────────────────────────────────────────
  "Shoes & Footwear": [
    {
      name: "Ultra Breathable Running Sneakers",
      description: "Precision-engineered knit mesh upper for unparalleled breathability paired with highly responsive foam cushioning technology that absorbs joint-damaging shock during long marathon and daily runs.",
      price: 89, brand: "SwiftFoot", stock: 45, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/mens-shoes/Nike+Air+Max+SC/1.webp"],
    },
    {
      name: "Classic Italian Leather Loafers",
      description: "Indulge in absolute luxury with our premium calfskin loafers, handcrafted by master artisans in Italy. Features memory foam cushioned insoles and premium slip-resistant leather and rubber blend outsoles.",
      price: 149, brand: "Sartorial", stock: 20, isFeatured: true,
      images: ["https://cdn.dummyjson.com/products/images/mens-shoes/Sneakers+Suede+Shoes/1.webp"],
    },
    {
      name: "Waterproof Trail Hiking Boots",
      description: "Engineered for the most demanding rough terrain. Features a robust waterproof membrane shell, an aggressive heavy-grip lugged rubber tread pattern, and reinforced steel torsion ankle support shanks.",
      price: 110, brand: "SwiftFoot", stock: 25, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mens-shoes/Loafers+for+men/1.webp"],
    },
    {
      name: "Casual Low-Top Canvas Shoes",
      description: "Versatile retro-inspired canvas flats featuring a protective rubber shell toe cap, classic waxed flat laces, and comfortable memory foam sock-liner padding for everyday casual wear styling.",
      price: 45, brand: "Basix", stock: 90, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mens-shoes/Nike+Air+Max+SC/1.webp"],
    },
    {
      name: "Pointed Toe High Heel Pumps",
      description: "Sleek stiletto pumps with a 3.5-inch heel crafted from premium suede leather with a pointed toe silhouette. Features built-in shock-absorbing heel pads for all-night comfort and undeniable confidence.",
      price: 79, brand: "Sartorial", stock: 35, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/womens-shoes/Heel+Shoes+(Balenciaga)/1.webp"],
    },
    {
      name: "Cork Footbed Leather Sandals",
      description: "Ergonomically crafted slides with double adjustable metal buckle straps and genuine full-grain leather uppers. The naturally anatomic cork footbeds conform to the unique contours of your foot arches over time.",
      price: 55, brand: "Basix", stock: 80, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/womens-shoes/Apple+Blossom+Flat+Shoes/1.webp"],
    },
    {
      name: "Leather Winter Chelsea Boots",
      description: "Premium water-resistant full-grain leather Chelsea boots with elasticized side panels and pull loops for easy entry. Soft, warm microfiber linings perfectly insulate feet against cold, wet winter conditions.",
      price: 125, brand: "SwiftFoot", stock: 30, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mens-shoes/Sneakers+Suede+Shoes/1.webp"],
    },
    {
      name: "Breathable Slip-On Mesh Knit Shoes",
      description: "Ultra-comfortable sock-like seamless knit sneakers with a flexible slip-on collar, an exceptionally lightweight construction, and high-traction phylon foam soles for supreme all-day walking comfort.",
      price: 49, brand: "Basix", stock: 110, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mens-shoes/Nike+Air+Max+SC/1.webp"],
    },
    {
      name: "Velvet Quilted Luxury Slippers",
      description: "Luxuriously soft padded velvet house slippers featuring a quilted upper and a thick anti-slip rubber outer sole. Interior fleece lining gently warms toes while preventing cold floor slides.",
      price: 28, brand: "Sartorial", stock: 65, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/womens-shoes/Apple+Blossom+Flat+Shoes/1.webp"],
    },
    {
      name: "Cross-Training Athletic Shoes",
      description: "Versatile multi-purpose training shoes engineered for weightlifting, HIIT circuits, and cardio workouts. Features a flat, stable heel for structural barbell squats and strong lateral grip rubber outsoles.",
      price: 95, brand: "SwiftFoot", stock: 40, isFeatured: false,
      images: ["https://cdn.dummyjson.com/products/images/mens-shoes/Loafers+for+men/1.webp"],
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Main seeding function
// ─────────────────────────────────────────────────────────────────────────────
async function seedDatabase() {
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI is missing from server/.env");
    process.exit(1);
  }
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // Ensure seed users exist
    let customerUser = await User.findOne({ email: "customer@nexura.com" });
    if (!customerUser) {
      customerUser = await User.create({ name: "John Doe", email: "customer@nexura.com", password: "password123", role: "customer" });
      console.log("Created customer@nexura.com");
    }
    let adminUser = await User.findOne({ email: "admin@nexura.com" });
    if (!adminUser) {
      adminUser = await User.create({ name: "Nexura Admin", email: "admin@nexura.com", password: "adminpassword", role: "admin" });
      console.log("Created admin@nexura.com");
    }

    // Clear old data
    console.log("Clearing existing Products and Categories...");
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Insert categories
    const catMap = {};
    for (const catData of categoriesData) {
      const cat = new Category({ name: catData.name, image: catData.image });
      await cat.save();
      catMap[catData.name] = cat._id;
      console.log(`  Category: ${catData.name}`);
    }

    // Insert products
    let total = 0;
    for (const [catName, products] of Object.entries(productsByCategoryData)) {
      const categoryId = catMap[catName];
      if (!categoryId) continue;
      for (const p of products) {
        const units = [
          { label: "Standard Item", price: p.price,                        stock: p.stock,                     isDefault: true  },
          { label: "Pack of 2",     price: Math.round(p.price * 1.8),      stock: Math.floor(p.stock / 2),     isDefault: false },
        ];
        const reviews = [];
        let ratings = 0, numReviews = 0;
        if (p.isFeatured) {
          reviews.push(
            { user: customerUser._id, rating: 5, comment: "Outstanding quality! Highly recommend.", createdAt: new Date() },
            { user: adminUser._id,    rating: 4, comment: "Great build, fits the description perfectly.", createdAt: new Date(Date.now() - 86400000) }
          );
          numReviews = 2; ratings = 4.5;
        }
        await new Product({
          name: p.name, description: p.description, price: p.price,
          category: categoryId, brand: p.brand, images: p.images,
          units, stock: p.stock + Math.floor(p.stock / 2),
          isFeatured: p.isFeatured, reviews, ratings, numReviews,
        }).save();
        total++;
      }
      console.log(`  Seeded 10 products → ${catName}`);
    }

    console.log(`\n✅ Done! ${categoriesData.length} categories, ${total} products seeded.`);
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedDatabase();
