/* ==========================================================================
   Craftora - Shared Product & Artisan Catalogue (Single Source of Truth)
   Reused by index.html and all pages/*.html without duplicating data.
   ========================================================================== */

(function (global) {
  "use strict";

  const CATEGORIES = [
    {
      id: "ajrak-textiles",
      name: "Ajrak & Textiles",
      description: "Hand-block printed Sindhi Ajrak dupattas and natural-dyed cotton weaves from Matiari.",
      countLabel: "Matiari, Sindh"
    },
    {
      id: "blue-pottery",
      name: "Blue Pottery",
      description: "Kiln-fired Multani Kashi ceramic vases and hand-painted stoneware from Multan.",
      countLabel: "Multan, Punjab"
    },
    {
      id: "wood-carving",
      name: "Wood Carving",
      description: "Seasoned Sheesham keepsake boxes and floral relief carvings from Chiniot.",
      countLabel: "Chiniot, Punjab"
    },
    {
      id: "embroidery",
      name: "Embroidery",
      description: "Intricate Sindhi needlework and mirror-work cushion covers crafted in Hala.",
      countLabel: "Hala, Sindh"
    },
    {
      id: "leather-crafts",
      name: "Leather Crafts",
      description: "Hand-stitched traditional leather khussas crafted by Lahore master cobblers.",
      countLabel: "Lahore, Punjab"
    },
    {
      id: "truck-art",
      name: "Truck-Art Décor",
      description: "Hand-painted floral motifs on decorative trays inspired by Rawalpindi truck art.",
      countLabel: "Rawalpindi, Punjab"
    }
  ];

  // Fictional demo artisan profiles (a001 - a006)
  const ARTISANS = [
    {
      id: "a001",
      name: "Zainab's Loom",
      craft: "Ajrak & Textiles",
      category: "ajrak-textiles",
      city: "Matiari, Sindh",
      experience: "18 Years Workshop Heritage",
      image: "images/artisan-a002.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Zainab's Loom in Matiari, Sindh",
      bio: "Family-run Matiari textile studio producing hand-carved wooden block-printed Ajrak dupattas dyed with indigo and madder root.",
      isDemo: true
    },
    {
      id: "a002",
      name: "Kashi Studio",
      craft: "Blue Pottery",
      category: "blue-pottery",
      city: "Multan, Punjab",
      experience: "26 Years Workshop Heritage",
      image: "images/artisan-a001.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Kashi Studio in Multan, Punjab",
      bio: "Traditional Multani pottery guild hand-throwing quartz-clay vases painted in signature cobalt blue and turquoise Kashi florals.",
      isDemo: true
    },
    {
      id: "a003",
      name: "Darakht Works",
      craft: "Wood Carving",
      category: "wood-carving",
      city: "Chiniot, Punjab",
      experience: "30 Years Workshop Heritage",
      image: "images/artisan-a003.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Darakht Works in Chiniot, Punjab",
      bio: "Chiniot master woodcarvers shaping seasoned Sheesham rosewood boxes with fine hand-chiselled filigree and brass detailing.",
      isDemo: true
    },
    {
      id: "a004",
      name: "Gulzar Needlecraft",
      craft: "Embroidery",
      category: "embroidery",
      city: "Hala, Sindh",
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
      experience: "22 Years Workshop Heritage",
      image: "images/artisan-a005.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Qissa Leather House in Lahore, Punjab",
      bio: "Heritage Lahore footwear workshop crafting supple vegetable-tanned leather khussas stitched entirely with waxed cotton thread.",
      isDemo: true
    },
    {
      id: "a006",
      name: "Rang Caravan",
      craft: "Truck-Art Décor",
      category: "truck-art",
      city: "Rawalpindi, Punjab",
      experience: "19 Years Workshop Heritage",
      image: "images/artisan-a006.svg",
      alt: "Natural-light workshop portrait for fictional demo artisan Rang Caravan in Rawalpindi, Punjab",
      bio: "Rawalpindi decorative painters translating iconic Pakistani truck-art peacocks, chamakpatti, and floral borders onto home trays.",
      isDemo: true
    }
  ];

  // Official Craftora product catalogue (p001 - p006) in PKR
  const PRODUCTS = [
    {
      id: "p001",
      name: "Ajrak Dupatta",
      category: "ajrak-textiles",
      categoryLabel: "Ajrak & Textiles",
      price: 4500,
      currency: "PKR",
      artisanId: "a001",
      artisanName: "Zainab's Loom",
      origin: "Matiari, Sindh",
      rating: 4.9,
      reviewsCount: 44,
      badge: "Bestseller",
      material: "100% handloom cotton, botanical indigo & madder dye",
      dimensions: "240 cm x 110 cm with hand-knotted fringe",
      image: "images/product-p001.webp",
      alt: "Studio photograph of a crimson and indigo block-printed Sindhi Ajrak Dupatta by Zainab's Loom",
      description: "Double-sided block-printed Ajrak dupatta crafted in Matiari using hand-carved wooden stamps, resist clay paste, and rich natural indigo and crimson dyes."
    },
    {
      id: "p002",
      name: "Multani Blue Pottery Vase",
      category: "blue-pottery",
      categoryLabel: "Blue Pottery",
      price: 3200,
      currency: "PKR",
      artisanId: "a002",
      artisanName: "Kashi Studio",
      origin: "Multan, Punjab",
      rating: 4.9,
      reviewsCount: 38,
      badge: "Heritage Kiln",
      material: "Quartz-clay stoneware with mineral cobalt & turquoise glaze",
      dimensions: "Height 26 cm x Diameter 15 cm",
      image: "images/product-p002.webp",
      alt: "Studio photograph of a hand-painted Multani Blue Pottery Vase with cobalt floral motifs by Kashi Studio",
      description: "Hand-thrown from Multan's signature quartz-rich clay and hand-painted with traditional Kashi floral brushwork before kiln glazing."
    },
    {
      id: "p003",
      name: "Chinioti Carved Wooden Box",
      category: "wood-carving",
      categoryLabel: "Wood Carving",
      price: 5800,
      currency: "PKR",
      artisanId: "a003",
      artisanName: "Darakht Works",
      origin: "Chiniot, Punjab",
      rating: 4.9,
      reviewsCount: 31,
      badge: "Heirloom Craft",
      material: "Seasoned Pakistani Sheesham wood with brass inlay",
      dimensions: "25 cm x 17 cm x 11 cm",
      image: "images/product-p003.webp",
      alt: "Studio photograph of a Chinioti Carved Wooden Box in seasoned Sheesham rosewood by Darakht Works",
      description: "Hand-chiselled solid Sheesham keepsake chest featuring traditional Chinioti floral relief carving, velvet lining, and brass clasp hardware."
    },
    {
      id: "p004",
      name: "Embroidered Cushion Cover",
      category: "embroidery",
      categoryLabel: "Embroidery",
      price: 2400,
      currency: "PKR",
      artisanId: "a004",
      artisanName: "Gulzar Needlecraft",
      origin: "Hala, Sindh",
      rating: 4.8,
      reviewsCount: 51,
      badge: "Small Batch",
      material: "Unbleached cotton slub with hand-worked Sindhi embroidery",
      dimensions: "45 cm x 45 cm (18 x 18 in)",
      image: "images/product-p004.webp",
      alt: "Studio photograph of a hand-embroidered Sindhi Cushion Cover by Gulzar Needlecraft in Hala",
      description: "Tactile cushion cover hand-embroidered in Hala with geometric heritage stitches and subtle mirror accents on breathable woven cotton."
    },
    {
      id: "p005",
      name: "Traditional Leather Khussa",
      category: "leather-crafts",
      categoryLabel: "Leather Crafts",
      price: 6500,
      currency: "PKR",
      artisanId: "a005",
      artisanName: "Qissa Leather House",
      origin: "Lahore, Punjab",
      rating: 4.9,
      reviewsCount: 29,
      badge: "Hand-Stitched",
      material: "Vegetable-tanned cowhide leather & waxed cotton thread",
      dimensions: "Available in EU 37–44 (PK 4–10)",
      image: "images/product-p005.webp",
      alt: "Studio photograph of a pair of Traditional Leather Khussa shoes handcrafted by Qissa Leather House in Lahore",
      description: "Supple hand-lasted Lahore leather khussa stitched with zero nails or synthetic glue, finished with fine tilla-inspired embossed detailing."
    },
    {
      id: "p006",
      name: "Truck-Art Decorative Tray",
      category: "truck-art",
      categoryLabel: "Truck-Art Décor",
      price: 1850,
      currency: "PKR",
      artisanId: "a006",
      artisanName: "Rang Caravan",
      origin: "Rawalpindi, Punjab",
      rating: 4.8,
      reviewsCount: 47,
      badge: "Artisan Pop",
      material: "Seasoned mango wood with hand-painted enamel & clear lacquer",
      dimensions: "36 cm x 24 cm x 4 cm",
      image: "images/product-p006.webp",
      alt: "Studio photograph of a hand-painted Truck-Art Decorative Tray by Rang Caravan in Rawalpindi",
      description: "Vibrant hand-painted serving and centrepiece tray by Rawalpindi truck artists, sealed with a durable food-safe protective finish."
    }
  ];

  function formatPKR(amount) {
    return "Rs. " + Number(amount).toLocaleString("en-PK");
  }

  function resolveAssetPath(path) {
    if (!path) return "";
    if (/^(https?:)?\/\//i.test(path) || path.startsWith("../")) {
      return path;
    }
    const inPagesDir = /\/pages\/[^/]*$/i.test(window.location.pathname);
    return inPagesDir ? "../" + path : path;
  }

  function getProductById(id) {
    return PRODUCTS.find((item) => item.id === id) || null;
  }

  function getArtisanById(id) {
    return ARTISANS.find((artisan) => artisan.id === id) || null;
  }

  global.CraftoraData = {
    categories: CATEGORIES,
    artisans: ARTISANS,
    products: PRODUCTS,
    formatPKR: formatPKR,
    resolveAssetPath: resolveAssetPath,
    getProductById: getProductById,
    getArtisanById: getArtisanById
  };
})(window);
