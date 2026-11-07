/* ==========================================================================
   Shared site components.
   The header and footer are defined once here and reused on every page:
     <site-header current="home"></site-header>
     <site-footer></site-footer>
   ========================================================================== */

const NAV_LINKS = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "about", label: "About", href: "about.html" },
  { id: "lessons", label: "Lessons", href: "lessons.html" },
];

const CONTACT_LINK = { id: "contact", label: "Contact", href: "contact.html" };

const FOOTER_LINKS = [
  { id: "home", label: "Home", href: "index.html" },
  { id: "about", label: "About", href: "about.html" },
  { id: "lessons", label: "Lessons", href: "lessons.html" },
  { id: "policies", label: "Policies", href: "policies.html" },
  { id: "contact", label: "Contact", href: "contact.html" },
];

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    icon: "facebook",
    href: "https://www.facebook.com/share/19cFRYNsX5/",
  },
  {
    label: "Instagram",
    icon: "instagram",
    href: "https://www.instagram.com/melodious.ivories?srtk=cjZjcXR4bnZrY3Vn",
  },
  { label: "Email", icon: "mail", href: "mailto:pianistah21@gmail.com" },
];

const logoMarkup = `
  <a class="logo" href="index.html" aria-label="Melodious Ivories Piano Studio – Home">
    <span class="logo__crop">
      <img src="assets/images/logo.jpg" alt="" width="1496" height="1051">
    </span>
  </a>`;

const toggleBars = `
  <span class="menu-toggle__bar"></span>
  <span class="menu-toggle__bar"></span>
  <span class="menu-toggle__bar"></span>`;

function currentAttr(isCurrent) {
  return isCurrent ? ' aria-current="page"' : "";
}

function socialMarkup() {
  return `
    <ul class="social-links">
      ${SOCIAL_LINKS.map(
        (s) => `
        <li>
          <a href="${s.href}" aria-label="${s.label}"${
            s.href.startsWith("http") ? ' target="_blank" rel="noopener noreferrer"' : ""
          }>
            <img src="assets/icons/${s.icon}.svg" alt="" width="24" height="24">
          </a>
        </li>`
      ).join("")}
    </ul>`;
}

/* ---- Navigation bar ----------------------------------------------------- */

class SiteHeader extends HTMLElement {
  connectedCallback() {
    const current = this.getAttribute("current");
    const isContact = current === CONTACT_LINK.id;

    this.innerHTML = `
      <header class="site-header">
        <div class="site-header__bar">
          ${logoMarkup}
          <nav class="site-nav" aria-label="Main">
            <ul class="site-nav__list">
              ${NAV_LINKS.map(
                (l) => `
                <li>
                  <a class="link-button${l.id === current ? " is-active" : ""}"
                     href="${l.href}"${currentAttr(l.id === current)}>${l.label}</a>
                </li>`
              ).join("")}
              <li>
                <a class="button button--primary" href="${CONTACT_LINK.href}"${currentAttr(
                  isContact
                )}>${CONTACT_LINK.label}</a>
              </li>
            </ul>
          </nav>
          <button class="menu-toggle" type="button" aria-label="Open menu"
                  aria-expanded="false" aria-controls="mobile-menu">${toggleBars}</button>
        </div>

        <div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true"
             aria-label="Menu" inert>
          <div class="site-header__bar">
            ${logoMarkup}
            <button class="menu-toggle" type="button" aria-label="Close menu"
                    data-menu-close>${toggleBars}</button>
          </div>
          <nav aria-label="Main">
            <ul class="mobile-menu__list">
              ${NAV_LINKS.map(
                (l, i) => `
                <li style="--i:${i}">
                  <a class="mobile-menu__link${l.id === current ? " is-active" : ""}"
                     href="${l.href}"${currentAttr(l.id === current)}>${l.label}</a>
                </li>`
              ).join("")}
              <li class="mobile-menu__cta" style="--i:${NAV_LINKS.length}">
                <a class="button button--primary" href="${CONTACT_LINK.href}"${currentAttr(
                  isContact
                )}>${CONTACT_LINK.label}</a>
              </li>
            </ul>
          </nav>
          <div class="mobile-menu__social">${socialMarkup()}</div>
        </div>
      </header>`;

    this.setupMenu();
  }

  setupMenu() {
    const openBtn = this.querySelector(".site-header__bar > .menu-toggle");
    const menu = this.querySelector(".mobile-menu");
    const closeBtn = menu.querySelector("[data-menu-close]");
    const desktop = window.matchMedia("(min-width: 721px)");

    const open = () => {
      menu.inert = false;
      menu.classList.add("is-open");
      openBtn.setAttribute("aria-expanded", "true");
      document.documentElement.style.overflow = "hidden";
      closeBtn.focus({ preventScroll: true });
    };

    const close = ({ restoreFocus = true } = {}) => {
      if (!menu.classList.contains("is-open")) return;
      menu.classList.remove("is-open");
      menu.inert = true;
      openBtn.setAttribute("aria-expanded", "false");
      document.documentElement.style.overflow = "";
      if (restoreFocus) openBtn.focus({ preventScroll: true });
    };

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", () => close());

    menu.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      // Keep keyboard focus inside the menu while it is open
      if (e.key === "Tab") {
        const focusables = menu.querySelectorAll("a, button");
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });

    // Close if the window grows back to the full-nav size
    desktop.addEventListener("change", (e) => {
      if (e.matches) close({ restoreFocus: false });
    });
  }
}

/* ---- Footer ------------------------------------------------------------- */

class SiteFooter extends HTMLElement {
  connectedCallback() {
    const current = document.querySelector("site-header")?.getAttribute("current");

    this.innerHTML = `
      <footer class="site-footer">
        ${logoMarkup}
        <nav aria-label="Footer">
          <ul class="site-footer__links">
            ${FOOTER_LINKS.map(
              (l) => `
              <li><a class="link-button" href="${l.href}"${currentAttr(
                l.id === current
              )}>${l.label}</a></li>`
            ).join("")}
          </ul>
        </nav>
        ${socialMarkup()}
      </footer>`;
  }
}

customElements.define("site-header", SiteHeader);
customElements.define("site-footer", SiteFooter);

/* ---- Accordion ----------------------------------------------------------
   Markup:
   <div class="accordion-item">
     <h3 class="accordion-item__heading">
       <button class="accordion-item__trigger" type="button">
         <span class="accordion-item__title">Title</span>
         <img class="accordion-item__icon" src="assets/icons/chevron-down.svg" alt="" width="24" height="24">
       </button>
     </h3>
     <div class="accordion-item__panel">
       <div class="accordion-item__panel-inner">
         <p class="accordion-item__content">Description</p>
       </div>
     </div>
   </div>
   Add "is-open" to an item to have it start opened.
   ------------------------------------------------------------------------ */

function initAccordions() {
  document.querySelectorAll(".accordion-item").forEach((item, index) => {
    const trigger = item.querySelector(".accordion-item__trigger");
    const panel = item.querySelector(".accordion-item__panel");
    const id = `accordion-panel-${index}`;

    panel.id = id;
    panel.setAttribute("role", "region");
    trigger.setAttribute("aria-controls", id);

    const sync = () => {
      const isOpen = item.classList.contains("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
      panel.inert = !isOpen;
    };

    trigger.addEventListener("click", () => {
      item.classList.toggle("is-open");
      sync();
    });

    sync();
  });
}

/* ---- Slider -------------------------------------------------------------
   Markup:
   <div class="slider" data-slider aria-label="Testimonials">
     <button class="icon-button icon-button--prev slider__prev" type="button" aria-label="Previous slide">
       <img src="assets/icons/arrow-right.svg" alt="" width="24" height="24">
     </button>
     <div class="slider__viewport">
       <div class="slider__track">
         <div class="slider__slide"> …slide content… </div>
       </div>
     </div>
     <button class="icon-button slider__next" type="button" aria-label="Next slide">
       <img src="assets/icons/arrow-right.svg" alt="" width="24" height="24">
     </button>
     <div class="slider__dots"></div>
   </div>
   Supports arrows, dots, swipe/drag, and the left/right arrow keys.
   ------------------------------------------------------------------------ */

function initSliders() {
  document.querySelectorAll("[data-slider]").forEach((slider) => {
    const viewport = slider.querySelector(".slider__viewport");
    const track = slider.querySelector(".slider__track");
    const slides = [...slider.querySelectorAll(".slider__slide")];
    const prevBtn = slider.querySelector(".slider__prev");
    const nextBtn = slider.querySelector(".slider__next");
    const dotsWrap = slider.querySelector(".slider__dots");
    const total = slides.length;
    let index = 0;

    slider.setAttribute("role", "region");
    slider.setAttribute("aria-roledescription", "carousel");
    viewport.setAttribute("aria-live", "polite");

    slides.forEach((slide, i) => {
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "slide");
      slide.setAttribute("aria-label", `${i + 1} of ${total}`);
    });

    const dots = slides.map((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "slider__dot";
      dot.setAttribute("aria-label", `Go to slide ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
      return dot;
    });

    const gap = () => parseFloat(getComputedStyle(track).columnGap) || 0;

    function render(dragOffset = 0) {
      track.style.transform = `translateX(calc(${-index * 100}% - ${
        index * gap()
      }px + ${dragOffset}px))`;
    }

    function goTo(i) {
      index = (i + total) % total; // wrap around at either end
      render();
      slides.forEach((slide, n) => {
        const active = n === index;
        slide.setAttribute("aria-hidden", String(!active));
        slide.inert = !active;
      });
      dots.forEach((dot, n) => dot.setAttribute("aria-current", String(n === index)));
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));

    slider.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") goTo(index - 1);
      if (e.key === "ArrowRight") goTo(index + 1);
    });

    // Swipe / drag
    let startX = 0;
    let startY = 0;
    let dx = 0;
    let dragging = false;

    viewport.addEventListener("pointerdown", (e) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      dragging = true;
      startX = e.clientX;
      startY = e.clientY;
      dx = 0;
    });

    viewport.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      if (!viewport.classList.contains("is-dragging")) {
        // Only take over once the gesture is clearly horizontal
        if (Math.abs(dx) < 6 || Math.abs(dx) < Math.abs(e.clientY - startY)) return;
        viewport.classList.add("is-dragging");
        viewport.setPointerCapture(e.pointerId);
      }
      // Resist dragging past the ends
      const atEdge = (index === 0 && dx > 0) || (index === total - 1 && dx < 0);
      render(atEdge ? dx * 0.35 : dx);
    });

    const endDrag = () => {
      if (!dragging) return;
      dragging = false;
      if (!viewport.classList.contains("is-dragging")) return;
      viewport.classList.remove("is-dragging");
      const threshold = Math.min(80, viewport.offsetWidth * 0.15);
      if (dx < -threshold && index < total - 1) goTo(index + 1);
      else if (dx > threshold && index > 0) goTo(index - 1);
      else render();
    };

    viewport.addEventListener("pointerup", endDrag);
    viewport.addEventListener("pointercancel", endDrag);
    window.addEventListener("resize", () => render());

    goTo(0);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAccordions();
  initSliders();
});
