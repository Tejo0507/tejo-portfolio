/* ============================================
   TEJO SRIDHAR M V S - PORTFOLIO JAVASCRIPT
   Enhanced with smooth animations and interactions
   ============================================ */

// ============================================
// PAGE TURNING FUNCTIONALITY
// ============================================
const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

pageTurnBtn.forEach((el, index) => {
    el.onclick = () => {
        const pageTurnId = el.getAttribute('data-page');
        const pageTurn = document.getElementById(pageTurnId);

        if(pageTurn.classList.contains('turn')){
            pageTurn.classList.remove('turn');

            setTimeout(() => {
                pageTurn.style.zIndex = 2 - index;
            }, 500);
        }else{
            pageTurn.classList.add('turn');

            setTimeout(() => {
                pageTurn.style.zIndex = 2 + index;
            }, 500);
        }
    }
});

// ============================================
// CONTACT ME BUTTON - FLIP TO LAST PAGE
// ============================================
const pages = document.querySelectorAll('.book-page.page-right');
const contactMeBtn = document.querySelector('.btn.contact-me');

if (contactMeBtn) {
    contactMeBtn.onclick = () => {
        pages.forEach((page, index) => {
            setTimeout(() => {
                page.classList.add('turn');
                setTimeout(() => {
                    page.style.zIndex = 20 + index;
                }, 500);
            }, (index + 1) * 200 + 100)
        });
    }
}

// ============================================
// REVERSE INDEX FUNCTION
// ============================================
let totalPages = pages.length;
let pageNumber = 0;

function reverseIndex() {
    pageNumber--;
    if(pageNumber < 0){
        pageNumber = totalPages - 1;
    }
}

// ============================================
// BACK TO PROFILE BUTTON
// ============================================
const backProfileBtn = document.querySelector('.back-profile');

if (backProfileBtn) {
    backProfileBtn.onclick = () => {
        pages.forEach((_, index) => {
            setTimeout(() => {
                reverseIndex();
                pages[pageNumber].classList.remove('turn');

                setTimeout(() => {
                    reverseIndex();
                    pages[pageNumber].style.zIndex = 10 + index;
                }, 500)
            }, (index + 1) * 200 + 100)
        })
    }
}

// ============================================
// OPENING ANIMATION
// ============================================
const coverRight = document.querySelector('.cover.cover-right');
const pageLeft = document.querySelector('.book-page.page-left');

// Cover right animation (book opens)
setTimeout(() => {
    coverRight.classList.add('turn');
}, 2100);

setTimeout(() => {
    coverRight.style.zIndex = -1;
}, 2800);

// Flip all pages back to starting position
pages.forEach((_, index) => {
    setTimeout(() => {
        reverseIndex();
        pages[pageNumber].classList.remove('turn');

        setTimeout(() => {
            reverseIndex();
            pages[pageNumber].style.zIndex = 10 + index;
        }, 500)
    }, (index + 1) * 200 + 2100)
})

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            document.querySelector(href).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS FOR CONTENT
// ============================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.workeduc-content, .services-content, .skills-content, .project-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ============================================
// BUTTON CLICK EFFECTS
// ============================================
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple CSS dynamically
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// DOWNLOAD CV BUTTON FUNCTIONALITY
// ============================================
const downloadCVBtn = document.querySelector('a[download]');
if (downloadCVBtn && !downloadCVBtn.href.includes('.pdf')) {
    downloadCVBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('Please add your CV PDF file to the /assets folder and name it "Tejo_Sridhar_CV.pdf"');
    });
}

// ============================================
// PROJECT LINKS - OPEN IN NEW TAB
// ============================================
document.querySelectorAll('.project-btn, .contact-link, .project-info a').forEach(link => {
    if (link.getAttribute('href') === '#' || !link.href || link.href.endsWith('#')) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Link placeholder - Please update with actual URL');
        });
    }
});

// ============================================
// KEYBOARD NAVIGATION
// ============================================
document.addEventListener('keydown', (e) => {
    // Arrow keys for page navigation
    if (e.key === 'ArrowRight') {
        const visibleNextBtn = Array.from(document.querySelectorAll('.nextprev-btn:not(.back)'))
            .find(btn => {
                const parent = btn.closest('.book-page');
                return parent && !parent.classList.contains('turn');
            });
        if (visibleNextBtn) visibleNextBtn.click();
    }
    
    if (e.key === 'ArrowLeft') {
        const visibleBackBtn = Array.from(document.querySelectorAll('.nextprev-btn.back'))
            .find(btn => {
                const parent = btn.closest('.book-page');
                return parent && parent.classList.contains('turn');
            });
        if (visibleBackBtn) visibleBackBtn.click();
    }
    
    // Home key to go back to profile
    if (e.key === 'Home' && backProfileBtn) {
        backProfileBtn.click();
    }
    
    // End key to go to contact
    if (e.key === 'End' && contactMeBtn) {
        contactMeBtn.click();
    }
});

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log('%c👋 Welcome to Tejo Sridhar M V S Portfolio!', 'color: #dc2626; font-size: 20px; font-weight: bold;');
console.log('%c🚀 AIML Enthusiast | Building the future with AI & Machine Learning', 'color: #6b7280; font-size: 14px;');
console.log('%c💼 Connect with me:', 'color: #dc2626; font-size: 14px; font-weight: bold;');
console.log('📧 Email: tejosridhar.mvs@gmail.com');
console.log('🔗 LinkedIn: https://www.linkedin.com/in/tejosridhar');
console.log('💻 GitHub: https://github.com/Tejo0507');

// ============================================
// PERFORMANCE MONITORING (Optional)
// ============================================
window.addEventListener('load', () => {
    const loadTime = performance.now();
    console.log(`⚡ Page loaded in ${Math.round(loadTime)}ms`);
});
