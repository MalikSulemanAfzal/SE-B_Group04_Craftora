/* ==========================================================================
   Craftora - Pricing, Formatting & Validation Utilities
   Standard shipping: Rs. 250 (free at Rs. 10,000+), Express: Rs. 450,
   Promo code: CRAFT10 (10% off up to Rs. 1,500).
   ========================================================================== */

(function (root) {
  "use strict";

  const PRICING_RULES = {
    STANDARD_SHIPPING_FEE: 250,
    FREE_SHIPPING_THRESHOLD: 10000,
    EXPRESS_SHIPPING_FEE: 450,
    PROMO_CODES: {
      CRAFT10: {
        code: "CRAFT10",
        rate: 0.10,
        maxDiscount: 1500,
        description: "10% off up to Rs. 1,500"
      }
    }
  };

  /* --- 1. Formatting & Safety Helpers --- */

  function formatPKR(amount) {
    const value = Math.round(Number(amount) || 0);
    return `Rs. ${value.toLocaleString("en-PK")}`;
  }

  function formatDate(isoString) {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  // Resolves root vs /pages/ subpage paths cleanly for static hosting or file://
  function getBasePath() {
    if (typeof window === "undefined") return "";
    return window.location.pathname.includes("/pages/") ? "../" : "";
  }

  /* --- 2. Pricing Helpers --- */

  function calculateShipping(subtotal, shippingMethod = "standard") {
    const amount = Math.max(0, Number(subtotal) || 0);
    if (amount === 0) return 0;

    if (String(shippingMethod).toLowerCase() === "express") {
      return PRICING_RULES.EXPRESS_SHIPPING_FEE;
    }

    return amount >= PRICING_RULES.FREE_SHIPPING_THRESHOLD
      ? 0
      : PRICING_RULES.STANDARD_SHIPPING_FEE;
  }

  function validatePromoCode(code, subtotal = 0) {
    const normalized = String(code || "").trim().toUpperCase();
    const orderSubtotal = Math.max(0, Number(subtotal) || 0);

    if (!normalized) {
      return {
        valid: false,
        code: "",
        discount: 0,
        message: "Please enter a promo code."
      };
    }

    const promo = PRICING_RULES.PROMO_CODES[normalized];
    if (!promo) {
      return {
        valid: false,
        code: normalized,
        discount: 0,
        message: `Promo code "${normalized}" is invalid.`
      };
    }

    const rawDiscount = Math.round(orderSubtotal * promo.rate);
    const discount = Math.min(rawDiscount, promo.maxDiscount, orderSubtotal);

    return {
      valid: true,
      code: promo.code,
      discount,
      message: `${promo.code} applied (${promo.description}).`
    };
  }

  function calculateDiscount(subtotal, promoCode) {
    return validatePromoCode(promoCode, subtotal).discount;
  }

  function calculateOrderSummary(cartItems, options = {}) {
    const {
      shippingMethod = "standard",
      promoCode = "",
      productLookup = root.CraftoraData && root.CraftoraData.getProductById
    } = options;

    const items = Array.isArray(cartItems) ? cartItems : [];
    let subtotal = 0;
    let itemCount = 0;

    for (const item of items) {
      const qty = Math.max(0, Math.floor(Number(item.quantity) || 0));
      if (!qty) continue;

      const product =
        typeof productLookup === "function" ? productLookup(item.productId) : null;
      const unitPrice = product ? Number(product.price) || 0 : Number(item.price) || 0;

      subtotal += unitPrice * qty;
      itemCount += qty;
    }

    const promo = promoCode
      ? validatePromoCode(promoCode, subtotal)
      : { valid: false, code: "", discount: 0, message: "" };

    const discount = promo.valid ? promo.discount : 0;
    const shipping = calculateShipping(subtotal, shippingMethod);
    const total = Math.max(0, subtotal - discount) + shipping;
    const amountForFreeShipping = Math.max(
      0,
      PRICING_RULES.FREE_SHIPPING_THRESHOLD - subtotal
    );

    return {
      itemCount,
      subtotal,
      discount,
      shipping,
      shippingMethod,
      total,
      amountForFreeShipping,
      qualifiesFreeStandardShipping: subtotal >= PRICING_RULES.FREE_SHIPPING_THRESHOLD,
      promo
    };
  }

  /* --- 3. Validation Helpers --- */

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
  }

  // Accepts Pakistani mobile formats: 03XXXXXXXXX, 03XX-XXXXXXX, +923XXXXXXXXX
  function isValidPakistaniPhone(phone) {
    const cleaned = String(phone || "").replace(/[\s-]/g, "");
    return /^(?:\+92|0092|0)?3\d{9}$/.test(cleaned);
  }

  function isValidPostalCode(postalCode) {
    return /^\d{5}$/.test(String(postalCode || "").trim());
  }

  function validateRequired(value, label) {
    if (!String(value || "").trim()) {
      return `${label} is required.`;
    }
    return "";
  }

  function validateCheckoutForm(formData = {}) {
    const errors = {};

    const nameErr = validateRequired(formData.fullName, "Full name");
    if (nameErr) errors.fullName = nameErr;

    if (!String(formData.email || "").trim()) {
      errors.email = "Email address is required.";
    } else if (!isValidEmail(formData.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!String(formData.phone || "").trim()) {
      errors.phone = "Mobile number is required.";
    } else if (!isValidPakistaniPhone(formData.phone)) {
      errors.phone = "Enter a valid Pakistani mobile number (e.g. 0300-1234567).";
    }

    const addressErr = validateRequired(formData.address, "Street address");
    if (addressErr) errors.address = addressErr;

    const cityErr = validateRequired(formData.city, "City");
    if (cityErr) errors.city = cityErr;

    const provinceErr = validateRequired(formData.province, "Province");
    if (provinceErr) errors.province = provinceErr;

    if (!String(formData.postalCode || "").trim()) {
      errors.postalCode = "Postal code is required.";
    } else if (!isValidPostalCode(formData.postalCode)) {
      errors.postalCode = "Postal code must be 5 digits (e.g. 44000).";
    }

    return {
      valid: Object.keys(errors).length === 0,
      errors
    };
  }

  const CraftoraUtils = {
    PRICING_RULES,
    formatPKR,
    formatDate,
    escapeHTML,
    getBasePath,
    calculateShipping,
    validatePromoCode,
    calculateDiscount,
    calculateOrderSummary,
    isValidEmail,
    isValidPakistaniPhone,
    isValidPostalCode,
    validateRequired,
    validateCheckoutForm
  };

  root.CraftoraUtils = CraftoraUtils;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = CraftoraUtils;
  }
})(typeof window !== "undefined" ? window : globalThis);
