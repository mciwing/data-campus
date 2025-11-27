// Inline Image Slideshow/Carousel functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all slideshows on the page
    const slideshows = document.querySelectorAll('.image-slideshow');

    slideshows.forEach(slideshow => {
        initSlideshow(slideshow);
    });
});

function initSlideshow(container) {
    const slides = container.querySelectorAll('.slideshow-slide');
    const prevBtn = container.querySelector('.slideshow-prev');
    const nextBtn = container.querySelector('.slideshow-next');
    const counter = container.querySelector('.slideshow-counter');

    let currentSlide = 0;

    // Show initial slide
    showSlide(currentSlide);

    // Event listeners for buttons
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = Math.max(0, currentSlide - 1);
            showSlide(currentSlide);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = Math.min(slides.length - 1, currentSlide + 1);
            showSlide(currentSlide);
        });
    }

    // Keyboard navigation (when slideshow is in viewport)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                container.dataset.active = 'true';
            } else {
                container.dataset.active = 'false';
            }
        });
    });
    observer.observe(container);

    document.addEventListener('keydown', (e) => {
        if (container.dataset.active !== 'true') return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            currentSlide = Math.max(0, currentSlide - 1);
            showSlide(currentSlide);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            currentSlide = Math.min(slides.length - 1, currentSlide + 1);
            showSlide(currentSlide);
        }
    });

    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => slide.classList.remove('active'));

        // Show current slide
        if (slides[index]) {
            slides[index].classList.add('active');
        }

        // Update counter
        if (counter) {
            counter.textContent = `Schritt ${index + 1} von ${slides.length}`;
        }

        // Update button states
        if (prevBtn) {
            prevBtn.disabled = (index === 0);
        }
        if (nextBtn) {
            nextBtn.disabled = (index === slides.length - 1);
        }
    }
}
