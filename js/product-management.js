/* ==========================================================================
   Craftora - Product Management JavaScript
   Handles localStorage seeding, CRUD operations, filtering, sorting, and stats.
   ========================================================================== */

const STORAGE_KEY = "craftora_products";
const MAX_DESCRIPTION_LENGTH = 200;
const DESCRIPTION_WARN_THRESHOLD = 170;

// Nine official Craftora product categories
const OFFICIAL_CATEGORIES = [
  "Pottery & Ceramics",
  "Woodwork",
  "Textiles & Weaving",
  "Leathercraft",
  "Metalwork & Brass",
  "Jewelry",
  "Home Decor",
  "Basketry & Bamboo",
  "Paper & Calligraphy"
];

// Six sample Craftora artisans
const SAMPLE_ARTISANS = [
  "Amina Tariq",
  "Bilal Ahmed",
  "Farah Siddiqui",
  "Hamza Qureshi",
  "Nadia Hussain",
  "Zainab Malik"
];

// Fallback inline SVG thumbnail used when an image fails to load
const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">' +
      '<rect width="80" height="80" fill="#32281F"/>' +
      '<text x="50%" y="52%" dominant-baseline="middle" text-anchor="middle" ' +
      'fill="#E8805A" font-family="sans-serif" font-size="11">Craftora</text>' +
    "</svg>"
  );

// 12 sample products seeded only when localStorage has no saved catalog
const SEED_PRODUCTS = [
  {
    id: "craft-101",
    name: "Hand-Thrown Terracotta Vase",
    category: "Pottery & Ceramics",
    price: 3200,
    stock: 14,
    artisan: "Amina Tariq",
    image: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&q=80",
    description: "Wheel-thrown natural clay vase finished with a warm matte earth glaze.",
    rating: 4.8
  },
  {
    id: "craft-102",
    name: "Multani Blue Glazed Bowl Set",
    category: "Pottery & Ceramics",
    price: 4500,
    stock: 4,
    artisan: "Amina Tariq",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=400&q=80",
    description: "Set of three hand-painted ceramic serving bowls with traditional floral motifs.",
    rating: 4.9
  },
  {
    id: "craft-103",
    name: "Carved Sheesham Serving Tray",
    category: "Woodwork",
    price: 4800,
    stock: 9,
    artisan: "Bilal Ahmed",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=400&q=80",
    description: "Solid rosewood serving tray with hand-chiseled geometric border and beeswax polish.",
    rating: 4.7
  },
  {
    id: "craft-104",
    name: "Walnut Wood Spice Box",
    category: "Woodwork",
    price: 2900,
    stock: 0,
    artisan: "Bilal Ahmed",
    image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&q=80",
    description: "Six-compartment handcrafted walnut masala box with a snug sliding lid.",
    rating: 4.6
  },
  {
    id: "craft-105",
    name: "Handloom Cotton Table Runner",
    category: "Textiles & Weaving",
    price: 2600,
    stock: 18,
    artisan: "Farah Siddiqui",
    image: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=400&q=80",
    description: "Loom-woven unbleached cotton table runner with natural indigo stripe accents.",
    rating: 4.8
  },
  {
    id: "craft-106",
    name: "Block-Printed Cushion Covers (Pair)",
    category: "Textiles & Weaving",
    price: 2200,
    stock: 3,
    artisan: "Farah Siddiqui",
    image: "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&q=80",
    description: "Hand-stamped Ajrak-inspired cotton cushion covers dyed with plant pigments.",
    rating: 4.7
  },
  {
    id: "craft-107",
    name: "Stitched Saddle Leather Journal",
    category: "Leathercraft",
    price: 3400,
    stock: 11,
    artisan: "Hamza Qureshi",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&q=80",
    description: "Full-grain vegetable-tanned leather journal bound with hand-waxed linen thread.",
    rating: 4.9
  },
  {
    id: "craft-108",
    name: "Hammered Brass Tea Kettle",
    category: "Metalwork & Brass",
    price: 6800,
    stock: 5,
    artisan: "Hamza Qureshi",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=400&q=80",
    description: "Hand-hammered pure brass kettle lined with food-safe tin for traditional tea.",
    rating: 4.8
  },
  {
    id: "craft-109",
    name: "Silver Filigree Crescent Earrings",
    category: "Jewelry",
    price: 3900,
    stock: 7,
    artisan: "Nadia Hussain",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80",
    description: "Delicate sterling silver wirework earrings crafted using traditional filigree.",
    rating: 4.9
  },
  {
    id: "craft-110",
    name: "Macrame Wall Hanging Tapestry",
    category: "Home Decor",
    price: 3100,
    stock: 12,
    artisan: "Nadia Hussain",
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80",
    description: "Hand-knotted organic cotton cord wall piece mounted on seasoned driftwood.",
    rating: 4.6
  },
  {
    id: "craft-111",
    name: "Woven Date-Palm Bread Basket",
    category: "Basketry & Bamboo",
    price: 1850,
    stock: 20,
    artisan: "Zainab Malik",
    image: "https://images.unsplash.com/photo-1595408076683-5d0c7040a6e1?w=400&q=80",
    description: "Lightweight coiled basket hand-plaited from sun-dried date palm fronds.",
    rating: 4.5
  },
  {
    id: "craft-112",
    name: "Hand-Calligraphed Deckle Art Print",
    category: "Paper & Calligraphy",
    price: 2400,
    stock: 2,
    artisan: "Zainab Malik",
    image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&q=80",
    description: "Original reed-pen ink calligraphy on handmade cotton rag paper with deckle edges.",
    rating: 4.8
  }
];

let products = [];
let pendingDeleteId = null;
let toastTimer = null;

// DOM Elements
const tbody = document.getElementById("products-tbody");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("search-input");
const categoryFilter = document.getElementById("category-filter");
const sortSelect = document.getElementById("sort-select");

const statTotalProducts = document.getElementById("stat-total-products");
const statTotalUnits = document.getElementById("stat-total-units");
const statTotalValue = document.getElementById("stat-total-value");
const statLowStock = document.getElementById("stat-low-stock");

const exportProductsBtn = document.getElementById("export-products-btn");
const resetDemoBtn = document.getElementById("reset-demo-btn");
const addProductBtn = document.getElementById("add-product-btn");
const productModal = document.getElementById("product-modal");
const modalTitle = document.getElementById("modal-title");
const closeProductModalBtn = document.getElementById("close-product-modal");
const cancelProductBtn = document.getElementById("cancel-product-btn");
const productForm = document.getElementById("product-form");

const productIdInput = document.getElementById("product-id");
const productNameInput = document.getElementById("product-name");
const nameError = document.getElementById("name-error");
const productCategorySelect = document.getElementById("product-category");
const productArtisanSelect = document.getElementById("product-artisan");
const productPriceInput = document.getElementById("product-price");
const productStockInput = document.getElementById("product-stock");
const productImageInput = document.getElementById("product-image");
const productDescriptionInput = document.getElementById("product-description");
const descriptionCounter = document.getElementById("description-counter");
const imagePreview = document.getElementById("image-preview");
const imagePreviewPlaceholder = document.getElementById("image-preview-placeholder");
const formError = document.getElementById("form-error");

const deleteModal = document.getElementById("delete-modal");
const deleteProductName = document.getElementById("delete-product-name");
const closeDeleteModalBtn = document.getElementById("close-delete-modal");
const cancelDeleteBtn = document.getElementById("cancel-delete-btn");
const confirmDeleteBtn = document.getElementById("confirm-delete-btn");

const resetModal = document.getElementById("reset-modal");
const closeResetModalBtn = document.getElementById("close-reset-modal");
const cancelResetBtn = document.getElementById("cancel-reset-btn");
const confirmResetBtn = document.getElementById("confirm-reset-btn");

const toastEl = document.getElementById("toast");

// Initialize page on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  populateDropdowns();
  products = loadProducts();
  renderAll();
  attachEventListeners();
});

// Populate category filter, category form select, and artisan form select
function populateDropdowns() {
  OFFICIAL_CATEGORIES.forEach((category) => {
    const filterOption = document.createElement("option");
    filterOption.value = category;
    filterOption.textContent = category;
    categoryFilter.appendChild(filterOption);

    const formOption = document.createElement("option");
    formOption.value = category;
    formOption.textContent = category;
    productCategorySelect.appendChild(formOption);
  });

  SAMPLE_ARTISANS.forEach((artisan) => {
    const option = document.createElement("option");
    option.value = artisan;
    option.textContent = artisan;
    productArtisanSelect.appendChild(option);
  });
}

// Load products from localStorage, or seed 12 defaults if none exist
function loadProducts() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    saveProducts(SEED_PRODUCTS);
    return [...SEED_PRODUCTS];
  }

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    // Fallback to seed data if stored JSON is corrupted
  }

  saveProducts(SEED_PRODUCTS);
  return [...SEED_PRODUCTS];
}

// Persist product array to localStorage
function saveProducts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

// Re-render both inventory stats and filtered table
function renderAll() {
  updateStats();
  renderTable();
}

// Format a number as PKR currency
function formatPKR(amount) {
  return "PKR " + Number(amount).toLocaleString("en-PK");
}

// Calculate and display the four live inventory metrics
function updateStats() {
  const totalProducts = products.length;
  const totalUnits = products.reduce((sum, item) => sum + Number(item.stock), 0);
  const totalValue = products.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.stock),
    0
  );
  const lowStockCount = products.filter((item) => Number(item.stock) <= 5).length;

  statTotalProducts.textContent = totalProducts;
  statTotalUnits.textContent = totalUnits.toLocaleString("en-PK");
  statTotalValue.textContent = formatPKR(totalValue);
  statLowStock.textContent = lowStockCount;
}

// Apply search, category filter, and sort order together
function getVisibleProducts() {
  const query = searchInput.value.trim().toLowerCase();
  const selectedCategory = categoryFilter.value;
  const sortMode = sortSelect.value;

  const filtered = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(query);
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  filtered.sort((a, b) => {
    if (sortMode === "recent") return products.indexOf(b) - products.indexOf(a);
    if (sortMode === "name-asc") return a.name.localeCompare(b.name);
    if (sortMode === "price-asc") return a.price - b.price;
    if (sortMode === "price-desc") return b.price - a.price;
    if (sortMode === "stock-asc") return a.stock - b.stock;
    return 0;
  });

  return filtered;
}

// Determine status badge text and CSS class from stock count
function getStockBadge(stock) {
  if (stock === 0) {
    return { label: "Out of Stock", className: "badge-out-of-stock" };
  }
  if (stock <= 5) {
    return { label: "Low Stock", className: "badge-low-stock" };
  }
  return { label: "In Stock", className: "badge-in-stock" };
}

// Render rows inside the products table (or empty state)
function renderTable() {
  const visibleProducts = getVisibleProducts();
  tbody.innerHTML = "";

  if (visibleProducts.length === 0) {
    emptyState.hidden = false;
    return;
  }

  emptyState.hidden = true;

  visibleProducts.forEach((product) => {
    const row = document.createElement("tr");
    const badge = getStockBadge(Number(product.stock));

    row.appendChild(createImageCell(product));
    row.appendChild(createTextCell("Name", product.name, "product-name-cell"));
    row.appendChild(createTextCell("Category", product.category, "muted-cell"));
    row.appendChild(createTextCell("Artisan", product.artisan, "muted-cell"));
    row.appendChild(createTextCell("Price", formatPKR(product.price)));
    row.appendChild(createTextCell("Stock", String(product.stock)));
    row.appendChild(createStatusCell(badge));
    row.appendChild(createActionsCell(product.id));

    tbody.appendChild(row);
  });
}

// Helper to create the thumbnail cell with error fallback
function createImageCell(product) {
  const td = document.createElement("td");
  td.setAttribute("data-label", "Image");

  const img = document.createElement("img");
  img.className = "product-thumb";
  img.src = product.image || FALLBACK_IMAGE;
  img.alt = product.name;
  img.addEventListener("error", () => {
    img.src = FALLBACK_IMAGE;
  });

  td.appendChild(img);
  return td;
}

// Helper to create a standard table cell
function createTextCell(label, text, className = "") {
  const td = document.createElement("td");
  td.setAttribute("data-label", label);
  if (className) td.className = className;
  td.textContent = text;
  return td;
}

// Helper to create the stock status badge cell
function createStatusCell(badge) {
  const td = document.createElement("td");
  td.setAttribute("data-label", "Status");

  const span = document.createElement("span");
  span.className = `status-badge ${badge.className}`;
  span.textContent = badge.label;

  td.appendChild(span);
  return td;
}

// Helper to create Edit and Delete action buttons
function createActionsCell(productId) {
  const td = document.createElement("td");
  td.setAttribute("data-label", "Actions");

  const wrapper = document.createElement("div");
  wrapper.className = "action-buttons";

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn-table btn-edit";
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => openEditModal(productId));

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn-table btn-delete";
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => openDeleteModal(productId));

  wrapper.appendChild(editBtn);
  wrapper.appendChild(deleteBtn);
  td.appendChild(wrapper);
  return td;
}

// Wire up UI controls and modal interactions
function attachEventListeners() {
  searchInput.addEventListener("input", renderTable);
  categoryFilter.addEventListener("change", renderTable);
  sortSelect.addEventListener("change", renderTable);

  exportProductsBtn.addEventListener("click", handleExportProducts);
  resetDemoBtn.addEventListener("click", openResetModal);
  addProductBtn.addEventListener("click", openAddModal);

  closeProductModalBtn.addEventListener("click", closeProductModal);
  cancelProductBtn.addEventListener("click", closeProductModal);
  productForm.addEventListener("submit", handleFormSubmit);
  productNameInput.addEventListener("input", hideNameError);
  productImageInput.addEventListener("input", updateImagePreview);
  productDescriptionInput.addEventListener("input", updateDescriptionCounter);

  closeDeleteModalBtn.addEventListener("click", closeDeleteModal);
  cancelDeleteBtn.addEventListener("click", closeDeleteModal);
  confirmDeleteBtn.addEventListener("click", handleConfirmDelete);

  closeResetModalBtn.addEventListener("click", closeResetModal);
  cancelResetBtn.addEventListener("click", closeResetModal);
  confirmResetBtn.addEventListener("click", handleConfirmReset);

  // Close modals when clicking the backdrop
  productModal.addEventListener("click", (event) => {
    if (event.target === productModal) closeProductModal();
  });
  deleteModal.addEventListener("click", (event) => {
    if (event.target === deleteModal) closeDeleteModal();
  });
  resetModal.addEventListener("click", (event) => {
    if (event.target === resetModal) closeResetModal();
  });
}

// Open empty modal to add a new product
function openAddModal() {
  productForm.reset();
  productIdInput.value = "";
  modalTitle.textContent = "Add New Product";
  hideFormError();
  hideNameError();
  updateImagePreview();
  updateDescriptionCounter();
  productModal.hidden = false;
  productNameInput.focus();
}

// Open modal pre-filled with an existing product
function openEditModal(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  productIdInput.value = product.id;
  productNameInput.value = product.name;
  productCategorySelect.value = product.category;
  productArtisanSelect.value = product.artisan;
  productPriceInput.value = product.price;
  productStockInput.value = product.stock;
  productImageInput.value = product.image;
  productDescriptionInput.value = product.description;

  modalTitle.textContent = "Edit Product";
  hideFormError();
  hideNameError();
  updateImagePreview();
  updateDescriptionCounter();
  productModal.hidden = false;
  productNameInput.focus();
}

function closeProductModal() {
  productModal.hidden = true;
}

// Update description character counter and warning colors
function updateDescriptionCounter() {
  const length = productDescriptionInput.value.length;
  descriptionCounter.textContent = `${length} / ${MAX_DESCRIPTION_LENGTH} characters`;
  descriptionCounter.classList.toggle(
    "near-limit",
    length >= DESCRIPTION_WARN_THRESHOLD && length <= MAX_DESCRIPTION_LENGTH
  );
  descriptionCounter.classList.toggle("over-limit", length > MAX_DESCRIPTION_LENGTH);
}

// Live preview for the Image URL field
function updateImagePreview() {
  const url = productImageInput.value.trim();
  if (!isValidImageUrl(url)) {
    imagePreview.hidden = true;
    imagePreview.removeAttribute("src");
    imagePreviewPlaceholder.hidden = false;
    return;
  }

  imagePreview.src = url;
  imagePreview.hidden = false;
  imagePreviewPlaceholder.hidden = true;

  imagePreview.onerror = () => {
    imagePreview.hidden = true;
    imagePreviewPlaceholder.hidden = false;
  };
}

// Validate that the string is an http/https URL
function isValidImageUrl(value) {
  if (!value) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (error) {
    return false;
  }
}

// Check if a product name already exists (case-insensitive)
function isDuplicateProductName(name, existingId) {
  const normalized = name.toLowerCase();
  return products.some(
    (item) => item.id !== existingId && item.name.trim().toLowerCase() === normalized
  );
}

// Validate form inputs and return either an error message or clean payload
function validateProductForm(existingId) {
  const name = productNameInput.value.trim();
  const category = productCategorySelect.value.trim();
  const artisan = productArtisanSelect.value.trim();
  const priceRaw = productPriceInput.value.trim();
  const stockRaw = productStockInput.value.trim();
  const image = productImageInput.value.trim();
  const description = productDescriptionInput.value.trim();

  if (!name || !category || !artisan || !priceRaw || !stockRaw || !image || !description) {
    return { error: "Please fill in all fields before saving." };
  }

  if (!existingId && isDuplicateProductName(name, existingId)) {
    return { nameError: "A product with this name already exists." };
  }

  const price = Number(priceRaw);
  if (Number.isNaN(price) || price <= 0) {
    return { error: "Price must be greater than 0." };
  }

  const stock = Number(stockRaw);
  if (!Number.isInteger(stock) || stock < 0) {
    return { error: "Stock must be a whole number (0 or greater)." };
  }

  if (!isValidImageUrl(image)) {
    return { error: "Please enter a valid image URL starting with http:// or https://." };
  }

  if (productDescriptionInput.value.length > MAX_DESCRIPTION_LENGTH) {
    return {
      error: `Description cannot exceed ${MAX_DESCRIPTION_LENGTH} characters.`
    };
  }

  return {
    data: { name, category, price, stock, artisan, image, description }
  };
}

// Save a new or edited product to localStorage
function handleFormSubmit(event) {
  event.preventDefault();
  hideFormError();
  hideNameError();

  const existingId = productIdInput.value;
  const result = validateProductForm(existingId);

  if (result.nameError) {
    showNameError(result.nameError);
    productNameInput.focus();
    return;
  }

  if (result.error) {
    showFormError(result.error);
    return;
  }

  if (existingId) {
    const index = products.findIndex((item) => item.id === existingId);
    if (index !== -1) {
      products[index] = {
        ...products[index],
        ...result.data
      };
    }
    saveProducts(products);
    closeProductModal();
    renderAll();
    showToast("Product updated successfully");
    return;
  }

  const newProduct = {
    id: "craft-" + Date.now(),
    ...result.data,
    rating: 4.8
  };

  products.push(newProduct);
  saveProducts(products);
  closeProductModal();
  renderAll();
  showToast("Product added successfully");
}

function showNameError(message) {
  nameError.textContent = message;
  nameError.hidden = false;
}

function hideNameError() {
  nameError.textContent = "";
  nameError.hidden = true;
}

function showFormError(message) {
  formError.textContent = message;
  formError.hidden = false;
}

function hideFormError() {
  formError.textContent = "";
  formError.hidden = true;
}

// Open delete confirmation dialog
function openDeleteModal(productId) {
  const product = products.find((item) => item.id === productId);
  if (!product) return;

  pendingDeleteId = productId;
  deleteProductName.textContent = product.name;
  deleteModal.hidden = false;
}

function closeDeleteModal() {
  pendingDeleteId = null;
  deleteModal.hidden = true;
}

// Delete confirmed product, persist, and re-render
function handleConfirmDelete() {
  if (!pendingDeleteId) return;

  products = products.filter((item) => item.id !== pendingDeleteId);
  saveProducts(products);
  closeDeleteModal();
  renderAll();
  showToast("Product deleted successfully");
}

// Download current craftora_products data as a products.json file
function handleExportProducts() {
  const storedRaw = localStorage.getItem(STORAGE_KEY);
  let exportData = products;

  if (storedRaw !== null) {
    try {
      exportData = JSON.parse(storedRaw);
    } catch (error) {
      exportData = products;
    }
  }

  const jsonText = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonText], { type: "application/json" });
  const downloadUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "products.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);

  showToast("Products exported to products.json");
}

// Open reset demo data confirmation modal
function openResetModal() {
  resetModal.hidden = false;
}

function closeResetModal() {
  resetModal.hidden = true;
}

// Restore the original 12 sample products in localStorage
function handleConfirmReset() {
  products = SEED_PRODUCTS.map((item) => ({ ...item }));
  saveProducts(products);
  closeResetModal();
  renderAll();
  showToast("Demo data restored");
}

// Display a brief toast message
function showToast(message) {
  toastEl.textContent = message;
  toastEl.hidden = false;

  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 3000);
}
