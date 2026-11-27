/* ==========================================================================
   Craftora - Member 2 Pages Script (pages/search-results.html)
   Powers URL-driven search (?q=...), category & PKR price filters, sorting,
   related search suggestions, suggested categories, empty state, and
   shared Cart / Wishlist integration.
   ========================================================================== */

(function (global) {
  "use strict";

  // Fallback catalogue matching Craftora's shared js/data.js schema when
  // running standalone before shared js/data.js is merged into this branch.
  const FALLBACK_CATEGORIES = [
    { id: "handwoven-textiles", name: "Handwoven Textiles", aliases: ["ajrak-textiles", "textiles", "ajrak"] },
    { id: "pottery-ceramics", name: "Pottery & Ceramics", aliases: ["blue-pottery", "pottery", "ceramics"] },
    { id: "wooden-handicrafts", name: "Wooden Handicrafts", aliases: ["wood-carving", "woodcraft", "wood"] },
    { id: "embroidery-needlework", name: "Embroidery & Needlework", aliases: ["embroidery", "needlework"] },
    { id: "leather-crafts", name: "Leather Crafts", aliases: ["leather", "khussa"] },
    { id: "traditional-home-decor", name: "Traditional Home Décor", aliases: ["truck-art", "home-decor", "decor"] },
    { id: "handmade-jewellery", name: "Handmade Jewellery", aliases: ["jewellery", "jewelry"] },
    { id: "cultural-accessories", name: "Cultural Accessories", aliases: ["accessories", "clutches"] },
    { id: "handmade-gifts", name: "Handmade Gifts", aliases: ["gifts", "gifting"] }
  ];

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

  const state = {
    query: "",
    category: "all",
    minPrice: null,
    maxPrice: null,
    sortBy: "relevance"
  };

  let dom = {};

  function escapeHTML(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function buildFallbackImageURI(label) {
    const clean = escapeHTML(label || "Craftora Handmade");
    const svg =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 420">' +
      '<rect width="600" height="420" fill="#EEE9DF"/>' +
      '<circle cx="300" cy="175" r="68" fill="#24483F" opacity="0.14"/>' +
      '<path d="M254 195 L300 130 L346 195 Z" fill="#BC6848" opacity="0.7"/>' +
      '<text x="300" y="280" text-anchor="middle" font-family="Georgia,serif" font-size="22" fill="#24483F">' +
      clean +
      "</text>" +
      '<text x="300" y="310" text-anchor="middle" font-family="sans-serif" font-size="14" fill="#6C7068">Craftora Pakistan</text>' +
      "</svg>";
    return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
  }

  function getCatalogSource() {
    const shared = global.CraftoraData;
    const rawCategories =
      shared && Array.isArray(shared.categories) && shared.categories.length
        ? shared.categories
        : FALLBACK_CATEGORIES;

    const rawProducts =
      shared && Array.isArray(shared.products) && shared.products.length
        ? shared.products
        : FALLBACK_PRODUCTS;

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

  function formatPKR(amount) {
    if (global.CraftoraData && typeof global.CraftoraData.formatPKR === "function") {
      return global.CraftoraData.formatPKR(amount);
    }
    if (global.CraftoraUtils && typeof global.CraftoraUtils.formatPKR === "function") {
      return global.CraftoraUtils.formatPKR(amount);
    }
    return "PKR " + Number(amount || 0).toLocaleString("en-PK");
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

  /* --- Shared Cart & Wishlist Helper Wrappers --- */
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
    const product = getCatalogSource().products.find((p) => p.id === productId);
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
    const product = getCatalogSource().products.find((p) => p.id === productId);
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

  /* --- Search, Filtering & Relevance Scoring --- */
  function readParamsFromUrl() {
    const params = new URLSearchParams(global.location.search);
    const q = params.get("q");
    const cat = params.get("category");
    const min = params.get("min");
    const max = params.get("max");
    const sort = params.get("sort");

    state.query = q ? q.trim() : "";
    state.category = cat ? cat.trim().toLowerCase() : "all";
    state.minPrice = min !== null && min !== "" && !Number.isNaN(Number(min)) ? Number(min) : null;
    state.maxPrice = max !== null && max !== "" && !Number.isNaN(Number(max)) ? Number(max) : null;
    state.sortBy = sort || "relevance";
  }

  function syncUrlWithState() {
    try {
      const params = new URLSearchParams();
      if (state.query) params.set("q", state.query);
      if (state.category && state.category !== "all") params.set("category", state.category);
      if (state.minPrice !== null) params.set("min", String(state.minPrice));
      if (state.maxPrice !== null) params.set("max", String(state.maxPrice));
      if (state.sortBy && state.sortBy !== "relevance") params.set("sort", state.sortBy);

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

      if (termScore === 0) return 0; // Require all search words to match across fields
      totalScore += termScore;
    }
    return totalScore;
  }

  function filterAndSortProducts() {
    const { products } = getCatalogSource();
    const queryLower = state.query.trim().toLowerCase();
    const terms = queryLower ? queryLower.split(/\s+/).filter(Boolean) : [];

    let minVal = state.minPrice;
    let maxVal = state.maxPrice;
    if (minVal !== null && maxVal !== null && minVal > maxVal) {
      const swap = minVal;
      minVal = maxVal;
      maxVal = swap;
    }

    const matched = [];
    products.forEach((product) => {
      // Category filter
      if (state.category && state.category !== "all") {
        const matchesCat =
          product.category === state.category ||
          product.categoryLabel.toLowerCase() === state.category ||
          product.categoryAliases.includes(state.category);
        if (!matchesCat) return;
      }

      // PKR price range filter
      if (minVal !== null && product.price < minVal) return;
      if (maxVal !== null && product.price > maxVal) return;

      // Multi-field search across name, description, category, and artisan name
      const score = computeRelevanceScore(product, terms);
      if (terms.length > 0 && score === 0) return;

      matched.push({ product: product, score: score });
    });

    matched.sort((a, b) => {
      switch (state.sortBy) {
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

  /* --- Rendering Functions --- */
  function populateCategoryControls() {
    const { categories, products } = getCatalogSource();

    if (dom.categorySelect) {
      dom.categorySelect.innerHTML = '<option value="all">All Categories</option>';
      categories.forEach((cat) => {
        const opt = document.createElement("option");
        opt.value = cat.id;
        opt.textContent = cat.name;
        dom.categorySelect.appendChild(opt);
      });
    }

    if (dom.suggestedCategories) {
      dom.suggestedCategories.innerHTML = "";
      const allBtn = document.createElement("button");
      allBtn.type = "button";
      allBtn.className = "category-pill-btn";
      allBtn.setAttribute("data-category-id", "all");
      allBtn.innerHTML = `<span>All Crafts</span><span class="category-pill-count">(${products.length})</span>`;
      dom.suggestedCategories.appendChild(allBtn);

      categories.forEach((cat) => {
        const count = products.filter(
          (p) => p.category === cat.id || p.categoryAliases.includes(cat.id)
        ).length;
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "category-pill-btn";
        btn.setAttribute("data-category-id", cat.id);
        btn.innerHTML = `<span>${escapeHTML(cat.name)}</span><span class="category-pill-count">(${count})</span>`;
        dom.suggestedCategories.appendChild(btn);
      });
    }
  }

  function renderRelatedSuggestions() {
    const queryLower = state.query.toLowerCase();
    const contextual = [];

    if (queryLower.includes("ajrak") || queryLower.includes("textile") || queryLower.includes("zainab")) {
      contextual.push("Indigo", "Table Runner", "Embroidery", "Matiari");
    } else if (queryLower.includes("pottery") || queryLower.includes("multan") || queryLower.includes("kashi")) {
      contextual.push("Vase", "Turquoise", "Bowl", "Kashi Studio");
    } else if (queryLower.includes("wood") || queryLower.includes("chiniot")) {
      contextual.push("Keepsake Box", "Brass", "Darakht Works", "Truck-Art");
    }

    const suggestions = Array.from(new Set(contextual.concat(DEFAULT_SUGGESTIONS))).slice(0, 8);

    if (dom.relatedSuggestions) {
      dom.relatedSuggestions.innerHTML = suggestions
        .map((term) => {
          const active = state.query.toLowerCase() === term.toLowerCase();
          return `<button type="button" class="suggestion-chip${active ? " is-active" : ""}" data-suggest-query="${escapeHTML(term)}">${escapeHTML(term)}</button>`;
        })
        .join("");
    }

    if (dom.emptySuggestedQueries) {
      dom.emptySuggestedQueries.innerHTML = DEFAULT_SUGGESTIONS.slice(0, 6)
        .map(
          (term) =>
            `<button type="button" class="empty-suggestion-btn" data-suggest-query="${escapeHTML(term)}">${escapeHTML(term)}</button>`
        )
        .join("");
    }
  }

  function renderActiveStatusAndChips(resultsCount) {
    const { categories } = getCatalogSource();
    const matchedCat = categories.find((c) => c.id === state.category);

    if (dom.activeQueryDisplay) {
      if (state.query) {
        dom.activeQueryDisplay.innerHTML =
          'Search results for <span class="active-query-highlight">&ldquo;' +
          escapeHTML(state.query) +
          "&rdquo;</span>";
      } else if (matchedCat) {
        dom.activeQueryDisplay.innerHTML =
          'Category: <span class="active-query-highlight">' +
          escapeHTML(matchedCat.name) +
          "</span>";
      } else {
        dom.activeQueryDisplay.textContent = "Browsing all handcrafted pieces";
      }
    }

    if (dom.resultsCount) {
      dom.resultsCount.textContent =
        "Showing " + resultsCount + (resultsCount === 1 ? " handcrafted piece" : " handcrafted pieces");
    }

    if (dom.activeFilterChips) {
      const chips = [];
      if (state.query) {
        chips.push({ key: "query", label: 'Search: "' + state.query + '"' });
      }
      if (state.category !== "all") {
        chips.push({ key: "category", label: "Category: " + (matchedCat ? matchedCat.name : state.category) });
      }
      if (state.minPrice !== null) {
        chips.push({ key: "min", label: "Min: " + formatPKR(state.minPrice) });
      }
      if (state.maxPrice !== null) {
        chips.push({ key: "max", label: "Max: " + formatPKR(state.maxPrice) });
      }

      dom.activeFilterChips.innerHTML = chips
        .map(
          (chip) =>
            `<span class="active-chip">${escapeHTML(chip.label)} <button type="button" data-clear-chip="${escapeHTML(chip.key)}" aria-label="Remove ${escapeHTML(chip.label)}">&times;</button></span>`
        )
        .join("");
    }
  }

  function buildCardElement(product) {
    // Reuse shared CraftoraUI card renderer when available, ensuring product-details.html?id=...
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

  function syncControlsFromState() {
    if (dom.searchInput) dom.searchInput.value = state.query;
    if (dom.categorySelect) dom.categorySelect.value = state.category;
    if (dom.minPriceInput) dom.minPriceInput.value = state.minPrice !== null ? String(state.minPrice) : "";
    if (dom.maxPriceInput) dom.maxPriceInput.value = state.maxPrice !== null ? String(state.maxPrice) : "";
    if (dom.sortSelect) dom.sortSelect.value = state.sortBy;

    if (dom.suggestedCategories) {
      dom.suggestedCategories.querySelectorAll("[data-category-id]").forEach((btn) => {
        btn.classList.toggle("is-active", btn.getAttribute("data-category-id") === state.category);
      });
    }
  }

  function renderResults() {
    const results = filterAndSortProducts();
    syncControlsFromState();
    renderRelatedSuggestions();
    renderActiveStatusAndChips(results.length);
    syncUrlWithState();

    if (!dom.resultsGrid || !dom.emptyState) return;

    dom.resultsGrid.innerHTML = "";

    if (results.length === 0) {
      dom.resultsGrid.hidden = true;
      dom.emptyState.hidden = false;
      if (dom.emptyMessage) {
        dom.emptyMessage.textContent = state.query
          ? 'We could not find handcrafted pieces matching "' + state.query + '" with your current filters.'
          : "No handcrafted pieces match your current category and PKR price range.";
      }
      return;
    }

    dom.resultsGrid.hidden = false;
    dom.emptyState.hidden = true;

    const frag = document.createDocumentFragment();
    results.forEach((product) => {
      frag.appendChild(buildCardElement(product));
    });
    dom.resultsGrid.appendChild(frag);
    syncWishlistButtonStates();
  }

  function clearSearchOnly() {
    state.query = "";
    renderResults();
    if (dom.searchInput) dom.searchInput.focus();
  }

  function resetAllFilters() {
    state.query = "";
    state.category = "all";
    state.minPrice = null;
    state.maxPrice = null;
    state.sortBy = "relevance";
    renderResults();
  }

  function parseOptionalPrice(inputEl) {
    if (!inputEl) return null;
    const raw = inputEl.value.trim();
    if (!raw) return null;
    const num = Number(raw);
    return Number.isNaN(num) || num < 0 ? null : num;
  }

  function bindEvents() {
    if (dom.searchForm) {
      dom.searchForm.addEventListener("submit", (event) => {
        event.preventDefault();
        state.query = dom.searchInput ? dom.searchInput.value.trim() : "";
        renderResults();
      });
    }

    if (dom.searchInput) {
      dom.searchInput.addEventListener("input", () => {
        state.query = dom.searchInput.value.trim();
        renderResults();
      });
    }

    if (dom.clearSearchBtn) {
      dom.clearSearchBtn.addEventListener("click", clearSearchOnly);
    }

    if (dom.resetFiltersBtn) {
      dom.resetFiltersBtn.addEventListener("click", resetAllFilters);
    }

    if (dom.emptyClearBtn) {
      dom.emptyClearBtn.addEventListener("click", resetAllFilters);
    }

    if (dom.categorySelect) {
      dom.categorySelect.addEventListener("change", () => {
        state.category = dom.categorySelect.value || "all";
        renderResults();
      });
    }

    if (dom.minPriceInput) {
      dom.minPriceInput.addEventListener("input", () => {
        state.minPrice = parseOptionalPrice(dom.minPriceInput);
        renderResults();
      });
    }

    if (dom.maxPriceInput) {
      dom.maxPriceInput.addEventListener("input", () => {
        state.maxPrice = parseOptionalPrice(dom.maxPriceInput);
        renderResults();
      });
    }

    if (dom.sortSelect) {
      dom.sortSelect.addEventListener("change", () => {
        state.sortBy = dom.sortSelect.value || "relevance";
        renderResults();
      });
    }

    document.addEventListener("click", (event) => {
      // Suggested query click (related searches or empty state suggestions)
      const suggestBtn = event.target.closest("[data-suggest-query]");
      if (suggestBtn) {
        state.query = suggestBtn.getAttribute("data-suggest-query") || "";
        renderResults();
        return;
      }

      // Suggested category pill click
      const catBtn = event.target.closest("[data-category-id]");
      if (catBtn) {
        state.category = catBtn.getAttribute("data-category-id") || "all";
        renderResults();
        return;
      }

      // Active filter chip removal
      const chipBtn = event.target.closest("[data-clear-chip]");
      if (chipBtn) {
        const key = chipBtn.getAttribute("data-clear-chip");
        if (key === "query") state.query = "";
        if (key === "category") state.category = "all";
        if (key === "min") state.minPrice = null;
        if (key === "max") state.maxPrice = null;
        renderResults();
        return;
      }

      // Fallback Add to Cart & Wishlist handlers when CraftoraUI isn't loaded
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

  function cacheDom() {
    dom = {
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
  }

  function initSearchResultsPage() {
    if (!document.body || document.body.getAttribute("data-page") !== "search-results") {
      return;
    }
    cacheDom();
    populateCategoryControls();
    readParamsFromUrl();
    bindEvents();
    updateCountersUI();
    renderResults();
  }

  document.addEventListener("DOMContentLoaded", initSearchResultsPage);
})(window);
