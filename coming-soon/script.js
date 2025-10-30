// ========================================
// PropellerAI Coming Soon Page - Script
// ========================================

// EmailJS Setup Instructions:
// 1. Go to https://www.emailjs.com/
// 2. Create a free account
// 3. Get your Public Key from Account > General
// 4. Create an email template with these variables:
//    - {{to_email}} - Recipient email
//    - {{user_email}} - User's email
//    - {{to_name}} - User's name
//    - {{from_name}} - PropellerAI Team
//    - {{message}} - Welcome message
//    - {{reply_to}} - Your reply email
// 5. Replace 'YOUR_PUBLIC_KEY' below with your actual public key
// 6. Replace 'YOUR_TEMPLATE_ID' in the sendEmailJSNotification function
// Service ID: service_b6k02fq (already configured)

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 PropellerAI Coming Soon - Page loaded');
    
    // Initialize EmailJS (uncomment and add your public key when ready)
    // emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your EmailJS public key
    
    try {
        initLoadingScreen();
        console.log('✓ Loading screen initialized');
    } catch (e) {
        console.error('✗ Loading screen error:', e);
    }
    
    try {
        initParticles();
        console.log('✓ Particles initialized');
    } catch (e) {
        console.error('✗ Particles error:', e);
    }
    
    try {
        initScrollAnimations();
        console.log('✓ Scroll animations initialized');
    } catch (e) {
        console.error('✗ Scroll animations error:', e);
    }
    
    try {
        initProgressBar();
        console.log('✓ Progress bar initialized');
    } catch (e) {
        console.error('✗ Progress bar error:', e);
    }
    
    try {
        initWaitlistForm();
        console.log('✓ Waitlist form initialized');
    } catch (e) {
        console.error('✗ Waitlist form error:', e);
    }
    
    try {
        initEasterEgg();
        console.log('✓ Easter egg initialized');
    } catch (e) {
        console.error('✗ Easter egg error:', e);
    }
    
    try {
        initFloatingBubble();
        console.log('✓ Floating bubble initialized');
    } catch (e) {
        console.error('✗ Floating bubble error:', e);
    }
    
    try {
        initSmoothScroll();
        console.log('✓ Smooth scroll initialized');
    } catch (e) {
        console.error('✗ Smooth scroll error:', e);
    }
});

// ========================================
// Loading Screen
// ========================================
function initLoadingScreen() {
    const loadingScreen = document.querySelector('.loading-screen');
    
    if (!loadingScreen) return;
    
    // Hide loading screen after page loads
    const hideLoading = () => {
        setTimeout(() => {
            loadingScreen.classList.add('hide');
            // Remove from DOM after animation
            setTimeout(() => {
                if (loadingScreen.parentNode) {
                    loadingScreen.remove();
                }
            }, 500);
        }, 800);
    };
    
    // Try both window load and DOMContentLoaded
    if (document.readyState === 'complete') {
        hideLoading();
    } else {
        window.addEventListener('load', hideLoading);
        // Fallback: hide after 2 seconds no matter what
        setTimeout(hideLoading, 2000);
    }
}

// ========================================
// Particle System
// ========================================
function initParticles() {
    const particlesContainer = document.querySelector('.particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size
        const size = Math.random() * 3 + 1;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        
        // Random delay
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            position: absolute;
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            background: rgba(16, 185, 129, 0.3);
            border-radius: 50%;
            animation: float-particle ${duration}s infinite ease-in-out;
            animation-delay: ${delay}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
    
    // Add particle animation to stylesheet
    if (!document.getElementById('particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float-particle {
                0%, 100% {
                    transform: translate(0, 0);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                90% {
                    opacity: 1;
                }
                100% {
                    transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// Scroll Animations
// ========================================
function initScrollAnimations() {
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
    
    // Observe all elements with fade-in-up class
    document.querySelectorAll('.fade-in-up').forEach(el => {
        observer.observe(el);
    });
    
    // Observe feature cards
    document.querySelectorAll('.feature-card, .feature-item, .timeline-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });
}

// ========================================
// Progress Bar Animation
// ========================================
function initProgressBar() {
    const progressFill = document.querySelector('.progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    
    if (!progressFill || !progressPercentage) return;
    
    const targetProgress = 85; // 85% completion
    let currentProgress = 0;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate progress bar
                progressFill.style.setProperty('--progress', targetProgress + '%');
                
                // Animate counter
                const duration = 2000; // 2 seconds
                const increment = targetProgress / (duration / 16); // 60fps
                
                const counter = setInterval(() => {
                    currentProgress += increment;
                    if (currentProgress >= targetProgress) {
                        currentProgress = targetProgress;
                        clearInterval(counter);
                    }
                    progressPercentage.textContent = Math.round(currentProgress) + '%';
                }, 16);
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        observer.observe(progressContainer);
    }
}

// ========================================
// Waitlist Form
// ========================================
function initWaitlistForm() {
    const form = document.querySelector('.waitlist-form');
    const emailInput = document.querySelector('.waitlist-input');
    const submitButton = document.querySelector('.waitlist-submit');
    
    if (!form || !emailInput || !submitButton) return;
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Validate email
        if (!isValidEmail(email)) {
            showMessage('Please enter a valid email address', 'error');
            return;
        }
        
        // Disable button during submission
        submitButton.disabled = true;
        const originalText = submitButton.innerHTML;
        submitButton.innerHTML = '<span>Joining...</span> ⏳';
        
        try {
            // Send email via EmailJS
            await sendEmailJSNotification(email);
            
            // Success
            showMessage('🎉 Welcome to the waitlist! Check your email for confirmation.', 'success');
            emailInput.value = '';
            
            // Track conversion (optional)
            trackWaitlistSignup(email);
            
        } catch (error) {
            console.error('EmailJS Error:', error);
            showMessage('Oops! Something went wrong. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.innerHTML = originalText;
        }
    });
}

// Send email using EmailJS
async function sendEmailJSNotification(email) {
    // Check if EmailJS is available
    if (typeof emailjs === 'undefined') {
        console.warn('EmailJS not initialized. Email will not be sent.');
        console.log('Waitlist signup:', email);
        return { status: 200, text: 'OK (EmailJS not configured)' };
    }
    
    const templateParams = {
        to_email: email,                    // Send TO the user's email
        user_email: email,                   // User's email address
        to_name: email.split('@')[0],       // User's name from email
        from_name: 'PropellerAI Team',      // From PropellerAI
        message: 'Thank you for joining our waitlist! We\'re excited to have you on board.',
        reply_to: email                      // Reply will go to the user's email
    };
    
    try {
        const response = await emailjs.send(
            'service_b6k02fq',  // Your service ID
            'YOUR_TEMPLATE_ID',  // Replace with your EmailJS template ID
            templateParams
        );
        
        console.log('Email sent successfully to:', email, response.status, response.text);
        return response;
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}

function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.textContent = message;
    messageEl.style.cssText = `
        padding: 1rem;
        margin-top: 1rem;
        border-radius: 0.75rem;
        text-align: center;
        font-weight: 500;
        animation: fadeInUp 0.3s ease-out;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)'};
        color: ${type === 'success' ? '#10b981' : '#ef4444'};
        border: 1px solid ${type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'};
    `;
    
    const form = document.querySelector('.waitlist-form');
    form.appendChild(messageEl);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageEl.style.animation = 'fadeOut 0.3s ease-out';
        setTimeout(() => messageEl.remove(), 300);
    }, 5000);
}

function trackWaitlistSignup(email) {
    // Add analytics tracking here
    // Example: Google Analytics, Mixpanel, etc.
    console.log('Tracking signup:', email);
}

// ========================================
// Easter Egg
// ========================================
function initEasterEgg() {
    const logo = document.querySelector('.hero-logo');
    const modal = document.querySelector('.easter-egg-modal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (!logo || !modal || !closeBtn) return;
    
    let clickCount = 0;
    let clickTimer;
    
    logo.addEventListener('click', () => {
        clickCount++;
        
        // Reset counter after 2 seconds
        clearTimeout(clickTimer);
        clickTimer = setTimeout(() => {
            clickCount = 0;
        }, 2000);
        
        // Show easter egg after 3 clicks
        if (clickCount >= 3) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            clickCount = 0;
            
            // Add confetti effect
            createConfetti();
        }
    });
    
    // Close modal
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
    
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

function createConfetti() {
    const confettiCount = 50;
    const colors = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'];
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            top: -10px;
            left: ${Math.random() * 100}%;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            transform: rotate(${Math.random() * 360}deg);
            animation: confetti-fall ${Math.random() * 3 + 2}s linear forwards;
            z-index: 10001;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
    
    // Add confetti animation if not exists
    if (!document.getElementById('confetti-animation')) {
        const style = document.createElement('style');
        style.id = 'confetti-animation';
        style.textContent = `
            @keyframes confetti-fall {
                to {
                    top: 100vh;
                    transform: translateY(100vh) rotate(720deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// Floating Bubble
// ========================================
function initFloatingBubble() {
    const bubble = document.querySelector('.floating-bubble');
    
    if (!bubble) return;
    
    // Animate bubble on load
    setTimeout(() => {
        bubble.style.animation = 'float-bubble 3s infinite ease-in-out, slideInRight 0.5s ease-out';
    }, 3000);
    
    // Close bubble on click
    bubble.addEventListener('click', () => {
        bubble.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            bubble.style.display = 'none';
        }, 300);
    });
    
    // Add slide animations
    if (!document.getElementById('slide-animation')) {
        const style = document.createElement('style');
        style.id = 'slide-animation';
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// Smooth Scroll
// ========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offset = 80; // Account for fixed navbar
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// Scroll Indicator
// ========================================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(10, 14, 26, 0.95)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(10, 14, 26, 0.8)';
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ========================================
// Feature Card Hover Effects
// ========================================
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(-5px) scale(1)';
    });
});

// ========================================
// Timeline Animation
// ========================================
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateX(0)';
                }, index * 150);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    timelineItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateX(-50px)';
        item.style.transition = 'all 0.6s ease-out';
        observer.observe(item);
    });
}

animateTimeline();

// ========================================
// Copy Email on Click (Footer)
// ========================================
const contactEmail = document.querySelector('.footer-copy .highlight');
if (contactEmail) {
    contactEmail.style.cursor = 'pointer';
    contactEmail.title = 'Click to copy';
    
    contactEmail.addEventListener('click', () => {
        const email = 'yajat4414@gmail.com'; // Update with actual email
        navigator.clipboard.writeText(email).then(() => {
            const originalText = contactEmail.textContent;
            contactEmail.textContent = 'Email copied! ✓';
            setTimeout(() => {
                contactEmail.textContent = originalText;
            }, 2000);
        });
    });
}

// ========================================
// Console Easter Egg
// ========================================
console.log('%c🚀 PropellerAI Coming Soon!', 'color: #10b981; font-size: 24px; font-weight: bold;');
console.log('%cInterested in joining our team?', 'color: #3b82f6; font-size: 16px;');
console.log('%cReach out to us at: yajat4414@gmail.com', 'color: #9ca3af; font-size: 14px;');
console.log('%cP.S. Try clicking the logo 3 times... 😉', 'color: #8b5cf6; font-size: 12px; font-style: italic;');

// ========================================
// Performance Monitoring
// ========================================
if ('performance' in window) {
    window.addEventListener('load', () => {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
    });
}

// ========================================
// Keyboard Shortcuts
// ========================================
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K to focus waitlist input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const waitlistInput = document.querySelector('.waitlist-input');
        if (waitlistInput) {
            waitlistInput.focus();
            waitlistInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
    
    // Konami Code Easter Egg (↑ ↑ ↓ ↓ ← → ← → B A)
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiPosition = 0;
    
    if (e.key === konamiCode[konamiPosition]) {
        konamiPosition++;
        if (konamiPosition === konamiCode.length) {
            activateKonamiMode();
            konamiPosition = 0;
        }
    } else {
        konamiPosition = 0;
    }
});

function activateKonamiMode() {
    document.body.style.animation = 'rainbow 5s linear infinite';
    
    if (!document.getElementById('rainbow-animation')) {
        const style = document.createElement('style');
        style.id = 'rainbow-animation';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    showMessage('🎮 Konami Code Activated! Rainbow Mode ON!', 'success');
    
    setTimeout(() => {
        document.body.style.animation = '';
    }, 5000);
}

// ========================================
// Dark Mode Toggle (Hidden Feature)
// ========================================
let darkModeClicks = 0;
const footerLogo = document.querySelector('.footer-logo img');

if (footerLogo) {
    footerLogo.addEventListener('click', () => {
        darkModeClicks++;
        if (darkModeClicks >= 5) {
            document.body.style.filter = document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
            darkModeClicks = 0;
        }
    });
}

// ========================================
// Social Link Tracking
// ========================================
document.querySelectorAll('.social-icon').forEach(icon => {
    icon.addEventListener('click', function(e) {
        const platform = this.getAttribute('aria-label');
        console.log(`Social click: ${platform}`);
        // Add analytics tracking here
    });
});

// ========================================
// Export functions for testing (optional)
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isValidEmail,
        showMessage,
        createConfetti
    };
}
