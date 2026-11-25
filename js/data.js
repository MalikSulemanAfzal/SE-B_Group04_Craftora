/* ==========================================================================
   Craftora - Marketplace Data
   Sample artisans (a001-a006) and Pakistani handicraft products (p001-p006)
   priced in Pakistani Rupees (PKR).
   ========================================================================== */

(function (root) {
  "use strict";

  const ARTISANS = [
    {
      id: "a001",
      name: "Ustad Tariq Mehmood",
      craft: "Multani Blue Pottery (Kashigari)",
      city: "Multan",
      province: "Punjab",
      yearsExperience: 24,
      bio: "Third-generation kashigar crafting hand-painted cobalt and turquoise stoneware using traditional mineral glazes."
    },
    {
      id: "a002",
      name: "Mai Haseena Khatoon",
      craft: "Sindhi Ajrak & Block Printing",
      city: "Bhit Shah",
      province: "Sindh",
      yearsExperience: 18,
      bio: "Specializes in carved teak wood-block resist dyeing with natural indigo, madder root, and pomegranate rind."
    },
    {
      id: "a003",
      name: "Haji Gulzar Ahmed",
      craft: "Chiniot Wood Carving & Brass Inlay",
      city: "Chiniot",
      province: "Punjab",
      yearsExperience: 30,
      bio: "Master woodworker creating heirloom Sheesham boxes and panels adorned with fine geometric brass tarkashi."
    },
    {
      id: "a004",
      name: "Saima Bibi",
      craft: "Bahawalpuri Mirror & Gotay Work",
      city: "Bahawalpur",
      province: "Punjab",
      yearsExperience: 14,
      bio: "Leads a women's craft collective hand-stitching shisha mirror embroidery onto breathable handloom cotton."
    },
    {
      id: "a005",
      name: "Karimullah Khan",
      craft: "Swati Handloom Wool Weaving",
      city: "Islampur, Swat",
      province: "Khyber Pakhtunkhwa",
      yearsExperience: 22,
      bio: "Weaves pure mountain wool shawls on traditional pit looms with classic Swati geometric borders."
    },
    {
      id: "a006",
      name: "Zulfiqar Ali",
      craft: "Peshawari Hammered Copperware",
      city: "Peshawar",
      province: "Khyber Pakhtunkhwa",
      yearsExperience: 20,
      bio: "Hand-forges and engraves heavyweight copper trays and vessels in the historic Qissa Khwani craft tradition."
    }
  ];

  const PRODUCTS = [
    {
      id: "p001",
      title: "Multani Blue Pottery Floral Vase",
      category: "Pottery",
      artisanId: "a001",
      region: "Multan, Punjab",
      price: 3850,
      originalPrice: 4500,
      currency: "PKR",
      stock: 12,
      rating: 4.9,
      reviewCount: 34,
      featured: true,
      badge: "Best Seller",
      image: "images/products/p001-multani-vase.jpg",
      description: "Hand-thrown 10-inch glazed ceramic vase featuring classic Multani floral brushwork in cobalt blue and emerald."
    },
    {
      id: "p002",
      title: "Hand-Block Printed Ajrak Dupatta",
      category: "Textiles",
      artisanId: "a002",
      region: "Bhit Shah, Sindh",
      price: 4200,
      originalPrice: null,
      currency: "PKR",
      stock: 18,
      rating: 4.8,
      reviewCount: 27,
      featured: true,
      badge: "Heritage Craft",
      image: "images/products/p002-ajrak-dupatta.jpg",
      description: "Pure cotton dupatta block-printed on both sides using natural indigo and madder dyes in a 16-stage process."
    },
    {
      id: "p003",
      title: "Chiniot Carved Sheesham Jewelry Box",
      category: "Woodwork",
      artisanId: "a003",
      region: "Chiniot, Punjab",
      price: 6500,
      originalPrice: 7200,
      currency: "PKR",
      stock: 8,
      rating: 4.9,
      reviewCount: 19,
      featured: true,
      badge: "Heirloom",
      image: "images/products/p003-chiniot-box.jpg",
      description: "Solid seasoned Sheesham rosewood keepsake box with hand-chiseled floral motifs, brass inlay, and velvet lining."
    },
    {
      id: "p004",
      title: "Bahawalpuri Mirror-Work Cushion Covers (Pair)",
      category: "Embroidery",
      artisanId: "a004",
      region: "Bahawalpur, Punjab",
      price: 3200,
      originalPrice: null,
      currency: "PKR",
      stock: 15,
      rating: 4.7,
      reviewCount: 22,
      featured: false,
      badge: "Artisan Pick",
      image: "images/products/p004-mirror-cushions.jpg",
      description: "Set of two 16x16 inch handloom cotton cushion covers embellished with traditional shisha mirror embroidery."
    },
    {
      id: "p005",
      title: "Swati Pure Wool Embroidered Shawl",
      category: "Textiles",
      artisanId: "a005",
      region: "Swat, KP",
      price: 11500,
      originalPrice: 13000,
      currency: "PKR",
      stock: 6,
      rating: 5.0,
      reviewCount: 15,
      featured: true,
      badge: "Free Shipping",
      image: "images/products/p005-swati-shawl.jpg",
      description: "Warm pit-loom woven sheep wool shawl finished with fine hand-embroidered Swati borders in terracotta and gold."
    },
    {
      id: "p006",
      title: "Peshawari Hand-Hammered Copper Serving Tray",
      category: "Metalwork",
      artisanId: "a006",
      region: "Peshawar, KP",
      price: 8900,
      originalPrice: 9600,
      currency: "PKR",
      stock: 5,
      rating: 4.8,
      reviewCount: 11,
      featured: false,
      badge: "Limited Batch",
      image: "images/products/p006-copper-tray.jpg",
      description: "Heavy-gauge hand-hammered copper tray with tin-lined interior accents and delicate Mughal border engraving."
    }
  ];

  function getProductById(productId) {
    return PRODUCTS.find((product) => product.id === productId) || null;
  }

  function getArtisanById(artisanId) {
    return ARTISANS.find((artisan) => artisan.id === artisanId) || null;
  }

  function getProductsByArtisan(artisanId) {
    return PRODUCTS.filter((product) => product.artisanId === artisanId);
  }

  function getProductsByCategory(category) {
    if (!category || category === "All") {
      return PRODUCTS.slice();
    }
    return PRODUCTS.filter(
      (product) => product.category.toLowerCase() === String(category).toLowerCase()
    );
  }

  function getCategories() {
    return ["All", ...new Set(PRODUCTS.map((product) => product.category))];
  }

  const CraftoraData = {
    ARTISANS,
    PRODUCTS,
    getProductById,
    getArtisanById,
    getProductsByArtisan,
    getProductsByCategory,
    getCategories
  };

  root.CraftoraData = CraftoraData;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = CraftoraData;
  }
})(typeof window !== "undefined" ? window : globalThis);
