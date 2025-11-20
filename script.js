// Loading screen
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    setTimeout(() => {
        loadingScreen.classList.add('fade-out');
    }, 1500);
    setTimeout(typeText, 2500);
});

// Combined mouse parallax handler (debounced via rAF). Updates shapes, particles and CSS parallax vars.
let lastMouseX = 0;
let lastMouseY = 0;
let rafId = null;
let sharedMouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

function handleMouseMove(e) {
    sharedMouse.x = e.clientX;
    sharedMouse.y = e.clientY;
    if (!rafId) rafId = requestAnimationFrame(applyParallax);
}

function applyParallax() {
    rafId = null;
    const mouseX = sharedMouse.x / window.innerWidth - 0.5;
    const mouseY = sharedMouse.y / window.innerHeight - 0.5;
    // update only background shapes and background particles (do NOT touch book or page content)
    const shapes = document.querySelectorAll('.background-3d .floating-shapes .shape');
    const particles = document.querySelectorAll('.background-3d .particles-container .particle');

    if (shapes.length) {
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 8; // gentle movement
            const x = mouseX * speed;
            const y = mouseY * speed;
            shape.style.transform = `translate(${x}px, ${y}px) rotate(${mouseX * 10}deg)`; // subtle rotation
        });
    }

    if (particles.length) {
        particles.forEach((particle, index) => {
            const speed = (index + 1) * 4; // gentle particle movement
            const x = mouseX * speed;
            const y = mouseY * speed;
            particle.style.transform = `translate(${x}px, ${y}px)`;
        });
    }

    // CSS variable driven parallax (smoother)
    const mx = (mouseX) * 2; // -1..1
    const my = (mouseY) * 2;
    lastMouseX = Math.max(-1, Math.min(1, mx));
    lastMouseY = Math.max(-1, Math.min(1, my));
    document.body.style.setProperty('--mx', (lastMouseX * 100).toFixed(2) + 'px');
    document.body.style.setProperty('--my', (lastMouseY * 100).toFixed(2) + 'px');
}

document.addEventListener('mousemove', handleMouseMove, { passive: true });

/* NOTE: Removed wrapper tilt mouse handlers because they interfere with precise page-turn behavior
   The book page-turn effect is driven by adding/removing the 'turn' class on page elements.
   Keeping an additional wrapper transform caused stacking/click issues. */

// Typing animation effect
const texts = ['AIML Enthusiast', 'ML Developer', 'Python Coder', 'AI Explorer', 'Tech Innovator'];
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 100;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeText() {
    const typingElement = document.querySelector('.typing-text');
    const currentText = texts[textIndex];

    if (!isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(typeText, pauseTime);
            return;
        }
    } else {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
        }
    }

    setTimeout(typeText, isDeleting ? deletingSpeed : typingSpeed);
}

// ========== PAGE FLIP SYSTEM (Simplified & Robust) ==========
const spreads = Array.from(document.querySelectorAll('.book-page.page-right'));
// Ensure initial state: all spreads unturned
spreads.forEach(spread => spread.classList.remove('turn'));
let currentIndex = 0; // number of spreads already turned

function updateStack() {
    // Lower z-index for future pages, higher for already turned, top for current edge
    spreads.forEach((el, i) => {
        if (i < currentIndex) {
            el.style.zIndex = 5 + i; // turned pages accumulate
        } else if (i === currentIndex) {
            el.style.zIndex = 50; // active edge page
        } else {
            el.style.zIndex = 2; // pages yet to turn
        }
    });
}
updateStack();

// Next / Prev buttons
document.querySelectorAll('.nextprev-btn').forEach(btn => {
    const targetId = btn.dataset.page;
    const spread = document.getElementById(targetId);
    if (!spread) return;
    const isBack = btn.classList.contains('back');
    const index = spreads.indexOf(spread);
    if (index === -1) return;

    btn.addEventListener('click', e => {
        e.stopPropagation();
        if (!isBack) {
            // NEXT: turn current spread
            if (!spread.classList.contains('turn')) {
                spread.classList.add('turn');
                currentIndex = Math.min(index + 1, spreads.length);
                updateStack();
            }
        } else {
            // PREV: unturn previous spread
            if (spread.classList.contains('turn')) {
                spread.classList.remove('turn');
                currentIndex = index;
                updateStack();
            }
        }
    });
});

// Contact Me button: flip all to reach last page quickly
const contactMeBtn = document.querySelector('.btn.contact-me');
if (contactMeBtn) {
    contactMeBtn.addEventListener('click', () => {
        spreads.forEach((sp, i) => {
            setTimeout(() => {
                sp.classList.add('turn');
                currentIndex = i + 1;
                updateStack();
            }, i * 180);
        });
    });
}

// Back to Profile: reset state
const backProfileBtn = document.querySelector('.back-profile');
if (backProfileBtn) {
    backProfileBtn.addEventListener('click', () => {
        spreads.slice().reverse().forEach((sp, i) => {
            setTimeout(() => {
                sp.classList.remove('turn');
                if (i === spreads.length - 1) {
                    currentIndex = 0;
                    updateStack();
                }
            }, i * 120);
        });
    });
}

// Cover opening animation retained
const coverRight = document.querySelector('.cover.cover-right');
setTimeout(() => coverRight?.classList.add('turn'), 1200);
setTimeout(() => { if (coverRight) coverRight.style.zIndex = -1; }, 2000);