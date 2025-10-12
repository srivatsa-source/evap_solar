import "./style.css";

let currentSlide = 0;
let slideInterval;
const slides = document.querySelectorAll(".hero-slide");
const totalSlides = slides.length;

function initCarousel() {
  const indicatorsContainer = document.getElementById("indicators");

  // Only initialize carousel if indicators container exists and there are slides
  if (!indicatorsContainer || totalSlides === 0) {
    return;
  }

  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement("div");
    indicator.classList.add("indicator");
    if (i === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => goToSlide(i));
    indicatorsContainer.appendChild(indicator);
  }

  startAutoSlide();
}

function goToSlide(index) {
  slides[currentSlide].classList.remove("active");
  document
    .querySelectorAll(".indicator")
    [currentSlide].classList.remove("active");

  currentSlide = index;

  slides[currentSlide].classList.add("active");
  document.querySelectorAll(".indicator")[currentSlide].classList.add("active");
}

function nextSlide() {
  const next = (currentSlide + 1) % totalSlides;
  goToSlide(next);
}

function prevSlide() {
  const prev = (currentSlide - 1 + totalSlides) % totalSlides;
  goToSlide(prev);
}

function startAutoSlide() {
  slideInterval = setInterval(nextSlide, 6000);
}

function stopAutoSlide() {
  clearInterval(slideInterval);
}

document.getElementById("nextBtn").addEventListener("click", () => {
  stopAutoSlide();
  nextSlide();
  startAutoSlide();
});

document.getElementById("prevBtn").addEventListener("click", () => {
  stopAutoSlide();
  prevSlide();
  startAutoSlide();
});

const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

window.addEventListener("scroll", () => {
  if (navbar && window.scrollY > 100) {
    navbar.classList.add("scrolled");
  } else if (navbar) {
    navbar.classList.remove("scrolled");
  }

  highlightActiveSection();
  toggleBackToTop();
});

function highlightActiveSection() {
  const sections = document.querySelectorAll("section");
  const scrollPos = window.scrollY + 150;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    const sectionId = section.getAttribute("id");

    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      navLinks.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${sectionId}`) {
          link.classList.add("active");
        }
      });
    }
  });
}

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

// Handle dropdown functionality for mobile - support multiple dropdowns
const dropdowns = document.querySelectorAll(".dropdown");
const dropdownToggles = document.querySelectorAll(".dropdown-toggle");
const dropdownMenus = document.querySelectorAll(".dropdown-menu");

// Add click handler for dropdown toggle on mobile
if (dropdownToggles.length > 0) {
  dropdownToggles.forEach((toggle, index) => {
    toggle.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const menu = dropdownMenus[index];

        if (menu) {
          // Close other dropdowns
          dropdownMenus.forEach((otherMenu, otherIndex) => {
            if (otherIndex !== index && otherMenu) {
              otherMenu.style.display = "none";
            }
          });

          // Toggle current dropdown
          menu.style.display =
            menu.style.display === "block" ? "none" : "block";
        }
      }
    });
  });
}

// Close mobile menu when clicking nav links
if (navLinks.length > 0) {
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (hamburger) hamburger.classList.remove("active");
      if (navMenu) navMenu.classList.remove("active");

      // Close all dropdowns
      dropdownMenus.forEach((menu) => {
        if (menu) menu.style.display = "none";
      });
    });
  });
}

// Close mobile menu when clicking dropdown items
const dropdownItems = document.querySelectorAll(".dropdown-item");
if (dropdownItems.length > 0) {
  dropdownItems.forEach((item) => {
    item.addEventListener("click", () => {
      if (hamburger) hamburger.classList.remove("active");
      if (navMenu) navMenu.classList.remove("active");

      // Close all dropdowns
      dropdownMenus.forEach((menu) => {
        if (menu) menu.style.display = "none";
      });
    });
  });
}

// Reset dropdown display on window resize
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    dropdownMenus.forEach((menu) => {
      if (menu) menu.style.display = "";
    });

    if (hamburger) hamburger.classList.remove("active");
    if (navMenu) navMenu.classList.remove("active");
  }
});

const observerOptions = {
  threshold: 0.15,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

const animatedElements = document.querySelectorAll(
  ".product-item, .solutions-content, .about-image, .about-content, .news-card"
);
animatedElements.forEach((el) => observer.observe(el));

const backToTopBtn = document.getElementById("backToTop");

if (backToTopBtn) {
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

function toggleBackToTop() {
  if (backToTopBtn && window.scrollY > 500) {
    backToTopBtn.classList.add("visible");
  } else if (backToTopBtn) {
    backToTopBtn.classList.remove("visible");
  }
}

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

window.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease-in";
    document.body.style.opacity = "1";
  }, 100);
});
