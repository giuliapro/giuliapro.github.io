document.addEventListener('DOMContentLoaded', function () {

    // fade-in nero
    const overlay = document.getElementById("black-overlay");
    if (overlay) {
        overlay.style.opacity = "0";

        setTimeout(() => {
            overlay.remove();
        }, 2000);
    }


    // display select index

    const thirdLine = document.querySelector('.third_line');
    const selectOption = document.querySelector('.select__option');

    thirdLine?.addEventListener('animationend', function () {
        selectOption.classList.add('show-select-option');
    });



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
        if (!navNavbar.contains(event.target)) {
            navToggle.classList.remove('active');
            navNavigation.classList.remove('show');
            navNavItems.classList.remove('show');
            navNavbar.classList.remove('active');
        }
    });


    // scroll animation fade-in

    const faders = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.1, // 10% of the element must be visible
        rootMargin: "0px 0px -50px 0px" // Add margin at the bottom
    };

    const appearOnScroll = new IntersectionObserver(function (entries, appearOnScroll) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('visible');
                appearOnScroll.unobserve(entry.target);
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
        }
    });





    // filter projects

    const buttonsFilter = document.querySelectorAll('button.project__field');
    const projects = document.querySelectorAll('.single__project');

    buttonsFilter?.forEach(button => {
        button.addEventListener('click', function () {
            buttonsFilter.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const target = button.getAttribute('data-target');
            projects.forEach(project => {
                if (target === 'all' || project.getAttribute('data-target').includes(target)) {
                    project.style.display = 'flex';
                } else {
                    project.style.display = 'none';
                }
            });
        });
    });


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
    const links = Array.from(document.querySelectorAll('a[href]')).filter(link => link.target !== '_blank');
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