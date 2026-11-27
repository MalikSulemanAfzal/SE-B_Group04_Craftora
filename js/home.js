/* ==========================================================================
   Craftora - Homepage Scripts (index.html)
   Renders trending products (p001-p006), fictional demo artisans (a001-a006),
   header bag/wishlist summary triggers, and demo newsletter validation.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const data = window.CraftoraData;
  const ui = window.CraftoraUI;

  if (!data || !ui) return;

  // 1. Dynamically render Trending Handmade Products (p001 - p006)
  const productsGrid = document.getElementById("trending-products-grid");
  if (productsGrid) {
    productsGrid.innerHTML = "";
    const trendingIds = ["p001", "p002", "p003", "p004", "p005", "p006"];
    const trendingProducts = trendingIds
      .map((id) => data.getProductById(id))
      .filter(Boolean);

    trendingProducts.forEach((product) => {
      productsGrid.appendChild(ui.renderProductCard(product));
    });
  }

  // 2. Dynamically render Featured Artisans (a001 - a006, fictional demo profiles)
  const artisansGrid = document.getElementById("featured-artisans-grid");
  if (artisansGrid) {
    artisansGrid.innerHTML = "";
    data.artisans.forEach((artisan) => {
      const card = document.createElement("article");
      card.className = "artisan-card";
      card.innerHTML = `
        <div class="artisan-top">
          <img
            class="artisan-avatar"
            src="${data.resolveAssetPath(artisan.image)}"
            alt="${artisan.alt}"
            width="600"
            height="600"
          >
          <div>
            <h3 class="artisan-name">${artisan.name}</h3>
            <p class="artisan-craft">${artisan.craft}</p>
            <p class="artisan-location">${artisan.city}</p>
          </div>
        </div>
        <span class="demo-pill">Fictional Demo Profile &middot; ${artisan.id.toUpperCase()}</span>
        <p class="artisan-bio">${artisan.bio}</p>
        <div class="artisan-meta-row">
          <span>${artisan.experience}</span>
          <a class="category-link-text" href="pages/artisan-directory.html#${artisan.id}">
            View Profile &rarr;
          </a>
        </div>
      `;
      artisansGrid.appendChild(card);
    });
  }

  // 3. Header Wishlist & Bag summary buttons
  const wishHeaderBtn = document.getElementById("header-wishlist-btn");
  if (wishHeaderBtn) {
    wishHeaderBtn.addEventListener("click", () => {
      const count = ui.getWishlistCount();
      if (count === 0) {
        ui.showToast("Your Wishlist is currently empty. Tap the heart on any craft to save it.", "info");
      } else {
        ui.showToast("You have " + count + " handcrafted item" + (count > 1 ? "s" : "") + " saved in your Wishlist.", "success");
      }
    });
  }

  const bagHeaderBtn = document.getElementById("header-cart-btn");
  if (bagHeaderBtn) {
    bagHeaderBtn.addEventListener("click", () => {
      const count = ui.getCartCount();
      if (count === 0) {
        ui.showToast("Your Bag is empty. Add any handmade item from Trending Products.", "info");
      } else {
        ui.showToast("You have " + count + " item" + (count > 1 ? "s" : "") + " in your Bag (saved in localStorage).", "success");
      }
    });
  }

  // 4. Demo Newsletter Email Validation & Toast Notification
  const newsletterForm = document.getElementById("newsletter-form");
  const newsletterEmail = document.getElementById("newsletter-email");
  const newsletterFeedback = document.getElementById("newsletter-feedback");

  if (newsletterForm && newsletterEmail && newsletterFeedback) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    newsletterEmail.addEventListener("input", () => {
      newsletterEmail.classList.remove("is-invalid");
      newsletterFeedback.textContent = "";
      newsletterFeedback.className = "newsletter-feedback";
    });

    newsletterForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const value = newsletterEmail.value.trim();

      if (!value) {
        newsletterEmail.classList.add("is-invalid");
        newsletterFeedback.textContent = "Please enter your email address before subscribing.";
        newsletterFeedback.className = "newsletter-feedback is-error";
        newsletterEmail.focus();
        return;
      }

      if (!emailPattern.test(value)) {
        newsletterEmail.classList.add("is-invalid");
        newsletterFeedback.textContent = "Please enter a valid email address (for example, name@example.com).";
        newsletterFeedback.className = "newsletter-feedback is-error";
        newsletterEmail.focus();
        return;
      }

      newsletterEmail.classList.remove("is-invalid");
      newsletterFeedback.textContent = "Demo confirmed for " + value + " — no real email was sent.";
      newsletterFeedback.className = "newsletter-feedback is-success";
      newsletterForm.reset();
      ui.showToast("Subscribed to Craftora Journal (Demo — no real email sent).", "success");
    });
  }
});
