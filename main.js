import "./style.css";

let currentSlide = 0;
let slideInterval;
let slides = [];
let totalSlides = 0;

function initCarousel() {
  const indicatorsContainer = document.getElementById("indicators");
  slides = document.querySelectorAll(".hero-slide");
  totalSlides = slides.length;

  // Only initialize carousel if indicators container exists and there are slides
  if (!indicatorsContainer || totalSlides === 0) {
    console.log("Carousel not initialized - missing elements");
    return;
  }

  console.log(`Initializing carousel with ${totalSlides} slides`);

  // Clear any existing indicators
  indicatorsContainer.innerHTML = '';

  for (let i = 0; i < totalSlides; i++) {
    const indicator = document.createElement("div");
    indicator.classList.add("indicator");
    if (i === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => {
      stopAutoSlide();
      goToSlide(i);
      startAutoSlide();
    });
    indicatorsContainer.appendChild(indicator);
  }

  // Start the carousel
  startAutoSlide();
}

function goToSlide(index) {
  if (slides[currentSlide]) {
    slides[currentSlide].classList.remove("active");
  }
  
  const indicators = document.querySelectorAll(".indicator");
  if (indicators[currentSlide]) {
    indicators[currentSlide].classList.remove("active");
  }

  currentSlide = index;

  if (slides[currentSlide]) {
    slides[currentSlide].classList.add("active");
  }
  if (indicators[currentSlide]) {
    indicators[currentSlide].classList.add("active");
  }
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
  stopAutoSlide(); // Clear any existing interval
  if (totalSlides > 1) {
    slideInterval = setInterval(nextSlide, 5000); // Auto-scroll every 5 seconds
  }
}

function stopAutoSlide() {
  if (slideInterval) {
    clearInterval(slideInterval);
    slideInterval = null;
  }
}

// Pause carousel on hover
const heroCarousel = document.querySelector(".hero-carousel");
if (heroCarousel) {
  heroCarousel.addEventListener("mouseenter", stopAutoSlide);
  heroCarousel.addEventListener("mouseleave", startAutoSlide);
}

const navbar = document.getElementById("navbar");
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

let lastScrollTop = 0;
let isScrolling;

window.addEventListener("scroll", () => {
  const currentScroll = window.scrollY;
  
  // Auto-hide navbar on scroll
  if (navbar) {
    // Always add white bg when scrolled past hero section
    if (currentScroll > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
    
    // Hide navbar on scroll down, show on scroll up
    if (currentScroll > 150) {
      if (currentScroll > lastScrollTop) {
        // Scrolling down
        navbar.classList.add("nav-hidden");
      } else {
        // Scrolling up
        navbar.classList.remove("nav-hidden");
      }
    } else {
      navbar.classList.remove("nav-hidden");
    }
    
    lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
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
      // Only prevent default and handle manually on mobile
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
  if (backToTopBtn && window.scrollY > 300) {
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

// Product Filter Functionality
const filterButtons = document.querySelectorAll('.filter-btn');
const productCards = document.querySelectorAll('.product-card-new');

if (filterButtons.length > 0) {
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filterValue = button.getAttribute('data-filter');
      
      productCards.forEach(card => {
        if (filterValue === 'all') {
          card.classList.remove('hidden');
          setTimeout(() => {
            card.style.animation = 'fadeInUp 0.5s ease';
          }, 50);
        } else {
          const categories = card.getAttribute('data-category').split(' ');
          if (categories.includes(filterValue)) {
            card.classList.remove('hidden');
            setTimeout(() => {
              card.style.animation = 'fadeInUp 0.5s ease';
            }, 50);
          } else {
            card.classList.add('hidden');
          }
        }
      });
    });
  });
}

// Product Modal Functionality
const productModal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalOverlay = document.querySelector('.modal-overlay');

// Product data
const productData = {
  'M10/72GDF': {
    power: '555W',
    efficiency: '21.5%',
    cellType: 'Monocrystalline PERC',
    dimensions: '2278 × 1134 × 35 mm',
    weight: '28.5 kg',
    features: [
      'High power output with excellent efficiency',
      'Superior performance in low-light conditions',
      'Anti-reflective coating for maximum light absorption',
      'Resistant to harsh weather conditions',
      'PID resistance and salt mist corrosion resistance'
    ]
  },
  'M10/72H': {
    power: '560W',
    efficiency: '21.7%',
    cellType: 'Monocrystalline Half-Cut',
    dimensions: '2278 × 1134 × 35 mm',
    weight: '29.0 kg',
    features: [
      'Half-cut cell technology for reduced hot spot risk',
      'Better shade tolerance',
      'Lower temperature coefficient',
      'Enhanced mechanical load resistance',
      '25-year linear power warranty'
    ]
  },
  'M12/60GDF': {
    power: '610W',
    efficiency: '21.6%',
    cellType: 'Monocrystalline PERC',
    dimensions: '2278 × 1134 × 35 mm',
    weight: '30.5 kg',
    features: [
      'High-efficiency full black design',
      'Aesthetic appeal for residential installations',
      'Excellent performance ratio',
      'Bifacial technology available',
      'Advanced cell interconnection technology'
    ]
  },
  'M12/66H': {
    power: '625W',
    efficiency: '22.1%',
    cellType: 'Monocrystalline N-Type',
    dimensions: '2384 × 1303 × 35 mm',
    weight: '33.0 kg',
    features: [
      'Industry-leading efficiency',
      'N-type cell technology for superior performance',
      'Lower degradation over time',
      'Excellent temperature coefficient',
      'Ideal for commercial and utility-scale projects'
    ]
  },
  'M10/60GDF': {
    power: '460W',
    efficiency: '21.3%',
    cellType: 'Monocrystalline PERC',
    dimensions: '1903 × 1134 × 35 mm',
    weight: '24.5 kg',
    features: [
      'Compact size for space-constrained installations',
      'High efficiency in smaller format',
      'Easy installation and handling',
      'Proven reliability',
      'Cost-effective solution for residential use'
    ]
  },
  'M12/60FB': {
    power: '590W',
    efficiency: '21.8%',
    cellType: 'Monocrystalline Full Black',
    dimensions: '2278 × 1134 × 35 mm',
    weight: '30.0 kg',
    features: [
      'Premium full black aesthetic design',
      'Perfect for high-end residential projects',
      'Sleek appearance with black frame and backsheet',
      'High power density',
      'Exceptional performance and style'
    ]
  }
};

if (productCards.length > 0) {
  productCards.forEach(card => {
    card.addEventListener('click', () => {
      const model = card.querySelector('.product-model').textContent;
      const power = card.querySelector('.spec-value').textContent;
      const imageSrc = card.querySelector('.product-img').src;
      const data = productData[model];
      
      if (data) {
        // Populate modal
        document.getElementById('modalTitle').textContent = model;
        document.getElementById('modalImage').src = imageSrc;
        document.getElementById('modalPower').textContent = data.power;
        document.getElementById('modalEfficiency').textContent = data.efficiency;
        document.getElementById('modalCellType').textContent = data.cellType;
        document.getElementById('modalDimensions').textContent = data.dimensions;
        document.getElementById('modalWeight').textContent = data.weight;
        
        // Populate features
        const featuresList = document.getElementById('modalFeatures');
        featuresList.innerHTML = '';
        data.features.forEach(feature => {
          const li = document.createElement('li');
          li.textContent = feature;
          featuresList.appendChild(li);
        });
        
        // Show modal
        productModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

// Close modal functionality
function closeModal() {
  productModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

if (modalClose) {
  modalClose.addEventListener('click', closeModal);
}

if (modalOverlay) {
  modalOverlay.addEventListener('click', closeModal);
}

// Close modal on ESC key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && productModal && productModal.classList.contains('active')) {
    closeModal();
  }
});

// Product Showcase Carousel
const productShowcaseData = [
  {
    name: 'Modules',
    features: ['PERC', 'N-Type', 'Featured'],
    image: 'https://images.pexels.com/photos/356036/pexels-photo-356036.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: 'modules.html'
  },
  {
    name: 'Energy Storage',
    features: ['Residential', 'Commercial', 'Industrial'],
    image: 'https://images.pexels.com/photos/8853502/pexels-photo-8853502.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: 'energy-storage.html'
  },
  {
    name: 'Charging Stations',
    features: ['Level 2 AC', 'DC Fast', 'Ultra Fast'],
    image: 'https://images.pexels.com/photos/110844/pexels-photo-110844.jpeg?auto=compress&cs=tinysrgb&w=800',
    link: 'charging-stations.html'
  }
];

let currentProductIndex = 0;
let productCarouselInterval;

function updateProductShowcase(index) {
  const data = productShowcaseData[index];
  const nameEl = document.querySelector('.product-carousel-name');
  const featuresEl = document.querySelector('.product-carousel-features');
  const linkEl = document.querySelector('.product-carousel-link');
  const imageEl = document.getElementById('productShowcaseImg');
  
  if (nameEl) nameEl.textContent = data.name;
  if (linkEl) linkEl.href = data.link;
  if (imageEl) {
    imageEl.style.opacity = '0';
    imageEl.style.transform = 'scale(0.9)';
    setTimeout(() => {
      imageEl.src = data.image;
      imageEl.alt = data.name;
      imageEl.style.transition = 'all 0.5s ease';
      imageEl.style.opacity = '1';
      imageEl.style.transform = 'scale(1)';
    }, 200);
  }
  
  if (featuresEl) {
    featuresEl.innerHTML = '';
    data.features.forEach(feature => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresEl.appendChild(li);
    });
  }
}

function startProductCarousel() {
  if (productCarouselInterval) {
    clearInterval(productCarouselInterval);
  }
  productCarouselInterval = setInterval(() => {
    currentProductIndex = (currentProductIndex + 1) % productShowcaseData.length;
    updateProductShowcase(currentProductIndex);
  }, 5000); // Auto-change every 5 seconds
}

function stopProductCarousel() {
  if (productCarouselInterval) {
    clearInterval(productCarouselInterval);
  }
}

const productPrevBtn = document.getElementById('productPrev');
const productNextBtn = document.getElementById('productNext');
const backToTopCircle = document.getElementById('backToTopCircle');
const productsShowcaseSection = document.querySelector('.products-showcase');

if (productPrevBtn) {
  productPrevBtn.addEventListener('click', () => {
    stopProductCarousel();
    currentProductIndex = (currentProductIndex - 1 + productShowcaseData.length) % productShowcaseData.length;
    updateProductShowcase(currentProductIndex);
    startProductCarousel();
  });
}

if (productNextBtn) {
  productNextBtn.addEventListener('click', () => {
    stopProductCarousel();
    currentProductIndex = (currentProductIndex + 1) % productShowcaseData.length;
    updateProductShowcase(currentProductIndex);
    startProductCarousel();
  });
}

// Pause product carousel on hover
if (productsShowcaseSection) {
  productsShowcaseSection.addEventListener('mouseenter', stopProductCarousel);
  productsShowcaseSection.addEventListener('mouseleave', startProductCarousel);
}

if (backToTopCircle) {
  backToTopCircle.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  initCarousel();
  startProductCarousel(); // Start product showcase auto-carousel
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease-in";
    document.body.style.opacity = "1";
  }, 100);
});
