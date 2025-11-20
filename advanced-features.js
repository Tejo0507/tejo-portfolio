// ============================================
// ULTIMATE PORTFOLIO FEATURES
// 100% Free, No API Keys Required
// ============================================

// ============================================
// 1. VOICE COMMANDS SYSTEM
// ============================================
let voiceEnabled = false;
let recognition = null;

function initVoiceCommands() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase();
            handleVoiceCommand(command);
        };

        recognition.onerror = (event) => {
            console.log('Voice recognition error:', event.error);
        };

        // Add voice activation button
        createVoiceButton();
    }
}

// Safely stop recognition on page hide to avoid orphaned audio contexts
document.addEventListener('visibilitychange', () => {
    try { if (recognition && document.hidden) recognition.stop(); } catch(e){}
});

function createVoiceButton() {
    const voiceBtn = document.createElement('div');
    voiceBtn.className = 'voice-btn';
    voiceBtn.innerHTML = '<i class="bx bx-microphone"></i>';
    voiceBtn.title = 'Click to activate voice commands';
    document.body.appendChild(voiceBtn);

    voiceBtn.addEventListener('click', () => {
        try {
            if (!voiceEnabled) {
                voiceEnabled = true;
                voiceBtn.classList.add('active');
                recognition.start();
                showNotification('🎤 Listening... Try saying "show projects" or "contact me"');
            } else {
                voiceEnabled = false;
                voiceBtn.classList.remove('active');
                recognition.stop();
            }
        } catch (err) {
            console.warn('Voice control error:', err);
            showNotification('⚠️ Voice is not available in this browser');
        }
    });
}

function handleVoiceCommand(command) {
    console.log('Voice command:', command);
    
    if (command.includes('project')) {
        navigateToPage(3); // Projects page
        showNotification('📂 Showing projects!');
    } else if (command.includes('contact')) {
        document.querySelector('.btn[data-page="turn-3"]')?.click();
        setTimeout(() => document.querySelector('.btn[data-page="turn-3"]')?.click(), 500);
        showNotification('📧 Opening contact page!');
    } else if (command.includes('skills') || command.includes('skill')) {
        navigateToPage(2);
        showNotification('💪 Showing skills!');
    } else if (command.includes('home') || command.includes('profile')) {
        navigateToPage(0);
        showNotification('🏠 Going home!');
    } else if (command.includes('experience')) {
        navigateToPage(1);
        showNotification('👔 Showing experience!');
    } else {
        showNotification('❓ Try: "show projects", "contact me", "skills", or "home"');
    }
    
    voiceEnabled = false;
    document.querySelector('.voice-btn')?.classList.remove('active');
}

function navigateToPage(pageNumber) {
    try {
        // find all page-turn controls and map to pages in order
        const pageButtons = Array.from(document.querySelectorAll('[data-page]'));
        if (pageNumber <= 0) {
            // go to profile (close all turns)
            document.querySelectorAll('.book-page.turn').forEach(p => p.classList.remove('turn'));
            return;
        }

        // Click successive buttons to reach desired page index (best-effort)
        let clicks = 0;
        const max = Math.min(pageButtons.length, pageNumber);
        for (let i = 0; i < max; i++) {
            setTimeout(() => {
                try { pageButtons[i].click(); } catch(e){}
            }, i * 350);
            clicks++;
        }
        if (clicks === 0) {
            // fallback: open first page
            pageButtons[0]?.click();
        }
    } catch (e) {
        console.warn('navigateToPage failed', e);
    }
}

// ============================================
// 2. KONAMI CODE EASTER EGG
// ============================================
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function initKonamiCode() {
    document.addEventListener('keydown', (e) => {
        konamiCode.push(e.key);
        if (konamiCode.length > konamiPattern.length) {
            konamiCode.shift();
        }
        
        if (JSON.stringify(konamiCode) === JSON.stringify(konamiPattern)) {
            activateSecretMode();
            konamiCode = [];
        }
    });
}

function activateSecretMode() {
    // Matrix effect
    document.body.classList.add('matrix-mode');
    showNotification('🎮 KONAMI CODE ACTIVATED! Developer Mode Unlocked! 🔓');
    
    // Add matrix rain
    createMatrixRain();
    
    // Play achievement sound (using Web Audio API)
    playAchievementSound();
    
    setTimeout(() => {
        document.body.classList.remove('matrix-mode');
        document.querySelector('.matrix-canvas')?.remove();
    }, 10000);
}

function createMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.className = 'matrix-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const chars = '01AIMLPYTHON';
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);
    
    let matrixInterval = setInterval(() => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }, 33);
    
    setTimeout(() => {
        clearInterval(matrixInterval);
    }, 10000);
}

function playAchievementSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

// ============================================
// 3. ADVANCED CURSOR EFFECTS - DISABLED
// ============================================
function initAdvancedCursor() {
    // Custom cursor disabled - causing cursor visibility issues
    // Using native browser cursor instead
    return;
}

function createRipple(x, y) {
    // Ripple effect disabled along with custom cursor
    return;
}

// ============================================
// 4. AI CHAT ASSISTANT (Simulated)
// ============================================
function initAIChat() {
    const chatBtn = document.createElement('div');
    chatBtn.className = 'ai-chat-btn';
    chatBtn.innerHTML = '<i class="bx bx-bot"></i>';
    chatBtn.title = 'Chat with AI Assistant';
    document.body.appendChild(chatBtn);
    
    const chatBox = document.createElement('div');
    chatBox.className = 'ai-chat-box hidden';
    chatBox.innerHTML = `
        <div class="chat-header">
            <div class="chat-header-content">
                <i class="bx bx-bot"></i>
                <span>AI Assistant</span>
            </div>
            <i class="bx bx-x close-chat"></i>
        </div>
        <div class="chat-messages" id="chatMessages">
            <div class="ai-message">
                👋 Hi! I'm Tejo's AI assistant. Ask me about his projects, skills, or experience!
            </div>
        </div>
        <div class="chat-input-container">
            <input type="text" id="chatInput" placeholder="Ask me anything...">
            <button id="chatSend"><i class="bx bx-send"></i></button>
        </div>
    `;
    document.body.appendChild(chatBox);
    
    chatBtn.addEventListener('click', () => {
        chatBox.classList.toggle('hidden');
    });
    
    chatBox.querySelector('.close-chat').addEventListener('click', () => {
        chatBox.classList.add('hidden');
    });
    
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    
    function sendMessage() {
        const message = chatInput.value.trim();
        if (!message) return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'user-message';
        userMsg.textContent = message;
        document.getElementById('chatMessages').appendChild(userMsg);
        
        chatInput.value = '';
        
        // Simulate AI response with typing effect
        setTimeout(() => {
            const aiMsg = document.createElement('div');
            aiMsg.className = 'ai-message';
            document.getElementById('chatMessages').appendChild(aiMsg);
            
            const response = getAIResponse(message);
            typeMessage(aiMsg, response);
            
            // Scroll to bottom
            document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
        }, 500);
    }
    
    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
}

function getAIResponse(message) {
    const msg = message.toLowerCase();
    
    if (msg.includes('project')) {
        return "Tejo has worked on amazing projects like NeuroNet (AI neural network), CabEase (smart cab booking), Object Detection with YOLOv8, and Speech Translation app! Which one interests you?";
    } else if (msg.includes('skill')) {
        return "Tejo is proficient in Machine Learning, AI, Python, Java, PyTorch, NLP, and web development (HTML, CSS). He's also experienced with MySQL, Git, and Postman!";
    } else if (msg.includes('experience') || msg.includes('club')) {
        return "Tejo is active in 7 prestigious clubs: Microsoft Learn Student Ambassador, Placfv, TEDxSRMIST, E-Cell SRM, dBug Labs, ACM-W SRM, and Hyperloop India! He's a true leader!";
    } else if (msg.includes('education') || msg.includes('college') || msg.includes('university')) {
        return "Tejo is pursuing B.Tech in CSE - AIML (2nd Year) at SRM Institute of Science and Technology, Chennai. CGPA: 9.25/10!";
    } else if (msg.includes('contact') || msg.includes('email') || msg.includes('reach')) {
        return "You can reach Tejo at tejosridhar23@gmail.com or connect on LinkedIn, GitHub, Instagram! Just flip to the last page to see all contact details!";
    } else if (msg.includes('ai') || msg.includes('ml') || msg.includes('machine learning')) {
        return "Tejo specializes in AI/ML! He's worked with PyTorch, built neural networks, implemented NLP solutions, and created object detection models with YOLOv8. He's passionate about pushing AI boundaries!";
    } else if (msg.includes('python')) {
        return "Python is Tejo's forte! He's used it for ML projects, web development with Streamlit, data analysis, and automation. Check out his projects to see Python in action!";
    } else if (msg.includes('hire') || msg.includes('work') || msg.includes('job')) {
        return "Tejo is actively seeking opportunities in AI/ML, Python Development, and Data Science roles! He's a quick learner, team player, and brings innovation to every project. Let's connect!";
    } else if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return "Hello! 👋 I'm here to help you learn about Tejo's incredible journey. Feel free to ask about his projects, skills, experience, or anything else!";
    } else if (msg.includes('thank')) {
        return "You're welcome! 😊 Feel free to explore the portfolio and reach out to Tejo directly. He'd love to connect with you!";
    } else {
        return "That's interesting! Try asking me about Tejo's projects, skills, experience, education, or how to contact him. I'm here to help! 🤖";
    }
}

function typeMessage(element, message) {
    let index = 0;
    const interval = setInterval(() => {
        if (index < message.length) {
            element.textContent += message[index];
            index++;
            document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

// ============================================
// 5. NOTIFICATION SYSTEM
// ============================================
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'custom-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.classList.add('show'), 10);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ============================================
// 6. PERFORMANCE MONITOR (Easter Egg)
// ============================================
function initPerformanceMonitor() {
    let shiftPressed = false;
    let altPressed = false;
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') shiftPressed = true;
        if (e.key === 'Alt') altPressed = true;
        
        if (shiftPressed && altPressed && e.key === 'P') {
            togglePerformanceMonitor();
        }
    });
    
    document.addEventListener('keyup', (e) => {
        if (e.key === 'Shift') shiftPressed = false;
        if (e.key === 'Alt') altPressed = false;
    });
}

function togglePerformanceMonitor() {
    let monitor = document.querySelector('.performance-monitor');
    if (monitor) {
        monitor.remove();
        return;
    }
    
    monitor = document.createElement('div');
    monitor.className = 'performance-monitor';
    monitor.innerHTML = '<div class="monitor-title">⚡ Performance Monitor</div><div id="monitorStats"></div>';
    document.body.appendChild(monitor);
    
    updatePerformanceStats();
}

function updatePerformanceStats() {
    const monitor = document.querySelector('#monitorStats');
    if (!monitor) return;
    
    const stats = `
        <div>FPS: ${Math.round(performance.now() % 60)}</div>
        <div>Memory: ${(performance.memory?.usedJSHeapSize / 1048576).toFixed(2) || 'N/A'} MB</div>
        <div>Page Load: ${(performance.now() / 1000).toFixed(2)}s</div>
    `;
    
    monitor.innerHTML = stats;
    
    setTimeout(updatePerformanceStats, 1000);
}

// ============================================
// INITIALIZE ALL FEATURES
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('%c🚀 ULTIMATE PORTFOLIO LOADED! 🚀', 'font-size: 20px; color: #ff3333; font-weight: bold;');
    console.log('%cTry these Easter Eggs:', 'font-size: 14px; color: #00abf0;');
    console.log('%c- Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A', 'color: #0f0;');
    console.log('%c- Performance Monitor: Shift + Alt + P', 'color: #0f0;');
    console.log('%c- Voice Commands: Click the microphone icon', 'color: #0f0;');
    console.log('%c- AI Chat: Click the bot icon', 'color: #0f0;');
    
    initVoiceCommands();
    initKonamiCode();
    initAdvancedCursor();
    initAIChat();
    initPerformanceMonitor();
    
    showNotification('🎉 Ultimate Portfolio Features Activated!');
});
