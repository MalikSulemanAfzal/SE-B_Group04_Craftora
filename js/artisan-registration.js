/* ==========================================================================
   Craftora - Artisan Registration Page Script (Page 14)
   Handles required field checks, email validation, and demo confirmation.
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("artisan-registration-form");
  const confirmationBox = document.getElementById("demo-confirmation");
  const confirmationSummary = document.getElementById("confirmation-summary");
  const registerAnotherBtn = document.getElementById("register-another-btn");

  if (!form || !confirmationBox || !confirmationSummary) return;

  const fields = [
    {
      input: document.getElementById("full-name"),
      errorEl: document.getElementById("full-name-error"),
      label: "Full Name",
      emptyMessage: "Please enter your full name."
    },
    {
      input: document.getElementById("shop-name"),
      errorEl: document.getElementById("shop-name-error"),
      label: "Shop Name",
      emptyMessage: "Please enter your shop name."
    },
    {
      input: document.getElementById("email"),
      errorEl: document.getElementById("email-error"),
      label: "Email",
      emptyMessage: "Please enter your email address."
    },
    {
      input: document.getElementById("craft-category"),
      errorEl: document.getElementById("craft-category-error"),
      label: "Craft Category",
      emptyMessage: "Please choose a craft category."
    },
    {
      input: document.getElementById("about-shop"),
      errorEl: document.getElementById("about-shop-error"),
      label: "About Your Shop",
      emptyMessage: "Please tell us a little about your shop."
    }
  ];

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setFieldError(field, message) {
    if (!field.input || !field.errorEl) return;
    const hasError = Boolean(message);
    field.input.classList.toggle("is-invalid", hasError);
    field.input.setAttribute("aria-invalid", String(hasError));
    field.errorEl.textContent = message;
  }

  function validateField(field) {
    if (!field.input) return true;
    const value = field.input.value.trim();

    if (!value) {
      setFieldError(field, field.emptyMessage);
      return false;
    }

    if (field.input.id === "email" && !emailPattern.test(value)) {
      setFieldError(field, "Please enter a valid email address (for example, name@example.com).");
      return false;
    }

    setFieldError(field, "");
    return true;
  }

  function renderSummary(entries) {
    confirmationSummary.replaceChildren();

    entries.forEach(({ label, value }) => {
      const row = document.createElement("div");
      row.className = "summary-row";

      const term = document.createElement("dt");
      term.textContent = label;

      const detail = document.createElement("dd");
      detail.textContent = value;

      row.append(term, detail);
      confirmationSummary.appendChild(row);
    });
  }

  fields.forEach((field) => {
    if (!field.input) return;
    const eventName = field.input.tagName === "SELECT" ? "change" : "input";

    field.input.addEventListener(eventName, () => {
      if (field.input.classList.contains("is-invalid")) {
        validateField(field);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalidField = null;
    let isFormValid = true;

    fields.forEach((field) => {
      const valid = validateField(field);
      if (!valid) {
        isFormValid = false;
        if (!firstInvalidField) {
          firstInvalidField = field.input;
        }
      }
    });

    if (!isFormValid) {
      if (firstInvalidField) {
        firstInvalidField.focus();
      }
      return;
    }

    const submittedEntries = fields.map((field) => ({
      label: field.label,
      value: field.input.value.trim()
    }));

    renderSummary(submittedEntries);
    form.hidden = true;
    confirmationBox.hidden = false;
    confirmationBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  });

  if (registerAnotherBtn) {
    registerAnotherBtn.addEventListener("click", () => {
      form.reset();
      fields.forEach((field) => setFieldError(field, ""));
      confirmationBox.hidden = true;
      form.hidden = false;

      const firstInput = document.getElementById("full-name");
      if (firstInput) {
        firstInput.focus();
      }
    });
  }
});
