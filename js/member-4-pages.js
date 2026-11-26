/* ==========================================================================
   Craftora - Member 4 Page Controller
   Handles checkout validation, pricing updates, demo order placement,
   stock deduction, and redirect to order-confirmation.html.
   Activated via <body data-page="checkout">.
   ========================================================================== */

(function (root) {
  "use strict";

  const Data = root.CraftoraData;
  const Storage = root.CraftoraStorage;
  const Utils = root.CraftoraUtils;
  const Components = root.CraftoraComponents;

  const PAYMENT_LABELS = {
    cod: "Cash on Delivery (Demo)",
    bank_transfer: "Bank Transfer / IBFT (Demo)",
    mobile_wallet: "Mobile Wallet (Demo)"
  };

  const DELIVERY_LABELS = {
    standard: "Standard",
    express: "Express"
  };

  const PROFILE_FIELDS = [
    "fullName",
    "email",
    "phone",
    "address",
    "city",
    "province",
    "postalCode"
  ];

  function populateProfileForm(formEl, profile) {
    PROFILE_FIELDS.forEach((field) => {
      const input = formEl.elements[field];
      if (input && profile[field]) {
        input.value = profile[field];
      }
    });
  }

  function readProfileForm(formEl) {
    const data = {};
    PROFILE_FIELDS.forEach((field) => {
      const input = formEl.elements[field];
      data[field] = input ? input.value.trim() : "";
    });
    return data;
  }

  function clearFormErrors(formEl, alertEl) {
    if (alertEl) {
      alertEl.hidden = true;
      alertEl.textContent = "";
      alertEl.classList.remove("alert-success", "alert-error");
    }

    formEl.querySelectorAll(".form-control.is-invalid").forEach((el) => {
      el.classList.remove("is-invalid");
    });
    formEl.querySelectorAll(".form-error").forEach((el) => {
      el.textContent = "";
    });
  }

  function applyFormErrors(formEl, alertEl, errors, summaryMessage) {
    let firstInvalidInput = null;

    Object.entries(errors).forEach(([field, message]) => {
      const input = formEl.elements[field];
      const errorEl = formEl.querySelector(`[data-error-for="${field}"]`);

      if (input && input.classList) {
        input.classList.add("is-invalid");
        if (!firstInvalidInput) firstInvalidInput = input;
      }
      if (errorEl) {
        errorEl.textContent = message;
      }
    });

    if (alertEl) {
      alertEl.classList.remove("alert-success");
      alertEl.classList.add("alert-error");
      alertEl.textContent = summaryMessage;
      alertEl.hidden = false;
    }

    if (firstInvalidInput && typeof firstInvalidInput.focus === "function") {
      firstInvalidInput.focus();
    }
  }

  function bindFieldErrorClearOnInput(formEl) {
    formEl.addEventListener("input", (event) => {
      const target = event.target;
      if (!target.name) return;
      target.classList.remove("is-invalid");
      const errorEl = formEl.querySelector(`[data-error-for="${target.name}"]`);
      if (errorEl) errorEl.textContent = "";
    });
  }

  // Fallback image matches components.js style for consistent presentation
  function getItemThumbFallback(category) {
    const label = Utils.escapeHTML(category || "Craft");
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 100">
        <rect width="120" height="100" fill="#EEE9DF"/>
        <circle cx="60" cy="42" r="18" fill="#24483F" opacity="0.16"/>
        <text x="60" y="78" text-anchor="middle" font-family="Georgia, serif" font-size="11" fill="#24483F">${label}</text>
      </svg>
    `.trim();
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function initCheckoutPage() {
    const state = {
      appliedPromoCode: ""
    };

    const emptyStateEl = document.querySelector("#checkout-empty-state");
    const contentEl = document.querySelector("#checkout-content");
    const formEl = document.querySelector("#checkout-form");
    const itemsListEl = document.querySelector("#checkout-items");
    const stockAlertEl = document.querySelector("#checkout-stock-alert");
    const formAlertEl = document.querySelector("#checkout-form-alert");
    const placeOrderBtn = document.querySelector("#place-order-btn");

    const promoInputEl = document.querySelector("#promo-code");
    const applyPromoBtn = document.querySelector("#apply-promo-btn");
    const removePromoBtn = document.querySelector("#remove-promo-btn");
    const promoFeedbackEl = document.querySelector("#promo-feedback");

    if (!emptyStateEl || !contentEl || !formEl) return;

    /* --- 1. Profile Pre-fill & Choice Card UI Sync --- */

    function prefillCustomerProfile() {
      populateProfileForm(formEl, Storage.getCustomerProfile());
    }

    function syncChoiceCardHighlight(groupName) {
      const cards = formEl.querySelectorAll(`.choice-card[data-choice-group="${groupName}"]`);
      cards.forEach((card) => {
        const radio = card.querySelector('input[type="radio"]');
        card.classList.toggle("is-selected", Boolean(radio && radio.checked));
      });
    }

    function getSelectedRadioValue(name, fallback) {
      const checked = formEl.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : fallback;
    }

    /* --- 2. Cart & Stock Validation --- */

    function validateCartStock(cart) {
      const issues = [];
      const resolvedItems = [];

      for (const entry of cart) {
        const product = Data.getProductById(entry.productId);
        const qty = Number(entry.quantity);

        if (!product) {
          issues.push(`Product "${entry.productId}" is no longer available in the catalog.`);
          continue;
        }

        if (!Number.isInteger(qty) || qty < 1) {
          issues.push(`Invalid quantity for "${product.title}". Quantity must be at least 1.`);
        } else if (product.stock <= 0) {
          issues.push(`"${product.title}" is currently out of stock.`);
        } else if (qty > product.stock) {
          issues.push(
            `Only ${product.stock} unit(s) of "${product.title}" left in stock (requested ${qty}).`
          );
        }

        resolvedItems.push({ product, quantity: qty });
      }

      return {
        valid: issues.length === 0 && resolvedItems.length > 0,
        issues,
        resolvedItems
      };
    }

    /* --- 3. Render Order Summary & Totals --- */

    function updateDeliveryCardLabels(subtotal) {
      const standardFeeLabel = document.querySelector("#standard-fee-label");
      if (!standardFeeLabel) return;

      const standardFee = Utils.calculateShipping(subtotal, "standard");
      if (standardFee === 0 && subtotal > 0) {
        standardFeeLabel.textContent = "FREE";
        standardFeeLabel.classList.add("is-free");
      } else {
        standardFeeLabel.textContent = Utils.formatPKR(standardFee);
        standardFeeLabel.classList.remove("is-free");
      }
    }

    function updateShippingProgress(subtotal) {
      const progressTextEl = document.querySelector("#shipping-progress-text");
      const progressFillEl = document.querySelector("#shipping-progress-fill");
      if (!progressTextEl || !progressFillEl) return;

      const threshold = Utils.PRICING_RULES.FREE_SHIPPING_THRESHOLD;
      const pct = Math.min(100, Math.round((subtotal / threshold) * 100));
      progressFillEl.style.width = `${pct}%`;

      if (subtotal >= threshold) {
        progressTextEl.textContent = "You unlocked FREE Standard Delivery (Rs. 10,000+ order)!";
      } else {
        const remaining = threshold - subtotal;
        progressTextEl.textContent = `Add ${Utils.formatPKR(remaining)} more for FREE Standard Delivery.`;
      }
    }

    function renderCartSummary() {
      Storage.applyStockOverrides();
      const cart = Storage.getCart();

      if (!cart.length) {
        emptyStateEl.hidden = false;
        contentEl.hidden = true;
        return;
      }

      emptyStateEl.hidden = true;
      contentEl.hidden = false;

      const deliveryMethod = getSelectedRadioValue("deliveryMethod", "standard");
      const summary = Utils.calculateOrderSummary(cart, {
        shippingMethod: deliveryMethod,
        promoCode: state.appliedPromoCode
      });

      const stockCheck = validateCartStock(cart);

      // Render itemized cart lines
      const base = Utils.getBasePath();
      itemsListEl.innerHTML = stockCheck.resolvedItems
        .map(({ product, quantity }) => {
          const safeQty = Math.max(0, Math.floor(Number(quantity) || 0));
          const lineTotal = product.price * safeQty;
          const fallbackURI = getItemThumbFallback(product.category);
          let warningHTML = "";

          if (!Number.isInteger(quantity) || quantity < 1) {
            warningHTML = `<p class="summary-item-warning">Invalid quantity</p>`;
          } else if (product.stock <= 0) {
            warningHTML = `<p class="summary-item-warning">Out of stock</p>`;
          } else if (quantity > product.stock) {
            warningHTML = `<p class="summary-item-warning">Only ${product.stock} left in stock</p>`;
          }

          return `
            <li class="summary-item">
              <img
                src="${Utils.escapeHTML(base + product.image)}"
                alt="${Utils.escapeHTML(product.title)}"
                class="summary-item-thumb"
                data-fallback="${Utils.escapeHTML(fallbackURI)}"
                onerror="this.onerror=null;this.src=this.dataset.fallback;"
              >
              <div class="summary-item-info">
                <p class="summary-item-title">${Utils.escapeHTML(product.title)}</p>
                <p class="summary-item-meta">
                  ${Utils.escapeHTML(Utils.formatPKR(product.price))} &times; ${Utils.escapeHTML(safeQty)}
                </p>
                ${warningHTML}
              </div>
              <span class="summary-item-total">${Utils.escapeHTML(Utils.formatPKR(lineTotal))}</span>
            </li>
          `;
        })
        .join("");

      // Show or clear stock validation alert
      if (!stockCheck.valid) {
        stockAlertEl.innerHTML = stockCheck.issues.map(Utils.escapeHTML).join("<br>");
        stockAlertEl.hidden = false;
      } else {
        stockAlertEl.textContent = "";
        stockAlertEl.hidden = true;
      }

      // Update totals & delivery labels
      updateDeliveryCardLabels(summary.subtotal);
      updateShippingProgress(summary.subtotal);

      document.querySelector("#summary-item-count").textContent = String(summary.itemCount);
      document.querySelector("#summary-subtotal").textContent = Utils.formatPKR(summary.subtotal);

      const discountRow = document.querySelector("#summary-discount-row");
      if (summary.discount > 0 && summary.promo.valid) {
        discountRow.hidden = false;
        document.querySelector("#summary-promo-label").textContent = summary.promo.code;
        document.querySelector("#summary-discount").textContent = `- ${Utils.formatPKR(summary.discount)}`;
      } else {
        discountRow.hidden = true;
      }

      document.querySelector("#summary-method-label").textContent =
        DELIVERY_LABELS[deliveryMethod] || "Standard";
      document.querySelector("#summary-shipping").textContent =
        summary.shipping === 0 ? "Free" : Utils.formatPKR(summary.shipping);
      document.querySelector("#summary-total").textContent = Utils.formatPKR(summary.total);

      if (placeOrderBtn) {
        placeOrderBtn.disabled = !stockCheck.valid;
      }
    }

    /* --- 4. Promo Code Handlers --- */

    function handlePromoApply() {
      const cart = Storage.getCart();
      const deliveryMethod = getSelectedRadioValue("deliveryMethod", "standard");
      const currentSummary = Utils.calculateOrderSummary(cart, {
        shippingMethod: deliveryMethod
      });

      const codeInput = promoInputEl ? promoInputEl.value : "";
      const result = Utils.validatePromoCode(codeInput, currentSummary.subtotal);

      promoFeedbackEl.classList.remove("is-success", "is-error");

      if (result.valid) {
        state.appliedPromoCode = result.code;
        promoInputEl.value = result.code;
        promoFeedbackEl.textContent = result.message;
        promoFeedbackEl.classList.add("is-success");
        removePromoBtn.hidden = false;
        if (Components) Components.showToast(`Promo code ${result.code} applied.`);
      } else {
        state.appliedPromoCode = "";
        promoFeedbackEl.textContent = result.message;
        promoFeedbackEl.classList.add("is-error");
        removePromoBtn.hidden = true;
      }

      renderCartSummary();
    }

    function handlePromoRemove() {
      state.appliedPromoCode = "";
      if (promoInputEl) promoInputEl.value = "";
      promoFeedbackEl.textContent = "Promo code removed.";
      promoFeedbackEl.classList.remove("is-success", "is-error");
      removePromoBtn.hidden = true;
      renderCartSummary();
    }

    /* --- 5. Form Field Validation UI Helpers --- */

    function clearFieldErrors() {
      clearFormErrors(formEl, formAlertEl);
    }

    function showFieldErrors(errors) {
      applyFormErrors(
        formEl,
        formAlertEl,
        errors,
        "Please review and correct the highlighted fields before placing your demo order."
      );
    }

    /* --- 6. Submit Demo Order --- */

    function handleCheckoutSubmit(event) {
      event.preventDefault();
      clearFieldErrors();

      const cart = Storage.getCart();
      if (!cart.length) {
        renderCartSummary();
        return;
      }

      // 1) Validate form fields
      const formData = readProfileForm(formEl);

      const validation = Utils.validateCheckoutForm(formData);
      const deliveryMethod = getSelectedRadioValue("deliveryMethod", "");
      const paymentMethod = getSelectedRadioValue("paymentMethod", "");

      if (!DELIVERY_LABELS[deliveryMethod]) {
        validation.valid = false;
        validation.errors.deliveryMethod = "Please choose a delivery method.";
      }
      if (!PAYMENT_LABELS[paymentMethod]) {
        validation.valid = false;
        validation.errors.paymentMethod = "Please choose a demo payment method.";
      }

      if (!validation.valid) {
        showFieldErrors(validation.errors);
        return;
      }

      // 2) Re-validate cart quantities and live stock
      const stockCheck = validateCartStock(cart);
      if (!stockCheck.valid) {
        renderCartSummary();
        formAlertEl.textContent = "Please resolve the stock or quantity issues in your order summary.";
        formAlertEl.hidden = false;
        return;
      }

      // 3) Compute final pricing snapshot
      const summary = Utils.calculateOrderSummary(cart, {
        shippingMethod: deliveryMethod,
        promoCode: state.appliedPromoCode
      });

      const orderItems = stockCheck.resolvedItems.map(({ product, quantity }) => ({
        productId: product.id,
        title: product.title,
        category: product.category,
        region: product.region,
        artisanId: product.artisanId,
        unitPrice: product.price,
        quantity,
        lineTotal: product.price * quantity,
        image: product.image
      }));

      // 4) Persist customer profile if opted in
      if (formEl.elements.saveProfile && formEl.elements.saveProfile.checked) {
        Storage.saveCustomerProfile(formData);
      }

      // 5) Save demo order in localStorage (generates unique ID and ISO date)
      const createdOrder = Storage.createOrder({
        customer: formData,
        deliveryMethod,
        deliveryMethodLabel: DELIVERY_LABELS[deliveryMethod],
        paymentMethod,
        paymentMethodLabel: PAYMENT_LABELS[paymentMethod],
        promoCode: summary.promo.valid ? summary.promo.code : "",
        items: orderItems,
        pricing: {
          itemCount: summary.itemCount,
          subtotal: summary.subtotal,
          discount: summary.discount,
          shipping: summary.shipping,
          total: summary.total
        }
      });

      // 6) Deduct stock & clear cart
      Storage.deductStock(orderItems);
      Storage.clearCart();

      // 7) Redirect to order confirmation page
      root.location.href = `order-confirmation.html?orderId=${encodeURIComponent(createdOrder.id)}`;
    }

    /* --- 7. Event Listeners & Initial Render --- */

    formEl.addEventListener("change", (event) => {
      if (event.target.name === "deliveryMethod") {
        syncChoiceCardHighlight("deliveryMethod");
        renderCartSummary();
      } else if (event.target.name === "paymentMethod") {
        syncChoiceCardHighlight("paymentMethod");
      }
    });

    // Clear individual field error as user types
    bindFieldErrorClearOnInput(formEl);

    if (applyPromoBtn) {
      applyPromoBtn.addEventListener("click", handlePromoApply);
    }

    if (removePromoBtn) {
      removePromoBtn.addEventListener("click", handlePromoRemove);
    }

    if (promoInputEl) {
      promoInputEl.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          handlePromoApply();
        }
      });
    }

    formEl.addEventListener("submit", handleCheckoutSubmit);

    // Sync checkout view if cart changes elsewhere
    root.addEventListener("craftora:storage-change", (event) => {
      if (event.detail && event.detail.section === "cart") {
        renderCartSummary();
      }
    });

    prefillCustomerProfile();
    syncChoiceCardHighlight("deliveryMethod");
    syncChoiceCardHighlight("paymentMethod");
    renderCartSummary();
  }

  /* --- Order Confirmation Page Controller --- */

  function formatOrderDateTime(isoString) {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) return "Just now";
    return date.toLocaleString("en-PK", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  }

  function resolveConfirmationOrder() {
    const params = new URLSearchParams(root.location ? root.location.search : "");
    const requestedId = params.get("orderId");

    if (requestedId) {
      return Storage.getOrderById(requestedId);
    }

    const lastOrderId = Storage.getLastOrderId();
    if (lastOrderId) {
      const byLastId = Storage.getOrderById(lastOrderId);
      if (byLastId) return byLastId;
    }

    const orders = Storage.getOrders();
    return orders.length ? orders[0] : null;
  }

  function initOrderConfirmationPage() {
    const emptyStateEl = document.querySelector("#confirmation-empty-state");
    const contentEl = document.querySelector("#confirmation-content");
    if (!emptyStateEl || !contentEl) return;

    const order = resolveConfirmationOrder();
    if (!order) {
      emptyStateEl.hidden = false;
      contentEl.hidden = true;
      return;
    }

    emptyStateEl.hidden = true;
    contentEl.hidden = false;

    const base = Utils.getBasePath();
    const customer = order.customer || {};
    const pricing = order.pricing || {};
    const items = Array.isArray(order.items) ? order.items : [];

    // Order metadata
    document.querySelector("#conf-order-id").textContent = order.id || "—";
    document.querySelector("#conf-order-date").textContent = formatOrderDateTime(order.createdAt);
    document.querySelector("#conf-order-status").textContent = order.status || "Confirmed (Demo)";

    // Purchased items list
    const itemsEl = document.querySelector("#conf-items");
    itemsEl.innerHTML = items
      .map((item) => {
        const product = Data ? Data.getProductById(item.productId) : null;
        const category = item.category || (product ? product.category : "Craft");
        const imgPath = item.image || (product ? product.image : "");
        const fallbackURI = getItemThumbFallback(category);
        const qty = Number(item.quantity) || 1;
        const unitPrice = Number(item.unitPrice) || (product ? product.price : 0);
        const lineTotal = Number(item.lineTotal) || unitPrice * qty;

        return `
          <li class="summary-item">
            <img
              src="${Utils.escapeHTML(base + imgPath)}"
              alt="${Utils.escapeHTML(item.title || "Handcrafted item")}"
              class="summary-item-thumb"
              data-fallback="${Utils.escapeHTML(fallbackURI)}"
              onerror="this.onerror=null;this.src=this.dataset.fallback;"
            >
            <div class="summary-item-info">
              <p class="summary-item-title">${Utils.escapeHTML(item.title || "Handcrafted Item")}</p>
              <p class="summary-item-meta">
                ${Utils.escapeHTML(Utils.formatPKR(unitPrice))} &times; ${Utils.escapeHTML(qty)}
                ${item.region ? ` &bull; ${Utils.escapeHTML(item.region)}` : ""}
              </p>
            </div>
            <span class="summary-item-total">${Utils.escapeHTML(Utils.formatPKR(lineTotal))}</span>
          </li>
        `;
      })
      .join("");

    // Pricing breakdown
    const itemCount =
      pricing.itemCount || items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
    const subtotal = Number(pricing.subtotal) || 0;
    const discount = Number(pricing.discount) || 0;
    const shipping = Number(pricing.shipping) || 0;
    const total = Number(pricing.total) || Math.max(0, subtotal - discount) + shipping;
    const deliveryLabel =
      order.deliveryMethodLabel || DELIVERY_LABELS[order.deliveryMethod] || "Standard";

    document.querySelector("#conf-item-count").textContent = String(itemCount);
    document.querySelector("#conf-subtotal").textContent = Utils.formatPKR(subtotal);

    const discountRow = document.querySelector("#conf-discount-row");
    if (discount > 0) {
      discountRow.hidden = false;
      document.querySelector("#conf-promo-code").textContent = order.promoCode || "CRAFT10";
      document.querySelector("#conf-discount").textContent = `- ${Utils.formatPKR(discount)}`;
    } else {
      discountRow.hidden = true;
    }

    document.querySelector("#conf-delivery-label").textContent = deliveryLabel;
    document.querySelector("#conf-shipping").textContent =
      shipping === 0 ? "Free" : Utils.formatPKR(shipping);
    document.querySelector("#conf-total").textContent = Utils.formatPKR(total);

    // Customer contact & delivery address details
    const fullAddress = [
      customer.address,
      customer.city,
      customer.province,
      customer.postalCode
    ]
      .filter(Boolean)
      .join(", ");

    const customerDetailsEl = document.querySelector("#conf-customer-details");
    customerDetailsEl.innerHTML = `
      <div class="detail-row">
        <dt>Full Name</dt>
        <dd>${Utils.escapeHTML(customer.fullName || "—")}</dd>
      </div>
      <div class="detail-row">
        <dt>Email</dt>
        <dd>${Utils.escapeHTML(customer.email || "—")}</dd>
      </div>
      <div class="detail-row">
        <dt>Mobile</dt>
        <dd>${Utils.escapeHTML(customer.phone || "—")}</dd>
      </div>
      <div class="detail-row">
        <dt>Delivery Address</dt>
        <dd>${Utils.escapeHTML(fullAddress || "—")}</dd>
      </div>
      <div class="detail-row">
        <dt>Delivery Method</dt>
        <dd>${Utils.escapeHTML(deliveryLabel)} Delivery</dd>
      </div>
    `;

    // Demo payment method label
    const paymentLabel =
      order.paymentMethodLabel || PAYMENT_LABELS[order.paymentMethod] || "Demo Payment";
    document.querySelector("#conf-payment-method").textContent = paymentLabel;
    document.querySelector("#conf-payment-total").textContent = Utils.formatPKR(total);
  }

  /* --- Customer Dashboard Page Controller --- */

  function getInitials(name) {
    const cleaned = String(name || "").trim();
    if (!cleaned) return "CR";
    return cleaned
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  }

  function initCustomerDashboardPage() {
    const profileForm = document.querySelector("#profile-form");
    const profileFeedbackEl = document.querySelector("#profile-feedback");
    if (!profileForm) return;

    function renderProfileSummary() {
      const profile = Storage.getCustomerProfile();
      const welcomeEl = document.querySelector("#dashboard-welcome");
      const avatarEl = document.querySelector("#profile-avatar");
      const nameEl = document.querySelector("#summary-full-name");
      const locationEl = document.querySelector("#summary-location");
      const listEl = document.querySelector("#profile-summary-list");

      const hasName = Boolean(profile.fullName && profile.fullName.trim());
      if (welcomeEl) {
        welcomeEl.textContent = hasName
          ? `Welcome back, ${profile.fullName.trim()}! Review your saved details and local demo orders.`
          : "Welcome to your Craftora dashboard. Save your profile below for faster demo checkout.";
      }

      if (avatarEl) avatarEl.textContent = getInitials(profile.fullName);
      if (nameEl) nameEl.textContent = hasName ? profile.fullName : "Guest Customer";

      const cityProvince = [profile.city, profile.province].filter(Boolean).join(", ");
      if (locationEl) {
        locationEl.textContent = cityProvince || "No saved city or province yet";
      }

      if (listEl) {
        listEl.innerHTML = `
          <div class="detail-row">
            <dt>Email</dt>
            <dd>${Utils.escapeHTML(profile.email || "Not set")}</dd>
          </div>
          <div class="detail-row">
            <dt>Mobile</dt>
            <dd>${Utils.escapeHTML(profile.phone || "Not set")}</dd>
          </div>
          <div class="detail-row">
            <dt>Street Address</dt>
            <dd>${Utils.escapeHTML(profile.address || "Not set")}</dd>
          </div>
          <div class="detail-row">
            <dt>Postal Code</dt>
            <dd>${Utils.escapeHTML(profile.postalCode || "Not set")}</dd>
          </div>
        `;
      }
    }

    function renderStatsAndOrders() {
      const orders = Storage.getOrders();
      const wishlist = Storage.getWishlist();
      const cartCount = Storage.getCartCount();

      const totalOrders = orders.length;
      const totalSpend = orders.reduce((sum, order) => {
        const orderTotal = order && order.pricing ? Number(order.pricing.total) || 0 : 0;
        return sum + orderTotal;
      }, 0);

      document.querySelector("#stat-total-orders").textContent = String(totalOrders);
      document.querySelector("#stat-total-spend").textContent = Utils.formatPKR(totalSpend);
      document.querySelector("#stat-wishlist-count").textContent = String(wishlist.length);
      document.querySelector("#stat-cart-count").textContent = String(cartCount);

      document.querySelector("#shortcut-cart-count").textContent = String(cartCount);
      document.querySelector("#shortcut-wishlist-count").textContent = String(wishlist.length);
      document.querySelector("#shortcut-orders-count").textContent = String(totalOrders);

      // Latest order card
      const latestContainer = document.querySelector("#latest-order-container");
      if (latestContainer) {
        if (!orders.length) {
          latestContainer.innerHTML = `
            <div class="dashboard-empty-box">
              <p>No demo orders placed yet. Explore Pakistani handicrafts to place your first demo order.</p>
              <a href="marketplace.html" class="btn btn-primary btn-sm">Browse Handicrafts</a>
            </div>
          `;
        } else {
          const latest = orders[0];
          const itemCount =
            (latest.pricing && latest.pricing.itemCount) ||
            (Array.isArray(latest.items)
              ? latest.items.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0)
              : 0);
          const total = latest.pricing ? Number(latest.pricing.total) || 0 : 0;

          latestContainer.innerHTML = `
            <div class="latest-order-box">
              <div class="latest-order-top">
                <strong>${Utils.escapeHTML(latest.id)}</strong>
                <span class="badge badge-success">${Utils.escapeHTML(latest.status || "Confirmed (Demo)")}</span>
              </div>
              <dl class="detail-list">
                <div class="detail-row">
                  <dt>Date</dt>
                  <dd>${Utils.escapeHTML(formatOrderDateTime(latest.createdAt))}</dd>
                </div>
                <div class="detail-row">
                  <dt>Items</dt>
                  <dd>${Utils.escapeHTML(itemCount)} item(s)</dd>
                </div>
                <div class="detail-row">
                  <dt>Demo Total</dt>
                  <dd>${Utils.escapeHTML(Utils.formatPKR(total))}</dd>
                </div>
              </dl>
              <div>
                <a href="order-confirmation.html?orderId=${encodeURIComponent(latest.id)}" class="btn btn-outline btn-sm">
                  View Demo Receipt
                </a>
              </div>
            </div>
          `;
        }
      }

      // Recent orders list (up to 5 most recent)
      const recentContainer = document.querySelector("#recent-orders-container");
      if (recentContainer) {
        if (!orders.length) {
          recentContainer.innerHTML = `
            <div class="dashboard-empty-box">
              <p>Your recent demo order history will appear here once an order is placed.</p>
            </div>
          `;
        } else {
          const recentListHTML = orders
            .slice(0, 5)
            .map((order) => {
              const total = order.pricing ? Number(order.pricing.total) || 0 : 0;
              const count = Array.isArray(order.items) ? order.items.length : 0;
              return `
                <li class="recent-order-item">
                  <div>
                    <strong>${Utils.escapeHTML(order.id)}</strong>
                    <p class="recent-order-meta">
                      ${Utils.escapeHTML(Utils.formatDate(order.createdAt))} &bull; ${Utils.escapeHTML(count)} product line(s)
                    </p>
                  </div>
                  <div class="recent-order-right">
                    <strong>${Utils.escapeHTML(Utils.formatPKR(total))}</strong>
                    <a href="order-confirmation.html?orderId=${encodeURIComponent(order.id)}" class="btn btn-outline btn-sm">
                      Receipt
                    </a>
                  </div>
                </li>
              `;
            })
            .join("");

          recentContainer.innerHTML = `<ul class="recent-orders-list">${recentListHTML}</ul>`;
        }
      }
    }

    function handleProfileSave(event) {
      event.preventDefault();
      clearFormErrors(profileForm, profileFeedbackEl);

      const formData = readProfileForm(profileForm);
      const validation = Utils.validateCheckoutForm(formData);

      if (!validation.valid) {
        applyFormErrors(
          profileForm,
          profileFeedbackEl,
          validation.errors,
          "Please fix the highlighted profile fields before saving."
        );
        return;
      }

      Storage.saveCustomerProfile(formData);
      renderProfileSummary();

      if (profileFeedbackEl) {
        profileFeedbackEl.classList.remove("alert-error");
        profileFeedbackEl.classList.add("alert-success");
        profileFeedbackEl.textContent = "Profile saved locally! Checkout will pre-fill these details.";
        profileFeedbackEl.hidden = false;
      }

      if (Components) {
        Components.showToast("Customer profile saved.");
      }
    }

    populateProfileForm(profileForm, Storage.getCustomerProfile());
    bindFieldErrorClearOnInput(profileForm);
    profileForm.addEventListener("submit", handleProfileSave);

    root.addEventListener("craftora:storage-change", () => {
      renderStatsAndOrders();
      renderProfileSummary();
    });

    renderProfileSummary();
    renderStatsAndOrders();
  }

  /* --- Page Router (data-page attribute) --- */
  function initMember4Pages() {
    const page = document.body ? document.body.dataset.page : "";
    if (page === "checkout") {
      initCheckoutPage();
    } else if (page === "order-confirmation") {
      initOrderConfirmationPage();
    } else if (page === "customer-dashboard") {
      initCustomerDashboardPage();
    }
  }

  if (typeof document !== "undefined") {
    document.addEventListener("DOMContentLoaded", initMember4Pages);
  }

  root.CraftoraMember4 = {
    initCheckoutPage,
    initOrderConfirmationPage,
    initCustomerDashboardPage
  };
})(typeof window !== "undefined" ? window : globalThis);
