/* ==========================================================================
   Craftora - Shared UI & State Manager
   Handles mobile menu, localStorage Cart & Wishlist, live counters,
   reusable product cards, Quick View modal, and toast notifications.
   ========================================================================== */

(function (global) {
  "use strict";

  const STORAGE_KEYS = {
    cart: "craftora_cart",
    wishlist: "craftora_wishlist"
  };

  function readStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (err) {
      return fallback;
    }
  }

  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      // Ignore storage quota errors in restricted environments
    }
  }

  function getCart() {
    const items = readStorage(STORAGE_KEYS.cart, []);
    return Array.isArray(items) ? items : [];
  }

  function getWishlist() {
    const ids = readStorage(STORAGE_KEYS.wishlist, []);
    return Array.isArray(ids) ? ids : [];
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + (Number(item.qty) || 1), 0);
  }

  function getWishlistCount() {
    return getWishlist().length;
  }

  function isWishlisted(productId) {
    return getWishlist().includes(productId);
  }

  function updateHeaderCounters() {
    const cartCount = getCartCount();
    const wishCount = getWishlistCount();

    document.querySelectorAll(".js-cart-count").forEach((el) => {
      el.textContent = String(cartCount);
    });
    document.querySelectorAll(".js-wishlist-count").forEach((el) => {
      el.textContent = String(wishCount);
    });
  }

  function syncWishlistButtons() {
    document.querySelectorAll("[data-wishlist-id]").forEach((btn) => {
      const id = btn.getAttribute("data-wishlist-id");
      const active = isWishlisted(id);
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
      btn.setAttribute(
        "aria-label",
        active ? "Remove from wishlist" : "Save to wishlist"
      );
      if (btn.classList.contains("js-modal-wishlist")) {
        btn.textContent = active ? "Saved in Wishlist" : "Save to Wishlist";
      }
    });
  }

  function showToast(message, type) {
    let container = document.getElementById("craftora-toast-container");
    if (!container) {
      container = document.createElement("div");
      container.id = "craftora-toast-container";
      container.className = "toast-container";
      container.setAttribute("aria-live", "polite");
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = "toast" + (type ? " toast--" + type : "");
    toast.textContent = message;
    container.appendChild(toast);

    window.setTimeout(() => {
      toast.remove();
    }, 3200);
  }

  function addToCart(productId, qty) {
    const product = global.CraftoraData.getProductById(productId);
    if (!product) return;

    const amount = Math.max(1, Number(qty) || 1);
    const cart = getCart();
    const existing = cart.find((item) => item.id === productId);

    if (existing) {
      existing.qty = (Number(existing.qty) || 1) + amount;
    } else {
      cart.push({ id: productId, qty: amount });
    }

    writeStorage(STORAGE_KEYS.cart, cart);
    updateHeaderCounters();
    showToast(product.name + " added to your Bag.", "success");
  }

  function toggleWishlist(productId) {
    const product = global.CraftoraData.getProductById(productId);
    if (!product) return false;

    const list = getWishlist();
    const idx = list.indexOf(productId);
    let added = false;

    if (idx === -1) {
      list.push(productId);
      added = true;
      showToast(product.name + " saved to Wishlist.", "success");
    } else {
      list.splice(idx, 1);
      showToast(product.name + " removed from Wishlist.", "info");
    }

    writeStorage(STORAGE_KEYS.wishlist, list);
    updateHeaderCounters();
    syncWishlistButtons();
    return added;
  }

  function getDetailHref(productId) {
    const inPagesDir = /\/pages\/[^/]*$/i.test(window.location.pathname);
    const base = inPagesDir ? "product-details.html" : "pages/product-details.html";
    return base + "?id=" + encodeURIComponent(productId);
  }

  function createHeartSvg() {
    return (
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
      '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>' +
      "</svg>"
    );
  }

  function renderProductCard(product) {
    const data = global.CraftoraData;
    const wishActive = isWishlisted(product.id);
    const detailUrl = getDetailHref(product.id);
    const imgPath = data.resolveAssetPath(product.image);

    const card = document.createElement("article");
    card.className = "product-card";
    card.innerHTML = `
      <div class="product-media">
        <a href="${detailUrl}">
          <img src="${imgPath}" alt="${product.alt}" width="600" height="600">
        </a>
        <span class="product-badge">${product.badge}</span>
        <button
          type="button"
          class="wishlist-btn ${wishActive ? "is-active" : ""}"
          data-wishlist-id="${product.id}"
          aria-pressed="${wishActive}"
          aria-label="${wishActive ? "Remove from wishlist" : "Save to wishlist"}"
          title="Save to Wishlist"
        >
          ${createHeartSvg()}
        </button>
      </div>
      <div class="product-body">
        <span class="product-category">${product.categoryLabel}</span>
        <h3 class="product-title">
          <a href="${detailUrl}">${product.name}</a>
        </h3>
        <p class="product-artisan">By ${product.artisanName} &middot; ${product.origin}</p>
        <div class="product-price-row">
          <span class="product-price">${data.formatPKR(product.price)}</span>
          <span class="product-rating" aria-label="Rated ${product.rating} out of 5">&#9733; ${product.rating.toFixed(1)} (${product.reviewsCount})</span>
        </div>
        <div class="product-actions">
          <button type="button" class="btn btn-primary btn-sm js-add-to-cart" data-product-id="${product.id}">
            Add to Bag
          </button>
          <button type="button" class="btn btn-outline btn-sm js-quick-view" data-product-id="${product.id}">
            Quick View
          </button>
        </div>
      </div>
    `;
    return card;
  }

  // Quick View Modal Controller
  let lastFocusedEl = null;

  function ensureQuickViewModal() {
    let modal = document.getElementById("quick-view-modal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "quick-view-modal";
    modal.className = "modal-backdrop";
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-modal", "true");
    modal.setAttribute("aria-labelledby", "qv-title");
    modal.innerHTML = `
      <div class="modal-dialog">
        <button type="button" class="modal-close js-modal-close" aria-label="Close quick view">&times;</button>
        <div class="modal-grid">
          <div class="modal-image-wrap">
            <img id="qv-img" src="" alt="">
          </div>
          <div class="modal-content">
            <span id="qv-category" class="section-eyebrow"></span>
            <h2 id="qv-title"></h2>
            <p id="qv-artisan" class="product-artisan"></p>
            <p id="qv-price" class="modal-price"></p>
            <p id="qv-desc" class="modal-desc"></p>
            <div class="modal-specs">
              <div><strong>Material:</strong> <span id="qv-material"></span></div>
              <div><strong>Dimensions:</strong> <span id="qv-dimensions"></span></div>
              <div><strong>Craft Origin:</strong> <span id="qv-origin"></span></div>
            </div>
            <div class="modal-actions">
              <button type="button" id="qv-add-btn" class="btn btn-primary">Add to Bag</button>
              <button type="button" id="qv-wish-btn" class="btn btn-outline js-modal-wishlist" data-wishlist-id="">Save to Wishlist</button>
              <a id="qv-details-link" href="#" class="btn btn-accent">Full Details</a>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    modal.addEventListener("click", (event) => {
      if (event.target === modal || event.target.closest(".js-modal-close")) {
        closeQuickView();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && modal.classList.contains("is-open")) {
        closeQuickView();
      }
    });

    return modal;
  }

  function openQuickView(productId) {
    const data = global.CraftoraData;
    const product = data.getProductById(productId);
    if (!product) return;

    const modal = ensureQuickViewModal();
    lastFocusedEl = document.activeElement;

    modal.querySelector("#qv-img").src = data.resolveAssetPath(product.image);
    modal.querySelector("#qv-img").alt = product.alt;
    modal.querySelector("#qv-category").textContent = product.categoryLabel;
    modal.querySelector("#qv-title").textContent = product.name;
    modal.querySelector("#qv-artisan").textContent =
      "Handcrafted by " + product.artisanName + " • Rating " + product.rating.toFixed(1) + "/5";
    modal.querySelector("#qv-price").textContent = data.formatPKR(product.price);
    modal.querySelector("#qv-desc").textContent = product.description;
    modal.querySelector("#qv-material").textContent = product.material;
    modal.querySelector("#qv-dimensions").textContent = product.dimensions;
    modal.querySelector("#qv-origin").textContent = product.origin;
    modal.querySelector("#qv-details-link").href = getDetailHref(product.id);

    const addBtn = modal.querySelector("#qv-add-btn");
    addBtn.setAttribute("data-product-id", product.id);
    addBtn.onclick = () => addToCart(product.id, 1);

    const wishBtn = modal.querySelector("#qv-wish-btn");
    wishBtn.setAttribute("data-wishlist-id", product.id);
    syncWishlistButtons();

    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
    modal.querySelector(".js-modal-close").focus();
  }

  function closeQuickView() {
    const modal = document.getElementById("quick-view-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    document.body.style.overflow = "";
    if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
      lastFocusedEl.focus();
    }
  }

  // Global delegated event handlers for product actions & mobile navigation
  document.addEventListener("DOMContentLoaded", () => {
    const navToggle = document.querySelector(".nav-toggle");
    const mainNav = document.querySelector("#main-nav");

    if (navToggle && mainNav) {
      navToggle.addEventListener("click", () => {
        const isOpen = mainNav.classList.toggle("open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    document.body.addEventListener("click", (event) => {
      const addBtn = event.target.closest(".js-add-to-cart");
      if (addBtn) {
        addToCart(addBtn.getAttribute("data-product-id"), 1);
        return;
      }

      const wishBtn = event.target.closest("[data-wishlist-id]");
      if (wishBtn) {
        toggleWishlist(wishBtn.getAttribute("data-wishlist-id"));
        return;
      }

      const quickBtn = event.target.closest(".js-quick-view");
      if (quickBtn) {
        openQuickView(quickBtn.getAttribute("data-product-id"));
      }
    });

    updateHeaderCounters();
  });

  global.CraftoraUI = {
    getCart: getCart,
    getWishlist: getWishlist,
    getCartCount: getCartCount,
    getWishlistCount: getWishlistCount,
    addToCart: addToCart,
    toggleWishlist: toggleWishlist,
    isWishlisted: isWishlisted,
    updateHeaderCounters: updateHeaderCounters,
    renderProductCard: renderProductCard,
    openQuickView: openQuickView,
    closeQuickView: closeQuickView,
    showToast: showToast
  };
})(window);
