document.addEventListener("DOMContentLoaded", () => {
    const fadeEls = document.querySelectorAll('body .fade-in');
    const deepLinkEls = document.querySelectorAll("a[id]");
    const footerYearEl = document.querySelector(".footer-year");
    const headerEl = document.querySelector("header");
    const codeEls = document.querySelectorAll("pre code");
    const headerHeight = headerEl.offsetHeight;

    headerEl.classList.add("sticky");
    document.documentElement.classList.add("js-enabled");

    fadeInOnScroll(fadeEls);

    deepLinkEls.forEach(section => {
        section.style.scrollMarginTop = `${headerHeight}px`;
    });

    const deepLinksObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const targetId = entry.target.id ? `#${entry.target.id}` : '';
                history.replaceState(null, null, targetId);
            }
        });
    }, {
        root: null,
        threshold: 0.5,
        rootMargin: "-20% 0px -70% 0px",
    });

    deepLinkEls.forEach(section => {
        deepLinksObserver.observe(section);

        section.addEventListener("click", (e) => {
            e.preventDefault();

            const deepLink = `${window.location.origin}${window.location.pathname}#${section.id}`;
            const headerHeight = headerEl.offsetHeight;

            navigator.clipboard.writeText(deepLink);

            section.style.scrollMarginTop = `${headerHeight}px`;

            section.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    });

    codeEls.forEach((block) => {
        const lines = block.textContent.split("\n");

        const minIndent = lines
            .filter(line => line.trim().length > 0)
            .reduce((min, line) => {
                const leadingSpaces = line.match(/^(\s*)/)[0].length;
                return Math.min(min, leadingSpaces);
            }, Infinity);

        block.textContent = lines.map(line => line.slice(minIndent)).join("\n").trim();
    });

    footerYearEl.textContent = new Date().getFullYear();

    function fadeInOnScroll(elements) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = "translateY(0)";
                    entry.target.style.transition = "opacity 0.5s ease-out, transform 0.5s ease-out";
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        elements.forEach(el => observer.observe(el));
    }
});

// Image comparison slider functionality
(function() {
    const slider = document.getElementById('comparison-slider');
    const overlay = document.getElementById('comparison-overlay');

    if (!slider || !overlay) return;

    const wrapper = slider.closest('.comparison-wrapper');
    const overlayImage = overlay.querySelector('img');
    let isActive = false;

    // Set overlay image width to match wrapper width
    function updateImageWidth() {
        const wrapperWidth = wrapper.offsetWidth;
        overlayImage.style.width = wrapperWidth + 'px';
    }

    // Initial setup
    updateImageWidth();
    window.addEventListener('resize', updateImageWidth);

    function updateSliderPosition(x) {
        const rect = wrapper.getBoundingClientRect();
        const position = Math.max(0, Math.min(x - rect.left, rect.width));
        const percentage = (position / rect.width) * 100;

        overlay.style.width = percentage + '%';
        slider.style.left = percentage + '%';
    }

    slider.addEventListener('mousedown', function() {
        isActive = true;
    });

    document.addEventListener('mouseup', function() {
        isActive = false;
    });

    document.addEventListener('mousemove', function(e) {
        if (!isActive) return;
        updateSliderPosition(e.clientX);
    });

    slider.addEventListener('touchstart', function() {
        isActive = true;
    });

    document.addEventListener('touchend', function() {
        isActive = false;
    });

    document.addEventListener('touchmove', function(e) {
        if (!isActive) return;
        updateSliderPosition(e.touches[0].clientX);
    });

    // Also allow clicking anywhere on the wrapper to move slider
    wrapper.addEventListener('click', function(e) {
        if (e.target === slider || slider.contains(e.target)) return;
        updateSliderPosition(e.clientX);
    });
})();
