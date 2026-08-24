const mongoose = require("mongoose");
const path = require("path");
const dotenv = require("dotenv");

// Load Environment Variables
dotenv.config({ path: path.join(__dirname, ".env") });

const Category = require("./models/Category");
const Product = require("./models/Product");
const User = require("./models/User");

// Categories Mock Data
const categoriesData = [
  { name: "Toys & Games", image: "https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=800&auto=format&fit=crop&q=80" },
  { name: "Kids' Fashion", image: "https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=800&auto=format&fit=crop&q=80" },
  { name: "Men's Fashion", image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80" },
  { name: "Women's Fashion", image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80" },
  { name: "Tech & Gadgets", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80" },
  { name: "Home & Living", image: "https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80" },
  { name: "Sports & Fitness", image: "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80" },
  { name: "Beauty & Cosmetics", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80" },
  { name: "Books & Stationery", image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80" },
  { name: "Shoes & Footwear", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80" }
];

// Products Mock Data divided by category name
const productsByCategoryData = {
  "Toys & Games": [
    {
      name: "Remote Control Drone 4K",
      description: "Explore the skies with our premium high-speed quadcopter. Equipped with an ultra-high definition 4K camera and stable gimbal technology, it captures breathtaking aerial videos and photos with ease. Perfect for beginners and advanced flyers alike.",
      price: 189,
      brand: "SkyPhantom",
      images: ["https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80"],
      stock: 35,
      isFeatured: true
    },
    {
      name: "Wooden Building Blocks Set",
      description: "100-piece natural wood building blocks for creative children. High-quality smooth finish with organic paints ensures complete safety. Encourages spatial coordination, mechanical imagination, and engineering instincts in kids.",
      price: 29,
      brand: "EcoPlay",
      images: ["https://images.unsplash.com/photo-1618842676088-c4d48a6a7c9d?w=800&auto=format&fit=crop&q=80"],
      stock: 80,
      isFeatured: false
    },
    {
      name: "Interactive AI Robot Companion",
      description: "A smart talking robot with built-in voice control, sensors, and dancing patterns. Connects to smart devices for visual coding exercises, making learning logic and computing exciting for young minds.",
      price: 89,
      brand: "RoboKids",
      images: ["https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=800&auto=format&fit=crop&q=80"],
      stock: 22,
      isFeatured: true
    },
    {
      name: "Giant Plush Teddy Bear",
      description: "A premium, super-soft giant teddy bear standing 4 feet tall. Made with hypoallergenic premium fabrics and ultra-plush stuffing, perfect for cuddles, nursery decoration, or birthday gifts.",
      price: 49,
      brand: "HuggyCore",
      images: ["https://images.unsplash.com/photo-1559251606-c623743a6d76?w=800&auto=format&fit=crop&q=80"],
      stock: 45,
      isFeatured: false
    },
    {
      name: "Electric Slot Car Racing Track",
      description: "Exciting dual-lane slot car track with high-speed looping tracks, bridge extensions, and electronic lap counters. Includes two detailed sports cars with working LED headlights.",
      price: 75,
      brand: "ApexDrift",
      images: ["https://images.unsplash.com/photo-1594787318286-3d835c1d207f?w=800&auto=format&fit=crop&q=80"],
      stock: 18,
      isFeatured: false
    },
    {
      name: "STEM Ultimate Chemistry Kit",
      description: "Delve into science with over 30 safe and fun chemistry experiments. Comes with high-quality child-safe test tubes, reagents, protective goggles, and a detailed step-by-step guidebook.",
      price: 34,
      brand: "LabSmart",
      images: ["https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80"],
      stock: 50,
      isFeatured: false
    },
    {
      name: "Classic Monopoly Board Game",
      description: "The fast-dealing property trading board game. Buy, sell, and trade properties to win. Includes updated high-quality metal tokens and detailed cards for perfect family game nights.",
      price: 24,
      brand: "Hasbro",
      images: ["https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=800&auto=format&fit=crop&q=80"],
      stock: 120,
      isFeatured: false
    },
    {
      name: "Three-Wheel Kick Scooter",
      description: "Adjustable height three-wheel kick scooter for toddlers and kids. Features dynamic light-up wheels that flash while rolling and an easy lean-to-steer mechanism for safe riding.",
      price: 59,
      brand: "GliderGo",
      images: ["https://images.unsplash.com/photo-1516641396056-0ce60a85d49f?w=800&auto=format&fit=crop&q=80"],
      stock: 30,
      isFeatured: false
    },
    {
      name: "3D Wooden Puzzle Castle",
      description: "Brain-teasing laser-cut wood puzzle that builds into a beautiful mediaeval castle model. Requires no glue or nails. A therapeutic and rewarding hobby for older children and adults.",
      price: 19,
      brand: "WoodCraft",
      images: ["https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&auto=format&fit=crop&q=80"],
      stock: 65,
      isFeatured: false
    },
    {
      name: "Kids Digital Video Camera",
      description: "Rechargeable shockproof video camera designed for small hands. Captures high-res photos and 1080p video, featuring funny filters, frames, and interactive simple games.",
      price: 39,
      brand: "PixelTike",
      images: ["https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80"],
      stock: 40,
      isFeatured: false
    }
  ],
  "Kids' Fashion": [
    {
      name: "Classic Denim Jacket for Kids",
      description: "Cool and rugged distressed denim jacket featuring standard button closures, chest pockets, and comfortable stretch fabric. Easy to wash and durable enough for rough play.",
      price: 45,
      brand: "LittleRiders",
      images: ["https://images.unsplash.com/photo-1611426469053-98e5fd23900f?w=800&auto=format&fit=crop&q=80"],
      stock: 25,
      isFeatured: true
    },
    {
      name: "Floral Summer Cotton Dress",
      description: "Bright and airy cotton summer dress with hand-drawn floral patterns. Sleeveless design with back bow tie-up, ideal for outdoor birthdays, picnics, and warm summer outings.",
      price: 32,
      brand: "MeadowKids",
      images: ["https://images.unsplash.com/photo-1622296089863-eb7fc530daa8?w=800&auto=format&fit=crop&q=80"],
      stock: 35,
      isFeatured: false
    },
    {
      name: "Kids Fleece-Lined Hoodie",
      description: "Extra warm unisex pullover hoodie with a soft brushed fleece lining. Features a spacious kangaroo pocket and ribbed cuffs to trap body heat on chilly outdoor excursions.",
      price: 28,
      brand: "CozyCrew",
      images: ["https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=800&auto=format&fit=crop&q=80"],
      stock: 60,
      isFeatured: false
    },
    {
      name: "Yellow Raincoat & Puddle Boots Set",
      description: "Waterproof bright yellow raincoat with cute animal prints, paired with matching heavy-duty slip-resistant rain boots. Designed to keep kids completely dry while puddle jumping.",
      price: 49,
      brand: "StormyTykes",
      images: ["https://images.unsplash.com/photo-1604467794349-0b74285de7e7?w=800&auto=format&fit=crop&q=80"],
      stock: 20,
      isFeatured: true
    },
    {
      name: "Organic Cotton Pyjama Set",
      description: "Two-piece sleepwear set made of 100% organic knit cotton. Extremely breathable and soft on sensitive baby skin, featuring elastic waistbands and flatlock seams.",
      price: 22,
      brand: "NiteOwl",
      images: ["https://images.unsplash.com/photo-1555252333-9f8e92e65df9?w=800&auto=format&fit=crop&q=80"],
      stock: 75,
      isFeatured: false
    },
    {
      name: "Flexible Frame Kids Sunglasses",
      description: "Polarized infant and toddler sunglasses with virtually indestructible rubber frames. Provides 100% UVA/UVB protection and includes a comfortable silicone headstrap.",
      price: 15,
      brand: "BabiShades",
      images: ["https://images.unsplash.com/photo-1503919545889-aef636e10ad4?w=800&auto=format&fit=crop&q=80"],
      stock: 100,
      isFeatured: false
    },
    {
      name: "Easy-Strap Canvas Sneakers",
      description: "Lightweight canvas shoes with double hook-and-loop strap adjustments for quick slip-on. Solid vulcanised rubber soles provide strong grip for active children.",
      price: 26,
      brand: "StrideRite",
      images: ["https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?w=800&auto=format&fit=crop&q=80"],
      stock: 45,
      isFeatured: false
    },
    {
      name: "Superhero Graphic T-Shirt Pack",
      description: "Pack of three soft organic cotton graphic shirts featuring retro-styled comic book heroes. Colorfast print technology ensures designs don't fade after machine wash.",
      price: 29,
      brand: "HeroWears",
      images: ["https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=800&auto=format&fit=crop&q=80"],
      stock: 90,
      isFeatured: false
    },
    {
      name: "Knitted Beanie & Scarf Set",
      description: "Cozy cable-knit set featuring a fleece-lined beanie topped with a cute faux-fur pom-pom and a matching loop scarf. Keeps ears and neck insulated in deep winter.",
      price: 18,
      brand: "SnowPals",
      images: ["https://images.unsplash.com/photo-1576053139778-7e32f2ae3cfd?w=800&auto=format&fit=crop&q=80"],
      stock: 55,
      isFeatured: false
    },
    {
      name: "Cotton Chino Shorts Pack of 3",
      description: "Versatile stretch cotton chino shorts in navy, khaki, and olive colors. Features adjustable interior elastic tabs on the waist to accommodate growing kids.",
      price: 38,
      brand: "ClassyTad",
      images: ["https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80"],
      stock: 40,
      isFeatured: false
    }
  ],
  "Men's Fashion": [
    {
      name: "Slim Fit Stretch Denim Jeans",
      description: "Premium cotton denim trousers with a modern slim fit profile. Features 2% spandex for added flex and daily mobility, reinforced seams, and classic five-pocket construction.",
      price: 59,
      brand: "IndigoAura",
      images: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=800&auto=format&fit=crop&q=80"],
      stock: 65,
      isFeatured: true
    },
    {
      name: "Asymmetrical Leather Biker Jacket",
      description: "Crafted from genuine full-grain lambskin leather. Features heavy-duty silver zippers, lapel collar snaps, quilted shoulder detailing, and multiple secure zippered pockets.",
      price: 199,
      brand: "RogueLeather",
      images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&auto=format&fit=crop&q=80"],
      stock: 15,
      isFeatured: true
    },
    {
      name: "Classic Oxford Button-down Shirt",
      description: "Tailored fit formal shirt made of breathable long-staple cotton Oxford fabric. Features a neat button-down collar, structured cuffs, and a single patch pocket on the chest.",
      price: 45,
      brand: "Vanguard",
      images: ["https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80"],
      stock: 80,
      isFeatured: false
    },
    {
      name: "Water-Resistant Aviator Bomber",
      description: "Classic flight jacket profile made of heavy-duty nylon shell. Features insulation for autumn, orange lining, utility arm pocket, and rib-knit cuffs and waist.",
      price: 85,
      brand: "AeroCore",
      images: ["https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=80"],
      stock: 25,
      isFeatured: false
    },
    {
      name: "Premium Crewneck Cotton Tee",
      description: "Made from ultra-soft Pima cotton. Breathable, durable, and retains its shape wash after wash. The perfect basic tee for building layered luxury outfits.",
      price: 24,
      brand: "Basix",
      images: ["https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80"],
      stock: 150,
      isFeatured: false
    },
    {
      name: "Slim Fit Wool Suit Blazer",
      description: "Half-canvased structured suit jacket crafted from fine Italian wool blend. Modern slim fit styling, double vent, notch lapels, and fully lined with silky cupro.",
      price: 175,
      brand: "MilanSartorial",
      images: ["https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80"],
      stock: 20,
      isFeatured: false
    },
    {
      name: "Athletic Quick-Dry Gym Shorts",
      description: "High-performance training shorts featuring moisture-wicking synthetic fibers. Side zip pockets, elastic drawstring waist, and side split hems for deep leg extensions.",
      price: 29,
      brand: "VeloFit",
      images: ["https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80"],
      stock: 90,
      isFeatured: false
    },
    {
      name: "Double-Breasted Woolen Trench Coat",
      description: "Heavy winter overcoat made of thick wool-blend tweed. Double-breasted button closures, storm flap, waist-cinching belt, and deep interior pockets for personal items.",
      price: 160,
      brand: "Vanguard",
      images: ["https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=800&auto=format&fit=crop&q=80"],
      stock: 12,
      isFeatured: false
    },
    {
      name: "Pique Cotton Sport Polo Shirt",
      description: "Knit from breathable textured pique cotton. Slim collar band and fitted armbands. Perfect blend of smart-casual dressing for the office or tennis court.",
      price: 39,
      brand: "VeloFit",
      images: ["https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&auto=format&fit=crop&q=80"],
      stock: 70,
      isFeatured: false
    },
    {
      name: "Cargo Utility Tapered Joggers",
      description: "Heavyweight cargo pants featuring utility side pockets, tapered ankle cuffs, and reinforced knees. Designed for active street fashion and travel comfort.",
      price: 49,
      brand: "IndigoAura",
      images: ["https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=800&auto=format&fit=crop&q=80"],
      stock: 45,
      isFeatured: false
    }
  ],
  "Women's Fashion": [
    {
      name: "Elegant Floral Silk Maxi Dress",
      description: "Flowing floor-length dress made of premium mulberry silk. Features a gorgeous watercolor floral print, plunging V-neckline, side slit, and adjustable waist tie.",
      price: 110,
      brand: "AuraFlora",
      images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80"],
      stock: 22,
      isFeatured: true
    },
    {
      name: "Oversized Knitted Woolen Cardigan",
      description: "Thick hand-knit chunky cardigan with tortoiseshell buttons and drop shoulders. Super soft merino wool construction, perfect for layering on cold autumn evenings.",
      price: 68,
      brand: "SiennaWools",
      images: ["https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&auto=format&fit=crop&q=80"],
      stock: 40,
      isFeatured: false
    },
    {
      name: "High-Waist Shaping Skinny Jeans",
      description: "Comfort stretch denim with an advanced tummy-control panel and lifting technology. Hugs your curves from hip to ankle while maintaining flexibility for daily wear.",
      price: 65,
      brand: "SculptDenim",
      images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80"],
      stock: 50,
      isFeatured: false
    },
    {
      name: "Classic Belted Trench Coat",
      description: "Water-resistant gabardine cotton trench coat. Elegant double-breasted profile with wrist straps, tortoiseshell buttons, storm flaps, and a structured waist belt.",
      price: 135,
      brand: "VogueLine",
      images: ["https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&auto=format&fit=crop&q=80"],
      stock: 18,
      isFeatured: true
    },
    {
      name: "Satin V-Neck Elegant Blouse",
      description: "Lustrous heavy satin blouse with a delicate drape, draped sleeves, and curved hemline. Translates effortlessly from daytime corporate boardroom meetings to nighttime dinners.",
      price: 45,
      brand: "AuraFlora",
      images: ["https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800&auto=format&fit=crop&q=80"],
      stock: 60,
      isFeatured: false
    },
    {
      name: "Pleated A-Line Midi Skirt",
      description: "High-waisted flowing midi skirt featuring sharp accordion pleats and an elastic waistband. Lightweight crepe fabric provides beautiful swing and dynamic motion.",
      price: 39,
      brand: "VogueLine",
      images: ["https://images.unsplash.com/photo-1583496661160-fb488b2c1a82?w=800&auto=format&fit=crop&q=80"],
      stock: 45,
      isFeatured: false
    },
    {
      name: "High-Rise Yoga Leggings Pro",
      description: "Buttery-soft compression fabric that is completely squat-proof. Features a high waist band that lies flat against skin and hidden waistband pockets for cards/keys.",
      price: 49,
      brand: "FitSport",
      images: ["https://images.unsplash.com/photo-1506152983158-b4a74a01c721?w=800&auto=format&fit=crop&q=80"],
      stock: 85,
      isFeatured: false
    },
    {
      name: "Cozy Oversized Fleece Hoodie",
      description: "Relaxed slouchy fit hoodie constructed from heavy-weight premium organic cotton fleece. Drop shoulders, double-layered hood, and warm brushed inner texture.",
      price: 55,
      brand: "SiennaWools",
      images: ["https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80"],
      stock: 70,
      isFeatured: false
    },
    {
      name: "Off-Shoulder Silk Evening Gown",
      description: "Breathtaking floor-length gown featuring structured off-the-shoulder draping, corset boning, and a dramatic thigh-high slit. Perfect for formal galas and weddings.",
      price: 189,
      brand: "GlamourCo",
      images: ["https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80"],
      stock: 10,
      isFeatured: false
    },
    {
      name: "Linen Drawstring Summer Jumpsuit",
      description: "Breathable pure linen utility jumpsuit with an adjustable drawstring waist, classic collar, chest pockets, and relaxed straight-leg profile for warm climates.",
      price: 59,
      brand: "MeadowKids",
      images: ["https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80"],
      stock: 30,
      isFeatured: false
    }
  ],
  "Tech & Gadgets": [
    {
      name: "Noise-Cancelling Wireless Headphones",
      description: "Premium over-ear headphones featuring industry-leading active noise cancellation (ANC), 40-hour battery life, quick charging, and dual high-fidelity microphones.",
      price: 249,
      brand: "SonicX",
      images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"],
      stock: 45,
      isFeatured: true
    },
    {
      name: "Mechanical Gaming Keyboard RGB",
      description: "Tactile mechanical switches (blue) with customizable per-key dynamic RGB backlighting, brushed aluminium faceplate, and dedicated media keys for intense gaming.",
      price: 89,
      brand: "ClickPro",
      images: ["https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&auto=format&fit=crop&q=80"],
      stock: 60,
      isFeatured: false
    },
    {
      name: "Ergonomic Wireless Mouse",
      description: "Precision optical wireless mouse featuring comfortable hand rest grips, silent clicks, adjustable DPI settings (800 to 2400), and a long-life rechargeable battery.",
      price: 35,
      brand: "ClickPro",
      images: ["https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&auto=format&fit=crop&q=80"],
      stock: 120,
      isFeatured: false
    },
    {
      name: "HD Portable Smart Projector",
      description: "Ultra-compact LED projector capable of throwing a 120-inch HD display. Built-in Android TV OS, stereo speakers, keystone correction, and dual HDMI and wireless casting inputs.",
      price: 179,
      brand: "OmniView",
      images: ["https://images.unsplash.com/photo-1535016120720-40c646be5580?w=800&auto=format&fit=crop&q=80"],
      stock: 15,
      isFeatured: true
    },
    {
      name: "Smart Fitness Watch Sport",
      description: "Sleek AMOLED smart watch tracking heart rate, blood oxygen, sleep quality, and 20+ sports activities. IP68 waterproof design with integrated GPS routing.",
      price: 129,
      brand: "ChronoFit",
      images: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&auto=format&fit=crop&q=80"],
      stock: 55,
      isFeatured: false
    },
    {
      name: "4K Waterproof Action Camera",
      description: "Capture adventure in 4K UHD video at 60 FPS. Includes a 170-degree wide lens, advanced electronic image stabilization (EIS), and a 30m waterproof casing.",
      price: 99,
      brand: "OmniView",
      images: ["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80"],
      stock: 30,
      isFeatured: false
    },
    {
      name: "Bluetooth Mini Speaker Pro",
      description: "Pocket-sized wireless speaker delivering rich 360-degree stereo sound. IPX7 fully waterproof, dustproof design with 15 hours of continuous music playback.",
      price: 49,
      brand: "SonicX",
      images: ["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&auto=format&fit=crop&q=80"],
      stock: 80,
      isFeatured: false
    },
    {
      name: "High Capacity Power Bank 30k",
      description: "30,000mAh external battery packs with dual USB-C Power Delivery (PD) outputs. Quickly charges smartphones, tablets, and lightweight laptops on long journeys.",
      price: 45,
      brand: "ChargeCore",
      images: ["https://images.unsplash.com/photo-1609592424089-c4df424a13d7?w=800&auto=format&fit=crop&q=80"],
      stock: 95,
      isFeatured: false
    },
    {
      name: "USB-C Multi-port Hub 8-in-1",
      description: "Sleek aluminum adapter expanding a single USB-C port to 4K HDMI, Gigabit Ethernet, SD/TF card readers, power pass-through, and three high-speed USB 3.0 ports.",
      price: 39,
      brand: "ChargeCore",
      images: ["https://images.unsplash.com/photo-1468495244123-6c6c332eeece?w=800&auto=format&fit=crop&q=80"],
      stock: 110,
      isFeatured: false
    },
    {
      name: "Virtual Reality Headset Elite",
      description: "All-in-one standalone VR headset featuring high-resolution screen panels, 6DOF tracking, intuitive controllers, and a rich library of interactive apps and games.",
      price: 299,
      brand: "OmniView",
      images: ["https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&auto=format&fit=crop&q=80"],
      stock: 12,
      isFeatured: false
    }
  ],
  "Home & Living": [
    {
      name: "Scented Soy Wax Candles Set",
      description: "Set of three luxury aromatherapy candles made from natural biodegradable soy wax. Scent profiles include Lavender Breeze, Citrus Wood, and Vanilla Bean.",
      price: 24,
      brand: "ZenHome",
      images: ["https://images.unsplash.com/photo-1603006905003-be475563bc59?w=800&auto=format&fit=crop&q=80"],
      stock: 85,
      isFeatured: true
    },
    {
      name: "Minimalist Ceramic Mug Set",
      description: "Four artisan-made ceramic mugs finished in matte earth-toned glazes. Ergonomic circular handles and microwave and dishwasher safe, perfect for morning coffees.",
      price: 29,
      brand: "TerraCraft",
      images: ["https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80"],
      stock: 60,
      isFeatured: false
    },
    {
      name: "Velvet Decorative Throw Pillows",
      description: "Pack of two soft velvet throw pillow covers in deep emerald green. Features hidden zippers and premium stitching, adding instant class to any living room sofa.",
      price: 19,
      brand: "ZenHome",
      images: ["https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&auto=format&fit=crop&q=80"],
      stock: 140,
      isFeatured: false
    },
    {
      name: "Geometric Cotton Living Room Rug",
      description: "Hand-woven cotton area rug (5x7 feet) decorated with sharp minimalist geometric motifs. Extremely durable, soft to walk on, and easy to shake clean.",
      price: 89,
      brand: "TerraCraft",
      images: ["https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800&auto=format&fit=crop&q=80"],
      stock: 20,
      isFeatured: true
    },
    {
      name: "Modern Silent Wall Clock",
      description: "12-inch circular wall clock featuring a premium quartz mechanism for noiseless operation. Clean dial plates and glass cover, perfect for bedrooms or offices.",
      price: 35,
      brand: "Chronos",
      images: ["https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=800&auto=format&fit=crop&q=80"],
      stock: 50,
      isFeatured: false
    },
    {
      name: "Indoor Self-Watering Planter",
      description: "Smart dual-layer planter featuring an integrated water reservoir and cotton wick system. Keeps houseplants perfectly hydrated without danger of overwatering.",
      price: 18,
      brand: "FloraLife",
      images: ["https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&auto=format&fit=crop&q=80"],
      stock: 100,
      isFeatured: false
    },
    {
      name: "Stainless Steel French Press",
      description: "Double-walled insulated French press coffee maker (1 Liter). Features a 4-level filtration mesh to extract maximum flavor while blocking fine coffee grinds.",
      price: 34,
      brand: "TerraCraft",
      images: ["https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80"],
      stock: 45,
      isFeatured: false
    },
    {
      name: "Insulated Stainless Water Bottle",
      description: "Double-walled vacuum insulated canteen keeping drinks icy cold for 24 hours or piping hot for 12. Durable powder coat finish with a leakproof loop cap.",
      price: 22,
      brand: "AeroCore",
      images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80"],
      stock: 120,
      isFeatured: false
    },
    {
      name: "Premium Bamboo Bed Sheet Set",
      description: "Silky soft, hypoallergenic bed sheets woven from 100% organic bamboo viscose. Highly breathable and moisture-wicking, ensuring a cool, refreshing night of sleep.",
      price: 79,
      brand: "ZenHome",
      images: ["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80"],
      stock: 35,
      isFeatured: false
    },
    {
      name: "Ultrasonic Essential Oil Diffuser",
      description: "Aesthetic ceramic ultrasonic diffuser producing cool mist. Operates silently, features 7 color LED lights, auto shutoff, and runs up to 8 hours continuously.",
      price: 39,
      brand: "ZenHome",
      images: ["https://images.unsplash.com/photo-1602928321679-560bb453f190?w=800&auto=format&fit=crop&q=80"],
      stock: 60,
      isFeatured: false
    }
  ],
  "Sports & Fitness": [
    {
      name: "Non-Slip Alignment Yoga Mat",
      description: "Eco-friendly natural rubber yoga mat featuring physical alignment laser-etched lines, offering premium cushion and reliable wet/dry slip-resistant surface.",
      price: 49,
      brand: "AuraFit",
      images: ["https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=800&auto=format&fit=crop&q=80"],
      stock: 75,
      isFeatured: true
    },
    {
      name: "Adjustable Heavy Dumbbell Set",
      description: "Compact selector dumbbells adjustable from 5 to 52.5 lbs per hand. Easily change weights with simple selector dials, replacing 15 separate dumbbell pairs.",
      price: 220,
      brand: "IronPower",
      images: ["https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=800&auto=format&fit=crop&q=80"],
      stock: 10,
      isFeatured: true
    },
    {
      name: "Resistance Loop Bands Pack of 5",
      description: "Heavy-duty natural latex loop bands ranging from Light to XX-Heavy resistance. Ideal for physical therapy, home workouts, yoga, strength training, and warmups.",
      price: 15,
      brand: "AuraFit",
      images: ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"],
      stock: 200,
      isFeatured: false
    },
    {
      name: "Outdoor Trail Running Hydration Vest",
      description: "Lightweight, form-fitting running vest with multiple quick-access front pockets, including two 500ml soft water flasks and space for a 2L hydration bladder.",
      price: 65,
      brand: "ApexTrail",
      images: ["https://images.unsplash.com/photo-1502904580175-9a40562e1c9e?w=800&auto=format&fit=crop&q=80"],
      stock: 30,
      isFeatured: false
    },
    {
      name: "Stainless Steel Protein Shaker",
      description: "Double-walled vacuum insulated protein bottle. Keeps drinks cold up to 24 hours. Features a leakproof snap cap and surgical-grade stainless blending wire whisk ball.",
      price: 24,
      brand: "IronPower",
      images: ["https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=800&auto=format&fit=crop&q=80"],
      stock: 150,
      isFeatured: false
    },
    {
      name: "High Density Foam Roller",
      description: "Deep tissue massage roller for muscle recovery and physical therapy. Features grid patterns targeting sore muscle nodules, relieving stiffness after gym workouts.",
      price: 19,
      brand: "AuraFit",
      images: ["https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&auto=format&fit=crop&q=80"],
      stock: 80,
      isFeatured: false
    },
    {
      name: "Waterproof Wireless Sports Earbuds",
      description: "Secure-fit earhook headphones designed for athletes. Features IPX7 sweatproofing, deep stereo bass, touch controls, and 8 hours of playback per single charge.",
      price: 59,
      brand: "SonicX",
      images: ["https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80"],
      stock: 50,
      isFeatured: false
    },
    {
      name: "Smart Counting Jump Rope",
      description: "Digital jump rope with backlit LCD tracking time, jumps, and calories burned. Weighted handles and tangle-free steel wire rope for conditioning drills.",
      price: 18,
      brand: "AuraFit",
      images: ["https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80"],
      stock: 110,
      isFeatured: false
    },
    {
      name: "Aero Smart Fitness Tracker Band",
      description: "Thin band tracking step counts, distance, daily calories, and heart rate patterns. Directly links to Apple Health and Google Fit via bluetooth syncing.",
      price: 39,
      brand: "ChronoFit",
      images: ["https://images.unsplash.com/photo-1557935728-e6d1eaabe558?w=800&auto=format&fit=crop&q=80"],
      stock: 65,
      isFeatured: false
    },
    {
      name: "Water-Resistant Gym Duffel Bag",
      description: "Heavy-duty gym travel bag (40L) featuring a dedicated shoe compartment, wet pocket for damp towels, and comfortable padded adjustable shoulder strap panels.",
      price: 35,
      brand: "ApexTrail",
      images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80"],
      stock: 45,
      isFeatured: false
    }
  ],
  "Beauty & Cosmetics": [
    {
      name: "Hydrating Hyaluronic Face Serum",
      description: "Dermatologist-tested face serum loaded with pure hyaluronic acid and vitamin B5. Intensely plumps dry skin and diminishes fine wrinkles within two weeks.",
      price: 29,
      brand: "AuraGlow",
      images: ["https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80"],
      stock: 90,
      isFeatured: true
    },
    {
      name: "Velvet Matte Liquid Lipstick Set",
      description: "Pack of 6 stunning waterproof long-lasting liquid lipsticks in classic nudes, pinks, and reds. Creamy smooth formula that dries matte without cracking lips.",
      price: 38,
      brand: "GlamourCo",
      images: ["https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80"],
      stock: 55,
      isFeatured: false
    },
    {
      name: "Organic Raw Aloe Vera Soothing Gel",
      description: "100% natural cold-pressed aloe vera gel. Rapidly calms sunburns, reduces irritation on sensitive skin, and serves as an excellent lightweight face moisturizer.",
      price: 15,
      brand: "Herbals",
      images: ["https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&auto=format&fit=crop&q=80"],
      stock: 120,
      isFeatured: false
    },
    {
      name: "Rosewater Refreshing Facial Toner",
      description: "Alcohol-free hydrating face spray distilled from organic damask rose petals. Instantly revives tired skin, balances natural pH, and sets makeup flawlessly.",
      price: 19,
      brand: "AuraGlow",
      images: ["https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=800&auto=format&fit=crop&q=80"],
      stock: 80,
      isFeatured: true
    },
    {
      name: "Soothing Avocado Clay Face Mask",
      description: "Deep pore cleansing clay mask made with creamy bentonite clay and nourishing avocado oil. Absorbs excess oil control sebum, and leaves skin soft.",
      price: 22,
      brand: "Herbals",
      images: ["https://images.unsplash.com/photo-1567894340315-735d7c361db0?w=800&auto=format&fit=crop&q=80"],
      stock: 75,
      isFeatured: false
    },
    {
      name: "Professional Makeup Brush Set",
      description: "15 pieces of premium synthetic fiber brushes including foundation, powder, blending, eye shadow, and brow liners. Set comes inside a chic leather travel roll.",
      price: 35,
      brand: "GlamourCo",
      images: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&auto=format&fit=crop&q=80"],
      stock: 40,
      isFeatured: false
    },
    {
      name: "Moisturizing Shea Hand Cream Pack",
      description: "Rich butter hand cream enriched with pure organic shea butter and lavender extracts. Instantly hydrates rough cuticles, palms, and knuckles without greasy residue.",
      price: 12,
      brand: "AuraGlow",
      images: ["https://images.unsplash.com/photo-1617897903246-719242758050?w=800&auto=format&fit=crop&q=80"],
      stock: 150,
      isFeatured: false
    },
    {
      name: "Anti-Aging Vitamin C Eye Cream",
      description: "Brightening under-eye treatment packed with vitamin C, caffeine, and hyaluronic acid. Reduces dark circles, morning puffiness, and supports collagen production.",
      price: 26,
      brand: "AuraGlow",
      images: ["https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800&auto=format&fit=crop&q=80"],
      stock: 65,
      isFeatured: false
    },
    {
      name: "Cold-Pressed Organic Coconut Oil",
      description: "Extra virgin pure coconut oil for deep hair conditioning, body massage, and skincare. Highly rich in antioxidants and healthy fatty acids for soft skin.",
      price: 18,
      brand: "Herbals",
      images: ["https://images.unsplash.com/photo-1613759180193-4591780222a0?w=800&auto=format&fit=crop&q=80"],
      stock: 110,
      isFeatured: false
    },
    {
      name: "Activated Charcoal Teeth Whitener",
      description: "All-natural organic teeth whitening powder made of active coconut shell charcoal. Safely lifts coffee, tea, and tobacco stains without chemical bleaches.",
      price: 14,
      brand: "GlamourCo",
      images: ["https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800&auto=format&fit=crop&q=80"],
      stock: 130,
      isFeatured: false
    }
  ],
  "Books & Stationery": [
    {
      name: "Premium Leather Journal Notebook",
      description: "Elegant hardback writing journal featuring a genuine handcrafted leather cover, refillable pages, 200 pages of thick cream paper, and secure strap wraps.",
      price: 22,
      brand: "PaperLux",
      images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80"],
      stock: 80,
      isFeatured: true
    },
    {
      name: "Calligraphy Fountain Pen Set",
      description: "Handcrafted vintage fountain pen set with three interchangeable iridium nibs, ink converter pump, and premium black ink bottle, boxed in a mahogany gift box.",
      price: 45,
      brand: "PaperLux",
      images: ["https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=800&auto=format&fit=crop&q=80"],
      stock: 35,
      isFeatured: false
    },
    {
      name: "Minimalist Mesh Desk Organizer",
      description: "Five-compartment steel mesh desk organizer with sliding tray drawers, pencil holders, and document file racks. Keeps messy workspaces neat.",
      price: 19,
      brand: "Organiq",
      images: ["https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800&auto=format&fit=crop&q=80"],
      stock: 90,
      isFeatured: false
    },
    {
      name: "Pastel Aesthetic Highlighters Pack",
      description: "Pack of 6 soft-hued pastel highlighters. Water-based quick dry pigment ink prevents paper bleeds, perfect for journaling and studying notes.",
      price: 9,
      brand: "PaperLux",
      images: ["https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=800&auto=format&fit=crop&q=80"],
      stock: 160,
      isFeatured: false
    },
    {
      name: "Hardcover Sci-Fi Novel: The Star Maker",
      description: "Epic sci-fi adventure exploring space, artificial intelligence, and human destiny across galaxies. Deluxe collector's edition with silver foil embossing.",
      price: 24,
      brand: "NovaPress",
      images: ["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=800&auto=format&fit=crop&q=80"],
      stock: 45,
      isFeatured: true
    },
    {
      name: "Illustrated Hardcover World Atlas",
      description: "Large format comprehensive world atlas containing stunning satellite imagery maps, geographic facts, demographic graphs, and flags of every nation.",
      price: 49,
      brand: "NovaPress",
      images: ["https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&auto=format&fit=crop&q=80"],
      stock: 15,
      isFeatured: false
    },
    {
      name: "Self-Stick Notes Color Wheel",
      description: "Chic circular tray packing 800 sheets of colorful sticky notes in different sizes and shapes, backing strong adhesives that leave zero clean residue.",
      price: 12,
      brand: "Organiq",
      images: ["https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?w=800&auto=format&fit=crop&q=80"],
      stock: 110,
      isFeatured: false
    },
    {
      name: "Professional Sketching Pencils Set",
      description: "Set of 12 sketching graphite pencils grading from soft 8B to hard 2H. Includes sketch blending stumps, eraser, sharpener, and portable zip pouch.",
      price: 18,
      brand: "PaperLux",
      images: ["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=80"],
      stock: 75,
      isFeatured: false
    },
    {
      name: "Metal Custom Bookmarks Pack of 3",
      description: "Exquisitely hollowed-out brass metal bookmarks depicting lotus leaves, sakura buds, and maple leaves. Perfect gift for avid bookworms.",
      price: 15,
      brand: "PaperLux",
      images: ["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=80"],
      stock: 140,
      isFeatured: false
    },
    {
      name: "Flexible LED Reading Desk Lamp",
      description: "Rechargeable clip-on book reading lamp with a flexible gooseneck, three warmth settings, eye-protection diffusion filters, and a USB charging cable.",
      price: 16,
      brand: "Organiq",
      images: ["https://images.unsplash.com/photo-1534224039826-c7a0dea0e66a?w=800&auto=format&fit=crop&q=80"],
      stock: 60,
      isFeatured: false
    }
  ],
  "Shoes & Footwear": [
    {
      name: "Ultra Breathable Running Sneakers",
      description: "Engineered knit mesh upper for absolute breathability, paired with responsive cushioning technology that absorbs joint shock on heavy marathons.",
      price: 89,
      brand: "SwiftFoot",
      images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80"],
      stock: 45,
      isFeatured: true
    },
    {
      name: "Classic Italian Leather Loafers",
      description: "Indulge in absolute luxury with our premium calfskin loafers. Handcrafted in Italy, featuring cushioned memory foam insoles and slip-resistant leather outsoles.",
      price: 149,
      brand: "Sartorial",
      images: ["https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=800&auto=format&fit=crop&q=80"],
      stock: 20,
      isFeatured: true
    },
    {
      name: "Waterproof Trail Hiking Boots",
      description: "Designed for rough terrain. Features a waterproof membrane shell, heavy-grip rubber lugged tread patterns, and reinforced steel ankle supports.",
      price: 110,
      brand: "SwiftFoot",
      images: ["https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80"],
      stock: 25,
      isFeatured: false
    },
    {
      name: "Casual Low-Top Canvas Shoes",
      description: "Versatile retro canvas flats featuring a comfortable rubber shell cap, flat laces, and memory foam padding. Easily styled with casual jeans and shorts.",
      price: 45,
      brand: "Basix",
      images: ["https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80"],
      stock: 90,
      isFeatured: false
    },
    {
      name: "Pointed Toe High Heel Pumps",
      description: "Sleek stiletto pumps (3.5-inch heel height) crafted from luxury suede leather. Features shock absorbing heel pads for night-long comfort and confidence.",
      price: 79,
      brand: "Sartorial",
      images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80"],
      stock: 35,
      isFeatured: false
    },
    {
      name: "Cork Footbed Leather Sandals",
      description: "Ergonomic slides with double adjustable metal buckles and real leather straps. Molded cork footbeds that conform to your foot arches over time.",
      price: 55,
      brand: "Basix",
      images: ["https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80"],
      stock: 80,
      isFeatured: false
    },
    {
      name: "Leather Winter Chelsea Boots",
      description: "Premium water-resistant leather Chelsea boots with stretchable side panels and pull loops. Soft microfiber linings insulate warmth in snow.",
      price: 125,
      brand: "SwiftFoot",
      images: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80"],
      stock: 30,
      isFeatured: false
    },
    {
      name: "Breathable Slip-On Mesh Knit Shoes",
      description: "Sock-like knit sneakers featuring flexible slip-on collars, lightweight construction, and high traction phylon foam soles for absolute walking comfort.",
      price: 49,
      brand: "Basix",
      images: ["https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80"],
      stock: 110,
      isFeatured: false
    },
    {
      name: "Velvet Quilted Luxury Slippers",
      description: "Unwind at home in soft padded velvet house slippers. Thick rubber bottom layers prevent slips on wood flooring while fleece lining warms toes.",
      price: 28,
      brand: "Sartorial",
      images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=800&auto=format&fit=crop&q=80"],
      stock: 65,
      isFeatured: false
    },
    {
      name: "Cross-Training Athletic Shoes",
      description: "Multifaceted sneakers built for weightlifting, HIIT, and cardio workouts. Features flat heels for structural squats and stable lateral grips.",
      price: 95,
      brand: "SwiftFoot",
      images: ["https://images.unsplash.com/photo-1514989940723-e8e5163ccbe8?w=800&auto=format&fit=crop&q=80"],
      stock: 40,
      isFeatured: false
    }
  ]
};

// Connect and Seed Database
async function seedDatabase() {
  if (!process.env.MONGO_URI) {
    console.error("Error: MONGO_URI environment variable is missing in server/.env");
    process.exit(1);
  }

  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected successfully.");

    // Ensure users exist
    console.log("Setting up seed users...");
    let customerUser = await User.findOne({ email: "customer@nexura.com" });
    if (!customerUser) {
      customerUser = await User.create({
        name: "John Doe",
        email: "customer@nexura.com",
        password: "password123",
        role: "customer"
      });
      console.log("Created Customer User: customer@nexura.com (pw: password123)");
    }

    let adminUser = await User.findOne({ email: "admin@nexura.com" });
    if (!adminUser) {
      adminUser = await User.create({
        name: "Nexura Admin",
        email: "admin@nexura.com",
        password: "adminpassword",
        role: "admin"
      });
      console.log("Created Admin User: admin@nexura.com (pw: adminpassword)");
    }

    // Clear existing data
    console.log("Clearing existing Category and Product collections...");
    await Product.deleteMany({});
    await Category.deleteMany({});
    console.log("Collections cleared.");

    // Seeding Categories
    const categoryDocMap = {};
    for (const catData of categoriesData) {
      const category = new Category({
        name: catData.name,
        image: catData.image
      });
      await category.save();
      categoryDocMap[catData.name] = category._id;
      console.log(`Seeded Category: ${catData.name}`);
    }

    // Seeding Products
    let totalSeededProducts = 0;
    for (const [catName, productsList] of Object.entries(productsByCategoryData)) {
      const categoryId = categoryDocMap[catName];
      if (!categoryId) continue;

      for (const prodData of productsList) {
        // Create unit structure
        const units = [
          {
            label: "Standard Item",
            price: prodData.price,
            stock: prodData.stock,
            isDefault: true
          },
          {
            label: "Pack of 2",
            price: Math.round(prodData.price * 1.8),
            stock: Math.floor(prodData.stock / 2),
            isDefault: false
          }
        ];

        // Create reviews for featured products
        const reviews = [];
        let ratings = 0;
        let numReviews = 0;

        if (prodData.isFeatured) {
          const rating1 = 5;
          const rating2 = 4;
          reviews.push(
            {
              user: customerUser._id,
              rating: rating1,
              comment: "Absolutely outstanding quality! I would highly recommend this to anyone looking for a reliable product.",
              createdAt: new Date()
            },
            {
              user: adminUser._id,
              rating: rating2,
              comment: "Very durable build, fits the description perfectly and represents great value.",
              createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
            }
          );
          numReviews = 2;
          ratings = (rating1 + rating2) / 2;
        }

        const product = new Product({
          name: prodData.name,
          description: prodData.description,
          price: prodData.price,
          category: categoryId,
          brand: prodData.brand,
          images: prodData.images,
          units: units,
          stock: prodData.stock + Math.floor(prodData.stock / 2), // Total stock = sum of units
          isFeatured: prodData.isFeatured,
          reviews: reviews,
          ratings: ratings,
          numReviews: numReviews
        });

        await product.save();
        totalSeededProducts++;
      }
      console.log(`Seeded 10 products for Category: ${catName}`);
    }

    console.log(`All operations completed successfully. Seeded ${categoriesData.length} categories and ${totalSeededProducts} products.`);
    process.exit(0);
  } catch (error) {
    console.error("Seeding operation failed:", error);
    process.exit(1);
  }
}

seedDatabase();
