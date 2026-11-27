/* ==========================================================================
   Craftora - Member 2 Pages Script
   Powers:
     1) pages/search-results.html (data-page="search-results")
     2) pages/categories.html (data-page="categories")
   ========================================================================== */

(function (global) {
  "use strict";

  // Official 9 Craftora Categories matching js/data.js
  const OFFICIAL_CATEGORIES = [
    {
      id: "handwoven-textiles",
      name: "Handwoven Textiles",
      aliases: ["ajrak-textiles", "textiles", "handwoven-textiles", "ajrak"],
      description: "Hand-block printed Sindhi Ajrak dupattas, shawls, and natural-dyed cotton weaves from Matiari.",
      countLabel: "Matiari, Sindh",
      defaultImage: "images/product-p001.png"
    },
    {
      id: "pottery-ceramics",
      name: "Pottery & Ceramics",
      aliases: ["blue-pottery", "pottery", "ceramics", "pottery-ceramics"],
      description: "Kiln-fired Multani Kashi ceramic vases, bowls, and hand-painted glazed stoneware from Multan.",
      countLabel: "Multan, Punjab",
      defaultImage: "images/product-p002.png"
    },
    {
      id: "wooden-handicrafts",
      name: "Wooden Handicrafts",
      aliases: ["wood-carving", "woodcraft", "wood", "wooden-handicrafts"],
      description: "Seasoned Sheesham keepsake boxes, brass inlay work, and floral relief carvings from Chiniot.",
      countLabel: "Chiniot, Punjab",
      defaultImage: "images/product-p003.png"
    },
    {
      id: "embroidery-needlework",
      name: "Embroidery & Needlework",
      aliases: ["embroidery", "needlework", "embroidery-needlework"],
      description: "Intricate Sindhi needlework, geometric threadcraft, and mirror-work cushion covers crafted in Hala.",
      countLabel: "Hala, Sindh",
      defaultImage: "images/product-p004.png"
    },
    {
      id: "leather-crafts",
      name: "Leather Crafts",
      aliases: ["leather-crafts", "leather", "khussa"],
      description: "Hand-stitched traditional leather khussas and vegetable-tanned goods by Lahore master cobblers.",
      countLabel: "Lahore, Punjab",
      defaultImage: "images/product-p005.png"
    },
    {
      id: "traditional-home-decor",
      name: "Traditional Home Décor",
      aliases: ["truck-art", "home-decor", "traditional-home-decor", "decor"],
      description: "Hand-painted floral motifs on decorative trays, wall plates, and accents inspired by truck art.",
      countLabel: "Rawalpindi, Punjab",
      defaultImage: "images/product-p006.png"
    },
    {
      id: "handmade-jewellery",
      name: "Handmade Jewellery",
      aliases: ["jewellery", "jewelry", "handmade-jewellery"],
      description: "Artisanal filigree brass earrings, pendants, and traditional handcrafted statement pieces.",
      countLabel: "Chiniot & Lahore",
      defaultImage: "images/product-p007.png"
    },
    {
      id: "cultural-accessories",
      name: "Cultural Accessories",
      aliases: ["cultural-accessories", "accessories", "clutches"],
      description: "Hand-embroidered silk clutches, block-printed scarves, and heirloom regional utility pieces.",
      countLabel: "Hala & Matiari",
      defaultImage: "images/product-p008.png"
    },
    {
      id: "handmade-gifts",
      name: "Handmade Gifts",
      aliases: ["handmade-gifts", "gifts", "gifting"],
      description: "Curated artisan gift sets, miniature keepsakes, and heirloom tokens boxed with craft notes.",
      countLabel: "All Workshops",
      defaultImage: "images/product-p009.png"
    }
  ];

  // Fallback products for standalone preview of search-results.html when
  // shared js/data.js is not yet merged onto the active branch.
  const FALLBACK_PRODUCTS = [
    {
      id: "p001",
      name: "Ajrak Dupatta",
      category: "handwoven-textiles",
      categoryLabel: "Handwoven Textiles",
      categoryAliases: ["ajrak-textiles", "textiles", "handwoven-textiles"],
      price: 4500,
      artisanId: "a001",
      artisanName: "Zainab's Loom",
      origin: "Matiari, Sindh",
      rating: 4.9,
      reviewsCount: 44,
      badge: "Bestseller",
      image: "images/product-p001.png",
      alt: "Crimson and indigo block-printed Sindhi Ajrak Dupatta by Zainab's Loom",
      description: "Double-sided block-printed Ajrak dupatta crafted in Matiari using hand-carved wooden stamps, resist clay paste, and natural indigo and crimson dyes."
    },
    {
      id: "p002",
      name: "Multani Blue Pottery Vase",
      category: "pottery-ceramics",
      categoryLabel: "Pottery & Ceramics",
      categoryAliases: ["blue-pottery", "pottery", "ceramics"],
      price: 3200,
      artisanId: "a002",
      artisanName: "Kashi Studio",
      origin: "Multan, Punjab",
      rating: 4.9,
      reviewsCount: 38,
      badge: "Heritage Kiln",
      image: "images/product-p002.png",
      alt: "Hand-painted Multani Blue Pottery Vase with cobalt floral motifs by Kashi Studio",
      description: "Hand-thrown from Multan's signature quartz-rich clay and hand-painted with traditional Kashi floral brushwork before kiln glazing."
    },
    {
      id: "p003",
      name: "Chinioti Carved Wooden Box",
      category: "wooden-handicrafts",
      categoryLabel: "Wooden Handicrafts",
      categoryAliases: ["wood-carving", "woodcraft"],
      price: 5800,
      artisanId: "a003",
      artisanName: "Darakht Works",
      origin: "Chiniot, Punjab",
      rating: 4.8,
      reviewsCount: 29,
      badge: "Master Craft",
      image: "images/product-p003.png",
      alt: "Chinioti carved Sheesham wooden keepsake box with brass inlay by Darakht Works",
      description: "Seasoned Sheesham rosewood keepsake chest adorned with hand-chiselled floral relief carving and delicate Chiniot brass inlay."
    },
    {
      id: "p004",
      name: "Hala Embroidered Cushion Cover",
      category: "embroidery-needlework",
      categoryLabel: "Embroidery & Needlework",
      categoryAliases: ["embroidery", "needlework"],
      price: 2200,
      artisanId: "a004",
      artisanName: "Gulzar Needlecraft",
      origin: "Hala, Sindh",
      rating: 4.7,
      reviewsCount: 24,
      badge: "Hand-Stitched",
      image: "images/product-p004.png",
      alt: "Hala embroidered cotton cushion cover with mirror work by Gulzar Needlecraft",
      description: "Breathable handloom cotton cushion cover featuring intricate Sindhi geometric threadwork and hand-tacked shisha mirror accents."
    },
    {
      id: "p005",
      name: "Lahori Handmade Leather Khussa",
      category: "leather-crafts",
      categoryLabel: "Leather Crafts",
      categoryAliases: ["leather", "khussa"],
      price: 4200,
      artisanId: "a005",
      artisanName: "Qissa Leather House",
      origin: "Lahore, Punjab",
      rating: 4.8,
      reviewsCount: 51,
      badge: "Artisan Footwear",
      image: "images/product-p005.png",
      alt: "Traditional hand-stitched Lahori leather khussa by Qissa Leather House",
      description: "Supple vegetable-tanned leather khussas crafted by Lahore master cobblers and stitched with waxed cotton thread for lasting comfort."
    },
    {
      id: "p006",
      name: "Truck-Art Decorative Serving Tray",
      category: "traditional-home-decor",
      categoryLabel: "Traditional Home Décor",
      categoryAliases: ["truck-art", "home-decor"],
      price: 2900,
      artisanId: "a006",
      artisanName: "Rang Caravan",
      origin: "Rawalpindi, Punjab",
      rating: 4.9,
      reviewsCount: 31,
      badge: "Folk Art",
      image: "images/product-p006.png",
      alt: "Hand-painted Pakistani truck-art wooden serving tray by Rang Caravan",
      description: "Hand-painted seasoned wood tray celebrating Pakistani truck-art peacock motifs, vibrant floral borders, and glossy chamakpatti accents."
    },
    {
      id: "p007",
      name: "Filigree Brass Heritage Earrings",
      category: "handmade-jewellery",
      categoryLabel: "Handmade Jewellery",
      categoryAliases: ["jewellery", "jewelry"],
      price: 1850,
      artisanId: "a003",
      artisanName: "Darakht Works",
      origin: "Chiniot, Punjab",
      rating: 4.7,
      reviewsCount: 19,
      badge: "Small Batch",
      image: "images/product-p007.png",
      alt: "Handcrafted filigree brass earrings inspired by heritage jaali patterns",
      description: "Lightweight hand-pierced brass drop earrings inspired by Chinioti architectural jaali latticework with hypoallergenic ear wires."
    },
    {
      id: "p008",
      name: "Sindhi Needlework Silk Clutch",
      category: "cultural-accessories",
      categoryLabel: "Cultural Accessories",
      categoryAliases: ["accessories", "clutches"],
      price: 3400,
      artisanId: "a004",
      artisanName: "Gulzar Needlecraft",
      origin: "Hala, Sindh",
      rating: 4.8,
      reviewsCount: 22,
      badge: "Evening Craft",
      image: "images/product-p008.png",
      alt: "Hand-embroidered Sindhi needlework silk clutch by Gulzar Needlecraft",
      description: "Structured raw silk clutch adorned with traditional Sindhi border stitching, lined with soft cotton and a concealed magnetic clasp."
    },
    {
      id: "p009",
      name: "Hand-Painted Keepsake Box",
      category: "handmade-gifts",
      categoryLabel: "Handmade Gifts",
      categoryAliases: ["gifts", "gifting"],
      price: 1600,
      artisanId: "a006",
      artisanName: "Rang Caravan",
      origin: "Rawalpindi, Punjab",
      rating: 4.8,
      reviewsCount: 34,
      badge: "Gift Favourite",
      image: "images/product-p009.png",
      alt: "Hand-painted truck-art decorative keepsake gift box by Rang Caravan",
      description: "Charming wooden keepsake box painted with cheerful folk florals and bright chamakpatti trim, ideal for jewellery or gifting."
    },
    {
      id: "p010",
      name: "Matiari Indigo Table Runner",
      category: "handwoven-textiles",
      categoryLabel: "Handwoven Textiles",
      categoryAliases: ["ajrak-textiles", "textiles"],
      price: 5200,
      artisanId: "a001",
      artisanName: "Zainab's Loom",
      origin: "Matiari, Sindh",
      rating: 4.9,
      reviewsCount: 26,
      badge: "Pure Indigo",
      image: "images/product-p010.png",
      alt: "Handloom indigo block-printed cotton table runner by Zainab's Loom",
      description: "Stately dining runner block-printed in Matiari with heritage geometric borders, sun-dried on riverbanks and finished by hand."
    },
    {
      id: "p011",
      name: "Multani Turquoise Serving Bowl",
      category: "pottery-ceramics",
      categoryLabel: "Pottery & Ceramics",
      categoryAliases: ["blue-pottery", "pottery", "ceramics"],
      price: 3600,
      artisanId: "a002",
      artisanName: "Kashi Studio",
      origin: "Multan, Punjab",
      rating: 4.8,
      reviewsCount: 18,
      badge: "Kiln Fired",
      image: "images/product-p011.png",
      alt: "Hand-glazed Multani turquoise ceramic serving bowl by Kashi Studio",
      description: "Generous hand-thrown stoneware bowl featuring concentric turquoise and cobalt glaze strokes fired for everyday dining."
    },
    {
      id: "p012",
      name: "Hand-Tooled Leather Folio",
      category: "leather-crafts",
      categoryLabel: "Leather Crafts",
      categoryAliases: ["leather"],
      price: 4800,
      artisanId: "a005",
      artisanName: "Qissa Leather House",
      origin: "Lahore, Punjab",
      rating: 4.9,
      reviewsCount: 27,
      badge: "Artisan Leather",
      image: "images/product-p012.png",
      alt: "Vegetable-tanned hand-tooled leather document folio by Qissa Leather House",
      description: "Executive document folio hand-cut, burnished, and saddle-stitched with waxed linen thread in Lahore's Walled City."
    }
  ];

  const DEFAULT_SUGGESTIONS = [
    "Ajrak",
    "Blue Pottery",
    "Chiniot Wood",
    "Khussa",
    "Embroidery",
    "Truck-Art",
    "Zainab's Loom",
    "Kashi Studio"
  ];

  const STORAGE_KEYS = {
    cart: "craftora_cart",
    wishlist: "craftora_wishlist"
  };

  /* ------------------------------------------------------------------------
     Shared Utilities & Catalogue Access
     ------------------------------------------------------------------------ */
  function escapeHTML(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildFallbackImageURI(label, subtitle) {
    const clean = escapeHTML(label || "Craftora Handmade");
    const sub = escapeHTML(subtitle || "Craftora Pakistan");
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
      '<rect width="600" height="420" fill="#EEE9DF"/>' +
      '<circle cx="300" cy="175" r="68" fill="#24483F" opacity="0.14"/>' +
      '<path d="M254 195 L300 130 L346 195 Z" fill="#BC6848" opacity="0.7"/>' +
      '<text x="300" y="280" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#24483F">' +
      clean +
      "</text>" +
      '<text x="300" y="310" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6C7068">' +
      sub +
      "</text>" +
      "</svg>";
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function resolveImagePath(path) {
    if (!path) return "";
    const trimmed = String(path).trim();
    if (global.CraftoraData && typeof global.CraftoraData.resolveAssetPath === "function") {
      return global.CraftoraData.resolveAssetPath(trimmed);
    }
    if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith("../") || trimmed.startsWith("data:")) {
      return trimmed;
    }
    return "../" + trimmed;
  }

  function formatPKR(amount) {
    if (global.CraftoraData && typeof global.CraftoraData.formatPKR === "function") {
      return global.CraftoraData.formatPKR(amount);
    }
    if (global.CraftoraUtils && typeof global.CraftoraUtils.formatPKR === "function") {
      return global.CraftoraUtils.formatPKR(amount);
    }
    return "PKR " + Number(amount || 0).toLocaleString("en-PK");
  }

  function getCatalogSource(options) {
    const allowFallbackProducts = !options || options.allowFallbackProducts !== false;
    const shared = global.CraftoraData;

    const rawCategories =
      shared && Array.isArray(shared.categories) && shared.categories.length
        ? shared.categories
        : OFFICIAL_CATEGORIES;

    const hasSharedProducts = shared && Array.isArray(shared.products);
    const rawProducts = hasSharedProducts
      ? shared.products
      : allowFallbackProducts
        ? FALLBACK_PRODUCTS
        : [];

    const products = rawProducts.map((item) => {
      const artisanObj =
        shared && typeof shared.getArtisanById === "function"
          ? shared.getArtisanById(item.artisanId)
          : null;

      const resolvedName = item.name || item.title || "Handcrafted Item";
      const resolvedArtisan =
        item.artisanName || (artisanObj && artisanObj.name) || "Craftora Artisan";
      const resolvedCatId = (item.category || "").toLowerCase().trim();
      const matchedCat = rawCategories.find(
        (cat) =>
          cat.id === resolvedCatId ||
          cat.name.toLowerCase() === resolvedCatId ||
          (Array.isArray(cat.aliases) && cat.aliases.includes(resolvedCatId))
      );

      return {
        id: item.id,
        name: resolvedName,
        category: matchedCat ? matchedCat.id : resolvedCatId,
        categoryLabel: item.categoryLabel || (matchedCat ? matchedCat.name : item.category || "Handicraft"),
        categoryAliases: Array.isArray(item.categoryAliases) ? item.categoryAliases : [],
        price: Number(item.price) || 0,
        artisanId: item.artisanId || "",
        artisanName: resolvedArtisan,
        origin: item.origin || item.region || (artisanObj && artisanObj.city) || "Pakistan",
        rating: Number(item.rating) || 4.8,
        reviewsCount: Number(item.reviewsCount || item.reviewCount) || 0,
        badge: item.badge || "Handmade",
        image: item.image || "",
        alt: item.alt || resolvedName,
        description: item.description || ""
      };
    });

    return { categories: rawCategories, products: products };
  }

  function productMatchesCategory(product, categoryObj) {
    if (!product || !categoryObj) return false;
    const catId = categoryObj.id.toLowerCase();
    const catName = categoryObj.name.toLowerCase();
    const aliases = Array.isArray(categoryObj.aliases) ? categoryObj.aliases : [];

    return (
      product.category === catId ||
      product.categoryLabel.toLowerCase() === catName ||
      product.categoryAliases.includes(catId) ||
      aliases.includes(product.category)
    );
  }

  /* ------------------------------------------------------------------------
     Shared Cart & Wishlist Helpers
     ------------------------------------------------------------------------ */
  function readLocalArray(key) {
    try {
      const parsed = JSON.parse(global.localStorage.getItem(key) || "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function writeLocalArray(key, list) {
    try {
      global.localStorage.setItem(key, JSON.stringify(list));
    } catch (err) {
      // Ignore storage failures in restricted contexts
    }
  }

  function getWishlistIds() {
    if (global.CraftoraUI && typeof global.CraftoraUI.getWishlist === "function") {
      return global.CraftoraUI.getWishlist();
    }
    if (global.CraftoraStorage && typeof global.CraftoraStorage.getWishlist === "function") {
      return global.CraftoraStorage.getWishlist();
    }
    return readLocalArray(STORAGE_KEYS.wishlist);
  }

  function isWishlisted(productId) {
    if (global.CraftoraUI && typeof global.CraftoraUI.isWishlisted === "function") {
      return global.CraftoraUI.isWishlisted(productId);
    }
    if (global.CraftoraStorage && typeof global.CraftoraStorage.isInWishlist === "function") {
      return global.CraftoraStorage.isInWishlist(productId);
    }
    return getWishlistIds().includes(productId);
  }

  function getCartItemCount() {
    if (global.CraftoraUI && typeof global.CraftoraUI.getCartCount === "function") {
      return global.CraftoraUI.getCartCount();
    }
    if (global.CraftoraStorage && typeof global.CraftoraStorage.getCartCount === "function") {
      return global.CraftoraStorage.getCartCount();
    }
    return readLocalArray(STORAGE_KEYS.cart).reduce(
      (sum, item) => sum + (Number(item.qty || item.quantity) || 1),
      0
    );
  }

  function updateCountersUI() {
    if (global.CraftoraUI && typeof global.CraftoraUI.updateHeaderCounters === "function") {
      global.CraftoraUI.updateHeaderCounters();
    }
    const cartCount = getCartItemCount();
    const wishCount = getWishlistIds().length;

    document.querySelectorAll(".js-cart-count, #cart-badge").forEach((el) => {
      el.textContent = String(cartCount);
    });
    document.querySelectorAll(".js-wishlist-count, #wishlist-badge").forEach((el) => {
      el.textContent = String(wishCount);
    });
  }

  function showNotification(message) {
    if (global.CraftoraUI && typeof global.CraftoraUI.showToast === "function") {
      global.CraftoraUI.showToast(message, "success");
      return;
    }

    let wrap = document.getElementById("craftora-m2-toast-wrap");
    if (!wrap) {
      wrap = document.createElement("div");
      wrap.id = "craftora-m2-toast-wrap";
      wrap.className = "craftora-m2-toast-wrap";
      wrap.setAttribute("aria-live", "polite");
      document.body.appendChild(wrap);
    }

    const toast = document.createElement("div");
    toast.className = "craftora-m2-toast";
    toast.textContent = message;
    wrap.appendChild(toast);

    global.setTimeout(() => {
      toast.remove();
    }, 2800);
  }

  function handleAddToCart(productId) {
    const product = getCatalogSource({ allowFallbackProducts: true }).products.find(
      (p) => p.id === productId
    );
    if (!product) return;

    if (global.CraftoraUI && typeof global.CraftoraUI.addToCart === "function") {
      global.CraftoraUI.addToCart(productId, 1);
      updateCountersUI();
      return;
    }

    if (global.CraftoraStorage && typeof global.CraftoraStorage.addToCart === "function") {
      global.CraftoraStorage.addToCart(productId, 1);
      updateCountersUI();
      showNotification(product.name + " added to your Bag.");
      return;
    }

    const cart = readLocalArray(STORAGE_KEYS.cart);
    const existing = cart.find((item) => item.id === productId || item.productId === productId);
    if (existing) {
      existing.qty = (Number(existing.qty || existing.quantity) || 1) + 1;
    } else {
      cart.push({ id: productId, qty: 1 });
    }
    writeLocalArray(STORAGE_KEYS.cart, cart);
    updateCountersUI();
    showNotification(product.name + " added to your Bag.");
  }

  function handleToggleWishlist(productId) {
    const product = getCatalogSource({ allowFallbackProducts: true }).products.find(
      (p) => p.id === productId
    );
    if (!product) return;

    if (global.CraftoraUI && typeof global.CraftoraUI.toggleWishlist === "function") {
      global.CraftoraUI.toggleWishlist(productId);
      updateCountersUI();
      syncWishlistButtonStates();
      return;
    }

    if (global.CraftoraStorage && typeof global.CraftoraStorage.toggleWishlist === "function") {
      const added = global.CraftoraStorage.toggleWishlist(productId);
      updateCountersUI();
      syncWishlistButtonStates();
      showNotification(
        added ? product.name + " saved to Wishlist." : product.name + " removed from Wishlist."
      );
      return;
    }

    const list = readLocalArray(STORAGE_KEYS.wishlist);
    const idx = list.indexOf(productId);
    if (idx === -1) {
      list.push(productId);
      showNotification(product.name + " saved to Wishlist.");
    } else {
      list.splice(idx, 1);
      showNotification(product.name + " removed from Wishlist.");
    }
    writeLocalArray(STORAGE_KEYS.wishlist, list);
    updateCountersUI();
    syncWishlistButtonStates();
  }

  function syncWishlistButtonStates() {
    document.querySelectorAll("[data-wishlist-id]").forEach((btn) => {
      const id = btn.getAttribute("data-wishlist-id");
      const active = isWishlisted(id);
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
      btn.setAttribute("aria-label", active ? "Remove from wishlist" : "Save to wishlist");
    });
  }

  /* ------------------------------------------------------------------------
     Page 1: Search Results Controller (pages/search-results.html)
     ------------------------------------------------------------------------ */
  const searchState = {
    query: "",
    category: "all",
    minPrice: null,
    maxPrice: null,
    sortBy: "relevance"
  };

  let searchDom = {};

  function readSearchParamsFromUrl() {
    const params = new URLSearchParams(global.location.search);
    const q = params.get("q");
    const cat = params.get("category");
    const min = params.get("min");
    const max = params.get("max");
    const sort = params.get("sort");

    searchState.query = q ? q.trim() : "";
    searchState.category = cat ? cat.trim().toLowerCase() : "all";
    searchState.minPrice = min !== null && min !== "" && !Number.isNaN(Number(min)) ? Number(min) : null;
    searchState.maxPrice = max !== null && max !== "" && !Number.isNaN(Number(max)) ? Number(max) : null;
    searchState.sortBy = sort || "relevance";
  }

  function syncSearchUrlWithState() {
    try {
      const params = new URLSearchParams();
      if (searchState.query) params.set("q", searchState.query);
      if (searchState.category && searchState.category !== "all") params.set("category", searchState.category);
      if (searchState.minPrice !== null) params.set("min", String(searchState.minPrice));
      if (searchState.maxPrice !== null) params.set("max", String(searchState.maxPrice));
      if (searchState.sortBy && searchState.sortBy !== "relevance") params.set("sort", searchState.sortBy);

      const queryString = params.toString();
      const nextUrl = global.location.pathname + (queryString ? "?" + queryString : "");
      global.history.replaceState(null, "", nextUrl);
    } catch (err) {
      // Ignore history errors on restricted origins
    }
  }

  function computeRelevanceScore(product, terms) {
    if (!terms.length) return 1;
    const name = product.name.toLowerCase();
    const desc = product.description.toLowerCase();
    const cat = (product.categoryLabel + " " + product.category + " " + product.categoryAliases.join(" ")).toLowerCase();
    const artisan = (product.artisanName + " " + product.origin).toLowerCase();

    let totalScore = 0;
    for (let i = 0; i < terms.length; i += 1) {
      const term = terms[i];
      let termScore = 0;
      if (name.includes(term)) termScore += name.startsWith(term) ? 10 : 7;
      if (cat.includes(term)) termScore += 5;
      if (artisan.includes(term)) termScore += 5;
      if (desc.includes(term)) termScore += 3;

      if (termScore === 0) return 0;
      totalScore += termScore;
    }
    return totalScore;
  }

  function filterAndSortSearchProducts() {
    const { products } = getCatalogSource({ allowFallbackProducts: true });
    const queryLower = searchState.query.trim().toLowerCase();
    const terms = queryLower ? queryLower.split(/\s+/).filter(Boolean) : [];

    let minVal = searchState.minPrice;
    let maxVal = searchState.maxPrice;
    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      const swap = minVal;
      minVal = maxVal;
      maxVal = swap;
    }

    const matched = [];
    products.forEach((product) => {
      if (searchState.category && searchState.category !== "all") {
        const matchesCat =
          product.category === searchState.category ||
          product.categoryLabel.toLowerCase() === searchState.category ||
          product.categoryAliases.includes(searchState.category);
        if (!matchesCat) return;
      }

      if (minVal !== null && product.price < minVal) return;
      if (maxVal !== null && product.price > maxVal) return;

      const score = computeRelevanceScore(product, terms);
      if (terms.length > 0 && score === 0) return;

      matched.push({ product: product, score: score });
    });

    matched.sort((a, b) => {
      switch (searchState.sortBy) {
        case "price-asc":
          return a.product.price - b.product.price;
        case "price-desc":
          return b.product.price - a.product.price;
        case "rating-desc":
          return b.product.rating - a.product.rating || b.product.reviewsCount - a.product.reviewsCount;
        case "name-asc":
          return a.product.name.localeCompare(b.product.name);
        case "relevance":
        default:
          return b.score - a.score || b.product.rating - a.product.rating;
      }
    });

    return matched.map((entry) => entry.product);
  }

  function populateSearchCategoryControls() {
    const { categories, products } = getCatalogSource({ allowFallbackProducts: true });

    if (searchDom.categorySelect) {
      searchDom.categorySelect.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.name;
        searchDom.categorySelect.appendChild(opt);
      });
    }

    if (searchDom.suggestedCategories) {
      searchDom.suggestedCategories.innerHTML = "";
      const allBtn = document.createElement("button");
      allBtn.type = "button";
      allBtn.className = "category-pill-btn";
      allBtn.setAttribute("data-category-id", "all");
      allBtn.innerHTML = `<span>All Crafts</span><span class="category-pill-count">(${products.length})</span>`;
      searchDom.suggestedCategories.appendChild(allBtn);

      categories.forEach((cat) => {
        const count = products.filter((p) => productMatchesCategory(p, cat)).length;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "category-pill-btn";
        btn.setAttribute("data-category-id", cat.id);
        btn.innerHTML = `<span>${escapeHTML(cat.name)}</span><span class="category-pill-count">(${count})</span>`;
        searchDom.suggestedCategories.appendChild(btn);
      });
    }
  }

  function renderRelatedSuggestions() {
    const queryLower = searchState.query.toLowerCase();
    const contextual = [];

    if (queryLower.includes("ajrak") || queryLower.includes("textile") || queryLower.includes("zainab")) {
      contextual.push("Indigo", "Table Runner", "Embroidery", "Matiari");
    } else if (queryLower.includes("pottery") || queryLower.includes("multan") || queryLower.includes("kashi")) {
      contextual.push("Vase", "Turquoise", "Bowl", "Kashi Studio");
    } else if (queryLower.includes("wood") || queryLower.includes("chiniot")) {
      contextual.push("Keepsake Box", "Brass", "Darakht Works", "Truck-Art");
    }

    const suggestions = Array.from(new Set(contextual.concat(DEFAULT_SUGGESTIONS))).slice(0, 8);

    if (searchDom.relatedSuggestions) {
      searchDom.relatedSuggestions.innerHTML = suggestions
        .map((term) => {
          const active = searchState.query.toLowerCase() === term.toLowerCase();
          return `<button type="button" class="suggestion-chip${active ? " is-active" : ""}" data-suggest-query="${escapeHTML(term)}">${escapeHTML(term)}</button>`;
        })
        .join("");
    }

    if (searchDom.emptySuggestedQueries) {
      searchDom.emptySuggestedQueries.innerHTML = DEFAULT_SUGGESTIONS.slice(0, 6)
        .map(
          (term) =>
            `<button type="button" class="empty-suggestion-btn" data-suggest-query="${escapeHTML(term)}">${escapeHTML(term)}</button>`
        )
        .join("");
    }
  }

  function renderActiveStatusAndChips(resultsCount) {
    const { categories } = getCatalogSource({ allowFallbackProducts: true });
    const matchedCat = categories.find((c) => c.id === searchState.category);

    if (searchDom.activeQueryDisplay) {
      if (searchState.query) {
        searchDom.activeQueryDisplay.innerHTML =
          'Search results for <span class="active-query-highlight">&ldquo;' +
          escapeHTML(searchState.query) +
          "&rdquo;</span>";
      } else if (matchedCat) {
        searchDom.activeQueryDisplay.innerHTML =
          'Category: <span class="active-query-highlight">' +
          escapeHTML(matchedCat.name) +
          "</span>";
      } else {
        searchDom.activeQueryDisplay.textContent = "Browsing all handcrafted pieces";
      }
    }

    if (searchDom.resultsCount) {
      searchDom.resultsCount.textContent =
        "Showing " + resultsCount + (resultsCount === 1 ? " handcrafted piece" : " handcrafted pieces");
    }

    if (searchDom.activeFilterChips) {
      const chips = [];
      if (searchState.query) {
        chips.push({ key: "query", label: 'Search: "' + searchState.query + '"' });
      }
      if (searchState.category !== "all") {
        chips.push({ key: "category", label: "Category: " + (matchedCat ? matchedCat.name : searchState.category) });
      }
      if (searchState.minPrice !== null) {
        chips.push({ key: "min", label: "Min: " + formatPKR(searchState.minPrice) });
      }
      if (searchState.maxPrice !== null) {
        chips.push({ key: "max", label: "Max: " + formatPKR(searchState.maxPrice) });
      }

      searchDom.activeFilterChips.innerHTML = chips
        .map(
          (chip) =>
            `<span class="active-chip">${escapeHTML(chip.label)} <button type="button" data-clear-chip="${escapeHTML(chip.key)}" aria-label="Remove ${escapeHTML(chip.label)}">&times;</button></span>`
        )
        .join("");
    }
  }

  function buildSearchCardElement(product) {
    if (global.CraftoraUI && typeof global.CraftoraUI.renderProductCard === "function") {
      const cardEl = global.CraftoraUI.renderProductCard(product);
      const fallbackURI = buildFallbackImageURI(product.name);
      const img = cardEl.querySelector("img");
      if (img) {
        img.addEventListener("error", function onImgErr() {
          img.removeEventListener("error", onImgErr);
          img.src = fallbackURI;
        });
      }
      return cardEl;
    }

    const detailHref = "product-details.html?id=" + encodeURIComponent(product.id);
    const wishActive = isWishlisted(product.id);
    const fallbackURI = buildFallbackImageURI(product.name);
    const imgSrc = resolveImagePath(product.image) || fallbackURI;

    const card = document.createElement("article");
    card.className = "product-card";
    card.setAttribute("data-product-id", product.id);
    card.innerHTML = `
      <div class="product-media">
        <a href="${detailHref}">
          <img src="${escapeHTML(imgSrc)}" alt="${escapeHTML(product.alt)}" loading="lazy">
        </a>
        <span class="product-badge">${escapeHTML(product.badge)}</span>
        <button
          type="button"
          class="wishlist-btn ${wishActive ? "is-active" : ""}"
          data-wishlist-id="${escapeHTML(product.id)}"
          aria-pressed="${wishActive}"
          aria-label="${wishActive ? "Remove from wishlist" : "Save to wishlist"}"
          title="Save to Wishlist"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </button>
      </div>
      <div class="product-body">
        <span class="product-category">${escapeHTML(product.categoryLabel)}</span>
        <h3 class="product-title">
          <a href="${detailHref}">${escapeHTML(product.name)}</a>
        </h3>
        <p class="product-artisan">By ${escapeHTML(product.artisanName)} &middot; ${escapeHTML(product.origin)}</p>
        <p class="product-desc-snippet">${escapeHTML(product.description)}</p>
        <div class="product-price-row">
          <span class="product-price">${escapeHTML(formatPKR(product.price))}</span>
          <span class="product-rating" aria-label="Rated ${product.rating.toFixed(1)} out of 5">&#9733; ${product.rating.toFixed(1)} (${product.reviewsCount})</span>
        </div>
        <div class="product-actions">
          <button type="button" class="btn btn-primary btn-sm js-add-to-cart" data-product-id="${escapeHTML(product.id)}">
            Add to Cart
          </button>
          <a href="${detailHref}" class="btn btn-outline btn-sm">Details</a>
        </div>
      </div>
    `;

    const imgEl = card.querySelector("img");
    if (imgEl) {
      imgEl.addEventListener("error", function handleErr() {
        imgEl.removeEventListener("error", handleErr);
        imgEl.src = fallbackURI;
      });
    }

    return card;
  }

  function syncSearchControlsFromState() {
    if (searchDom.searchInput) searchDom.searchInput.value = searchState.query;
    if (searchDom.categorySelect) searchDom.categorySelect.value = searchState.category;
    if (searchDom.minPriceInput) searchDom.minPriceInput.value = searchState.minPrice !== null ? String(searchState.minPrice) : "";
    if (searchDom.maxPriceInput) searchDom.maxPriceInput.value = searchState.maxPrice !== null ? String(searchState.maxPrice) : "";
    if (searchDom.sortSelect) searchDom.sortSelect.value = searchState.sortBy;

    if (searchDom.suggestedCategories) {
      searchDom.suggestedCategories.querySelectorAll("[data-category-id]").forEach((btn) => {
        btn.classList.toggle("is-active", btn.getAttribute("data-category-id") === searchState.category);
      });
    }
  }

  function renderSearchResults() {
    const results = filterAndSortSearchProducts();
    syncSearchControlsFromState();
    renderRelatedSuggestions();
    renderActiveStatusAndChips(results.length);
    syncSearchUrlWithState();

    if (!searchDom.resultsGrid || !searchDom.emptyState) return;

    searchDom.resultsGrid.innerHTML = "";

    if (results.length === 0) {
      searchDom.resultsGrid.hidden = true;
      searchDom.emptyState.hidden = false;
      if (searchDom.emptyMessage) {
        searchDom.emptyMessage.textContent = searchState.query
          ? 'We could not find handcrafted pieces matching "' + searchState.query + '" with your current filters.'
          : "No handcrafted pieces match your current category and PKR price range.";
      }
      return;
    }

    searchDom.resultsGrid.hidden = false;
    searchDom.emptyState.hidden = true;

    const frag = document.createDocumentFragment();
    results.forEach((product) => {
      frag.appendChild(buildSearchCardElement(product));
    });
    searchDom.resultsGrid.appendChild(frag);
    syncWishlistButtonStates();
  }

  function parseOptionalPrice(inputEl) {
    if (!inputEl) return null;
    const raw = inputEl.value.trim();
    if (!raw) return null;
    const num = Number(raw);
    return Number.isNaN(num) || num < 0 ? null : num;
  }

  function bindSearchEvents() {
    if (searchDom.searchForm) {
      searchDom.searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        searchState.query = searchDom.searchInput ? searchDom.searchInput.value.trim() : "";
        renderSearchResults();
      });
    }

    if (searchDom.searchInput) {
      searchDom.searchInput.addEventListener("input", () => {
        searchState.query = searchDom.searchInput.value.trim();
        renderSearchResults();
      });
    }

    if (searchDom.clearSearchBtn) {
      searchDom.clearSearchBtn.addEventListener("click", () => {
        searchState.query = "";
        renderSearchResults();
        if (searchDom.searchInput) searchDom.searchInput.focus();
      });
    }

    const resetAll = () => {
      searchState.query = "";
      searchState.category = "all";
      searchState.minPrice = null;
      searchState.maxPrice = null;
      searchState.sortBy = "relevance";
      renderSearchResults();
    };

    if (searchDom.resetFiltersBtn) {
      searchDom.resetFiltersBtn.addEventListener("click", resetAll);
    }

    if (searchDom.emptyClearBtn) {
      searchDom.emptyClearBtn.addEventListener("click", resetAll);
    }

    if (searchDom.categorySelect) {
      searchDom.categorySelect.addEventListener("change", () => {
        searchState.category = searchDom.categorySelect.value || "all";
        renderSearchResults();
      });
    }

    if (searchDom.minPriceInput) {
      searchDom.minPriceInput.addEventListener("input", () => {
        searchState.minPrice = parseOptionalPrice(searchDom.minPriceInput);
        renderSearchResults();
      });
    }

    if (searchDom.maxPriceInput) {
      searchDom.maxPriceInput.addEventListener("input", () => {
        searchState.maxPrice = parseOptionalPrice(searchDom.maxPriceInput);
        renderSearchResults();
      });
    }

    if (searchDom.sortSelect) {
      searchDom.sortSelect.addEventListener("change", () => {
        searchState.sortBy = searchDom.sortSelect.value || "relevance";
        renderSearchResults();
      });
    }

    document.addEventListener("click", (event) => {
      const suggestBtn = event.target.closest("[data-suggest-query]");
      if (suggestBtn) {
        searchState.query = suggestBtn.getAttribute("data-suggest-query") || "";
        renderSearchResults();
        return;
      }

      const catBtn = event.target.closest("[data-category-id]");
      if (catBtn) {
        searchState.category = catBtn.getAttribute("data-category-id") || "all";
        renderSearchResults();
        return;
      }

      const chipBtn = event.target.closest("[data-clear-chip]");
      if (chipBtn) {
        const key = chipBtn.getAttribute("data-clear-chip");
        if (key === "query") searchState.query = "";
        if (key === "category") searchState.category = "all";
        if (key === "min") searchState.minPrice = null;
        if (key === "max") searchState.maxPrice = null;
        renderSearchResults();
        return;
      }

      if (!global.CraftoraUI) {
        const addBtn = event.target.closest(".js-add-to-cart");
        if (addBtn) {
          handleAddToCart(addBtn.getAttribute("data-product-id"));
          return;
        }

        const wishBtn = event.target.closest("[data-wishlist-id]");
        if (wishBtn) {
          handleToggleWishlist(wishBtn.getAttribute("data-wishlist-id"));
        }
      }
    });
  }

  function initSearchResultsPage() {
    searchDom = {
      searchForm: document.getElementById("search-page-form"),
      searchInput: document.getElementById("search-query-input"),
      clearSearchBtn: document.getElementById("clear-search-btn"),
      relatedSuggestions: document.getElementById("related-suggestions"),
      suggestedCategories: document.getElementById("suggested-categories"),
      categorySelect: document.getElementById("filter-category"),
      minPriceInput: document.getElementById("filter-min-price"),
      maxPriceInput: document.getElementById("filter-max-price"),
      sortSelect: document.getElementById("sort-results"),
      resetFiltersBtn: document.getElementById("reset-filters-btn"),
      activeQueryDisplay: document.getElementById("active-query-display"),
      resultsCount: document.getElementById("results-count"),
      activeFilterChips: document.getElementById("active-filter-chips"),
      resultsGrid: document.getElementById("search-results-grid"),
      emptyState: document.getElementById("search-empty-state"),
      emptyMessage: document.getElementById("empty-results-message"),
      emptyClearBtn: document.getElementById("empty-clear-btn"),
      emptySuggestedQueries: document.getElementById("empty-suggested-queries")
    };

    populateSearchCategoryControls();
    readSearchParamsFromUrl();
    bindSearchEvents();
    renderSearchResults();
  }

  /* ------------------------------------------------------------------------
     Page 2: Categories Controller (pages/categories.html)
     ------------------------------------------------------------------------ */
  function formatProductCountLabel(count) {
    return count === 1 ? "1 product" : count + " products";
  }

  function resolveCategoryImage(categoryObj, matchingProducts) {
    const firstWithImage = matchingProducts.find((p) => p.image && String(p.image).trim() !== "");
    if (firstWithImage) {
      return resolveImagePath(firstWithImage.image);
    }

    const officialFallback = OFFICIAL_CATEGORIES.find((c) => c.id === categoryObj.id);
    if (categoryObj.image) {
      return resolveImagePath(categoryObj.image);
    }
    if (officialFallback && officialFallback.defaultImage) {
      return resolveImagePath(officialFallback.defaultImage);
    }
    return buildFallbackImageURI(categoryObj.name, categoryObj.countLabel || "Craftora Heritage");
  }

  function initCategoriesPage() {
    const gridEl = document.getElementById("categories-grid");
    const popularEl = document.getElementById("popular-categories-list");
    const totalCatsEl = document.getElementById("categories-total-count");
    const totalProductsEl = document.getElementById("categories-products-total");

    if (!gridEl) return;

    // Never invent fake counts: read strictly from CraftoraData.products (0 if none exist)
    const { categories, products } = getCatalogSource({ allowFallbackProducts: false });

    const enriched = categories.map((cat) => {
      const matching = products.filter((p) => productMatchesCategory(p, cat));
      return {
        category: cat,
        count: matching.length,
        matchingProducts: matching,
        href: "marketplace.html?category=" + encodeURIComponent(cat.id)
      };
    });

    if (totalCatsEl) {
      totalCatsEl.textContent = String(enriched.length);
    }
    if (totalProductsEl) {
      totalProductsEl.textContent = String(products.length);
    }

    gridEl.innerHTML = "";
    const gridFrag = document.createDocumentFragment();

    enriched.forEach((entry) => {
      const cat = entry.category;
      const countText = formatProductCountLabel(entry.count);
      const fallbackURI = buildFallbackImageURI(cat.name, cat.countLabel || "Pakistani Handicrafts");
      const imgSrc = resolveCategoryImage(cat, entry.matchingProducts) || fallbackURI;

      const cardLink = document.createElement("a");
      cardLink.href = entry.href;
      cardLink.className = "category-card";
      cardLink.setAttribute("data-category-id", cat.id);
      cardLink.setAttribute("aria-label", cat.name + " (" + countText + ") — Open in Marketplace");
      cardLink.innerHTML = `
        <div class="category-card-media">
          <img src="${escapeHTML(imgSrc)}" alt="${escapeHTML(cat.name)} Pakistani handicraft collection" loading="lazy">
          <span class="category-count-pill">${escapeHTML(countText)}</span>
          <span class="category-region-pill">${escapeHTML(cat.countLabel || "Pakistan")}</span>
        </div>
        <div class="category-card-body">
          <h3 class="category-card-title">${escapeHTML(cat.name)}</h3>
          <p class="category-card-desc">${escapeHTML(cat.description || "")}</p>
          <div class="category-card-footer">
            <span>Browse ${escapeHTML(cat.name)}</span>
            <span aria-hidden="true">&rarr;</span>
          </div>
        </div>
      `;

      const imgEl = cardLink.querySelector("img");
      if (imgEl) {
        imgEl.addEventListener("error", function handleImgError() {
          imgEl.removeEventListener("error", handleImgError);
          imgEl.src = fallbackURI;
        });
      }

      gridFrag.appendChild(cardLink);
    });

    gridEl.appendChild(gridFrag);

    if (popularEl) {
      const sortedPopular = enriched
        .slice()
        .sort((a, b) => b.count - a.count)
        .slice(0, 4);

      popularEl.innerHTML = sortedPopular
        .map(
          (entry) => `
            <a href="${escapeHTML(entry.href)}" class="popular-cat-chip">
              <span class="popular-cat-name">${escapeHTML(entry.category.name)}</span>
              <span class="popular-cat-meta">${escapeHTML(formatProductCountLabel(entry.count))} &middot; ${escapeHTML(entry.category.countLabel || "Pakistan")}</span>
            </a>
          `
        )
        .join("");
    }
  }

  /* ------------------------------------------------------------------------
     Bootstrap Based on body[data-page]
     ------------------------------------------------------------------------ */
  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body ? document.body.getAttribute("data-page") : "";
    if (!page) return;

    updateCountersUI();

    if (page === "search-results") {
      initSearchResultsPage();
    } else if (page === "categories") {
      initCategoriesPage();
    }
  });
})(window);
