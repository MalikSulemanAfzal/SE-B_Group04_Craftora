/* ==========================================================================
   Craftora - Shared UI Components & Interactions
   Renders shared header, footer, product cards, artisan cards, and toasts.
   ========================================================================== */

(function (root) {
  "use strict";

  const { escapeHTML, formatPKR, getBasePath } = root.CraftoraUtils;
  const Data = root.CraftoraData;
  const Storage = root.CraftoraStorage;

  // Generates a lightweight inline SVG fallback when a product image file is not yet added
  function buildImageFallbackDataURI(label) {
    const safeLabel = escapeHTML(label || "Craftora Craft");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
        <rect width="400" height="300" fill="#EEE9DF"/>
        <circle cx="200" cy="120" r="44" fill="#24483F" opacity="0.14"/>
        <path d="M172 132 L200 94 L228 132 Z" fill="#BC6848" opacity="0.65"/>
        <text x="200" y="195" text-anchor="middle" font-family="Georgia, serif" font-size="18" fill="#24483F">${safeLabel}</text>
        <text x="200" y="220" text-anchor="middle" font-family="sans-serif" font-size="12" fill="#72766F">Handcrafted in Pakistan</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function getNavItems(basePath) {
    return [
      { key: "home", label: "Home", href: `${basePath}index.html` },
      { key: "shop", label: "Shop", href: `${basePath}pages/products.html` },
      { key: "artisans", label: "Artisans", href: `${basePath}pages/artisans.html` },
      { key: "about", label: "About", href: `${basePath}pages/about.html` },
      { key: "contact", label: "Contact", href: `${basePath}pages/contact.html` }
    ];
  }

  /* --- 1. Shared Header & Footer --- */

  function renderHeader(targetSelector = "#site-header", activePage = "home") {
    const container =
      typeof targetSelector === "string"
        ? document.querySelector(targetSelector)
        : targetSelector;

    if (!container) return;

    const base = getBasePath();
    const navItems = getNavItems(base);
    const cartCount = Storage ? Storage.getCartCount() : 0;
    const wishlistCount = Storage ? Storage.getWishlist().length : 0;

    const navLinksMarkup = navItems
      .map((item) => {
        const isActive = item.key === activePage;
        return `<li><a href="${item.href}" class="nav-link${isActive ? " active" : ""}"${
          isActive ? ' aria-current="page"' : ""
        }>${escapeHTML(item.label)}</a></li>`;
      })
      .join("");

    container.innerHTML = `
      <div class="promo-bar">
        Free standard shipping on orders <strong>Rs. 10,000+</strong> &bull; Use code <strong>CRAFT10</strong> for 10% off (up to Rs. 1,500)
      </div>
      <div class="container header-inner">
        <a href="${base}index.html" class="brand-logo">
          <span class="brand-name">Craftora</span>
          <span class="brand-tagline">Pakistani Handicrafts</span>
        </a>

        <button
          type="button"
          class="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded="false"
          aria-controls="main-nav"
        >
          &#9776;
        </button>

        <nav id="main-nav" class="site-nav" aria-label="Main navigation">
          <ul class="nav-list">${navLinksMarkup}</ul>
          <div class="header-actions">
            <a href="${base}pages/wishlist.html" class="icon-link" aria-label="Wishlist">
              &#9825; Wishlist <span id="wishlist-badge" class="badge-count">${wishlistCount}</span>
            </a>
            <a href="${base}pages/cart.html" class="icon-link" aria-label="Shopping cart">
              Cart <span id="cart-badge" class="badge-count">${cartCount}</span>
            </a>
          </div>
        </nav>
      </div>
    `;
  }

  function renderFooter(targetSelector = "#site-footer") {
    const container =
      typeof targetSelector === "string"
        ? document.querySelector(targetSelector)
        : targetSelector;

    if (!container) return;

    const base = getBasePath();
    const year = new Date().getFullYear();

    container.innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div class="footer-brand">
            <span class="brand-name">Craftora</span>
            <p>
              Connecting master artisans from Multan, Bhit Shah, Chiniot, Bahawalpur,
              Swat, and Peshawar directly with homes that value authentic Pakistani craft.
            </p>
          </div>

          <div>
            <h3 class="footer-heading">Marketplace</h3>
            <ul class="footer-links">
              <li><a href="${base}index.html">Home</a></li>
              <li><a href="${base}pages/products.html">All Crafts</a></li>
              <li><a href="${base}pages/artisans.html">Meet the Artisans</a></li>
              <li><a href="${base}pages/cart.html">Your Cart</a></li>
            </ul>
          </div>

          <div>
            <h3 class="footer-heading">Customer Care</h3>
            <ul class="footer-links">
              <li><a href="${base}pages/about.html">Our Story</a></li>
              <li><a href="${base}pages/contact.html">Contact Us</a></li>
              <li><a href="${base}pages/orders.html">Track Orders</a></li>
              <li><span>Standard Shipping: Rs. 250 (Free Rs. 10,000+)</span></li>
            </ul>
          </div>
        </div>

        <div class="footer-bottom">
          <span>&copy; ${year} Craftora &mdash; Pakistani Handicrafts Marketplace.</span>
          <span>Express Delivery: Rs. 450 &bull; Promo Code: CRAFT10</span>
        </div>
      </div>
    `;
  }

  /* --- 2. Product & Artisan Cards --- */

  function renderProductCard(product) {
    const base = getBasePath();
    const artisan = Data ? Data.getArtisanById(product.artisanId) : null;
    const inWishlist = Storage ? Storage.isInWishlist(product.id) : false;
    const fallbackURI = buildImageFallbackDataURI(product.category);
    const imgSrc = `${base}${product.image}`;

    const badgeHTML = product.badge
      ? `<span class="badge badge-gold product-card-badge">${escapeHTML(product.badge)}</span>`
      : "";

    const originalPriceHTML = product.originalPrice
      ? `<span class="product-original-price">${escapeHTML(formatPKR(product.originalPrice))}</span>`
      : "";

    return `
      <article class="product-card" data-product-id="${escapeHTML(product.id)}">
        <div class="product-card-media">
          <img
            src="${escapeHTML(imgSrc)}"
            alt="${escapeHTML(product.title)}"
            class="product-card-img"
            data-fallback="${escapeHTML(fallbackURI)}"
            onerror="this.onerror=null;this.src=this.dataset.fallback;"
          >
          ${badgeHTML}
          <button
            type="button"
            class="wishlist-btn js-toggle-wishlist${inWishlist ? " is-active" : ""}"
            data-product-id="${escapeHTML(product.id)}"
            aria-label="${inWishlist ? "Remove from wishlist" : "Add to wishlist"}"
            aria-pressed="${inWishlist}"
          >
            ${inWishlist ? "&#9829;" : "&#9825;"}
          </button>
        </div>

        <div class="product-card-body">
          <div class="product-meta">
            <span>${escapeHTML(product.category)}</span>
            <span>${escapeHTML(product.region)}</span>
          </div>

          <h3 class="product-title">${escapeHTML(product.title)}</h3>
          <p class="product-artisan">
            By ${escapeHTML(artisan ? artisan.name : "Craftora Artisan")}
          </p>

          <p class="product-rating">
            &#9733; ${escapeHTML(product.rating)}
            <span>(${escapeHTML(product.reviewCount)} reviews)</span>
          </p>

          <div class="product-price-row">
            <span class="product-price">${escapeHTML(formatPKR(product.price))}</span>
            ${originalPriceHTML}
          </div>

          <div class="product-card-actions">
            <button
              type="button"
              class="btn btn-primary btn-sm js-add-to-cart"
              data-product-id="${escapeHTML(product.id)}"
              ${product.stock <= 0 ? "disabled" : ""}
            >
              ${product.stock > 0 ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  function renderArtisanCard(artisan) {
    const initials = artisan.name
      .split(" ")
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();

    return `
      <article class="artisan-card" data-artisan-id="${escapeHTML(artisan.id)}">
        <div class="artisan-header">
          <div class="artisan-avatar" aria-hidden="true">${escapeHTML(initials)}</div>
          <div>
            <h3 class="artisan-name">${escapeHTML(artisan.name)}</h3>
            <p class="artisan-region">${escapeHTML(artisan.city)}, ${escapeHTML(artisan.province)}</p>
          </div>
        </div>
        <p class="artisan-craft">${escapeHTML(artisan.craft)} &bull; ${escapeHTML(artisan.yearsExperience)} yrs</p>
        <p class="artisan-bio">${escapeHTML(artisan.bio)}</p>
      </article>
    `;
  }

  /* --- 3. Badges & Toast Feedback --- */

  function updateHeaderBadges() {
    if (!Storage) return;
    const cartBadge = document.querySelector("#cart-badge");
    const wishlistBadge = document.querySelector("#wishlist-badge");

    if (cartBadge) cartBadge.textContent = String(Storage.getCartCount());
    if (wishlistBadge) wishlistBadge.textContent = String(Storage.getWishlist().length);
  }

  function showToast(message, type = "success") {
    let container = document.querySelector("#toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  /* --- 4. Shared Event Wiring & Auto-Init --- */

  function bindGlobalEvents() {
    document.addEventListener("click", (event) => {
      // Mobile menu toggle
      const toggleBtn = event.target.closest(".nav-toggle");
      if (toggleBtn) {
        const nav = document.querySelector("#main-nav");
        if (nav) {
          const isOpen = nav.classList.toggle("open");
          toggleBtn.setAttribute("aria-expanded", String(isOpen));
        }
        return;
      }

      // Add to Cart button
      const addCartBtn = event.target.closest(".js-add-to-cart");
      if (addCartBtn && Storage && Data) {
        const productId = addCartBtn.dataset.productId;
        const product = Data.getProductById(productId);
        if (product) {
          Storage.addToCart(productId, 1);
          showToast(`Added "${product.title}" to cart.`);
        }
        return;
      }

      // Wishlist toggle button
      const wishBtn = event.target.closest(".js-toggle-wishlist");
      if (wishBtn && Storage && Data) {
        const productId = wishBtn.dataset.productId;
        const product = Data.getProductById(productId);
        const { added } = Storage.toggleWishlist(productId);

        wishBtn.classList.toggle("is-active", added);
        wishBtn.setAttribute("aria-pressed", String(added));
        wishBtn.setAttribute(
          "aria-label",
          added ? "Remove from wishlist" : "Add to wishlist"
        );
        wishBtn.innerHTML = added ? "&#9829;" : "&#9825;";

        if (product) {
          showToast(
            added
              ? `Saved "${product.title}" to wishlist.`
              : `Removed "${product.title}" from wishlist.`,
            added ? "success" : "warning"
          );
        }
      }
    });

    window.addEventListener("craftora:storage-change", updateHeaderBadges);
  }

  function initSharedLayout() {
    const headerEl = document.querySelector("#site-header");
    if (headerEl && headerEl.dataset.autoRender !== "false") {
      const activePage = headerEl.dataset.activePage || "home";
      renderHeader(headerEl, activePage);
    }

    const footerEl = document.querySelector("#site-footer");
    if (footerEl && footerEl.dataset.autoRender !== "false") {
      renderFooter(footerEl);
    }

    // Populate optional featured containers if present (e.g., on index.html)
    const featuredProductsEl = document.querySelector("#featured-products");
    if (featuredProductsEl && Data) {
      const featured = Data.PRODUCTS.filter((p) => p.featured);
      featuredProductsEl.innerHTML = featured.map(renderProductCard).join("");
    }

    const featuredArtisansEl = document.querySelector("#featured-artisans");
    if (featuredArtisansEl && Data) {
      featuredArtisansEl.innerHTML = Data.ARTISANS.slice(0, 3)
        .map(renderArtisanCard)
        .join("");
    }

    updateHeaderBadges();
    bindGlobalEvents();
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initSharedLayout);
  }

  const CraftoraComponents = {
    renderHeader,
    renderFooter,
    renderProductCard,
    renderArtisanCard,
    updateHeaderBadges,
    showToast
  };

  root.CraftoraComponents = CraftoraComponents;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = CraftoraComponents;
  }
})(typeof window !== "undefined" ? window : globalThis);
