/* ==========================================================================
   Craftora - Artisan Dashboard Page Script (Page 15)
   Uses one sample dataset for My Products and Recent Orders and computes all
   Shop Overview totals directly from those displayed items.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const SAMPLE_PRODUCTS = [
    {
      name: "Multani Blue Pottery Serving Bowl (Set of 2)",
      category: "Pottery & Ceramics",
      price: 4850,
      status: "Active"
    },
    {
      name: "Hand-Painted Camel Bone Jewelry Box",
      category: "Heritage Keepsakes",
      price: 3400,
      status: "Active"
    },
    {
      name: "Glazed Terracotta Chai Kulhad Set (4 pcs)",
      category: "Tableware",
      price: 1950,
      status: "Low Stock"
    },
    {
      name: "Carved Sheesham Wood Spice Chest",
      category: "Woodwork & Carving",
      price: 7200,
      status: "Out of Stock"
    }
  ];

  const SAMPLE_ORDERS = [
    {
      orderNumber: "#CRF-2026-1042",
      item: "Multani Blue Pottery Serving Bowl (Set of 2)",
      date: "Nov 24, 2026",
      amount: 4850,
      status: "Pending"
    },
    {
      orderNumber: "#CRF-2026-1041",
      item: "Hand-Painted Camel Bone Jewelry Box",
      date: "Nov 22, 2026",
      amount: 3400,
      status: "Pending"
    },
    {
      orderNumber: "#CRF-2026-1038",
      item: "Glazed Terracotta Chai Kulhad Set (4 pcs)",
      date: "Nov 12, 2026",
      amount: 1950,
      status: "Delivered"
    },
    {
      orderNumber: "#CRF-2026-1033",
      item: "Carved Sheesham Wood Spice Chest",
      date: "Nov 04, 2026",
      amount: 7200,
      status: "Delivered"
    }
  ];

  const totalProductsEl = document.getElementById("overview-total-products");
  const productsNoteEl = document.getElementById("overview-products-note");
  const pendingOrdersEl = document.getElementById("overview-pending-orders");
  const deliveredOrdersEl = document.getElementById("overview-delivered-orders");
  const totalRevenueEl = document.getElementById("overview-total-revenue");
  const ordersNoteEl = document.getElementById("overview-orders-note");
  const productsListEl = document.getElementById("products-list");
  const ordersListEl = document.getElementById("orders-list");

  function formatRupees(amount) {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
  }

  function toStatusModifier(status) {
    return `status-pill--${status.toLowerCase().replace(/\s+/g, "-")}`;
  }

  function renderProducts(products) {
    if (!productsListEl) return;
    productsListEl.replaceChildren();

    products.forEach((product) => {
      const row = document.createElement("li");
      row.className = "record-row";

      const main = document.createElement("div");
      main.className = "record-main";

      const title = document.createElement("h3");
      title.className = "record-title";
      title.textContent = product.name;

      const meta = document.createElement("p");
      meta.className = "record-meta";
      meta.textContent = product.category;

      main.append(title, meta);

      const side = document.createElement("div");
      side.className = "record-side";

      const price = document.createElement("span");
      price.className = "record-price";
      price.textContent = formatRupees(product.price);

      const badge = document.createElement("span");
      badge.className = `status-pill ${toStatusModifier(product.status)}`;
      badge.textContent = product.status;

      side.append(price, badge);
      row.append(main, side);
      productsListEl.appendChild(row);
    });
  }

  function renderOrders(orders) {
    if (!ordersListEl) return;
    ordersListEl.replaceChildren();

    orders.forEach((order) => {
      const row = document.createElement("li");
      row.className = "record-row";

      const main = document.createElement("div");
      main.className = "record-main";

      const title = document.createElement("h3");
      title.className = "record-title record-title--order";
      title.textContent = order.orderNumber;

      const meta = document.createElement("p");
      meta.className = "record-meta";
      meta.textContent = `${order.item} · ${order.date}`;

      main.append(title, meta);

      const side = document.createElement("div");
      side.className = "record-side";

      const amount = document.createElement("span");
      amount.className = "record-price";
      amount.textContent = formatRupees(order.amount);

      const badge = document.createElement("span");
      badge.className = `status-pill ${toStatusModifier(order.status)}`;
      badge.textContent = order.status;

      side.append(amount, badge);
      row.append(main, side);
      ordersListEl.appendChild(row);
    });
  }

  function renderOverview(products, orders) {
    const totalProducts = products.length;
    const activeProducts = products.filter((item) => item.status === "Active").length;
    const pendingOrders = orders.filter((order) => order.status === "Pending").length;
    const deliveredOrders = orders.filter((order) => order.status === "Delivered").length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.amount, 0);

    if (totalProductsEl) {
      totalProductsEl.textContent = String(totalProducts);
    }

    if (productsNoteEl) {
      productsNoteEl.textContent = `${activeProducts} active across ${totalProducts} sample products`;
    }

    if (pendingOrdersEl) {
      pendingOrdersEl.textContent = String(pendingOrders);
    }

    if (deliveredOrdersEl) {
      deliveredOrdersEl.textContent = String(deliveredOrders);
    }

    if (totalRevenueEl) {
      totalRevenueEl.textContent = formatRupees(totalRevenue);
    }

    if (ordersNoteEl) {
      ordersNoteEl.textContent = `Across ${orders.length} sample orders shown below`;
    }
  }

  renderProducts(SAMPLE_PRODUCTS);
  renderOrders(SAMPLE_ORDERS);
  renderOverview(SAMPLE_PRODUCTS, SAMPLE_ORDERS);
});
