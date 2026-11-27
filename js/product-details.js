/* ==========================================================================
   Craftora - Product Details Controller (pages/product-details.html)
   Vanilla JS Controller: Dynamic URL loading, interactive gallery,
   variant selector, live quantity subtotal & validation, tabs,
   localStorage cart/wishlist sync, and related product recommendations.
   ========================================================================== */

(function (global) {
  "use strict";

  // Stock inventory lookup (Units available in guild workshops)
  const STOCK_MAP = {
    p001: 8,
    p002: 6,
    p003: 4,
    p004: 12,
    p005: 5,
    p006: 14,
    p007: 7,
    p008: 9,
    p009: 11,
    p010: 5,
    p011: 8,
    p012: 6
  };

  // Craft Technique descriptions per category
  const CRAFT_TECHNIQUES = {
    "handwoven-textiles": "Traditional 14-stage double-sided wooden block carving, mud-resist printing, and natural botanical indigo & madder vat dyeing",
    "pottery-ceramics": "Hand-thrown quartz clay shaping, cobalt and turquoise mineral pigment brushwork, and high-fire kiln glazing",
    "wooden-handicrafts": "Seasoned Pakistani Sheesham carving, hand-chisel floral relief fretwork, and solid brass wire inlaying",
    "embroidery-needlework": "Authentic Hala geometric threadwork, satin stitch borders, and hand-tacked shisha mirror embroidery",
    "leather-crafts": "Hand-lasted vegetable-tanned full grain cowhide, needle-punched sole assembly, and tilla embroidery with waxed cotton thread",
    "traditional-home-decor": "Truck-art floral enamel hand-painting, chamakpatti border lining, and food-safe clear protective coating",
    "handmade-jewellery": "Hand-pierced sheet brass filigree fretwork, floral repoussé chiselling, and burnished antiqued patina finish",
    "cultural-accessories": "Hand-spun raw silk base, metallic zardozi border embellishment, and reinforced interior framing",
    "handmade-gifts": "Artisanal hand-cut woodwork, folk motif lacquer painting, and protective velvet interior lining"
  };

  // Category variants options
  const VARIANT_OPTIONS = {
    "handwoven-textiles": [
      "Traditional Indigo & Madder Red",
      "Kashmiri Mustard & Ochre",
      "Sage Green & Madder"
    ],
    "pottery-ceramics": [
      "Cobalt Blossom (Classic)",
      "Turquoise Lagoon",
      "Lapis Lazuli Geometric"
    ],
    "wooden-handicrafts": [
      "Natural Sheesham Rosewood",
      "Dark Walnut Finish",
      "Antiqued Teak & Brass"
    ],
    "embroidery-needlework": [
      "Ivory & Terracotta (Classic)",
      "Desert Ochre & Cobalt",
      "Emerald Green & Gold"
    ],
    "leather-crafts": [
      "EU 38 (PK 5)",
      "EU 39 (PK 6)",
      "EU 40 (PK 7)",
      "EU 41 (PK 8)",
      "EU 42 (PK 9)"
    ],
    "traditional-home-decor": [
      "Peacock & Sunburst Yellow",
      "Floral Caravan Red",
      "Midnight Blue Chamakpatti"
    ],
    "handmade-jewellery": [
      "Antiqued Brass & Rosewood",
      "Burnished Gold Patina",
      "Silver Patina"
    ],
    "cultural-accessories": [
      "Raw Crimson Silk",
      "Royal Indigo Silk",
      "Heritage Amber Silk"
    ],
    "handmade-gifts": [
      "Truck-Art Folk Yellow",
      "Cobalt Floral Enamel",
      "Terracotta Lacquer"
    ]
  };

  // Pre-seeded customer reviews by product category
  const SAMPLE_REVIEWS = [
    {
      author: "Dr. Hamza Tariq",
      date: "March 18, 2026",
      rating: 5,
      title: "Masterful craftsmanship & heirloom packaging",
      comment: "Arrived securely packaged in Lahore with an authentic artisan note. The natural materials and finish reflect true workshop dedication. Exceptional quality for the price."
    },
    {
      author: "Mariam Siddiqui",
      date: "March 12, 2026",
      rating: 5,
      title: "Exceeded all expectations — pristine detail",
      comment: "You can immediately feel the weight and tactile texture of genuine handmade craft. The colors are rich, authentic, and completely true to the photos. Highly recommended."
    },
    {
      author: "Bilal Farooq",
      date: "February 28, 2026",
      rating: 4,
      title: "Very fast insured dispatch & direct maker support",
      comment: "Delivered to Islamabad in under 4 days. It is deeply gratifying knowing our purchase directly compensates the independent maker guild. A treasured addition to our home."
    }
  ];

  // Current page state
  let currentProduct = null;
  let currentArtisan = null;
  let currentQty = 1;
  let maxStock = 8;
  let activeVariant = "";

  function getQueryParam(param) {
    const params = new URLSearchParams(window.location.search);
    return params.get(param);
  }

  function showProductNotFoundError() {
    const errorEl = document.getElementById("product-not-found");
    const containerEl = document.getElementById("product-details-container");
    const breadcrumbName = document.getElementById("breadcrumb-product-name");

    if (errorEl) errorEl.style.display = "flex";
    if (containerEl) containerEl.style.display = "none";
    if (breadcrumbName) breadcrumbName.textContent = "Product Not Found";
    document.title = "Product Not Found / Unavailable | Craftora";
  }

  function resolveAsset(path) {
    if (!path) return "";
    const clean = path.trim();
    return global.CraftoraData.resolveAssetPath(clean);
  }

  /* ==========================================================================
     1. Gallery & Thumbnails Controller
     ========================================================================== */
  function setupGallery(product) {
    const mainImg = document.getElementById("main-product-img");
    const badgeEl = document.getElementById("product-badge-overlay");
    const thumbGallery = document.getElementById("thumbnail-gallery");

    if (!mainImg || !thumbGallery) return;

    const primaryImgPath = resolveAsset(product.image);
    mainImg.src = primaryImgPath;
    mainImg.alt = product.alt;

    if (badgeEl) {
      badgeEl.textContent = product.badge || "Curated";
    }

    // Curate 4 clean angles reusing existing images without generating new files
    // 1. Studio Front View
    // 2. Workshop Process View (story-workshop.png)
    // 3. Heritage Raw Texture View (hero-craft.png)
    // 4. Companion Craft View (from another product of same artisan or category)
    const companionProduct = global.CraftoraData.products.find(
      (p) => p.artisanId === product.artisanId && p.id !== product.id
    ) || global.CraftoraData.products.find(
      (p) => p.category === product.category && p.id !== product.id
    );

    const companionImgPath = companionProduct
      ? resolveAsset(companionProduct.image)
      : resolveAsset("images/hero-craft.png");

    const angles = [
      {
        src: primaryImgPath,
        alt: `${product.name} - Studio Main Portrait`,
        label: "Studio View"
      },
      {
        src: resolveAsset("images/story-workshop.png"),
        alt: `${product.name} - Workshop Crafting Process in ${product.origin}`,
        label: "Workshop Process"
      },
      {
        src: resolveAsset("images/hero-craft.png"),
        alt: `${product.name} - Heritage Materials & Living Weave Texture`,
        label: "Heritage Texture"
      },
      {
        src: companionImgPath,
        alt: companionProduct
          ? `${companionProduct.name} - Artisan Companion Edition`
          : `${product.name} - Studio Angle`,
        label: companionProduct ? "Guild Companion" : "Detail Angle"
      }
    ];

    thumbGallery.innerHTML = "";

    angles.forEach((angle, idx) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "thumb-item" + (idx === 0 ? " is-active" : "");
      btn.setAttribute("aria-label", `View ${angle.label}`);
      btn.setAttribute("aria-current", idx === 0 ? "true" : "false");
      btn.innerHTML = `<img src="${angle.src}" alt="${angle.alt}" width="150" height="150">`;

      btn.addEventListener("click", () => {
        // Swap main image
        mainImg.style.opacity = "0.4";
        window.setTimeout(() => {
          mainImg.src = angle.src;
          mainImg.alt = angle.alt;
          mainImg.style.opacity = "1";
        }, 120);

        // Update active thumbnail border
        thumbGallery.querySelectorAll(".thumb-item").forEach((el) => {
          el.classList.remove("is-active");
          el.setAttribute("aria-current", "false");
        });
        btn.classList.add("is-active");
        btn.setAttribute("aria-current", "true");
      });

      thumbGallery.appendChild(btn);
    });
  }

  /* ==========================================================================
     2. Pricing, Stock & Variant Setup
     ========================================================================== */
  function setupPricingAndStock(product) {
    maxStock = STOCK_MAP[product.id] || 8;
    currentQty = 1;

    const priceEl = document.getElementById("detail-price");
    const stockBadge = document.getElementById("detail-stock-badge");
    const stockHint = document.getElementById("stock-count-hint");
    const qtyInput = document.getElementById("qty-input");

    if (priceEl) {
      priceEl.textContent = global.CraftoraData.formatPKR(product.price);
    }

    if (stockBadge) {
      if (maxStock > 5) {
        stockBadge.className = "stock-badge stock-badge--in";
        stockBadge.textContent = `In Stock (${maxStock} units available)`;
      } else if (maxStock > 0) {
        stockBadge.className = "stock-badge stock-badge--low";
        stockBadge.textContent = `Low Stock (Only ${maxStock} units left)`;
      } else {
        stockBadge.className = "stock-badge stock-badge--out";
        stockBadge.textContent = "Workshop Backorder";
      }
    }

    if (stockHint) {
      stockHint.textContent = `(Workshop limit: ${maxStock} units per patron)`;
    }

    if (qtyInput) {
      qtyInput.value = "1";
      qtyInput.max = String(maxStock);
    }

    updateSubtotal();
  }

  function setupVariants(product) {
    const variantListEl = document.getElementById("variant-options-list");
    const activeDisplay = document.getElementById("variant-active-name");
    if (!variantListEl) return;

    const options = VARIANT_OPTIONS[product.category] || [
      "Standard Guild Edition",
      "Artisan Signed Reserve",
      "Heritage Collector's Edition"
    ];

    activeVariant = options[0];
    if (activeDisplay) activeDisplay.textContent = activeVariant;

    variantListEl.innerHTML = "";
    options.forEach((opt, idx) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "variant-pill" + (idx === 0 ? " is-active" : "");
      pill.setAttribute("role", "radio");
      pill.setAttribute("aria-checked", idx === 0 ? "true" : "false");
      pill.textContent = opt;

      pill.addEventListener("click", () => {
        activeVariant = opt;
        if (activeDisplay) activeDisplay.textContent = opt;

        variantListEl.querySelectorAll(".variant-pill").forEach((el) => {
          el.classList.remove("is-active");
          el.setAttribute("aria-checked", "false");
        });
        pill.classList.add("is-active");
        pill.setAttribute("aria-checked", "true");
      });

      variantListEl.appendChild(pill);
    });
  }

  /* ==========================================================================
     3. Quantity Validation & Live Subtotal Calculation
     ========================================================================== */
  function validateQuantity(value) {
    const errorEl = document.getElementById("qty-error");
    const addCartBtn = document.getElementById("detail-add-to-cart-btn");
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");

    const num = Number(value);

    // Check invalid non-number or decimal
    if (isNaN(num) || !Number.isInteger(num)) {
      if (errorEl) {
        errorEl.textContent = "Please enter a valid whole number for quantity.";
        errorEl.style.display = "block";
      }
      if (addCartBtn) addCartBtn.disabled = true;
      return false;
    }

    // Check less than 1
    if (num < 1) {
      if (errorEl) {
        errorEl.textContent = "Minimum order quantity is 1 unit.";
        errorEl.style.display = "block";
      }
      if (addCartBtn) addCartBtn.disabled = true;
      if (minusBtn) minusBtn.disabled = true;
      return false;
    }

    // Check exceeds stock
    if (num > maxStock) {
      if (errorEl) {
        errorEl.textContent = `Only ${maxStock} units currently available in master artisan stock.`;
        errorEl.style.display = "block";
      }
      if (addCartBtn) addCartBtn.disabled = true;
      if (plusBtn) plusBtn.disabled = true;
      return false;
    }

    // Valid
    if (errorEl) errorEl.style.display = "none";
    if (addCartBtn) addCartBtn.disabled = false;
    if (minusBtn) minusBtn.disabled = num <= 1;
    if (plusBtn) plusBtn.disabled = num >= maxStock;

    currentQty = num;
    return true;
  }

  function updateSubtotal() {
    const subtotalEl = document.getElementById("detail-subtotal");
    if (!subtotalEl || !currentProduct) return;

    const total = currentProduct.price * currentQty;
    const formatted = global.CraftoraData.formatPKR(total);
    const label = currentQty === 1 ? "1 unit" : `${currentQty} units`;
    subtotalEl.textContent = `${formatted} (${label})`;
  }

  function setupQuantityControls() {
    const minusBtn = document.getElementById("qty-minus");
    const plusBtn = document.getElementById("qty-plus");
    const qtyInput = document.getElementById("qty-input");

    if (!minusBtn || !plusBtn || !qtyInput) return;

    minusBtn.addEventListener("click", () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val > 1) {
        val -= 1;
        qtyInput.value = String(val);
        if (validateQuantity(val)) {
          updateSubtotal();
        }
      }
    });

    plusBtn.addEventListener("click", () => {
      let val = parseInt(qtyInput.value, 10) || 1;
      if (val < maxStock) {
        val += 1;
        qtyInput.value = String(val);
        if (validateQuantity(val)) {
          updateSubtotal();
        }
      }
    });

    qtyInput.addEventListener("input", (e) => {
      const val = e.target.value.trim();
      if (val === "") return;
      if (validateQuantity(val)) {
        updateSubtotal();
      }
    });

    qtyInput.addEventListener("blur", (e) => {
      const val = parseInt(e.target.value, 10);
      if (isNaN(val) || val < 1) {
        qtyInput.value = "1";
        validateQuantity(1);
        updateSubtotal();
      } else if (val > maxStock) {
        qtyInput.value = String(maxStock);
        validateQuantity(maxStock);
        updateSubtotal();
      }
    });
  }

  /* ==========================================================================
     4. Cart & Wishlist Integration
     ========================================================================== */
  function syncWishlistButtonState() {
    const wishBtn = document.getElementById("detail-wishlist-toggle-btn");
    const wishText = document.getElementById("detail-wishlist-text");
    if (!wishBtn || !currentProduct) return;

    const active = global.CraftoraUI.isWishlisted(currentProduct.id);
    wishBtn.classList.toggle("is-active", active);
    wishBtn.setAttribute("aria-pressed", String(active));
    if (wishText) {
      wishText.textContent = active ? "Saved in Wishlist" : "Add to Wishlist";
    }
  }

  function setupCartAndWishlistActions() {
    const addCartBtn = document.getElementById("detail-add-to-cart-btn");
    const wishBtn = document.getElementById("detail-wishlist-toggle-btn");

    if (addCartBtn) {
      addCartBtn.addEventListener("click", () => {
        if (!currentProduct) return;
        const valid = validateQuantity(currentQty);
        if (!valid) return;

        // Add selected quantity to cart and notify
        global.CraftoraUI.addToCart(currentProduct.id, currentQty);
      });
    }

    if (wishBtn) {
      wishBtn.addEventListener("click", () => {
        if (!currentProduct) return;
        global.CraftoraUI.toggleWishlist(currentProduct.id);
        syncWishlistButtonState();
      });
    }
  }

  /* ==========================================================================
     5. Specifications, Artisan Studio & Details Population
     ========================================================================== */
  function populateProductDetails(product) {
    currentProduct = product;
    currentArtisan = global.CraftoraData.getArtisanById(product.artisanId);

    // Page title & breadcrumb
    document.title = `${product.name} | Craftora Authentic Pakistani Handicrafts`;
    const breadcrumbName = document.getElementById("breadcrumb-product-name");
    if (breadcrumbName) breadcrumbName.textContent = product.name;

    // Overview details
    const categoryEl = document.getElementById("detail-category");
    const titleEl = document.getElementById("detail-title");
    const artisanNameEl = document.getElementById("detail-artisan-name");
    const originEl = document.getElementById("detail-origin");
    const ratingScoreEl = document.getElementById("detail-rating-text");
    const descEl = document.getElementById("detail-description");

    if (categoryEl) categoryEl.textContent = product.categoryLabel;
    if (titleEl) titleEl.textContent = product.name;

    if (artisanNameEl) {
      artisanNameEl.textContent = product.artisanName;
      artisanNameEl.href = `artisan-profile.html?id=${product.artisanId}`;
    }

    if (originEl) originEl.textContent = product.origin;

    if (ratingScoreEl) {
      ratingScoreEl.textContent = `${product.rating.toFixed(1)} (${product.reviewsCount} reviews)`;
    }

    if (descEl) descEl.textContent = product.description;

    // Specifications
    const specMaterial = document.getElementById("spec-material");
    const specDimensions = document.getElementById("spec-dimensions");
    const specOrigin = document.getElementById("spec-origin");
    const specTechnique = document.getElementById("spec-technique");

    if (specMaterial) specMaterial.textContent = product.material;
    if (specDimensions) specDimensions.textContent = product.dimensions;
    if (specOrigin) specOrigin.textContent = product.origin;
    if (specTechnique) {
      specTechnique.textContent =
        CRAFT_TECHNIQUES[product.category] || "Handcrafted traditional artisanal technique";
    }

    // Artisan Studio Card Embed
    if (currentArtisan) {
      const studioImg = document.getElementById("studio-artisan-img");
      const studioName = document.getElementById("studio-artisan-name");
      const studioCraft = document.getElementById("studio-artisan-craft");
      const studioBio = document.getElementById("studio-artisan-bio");
      const studioExp = document.getElementById("studio-artisan-experience");
      const studioLink = document.getElementById("studio-profile-link");

      if (studioImg) {
        studioImg.src = resolveAsset(currentArtisan.image);
        studioImg.alt = `Master Artisan portrait: ${currentArtisan.name}`;
      }
      if (studioName) studioName.textContent = currentArtisan.name;
      if (studioCraft) studioCraft.textContent = `${currentArtisan.craft} • ${currentArtisan.city}`;
      if (studioBio) studioBio.textContent = currentArtisan.bio;
      if (studioExp) studioExp.textContent = currentArtisan.experience;
      if (studioLink) {
        studioLink.href = `artisan-profile.html?id=${currentArtisan.id}`;
      }
    }

    // Setup visual components
    setupGallery(product);
    setupPricingAndStock(product);
    setupVariants(product);
    syncWishlistButtonState();
    setupTabsContent(product);
    renderRelatedProducts(product);
  }

  /* ==========================================================================
     6. Interactive Tabs Controller (Description, Reviews, Care & Delivery)
     ========================================================================== */
  function setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabPanels = document.querySelectorAll(".tab-panel");

    tabButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetPanelId = btn.getAttribute("aria-controls");

        tabButtons.forEach((b) => {
          b.classList.remove("is-active");
          b.setAttribute("aria-selected", "false");
        });

        tabPanels.forEach((p) => {
          p.classList.remove("is-active");
          p.hidden = true;
        });

        btn.classList.add("is-active");
        btn.setAttribute("aria-selected", "true");

        const targetPanel = document.getElementById(targetPanelId);
        if (targetPanel) {
          targetPanel.classList.add("is-active");
          targetPanel.hidden = false;
        }
      });
    });
  }

  function setupTabsContent(product) {
    // Tab 1: Description & Story
    const descHeading = document.getElementById("desc-tab-heading");
    const descBody = document.getElementById("desc-tab-body");

    if (descHeading) {
      descHeading.textContent = `The Living Workshop Heritage of ${product.name}`;
    }

    if (descBody) {
      descBody.innerHTML = `
        <p>
          Originating in the historic maker community of <strong>${product.origin}</strong>, the 
          <em>${product.name}</em> represents an unbroken generational lineage of master Pakistani handcrafting. 
          Each piece is shaped slowly, honoring organic local materials and age-old regional techniques.
        </p>
        <p>
          Master artisan <strong>${product.artisanName}</strong> hand-shapes and details every specimen: 
          "${product.description}"
        </p>
        <p>
          When you acquire this piece from Craftora, 100% of the artisan earnings reach the independent guild workshop, 
          empowering rural communities, safeguarding indigenous crafts, and preserving Pakistan's extraordinary heritage.
        </p>
      `;
    }

    // Tab 2: Reviews Setup
    const reviewsBadge = document.getElementById("tab-reviews-badge");
    const avgScoreEl = document.getElementById("reviews-avg-display");
    const countDisplay = document.getElementById("reviews-count-display");
    const reviewsItems = document.getElementById("reviews-items-container");

    if (reviewsBadge) reviewsBadge.textContent = String(product.reviewsCount);
    if (avgScoreEl) avgScoreEl.textContent = product.rating.toFixed(1);
    if (countDisplay) countDisplay.textContent = String(product.reviewsCount);

    if (reviewsItems) {
      reviewsItems.innerHTML = "";
      SAMPLE_REVIEWS.forEach((rev) => {
        const item = document.createElement("article");
        item.className = "review-item";
        item.innerHTML = `
          <div class="review-top-row">
            <div class="review-author-wrap">
              <span class="review-author-name">${rev.author}</span>
              <span class="verified-buyer-badge">Verified Artisan Patron</span>
            </div>
            <time class="review-date">${rev.date}</time>
          </div>
          <div class="review-stars" aria-label="${rev.rating} out of 5 stars">
            ${"&#9733;".repeat(rev.rating)}${"&#9734;".repeat(5 - rev.rating)}
          </div>
          <h4 class="review-title">${rev.title}</h4>
          <p class="review-comment">${rev.comment}</p>
        `;
        reviewsItems.appendChild(item);
      });
    }

    // Demo Review Submission Form
    setupDemoReviewForm();

    // Tab 3: Care Instructions
    const careContent = document.getElementById("care-instructions-content");
    if (careContent) {
      careContent.innerHTML = getCareInstructionsHtml(product);
    }
  }

  function getCareInstructionsHtml(product) {
    const cat = product.category;
    if (cat === "handwoven-textiles" || cat === "embroidery-needlework" || cat === "cultural-accessories") {
      return `
        <p><strong>Natural Fibre Care:</strong> Hand wash gently in cold water using a mild organic detergent. Do not wring or soak for prolonged periods.</p>
        <p><strong>Drying & Sun Exposure:</strong> Dry flat in shaded natural air to protect botanical indigo and madder dye vibrance. Avoid intense direct midday sun.</p>
        <p><strong>Ironing:</strong> Warm iron on the reverse side of the weave or embroidery using a clean pressing cloth.</p>
      `;
    } else if (cat === "pottery-ceramics") {
      return `
        <p><strong>Hand Glaze Maintenance:</strong> Hand wash with a soft sponge and mild dishwashing liquid. Avoid abrasive scouring pads.</p>
        <p><strong>Thermal Shock Prevention:</strong> Suitable for daily dining and room-temperature decorative display. Do not transfer directly from freezing conditions to high-heat ovens.</p>
        <p><strong>Lead-Free Safety:</strong> Fired at 1,150°C using lead-free mineral cobalt and turquoise glazes safe for serving dry and warm culinary delicacies.</p>
      `;
    } else if (cat === "wooden-handicrafts" || cat === "handmade-gifts") {
      return `
        <p><strong>Sheesham Wood Care:</strong> Dust regularly with a clean, dry, lint-free microfibre cloth.</p>
        <p><strong>Lustre Preservation:</strong> Polish every 6–12 months with natural beeswax to nourish the seasoned rosewood grain and maintain natural brass inlay lustre.</p>
        <p><strong>Moisture & Sunlight:</strong> Keep away from excessive dampness and prolonged direct sunlight to prevent grain splitting.</p>
      `;
    } else if (cat === "leather-crafts") {
      return `
        <p><strong>Vegetable-Tanned Cowhide:</strong> Clean with a soft, slightly damp cotton cloth. Allow to air dry naturally at room temperature.</p>
        <p><strong>Conditioning:</strong> Treat periodically with a natural wax or neutral leather balm to maintain grain suppleness.</p>
        <p><strong>Storage:</strong> Store in the breathable unbleached cloth bag provided. Stuff lightly with clean tissue paper to preserve original hand-lasted curvature.</p>
      `;
    } else {
      return `
        <p><strong>Handmade Preservation:</strong> Wipe clean gently with a dry or lightly dampened soft cloth. Avoid harsh chemical detergents.</p>
        <p><strong>Indoor Display:</strong> Recommended for interior living and dining spaces away from sustained moisture or rain.</p>
      `;
    }
  }

  function setupDemoReviewForm() {
    const toggleBtn = document.getElementById("toggle-review-form-btn");
    const form = document.getElementById("demo-review-form");
    const cancelBtn = document.getElementById("cancel-review-form-btn");
    const reviewsItems = document.getElementById("reviews-items-container");
    const countDisplay = document.getElementById("reviews-count-display");
    const tabReviewsBadge = document.getElementById("tab-reviews-badge");

    if (!toggleBtn || !form) return;

    toggleBtn.addEventListener("click", () => {
      const isHidden = form.style.display === "none";
      form.style.display = isHidden ? "flex" : "none";
      toggleBtn.textContent = isHidden ? "Close Form" : "Write a Review";
    });

    if (cancelBtn) {
      cancelBtn.addEventListener("click", () => {
        form.style.display = "none";
        toggleBtn.textContent = "Write a Review";
        form.reset();
      });
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const author = document.getElementById("review-author").value.trim();
      const rating = parseInt(document.getElementById("review-rating").value, 10) || 5;
      const title = document.getElementById("review-title-input").value.trim();
      const body = document.getElementById("review-body-input").value.trim();

      if (!author || !title || !body) {
        global.CraftoraUI.showToast("Please complete all review fields before submitting.", "warning");
        return;
      }

      // Prepend review item
      const item = document.createElement("article");
      item.className = "review-item";
      item.innerHTML = `
        <div class="review-top-row">
          <div class="review-author-wrap">
            <span class="review-author-name">${author}</span>
            <span class="verified-buyer-badge">Verified Artisan Patron</span>
          </div>
          <time class="review-date">Just now</time>
        </div>
        <div class="review-stars" aria-label="${rating} out of 5 stars">
          ${"&#9733;".repeat(rating)}${"&#9734;".repeat(5 - rating)}
        </div>
        <h4 class="review-title">${title}</h4>
        <p class="review-comment">${body}</p>
      `;

      if (reviewsItems) {
        reviewsItems.prepend(item);
      }

      // Update counter
      if (currentProduct) {
        currentProduct.reviewsCount += 1;
        if (countDisplay) countDisplay.textContent = String(currentProduct.reviewsCount);
        if (tabReviewsBadge) tabReviewsBadge.textContent = String(currentProduct.reviewsCount);
      }

      global.CraftoraUI.showToast("Thank you! Your verified craft review has been published.", "success");
      form.reset();
      form.style.display = "none";
      toggleBtn.textContent = "Write a Review";
    });
  }

  /* ==========================================================================
     7. Related Products Grid (3-4 Cards)
     ========================================================================== */
  function renderRelatedProducts(product) {
    const grid = document.getElementById("related-products-grid");
    if (!grid) return;

    grid.innerHTML = "";

    const allProducts = global.CraftoraData.products;

    // Filter products: prefer same category or same artisan, excluding current product
    let related = allProducts.filter(
      (p) => p.id !== product.id && (p.category === product.category || p.artisanId === product.artisanId)
    );

    // If fewer than 3, backfill with other popular products
    if (related.length < 3) {
      const remaining = allProducts.filter(
        (p) => p.id !== product.id && !related.some((r) => r.id === p.id)
      );
      related = related.concat(remaining);
    }

    // Limit to 3-4 cards
    const slice = related.slice(0, 3);

    slice.forEach((item) => {
      const card = global.CraftoraUI.renderProductCard(item);
      grid.appendChild(card);
    });
  }

  /* ==========================================================================
     8. App Initializer
     ========================================================================== */
  function init() {
    const productId = getQueryParam("id");

    if (!productId) {
      showProductNotFoundError();
      return;
    }

    const product = global.CraftoraData.getProductById(productId);

    if (!product) {
      showProductNotFoundError();
      return;
    }

    // Populate all details
    populateProductDetails(product);

    // Setup interactive features
    setupQuantityControls();
    setupCartAndWishlistActions();
    setupTabs();
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})(window);
