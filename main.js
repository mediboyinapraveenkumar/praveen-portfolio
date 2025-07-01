// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.animationId = null;
        
        this.resizeCanvas();
        this.createParticles();
        this.animate();
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    createParticles() {
        const numParticles = Math.floor((this.canvas.width * this.canvas.height) / 10000);
        
        for (let i = 0; i < numParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(0, 212, 255, ${particle.opacity})`;
            this.ctx.fill();
            
            // Connect nearby particles
            for (let j = index + 1; j < this.particles.length; j++) {
                const other = this.particles[j];
                const distance = Math.sqrt(
                    Math.pow(particle.x - other.x, 2) + Math.pow(particle.y - other.y, 2)
                );
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - distance / 100)})`;
                    this.ctx.stroke();
                }
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
}

// Typing Animation
class TypingAnimation {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        
        this.type();
    }
    
    type() {
        const currentText = this.texts[this.textIndex];
        
        if (this.isDeleting) {
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }
        
        let speed = this.isDeleting ? this.speed / 2 : this.speed;
        
        if (!this.isDeleting && this.charIndex === currentText.length) {
            speed = 2000; // Pause at end
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex = (this.textIndex + 1) % this.texts.length;
            speed = 500; // Pause before next text
        }
        
        setTimeout(() => this.type(), speed);
    }
}

// Smooth Scrolling Navigation
class SmoothNavigation {
    constructor() {
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section');
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        
        this.bindEvents();
        this.handleScroll();
    }
    
    bindEvents() {
        // Smooth scroll to sections
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                
                if (targetSection) {
                    const offsetTop = targetSection.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu
                this.navMenu.classList.remove('active');
            });
        });
        
        // Mobile menu toggle
        this.hamburger.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
        });
        
        // Update active nav link on scroll
        window.addEventListener('scroll', () => this.handleScroll());
    }
    
    handleScroll() {
        const scrollPos = window.scrollY + 100;
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                this.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
}

// Scroll Animations
class ScrollAnimations {
    constructor() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });
        
        this.observeElements();
    }
    
    observeElements() {
        const animatedElements = document.querySelectorAll(
            '.project-card, .skill-card, .achievement-card, .timeline-item'
        );
        
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            this.observer.observe(el);
        });
    }
}

// Resume Download Handler
class ResumeHandler {
    constructor() {
        this.downloadBtn = document.getElementById('downloadResume');
        this.bindEvents();
    }
    
    bindEvents() {
        this.downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.downloadResume();
        });
    }
    
    downloadResume() {
        // Create a simple PDF-like content
        const resumeContent = `
            MEDIBOYINA PRAVEEN KUMAR
            Java Full Stack Developer
            
            Contact:
            Phone: +91 6304588624
            Email: praveenkumar@email.com
            
            Skills:
            - Java, Python, JavaScript
            - Spring Boot, MySQL
            - HTML5, CSS3, Responsive Design
            - Git, VS Code, IntelliJ
            
            Experience:
            Java Full Stack Intern - Braionvision Technologies (2024)
            
            Projects:
            - MyMusicMyStudies (HTML, CSS, JS)
            - Seminar Hall Booking System (Java, Spring Boot, MySQL)
            - Portfolio Website (HTML, CSS, JS)
        `;
        
        const element = document.createElement('a');
        const file = new Blob([resumeContent], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = 'Mediboyina_Praveen_Kumar_Resume.txt';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        
        // Visual feedback
        const btnText = this.downloadBtn.querySelector('.btn-text');
        const originalText = btnText.textContent;
        btnText.textContent = 'Downloaded!';
        
        setTimeout(() => {
            btnText.textContent = originalText;
        }, 2000);
    }
}

// Add CSS for animations
const animationCSS = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;

const style = document.createElement('style');
style.textContent = animationCSS;
document.head.appendChild(style);

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize particle system
    new ParticleSystem();
    
    // Initialize typing animation
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        new TypingAnimation(typingElement, [
            'Java Developer',
            'Python Enthusiast', 
            'Web App Builder',
            'Full Stack Developer'
        ]);
    }
    
    // Initialize navigation
    new SmoothNavigation();
    
    // Initialize scroll animations
    new ScrollAnimations();
    
    // Initialize resume handler
    new ResumeHandler();
    
    // Add some interactive effects
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Project cards interaction
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 20px 40px rgba(0, 212, 255, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '';
        });
    });
});

// Add custom cursor effect (optional)
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) {
        const cursorEl = document.createElement('div');
        cursorEl.className = 'custom-cursor';
        cursorEl.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: rgba(0, 212, 255, 0.3);
            border: 1px solid var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
        `;
        document.body.appendChild(cursorEl);
    }
    
    const cursorElement = document.querySelector('.custom-cursor');
    if (cursorElement) {
        cursorElement.style.left = e.clientX - 10 + 'px';
        cursorElement.style.top = e.clientY - 10 + 'px';
    }
});