// Modern Portfolio JavaScript - Award-winning Design
// ================================================

class PortfolioApp {
  constructor() {
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    this.setupLoadingScreen();
  }

  setupEventListeners() {
    // DOMContentLoaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
    } else {
      this.onDOMReady();
    }

    // Window events
    window.addEventListener('resize', () => this.handleResize());
    window.addEventListener('scroll', () => this.handleScroll());
  }

  onDOMReady() {
    this.initParticleSystem();
    this.initAOS();
    this.initTabSwitcher();
    this.initMobileNavigation();
    this.initSkillAnimations();
    this.hideLoadingScreen();
    this.optimizePerformance();
  }

  // Loading Screen Animation
  setupLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;

    // Animate loading progress
    const progress = loadingScreen.querySelector('.loading-progress');
    let width = 0;
    const interval = setInterval(() => {
      width += Math.random() * 15;
      if (width >= 100) {
        width = 100;
        clearInterval(interval);
      }
      if (progress) progress.style.width = width + '%';
    }, 100);
  }

  hideLoadingScreen() {
    const loadingScreen = document.getElementById('loadingScreen');
    if (!loadingScreen) return;

    setTimeout(() => {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.remove();
      }, 500);
    }, 2000);
  }

  // Advanced Particle System
  initParticleSystem() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    this.resizeCanvas(canvas);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 30 : 60;
    const colors = ['#FFD700', '#FFA500', '#FFB347', '#FF8C00', '#FFE259', '#FFA751'];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: (Math.random() - 0.5) * 0.5,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.3 + 0.1,
        life: Math.random() * 100 + 50
      });
    }

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Bounce off edges
        if (particle.x <= 0 || particle.x >= canvas.width) {
          particle.speedX *= -1;
        }
        if (particle.y <= 0 || particle.y >= canvas.height) {
          particle.speedY *= -1;
        }

        // Update life and opacity
        particle.life--;
        if (particle.life <= 0) {
          particle.life = Math.random() * 100 + 50;
          particle.opacity = Math.random() * 0.6 + 0.2;
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Draw connections
        particles.forEach((otherParticle, otherIndex) => {
          if (index !== otherIndex) {
            const distance = Math.sqrt(
              Math.pow(particle.x - otherParticle.x, 2) +
              Math.pow(particle.y - otherParticle.y, 2)
            );

            if (distance < 100) {
              const alpha = (100 - distance) / 100 * 0.1;
              ctx.save();
              ctx.globalAlpha = alpha;
              ctx.strokeStyle = particle.color;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particle.x, particle.y);
              ctx.lineTo(otherParticle.x, otherParticle.y);
              ctx.stroke();
              ctx.restore();
            }
          }
        });
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Store for resize
    this.particleCanvas = canvas;
    this.particleCtx = ctx;
  }

  resizeCanvas(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  // Initialize AOS (Animate On Scroll)
  initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-in-out-cubic',
        once: true,
        offset: 100,
        delay: 0
      });
    }
  }

  // Tab Switcher for Projects
  initTabSwitcher() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const contentGrids = document.querySelectorAll('.content-grid');

    tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        const targetTab = button.getAttribute('data-tab');
        
        // Update active button
        tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Show/hide content
        contentGrids.forEach(grid => {
          if (grid.id === targetTab) {
            grid.style.display = 'grid';
            // Re-trigger AOS animation
            if (typeof AOS !== 'undefined') {
              AOS.refreshHard();
            }
          } else {
            grid.style.display = 'none';
          }
        });
      });
    });
  }

  // Mobile Navigation
  initMobileNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (!navToggle || !navMenu) return;
    
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
    });
    
    // Close menu when clicking on links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      });
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
      }
    });
  }

  // Skill Level Animations
  initSkillAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const skillLevel = entry.target.querySelector('.skill-level');
          const level = skillLevel.getAttribute('data-level');
          
          setTimeout(() => {
            skillLevel.style.setProperty('--level', level + '%');
          }, 200);
          
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    skillItems.forEach(item => {
      observer.observe(item);
    });
  }

  // Component Initialization
  initializeComponents() {
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const headerHeight = document.querySelector('.header').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });

    // Parallax effect for hero orbs
    this.initParallax();
  }

  // Parallax Effect
  initParallax() {
    const orbs = document.querySelectorAll('.gradient-orb');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      orbs.forEach((orb, index) => {
        const speed = (index + 1) * 0.3;
        orb.style.transform = `translateY(${rate * speed}px)`;
      });
    });
  }

  // Event Handlers
  handleResize() {
    if (this.particleCanvas) {
      this.resizeCanvas(this.particleCanvas);
    }
  }

  handleScroll() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    if (window.scrollY > 100) {
      header.style.background = 'rgba(10, 10, 15, 0.95)';
      header.style.backdropFilter = 'blur(20px)';
    } else {
      header.style.background = 'rgba(10, 10, 15, 0.8)';
      header.style.backdropFilter = 'blur(20px)';
    }
  }

  // Performance Optimization
  optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    this.preloadCriticalResources();
  }

  preloadCriticalResources() {
    const criticalImages = [
      'images/bakeboat-1.png',
      'images/6.jpg',
      'images/8.jpg',
      'images/10.jpg'
    ];
    
    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }
}

// Utility Functions
const utils = {
  // Throttle function for performance
  throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Debounce function
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Random number generator
  random(min, max) {
    return Math.random() * (max - min) + min;
  },

  // Ease functions for animations
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }
};

// Initialize the portfolio app
const portfolioApp = new PortfolioApp();

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PortfolioApp, utils };
}
