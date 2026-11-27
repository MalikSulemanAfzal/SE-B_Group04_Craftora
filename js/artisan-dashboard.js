/* ==========================================================================
   Craftora - Artisan Dashboard Page Script (Page 15)
   Single source of truth for sample artisan products, recent orders, and counts.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const sampleProducts = [
    {
      name: "Multani Blue Pottery Serving Bowl (Set of 2)",
      category: "Pottery & Ceramics",
      priceRupees: 4850,
      status: "Active"
    },
    {
      name: "Hand-Painted Camel Bone Jewelry Box",
      category: "Heritage Keepsakes",
      priceRupees: 3400,
      status: "Active"
    },
    {
      name: "Glazed Terracotta Chai Kulhad Set (4 pcs)",
      category: "Tableware",
      priceRupees: 1950,
      status: "Low Stock"
    },
    {
      name: "Carved Sheesham Wood Spice Chest",
      category: "Woodwork & Carving",
      priceRupees: 7200,
      status: "Out of Stock"
    }
  ];

  const sampleOrders = [
    {
      orderNumber: "#CRF-2026-1042",
      summary: "Multani Blue Pottery Serving Bowl (Set of 2) · Nov 24, 2026",
      status: "Pending"
    },
    {
      orderNumber: "#CRF-2026-1041",
      summary: "Hand-Painted Camel Bone Jewelry Box · Nov 22, 2026",
      status: "Pending"
    },
    {
      orderNumber: "#CRF-2026-1038",
      summary: "Glazed Terracotta Chai Kulhad Set (4 pcs) · Nov 12, 2026",
      status: "Delivered"
    },
    {
      orderNumber: "#CRF-2026-1033",
      summary: "Carved Sheesham Wood Spice Chest · Nov 04, 2026",
      status: "Delivered"
    }
  ];

  const totalProductsEl = document.getElementById("total-products-count");
  const pendingOrdersEl = document.getElementById("pending-orders-count");
  const productsListEl = document.getElementById("my-products-list");
  const ordersListEl = document.getElementById("recent-orders-list");

  function statusClassName(status) {
    return `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
  }

  function formatRupees(amount) {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
  }

  function renderProducts(products) {
    if (!productsListEl) return;
    productsListEl.replaceChildren();

    products.forEach((product) => {
      const item = document.createElement("li");
      item.className = "product-row";

      const main = document.createElement("div");
      main.className = "product-main";

      const title = document.createElement("h3");
      title.className = "item-title";
      title.textContent = product.name;

      const meta = document.createElement("p");
      meta.className = "item-meta";
      meta.textContent = product.category;

      main.append(title, meta);

      const side = document.createElement("div");
      side.className = "product-side";

      const price = document.createElement("span");
      price.className = "item-price";
      price.textContent = formatRupees(product.priceRupees);

      const badge = document.createElement("span");
      badge.className = `status-badge ${statusClassName(product.status)}`;
      badge.textContent = product.status;

      side.append(price, badge);
      item.append(main, side);
      productsListEl.appendChild(item);
    });
  }

  function renderOrders(orders) {
    if (!ordersListEl) return;
    ordersListEl.replaceChildren();

    orders.forEach((order) => {
      const item = document.createElement("li");
      item.className = "order-row";

      const main = document.createElement("div");
      main.className = "order-main";

      const title = document.createElement("h3");
      title.className = "item-title order-number";
      title.textContent = order.orderNumber;

      const meta = document.createElement("p");
      meta.className = "item-meta";
      meta.textContent = order.summary;

      main.append(title, meta);

      const badge = document.createElement("span");
      badge.className = `status-badge ${statusClassName(order.status)}`;
      badge.textContent = order.status;

      item.append(main, badge);
      ordersListEl.appendChild(item);
    });
  }

  renderProducts(sampleProducts);
  renderOrders(sampleOrders);

  if (totalProductsEl) {
    totalProductsEl.textContent = String(sampleProducts.length);
  }

  if (pendingOrdersEl) {
    const pendingCount = sampleOrders.filter((order) => order.status === "Pending").length;
    pendingOrdersEl.textContent = String(pendingCount);
  }
});
