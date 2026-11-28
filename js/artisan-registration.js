/* ==========================================================================
   Craftora - Artisan Registration Page Script (Page 14)
   Handles required-field validation, email format checks, demo confirmation
   rendering, and resetting the form via "Register Another".
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("artisan-form");
  const formAlert = document.getElementById("form-alert");
  const confirmationPanel = document.getElementById("confirmation-panel");
  const submittedDetails = document.getElementById("submitted-details");
  const registerAnotherBtn = document.getElementById("register-another-btn");

  if (!form || !confirmationPanel || !submittedDetails || !registerAnotherBtn) {
    return;
  }

  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const fields = [
    {
      input: document.getElementById("full-name"),
      errorEl: document.getElementById("full-name-error"),
      label: "Full Name",
      validate(value) {
        if (!value) return "Please enter your full name.";
        return "";
      }
    },
    {
      input: document.getElementById("shop-name"),
      errorEl: document.getElementById("shop-name-error"),
      label: "Shop Name",
      validate(value) {
        if (!value) return "Please enter your shop name.";
        return "";
      }
    },
    {
      input: document.getElementById("artisan-email"),
      errorEl: document.getElementById("artisan-email-error"),
      label: "Email",
      validate(value) {
        if (!value) return "Please enter your email address.";
        if (!EMAIL_PATTERN.test(value)) {
          return "Please enter a valid email address (for example, name@example.com).";
        }
        return "";
      }
    },
    {
      input: document.getElementById("craftora-category"),
      errorEl: document.getElementById("craftora-category-error"),
      label: "Craftora Category",
      validate(value) {
        if (!value) return "Please select a Craftora category.";
        return "";
      }
    },
    {
      input: document.getElementById("about-shop"),
      errorEl: document.getElementById("about-shop-error"),
      label: "About Your Shop",
      validate(value) {
        if (!value) return "Please tell us about your shop and craft.";
        return "";
      }
    }
  ];

  function setFieldError(field, message) {
    if (!field.input || !field.errorEl) return;

    const hasError = Boolean(message);
    field.input.classList.toggle("has-error", hasError);
    field.input.setAttribute("aria-invalid", String(hasError));
    field.errorEl.textContent = message;
  }

  function validateField(field) {
    if (!field.input) return true;
    const trimmed = field.input.value.trim();
    const errorMessage = field.validate(trimmed);
    setFieldError(field, errorMessage);
    return errorMessage === "";
  }

  function updateFormAlert(invalidCount) {
    if (!formAlert) return;
    if (invalidCount === 0) {
      formAlert.hidden = true;
      formAlert.textContent = "";
      return;
    }

    const issueWord = invalidCount === 1 ? "issue" : "issues";
    formAlert.textContent = `Please fix ${invalidCount} highlighted ${issueWord} below before registering.`;
    formAlert.hidden = false;
  }

  function renderConfirmation(entries) {
    submittedDetails.replaceChildren();

    entries.forEach(({ label, value }) => {
      const row = document.createElement("div");
      row.className = "detail-row";

      const term = document.createElement("dt");
      term.textContent = label;

      const desc = document.createElement("dd");
      desc.textContent = value;

      row.append(term, desc);
      submittedDetails.appendChild(row);
    });
  }

  fields.forEach((field) => {
    if (!field.input) return;
    const eventName = field.input.tagName === "SELECT" ? "change" : "input";

    field.input.addEventListener(eventName, () => {
      if (field.input.classList.contains("has-error")) {
        validateField(field);
        const remainingErrors = fields.filter(
          (item) => item.input && item.input.classList.contains("has-error")
        ).length;
        updateFormAlert(remainingErrors);
      }
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let firstInvalidInput = null;
    let invalidCount = 0;

    fields.forEach((field) => {
      const isValid = validateField(field);
      if (!isValid) {
        invalidCount += 1;
        if (!firstInvalidInput && field.input) {
          firstInvalidInput = field.input;
        }
      }
    });

    if (invalidCount > 0) {
      updateFormAlert(invalidCount);
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    updateFormAlert(0);

    const entries = fields.map((field) => ({
      label: field.label,
      value: field.input ? field.input.value.trim() : ""
    }));

    renderConfirmation(entries);
    form.hidden = true;
    confirmationPanel.hidden = false;
    registerAnotherBtn.focus();
  });

  registerAnotherBtn.addEventListener("click", () => {
    form.reset();
    fields.forEach((field) => setFieldError(field, ""));
    updateFormAlert(0);
    submittedDetails.replaceChildren();

    confirmationPanel.hidden = true;
    form.hidden = false;

    const firstField = fields[0]?.input;
    if (firstField) firstField.focus();
  });
});
