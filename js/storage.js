/* ==========================================================================
   Craftora - LocalStorage Helpers
   Manages cart, wishlist, orders, and customer profile persistence safely.
   ========================================================================== */

(function (root) {
  "use strict";

  const STORAGE_KEYS = {
    CART: "craftora_cart",
    WISHLIST: "craftora_wishlist",
    ORDERS: "craftora_orders",
    PROFILE: "craftora_customer_profile",
    STOCK: "craftora_product_stock",
    LAST_ORDER_ID: "craftora_last_order_id"
  };

  const DEFAULT_PROFILE = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    province: "",
    postalCode: ""
  };

  // Emit a custom event so header badges or other views can react to state changes
  function notifyStorageChange(section) {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(
        new CustomEvent("craftora:storage-change", { detail: { section } })
      );
    }
  }

  function readJSON(key, fallback) {
    try {
      const raw = root.localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch {
      return fallback;
    }
  }

  function writeJSON(key, value, section) {
    try {
      root.localStorage.setItem(key, JSON.stringify(value));
      notifyStorageChange(section);
      return true;
    } catch {
      return false;
    }
  }

  /* --- 1. Cart Helpers --- */

  function getCart() {
    const items = readJSON(STORAGE_KEYS.CART, []);
    return Array.isArray(items) ? items : [];
  }

  function saveCart(cart) {
    const sanitized = Array.isArray(cart)
      ? cart.filter((item) => item && item.productId && Number(item.quantity) > 0)
      : [];
    writeJSON(STORAGE_KEYS.CART, sanitized, "cart");
    return sanitized;
  }

  function addToCart(productId, quantity = 1) {
    const qty = Math.max(1, Math.floor(Number(quantity) || 1));
    const cart = getCart();
    const existing = cart.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.push({
        productId,
        quantity: qty,
        addedAt: new Date().toISOString()
      });
    }

    return saveCart(cart);
  }

  function updateCartQuantity(productId, quantity) {
    const qty = Math.floor(Number(quantity) || 0);
    if (qty <= 0) {
      return removeFromCart(productId);
    }

    const cart = getCart().map((item) =>
      item.productId === productId ? { ...item, quantity: qty } : item
    );
    return saveCart(cart);
  }

  function removeFromCart(productId) {
    const cart = getCart().filter((item) => item.productId !== productId);
    return saveCart(cart);
  }

  function clearCart() {
    return saveCart([]);
  }

  function getCartCount() {
    return getCart().reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  }

  /* --- 2. Wishlist Helpers --- */

  function getWishlist() {
    const list = readJSON(STORAGE_KEYS.WISHLIST, []);
    return Array.isArray(list) ? list : [];
  }

  function saveWishlist(wishlist) {
    const unique = Array.isArray(wishlist) ? [...new Set(wishlist.filter(Boolean))] : [];
    writeJSON(STORAGE_KEYS.WISHLIST, unique, "wishlist");
    return unique;
  }

  function isInWishlist(productId) {
    return getWishlist().includes(productId);
  }

  function toggleWishlist(productId) {
    const current = getWishlist();
    const exists = current.includes(productId);
    const updated = exists
      ? current.filter((id) => id !== productId)
      : [...current, productId];

    saveWishlist(updated);
    return { wishlist: updated, added: !exists };
  }

  function clearWishlist() {
    return saveWishlist([]);
  }

  /* --- 3. Orders Helpers --- */

  function getOrders() {
    const orders = readJSON(STORAGE_KEYS.ORDERS, []);
    return Array.isArray(orders) ? orders : [];
  }

  function saveOrders(orders) {
    const list = Array.isArray(orders) ? orders : [];
    writeJSON(STORAGE_KEYS.ORDERS, list, "orders");
    return list;
  }

  function createOrder(orderData) {
    const now = new Date();
    const dateStamp = now.toISOString().slice(0, 10).replace(/-/g, "");
    const existingIds = new Set(getOrders().map((order) => order.id));

    let uniqueId = "";
    do {
      const randomSuffix = String(Math.floor(1000 + Math.random() * 9000));
      uniqueId = `CRF-${dateStamp}-${randomSuffix}`;
    } while (existingIds.has(uniqueId));

    const newOrder = {
      id: uniqueId,
      createdAt: now.toISOString(),
      status: "Confirmed (Demo)",
      isDemo: true,
      ...orderData
    };

    const orders = [newOrder, ...getOrders()];
    saveOrders(orders);
    try {
      root.localStorage.setItem(STORAGE_KEYS.LAST_ORDER_ID, newOrder.id);
    } catch {
      // Ignore storage write errors for auxiliary last-order pointer
    }
    return newOrder;
  }

  function getLastOrderId() {
    try {
      return root.localStorage.getItem(STORAGE_KEYS.LAST_ORDER_ID) || "";
    } catch {
      return "";
    }
  }

  function getOrderById(orderId) {
    return getOrders().find((order) => order.id === orderId) || null;
  }

  function clearOrders() {
    return saveOrders([]);
  }

  /* --- 4. Customer Profile Helpers --- */

  function getCustomerProfile() {
    const stored = readJSON(STORAGE_KEYS.PROFILE, {});
    return { ...DEFAULT_PROFILE, ...(stored && typeof stored === "object" ? stored : {}) };
  }

  function saveCustomerProfile(profile) {
    const merged = {
      ...getCustomerProfile(),
      ...(profile && typeof profile === "object" ? profile : {})
    };
    writeJSON(STORAGE_KEYS.PROFILE, merged, "profile");
    return merged;
  }

  function clearCustomerProfile() {
    writeJSON(STORAGE_KEYS.PROFILE, { ...DEFAULT_PROFILE }, "profile");
    return { ...DEFAULT_PROFILE };
  }

  /* --- 5. Product Stock Persistence Helpers --- */

  function getStockOverrides() {
    const map = readJSON(STORAGE_KEYS.STOCK, {});
    return map && typeof map === "object" && !Array.isArray(map) ? map : {};
  }

  function applyStockOverrides() {
    if (!root.CraftoraData || !Array.isArray(root.CraftoraData.PRODUCTS)) return;
    const overrides = getStockOverrides();
    root.CraftoraData.PRODUCTS.forEach((product) => {
      if (Object.prototype.hasOwnProperty.call(overrides, product.id)) {
        product.stock = Math.max(0, Number(overrides[product.id]) || 0);
      }
    });
  }

  function deductStock(items) {
    if (!Array.isArray(items)) return getStockOverrides();
    applyStockOverrides();
    const overrides = { ...getStockOverrides() };

    items.forEach((item) => {
      if (!item || !item.productId) return;
      const qty = Math.max(0, Math.floor(Number(item.quantity) || 0));
      const product = root.CraftoraData
        ? root.CraftoraData.getProductById(item.productId)
        : null;

      if (product) {
        const nextStock = Math.max(0, (Number(product.stock) || 0) - qty);
        product.stock = nextStock;
        overrides[product.id] = nextStock;
      }
    });

    writeJSON(STORAGE_KEYS.STOCK, overrides, "stock");
    return overrides;
  }

  // Sync persisted stock overrides onto CraftoraData on script load
  applyStockOverrides();

  const CraftoraStorage = {
    STORAGE_KEYS,
    getCart,
    saveCart,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
    getWishlist,
    saveWishlist,
    isInWishlist,
    toggleWishlist,
    clearWishlist,
    getOrders,
    saveOrders,
    createOrder,
    getOrderById,
    getLastOrderId,
    clearOrders,
    getCustomerProfile,
    saveCustomerProfile,
    clearCustomerProfile,
    getStockOverrides,
    applyStockOverrides,
    deductStock
  };

  root.CraftoraStorage = CraftoraStorage;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = CraftoraStorage;
  }
})(typeof window !== "undefined" ? window : globalThis);
