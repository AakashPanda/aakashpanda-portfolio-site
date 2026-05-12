/* =============================================
   AAKASH PANDA - Portfolio JavaScript
   =============================================
   TABLE OF CONTENTS:
   1. Loading Screen
   2. Particle Background
   3. Cursor Glow Effect
   4. Typing Animation
   5. Navbar Scroll & Active Links
   6. Mobile Menu Toggle
   7. Scroll Reveal (Intersection Observer)
   8. Counter Animation
   9. Skill Bar Animation
   10. Theme Toggle (Light/Dark)
   11. Contact Form Validation
   12. Back to Top Button
   13. Smooth Scrolling
   14. Year Auto-Update
   15. Tilt Effect on Cards
   16. Parallax Effect
   17. Orbit Icons (JS-based)
   18. Initialize All
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // =============================================
    // 1. LOADING SCREEN
    // =============================================
    (function initLoader() {
        const loader = document.getElementById('loader');
        const loaderBarFill = document.getElementById('loaderBarFill');

        if (!loader || !loaderBarFill) return;

        let progress = 0;
        const loadingInterval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress > 100) {
                progress = 100;
                clearInterval(loadingInterval);
                
                setTimeout(() => {
                    loader.classList.add('hidden');
                    document.body.style.overflow = 'visible';
                    
                    initScrollReveal();
                    animateSkillBars();
                    startCounters();
                    startOrbitAnimation();
                }, 400);
            }
        }, 200);
    })();

    // =============================================
    // 2. PARTICLE BACKGROUND
    // =============================================
    (function initParticles() {
        const canvas = document.getElementById('particleCanvas');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;
        let mouseX = 0;
        let mouseY = 0;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 200) {
                    const force = (200 - dist) / 200 * 0.02;
                    this.speedX += dx * force;
                    this.speedY += dy * force;
                }

                this.speedX *= 0.98;
                this.speedY *= 0.98;

                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(0, 212, 255, ${this.opacity})`;
                ctx.fill();
            }
        }

        function createParticles() {
            const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 100);
            particles = [];
            for (let i = 0; i < count; i++) {
                particles.push(new Particle());
            }
        }

        createParticles();
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });

        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(0, 212, 255, ${0.05 * (1 - dist / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((particle) => {
                particle.update();
                particle.draw();
            });
            connectParticles();
            animationFrameId = requestAnimationFrame(animateParticles);
        }

        animateParticles();
    })();

    // =============================================
    // 3. CURSOR GLOW EFFECT
    // =============================================
    (function initCursorGlow() {
        const cursorGlow = document.getElementById('cursorGlow');
        if (!cursorGlow) return;

        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateGlow() {
            currentX += (mouseX - currentX) * 0.08;
            currentY += (mouseY - currentY) * 0.08;
            cursorGlow.style.left = currentX + 'px';
            cursorGlow.style.top = currentY + 'px';
            requestAnimationFrame(animateGlow);
        }

        animateGlow();

        if ('ontouchstart' in window) {
            cursorGlow.style.display = 'none';
        }
    })();

    // =============================================
    // 4. TYPING ANIMATION
    // =============================================
    (function initTyping() {
        const typingText = document.getElementById('typingText');
        if (!typingText) return;

        const roles = [
            'Senior Software Developer',
            'Machine Learning Engineer',
            'AI & Computer Vision Developer',
            'Backend & API Specialist'
        ];

        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let isPaused = false;

        function typeEffect() {
            const currentRole = roles[roleIndex];
            
            if (isPaused) {
                setTimeout(typeEffect, 2000);
                isPaused = false;
                return;
            }

            if (!isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;

                if (charIndex === currentRole.length) {
                    isPaused = true;
                    isDeleting = true;
                    setTimeout(typeEffect, 3000);
                    return;
                }

                setTimeout(typeEffect, Math.random() * 50 + 40);
            } else {
                typingText.textContent = currentRole.substring(0, charIndex);
                charIndex--;

                if (charIndex < 0) {
                    isDeleting = false;
                    charIndex = 0;
                    roleIndex = (roleIndex + 1) % roles.length;
                    setTimeout(typeEffect, 500);
                    return;
                }

                setTimeout(typeEffect, Math.random() * 30 + 20);
            }
        }

        setTimeout(typeEffect, 800);
    })();

    // =============================================
    // 5. NAVBAR SCROLL & ACTIVE LINKS
    // =============================================
    (function initNavbar() {
        const navbar = document.getElementById('navbar');
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.section[id]');
        if (!navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            let current = '';
            sections.forEach((section) => {
                const sectionTop = section.offsetTop - 150;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach((link) => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    })();

    // =============================================
    // 6. MOBILE MENU TOGGLE
    // =============================================
    (function initMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navLinks = document.getElementById('navLinks');
        const menuLinks = document.querySelectorAll('.nav-link');
        const navbar = document.getElementById('navbar');

        if (!hamburger || !navLinks) return;

        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        menuLinks.forEach((link) => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        document.addEventListener('click', (e) => {
            if (navbar && !navbar.contains(e.target) && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    })();

    // =============================================
    // 7. SCROLL REVEAL (Intersection Observer)
    // =============================================
    let revealObserver;

    function initScrollReveal() {
        const revealElements = document.querySelectorAll('.reveal');
        if (revealElements.length === 0) return;

        if (revealObserver) {
            revealObserver.disconnect();
        }

        revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        
                        const skillFills = entry.target.querySelectorAll('.skill-fill');
                        if (skillFills.length > 0) {
                            animateSkillBarsInElement(entry.target);
                        }
                        
                        const statNumbers = entry.target.querySelectorAll('.stat-number');
                        if (statNumbers.length > 0) {
                            animateCountersInElement(entry.target);
                        }
                    }
                });
            },
            {
                threshold: 0.15,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        revealElements.forEach((el) => revealObserver.observe(el));
    }

    // =============================================
    // 8. COUNTER ANIMATION
    // =============================================
    function startCounters() {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach((stat) => {
            const rect = stat.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateCounter(stat);
            }
        });
    }

    function animateCountersInElement(container) {
        const statNumbers = container.querySelectorAll('.stat-number');
        statNumbers.forEach((stat) => animateCounter(stat));
    }

    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-target'));
        if (isNaN(target)) return;
        if (element.classList.contains('animated')) return;
        element.classList.add('animated');

        const duration = 2000;
        const startTime = performance.now();
        
        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const currentValue = Math.floor(eased * target);
            element.textContent = currentValue;

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // =============================================
    // 9. SKILL BAR ANIMATION
    // =============================================
    function animateSkillBars() {
        const skillFills = document.querySelectorAll('.skill-fill');
        skillFills.forEach((fill) => {
            const rect = fill.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                animateSkillBar(fill);
            }
        });
    }

    function animateSkillBarsInElement(container) {
        const skillFills = container.querySelectorAll('.skill-fill');
        skillFills.forEach((fill) => animateSkillBar(fill));
    }

    function animateSkillBar(element) {
        const width = element.getAttribute('data-width');
        if (!width) return;
        if (element.classList.contains('animated')) return;
        element.classList.add('animated');

        setTimeout(() => {
            element.style.width = width + '%';
        }, 200);
    }

    // =============================================
    // 10. THEME TOGGLE (Light/Dark)
    // =============================================
    (function initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        if (!themeToggle) return;

        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }

        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
                localStorage.setItem('theme', 'light');
            }
        });
    })();

    // =============================================
    // 11. CONTACT FORM VALIDATION
    // =============================================
    (function initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        const formMessage = document.getElementById('formMessageStatus');

        const validators = {
            name: {
                test: (value) => value.trim().length >= 2,
                message: 'Name must be at least 2 characters'
            },
            email: {
                test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
                message: 'Please enter a valid email address'
            },
            subject: {
                test: (value) => value.trim().length >= 3,
                message: 'Subject must be at least 3 characters'
            },
            message: {
                test: (value) => value.trim().length >= 10,
                message: 'Message must be at least 10 characters'
            }
        };

        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach((input) => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => {
                if (input.closest('.form-group').classList.contains('error')) {
                    validateField(input);
                }
            });
        });

        function validateField(input) {
            const formGroup = input.closest('.form-group');
            const error = formGroup.querySelector('.form-error');
            const validator = validators[input.name];

            if (!validator) return true;

            if (!validator.test(input.value)) {
                formGroup.classList.add('error');
                error.textContent = validator.message;
                return false;
            } else {
                formGroup.classList.remove('error');
                error.textContent = '';
                return true;
            }
        }

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            let isValid = true;

            inputs.forEach((input) => {
                if (!validateField(input)) {
                    isValid = false;
                }
            });

            if (!isValid) {
                formMessage.className = 'form-message error';
                formMessage.textContent = 'Please fix the errors above.';
                return;
            }

            const submitBtn = form.querySelector('.form-submit');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                formMessage.className = 'form-message success';
                formMessage.textContent = 'Message sent successfully! I\'ll get back to you soon.';
                form.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;

                setTimeout(() => {
                    formMessage.className = 'form-message';
                }, 5000);
            }, 1500);
        });
    })();

    // =============================================
    // 12. BACK TO TOP BUTTON
    // =============================================
    (function initBackToTop() {
        const backToTop = document.getElementById('backToTop');
        if (!backToTop) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    })();

    // =============================================
    // 13. SMOOTH SCROLLING (for anchor links)
    // =============================================
    (function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    e.preventDefault();
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    })();

    // =============================================
    // 14. YEAR AUTO-UPDATE
    // =============================================
    (function initYear() {
        const yearElement = document.getElementById('year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    })();

    // =============================================
    // 15. TILT EFFECT ON CARDS
    // =============================================
    (function initTiltEffect() {
        const tiltCards = document.querySelectorAll('[data-tilt]');

        tiltCards.forEach((card) => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -8;
                const rotateY = (x - centerX) / centerX * 8;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    })();

    // =============================================
    // 16. PARALLAX EFFECT
    // =============================================
    (function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        window.addEventListener('scroll', () => {
            const scrollY = window.scrollY;
            const heroContent = hero.querySelector('.hero-content');
            
            if (heroContent && scrollY < hero.offsetHeight) {
                heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
                heroContent.style.opacity = 1 - (scrollY / hero.offsetHeight) * 0.5;
            }
        });
    })();

    // =============================================
    // 17. ORBIT ICONS (JS-based animation)
    // =============================================
    let orbitFrameId = null;

    function startOrbitAnimation() {
        const container = document.querySelector('.tech-stack-icons');
        if (!container) return;

        const icons = container.querySelectorAll('i');
        if (icons.length === 0) return;

        // Remove CSS animation, use JS
        icons.forEach(icon => {
            icon.style.animation = 'none';
        });

        let startTime = performance.now();
        const orbitDuration = 12000; // 12 seconds per orbit

        function animateOrbit(time) {
            const elapsed = time - startTime;
            
            // Recalculate dimensions on each frame for responsiveness
            const containerRect = container.getBoundingClientRect();
            const radius = containerRect.width / 2 - 18; // 18px = half icon size
            const centerX = containerRect.width / 2;
            const centerY = containerRect.height / 2;

            icons.forEach((icon, index) => {
                const offset = (index * (orbitDuration / icons.length)); // stagger
                const angle = ((elapsed + offset) % orbitDuration) / orbitDuration * 360;
                const rad = (angle * Math.PI) / 180;
                
                const x = centerX + radius * Math.cos(rad) - 14;
                const y = centerY + radius * Math.sin(rad) - 14;
                
                icon.style.left = x + 'px';
                icon.style.top = y + 'px';
                icon.style.transform = 'none';
                icon.style.position = 'absolute';
                icon.style.margin = '0';
            });

            orbitFrameId = requestAnimationFrame(animateOrbit);
        }

        orbitFrameId = requestAnimationFrame(animateOrbit);

        // Handle resize
        window.addEventListener('resize', () => {
            // Icons reposition on next frame automatically
        });
    }

    // Cleanup orbit on page unload
    window.addEventListener('beforeunload', () => {
        if (orbitFrameId) {
            cancelAnimationFrame(orbitFrameId);
        }
    });

    // =============================================
    // 18. DOWNLOAD RESUME
    // =============================================
    (function initResumeDownload() {
        const downloadBtn = document.getElementById('downloadResume');
        if (downloadBtn) {
            downloadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const link = document.createElement('a');
                link.href = 'assets/resume/Aakash_Panda_Resume.pdf';
                link.download = 'Aakash_Panda_Resume.pdf';
                link.click();
            });
        }
    })();

    // =============================================
    // Re-trigger animations on resize
    // =============================================
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const revealElements = document.querySelectorAll('.reveal:not(.active)');
            revealElements.forEach((el) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight - 100) {
                    el.classList.add('active');
                }
            });
        }, 250);
    });

    console.log('%c Aakash Panda Portfolio ', 'background: linear-gradient(135deg, #00d4ff, #7c3aed); color: white; font-size: 1.5rem; padding: 10px 20px; border-radius: 4px; font-weight: bold;');
    console.log('%c Built with ❤️ by Aakash Panda ', 'color: #00d4ff; font-size: 1rem; padding: 5px;');
});