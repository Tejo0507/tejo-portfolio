// ============================================
// THREE.JS 3D PARTICLE UNIVERSE
// Lightweight, No CDN Required
// ============================================

(function() {
    // Canvas-based 3D particle system (Pure WebGL alternative)
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-universe';
    canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        pointer-events: none;
        opacity: 0.25;
    `;
    document.body.insertBefore(canvas, document.body.firstChild);
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0;
    let mouseY = 0;
    
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle3D {
        constructor() {
            this.reset();
            this.z = Math.random() * 1000;
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.z = Math.random() * 1000;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.vz = (Math.random() - 0.5) * 2;
            this.size = Math.random() * 2 + 1;
            this.color = `hsla(${Math.random() * 30 + 10}, 70%, 60%, `;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.z += this.vz;
            
            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                this.x -= dx * 0.01;
                this.y -= dy * 0.01;
            }
            
            // Wrap around
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
            if (this.z < 0 || this.z > 1000) this.reset();
        }
        
        draw() {
            const scale = 1000 / (1000 - this.z);
            const x2d = (this.x - canvas.width / 2) * scale + canvas.width / 2;
            const y2d = (this.y - canvas.height / 2) * scale + canvas.height / 2;
            const size2d = this.size * scale;
            const alpha = (1000 - this.z) / 1000 * 0.8;
            
            ctx.fillStyle = this.color + alpha + ')';
            ctx.beginPath();
            ctx.arc(x2d, y2d, size2d, 0, Math.PI * 2);
            ctx.fill();
            
            // Glow effect
            ctx.shadowBlur = 10 * scale;
            ctx.shadowColor = this.color + alpha + ')';
        }
    }
    
    // Create particles (reduced for better balance and performance)
    for (let i = 0; i < 120; i++) {
        particles.push(new Particle3D());
    }
    
    // Mouse tracking
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Animation loop
    function animate() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        ctx.shadowBlur = 0;
        particles.forEach((p1, i) => {
            particles.slice(i + 1).forEach(p2 => {
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    const alpha = (1 - distance / 150) * 0.2;
                    ctx.strokeStyle = `rgba(204, 59, 43, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
})();

// ============================================
// SCROLL PROGRESS INDICATOR
// ============================================
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Update on page turn
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            setTimeout(updateScrollProgress, 300);
        });
    });
}

function updateScrollProgress() {
    const totalPages = 6;
    const currentPage = document.querySelectorAll('.turn.flipped').length;
    const progress = (currentPage / totalPages) * 100;
    
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = progress + '%';
    }
}

// ============================================
// SHAKE ANIMATION ON ERROR/EMPTY FIELD
// ============================================
function addShakeAnimation() {
    document.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('invalid', (e) => {
            e.target.classList.add('shake');
            setTimeout(() => e.target.classList.remove('shake'), 500);
        });
    });
}

// ============================================
// FIREWORKS ON CONTACT BUTTON CLICK
// ============================================
function initFireworks() {
    const contactBtn = document.querySelector('.btn-box.btns .btn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            createFireworks();
        });
    }
}

function createFireworks() {
    const colors = ['#ff3333', '#ff6666', '#ff9999', '#ffcc00', '#00ff00'];
    
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.5;
            
            for (let j = 0; j < 30; j++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';
                particle.style.left = x + 'px';
                particle.style.top = y + 'px';
                particle.style.background = colors[Math.floor(Math.random() * colors.length)];
                
                const angle = (Math.PI * 2 * j) / 30;
                const velocity = Math.random() * 100 + 50;
                const vx = Math.cos(angle) * velocity;
                const vy = Math.sin(angle) * velocity;
                
                particle.style.setProperty('--vx', vx + 'px');
                particle.style.setProperty('--vy', vy + 'px');
                
                document.body.appendChild(particle);
                
                setTimeout(() => particle.remove(), 1000);
            }
        }, i * 200);
    }
}

// ============================================
// DYNAMIC THEME SWITCHER (Secret)
// ============================================
let themeIndex = 0;
const themes = [
    { primary: '#cc3b2b', secondary: '#d14a37', name: 'Red' },
    { primary: '#00abf0', secondary: '#0088cc', name: 'Blue' },
    { primary: '#9b59b6', secondary: '#8e44ad', name: 'Purple' },
    { primary: '#e74c3c', secondary: '#c0392b', name: 'Crimson' },
    { primary: '#2ecc71', secondary: '#27ae60', name: 'Green' },
    { primary: '#f39c12', secondary: '#e67e22', name: 'Orange' }
];

function initThemeSwitcher() {
    let clickCount = 0;
    const logo = document.querySelector('.logo');
    
    if (logo) {
        logo.addEventListener('click', () => {
            clickCount++;
            
            if (clickCount === 5) {
                themeIndex = (themeIndex + 1) % themes.length;
                const theme = themes[themeIndex];
                
                document.documentElement.style.setProperty('--main-color', theme.primary);
                showNotification(`🎨 Theme changed to ${theme.name}!`);
                
                clickCount = 0;
            }
            
            setTimeout(() => clickCount = 0, 2000);
        });
    }
}

// ============================================
// PAGE FLIP SOUND (Optional Web Audio)
// ============================================
function playPageFlipSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Add sound to page turns
function addPageFlipSounds() {
    document.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', playPageFlipSound);
    });
}

// ============================================
// INITIALIZE ADDITIONAL FEATURES
// ============================================
setTimeout(() => {
    initScrollProgress();
    addShakeAnimation();
    initFireworks();
    initThemeSwitcher();
    addPageFlipSounds();
    updateScrollProgress();
    
    console.log('%c🎨 Additional Features Loaded!', 'font-size: 16px; color: #9b59b6;');
    console.log('%c- Click logo 5 times to change theme', 'color: #0f0;');
    console.log('%c- Fireworks on contact button click', 'color: #0f0;');
    console.log('%c- Page flip sounds enabled', 'color: #0f0;');
}, 1000);
