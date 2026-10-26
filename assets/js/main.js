document.addEventListener('DOMContentLoaded', function () {

    // fade-in nero
    const overlay = document.getElementById("black-overlay");
    if (overlay) {
        overlay.style.opacity = "0";

        setTimeout(() => {
            overlay.remove();
        }, 2000);
    }


    // landing: Fuffi speaks one line at a time, like an in-game dialogue.
    // Clicking (or Enter / Space) finishes the line being typed, then moves on; the choices appear after the last line.

    const dialogue = document.querySelector('.dialogue');
    const selectOption = document.querySelector('.select__option');

    if (dialogue && selectOption) {
        const lineEl = dialogue.querySelector('.dialogue__line');
        const hour = new Date().getHours();
        const [before, after] =
            hour >= 5 && hour < 12 ? ['Good morning, ', '!'] :
            hour >= 12 && hour < 18 ? ['Good afternoon, ', '!'] :
            hour >= 18 && hour < 22 ? ['Good evening, ', '!'] :
            ['Oh! Still awake, ', '?'];
        const lines = [
            `${before}<span class="blue">Visitor</span>${after}`,
            "Welcome to Giulia's island! She designs websites, graphics and social media content.",
            'How can I help you today? Pick where you\'d like to go!',
        ];
        const instant = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let index = -1;
        let chars = [];
        let shown = 0;
        let timer = null;

        // every character gets its own span, hidden until typed, so the line never reflows while it grows
        const split = node => {
            [...node.childNodes].forEach(child => {
                if (child.nodeType === Node.TEXT_NODE) {
                    const frag = document.createDocumentFragment();
                    [...child.textContent].forEach(c => {
                        const span = document.createElement('span');
                        span.className = 'dialogue__char';
                        span.textContent = c;
                        frag.append(span);
                    });
                    child.replaceWith(frag);
                } else {
                    split(child);
                }
            });
        };

        const lineDone = () => {
            clearTimeout(timer);
            timer = null;
            chars.forEach(c => c.classList.add('is-typed'));
            shown = chars.length;
            const last = index === lines.length - 1;
            dialogue.classList.toggle('is-waiting', !last);
            if (last) {
                dialogue.classList.add('is-done');
                selectOption.classList.add('show-select-option');
            }
        };

        const typeNext = () => {
            if (shown >= chars.length) return lineDone();
            const c = chars[shown++];
            c.classList.add('is-typed');
            // a little pause after punctuation, like the game's text speed
            timer = setTimeout(typeNext, /[.,!?]/.test(c.textContent) ? 220 : 28);
        };

        const nextLine = () => {
            index++;
            dialogue.classList.remove('is-waiting');
            lineEl.innerHTML = lines[index];
            split(lineEl);
            chars = [...lineEl.querySelectorAll('.dialogue__char')];
            shown = 0;
            instant ? lineDone() : typeNext();
        };

        const advance = () => {
            if (timer) return lineDone();
            // a click before Fuffi starts talking just starts her sooner
            if (index === -1) clearTimeout(start);
            if (index < lines.length - 1) nextLine();
        };

        dialogue.addEventListener('click', advance);
        dialogue.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                advance();
            }
        });

        lineEl.textContent = '';
        // start once the bubble has faded in
        const start = setTimeout(nextLine, instant ? 0 : 1900);
    }



    // responsive toggle menu

    const navToggle = document.querySelector('.toggle__navbar');
    const navNavbar = document.querySelector('.navbar')
    const navNavigation = document.querySelector('.wrap__navigation');
    const navNavItems = document.querySelector('.wrap__nav-items')

    navToggle?.addEventListener('click', function () {
        navToggle.classList.toggle('active');
        navNavigation.classList.toggle('show');
        navNavItems.classList.toggle('show');
        navNavbar.classList.toggle('active')
    });

    document.addEventListener('click', function (event) {
        if (navNavbar && !navNavbar.contains(event.target)) {
            navToggle.classList.remove('active');
            navNavigation.classList.remove('show');
            navNavItems.classList.remove('show');
            navNavbar.classList.remove('active');
        }
    });


    // scroll progress bar + navbar state (modern layer, pages with a navbar only)

    if (navNavbar) {
        const progress = document.createElement('div');
        progress.id = 'scroll-progress';
        document.body.prepend(progress);

        let ticking = false;
        const updateScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.setProperty('--progress', max > 0 ? Math.min(window.scrollY / max, 1) : 0);
            navNavbar.classList.toggle('is-scrolled', window.scrollY > 20);
            ticking = false;
        };
        window.addEventListener('scroll', () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(updateScroll);
            }
        }, { passive: true });
        updateScroll();

        // back-to-top button
        const toTop = document.createElement('button');
        toTop.id = 'to-top';
        toTop.setAttribute('aria-label', 'Back to top');
        toTop.innerHTML = '<i class="bi bi-arrow-up"></i>';
        toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        document.body.append(toTop);
        window.addEventListener('scroll', () => toTop.classList.toggle('show', window.scrollY > 600), { passive: true });

        // spotlight that follows the cursor on project cards
        document.querySelectorAll('.single__project').forEach(card => {
            card.addEventListener('pointermove', e => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });

        // index of each tool tile, used to stagger its entrance and idle bob
        document.querySelectorAll('.wrap__icons.about .icon-s').forEach((icon, i) => icon.style.setProperty('--n', i));

        // elements that reveal on scroll, in addition to the sections already marked .fade-in
        document.querySelectorAll(
            '.single__project, .single__experience, .wrap__single-education, .drawing, .grid__project-content img'
        ).forEach(el => el.classList.add('fade-in'));
    }

    // little stars burst out of every click
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.addEventListener('click', e => {
            for (let i = 0; i < 6; i++) {
                const spark = document.createElement('img');
                const angle = (Math.PI * 2 * i) / 6 + Math.random() * 0.6;
                const dist = 28 + Math.random() * 30;
                spark.src = 'assets/img/stars.png';
                spark.alt = '';
                spark.className = 'click-spark';
                spark.style.left = e.clientX + 'px';
                spark.style.top = e.clientY + 'px';
                spark.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
                spark.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
                document.body.append(spark);
                setTimeout(() => spark.remove(), 800);
            }
        });
    }

    // reels: play only while visible, pause when scrolled away
    const reelVideos = document.querySelectorAll('video.reel__video');
    if (reelVideos.length && 'IntersectionObserver' in window) {
        const reelObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.play().catch(() => { });
                } else {
                    entry.target.pause();
                }
            });
        }, { threshold: 0.4 });
        reelVideos.forEach(video => reelObserver.observe(video));
    }

    // about hero: the character throws the project cards out of her raised hand, then they follow the pointer a little
    const heroCards = document.querySelector('.hero-cards');
    const heroAvatar = heroCards?.parentElement.querySelector(':scope > img');
    if (heroCards && heroAvatar && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const throwCards = () => {
            const a = heroAvatar.getBoundingClientRect();
            const hand = { x: a.left + a.width * 0.8, y: a.top + a.height * 0.18 };
            heroCards.querySelectorAll('.hero-card').forEach(card => {
                const r = card.getBoundingClientRect();
                card.style.setProperty('--fx', hand.x - (r.left + r.width / 2) + 'px');
                card.style.setProperty('--fy', hand.y - (r.top + r.height / 2) + 'px');
            });
            heroCards.classList.add('is-thrown');
        };
        heroAvatar.complete ? throwCards() : heroAvatar.addEventListener('load', throwCards, { once: true });

        const hero = heroCards.closest('.wrap__intro');
        if (window.matchMedia('(hover: hover)').matches) {
            hero.addEventListener('pointermove', e => {
                const r = hero.getBoundingClientRect();
                heroCards.style.setProperty('--px', ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
                heroCards.style.setProperty('--py', ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
            });
            hero.addEventListener('pointerleave', () => {
                heroCards.style.setProperty('--px', 0);
                heroCards.style.setProperty('--py', 0);
            });
        }
    }

    // scroll animation fade-in

    document.querySelectorAll('img[src*="/char-"]').forEach(character => {
        character.classList.add('fade-in');
    });

    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1, // 10% of the element must be visible
        rootMargin: "0px 0px -50px 0px" // Add margin at the bottom
    };

    // once the entrance is over, drop the stagger delay so hover motion is instant
    const markRevealed = el => setTimeout(() => {
        el.style.transitionDelay = '';
        el.classList.add('revealed');
    }, 1100);

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        let order = 0;
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                const el = entry.target;
                el.style.transitionDelay = Math.min(order++, 6) * 80 + 'ms';
                el.classList.add('visible');
                appearOnScroll.unobserve(el);
                markRevealed(el);
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });

    faders.forEach(fader => {
        appearOnScroll.observe(fader);

        const rect = fader.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            fader.classList.add('visible');
            markRevealed(fader);
        }
    });





    // filter projects

    const buttonsFilter = document.querySelectorAll('button.project__field');
    const projects = document.querySelectorAll('.single__project');

    buttonsFilter?.forEach(button => {
        button.addEventListener('click', function () {
            buttonsFilter.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            // on phones the filter bar scrolls sideways: keep the chosen one in view
            button.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
            const target = button.getAttribute('data-target');
            let shown = 0;
            projects.forEach(project => {
                if (target === 'all' || project.getAttribute('data-target').includes(target)) {
                    project.style.display = 'flex';
                    // restart the entrance animation, staggered
                    project.classList.remove('filter-in');
                    void project.offsetWidth;
                    project.style.setProperty('--i', shown++);
                    project.classList.add('filter-in');
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });

    // projects.html?filter=web-design opens with that filter on (links from the about scene)
    const initialFilter = new URLSearchParams(location.search).get('filter');
    if (initialFilter) {
        [...buttonsFilter].find(btn => btn.getAttribute('data-target') === initialFilter)?.click();
    }


    // drawing zoom
    const drawingButtons = document.querySelectorAll('.drawing');

    drawingButtons?.forEach(button => {
        button.addEventListener('click', function () {
            const imgElement = this.querySelector('img');
            const imgSrc = imgElement.getAttribute('src');
            const modalImg = document.getElementById('zoomedImage');
            modalImg.setAttribute('src', imgSrc);
        });
    });

    // tooltip

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))








    // loader
    const loader = document.getElementById('loader-overlay');
    const svgContainer = document.getElementById('svg-container');

    // Carica lo SVG da file esterno
    fetch('assets/img/svg/loader.svg')
        .then(res => res.text())
        .then(svg => {
            svgContainer.innerHTML = svg;

            // Dopo che è stato inserito nel DOM, possiamo animare
            gsap.registerPlugin(MotionPathPlugin);

            // Inserisci qui tutte le tue animazioni GSAP originali
            gsap.to("#whole-island", { transformOrigin: "bottom center", y: -15, rotation: 1, duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.fromTo("#tree", { rotation: -6, transformOrigin: "bottom center" }, { rotation: 5, duration: 2, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to("#leaf1", { transformOrigin: "center right", y: -3, duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.fromTo("#leaf2", { rotation: 3, transformOrigin: "bottom right" }, { rotation: -4, x: -3, y: -3, duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to("#leaf3", { rotation: -6, transformOrigin: "bottom center", duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to("#leaf4", { rotation: -6, y: -3, transformOrigin: "bottom left", duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to("#leaf5", { y: -3, transformOrigin: "top left", duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to("#water-circle1", { scaleX: 1.2, transformOrigin: "center center", duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1 });
            gsap.to("#water-circle2", { scaleX: 0.8, transformOrigin: "center center", duration: 1, ease: "sine.inOut", yoyo: true, repeat: -1, delay: -0.5 });
            gsap.fromTo("#tri-wave1", { x: -60 }, { x: 20, duration: 6, repeat: -1, ease: "none" });
            gsap.fromTo("#tri-wave2", { x: -10 }, { x: 50, duration: 6, repeat: -1, ease: "none" });
            gsap.fromTo("#tri-wave1>path, #tri-wave2>path", { scaleY: 0 }, { scaleY: 1, duration: 1, repeat: -1, yoyo: true, transformOrigin: "bottom center" });
            gsap.fromTo("#sine-wave-group *", { x: 0 }, { x: 75, repeat: -1, duration: 2, ease: "none" });
            gsap.fromTo("#sine-wave-group *", { scaleY: 0.8, transformOrigin: "bottom center" }, { scaleY: 1.2, transformOrigin: "bottom center", repeat: -1, duration: 1, yoyo: true, ease: "sine.inOut" });
            gsap.set("#fish-path", { scaleX: 1.3, scaleY: 1.3, transformOrigin: "bottom left" });
            gsap.to("#fish", {
                duration: 3,
                repeat: -1,
                repeatDelay: 4,
                ease: "slow(0.3, 0.7, false)",
                motionPath: {
                    path: "#fish-path",
                    align: "#fish-path",
                    alignOrigin: [0.5, 0.5],
                    autoRotate: true,
                    start: 0,
                    end: 1
                }
            });
        });

    // Link click → mostra loader
    // (mailto:, tel:, in-page anchors and downloads don't leave the page, so they must not trigger the loader)
    const links = Array.from(document.querySelectorAll('a[href]')).filter(link => {
        const href = link.getAttribute('href');
        return link.target !== '_blank'
            && !link.hasAttribute('download')
            && !/^(mailto:|tel:|javascript:|#)/i.test(href);
    });
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            loader.classList.add('visible');
            setTimeout(() => {
                window.location.href = href;
            }, 1000);
        });
    });

    // All'apertura pagina
    // sistema il loader bloccato con la freccia indietro del browser
    window.addEventListener('pageshow', () => {
        loader.classList.remove('visible');
    });

    // Fallback contro errori
    setTimeout(() => loader.classList.remove('visible'), 3000);




});
