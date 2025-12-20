/**
 * ULTRA GURU - Premium Landing Page JavaScript
 * Apple-Inspired Interactions with Cyberpunk Aesthetics
 */

// ================================================
// Performance Utilities
// ================================================
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
};

const isMobile = window.matchMedia('(max-width: 768px)').matches;

// ================================================
// Cursor Glow Effect
// ================================================
class CursorGlow {
    constructor() {
        // Skip on mobile/touch devices
        if (isMobile || !window.matchMedia('(pointer: fine)').matches) return;
        
        this.cursor = document.getElementById('cursorGlow');
        if (!this.cursor) return;
        
        this.position = { x: 0, y: 0 };
        this.targetPosition = { x: 0, y: 0 };
        this.init();
    }

    init() {
        document.addEventListener('mousemove', (e) => {
            this.targetPosition.x = e.clientX;
            this.targetPosition.y = e.clientY;
            this.cursor.style.opacity = '1';
        });
        this.animate();
    }

    animate() {
        // Smooth follow with lerp
        this.position.x += (this.targetPosition.x - this.position.x) * 0.1;
        this.position.y += (this.targetPosition.y - this.position.y) * 0.1;
        
        this.cursor.style.left = `${this.position.x}px`;
        this.cursor.style.top = `${this.position.y}px`;
        
        requestAnimationFrame(() => this.animate());
    }
}

// ================================================
// Particle Background
// ================================================
class ParticleBackground {
    constructor() {
        // Skip particles on mobile for performance
        if (isMobile) return;
        
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null, radius: 150 };
        this.init();
    }

    init() {
        this.resize();
        // Debounce resize to prevent layout thrashing
        window.addEventListener('resize', debounce(() => this.resize(), 250));
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });

        this.createParticles();
        this.animate();
    }

    resize() {
        // Cache dimensions to avoid multiple reflows
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    createParticles() {
        const numberOfParticles = Math.floor((this.canvas.width * this.canvas.height) / 15000);
        
        for (let i = 0; i < numberOfParticles; i++) {
            const size = Math.random() * 2 + 0.5;
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            const directionX = (Math.random() * 0.4) - 0.2;
            const directionY = (Math.random() * 0.4) - 0.2;
            
            // Random color from brand palette
            const colors = ['rgba(0, 245, 255, ', 'rgba(191, 0, 255, ', 'rgba(255, 0, 110, '];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            this.particles.push({
                x, y, size, directionX, directionY, color,
                originalX: x,
                originalY: y
            });
        }
    }

    drawParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            // Calculate distance from mouse
            let dx = this.mouse.x - p.x;
            let dy = this.mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            // Particle push effect
            if (distance < this.mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (this.mouse.radius - distance) / this.mouse.radius;
                
                p.x -= forceDirectionX * force * 2;
                p.y -= forceDirectionY * force * 2;
            } else {
                // Return to original position slowly
                if (p.x !== p.originalX) {
                    let dx = p.x - p.originalX;
                    p.x -= dx / 20;
                }
                if (p.y !== p.originalY) {
                    let dy = p.y - p.originalY;
                    p.y -= dy / 20;
                }
            }
            
            // Calculate opacity based on distance for glow effect
            let opacity = 0.3;
            if (distance < this.mouse.radius * 2) {
                opacity = 0.8 - (distance / (this.mouse.radius * 2)) * 0.5;
            }
            
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color + opacity + ')';
            this.ctx.fill();
        }
    }

    moveParticles() {
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            
            p.originalX += p.directionX;
            p.originalY += p.directionY;
            
            // Bounce off edges
            if (p.originalX > this.canvas.width || p.originalX < 0) {
                p.directionX = -p.directionX;
            }
            if (p.originalY > this.canvas.height || p.originalY < 0) {
                p.directionY = -p.directionY;
            }
        }
    }

    connectParticles() {
        for (let a = 0; a < this.particles.length; a++) {
            for (let b = a + 1; b < this.particles.length; b++) {
                const dx = this.particles[a].x - this.particles[b].x;
                const dy = this.particles[a].y - this.particles[b].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 120) {
                    const opacity = 1 - (distance / 120);
                    this.ctx.strokeStyle = `rgba(0, 245, 255, ${opacity * 0.1})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[a].x, this.particles[a].y);
                    this.ctx.lineTo(this.particles[b].x, this.particles[b].y);
                    this.ctx.stroke();
                }
            }
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawParticles();
        this.moveParticles();
        this.connectParticles();
        requestAnimationFrame(() => this.animate());
    }
}

// ================================================
// Navigation Scroll Effect
// ================================================
class Navigation {
    constructor() {
        this.nav = document.getElementById('nav');
        this.lastScroll = 0;
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 50) {
            this.nav.classList.add('scrolled');
        } else {
            this.nav.classList.remove('scrolled');
        }
        
        this.lastScroll = currentScroll;
    }
}

// ================================================
// Scroll Animations (AOS-like) - Performance Optimized
// ================================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('[data-aos]');
        this.observed = new Set();
        this.init();
    }

    init() {
        // Use IntersectionObserver - supported in all modern browsers
        if ('IntersectionObserver' in window) {
            const observerOptions = {
                root: null,
                rootMargin: '50px 0px',
                threshold: 0.1
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !this.observed.has(entry.target)) {
                        this.observed.add(entry.target);
                        const delay = entry.target.dataset.aosDelay || 0;
                        setTimeout(() => {
                            entry.target.classList.add('aos-animate');
                        }, parseInt(delay));
                    }
                });
            }, observerOptions);

            this.elements.forEach((element) => {
                observer.observe(element);
            });
        } else {
            // Fallback for very old browsers - show all elements immediately
            this.elements.forEach((element) => {
                element.classList.add('aos-animate');
            });
        }
    }
}

// ================================================
// Product 3D Tilt Effect
// ================================================
class ProductTilt {
    constructor() {
        this.showcase = document.getElementById('productShowcase');
        this.container = this.showcase?.querySelector('.product-container');
        this.init();
    }

    init() {
        if (!this.showcase || !this.container) return;

        this.showcase.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.showcase.addEventListener('mouseleave', () => this.handleMouseLeave());
    }

    handleMouseMove(e) {
        // 3D tilt effect disabled - only scale on hover via CSS
    }

    handleMouseLeave() {
        // 3D tilt effect disabled - only scale on hover via CSS
    }
}

// ================================================
// Magnetic Button Effect
// ================================================
class MagneticElements {
    constructor() {
        this.elements = document.querySelectorAll('[data-magnetic]');
        this.init();
    }

    init() {
        this.elements.forEach((element) => {
            element.addEventListener('mousemove', (e) => this.handleMouseMove(e, element));
            element.addEventListener('mouseleave', () => this.handleMouseLeave(element));
        });
    }

    handleMouseMove(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        element.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
        
        // Move glow
        const glow = element.querySelector('.benefit-glow');
        if (glow) {
            glow.style.left = `${e.clientX - rect.left}px`;
            glow.style.top = `${e.clientY - rect.top}px`;
        }
    }

    handleMouseLeave(element) {
        element.style.transform = 'translate(0, 0)';
    }
}

// ================================================
// Tilt Cards
// ================================================
class TiltCards {
    constructor() {
        this.cards = document.querySelectorAll('[data-tilt]');
        this.init();
    }

    init() {
        this.cards.forEach((card) => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 15;
        const rotateY = (centerX - x) / 15;
        
        card.style.transform = `
            perspective(1000px)
            rotateX(${-rotateX}deg)
            rotateY(${-rotateY}deg)
            translateY(-8px)
        `;
    }

    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    }
}

// ================================================
// Counter Animation
// ================================================
class CounterAnimation {
    constructor() {
        this.counters = document.querySelectorAll('[data-count]');
        this.observed = new Set();
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.observed.has(entry.target)) {
                    this.observed.add(entry.target);
                    this.animateCounter(entry.target);
                }
            });
        }, { threshold: 0.5 });

        this.counters.forEach((counter) => observer.observe(counter));
    }

    animateCounter(element) {
        const target = parseFloat(element.dataset.count);
        const suffix = element.dataset.suffix || '';
        const valueElement = element.querySelector('.trust-value');
        const duration = 2000;
        const startTime = performance.now();
        const isDecimal = target % 1 !== 0;

        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (ease-out-expo)
            const easeOutExpo = 1 - Math.pow(2, -10 * progress);
            
            let current = target * easeOutExpo;
            
            if (isDecimal) {
                valueElement.textContent = current.toFixed(1) + suffix;
            } else {
                valueElement.textContent = Math.floor(current).toLocaleString() + suffix;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                if (isDecimal) {
                    valueElement.textContent = target.toFixed(1) + suffix;
                } else {
                    valueElement.textContent = target.toLocaleString() + suffix;
                }
            }
        };

        requestAnimationFrame(animate);
    }
}

// ================================================
// Smooth Scroll
// ================================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    const offset = 100;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ================================================
// Parallax Effect for Hero
// ================================================
class ParallaxEffect {
    constructor() {
        this.orbs = document.querySelectorAll('.hero-orb');
        this.floatElements = document.querySelectorAll('.float-element');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => this.handleScroll());
        document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    }

    handleScroll() {
        const scrolled = window.pageYOffset;
        
        this.orbs.forEach((orb, index) => {
            const speed = 0.3 + (index * 0.1);
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }

    handleMouseMove(e) {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        
        this.floatElements.forEach((el, index) => {
            const speed = 10 + (index * 5);
            el.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    }
}

// ================================================
// Text Typing Effect for Hero
// ================================================
class TypeWriter {
    constructor() {
        this.subtitle = document.querySelector('.hero-subtitle');
        this.originalText = this.subtitle?.textContent || '';
        // Disable for now - uncomment to enable typing effect
        // this.init();
    }

    init() {
        if (!this.subtitle) return;
        
        this.subtitle.textContent = '';
        let charIndex = 0;
        
        const type = () => {
            if (charIndex < this.originalText.length) {
                this.subtitle.textContent += this.originalText.charAt(charIndex);
                charIndex++;
                setTimeout(type, 80);
            }
        };
        
        setTimeout(type, 1500);
    }
}

// ================================================
// Scroll Progress Indicator
// ================================================
class ScrollProgress {
    constructor() {
        this.createProgressBar();
        this.init();
    }

    createProgressBar() {
        this.progressBar = document.createElement('div');
        this.progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, #00f5ff 0%, #bf00ff 100%);
            z-index: 9999;
            transition: width 0.1s ease;
            width: 0;
        `;
        document.body.appendChild(this.progressBar);
    }

    init() {
        window.addEventListener('scroll', () => this.updateProgress());
    }

    updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
}

// ================================================
// Reviews Duplication for Infinite Scroll
// ================================================
class InfiniteReviews {
    constructor() {
        this.track = document.getElementById('reviewsTrack');
        this.init();
    }

    init() {
        if (!this.track) return;
        
        // Clone all review cards for seamless loop
        const cards = this.track.querySelectorAll('.review-card');
        cards.forEach((card) => {
            const clone = card.cloneNode(true);
            this.track.appendChild(clone);
        });
    }
}

// ================================================
// Scroll Indicator Hide
// ================================================
class ScrollIndicator {
    constructor() {
        this.indicator = document.getElementById('scrollIndicator');
        this.init();
    }

    init() {
        if (!this.indicator) return;
        
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 100) {
                this.indicator.style.opacity = '0';
                this.indicator.style.pointerEvents = 'none';
            } else {
                this.indicator.style.opacity = '1';
                this.indicator.style.pointerEvents = 'auto';
            }
        });
    }
}

// ================================================
// Ripple Effect on Buttons
// ================================================
class RippleEffect {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.init();
    }

    init() {
        this.buttons.forEach((btn) => {
            btn.addEventListener('click', (e) => this.createRipple(e, btn));
        });
    }

    createRipple(e, btn) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
}

// Add ripple keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ================================================
// Product Option Selection
// ================================================
class ProductOptions {
    constructor() {
        this.options = document.querySelectorAll('.product-option');
        this.init();
    }

    init() {
        this.options.forEach((option) => {
            const btn = option.querySelector('.option-btn');
            if (btn) {
                btn.addEventListener('click', () => this.selectOption(option));
            }
        });
    }

    selectOption(selectedOption) {
        // Remove active state from all
        this.options.forEach((option) => {
            option.classList.remove('product-option-selected');
        });
        
        // Add active state to selected
        selectedOption.classList.add('product-option-selected');
        
        // Visual feedback
        selectedOption.style.transform = 'scale(1.02)';
        setTimeout(() => {
            selectedOption.style.transform = '';
        }, 200);
    }
}

// ================================================
// Countdown Timer
// ================================================
class CountdownTimer {
    constructor() {
        this.timerElement = document.getElementById('countdownTimer');
        this.stockElement = document.getElementById('stockCount');
        this.init();
    }

    init() {
        if (!this.timerElement) return;
        
        // Set end time to midnight today
        this.endTime = new Date();
        this.endTime.setHours(23, 59, 59, 999);
        
        this.updateTimer();
        setInterval(() => this.updateTimer(), 1000);
        
        // Random stock decrease
        this.simulateStock();
    }

    updateTimer() {
        const now = new Date();
        let diff = this.endTime - now;
        
        if (diff < 0) {
            // Reset for next day
            this.endTime = new Date();
            this.endTime.setDate(this.endTime.getDate() + 1);
            this.endTime.setHours(23, 59, 59, 999);
            diff = this.endTime - now;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        this.timerElement.textContent = 
            `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    simulateStock() {
        if (!this.stockElement) return;
        
        // Decrease stock randomly every 30-90 seconds
        const decreaseStock = () => {
            const current = parseInt(this.stockElement.textContent);
            if (current > 12) {
                this.stockElement.textContent = current - 1;
                this.stockElement.style.animation = 'pulse 0.5s ease';
                setTimeout(() => {
                    this.stockElement.style.animation = '';
                }, 500);
            }
            
            const nextDecrease = Math.random() * 60000 + 30000;
            setTimeout(decreaseStock, nextDecrease);
        };
        
        setTimeout(decreaseStock, Math.random() * 30000 + 15000);
    }
}

// ================================================
// FAQ Accordion
// ================================================
class FAQAccordion {
    constructor() {
        this.items = document.querySelectorAll('[data-faq]');
        this.init();
    }

    init() {
        this.items.forEach((item) => {
            const question = item.querySelector('.faq-question');
            if (question) {
                question.addEventListener('click', () => this.toggle(item));
            }
        });
    }

    toggle(item) {
        const isActive = item.classList.contains('active');
        
        // Close all
        this.items.forEach((i) => i.classList.remove('active'));
        
        // Open clicked if wasn't active
        if (!isActive) {
            item.classList.add('active');
        }
    }
}

// ================================================
// Ingredient Bars Animation
// ================================================
class IngredientBars {
    constructor() {
        this.bars = document.querySelectorAll('.ingredient-fill');
        this.observed = false;
        this.init();
    }

    init() {
        if (this.bars.length === 0) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.observed) {
                    this.observed = true;
                    this.animateBars();
                }
            });
        }, { threshold: 0.5 });

        const section = document.querySelector('.ingredients-section');
        if (section) observer.observe(section);
    }

    animateBars() {
        this.bars.forEach((bar, index) => {
            const width = bar.style.width;
            bar.style.width = '0';
            setTimeout(() => {
                bar.style.width = width;
            }, 100 + (index * 150));
        });
    }
}

// ================================================
// Purity Ring Animation
// ================================================
class PurityRing {
    constructor() {
        this.ring = document.querySelector('.purity-ring circle:last-of-type');
        this.observed = false;
        this.init();
    }

    init() {
        if (!this.ring) return;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !this.observed) {
                    this.observed = true;
                    this.animateRing();
                }
            });
        }, { threshold: 0.5 });

        const badge = document.querySelector('.purity-badge');
        if (badge) observer.observe(badge);
    }

    animateRing() {
        this.ring.style.transition = 'stroke-dashoffset 2s ease-out';
        this.ring.style.strokeDashoffset = '6';
    }
}

// ================================================
// Ultra Guru Runner Game
// ================================================
class UltraGuruRunnerGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.gameContainer = this.canvas.closest('.game-container');
        this.characterSelect = document.getElementById('characterSelect');
        this.gameWrapper = document.getElementById('gameWrapper');
        this.gameOver = document.getElementById('gameOver');
        this.startBtn = document.getElementById('startGameBtn');
        this.restartBtn = document.getElementById('restartGameBtn');
        this.changeCharBtn = document.getElementById('changeCharacterBtn');
        
        // Set initial state
        if (this.gameContainer) {
            this.gameContainer.classList.add('state-select');
        }
        
        this.selectedCharacter = null;
        this.isRunning = false;
        this.score = 0;
        this.jarsCollected = 0;
        this.speedMultiplier = 1;
        this.maxSpeed = 1;
        this.gameSpeed = 5;
        this.gravity = 0.8;
        this.jumpForce = -15;
        
        // Game objects
        this.runner = {
            x: 100,
            y: 0,
            width: 40,
            height: 70,
            velocityY: 0,
            isJumping: false,
            legAngle: 0
        };
        
        this.ground = {
            y: 0,
            height: 60
        };
        
        this.obstacles = [];
        this.jars = [];
        this.particles = [];
        this.lastObstacleTime = 0;
        this.lastJarTime = 0;
        
        this.init();
    }
    
    init() {
        this.resize();
        // Debounce resize to prevent layout thrashing
        window.addEventListener('resize', debounce(() => this.resize(), 250));
        
        // Character selection
        document.querySelectorAll('.character-option').forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelectorAll('.character-option').forEach(o => o.classList.remove('selected'));
                option.classList.add('selected');
                this.selectedCharacter = option.dataset.character;
                if (this.startBtn) {
                    this.startBtn.disabled = false;
                }
            });
        });
        
        // Start game button
        if (this.startBtn) {
            this.startBtn.addEventListener('click', () => this.startGame());
        }
        if (this.restartBtn) {
            this.restartBtn.addEventListener('click', () => this.restartGame());
        }
        if (this.changeCharBtn) {
            this.changeCharBtn.addEventListener('click', () => this.showCharacterSelect());
        }
        
        // Jump controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.isRunning) {
                e.preventDefault();
                this.jump();
            }
        });
        
        this.canvas.addEventListener('click', () => {
            if (this.isRunning) this.jump();
        });
        
        this.canvas.addEventListener('touchstart', (e) => {
            if (this.isRunning) {
                e.preventDefault();
                this.jump();
            }
        });
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = 400;
        
        this.ground.y = this.canvas.height - this.ground.height;
        this.runner.y = this.ground.y - this.runner.height;
    }
    
    startGame() {
        // Switch to playing state
        if (this.gameContainer) {
            this.gameContainer.classList.remove('state-select', 'state-gameover');
            this.gameContainer.classList.add('state-playing');
        }
        
        // Resize canvas after showing game wrapper
        this.resize();
        
        this.score = 0;
        this.jarsCollected = 0;
        this.speedMultiplier = 1;
        this.maxSpeed = 1;
        this.gameSpeed = 5;
        this.obstacles = [];
        this.jars = [];
        this.particles = [];
        this.runner.y = this.ground.y - this.runner.height;
        this.runner.velocityY = 0;
        this.runner.isJumping = false;
        
        this.isRunning = true;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    restartGame() {
        this.gameOver.style.display = 'none';
        this.startGame();
    }
    
    showCharacterSelect() {
        // Switch to select state
        if (this.gameContainer) {
            this.gameContainer.classList.remove('state-playing', 'state-gameover');
            this.gameContainer.classList.add('state-select');
        }
    }
    
    jump() {
        if (!this.runner.isJumping) {
            this.runner.velocityY = this.jumpForce;
            this.runner.isJumping = true;
        }
    }
    
    gameLoop() {
        if (!this.isRunning) return;
        
        const currentTime = performance.now();
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;
        
        this.update(deltaTime, currentTime);
        this.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }
    
    update(deltaTime, currentTime) {
        // Update score
        this.score += Math.floor(deltaTime * 100 * this.speedMultiplier);
        
        // Update runner physics
        this.runner.velocityY += this.gravity;
        this.runner.y += this.runner.velocityY;
        
        // Ground collision
        if (this.runner.y >= this.ground.y - this.runner.height) {
            this.runner.y = this.ground.y - this.runner.height;
            this.runner.velocityY = 0;
            this.runner.isJumping = false;
        }
        
        // Update leg animation
        this.runner.legAngle += 0.3 * this.speedMultiplier;
        
        // Spawn obstacles
        if (currentTime - this.lastObstacleTime > 2000 / this.speedMultiplier) {
            this.spawnObstacle();
            this.lastObstacleTime = currentTime;
        }
        
        // Spawn jars
        if (currentTime - this.lastJarTime > 3000 / this.speedMultiplier) {
            this.spawnJar();
            this.lastJarTime = currentTime;
        }
        
        // Update obstacles
        this.obstacles = this.obstacles.filter(obs => {
            obs.x -= this.gameSpeed * this.speedMultiplier;
            
            // Collision check
            if (this.checkCollision(this.runner, obs)) {
                this.endGame();
                return false;
            }
            
            return obs.x > -obs.width;
        });
        
        // Update jars
        this.jars = this.jars.filter(jar => {
            jar.x -= this.gameSpeed * this.speedMultiplier;
            jar.bobOffset = Math.sin(currentTime / 200 + jar.id) * 5;
            
            // Collection check
            if (this.checkCollision(this.runner, jar)) {
                this.collectJar();
                this.createCollectParticles(jar.x, jar.y);
                return false;
            }
            
            return jar.x > -jar.width;
        });
        
        // Update particles
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2;
            p.life -= deltaTime;
            return p.life > 0;
        });
        
        // Update HUD
        document.getElementById('gameScore').textContent = this.score;
        document.getElementById('gameSpeed').textContent = this.speedMultiplier.toFixed(1) + 'x';
        document.getElementById('gameJars').textContent = this.jarsCollected;
    }
    
    spawnObstacle() {
        const types = ['rock', 'cactus', 'hurdle'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let width, height;
        if (type === 'rock') {
            width = 40 + Math.random() * 20;
            height = 30 + Math.random() * 20;
        } else if (type === 'cactus') {
            width = 25;
            height = 50 + Math.random() * 20;
        } else {
            width = 30;
            height = 40;
        }
        
        this.obstacles.push({
            x: this.canvas.width + 50,
            y: this.ground.y - height,
            width,
            height,
            type
        });
    }
    
    spawnJar() {
        const isHigh = Math.random() > 0.5;
        this.jars.push({
            id: Math.random(),
            x: this.canvas.width + 50,
            y: isHigh ? this.ground.y - 150 : this.ground.y - 80,
            width: 35,
            height: 45,
            bobOffset: 0
        });
    }
    
    collectJar() {
        this.jarsCollected++;
        this.speedMultiplier += 0.15;
        this.maxSpeed = Math.max(this.maxSpeed, this.speedMultiplier);
        
        // Speed up game slightly
        this.gameSpeed = 5 + (this.jarsCollected * 0.3);
    }
    
    createCollectParticles(x, y) {
        const colors = ['#00f5ff', '#bf00ff', '#ff006e', '#00ff88'];
        for (let i = 0; i < 15; i++) {
            this.particles.push({
                x,
                y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                size: Math.random() * 6 + 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 0.8
            });
        }
    }
    
    checkCollision(a, b) {
        const padding = 5;
        return a.x + padding < b.x + b.width &&
               a.x + a.width - padding > b.x &&
               a.y + padding < b.y + b.height &&
               a.y + a.height - padding > b.y;
    }
    
    endGame() {
        this.isRunning = false;
        
        // Switch to game over state
        if (this.gameContainer) {
            this.gameContainer.classList.remove('state-select', 'state-playing');
            this.gameContainer.classList.add('state-gameover');
        }
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalJars').textContent = this.jarsCollected;
        document.getElementById('finalSpeed').textContent = this.maxSpeed.toFixed(1) + 'x';
    }
    
    draw() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw background gradient
        const bgGrad = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        bgGrad.addColorStop(0, '#0a0a0a');
        bgGrad.addColorStop(0.6, '#111111');
        bgGrad.addColorStop(1, '#1a1a1a');
        this.ctx.fillStyle = bgGrad;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars/particles in background
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        for (let i = 0; i < 30; i++) {
            const x = (i * 53 + performance.now() / 50) % this.canvas.width;
            const y = (i * 37) % (this.canvas.height - 100);
            this.ctx.beginPath();
            this.ctx.arc(x, y, 1, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Draw ground
        const groundGrad = this.ctx.createLinearGradient(0, this.ground.y, 0, this.canvas.height);
        groundGrad.addColorStop(0, '#333333');
        groundGrad.addColorStop(1, '#1a1a1a');
        this.ctx.fillStyle = groundGrad;
        this.ctx.fillRect(0, this.ground.y, this.canvas.width, this.ground.height);
        
        // Draw ground line
        this.ctx.strokeStyle = 'rgba(0, 245, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.ground.y);
        this.ctx.lineTo(this.canvas.width, this.ground.y);
        this.ctx.stroke();
        
        // Draw obstacles
        this.obstacles.forEach(obs => this.drawObstacle(obs));
        
        // Draw jars
        this.jars.forEach(jar => this.drawJar(jar));
        
        // Draw particles
        this.particles.forEach(p => {
            this.ctx.globalAlpha = p.life;
            this.ctx.fillStyle = p.color;
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        this.ctx.globalAlpha = 1;
        
        // Draw runner
        this.drawRunner();
    }
    
    drawRunner() {
        const r = this.runner;
        const isMale = this.selectedCharacter === 'male';
        
        // Colors based on character
        const headColor = isMale ? '#00f5ff' : '#ff006e';
        const bodyColor = isMale ? '#0066ff' : '#bf00ff';
        const legColor = isMale ? '#003399' : '#7700aa';
        
        // Draw glow
        this.ctx.shadowBlur = 20;
        this.ctx.shadowColor = headColor;
        
        // Head
        this.ctx.fillStyle = headColor;
        this.ctx.beginPath();
        this.ctx.arc(r.x + r.width / 2, r.y + 15, 12, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Body
        this.ctx.fillStyle = bodyColor;
        this.ctx.fillRect(r.x + r.width / 2 - 8, r.y + 25, 16, 25);
        
        // Legs with running animation
        this.ctx.shadowBlur = 0;
        const legSwing = Math.sin(this.runner.legAngle) * 25;
        
        // Left leg
        this.ctx.save();
        this.ctx.translate(r.x + r.width / 2 - 5, r.y + 48);
        this.ctx.rotate(legSwing * Math.PI / 180);
        this.ctx.fillStyle = legColor;
        this.ctx.fillRect(-3, 0, 6, 22);
        this.ctx.restore();
        
        // Right leg
        this.ctx.save();
        this.ctx.translate(r.x + r.width / 2 + 5, r.y + 48);
        this.ctx.rotate(-legSwing * Math.PI / 180);
        this.ctx.fillStyle = legColor;
        this.ctx.fillRect(-3, 0, 6, 22);
        this.ctx.restore();
        
        // Arms
        const armSwing = Math.sin(this.runner.legAngle + Math.PI) * 20;
        
        this.ctx.save();
        this.ctx.translate(r.x + r.width / 2 - 8, r.y + 28);
        this.ctx.rotate(armSwing * Math.PI / 180);
        this.ctx.fillStyle = bodyColor;
        this.ctx.fillRect(-3, 0, 5, 18);
        this.ctx.restore();
        
        this.ctx.save();
        this.ctx.translate(r.x + r.width / 2 + 8, r.y + 28);
        this.ctx.rotate(-armSwing * Math.PI / 180);
        this.ctx.fillStyle = bodyColor;
        this.ctx.fillRect(-2, 0, 5, 18);
        this.ctx.restore();
    }
    
    drawObstacle(obs) {
        this.ctx.fillStyle = '#444444';
        this.ctx.strokeStyle = '#666666';
        this.ctx.lineWidth = 2;
        
        if (obs.type === 'rock') {
            this.ctx.beginPath();
            this.ctx.moveTo(obs.x + obs.width / 2, obs.y);
            this.ctx.lineTo(obs.x + obs.width, obs.y + obs.height);
            this.ctx.lineTo(obs.x, obs.y + obs.height);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.stroke();
        } else if (obs.type === 'cactus') {
            this.ctx.fillStyle = '#2d5a27';
            this.ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
            // Arms
            this.ctx.fillRect(obs.x - 10, obs.y + 15, 12, 8);
            this.ctx.fillRect(obs.x + obs.width - 2, obs.y + 25, 12, 8);
        } else {
            // Hurdle
            this.ctx.fillStyle = '#ff006e';
            this.ctx.fillRect(obs.x, obs.y, obs.width, 8);
            this.ctx.fillRect(obs.x + 5, obs.y + 8, 5, obs.height - 8);
            this.ctx.fillRect(obs.x + obs.width - 10, obs.y + 8, 5, obs.height - 8);
        }
    }
    
    drawJar(jar) {
        const x = jar.x;
        const y = jar.y + jar.bobOffset;
        
        // Glow
        this.ctx.shadowBlur = 25;
        this.ctx.shadowColor = '#00f5ff';
        
        // Jar body
        const jarGrad = this.ctx.createLinearGradient(x, y, x + jar.width, y + jar.height);
        jarGrad.addColorStop(0, '#1a1a1a');
        jarGrad.addColorStop(0.5, '#333333');
        jarGrad.addColorStop(1, '#1a1a1a');
        
        this.ctx.fillStyle = jarGrad;
        this.ctx.beginPath();
        this.ctx.roundRect(x, y + 10, jar.width, jar.height - 10, 5);
        this.ctx.fill();
        
        // Lid
        this.ctx.fillStyle = '#bf00ff';
        this.ctx.beginPath();
        this.ctx.roundRect(x - 2, y, jar.width + 4, 12, [5, 5, 0, 0]);
        this.ctx.fill();
        
        // Label with gradient
        const labelGrad = this.ctx.createLinearGradient(x + 5, y + 20, x + jar.width - 5, y + 35);
        labelGrad.addColorStop(0, '#00f5ff');
        labelGrad.addColorStop(1, '#bf00ff');
        this.ctx.fillStyle = labelGrad;
        this.ctx.fillRect(x + 5, y + 20, jar.width - 10, 18);
        
        // Text
        this.ctx.shadowBlur = 0;
        this.ctx.fillStyle = '#0a0a0a';
        this.ctx.font = 'bold 6px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('UG', x + jar.width / 2, y + 32);
        
        this.ctx.shadowBlur = 0;
    }
}

// ================================================
// Lazy Load Videos for Performance
// ================================================
class LazyVideos {
    constructor() {
        this.videos = document.querySelectorAll('video[data-src]');
        this.init();
    }

    init() {
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.loadVideo(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, { rootMargin: '100px' });

            this.videos.forEach((video) => observer.observe(video));
        } else {
            // Fallback: load all videos immediately
            this.videos.forEach((video) => this.loadVideo(video));
        }
    }

    loadVideo(video) {
        const src = video.dataset.src;
        if (src) {
            const source = video.querySelector('source');
            if (source) {
                source.src = src;
                video.load();
            }
        }
    }
}

// ================================================
// Initialize Everything
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    // Performance: Lazy load videos
    new LazyVideos();
    
    // Core effects
    new CursorGlow();
    new ParticleBackground();
    new Navigation();
    new ScrollAnimations();
    new SmoothScroll();
    new ScrollProgress();
    new ScrollIndicator();
    
    // Interactive effects
    new ProductTilt();
    new MagneticElements();
    new TiltCards();
    new ParallaxEffect();
    new RippleEffect();
    
    // Content effects
    new CounterAnimation();
    new InfiniteReviews();
    new ProductOptions();
    new TypeWriter();
    
    // Sales elements
    new CountdownTimer();
    new FAQAccordion();
    new IngredientBars();
    new PurityRing();
    
    // Mini game
    new UltraGuruRunnerGame();
    
    console.log('✨ Ultra Guru Landing Page Initialized');
});

// ================================================
// Performance: Reduce animations on low-end devices
// ================================================
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.style.setProperty('--ease-out-expo', 'linear');
    document.documentElement.style.setProperty('--ease-out-quart', 'linear');
}

