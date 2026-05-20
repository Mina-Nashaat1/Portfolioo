/**
 * ==========================================================================
 * 🚀 Mina Nashaat Portfolio - Interactive Frontend Engine
 * ==========================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
    initAmbientCanvas();
    initTypewriter();
    initScrollObserver();
    initNavigation();
    initScrollTop();
});

/**
 * 🎨 1. High-Performance Ambient Floating Canvas
 * Creates peaceful, organic glowing shapes that drift slowly
 * and respond gently to mouse movements.
 */
function initAmbientCanvas() {
    const canvas = document.getElementById("ambient-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    let animationFrameId;

    // Canvas size tracking
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse coordinates (normalized)
    let mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    window.addEventListener("mousemove", (e) => {
        // Slow target interpolation (prevents jerky motions)
        mouse.targetX = e.clientX / window.innerWidth;
        mouse.targetY = e.clientY / window.innerHeight;
    });

    // Blob parameters: keeping motion extremely gentle & comfortable
    const blobs = [
        {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: Math.random() * canvas.width,
            targetY: Math.random() * canvas.height,
            size: 280,
            color: "rgba(0, 191, 255, 0.08)", // Soft blue
            speed: 0.0006,
            angle: Math.random() * Math.PI * 2,
            radiusX: 180,
            radiusY: 150,
            centerX: canvas.width * 0.3,
            centerY: canvas.height * 0.4
        },
        {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: Math.random() * canvas.width,
            targetY: Math.random() * canvas.height,
            size: 320,
            color: "rgba(255, 193, 7, 0.06)", // Soft yellow
            speed: 0.0005,
            angle: Math.random() * Math.PI * 2,
            radiusX: 220,
            radiusY: 180,
            centerX: canvas.width * 0.7,
            centerY: canvas.height * 0.6
        },
        {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            targetX: Math.random() * canvas.width,
            targetY: Math.random() * canvas.height,
            size: 240,
            color: "rgba(0, 191, 255, 0.05)", // Soft blue secondary
            speed: 0.0007,
            angle: Math.random() * Math.PI * 2,
            radiusX: 140,
            radiusY: 200,
            centerX: canvas.width * 0.5,
            centerY: canvas.height * 0.3
        }
    ];

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Smoothly interpolate mouse coordinates
        mouse.x += (mouse.targetX - mouse.x) * 0.05;
        mouse.y += (mouse.targetY - mouse.y) * 0.05;

        blobs.forEach((blob, idx) => {
            // Update circular path trajectory
            blob.angle += blob.speed;
            
            // Re-adjust centers if window resized
            if (idx === 0) {
                blob.centerX = canvas.width * 0.25;
                blob.centerY = canvas.height * 0.35;
            } else if (idx === 1) {
                blob.centerX = canvas.width * 0.75;
                blob.centerY = canvas.height * 0.65;
            } else {
                blob.centerX = canvas.width * 0.5;
                blob.centerY = canvas.height * 0.25;
            }

            // Target coordinates incorporating gentle circle-math and mouse parallax
            const pathX = blob.centerX + Math.cos(blob.angle) * blob.radiusX;
            const pathY = blob.centerY + Math.sin(blob.angle) * blob.radiusY;

            // Parallax influence (move slightly in opposition to cursor)
            const mouseInfluenceX = (0.5 - mouse.x) * 120;
            const mouseInfluenceY = (0.5 - mouse.y) * 120;

            blob.x += (pathX + mouseInfluenceX - blob.x) * 0.03;
            blob.y += (pathY + mouseInfluenceY - blob.y) * 0.03;

            // Render soft glowing gradient circle
            const gradient = ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.size
            );
            gradient.addColorStop(0, blob.color);
            gradient.addColorStop(0.5, blob.color.replace("0.08", "0.03").replace("0.06", "0.02").replace("0.05", "0.01"));
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();

    // Clean up animation on reload/unload if needed
    window.addEventListener("unload", () => {
        cancelAnimationFrame(animationFrameId);
    });
}

/**
 * ✍️ 2. Premium Typing Carousel Effect
 * Fluid back-and-forth character interpolation
 */
function initTypewriter() {
    const rolesElement = document.getElementById("rolesTyping");
    if (!rolesElement) return;

    const roles = ["Data Engineer", "Data Analyst", "Data Scientist"];
    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeDelay = 100;

    function type() {
        const currentRole = roles[roleIdx];
        
        if (isDeleting) {
            rolesElement.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
            typeDelay = 50; // Erases faster
        } else {
            rolesElement.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
            typeDelay = 120; // Natural typing pace
        }

        // Handle states
        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            typeDelay = 2000; // Hold full phrase static for 2 seconds
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            typeDelay = 600; // Pause briefly before writing the next role
        }

        setTimeout(type, typeDelay);
    }

    type();
}

/**
 * 👁️ 3. Intersection Observer Scroll Reveal
 * Fades and translates sections beautifully upon viewport entrance
 */
function initScrollObserver() {
    const sections = document.querySelectorAll(".page-section");
    
    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                
                // If it's the experience or education section, reveal timeline items sequentially
                if (entry.target.id === "experience" || entry.target.id === "education") {
                    animateTimelineItems(entry.target);
                }
                
                // If it's the skills section, animate skill items sequentially
                if (entry.target.id === "skills-box") {
                    animateSkills(entry.target);
                }

                observer.unobserve(entry.target); // Animates only once
            }
        });
    }, observerOptions);

    sections.forEach(sec => {
        observer.observe(sec);
    });
}

function animateTimelineItems(section) {
    const items = section.querySelectorAll(".timeline-item");
    items.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "translateY(30px)";
        item.style.transition = "opacity 0.6s ease, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)";
        
        setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "translateY(0)";
        }, 150 * index);
    });
}

function animateSkills(section) {
    const items = section.querySelectorAll(".skill-item");
    items.forEach((item, index) => {
        item.style.opacity = "0";
        item.style.transform = "scale(0.85) translateY(20px)";
        item.style.transition = "opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
        
        setTimeout(() => {
            item.style.opacity = "1";
            item.style.transform = "scale(1) translateY(0)";
        }, 60 * index);
    });
}

/**
 * 🧭 4. Navigation & Active Scroll-Spy
 * Tracks user scrolling position to actively highlight current nav tab.
 * Manages responsive sidebar toggle drawer too.
 */
function initNavigation() {
    // Menu toggle selector (mobile)
    const menuToggle = document.getElementById("menuToggle");
    const navLinksContainer = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".page-section, #hero");

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener("click", () => {
            navLinksContainer.classList.toggle("active");
            const icon = menuToggle.querySelector("i");
            if (navLinksContainer.classList.contains("active")) {
                icon.className = "fas fa-times";
            } else {
                icon.className = "fas fa-bars";
            }
        });

        // Auto close mobile drawer on click of nav-link
        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                navLinksContainer.classList.remove("active");
                const icon = menuToggle.querySelector("i");
                if (icon) icon.className = "fas fa-bars";
            });
        });
    }

    // Scrollspy active tab logic
    window.addEventListener("scroll", () => {
        let currentSectionId = "";
        const scrollPosition = window.scrollY + 180; // offset

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    });
}

/**
 * 🔝 5. Scroll-to-Top Polish
 * Smoothly return to top, displays button dynamically
 */
function initScrollTop() {
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (!scrollTopBtn) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add("visible");
        } else {
            scrollTopBtn.classList.remove("visible");
        }
    });

    scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });
}
