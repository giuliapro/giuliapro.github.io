document.addEventListener('DOMContentLoaded', function () {


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


    // scroll animation

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


});