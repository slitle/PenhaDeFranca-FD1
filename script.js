// Auto-scroll carousel to the left and loop
(function(){
    const carousel = document.getElementById('carousel');
    if (!carousel) return;
    const slidesEl = carousel.querySelector('.slides');
    const slides = slidesEl.querySelectorAll('img');
    let index = 0;
    const total = slides.length;
    let interval = null;

    function goNext(){
        index = (index + 1) % total;
        slidesEl.style.transform = `translateX(-${index * 100}%)`;
    }

    function start(){
        if (interval) return;
        interval = setInterval(goNext, 3000);
    }

    function stop(){
        if (!interval) return;
        clearInterval(interval);
        interval = null;
    }

    // Pause on hover/touch
    carousel.addEventListener('mouseenter', stop);
    carousel.addEventListener('mouseleave', start);
    carousel.addEventListener('touchstart', stop, {passive:true});
    carousel.addEventListener('touchend', start, {passive:true});

    // Optional: allow swipe to change slides
    let startX = 0;
    let deltaX = 0;
    carousel.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, {passive:true});
    carousel.addEventListener('touchmove', e => { deltaX = e.touches[0].clientX - startX; }, {passive:true});
    carousel.addEventListener('touchend', e => {
        if (Math.abs(deltaX) > 50){
            if (deltaX > 0) index = (index - 1 + total) % total;
            else index = (index + 1) % total;
            slidesEl.style.transform = `translateX(-${index * 100}%)`;
        }
        startX = 0; deltaX = 0;
    });

    // Start autoplay
    start();
})();
