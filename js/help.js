/* ==========================================================================
   Craftora - Help Centre JavaScript
   Handles dynamic FAQ rendering, topic filtering, live search with highlight,
   single-open accordion, and contact form validation + localStorage saving.
   ========================================================================== */

const MESSAGES_STORAGE_KEY = "craftora_messages";

// 15 FAQs grouped across the 6 support topics
const FAQ_DATA = [
  {
    topic: "Orders",
    question: "How do I place an order on Craftora?",
    answer:
      "Browse the Products page, open any handmade item you like, choose your quantity, and click Add to Cart. When you are ready, open your cart and complete the checkout form."
  },
  {
    topic: "Orders",
    question: "Can I modify or cancel my order after placing it?",
    answer:
      "Because many items are packed directly by independent artisans, orders can only be modified or cancelled within 12 hours of checkout by contacting our support desk."
  },
  {
    topic: "Orders",
    question: "How do I use the wishlist?",
    answer:
      "Click the heart or Save to Wishlist button on any product card to bookmark pieces for later. Your saved wishlist items remain stored in your browser so you can revisit them anytime."
  },
  {
    topic: "Delivery",
    question: "What are the delivery times and charges?",
    answer:
      "Standard nationwide delivery takes 3 to 5 business days across major cities and up to 7 days for remote areas. Flat shipping is PKR 250, and orders above PKR 6,000 qualify for free delivery."
  },
  {
    topic: "Delivery",
    question: "How are fragile pottery and glass crafts packaged?",
    answer:
      "All ceramics, brassware, and carved wood items are double-boxed with recycled kraft paper cushioning and protective corner inserts to prevent transit damage."
  },
  {
    topic: "Delivery",
    question: "How can I track my shipment?",
    answer:
      "Once the artisan dispatches your parcel, you receive an order reference number on your confirmation summary and dashboard to check delivery progress."
  },
  {
    topic: "Returns",
    question: "What is Craftora's returns and refunds policy?",
    answer:
      "Unused items in original packaging can be returned within 7 days of delivery. Once the returned piece is inspected, a full refund or replacement is issued within 5 business days."
  },
  {
    topic: "Returns",
    question: "What should I do if my craft arrives damaged?",
    answer:
      "Please take a clear photo of the parcel and item within 48 hours of delivery and submit it via the Contact form with your order reference so we can arrange a free replacement."
  },
  {
    topic: "Payments",
    question: "What payment methods are accepted on Craftora?",
    answer:
      "For this university demo, Craftora supports simulated Cash on Delivery, Debit/Credit Card, and local wallet checkout options. No real financial charges are ever processed."
  },
  {
    topic: "Payments",
    question: "Are there any hidden fees or extra taxes at checkout?",
    answer:
      "No. All listed product prices are in Pakistani Rupees (PKR), and any applicable shipping fee is shown clearly before you confirm your demo order."
  },
  {
    topic: "Artisans",
    question: "How can I become an artisan partner on Craftora?",
    answer:
      "Send us a message using the Contact form and select 'Become an Artisan' as the subject. Share your craft specialty, workshop city, and sample photos so our team can review your portfolio."
  },
  {
    topic: "Artisans",
    question: "How do I manage my products and inventory?",
    answer:
      "Artisans can use the Product Management panel (product-management.html) to add new handmade pieces, edit prices or descriptions, monitor low-stock alerts, and remove sold-out listings."
  },
  {
    topic: "Artisans",
    question: "How does Craftora ensure fair pay for makers?",
    answer:
      "Artisans set their own workshop prices based on material cost and crafting hours, allowing makers to keep the majority of every purchase."
  },
  {
    topic: "Account",
    question: "Do I need an account to browse or save items?",
    answer:
      "You can browse the full catalog, search FAQs, and manage demo cart/wishlist data directly in your browser without mandatory registration."
  },
  {
    topic: "Account",
    question: "Why are my changes saved only in this browser?",
    answer:
      "Craftora is a client-side academic project built with HTML, CSS, and vanilla JavaScript, so products, orders, and contact messages are persisted locally using browser localStorage."
  }
];

let activeTopic = "All";
let searchQuery = "";
let openQuestionKey = null;

// DOM Elements
const searchInput = document.getElementById("faq-search");
const topicButtons = document.querySelectorAll(".topic-btn");
const faqContainer = document.getElementById("faq-container");
const faqEmpty = document.getElementById("faq-empty");

const contactForm = document.getElementById("contact-form");
const nameInput = document.getElementById("contact-name");
const emailInput = document.getElementById("contact-email");
const subjectSelect = document.getElementById("contact-subject");
const messageInput = document.getElementById("contact-message");
const formSuccess = document.getElementById("form-success");

const errorElements = {
  name: document.getElementById("error-name"),
  email: document.getElementById("error-email"),
  subject: document.getElementById("error-subject"),
  message: document.getElementById("error-message")
};

// Initialize page interactions
document.addEventListener("DOMContentLoaded", () => {
  updateActiveTopicButton();
  renderFaqs();
  attachFaqListeners();
  attachContactListeners();
});

// Wire up topic filter buttons and live search input
function attachFaqListeners() {
  topicButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const clickedTopic = btn.getAttribute("data-topic");
      // Clicking the active topic again resets to All Topics
      activeTopic =
        clickedTopic === activeTopic && clickedTopic !== "All" ? "All" : clickedTopic;

      updateActiveTopicButton();
      openQuestionKey = null;
      renderFaqs();
    });
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value.trim();
    renderFaqs();
  });
}

function updateActiveTopicButton() {
  topicButtons.forEach((btn) => {
    const isMatch = btn.getAttribute("data-topic") === activeTopic;
    btn.classList.toggle("active", isMatch);
    btn.setAttribute("aria-pressed", String(isMatch));
  });
}

// Filter FAQs by active topic and search query
function getFilteredFaqs() {
  const queryLower = searchQuery.toLowerCase();

  return FAQ_DATA.filter((item) => {
    const matchesTopic = activeTopic === "All" || item.topic === activeTopic;
    const matchesSearch =
      !queryLower ||
      item.question.toLowerCase().includes(queryLower) ||
      item.answer.toLowerCase().includes(queryLower);

    return matchesTopic && matchesSearch;
  });
}

// Render matching FAQs grouped by topic
function renderFaqs() {
  const filtered = getFilteredFaqs();
  faqContainer.innerHTML = "";

  if (filtered.length === 0) {
    faqEmpty.hidden = false;
    return;
  }

  faqEmpty.hidden = true;

  // Group filtered items while preserving topic order
  const groups = {};
  filtered.forEach((item) => {
    if (!groups[item.topic]) groups[item.topic] = [];
    groups[item.topic].push(item);
  });

  Object.keys(groups).forEach((topicName) => {
    const groupSection = document.createElement("div");
    groupSection.className = "faq-group";

    const heading = document.createElement("h3");
    heading.className = "faq-group-title";
    heading.textContent = topicName;
    groupSection.appendChild(heading);

    const list = document.createElement("div");
    list.className = "faq-list";

    groups[topicName].forEach((faq, index) => {
      list.appendChild(createFaqItem(faq, `${topicName}-${index}`));
    });

    groupSection.appendChild(list);
    faqContainer.appendChild(groupSection);
  });
}

// Build a single accessible accordion item
function createFaqItem(faq, keyId) {
  const itemEl = document.createElement("article");
  itemEl.className = "faq-item";

  const isOpen = openQuestionKey === faq.question;
  if (isOpen) itemEl.classList.add("open");

  const panelId = `faq-panel-${keyId}`;
  const button = document.createElement("button");
  button.type = "button";
  button.className = "faq-question";
  button.setAttribute("aria-expanded", String(isOpen));
  button.setAttribute("aria-controls", panelId);

  const textSpan = document.createElement("span");
  appendHighlightedText(textSpan, faq.question, searchQuery);

  const iconSpan = document.createElement("span");
  iconSpan.className = "faq-icon";
  iconSpan.setAttribute("aria-hidden", "true");

  button.appendChild(textSpan);
  button.appendChild(iconSpan);

  const panel = document.createElement("div");
  panel.id = panelId;
  panel.className = "faq-panel";

  const answerInner = document.createElement("div");
  answerInner.className = "faq-answer-inner";

  const answerP = document.createElement("p");
  answerP.className = "faq-answer";
  appendHighlightedText(answerP, faq.answer, searchQuery);

  answerInner.appendChild(answerP);
  panel.appendChild(answerInner);

  button.addEventListener("click", () => toggleAccordion(faq.question));

  itemEl.appendChild(button);
  itemEl.appendChild(panel);
  return itemEl;
}

// Keep at most one FAQ item open at a time
function toggleAccordion(questionText) {
  openQuestionKey = openQuestionKey === questionText ? null : questionText;

  const items = faqContainer.querySelectorAll(".faq-item");
  items.forEach((item) => {
    const btn = item.querySelector(".faq-question");
    const labelText = btn ? btn.firstChild.textContent : "";
    const shouldOpen = labelText === openQuestionKey;
    item.classList.toggle("open", shouldOpen);
    if (btn) btn.setAttribute("aria-expanded", String(shouldOpen));
  });
}

// Highlight search query matches safely using DOM nodes
function appendHighlightedText(container, text, query) {
  if (!query) {
    container.textContent = text;
    return;
  }

  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let startIndex = 0;

  while (startIndex < text.length) {
    const matchIndex = lowerText.indexOf(lowerQuery, startIndex);
    if (matchIndex === -1) {
      container.appendChild(document.createTextNode(text.slice(startIndex)));
      break;
    }

    if (matchIndex > startIndex) {
      container.appendChild(
        document.createTextNode(text.slice(startIndex, matchIndex))
      );
    }

    const mark = document.createElement("mark");
    mark.className = "search-highlight";
    mark.textContent = text.slice(matchIndex, matchIndex + query.length);
    container.appendChild(mark);

    startIndex = matchIndex + query.length;
  }
}

// Wire up contact form validation and submission
function attachContactListeners() {
  const inputs = [
    { el: nameInput, key: "name" },
    { el: emailInput, key: "email" },
    { el: subjectSelect, key: "subject" },
    { el: messageInput, key: "message" }
  ];

  // Clear inline error as soon as the user types or changes a field
  inputs.forEach(({ el, key }) => {
    const eventName = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(eventName, () => {
      clearFieldError(el, errorElements[key]);
      formSuccess.hidden = true;
    });
  });

  contactForm.addEventListener("submit", handleContactSubmit);
}

function handleContactSubmit(event) {
  event.preventDefault();
  formSuccess.hidden = true;

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const subject = subjectSelect.value.trim();
  const message = messageInput.value.trim();

  let isValid = true;

  if (name.length < 3) {
    showFieldError(nameInput, errorElements.name, "Please enter at least 3 characters.");
    isValid = false;
  }

  if (!isValidEmail(email)) {
    showFieldError(emailInput, errorElements.email, "Please enter a valid email address.");
    isValid = false;
  }

  if (!subject) {
    showFieldError(subjectSelect, errorElements.subject, "Please choose a subject.");
    isValid = false;
  }

  if (message.length < 10) {
    showFieldError(
      messageInput,
      errorElements.message,
      "Message must be at least 10 characters long."
    );
    isValid = false;
  }

  if (!isValid) return;

  saveContactMessage({
    id: "msg-" + Date.now(),
    name,
    email,
    subject,
    message,
    submittedAt: new Date().toISOString()
  });

  contactForm.reset();
  formSuccess.hidden = false;
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showFieldError(inputEl, errorEl, text) {
  inputEl.classList.add("input-invalid");
  errorEl.textContent = text;
  errorEl.hidden = false;
}

function clearFieldError(inputEl, errorEl) {
  inputEl.classList.remove("input-invalid");
  errorEl.textContent = "";
  errorEl.hidden = true;
}

// Save submitted demo contact message into localStorage
function saveContactMessage(newMessage) {
  let existing = [];
  try {
    const raw = localStorage.getItem(MESSAGES_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    if (Array.isArray(parsed)) existing = parsed;
  } catch (error) {
    existing = [];
  }

  existing.push(newMessage);
  localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(existing));
}
