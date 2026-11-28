/* ==========================================================================
   Craftora - Shared Product & Artisan Catalogue (Single Source of Truth)
   Reused by index.html and all pages/*.html without duplicating data.
   ========================================================================== */

(function (global) {
  "use strict";

  // Official Craftora Categories (9 Official Categories)
  const CATEGORIES = [
    {
      id: "handwoven-textiles",
      name: "Handwoven Textiles",
      aliases: ["ajrak-textiles", "textiles", "handwoven-textiles", "ajrak"],
      description: "Hand-block printed Sindhi Ajrak dupattas, shawls, and natural-dyed cotton weaves from Matiari.",
      countLabel: "Matiari, Sindh"
    },
    {
      id: "pottery-ceramics",
      name: "Pottery & Ceramics",
      aliases: ["blue-pottery", "pottery", "ceramics", "pottery-ceramics"],
      description: "Kiln-fired Multani Kashi ceramic vases, bowls, and hand-painted glazed stoneware from Multan.",
      countLabel: "Multan, Punjab"
    },
    {
      id: "wooden-handicrafts",
      name: "Wooden Handicrafts",
      aliases: ["wood-carving", "woodcraft", "wood", "wooden-handicrafts"],
      description: "Seasoned Sheesham keepsake boxes, brass inlay work, and floral relief carvings from Chiniot.",
      countLabel: "Chiniot, Punjab"
    },
    {
      id: "embroidery-needlework",
      name: "Embroidery & Needlework",
      aliases: ["embroidery", "needlework", "embroidery-needlework"],
      description: "Intricate Sindhi needlework, geometric threadcraft, and mirror-work cushion covers crafted in Hala.",
      countLabel: "Hala, Sindh"
    },
    {
      id: "leather-crafts",
      name: "Leather Crafts",
      aliases: ["leather-crafts", "leather", "khussa"],
      description: "Hand-stitched traditional leather khussas and vegetable-tanned goods by Lahore master cobblers.",
      countLabel: "Lahore, Punjab"
    },
    {
      id: "traditional-home-decor",
      name: "Traditional Home Décor",
      aliases: ["truck-art", "home-decor", "traditional-home-decor", "decor"],
      description: "Hand-painted floral motifs on decorative trays, wall plates, and accents inspired by truck art.",
      countLabel: "Rawalpindi, Punjab"
    },
    {
      id: "handmade-jewellery",
      name: "Handmade Jewellery",
      aliases: ["jewellery", "jewelry", "handmade-jewellery"],
      description: "Artisanal filigree brass earrings, pendants, and traditional handcrafted statement pieces.",
      countLabel: "Chiniot & Lahore"
    },
    {
      id: "cultural-accessories",
      name: "Cultural Accessories",
      aliases: ["cultural-accessories", "accessories", "clutches"],
      description: "Hand-embroidered silk clutches, block-printed scarves, and heirloom regional utility pieces.",
      countLabel: "Hala & Matiari"
    },
    {
      id: "handmade-gifts",
      name: "Handmade Gifts",
      aliases: ["handmade-gifts", "gifts", "gifting"],
      description: "Curated artisan gift sets, miniature keepsakes, and heirloom tokens boxed with craft notes.",
      countLabel: "All Workshops"
    }
  ];

  // Fictional demo artisan profiles (a001 - a006)
  const ARTISANS = [
    {
      id: "a001",
      name: "Zainab's Loom",
      craft: "Handwoven Textiles",
      category: "handwoven-textiles",
      city: "Matiari, Sindh",
      region: "Sindh",
      experience: "18 Years Workshop Heritage",
      image: "images/artisan-a002.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Zainab's Loom in Matiari, Sindh",
      bio: "Family-run Matiari textile studio producing hand-carved wooden block-printed Ajrak dupattas dyed with indigo and madder root.",
      isDemo: true
    },
    {
      id: "a002",
      name: "Kashi Studio",
      craft: "Pottery & Ceramics",
      category: "pottery-ceramics",
      city: "Multan, Punjab",
      region: "Punjab",
      experience: "26 Years Workshop Heritage",
      image: "images/artisan-a001.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Kashi Studio in Multan, Punjab",
      bio: "Traditional Multani pottery guild hand-throwing quartz-clay vases painted in signature cobalt blue and turquoise Kashi florals.",
      isDemo: true
    },
    {
      id: "a003",
      name: "Darakht Works",
      craft: "Wooden Handicrafts",
      category: "wooden-handicrafts",
      city: "Chiniot, Punjab",
      region: "Punjab",
      experience: "30 Years Workshop Heritage",
      image: "images/artisan-a003.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Darakht Works in Chiniot, Punjab",
      bio: "Chiniot master woodcarvers shaping seasoned Sheesham rosewood boxes with fine hand-chiselled filigree and brass detailing.",
      isDemo: true
    },
    {
      id: "a004",
      name: "Gulzar Needlecraft",
      craft: "Embroidery & Needlework",
      category: "embroidery-needlework",
      city: "Hala, Sindh",
      region: "Sindh",
      experience: "15 Years Workshop Heritage",
      image: "images/artisan-a004.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Gulzar Needlecraft in Hala, Sindh",
      bio: "Women-led Hala embroidery collective hand-stitching vibrant geometric threadwork and shisha accents onto soft cotton cushions.",
      isDemo: true
    },
    {
      id: "a005",
      name: "Qissa Leather House",
      craft: "Leather Crafts",
      category: "leather-crafts",
      city: "Lahore, Punjab",
      region: "Punjab",
      experience: "22 Years Workshop Heritage",
      image: "images/artisan-a005.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Qissa Leather House in Lahore, Punjab",
      bio: "Heritage Lahore footwear workshop crafting supple vegetable-tanned leather khussas stitched entirely with waxed cotton thread.",
      isDemo: true
    },
    {
      id: "a006",
      name: "Rang Caravan",
      craft: "Traditional Home Décor",
      category: "traditional-home-decor",
      city: "Rawalpindi, Punjab",
      region: "Punjab",
      experience: "19 Years Workshop Heritage",
      image: "images/artisan-a006.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Rang Caravan in Rawalpindi, Punjab",
      bio: "Rawalpindi decorative painters translating iconic Pakistani truck-art peacocks, chamakpatti, and floral borders onto home trays.",
      isDemo: true
    }
  ];

  // Official Craftora product catalogue in PKR
  // Reuses existing image assets without generating new files
  const PRODUCTS = [
    {
      id: "p001",
      name: "Ajrak Dupatta",
      category: "handwoven-textiles",
      categoryLabel: "Handwoven Textiles",
      categoryAliases: ["ajrak-textiles", "textiles", "handwoven-textiles"],
      price: 4500,
      currency: "PKR",
      artisanId: "a001",
      artisanName: "Zainab's Loom",
      origin: "Matiari, Sindh",
      rating: 4.9,
      reviewsCount: 44,
      badge: "Bestseller",
      featured: true,
      createdAt: "2026-03-10",
      material: "100% handloom cotton, botanical indigo & madder dye",
      dimensions: "240 cm x 110 cm with hand-knotted fringe",
      image: "images/product-p001.png",
      alt: "Studio photograph of a crimson and indigo block-printed Sindhi Ajrak Dupatta by Zainab's Loom",
      description: "Double-sided block-printed Ajrak dupatta crafted in Matiari using hand-carved wooden stamps, resist clay paste, and rich natural indigo and crimson dyes.",
      variants: [
        { name: "Traditional Indigo & Madder Red", image: "images/product-p001.png" },
        { name: "Kashmiri Mustard & Ochre", image: "images/product-p001-v2.png" },
        { name: "Sage Green & Madder", image: "images/product-p001-v3.png" }
      ],
      thumbnails: [
        "images/product-p001.png",
        "images/product-p001-v2.png",
        "images/product-p001-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p002",
      name: "Multani Blue Pottery Vase",
      category: "pottery-ceramics",
      categoryLabel: "Pottery & Ceramics",
      categoryAliases: ["blue-pottery", "pottery", "ceramics", "pottery-ceramics"],
      price: 3200,
      currency: "PKR",
      artisanId: "a002",
      artisanName: "Kashi Studio",
      origin: "Multan, Punjab",
      rating: 4.9,
      reviewsCount: 38,
      badge: "Heritage Kiln",
      featured: true,
      createdAt: "2026-03-08",
      material: "Quartz-clay stoneware with mineral cobalt & turquoise glaze",
      dimensions: "Height 26 cm x Diameter 15 cm",
      image: "images/product-p002.png",
      alt: "Studio photograph of a hand-painted Multani Blue Pottery Vase with cobalt floral motifs by Kashi Studio",
      description: "Hand-thrown from Multan's signature quartz-rich clay and hand-painted with traditional Kashi floral brushwork before kiln glazing.",
      variants: [
        { name: "Cobalt Blossom (Classic)", image: "images/product-p002.png" },
        { name: "Turquoise Lagoon", image: "images/product-p002-v2.png" },
        { name: "Lapis Lazuli Geometric", image: "images/product-p002-v3.png" }
      ],
      thumbnails: [
        "images/product-p002.png",
        "images/product-p002-v2.png",
        "images/product-p002-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p003",
      name: "Chinioti Carved Wooden Box",
      category: "wooden-handicrafts",
      categoryLabel: "Wooden Handicrafts",
      categoryAliases: ["wood-carving", "woodcraft", "wooden-handicrafts"],
      price: 5800,
      currency: "PKR",
      artisanId: "a003",
      artisanName: "Darakht Works",
      origin: "Chiniot, Punjab",
      rating: 4.9,
      reviewsCount: 31,
      badge: "Heirloom Craft",
      featured: true,
      createdAt: "2026-03-01",
      material: "Seasoned Pakistani Sheesham wood with brass inlay",
      dimensions: "25 cm x 17 cm x 11 cm",
      image: "images/product-p003.png",
      alt: "Studio photograph of a Chinioti Carved Wooden Box in seasoned Sheesham rosewood by Darakht Works",
      description: "Hand-chiselled solid Sheesham keepsake chest featuring traditional Chinioti floral relief carving, velvet lining, and brass clasp hardware.",
      variants: [
        { name: "Natural Sheesham Rosewood", image: "images/product-p003.png" },
        { name: "Dark Walnut Finish", image: "images/product-p003-v2.png" },
        { name: "Antiqued Teak & Brass", image: "images/product-p003-v3.png" }
      ],
      thumbnails: [
        "images/product-p003.png",
        "images/product-p003-v2.png",
        "images/product-p003-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p004",
      name: "Embroidered Cushion Cover",
      category: "embroidery-needlework",
      categoryLabel: "Embroidery & Needlework",
      categoryAliases: ["embroidery", "needlework", "embroidery-needlework"],
      price: 2400,
      currency: "PKR",
      artisanId: "a004",
      artisanName: "Gulzar Needlecraft",
      origin: "Hala, Sindh",
      rating: 4.8,
      reviewsCount: 51,
      badge: "Small Batch",
      featured: true,
      createdAt: "2026-02-25",
      material: "Unbleached cotton slub with hand-worked Sindhi embroidery",
      dimensions: "45 cm x 45 cm (18 x 18 in)",
      image: "images/product-p004.png",
      alt: "Studio photograph of a hand-embroidered Sindhi Cushion Cover by Gulzar Needlecraft in Hala",
      description: "Tactile cushion cover hand-embroidered in Hala with geometric heritage stitches and subtle mirror accents on breathable woven cotton.",
      variants: [
        { name: "Ivory & Terracotta (Classic)", image: "images/product-p004.png" },
        { name: "Desert Ochre & Cobalt", image: "images/product-p004-v2.png" },
        { name: "Emerald Green & Gold", image: "images/product-p004-v3.png" }
      ],
      thumbnails: [
        "images/product-p004.png",
        "images/product-p004-v2.png",
        "images/product-p004-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p005",
      name: "Traditional Leather Khussa",
      category: "leather-crafts",
      categoryLabel: "Leather Crafts",
      categoryAliases: ["leather-crafts", "leather", "khussa"],
      price: 6500,
      currency: "PKR",
      artisanId: "a005",
      artisanName: "Qissa Leather House",
      origin: "Lahore, Punjab",
      rating: 4.9,
      reviewsCount: 29,
      badge: "Hand-Stitched",
      featured: true,
      createdAt: "2026-02-20",
      material: "Vegetable-tanned cowhide leather & waxed cotton thread",
      dimensions: "Available in EU 37–44 (PK 4–10)",
      image: "images/product-p005.png",
      alt: "Studio photograph of a pair of Traditional Leather Khussa shoes handcrafted by Qissa Leather House in Lahore",
      description: "Supple hand-lasted Lahore leather khussa stitched with zero nails or synthetic glue, finished with fine tilla-inspired embossed detailing.",
      variants: [
        { name: "EU 38 (PK 5)", image: "images/product-p005.png" },
        { name: "EU 39 (PK 6)", image: "images/product-p005.png" },
        { name: "EU 40 (PK 7)", image: "images/product-p005.png" },
        { name: "EU 41 (PK 8)", image: "images/product-p005.png" },
        { name: "EU 42 (PK 9)", image: "images/product-p005.png" }
      ],
      thumbnails: [
        "images/product-p005.png",
        "images/story-workshop.png",
        "images/hero-craft.png",
        "images/product-p012.png"
      ]
    },
    {
      id: "p006",
      name: "Truck-Art Decorative Tray",
      category: "traditional-home-decor",
      categoryLabel: "Traditional Home Décor",
      categoryAliases: ["truck-art", "home-decor", "traditional-home-decor"],
      price: 1850,
      currency: "PKR",
      artisanId: "a006",
      artisanName: "Rang Caravan",
      origin: "Rawalpindi, Punjab",
      rating: 4.8,
      reviewsCount: 47,
      badge: "Artisan Pop",
      featured: true,
      createdAt: "2026-02-18",
      material: "Seasoned mango wood with hand-painted enamel & clear lacquer",
      dimensions: "36 cm x 24 cm x 4 cm",
      image: "images/product-p006.png",
      alt: "Studio photograph of a hand-painted Truck-Art Decorative Tray by Rang Caravan in Rawalpindi",
      description: "Vibrant hand-painted serving and centrepiece tray by Rawalpindi truck artists, sealed with a durable food-safe protective finish.",
      variants: [
        { name: "Peacock & Sunburst Yellow", image: "images/product-p006.png" },
        { name: "Floral Caravan Red", image: "images/product-p006-v2.png" },
        { name: "Midnight Blue Chamakpatti", image: "images/product-p006-v3.png" }
      ],
      thumbnails: [
        "images/product-p006.png",
        "images/product-p006-v2.png",
        "images/product-p006-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p007",
      name: "Filigree Brass Drop Earrings",
      category: "handmade-jewellery",
      categoryLabel: "Handmade Jewellery",
      categoryAliases: ["jewellery", "jewelry", "handmade-jewellery"],
      price: 3800,
      currency: "PKR",
      artisanId: "a003",
      artisanName: "Darakht Works",
      origin: "Chiniot, Punjab",
      rating: 4.9,
      reviewsCount: 22,
      badge: "Hand-Chiselled",
      featured: false,
      createdAt: "2026-03-12",
      material: "Antiqued sheet brass, hand-carved rosewood accents",
      dimensions: "Drop length 6.5 cm, width 2.8 cm",
      image: "images/product-p007.png",
      alt: "Handcrafted filigree brass drop earrings with carved rosewood accents",
      description: "Delicate floral drop earrings hand-chiselled by master metal craftsmen of Chiniot, combining warm brass lace patterns with deep rosewood studs.",
      variants: [
        { name: "Antiqued Brass & Rosewood", image: "images/product-p007.png" },
        { name: "Burnished Gold Patina", image: "images/product-p007-v2.png" },
        { name: "Silver Patina", image: "images/product-p007-v3.png" }
      ],
      thumbnails: [
        "images/product-p007.png",
        "images/product-p007-v2.png",
        "images/product-p007-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p008",
      name: "Embroidered Silk Clutch",
      category: "cultural-accessories",
      categoryLabel: "Cultural Accessories",
      categoryAliases: ["cultural-accessories", "accessories"],
      price: 2900,
      currency: "PKR",
      artisanId: "a004",
      artisanName: "Gulzar Needlecraft",
      origin: "Hala, Sindh",
      rating: 4.7,
      reviewsCount: 19,
      badge: "Silk Thread",
      featured: false,
      createdAt: "2026-03-14",
      material: "Raw handloom silk with metallic zardozi and needlecraft border",
      dimensions: "22 cm x 13 cm x 4 cm",
      image: "images/product-p008.png",
      alt: "Studio photograph of a hand-embroidered raw silk clutch purse from Hala",
      description: "Elegant evening clutch purse adorned with traditional Sindhi border stitching, lined with smooth cotton and fitted with a concealed magnetic snap.",
      variants: [
        { name: "Raw Crimson Silk", image: "images/product-p008.png" },
        { name: "Royal Indigo Silk", image: "images/product-p008-v2.png" },
        { name: "Heritage Amber Silk", image: "images/product-p008-v3.png" }
      ],
      thumbnails: [
        "images/product-p008.png",
        "images/product-p008-v2.png",
        "images/product-p008-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p009",
      name: "Hand-Painted Keepsake Box",
      category: "handmade-gifts",
      categoryLabel: "Handmade Gifts",
      categoryAliases: ["handmade-gifts", "gifts"],
      price: 1600,
      currency: "PKR",
      artisanId: "a006",
      artisanName: "Rang Caravan",
      origin: "Rawalpindi, Punjab",
      rating: 4.8,
      reviewsCount: 34,
      badge: "Gift Favourite",
      featured: false,
      createdAt: "2026-03-15",
      material: "Hand-painted seasoned wood with high-gloss lacquer seal",
      dimensions: "14 cm x 10 cm x 7 cm",
      image: "images/product-p009.png",
      alt: "Hand-painted truck-art decorative gift keepsake box with floral border",
      description: "A cherished gift piece painted with joyful folk floral motifs and brilliant yellow chamakpatti lining, perfect for rings, trinkets, or tea bags.",
      variants: [
        { name: "Truck-Art Folk Yellow", image: "images/product-p009.png" },
        { name: "Cobalt Floral Enamel", image: "images/product-p009-v2.png" },
        { name: "Terracotta Lacquer", image: "images/product-p009-v3.png" }
      ],
      thumbnails: [
        "images/product-p009.png",
        "images/product-p009-v2.png",
        "images/product-p009-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p010",
      name: "Matiari Indigo Table Runner",
      category: "handwoven-textiles",
      categoryLabel: "Handwoven Textiles",
      categoryAliases: ["ajrak-textiles", "textiles", "handwoven-textiles"],
      price: 5200,
      currency: "PKR",
      artisanId: "a001",
      artisanName: "Zainab's Loom",
      origin: "Matiari, Sindh",
      rating: 4.9,
      reviewsCount: 26,
      badge: "Pure Indigo",
      featured: false,
      createdAt: "2026-03-11",
      material: "Heavy pure handloom cotton dyed with organic indigo",
      dimensions: "180 cm x 40 cm",
      image: "images/product-p010.png",
      alt: "Handloom indigo and terracotta block-printed cotton table runner by Zainab's Loom",
      description: "Stately dining runner block-printed in Matiari with heritage geometric borders, sun-dried on riverbanks and finished with neat selvedges.",
      variants: [
        { name: "Traditional Indigo & Madder Red", image: "images/product-p010.png" },
        { name: "Kashmiri Mustard & Ochre", image: "images/product-p010-v2.png" },
        { name: "Sage Green & Madder", image: "images/product-p010-v3.png" }
      ],
      thumbnails: [
        "images/product-p010.png",
        "images/product-p010-v2.png",
        "images/product-p010-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p011",
      name: "Multani Turquoise Serving Bowl",
      category: "pottery-ceramics",
      categoryLabel: "Pottery & Ceramics",
      categoryAliases: ["blue-pottery", "pottery", "ceramics", "pottery-ceramics"],
      price: 3600,
      currency: "PKR",
      artisanId: "a002",
      artisanName: "Kashi Studio",
      origin: "Multan, Punjab",
      rating: 4.8,
      reviewsCount: 18,
      badge: "Kiln Fired",
      featured: false,
      createdAt: "2026-03-09",
      material: "High-fire stoneware with lead-free food-safe turquoise glaze",
      dimensions: "Diameter 22 cm x Depth 8 cm",
      image: "images/product-p011.png",
      alt: "Hand-glazed Multani blue pottery turquoise ceramic bowl with concentric leaf motifs",
      description: "Generous hand-thrown stoneware bowl featuring concentric turquoise and cobalt glaze strokes, fired at high temperatures for daily table use.",
      variants: [
        { name: "Cobalt Blossom (Classic)", image: "images/product-p011.png" },
        { name: "Turquoise Lagoon", image: "images/product-p011-v2.png" },
        { name: "Lapis Lazuli Geometric", image: "images/product-p011-v3.png" }
      ],
      thumbnails: [
        "images/product-p011.png",
        "images/product-p011-v2.png",
        "images/product-p011-v3.png",
        "images/story-workshop.png"
      ]
    },
    {
      id: "p012",
      name: "Hand-Tooled Leather Folio",
      category: "leather-crafts",
      categoryLabel: "Leather Crafts",
      categoryAliases: ["leather-crafts", "leather"],
      price: 4800,
      currency: "PKR",
      artisanId: "a005",
      artisanName: "Qissa Leather House",
      origin: "Lahore, Punjab",
      rating: 4.9,
      reviewsCount: 27,
      badge: "Artisan Leather",
      featured: false,
      createdAt: "2026-03-13",
      material: "Vegetable-tanned buffalo calf leather, solid brass snap",
      dimensions: "32 cm x 24 cm (fits A4 notebooks and tablets)",
      image: "images/product-p012.png",
      alt: "Vegetable-tanned hand-tooled leather document folio and journal case by Qissa Leather House",
      description: "Executive travel folio hand-cut, burnished, and stitched with heavy waxed linen thread in Lahore's historic Walled City workshop.",
      variants: [
        { name: "A5 Journal Size", image: "images/product-p012.png" },
        { name: "B5 Executive Size", image: "images/product-p012.png" },
        { name: "A4 Portfolio Size", image: "images/product-p012.png" }
      ],
      thumbnails: [
        "images/product-p012.png",
        "images/story-workshop.png",
        "images/hero-craft.png",
        "images/product-p005.png"
      ]
    }
  ];

  function formatPKR(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK");
  }

  function resolveAssetPath(path) {
    if (!path) return "";
    const clean = path.trim();
    if (/^(https?:)?\/\//i.test(clean) || clean.startsWith("../")) {
      return clean;
    }
    const inPagesDir = (typeof window !== "undefined" && window.location) ?
      (/[/\\]pages([/\\]|$)/i.test(window.location.pathname) ||
       window.location.pathname.includes("/pages/") ||
       window.location.pathname.includes("\\pages\\") ||
       window.location.pathname.endsWith("product-details.html") ||
       window.location.pathname.endsWith("marketplace.html") ||
       window.location.pathname.endsWith("artisan-directory.html") ||
       window.location.pathname.endsWith("artisan-profile.html")) : false;
    return inPagesDir ? "../" + clean : clean;
  }

  function getProductById(id) {
    return PRODUCTS.find((item) => item.id === id) || null;
  }

  function getArtisanById(id) {
    return ARTISANS.find((artisan) => artisan.id === id) || null;
  }

  function getCategoryById(id) {
    if (!id) return null;
    const clean = id.toLowerCase().trim();
    return CATEGORIES.find(
      (c) => c.id === clean || (c.aliases && c.aliases.includes(clean))
    ) || null;
  }

  global.CraftoraData = {
    categories: CATEGORIES,
    artisans: ARTISANS,
    products: PRODUCTS,
    formatPKR: formatPKR,
    resolveAssetPath: resolveAssetPath,
    getProductById: getProductById,
    getArtisanById: getArtisanById,
    getCategoryById: getCategoryById
  };
})(window);
