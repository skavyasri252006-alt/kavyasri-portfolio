const menuToggle = document.getElementById("menuToggle");
const primaryNav = document.getElementById("primaryNav");
const contactForm = document.getElementById("contactForm");
const formMessage = document.getElementById("formMessage");
const noticeDialog = document.getElementById("noticeDialog");
const dialogMessage = document.getElementById("dialogMessage");
const closeDialog = document.getElementById("closeDialog");

// Keep the footer year current.
document.getElementById("year").textContent = new Date().getFullYear();

// Accessible mobile navigation.
menuToggle.addEventListener("click", () => {
  const isOpen = primaryNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
});

primaryNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    primaryNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
  });
});

// Reveal content as it enters the viewport, with a no-JS/reduced-motion fallback.
const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

// Project and certificate links are deliberately placeholders until real URLs are added.
function showPlaceholder(message) {
  dialogMessage.textContent = message;
  if (typeof noticeDialog.showModal === "function") {
    noticeDialog.showModal();
  } else {
    window.alert(message);
  }
}

document.querySelectorAll(".placeholder-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const type = link.dataset.linkType || "project";
    showPlaceholder(`Add the real ${type} URL for this project before publishing your portfolio.`);
  });
});

document.querySelectorAll("[data-placeholder='true']").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    showPlaceholder("Add your real certificate URL after verifying the certificate details.");
  });
});

closeDialog.addEventListener("click", () => noticeDialog.close());
noticeDialog.addEventListener("click", (event) => {
  if (event.target === noticeDialog) noticeDialog.close();
});

// A frontend-only form cannot deliver mail by itself. Validate the form, then prepare
// a message in the visitor's default email app using the configured destination below.
const CONTACT_EMAIL = "your.email@example.com"; // Replace with your real email address.

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!contactForm.reportValidity()) {
    formMessage.textContent = "Please complete all fields with valid information.";
    return;
  }

  if (CONTACT_EMAIL === "your.email@example.com") {
    formMessage.textContent = "Before using this form, replace CONTACT_EMAIL in script.js with your real email address.";
    return;
  }

  const formData = new FormData(contactForm);
  const name = String(formData.get("name")).trim();
  const email = String(formData.get("email")).trim();
  const subject = String(formData.get("subject")).trim();
  const message = String(formData.get("message")).trim();
  const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  formMessage.textContent = "Opening your email app. Review the message and send it from there.";
  window.location.href = mailto;
});

// Resume buttons stay disabled until a real PDF is added to assets/resume.pdf.
fetch("assets/resume.pdf", { method: "HEAD" })
  .then((response) => {
    if (response.ok) {
      document.querySelectorAll(".resume-button").forEach((button) => {
        button.removeAttribute("aria-disabled");
      });
    }
  })
  .catch(() => {
    // Missing resume PDF is expected in the starter project.
  });
