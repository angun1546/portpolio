// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// 1. Lenis Smooth Scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    touchMultiplier: 1.5 // Mobile touch sensitivity
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// 2. Custom Cursor & Touch Detection
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

// 3. Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileLinks = document.querySelectorAll('.mobile-nav a');

menuToggle.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    menuToggle.classList.toggle('open');
    
    if (mobileMenu.classList.contains('active')) {
        lenis.stop(); // Prevent scrolling when menu is open
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

// 4. Hero Animations
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

// 5. Ticker Animation
gsap.to(".ticker-content", {
    xPercent: -50,
    repeat: -1,
    duration: 30,
    ease: "none"
});

// 6. Text Split Animation
const splitTextElements = document.querySelectorAll('.split-text');
if (splitTextElements.length > 0) {
    const splitText = new SplitType('.split-text', { types: 'lines, words' });
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

// 7. Counter Animation
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

// 8. Magnetic Effect (Only on Desktop)
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

// 9. Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = this.getAttribute('href');
        lenis.scrollTo(target);
    });
});

// 10. Background Color Morphing (Gradient Scrub)
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
