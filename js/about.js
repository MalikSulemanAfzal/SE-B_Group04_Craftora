/* ==========================================================================
   Craftora - About Page JavaScript
   Handles live product count, image fallbacks, scroll fade-in, and counters.
   ========================================================================== */

const STORAGE_KEY = "craftora_products";

document.addEventListener("DOMContentLoaded", () => {
  syncProductCounterTarget();
  setupImageFallbacks();
  setupScrollReveal();
  setupCounterAnimation();
});

// Read saved products from localStorage so the product counter stays accurate
function syncProductCounterTarget() {
  const productCounter = document.getElementById("about-product-counter");
  if (!productCounter) return;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      productCounter.setAttribute("data-target", String(parsed.length));
    }
  } catch (error) {
    // Keep default target value if localStorage cannot be read
  }
}

// Replace failed images with a clean fallback colour block
function setupImageFallbacks() {
  const frames = document.querySelectorAll(".image-frame img");

  frames.forEach((img) => {
    img.addEventListener("error", () => {
      const frame = img.closest(".image-frame");
      img.style.display = "none";
      if (frame) {
        frame.classList.add("image-failed");
      }
    });
  });
}

// Subtle fade-in animation as sections enter the viewport
function setupScrollReveal() {
  const sections = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    sections.forEach((section) => section.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12 }
  );

  sections.forEach((section) => observer.observe(section));
}

// Animate counters from 0 to their target number when scrolled into view
function setupCounterAnimation() {
  const counters = document.querySelectorAll(".counter-number");
  const strip = document.querySelector(".stats-strip");
  if (!strip || counters.length === 0) return;

  let hasAnimated = false;

  const runCounters = () => {
    if (hasAnimated) return;
    hasAnimated = true;
    counters.forEach((counter) => animateCounter(counter));
  };

  if (!("IntersectionObserver" in window)) {
    runCounters();
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        runCounters();
        obs.disconnect();
      });
    },
    { threshold: 0.25 }
  );

  observer.observe(strip);
}

// Smoothly increment a single counter element over ~1 second
function animateCounter(element) {
  const target = Number(element.getAttribute("data-target")) || 0;
  const suffix = element.getAttribute("data-suffix") || "";
  const duration = 1000;
  const startTime = performance.now();

  function step(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(progress * target);

    element.textContent = currentValue.toLocaleString("en-PK") + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      element.textContent = target.toLocaleString("en-PK") + suffix;
    }
  }

  requestAnimationFrame(step);
}
