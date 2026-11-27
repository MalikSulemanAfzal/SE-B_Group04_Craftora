/* ==========================================================================
   Craftora - Marketplace Controller (pages/marketplace.html)
   Handles multi-faceted filtering (Search, Categories, Price, Rating, Artisan,
   Location), sorting, active filter chips, load more pagination, empty state,
   mobile drawer, and syncing with shared Craftora cart/wishlist.
   ========================================================================== */

(function () {
  "use strict";

  const PAGE_SIZE = 6;

  // Filter & View State
  const state = {
    search: "",
    selectedCategories: new Set(),
    minPrice: null,
    maxPrice: null,
    minRating: null,
    artisanId: "all",
    location: "all",
    sortBy: "featured",
    visibleLimit: PAGE_SIZE,
    filteredProducts: []
  };

  // DOM Elements
  let searchInput = null;
  let searchClearBtn = null;
  let categoryListEl = null;
  let minPriceInput = null;
  let maxPriceInput = null;
  let priceApplyBtn = null;
  let ratingRadios = [];
  let artisanSelect = null;
  let locationSelect = null;
  let sortSelect = null;
  let resultsCountEl = null;
  let activeChipsBar = null;
  let productsGrid = null;
  let emptyStateEl = null;
  let resetFromEmptyBtn = null;
  let clearAllSidebarBtn = null;
  let loadMoreWrap = null;
  let loadMoreBtn = null;
  let paginationStatusEl = null;
  let mobileFilterBtn = null;
  let mobileFilterBadge = null;
  let filterSidebar = null;
  let filterBackdrop = null;
  let filterDrawerCloseBtn = null;

  function init() {
    const data = window.CraftoraData;
    const ui = window.CraftoraUI;
    if (!data || !ui) {
      console.error("Craftora data or UI manager not loaded.");
      return;
    }

    cacheDomElements();
    populateCategoryCheckboxes();
    populateArtisanDropdown();
    populateLocationDropdown();
    readUrlParams();
    bindEvents();
    applyFiltersAndRender();
    initHeaderActionModals();
  }

  function cacheDomElements() {
    searchInput = document.getElementById("marketplace-search");
    searchClearBtn = document.getElementById("search-clear-btn");
    categoryListEl = document.getElementById("category-checkbox-list");
    minPriceInput = document.getElementById("price-min");
    maxPriceInput = document.getElementById("price-max");
    priceApplyBtn = document.getElementById("price-apply-btn");
    ratingRadios = Array.from(document.querySelectorAll('input[name="rating-filter"]'));
    artisanSelect = document.getElementById("filter-artisan-select");
    locationSelect = document.getElementById("filter-location-select");
    sortSelect = document.getElementById("sort-select");
    resultsCountEl = document.getElementById("results-count-text");
    activeChipsBar = document.getElementById("active-filters-bar");
    productsGrid = document.getElementById("marketplace-products-grid");
    emptyStateEl = document.getElementById("marketplace-empty-state");
    resetFromEmptyBtn = document.getElementById("reset-empty-btn");
    clearAllSidebarBtn = document.getElementById("clear-sidebar-filters");
    loadMoreWrap = document.getElementById("load-more-container");
    loadMoreBtn = document.getElementById("load-more-btn");
    paginationStatusEl = document.getElementById("pagination-status");
    mobileFilterBtn = document.getElementById("mobile-filter-trigger");
    mobileFilterBadge = document.getElementById("mobile-filter-count-badge");
    filterSidebar = document.getElementById("filter-sidebar");
    filterBackdrop = document.getElementById("filter-backdrop");
    filterDrawerCloseBtn = document.getElementById("filter-drawer-close");
  }

  // 1. Populate category checkboxes dynamically matching the 9 official categories
  function populateCategoryCheckboxes() {
    if (!categoryListEl) return;
    const data = window.CraftoraData;
    categoryListEl.innerHTML = "";

    data.categories.forEach((cat) => {
      // Calculate count of items matching this category
      const count = data.products.filter((p) => {
        return (
          p.category === cat.id ||
          (p.categoryAliases && p.categoryAliases.includes(cat.id)) ||
          p.categoryLabel === cat.name
        );
      }).length;

      const label = document.createElement("label");
      label.className = "filter-checkbox-label";
      label.setAttribute("for", "cat-check-" + cat.id);
      label.innerHTML = `
        <span class="filter-checkbox-left">
          <input
            type="checkbox"
            id="cat-check-${cat.id}"
            class="filter-checkbox-input js-category-checkbox"
            value="${cat.id}"
            data-category-name="${cat.name}"
          >
          <span>${cat.name}</span>
        </span>
        <span class="filter-checkbox-count">${count}</span>
      `;
      categoryListEl.appendChild(label);
    });
  }

  // 2. Populate Artisan dropdown (a001 - a006)
  function populateArtisanDropdown() {
    if (!artisanSelect) return;
    const data = window.CraftoraData;
    artisanSelect.innerHTML = `<option value="all">All Artisans (a001–a006)</option>`;

    data.artisans.forEach((artisan) => {
      const option = document.createElement("option");
      option.value = artisan.id;
      option.textContent = `${artisan.name} (${artisan.craft} &middot; ${artisan.city})`;
      artisanSelect.appendChild(option);
    });
  }

  // 3. Populate Location dropdown
  function populateLocationDropdown() {
    if (!locationSelect) return;
    const data = window.CraftoraData;
    const locations = Array.from(
      new Set(data.products.map((p) => p.origin).filter(Boolean))
    ).sort();

    locationSelect.innerHTML = `<option value="all">All Craft Origins</option>`;
    locations.forEach((loc) => {
      const option = document.createElement("option");
      option.value = loc;
      option.textContent = loc;
      locationSelect.appendChild(option);
    });
  }

  // 4. Read initial URL query parameters
  function readUrlParams() {
    const data = window.CraftoraData;
    const params = new URLSearchParams(window.location.search);

    // Category query param (e.g. ?category=ajrak-textiles or ?category=pottery)
    const catQuery = params.get("category");
    if (catQuery) {
      const matchedCat = data.getCategoryById(catQuery);
      if (matchedCat) {
        state.selectedCategories.add(matchedCat.id);
      } else {
        // Direct matching
        state.selectedCategories.add(catQuery.toLowerCase());
      }
    }

    // Search query param (e.g. ?q=vase or ?search=khussa)
    const searchQuery = params.get("search") || params.get("q");
    if (searchQuery) {
      state.search = searchQuery.trim();
      if (searchInput) {
        searchInput.value = state.search;
      }
    }

    // Artisan query param (e.g. ?artisan=a001)
    const artisanQuery = params.get("artisan");
    if (artisanQuery) {
      state.artisanId = artisanQuery;
      if (artisanSelect) {
        artisanSelect.value = artisanQuery;
      }
    }

    // Location query param (e.g. ?location=Multan)
    const locQuery = params.get("location");
    if (locQuery) {
      state.location = locQuery;
      if (locationSelect) {
        locationSelect.value = locQuery;
      }
    }

    // Min & Max Price query params
    const minP = params.get("minPrice");
    if (minP && !isNaN(Number(minP))) {
      state.minPrice = Number(minP);
      if (minPriceInput) minPriceInput.value = state.minPrice;
    }
    const maxP = params.get("maxPrice");
    if (maxP && !isNaN(Number(maxP))) {
      state.maxPrice = Number(maxP);
      if (maxPriceInput) maxPriceInput.value = state.maxPrice;
    }

    // Rating query param
    const ratingQuery = params.get("rating");
    if (ratingQuery && !isNaN(Number(ratingQuery))) {
      state.minRating = Number(ratingQuery);
    }

    // Sort query param
    const sortQuery = params.get("sort");
    if (sortQuery) {
      state.sortBy = sortQuery;
      if (sortSelect) sortSelect.value = sortQuery;
    }

    // Synchronize UI checkboxes with state
    syncCategoryCheckboxesFromState();
    syncRatingRadiosFromState();
  }

  function syncCategoryCheckboxesFromState() {
    document.querySelectorAll(".js-category-checkbox").forEach((cb) => {
      cb.checked = state.selectedCategories.has(cb.value);
    });
  }

  function syncRatingRadiosFromState() {
    ratingRadios.forEach((radio) => {
      if (state.minRating === null && radio.value === "all") {
        radio.checked = true;
      } else if (state.minRating !== null && Number(radio.value) === state.minRating) {
        radio.checked = true;
      }
    });
  }

  // 5. Event Binding
  function bindEvents() {
    // Search input with debounce
    let searchTimer = null;
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        clearTimeout(searchTimer);
        const val = searchInput.value.trim();
        if (searchClearBtn) {
          searchClearBtn.classList.toggle("is-visible", Boolean(val));
        }
        searchTimer = setTimeout(() => {
          state.search = val;
          state.visibleLimit = PAGE_SIZE;
          applyFiltersAndRender();
        }, 220);
      });
    }

    // Search clear button
    if (searchClearBtn) {
      searchClearBtn.addEventListener("click", () => {
        if (searchInput) {
          searchInput.value = "";
          searchInput.focus();
        }
        searchClearBtn.classList.remove("is-visible");
        state.search = "";
        state.visibleLimit = PAGE_SIZE;
        applyFiltersAndRender();
      });
    }

    // Category checkboxes
    if (categoryListEl) {
      categoryListEl.addEventListener("change", (e) => {
        const target = e.target.closest(".js-category-checkbox");
        if (!target) return;
        if (target.checked) {
          state.selectedCategories.add(target.value);
        } else {
          state.selectedCategories.delete(target.value);
        }
        state.visibleLimit = PAGE_SIZE;
        applyFiltersAndRender();
      });
    }

    // Price Apply button & Enter key
    if (priceApplyBtn) {
      priceApplyBtn.addEventListener("click", applyPriceInputs);
    }
    if (minPriceInput) {
      minPriceInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyPriceInputs();
        }
      });
    }
    if (maxPriceInput) {
      maxPriceInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          applyPriceInputs();
        }
      });
    }

    // Rating radios
    ratingRadios.forEach((radio) => {
      radio.addEventListener("change", () => {
        if (radio.value === "all") {
          state.minRating = null;
        } else {
          state.minRating = Number(radio.value);
        }
        state.visibleLimit = PAGE_SIZE;
        applyFiltersAndRender();
      });
    });

    // Artisan select
    if (artisanSelect) {
      artisanSelect.addEventListener("change", () => {
        state.artisanId = artisanSelect.value;
        state.visibleLimit = PAGE_SIZE;
        applyFiltersAndRender();
      });
    }

    // Location select
    if (locationSelect) {
      locationSelect.addEventListener("change", () => {
        state.location = locationSelect.value;
        state.visibleLimit = PAGE_SIZE;
        applyFiltersAndRender();
      });
    }

    // Sort select
    if (sortSelect) {
      sortSelect.addEventListener("change", () => {
        state.sortBy = sortSelect.value;
        applyFiltersAndRender();
      });
    }

    // Clear filters buttons
    if (clearAllSidebarBtn) {
      clearAllSidebarBtn.addEventListener("click", resetAllFilters);
    }
    if (resetFromEmptyBtn) {
      resetFromEmptyBtn.addEventListener("click", resetAllFilters);
    }

    // Load More button
    if (loadMoreBtn) {
      loadMoreBtn.addEventListener("click", () => {
        state.visibleLimit += PAGE_SIZE;
        renderProductGrid();
      });
    }

    // Mobile drawer toggle & close
    if (mobileFilterBtn && filterSidebar && filterBackdrop) {
      mobileFilterBtn.addEventListener("click", () => {
        openMobileSidebar();
      });
      filterBackdrop.addEventListener("click", () => {
        closeMobileSidebar();
      });
      if (filterDrawerCloseBtn) {
        filterDrawerCloseBtn.addEventListener("click", () => {
          closeMobileSidebar();
        });
      }
    }
  }

  function openMobileSidebar() {
    if (filterSidebar) filterSidebar.classList.add("is-open");
    if (filterBackdrop) filterBackdrop.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  function closeMobileSidebar() {
    if (filterSidebar) filterSidebar.classList.remove("is-open");
    if (filterBackdrop) filterBackdrop.classList.remove("is-open");
    document.body.style.overflow = "";
  }

  function applyPriceInputs() {
    const minVal = minPriceInput ? minPriceInput.value.trim() : "";
    const maxVal = maxPriceInput ? maxPriceInput.value.trim() : "";

    state.minPrice = minVal !== "" && !isNaN(Number(minVal)) ? Number(minVal) : null;
    state.maxPrice = maxVal !== "" && !isNaN(Number(maxVal)) ? Number(maxVal) : null;

    if (state.minPrice !== null && state.maxPrice !== null && state.minPrice > state.maxPrice) {
      // Auto swap if inverted
      const temp = state.minPrice;
      state.minPrice = state.maxPrice;
      state.maxPrice = temp;
      if (minPriceInput) minPriceInput.value = state.minPrice;
      if (maxPriceInput) maxPriceInput.value = state.maxPrice;
    }

    state.visibleLimit = PAGE_SIZE;
    applyFiltersAndRender();
  }

  function resetAllFilters() {
    state.search = "";
    state.selectedCategories.clear();
    state.minPrice = null;
    state.maxPrice = null;
    state.minRating = null;
    state.artisanId = "all";
    state.location = "all";
    state.visibleLimit = PAGE_SIZE;

    if (searchInput) searchInput.value = "";
    if (searchClearBtn) searchClearBtn.classList.remove("is-visible");
    if (minPriceInput) minPriceInput.value = "";
    if (maxPriceInput) maxPriceInput.value = "";
    if (artisanSelect) artisanSelect.value = "all";
    if (locationSelect) locationSelect.value = "all";

    syncCategoryCheckboxesFromState();
    syncRatingRadiosFromState();
    applyFiltersAndRender();
  }

  // 6. Filtering & Sorting Logic
  function applyFiltersAndRender() {
    const data = window.CraftoraData;
    let list = data.products.slice();

    // Search filter
    if (state.search) {
      const q = state.search.toLowerCase();
      list = list.filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.categoryLabel.toLowerCase().includes(q) ||
          p.artisanName.toLowerCase().includes(q) ||
          p.origin.toLowerCase().includes(q) ||
          p.material.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        );
      });
    }

    // Category filter
    if (state.selectedCategories.size > 0) {
      list = list.filter((p) => {
        // Check if product's category or aliases match any selected category ID
        return (
          state.selectedCategories.has(p.category) ||
          (p.categoryAliases &&
            p.categoryAliases.some((alias) => state.selectedCategories.has(alias)))
        );
      });
    }

    // Price range filter
    if (state.minPrice !== null) {
      list = list.filter((p) => p.price >= state.minPrice);
    }
    if (state.maxPrice !== null) {
      list = list.filter((p) => p.price <= state.maxPrice);
    }

    // Rating filter
    if (state.minRating !== null) {
      list = list.filter((p) => p.rating >= state.minRating);
    }

    // Artisan filter
    if (state.artisanId !== "all") {
      list = list.filter((p) => p.artisanId === state.artisanId);
    }

    // Location filter
    if (state.location !== "all") {
      list = list.filter((p) => p.origin === state.location);
    }

    // Sorting
    switch (state.sortBy) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating-high":
        list.sort((a, b) => b.rating - a.rating || b.reviewsCount - a.reviewsCount);
        break;
      case "newest":
        list.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case "featured":
      default:
        list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
    }

    state.filteredProducts = list;
    renderActiveFilterChips();
    renderProductGrid();
    updateResultsCountText();
    updateMobileBadge();
  }

  // 7. Active Filter Chips
  function renderActiveFilterChips() {
    if (!activeChipsBar) return;
    const data = window.CraftoraData;
    activeChipsBar.innerHTML = "";

    const chips = [];

    // Search chip
    if (state.search) {
      chips.push({
        label: `Search: "${state.search}"`,
        onRemove: () => {
          state.search = "";
          if (searchInput) searchInput.value = "";
          if (searchClearBtn) searchClearBtn.classList.remove("is-visible");
          applyFiltersAndRender();
        }
      });
    }

    // Category chips
    state.selectedCategories.forEach((catId) => {
      const catObj = data.getCategoryById(catId);
      const catName = catObj ? catObj.name : catId;
      chips.push({
        label: catName,
        onRemove: () => {
          state.selectedCategories.delete(catId);
          syncCategoryCheckboxesFromState();
          applyFiltersAndRender();
        }
      });
    });

    // Price range chip
    if (state.minPrice !== null || state.maxPrice !== null) {
      let label = "Price: ";
      if (state.minPrice !== null && state.maxPrice !== null) {
        label += `PKR ${state.minPrice.toLocaleString()} - PKR ${state.maxPrice.toLocaleString()}`;
      } else if (state.minPrice !== null) {
        label += `Min PKR ${state.minPrice.toLocaleString()}`;
      } else {
        label += `Max PKR ${state.maxPrice.toLocaleString()}`;
      }
      chips.push({
        label: label,
        onRemove: () => {
          state.minPrice = null;
          state.maxPrice = null;
          if (minPriceInput) minPriceInput.value = "";
          if (maxPriceInput) maxPriceInput.value = "";
          applyFiltersAndRender();
        }
      });
    }

    // Rating chip
    if (state.minRating !== null) {
      chips.push({
        label: `Rating: ${state.minRating}★ & above`,
        onRemove: () => {
          state.minRating = null;
          syncRatingRadiosFromState();
          applyFiltersAndRender();
        }
      });
    }

    // Artisan chip
    if (state.artisanId !== "all") {
      const artisanObj = data.getArtisanById(state.artisanId);
      chips.push({
        label: `Artisan: ${artisanObj ? artisanObj.name : state.artisanId}`,
        onRemove: () => {
          state.artisanId = "all";
          if (artisanSelect) artisanSelect.value = "all";
          applyFiltersAndRender();
        }
      });
    }

    // Location chip
    if (state.location !== "all") {
      chips.push({
        label: `Origin: ${state.location}`,
        onRemove: () => {
          state.location = "all";
          if (locationSelect) locationSelect.value = "all";
          applyFiltersAndRender();
        }
      });
    }

    if (chips.length === 0) {
      activeChipsBar.classList.add("is-empty");
      return;
    }

    activeChipsBar.classList.remove("is-empty");

    const titleSpan = document.createElement("span");
    titleSpan.className = "active-filters-label";
    titleSpan.textContent = "Active Filters:";
    activeChipsBar.appendChild(titleSpan);

    chips.forEach((c) => {
      const chipEl = document.createElement("span");
      chipEl.className = "filter-chip";
      chipEl.innerHTML = `
        <span>${c.label}</span>
        <button type="button" class="filter-chip-remove" aria-label="Remove filter">&times;</button>
      `;
      chipEl.querySelector(".filter-chip-remove").addEventListener("click", c.onRemove);
      activeChipsBar.appendChild(chipEl);
    });

    const clearAllBtn = document.createElement("button");
    clearAllBtn.type = "button";
    clearAllBtn.className = "clear-all-chips-btn";
    clearAllBtn.textContent = "Clear All";
    clearAllBtn.addEventListener("click", resetAllFilters);
    activeChipsBar.appendChild(clearAllBtn);
  }

  // 8. Render Product Grid & Empty State & Pagination
  function renderProductGrid() {
    if (!productsGrid) return;
    const ui = window.CraftoraUI;
    const items = state.filteredProducts;

    productsGrid.innerHTML = "";

    if (items.length === 0) {
      productsGrid.style.display = "none";
      if (emptyStateEl) emptyStateEl.classList.add("is-visible");
      if (loadMoreWrap) loadMoreWrap.classList.add("is-hidden");
      return;
    }

    productsGrid.style.display = "";
    if (emptyStateEl) emptyStateEl.classList.remove("is-visible");

    const slice = items.slice(0, state.visibleLimit);
    slice.forEach((prod) => {
      productsGrid.appendChild(ui.renderProductCard(prod));
    });

    // Pagination / Load More button
    if (loadMoreWrap) {
      if (items.length > state.visibleLimit) {
        loadMoreWrap.classList.remove("is-hidden");
        const remaining = items.length - state.visibleLimit;
        if (loadMoreBtn) {
          loadMoreBtn.textContent = `Load More Crafts (${remaining} remaining)`;
        }
        if (paginationStatusEl) {
          paginationStatusEl.textContent = `Showing ${state.visibleLimit} of ${items.length} handcrafted items`;
        }
      } else {
        if (items.length <= PAGE_SIZE) {
          loadMoreWrap.classList.add("is-hidden");
        } else {
          loadMoreWrap.classList.remove("is-hidden");
          if (loadMoreBtn) {
            loadMoreBtn.style.display = "none";
          }
          if (paginationStatusEl) {
            paginationStatusEl.textContent = `Showing all ${items.length} handcrafted items`;
          }
        }
      }
    }
  }

  function updateResultsCountText() {
    if (!resultsCountEl) return;
    const total = state.filteredProducts.length;
    if (total === 1) {
      resultsCountEl.textContent = "Showing 1 item";
    } else {
      resultsCountEl.textContent = `Showing ${total} items`;
    }
  }

  function updateMobileBadge() {
    if (!mobileFilterBadge) return;
    let count = 0;
    if (state.search) count++;
    count += state.selectedCategories.size;
    if (state.minPrice !== null || state.maxPrice !== null) count++;
    if (state.minRating !== null) count++;
    if (state.artisanId !== "all") count++;
    if (state.location !== "all") count++;

    mobileFilterBadge.textContent = String(count);
    mobileFilterBadge.style.display = count > 0 ? "inline-block" : "none";
  }

  // 9. Header Cart & Wishlist Summary Toasts
  function initHeaderActionModals() {
    const ui = window.CraftoraUI;
    const wishHeaderBtn = document.getElementById("header-wishlist-btn");
    if (wishHeaderBtn) {
      wishHeaderBtn.addEventListener("click", () => {
        const count = ui.getWishlistCount();
        if (count === 0) {
          ui.showToast("Your Wishlist is currently empty. Tap the heart on any craft to save it.", "info");
        } else {
          ui.showToast(`You have ${count} handcrafted item${count > 1 ? "s" : ""} saved in your Wishlist.`, "success");
        }
      });
    }

    const bagHeaderBtn = document.getElementById("header-cart-btn");
    if (bagHeaderBtn) {
      bagHeaderBtn.addEventListener("click", () => {
        const count = ui.getCartCount();
        if (count === 0) {
          ui.showToast("Your Bag is empty. Explore our artisan collection to add items.", "info");
        } else {
          ui.showToast(`You have ${count} item${count > 1 ? "s" : ""} in your Bag (saved in localStorage).`, "success");
        }
      });
    }
  }

  // Self-boot on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
