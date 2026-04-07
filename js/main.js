// ===== Scroll animations =====
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
);

document.querySelectorAll(".fade-in").forEach((el) => observer.observe(el));

// ===== Nav scroll effect =====
const nav = document.querySelector(".nav");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 40);
});

// ===== Mobile menu =====
const toggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

if (toggle) {
  toggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    document.body.style.overflow = isOpen ? "hidden" : "";
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      document.body.style.overflow = "";
    });
  });
}

// ===== FAQ accordion =====
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.parentElement;
    const answer = item.querySelector(".faq-answer");
    const isOpen = item.classList.contains("is-open");

    // Close all
    document.querySelectorAll(".faq-item").forEach((i) => {
      i.classList.remove("is-open");
      i.querySelector(".faq-answer").style.maxHeight = null;
    });

    // Open clicked
    if (!isOpen) {
      item.classList.add("is-open");
      answer.style.maxHeight = answer.scrollHeight + "px";
    }
  });
});

// ===== Carousel =====
const carouselEl = document.querySelector(".carousel");
if (carouselEl) {
  const track = carouselEl.querySelector(".carousel-track");
  const cards = track.querySelectorAll(".case-card");
  const prevBtn = carouselEl.querySelector(".carousel-prev");
  const nextBtn = carouselEl.querySelector(".carousel-next");
  const dotsContainer = carouselEl.querySelector(".carousel-dots");
  let current = 0;
  let autoInterval;

  // Create dots
  cards.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.classList.add("carousel-dot");
    if (i === 0) dot.classList.add("is-active");
    dot.setAttribute("aria-label", `スライド ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    current = (index + cards.length) % cards.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dotsContainer.querySelectorAll(".carousel-dot").forEach((d, i) => {
      d.classList.toggle("is-active", i === current);
    });
  }

  prevBtn.addEventListener("click", () => { goTo(current - 1); resetAuto(); });
  nextBtn.addEventListener("click", () => { goTo(current + 1); resetAuto(); });

  // Auto play
  function startAuto() {
    autoInterval = setInterval(() => goTo(current + 1), 5000);
  }
  function stopAuto() { clearInterval(autoInterval); }
  function resetAuto() { stopAuto(); startAuto(); }

  // Start when in view
  const cObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => e.isIntersecting ? startAuto() : stopAuto());
    },
    { threshold: 0.3 }
  );
  cObserver.observe(carouselEl);

  carouselEl.addEventListener("mouseenter", stopAuto);
  carouselEl.addEventListener("mouseleave", startAuto);

  // Swipe support
  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => { touchStartX = e.touches[0].clientX; stopAuto(); }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(current + (diff > 0 ? 1 : -1));
    setTimeout(startAuto, 3000);
  });
}

// ===== GA4 custom events =====
function gtagEvent(name, params) {
  if (typeof gtag === 'function') gtag('event', name, params);
}

// 無料相談ボタン
document.querySelectorAll('[data-cal-link]').forEach((btn) => {
  btn.addEventListener('click', () => {
    gtagEvent('click_consultation_button', { location: btn.closest('section')?.id || 'unknown' });
  });
});

// X DM リンククリック
document.querySelectorAll('a[href*="x.com/ryuuchamfree"]').forEach((link) => {
  link.addEventListener('click', () => {
    gtagEvent('click_x_dm_link');
  });
});

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      const offset = 80;
      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  });
});
