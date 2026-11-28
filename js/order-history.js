/* ==========================================================================
   Craftora - Order History Page Script (Page 13)
   Manages sample orders, status filtering (All / Pending / Delivered),
   visible order counts, and accessible order card rendering.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const SAMPLE_ORDERS = [
    {
      id: "CRF-2026-1042",
      item: "Multani Blue Pottery Serving Bowl (Set of 2)",
      artisan: "Multan Clay Studio",
      quantity: 1,
      date: "Nov 24, 2026",
      price: 4850,
      status: "Pending"
    },
    {
      id: "CRF-2026-1041",
      item: "Hand-Painted Camel Bone Jewelry Box",
      artisan: "Bahawalpur Heritage Crafts",
      quantity: 1,
      date: "Nov 22, 2026",
      price: 3400,
      status: "Pending"
    },
    {
      id: "CRF-2026-1039",
      item: "Sindhi Ajrak Block-Printed Cotton Runner",
      artisan: "Bhitshah Indigo Looms",
      quantity: 2,
      date: "Nov 18, 2026",
      price: 5600,
      status: "Pending"
    },
    {
      id: "CRF-2026-1038",
      item: "Glazed Terracotta Chai Kulhad Set (4 pcs)",
      artisan: "Multan Clay Studio",
      quantity: 1,
      date: "Nov 12, 2026",
      price: 1950,
      status: "Delivered"
    },
    {
      id: "CRF-2026-1033",
      item: "Carved Sheesham Wood Spice Chest",
      artisan: "Chiniot Woodcraft Guild",
      quantity: 1,
      date: "Nov 04, 2026",
      price: 7200,
      status: "Delivered"
    },
    {
      id: "CRF-2026-1027",
      item: "Hand-Loomed Swat Merino Wool Throw",
      artisan: "Mingora Loom Collective",
      quantity: 1,
      date: "Oct 26, 2026",
      price: 9500,
      status: "Delivered"
    }
  ];

  const ordersGrid = document.getElementById("orders-grid");
  const ordersEmpty = document.getElementById("orders-empty");
  const orderCountEl = document.getElementById("order-count");
  const filterButtons = Array.from(document.querySelectorAll(".filter-btn[data-filter]"));
  const filterCountBadges = Array.from(document.querySelectorAll("[data-count-for]"));

  if (!ordersGrid || !orderCountEl) return;

  let activeFilter = "all";

  function formatRupees(amount) {
    return `Rs. ${amount.toLocaleString("en-PK")}`;
  }

  function filterOrders(orders, filter) {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status.toLowerCase() === filter);
  }

  function updateFilterBadges(orders) {
    const counts = {
      all: orders.length,
      pending: orders.filter((order) => order.status === "Pending").length,
      delivered: orders.filter((order) => order.status === "Delivered").length
    };

    filterCountBadges.forEach((badge) => {
      const key = badge.getAttribute("data-count-for");
      if (key && Object.prototype.hasOwnProperty.call(counts, key)) {
        badge.textContent = String(counts[key]);
      }
    });
  }

  function updateOrderCountText(visibleCount, totalCount, filter) {
    const noun = visibleCount === 1 ? "order" : "orders";
    if (filter === "all") {
      orderCountEl.textContent = `Showing ${visibleCount} ${noun}`;
      return;
    }

    const label = filter.charAt(0).toUpperCase() + filter.slice(1);
    orderCountEl.textContent = `Showing ${visibleCount} ${label} ${noun} of ${totalCount}`;
  }

  function updateFilterButtons() {
    filterButtons.forEach((btn) => {
      const isSelected = btn.getAttribute("data-filter") === activeFilter;
      btn.classList.toggle("is-active", isSelected);
      btn.setAttribute("aria-pressed", String(isSelected));
    });
  }

  function createMetaColumn(labelText, valueText, isPrice = false) {
    const wrapper = document.createElement("div");
    wrapper.className = "order-meta-item";

    const label = document.createElement("dt");
    label.className = "order-meta-label";
    label.textContent = labelText;

    const value = document.createElement("dd");
    value.className = isPrice
      ? "order-meta-value order-meta-value--price"
      : "order-meta-value";
    value.textContent = valueText;

    wrapper.append(label, value);
    return wrapper;
  }

  function createOrderCard(order) {
    const statusKey = order.status.toLowerCase();

    const card = document.createElement("article");
    card.className = `order-card order-card--${statusKey}`;

    const header = document.createElement("div");
    header.className = "order-card-header";

    const ref = document.createElement("span");
    ref.className = "order-reference";
    ref.textContent = `#${order.id}`;

    const badge = document.createElement("span");
    badge.className = `status-badge status-badge--${statusKey}`;
    badge.textContent = order.status;

    header.append(ref, badge);

    const body = document.createElement("div");
    body.className = "order-card-body";

    const itemTitle = document.createElement("h3");
    itemTitle.className = "order-item-name";
    itemTitle.textContent = order.item;

    const artisanMeta = document.createElement("p");
    artisanMeta.className = "order-artisan-meta";
    const qtyLabel = order.quantity > 1 ? `Qty: ${order.quantity}` : "Qty: 1";
    artisanMeta.textContent = `${order.artisan} · ${qtyLabel}`;

    body.append(itemTitle, artisanMeta);

    const details = document.createElement("dl");
    details.className = "order-meta-grid";
    details.append(
      createMetaColumn("Order Date", order.date),
      createMetaColumn("Price", formatRupees(order.price), true)
    );

    card.append(header, body, details);
    return card;
  }

  function render() {
    const visibleOrders = filterOrders(SAMPLE_ORDERS, activeFilter);

    ordersGrid.replaceChildren();
    visibleOrders.forEach((order) => {
      ordersGrid.appendChild(createOrderCard(order));
    });

    if (ordersEmpty) {
      ordersEmpty.hidden = visibleOrders.length > 0;
    }

    updateFilterButtons();
    updateOrderCountText(visibleOrders.length, SAMPLE_ORDERS.length, activeFilter);
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const nextFilter = button.getAttribute("data-filter");
      if (!nextFilter || nextFilter === activeFilter) return;
      activeFilter = nextFilter;
      render();
    });
  });

  updateFilterBadges(SAMPLE_ORDERS);
  render();
});
