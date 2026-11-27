/* ==========================================================================
   Craftora - Order History Page Script (Page 13)
   Handles status filtering (All, Pending, Delivered) and order counts.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  const orderCards = document.querySelectorAll(".order-card");
  const ordersCount = document.getElementById("orders-count");
  const emptyState = document.getElementById("orders-empty");

  if (!filterButtons.length || !orderCards.length) return;

  function applyOrderFilter(selectedStatus) {
    let visibleCount = 0;

    orderCards.forEach((card) => {
      const cardStatus = card.dataset.status;
      const shouldShow = selectedStatus === "all" || cardStatus === selectedStatus;
      card.hidden = !shouldShow;
      if (shouldShow) {
        visibleCount += 1;
      }
    });

    if (ordersCount) {
      const label = visibleCount === 1 ? "order" : "orders";
      ordersCount.textContent = `Showing ${visibleCount} ${label}`;
    }

    if (emptyState) {
      emptyState.hidden = visibleCount > 0;
    }
  }

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const selectedStatus = button.dataset.filter || "all";

      filterButtons.forEach((btn) => {
        const isActive = btn === button;
        btn.classList.toggle("active", isActive);
        btn.setAttribute("aria-pressed", String(isActive));
      });

      applyOrderFilter(selectedStatus);
    });
  });

  applyOrderFilter("all");
});
