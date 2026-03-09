/**
 * An Gun Portfolio - Core Interactions
 * Powered by GSAP, Lenis, and ScrollTrigger
 */

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

/* Initialize Smooth Scrolling (Lenis) */
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

/* Custom Cursor & Touch Detection */
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (!isTouchDevice) {
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1
        });
        gsap.to(follower, {
            x: e.clientX - 16,
            y: e.clientY - 16,
            duration: 0.3
        });
    });

    document.querySelectorAll('a, button, .magnetic, .menu-toggle').forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(4)';
            cursor.style.opacity = '0.2';
            follower.style.transform = 'scale(1.5)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.opacity = '1';
            follower.style.transform = 'scale(1)';
        });
    });
}

/* Mobile Navigation Controller */
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('open');
    
    if (mobileMenu.classList.contains('active')) {
        lenis.stop();
    } else {
        lenis.start();
    }
});

mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        menuToggle.classList.remove('open');
        lenis.start();
    });
});

/* Visual Reveal - Hero Section */
const heroTl = gsap.timeline();

heroTl.from(".hero-title", {
    y: 100,
    skewY: 7,
    duration: 1.5,
    stagger: 0.2,
    ease: "power4.out"
})
.from(".hero-image-container", {
    scale: 0.8,
    opacity: 0,
    duration: 1.5,
    ease: "expo.out"
}, "-=1");

/* Infinite Marquee (Ticker) */
gsap.to(".ticker-content", {
    xPercent: -50,
    repeat: -1,
    duration: 30,
    ease: "none"
});

/* Typography Reveal (SplitType) */
const splitTextElements = document.querySelectorAll('.split-text');
if (splitTextElements.length > 0) {
    const splitText = new SplitType('.split-text', { types: 'words' });
    gsap.from(splitText.words, {
        scrollTrigger: {
            trigger: ".about",
            start: "top 80%",
            toggleActions: "play none none none"
        },
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.03,
        ease: "power3.out"
    });
}

/* Skill Tags Entrance Animation */
const skillTags = document.querySelectorAll('.skill-tag');
if (skillTags.length > 0) {
    gsap.from(skillTags, {
        scrollTrigger: {
            trigger: ".skills-grid",
            start: "top 85%",
            toggleActions: "play none none none"
        },
        y: 40,
        opacity: 0,
        scale: 0.8,
        duration: 1,
        stagger: {
            amount: 0.5,
            grid: "auto",
            from: "center"
        },
        ease: "elastic.out(1, 0.8)"
    });

    /* Magnetic Effect for Skill Tags */
    if (!isTouchDevice) {
        skillTags.forEach(tag => {
            tag.addEventListener('mousemove', (e) => {
                const rect = tag.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                gsap.to(tag, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            tag.addEventListener('mouseleave', () => {
                gsap.to(tag, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.3)"
                });
            });
        });
    }
}

/* Dynamic Counter Animation */
document.querySelectorAll('.counter').forEach(counter => {
    const target = +counter.getAttribute('data-target');
    ScrollTrigger.create({
        trigger: counter,
        start: "top 95%",
        onEnter: () => {
            gsap.to(counter, {
                innerText: target,
                duration: 2,
                snap: { innerText: 1 },
                ease: "power2.out"
            });
        }
    });
});

/* Interactive Magnetic Elements */
if (!isTouchDevice) {
    document.querySelectorAll('.magnetic').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(el, { x: x * 0.15, y: y * 0.15, duration: 0.5, ease: "power2.out" });
        });
        el.addEventListener('mouseleave', () => {
            gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
        });
    });
}

/* Global Smooth Navigation */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        lenis.scrollTo(target);
    });
});

/* Scroll-Driven Gradient Transition (Background Morphing) */
const sections = document.querySelectorAll('section[data-bg]');

sections.forEach((section, index) => {
    const theme = section.getAttribute('data-theme');
    
    ScrollTrigger.create({
        trigger: section,
        start: "top 50%",
        end: "bottom 50%",
        onEnter: () => document.body.className = `${theme}-theme`,
        onEnterBack: () => document.body.className = `${theme}-theme`,
    });

    if (index < sections.length - 1) {
        const nextSection = sections[index + 1];
        const nextBgData = nextSection.getAttribute('data-bg').split(',').map(c => c.trim());

        gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "bottom 90%",
                end: "bottom 10%",
                scrub: 1,
            }
        })
        .to("body", {
            "--bg-color-1": nextBgData[0],
            "--bg-color-2": nextBgData[1],
            ease: "none"
        });
    }
});
