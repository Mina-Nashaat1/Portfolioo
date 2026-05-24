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
    initThemeSwitcher();
    initCustomCursor();
    initCardSpotlightAndTilt();
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

    // Helper to convert hex to rgba
    function hexToRgba(hex, alpha) {
        hex = hex.replace("#", "").trim();
        if (hex.length === 3) {
            hex = hex.split("").map(c => c + c).join("");
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

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
        mouse.targetX = e.clientX / window.innerWidth;
        mouse.targetY = e.clientY / window.innerHeight;
    });

    // Blob parameters: keeping motion extremely gentle, now color-responsive
    const blobs = [
        {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: 280,
            colorKey: "--accent-blue",
            alpha: 0.08,
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
            size: 320,
            colorKey: "--accent-yellow",
            alpha: 0.06,
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
            size: 240,
            colorKey: "--accent-blue",
            alpha: 0.05,
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

        // Fetch CSS color styles once per frame
        const styles = getComputedStyle(document.documentElement);

        blobs.forEach((blob, idx) => {
            blob.angle += blob.speed;
            
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

            const pathX = blob.centerX + Math.cos(blob.angle) * blob.radiusX;
            const pathY = blob.centerY + Math.sin(blob.angle) * blob.radiusY;

            // Gentle parallax
            const mouseInfluenceX = (0.5 - mouse.x) * 120;
            const mouseInfluenceY = (0.5 - mouse.y) * 120;

            blob.x += (pathX + mouseInfluenceX - blob.x) * 0.03;
            blob.y += (pathY + mouseInfluenceY - blob.y) * 0.03;

            // Fetch dynamic active color variable
            const rawHex = styles.getPropertyValue(blob.colorKey).trim();
            const color0 = hexToRgba(rawHex, blob.alpha);
            const color5 = hexToRgba(rawHex, blob.alpha * 0.35);

            const gradient = ctx.createRadialGradient(
                blob.x, blob.y, 0,
                blob.x, blob.y, blob.size
            );
            gradient.addColorStop(0, color0);
            gradient.addColorStop(0.5, color5);
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(blob.x, blob.y, blob.size, 0, Math.PI * 2);
            ctx.fill();
        });

        animationFrameId = requestAnimationFrame(animate);
    }
    
    animate();

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

    const roles = ["Data Analyst", "Junior Data Analyst"];
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

/**
 * ==========================================================================
 * 🎮 ADVANCED INTERACTIVE SUITE (AESTHETICS & WOW FACTOR)
 * ==========================================================================
 */

/**
 * 🎨 A. Accent Color & Theme Switcher Customizer
 * Allows users to choose their favourite highlight palette.
 */
function initThemeSwitcher() {
    const themeSwitcher = document.getElementById("themeSwitcher");
    const themeToggleBtn = document.getElementById("themeToggleBtn");
    const themeBtns = document.querySelectorAll(".theme-opt-btn");
    
    if (!themeSwitcher || !themeToggleBtn) return;
    
    // Toggle Slide-in Panel
    themeToggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        themeSwitcher.classList.toggle("open");
    });
    
    // Click outside to close panel
    document.addEventListener("click", (e) => {
        if (!themeSwitcher.contains(e.target)) {
            themeSwitcher.classList.remove("open");
        }
    });

    const themeColors = {
        cyber: {
            blue: "#00bfff",
            blueRgb: "0, 191, 255",
            yellow: "#ffc107",
            yellowRgb: "255, 193, 7",
            glowBlue: "rgba(0, 191, 255, 0.25)",
            glowYellow: "rgba(255, 193, 7, 0.25)"
        },
        emerald: {
            blue: "#00ffaa",
            blueRgb: "0, 255, 170",
            yellow: "#ffd700",
            yellowRgb: "255, 215, 0",
            glowBlue: "rgba(0, 255, 170, 0.25)",
            glowYellow: "rgba(255, 215, 0, 0.25)"
        },
        retro: {
            blue: "#a124ff",
            blueRgb: "161, 36, 255",
            yellow: "#00f0ff",
            yellowRgb: "0, 240, 255",
            glowBlue: "rgba(161, 36, 255, 0.25)",
            glowYellow: "rgba(0, 240, 255, 0.25)"
        }
    };
    
    function applyTheme(theme) {
        const colors = themeColors[theme];
        if (!colors) return;
        
        // Update CSS Variables in root
        const root = document.documentElement;
        root.style.setProperty('--accent-blue', colors.blue);
        root.style.setProperty('--accent-blue-rgb', colors.blueRgb);
        root.style.setProperty('--accent-yellow', colors.yellow);
        root.style.setProperty('--accent-yellow-rgb', colors.yellowRgb);
        root.style.setProperty('--border-glow-blue', colors.glowBlue);
        root.style.setProperty('--border-glow-yellow', colors.glowYellow);
        
        // Highlight active button
        themeBtns.forEach(btn => {
            if (btn.getAttribute("data-theme") === theme) {
                btn.classList.add("active");
            } else {
                btn.classList.remove("active");
            }
        });
        
        // Save to local storage
        localStorage.setItem("mina-portfolio-theme", theme);
    }
    
    // Bind buttons
    themeBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const theme = btn.getAttribute("data-theme");
            applyTheme(theme);
        });
    });
    
    // Load saved theme or default
    const savedTheme = localStorage.getItem("mina-portfolio-theme") || "cyber";
    applyTheme(savedTheme);
}


/**
 * 📍 B. Smooth Lag-Follow Custom Cursor
 * Renders an elegant concentric hover ring trailing the mouse cursor.
 */
function initCustomCursor() {
    const cursorDot = document.getElementById("customCursorDot");
    const cursorRing = document.getElementById("customCursorRing");
    const cursorToggle = document.getElementById("cursorToggleSwitch");
    
    if (!cursorDot || !cursorRing) return;
    
    let mousePos = { x: -100, y: -100 };
    let dotPos = { x: -100, y: -100 };
    let ringPos = { x: -100, y: -100 };
    
    // Tracking mouse coordinates
    window.addEventListener("mousemove", (e) => {
        mousePos.x = e.clientX;
        mousePos.y = e.clientY;
        
        cursorDot.style.opacity = "1";
        cursorRing.style.opacity = "1";
    });
    
    // Lerp follow animation
    function updateCursor() {
        // Dot follows fast
        dotPos.x += (mousePos.x - dotPos.x) * 0.3;
        dotPos.y += (mousePos.y - dotPos.y) * 0.3;
        
        // Ring follows with a sleek lag delay (lerp factor 0.12)
        ringPos.x += (mousePos.x - ringPos.x) * 0.12;
        ringPos.y += (mousePos.y - ringPos.y) * 0.12;
        
        cursorDot.style.left = `${dotPos.x}px`;
        cursorDot.style.top = `${dotPos.y}px`;
        
        cursorRing.style.left = `${ringPos.x}px`;
        cursorRing.style.top = `${ringPos.y}px`;
        
        requestAnimationFrame(updateCursor);
    }
    updateCursor();
    
    // Handle expandable scale on interactive hovers
    const interactiveSelectors = 'a, button, .clickable, .chart-metric-bar, .metric-mini-card, .menu-toggle, .theme-switcher-toggle';
    
    function attachHoverListeners() {
        const hoverTargets = document.querySelectorAll(interactiveSelectors);
        hoverTargets.forEach(target => {
            // Prevent duplicate bindings
            target.removeEventListener("mouseenter", addHoverClass);
            target.removeEventListener("mouseleave", removeHoverClass);
            
            target.addEventListener("mouseenter", addHoverClass);
            target.addEventListener("mouseleave", removeHoverClass);
        });
    }
    
    function addHoverClass() {
        cursorRing.classList.add("hovered");
    }
    
    function removeHoverClass() {
        cursorRing.classList.remove("hovered");
    }
    
    attachHoverListeners();
    
    // Re-attach hovers dynamically if DOM updates or scrolls
    window.addEventListener("scroll", attachHoverListeners);
    document.addEventListener("click", () => setTimeout(attachHoverListeners, 100));
    
    // Toggle active cursor preference
    function toggleCursor(isActive) {
        if (isActive) {
            document.body.classList.add("custom-cursor-active");
            if (cursorToggle) cursorToggle.classList.add("active");
            localStorage.setItem("mina-custom-cursor", "on");
        } else {
            document.body.classList.remove("custom-cursor-active");
            if (cursorToggle) cursorToggle.classList.remove("active");
            localStorage.setItem("mina-custom-cursor", "off");
        }
    }
    
    if (cursorToggle) {
        cursorToggle.addEventListener("click", () => {
            const isCurrentlyOn = document.body.classList.contains("custom-cursor-active");
            toggleCursor(!isCurrentlyOn);
        });
    }
    
    // Load user preference
    const savedCursor = localStorage.getItem("mina-custom-cursor") || "on";
    toggleCursor(savedCursor === "on");
}


function initCardSpotlightAndTilt() {
    const cards = document.querySelectorAll(".card");
    
    cards.forEach(card => {
        card.addEventListener("mousemove", (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x coordinate relative to card
            const y = e.clientY - rect.top;  // y coordinate relative to card
            
            // Update CSS Spotlight variables
            card.style.setProperty("--spotlight-x", `${x}px`);
            card.style.setProperty("--spotlight-y", `${y}px`);
        });
    });
}


/**
 * 📊 D. Interactive Dashboard Tab Switching & Console Terminal Typewriter
 * Performs dynamic querying and types feedback outputs inside our console box.
 */
window.switchDashboardTab = function(tabName) {
    const skillsTab = document.getElementById("dash-tab-skills");
    const milestonesTab = document.getElementById("dash-tab-milestones");
    const skillsBtn = document.getElementById("btn-tab-skills");
    const milestonesBtn = document.getElementById("btn-tab-milestones");
    
    if (!skillsTab || !milestonesTab) return;
    
    // Close other panes
    if (tabName === "skills") {
        skillsTab.classList.add("active");
        milestonesTab.classList.remove("active");
        if (skillsBtn) skillsBtn.classList.add("active");
        if (milestonesBtn) milestonesBtn.classList.remove("active");
    } else {
        milestonesTab.classList.add("active");
        skillsTab.classList.remove("active");
        if (milestonesBtn) milestonesBtn.classList.add("active");
        if (skillsBtn) skillsBtn.classList.remove("active");
    }
};

