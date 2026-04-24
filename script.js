const navbar = document.querySelector(".navbar");
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

window.addEventListener("scroll", () => {
    navbar?.classList.toggle("scrolled", window.scrollY > 40);
});

function toggleMenu() {
    navLinks?.classList.toggle("open");
    hamburger?.classList.toggle("active");
}

window.toggleMenu = toggleMenu;

document.querySelectorAll(".nav-links a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks?.classList.remove("open");
        hamburger?.classList.remove("active");
    });
});

const slides = [...document.querySelectorAll(".slide")];
const dotsWrap = document.getElementById("slideDots");
let currentSlide = 0;
let slideTimer;

function renderDots() {
    if (!dotsWrap || !slides.length) return;

    dotsWrap.innerHTML = "";

    slides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = `dot ${index === currentSlide ? "active" : ""}`;
        dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
        dot.addEventListener("click", () => showSlide(index));
        dotsWrap.appendChild(dot);
    });
}

function showSlide(index) {
    if (!slides.length) return;

    currentSlide = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === currentSlide);
    });

    document.querySelectorAll(".dot").forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === currentSlide);
    });

    clearInterval(slideTimer);
    slideTimer = setInterval(() => changeSlide(1), 5000);
}

function changeSlide(direction) {
    showSlide(currentSlide + direction);
}

window.changeSlide = changeSlide;
renderDots();

if (slides.length) {
    slideTimer = setInterval(() => changeSlide(1), 5000);
}

const observer = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.12 }
);

document
    .querySelectorAll("section, .card, .gallery-item, .feature-card, .table-wrap, .contact-form-wrap, .preview-grid a")
    .forEach((element) => {
        element.classList.add("reveal");
        observer.observe(element);
    });

const galleryImages = [...document.querySelectorAll(".gallery-item img")];
const lightbox = document.getElementById("lightbox");
const lightboxImg = lightbox?.querySelector("img");
let galleryIndex = 0;

function openLightbox(index) {
    if (!lightbox || !lightboxImg) return;

    galleryIndex = index;
    lightboxImg.src = galleryImages[index].src;
    lightboxImg.alt = galleryImages[index].alt;
    lightbox.classList.add("open");
}

function closeLightbox() {
    lightbox?.classList.remove("open");
}

function moveLightbox(step) {
    if (!galleryImages.length) return;

    galleryIndex = (galleryIndex + step + galleryImages.length) % galleryImages.length;
    openLightbox(galleryIndex);
}

galleryImages.forEach((image, index) => {
    image.addEventListener("click", () => openLightbox(index));
});

document.getElementById("lightbox-close")?.addEventListener("click", closeLightbox);
document.getElementById("lightbox-prev")?.addEventListener("click", () => moveLightbox(-1));
document.getElementById("lightbox-next")?.addEventListener("click", () => moveLightbox(1));

lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
});

const modelData = {
    gt: {
        title: "AMG GT Coupe",
        img: "images/MERCEDES-BENZ-AMG-GT.jpg",
        price: "From P 4,200,000",
        stats: "720 HP · 0–100 in 3.2s · 316 km/h",
        desc: "A dramatic coupe made for drivers who want aggressive styling, track-focused handling and serious AMG performance.",
        features: ["V8 Biturbo", "Race Mode", "AMG Track Pace", "Carbon Fibre Package"]
    },
    gle: {
        title: "AMG GLE 63 S",
        img: "images/Mercedes-amg-gle-63-s.jpg",
        price: "From P 3,800,000",
        stats: "603 HP · 0–100 in 3.8s · 280 km/h",
        desc: "A luxury performance SUV built for comfort, power and everyday road presence.",
        features: ["4MATIC+ AWD", "Air Suspension", "AMG Night Package", "Premium Sound"]
    },
    c63: {
        title: "AMG C63 S E Performance",
        img: "images/Mercedes-AMG C63 S E Performance.jpeg",
        price: "From P 2,900,000",
        stats: "680 HP · 0–100 in 3.4s · 280 km/h",
        desc: "A modern hybrid AMG combining electric response with motorsport-inspired performance.",
        features: ["Plug-in Hybrid", "Electric Motor", "AMG Speedshift", "Active Aero"]
    }
};

const modelModal = document.getElementById("modelModal");

function openModelModal(modelKey) {
    const data = modelData[modelKey];

    if (!data || !modelModal) return;

    modelModal.querySelector(".modal-img").src = data.img;
    modelModal.querySelector(".modal-img").alt = data.title;
    modelModal.querySelector(".modal-title").textContent = data.title;
    modelModal.querySelector(".modal-price").textContent = data.price;
    modelModal.querySelector(".modal-stats").textContent = data.stats;
    modelModal.querySelector(".modal-desc").textContent = data.desc;
    modelModal.querySelector(".modal-features").innerHTML = data.features
        .map((feature) => `<span>✦ ${feature}</span>`)
        .join("");

    modelModal.classList.add("open");
}

function closeModelModal() {
    modelModal?.classList.remove("open");
}

window.openModelModal = openModelModal;
window.closeModelModal = closeModelModal;

modelModal?.addEventListener("click", (event) => {
    if (event.target === modelModal) closeModelModal();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeLightbox();
        closeModelModal();
    }

    if (lightbox?.classList.contains("open")) {
        if (event.key === "ArrowLeft") moveLightbox(-1);
        if (event.key === "ArrowRight") moveLightbox(1);
    }
});

const form = document.getElementById("testDriveForm");
const success = document.getElementById("formSuccess");

form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.getElementById("fullName")?.value || "there";
    const email = document.getElementById("email")?.value || "your email";
    const model = document.getElementById("model")?.value || "your selected AMG model";

    form.style.display = "none";

    if (success) {
        success.style.display = "block";
        success.querySelector("p").textContent =
            `Thank you, ${name}. We will contact you at ${email} about the ${model} within 24 hours.`;
    }
});
