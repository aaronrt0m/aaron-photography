const galleries = document.querySelectorAll('.portfoliocontainer');
const lightbox = document.querySelector('.lightbox');

if (galleries.length > 0 && lightbox instanceof HTMLDialogElement) {
    const photos = Array.from(galleries).flatMap((gallery) =>
        Array.from(gallery.querySelectorAll('.portfolioimage'))
    );
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCaption = lightbox.querySelector('.lightbox-caption');
    const count = lightbox.querySelector('.lightbox-count');
    const closeButton = lightbox.querySelector('.lightbox-close');
    const previousButton = lightbox.querySelector('.lightbox-previous');
    const nextButton = lightbox.querySelector('.lightbox-next');
    let activeIndex = 0;
    let lastFocusedPhoto = null;
    const preloadedPhotos = new Map();

    const preloadPhoto = (index) => {
        const photoIndex = (index + photos.length) % photos.length;
        if (preloadedPhotos.has(photoIndex)) {
            return;
        }

        const image = photos[photoIndex].querySelector('img');
        const preloadImage = new Image();
        preloadImage.decoding = 'async';
        preloadImage.src = image.currentSrc || image.src;
        preloadedPhotos.set(photoIndex, preloadImage);
    };

    const showPhoto = (index) => {
        activeIndex = (index + photos.length) % photos.length;
        const photo = photos[activeIndex];
        const image = photo.querySelector('img');

        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightboxCaption.textContent = photo.querySelector('figcaption')?.textContent ?? '';
        count.textContent = `${activeIndex + 1} / ${photos.length}`;
        preloadPhoto(activeIndex + 1);
        preloadPhoto(activeIndex - 1);
    };

    photos.forEach((photo, index) => {
        photo.setAttribute('role', 'button');
        photo.setAttribute('tabindex', '0');
        photo.setAttribute('aria-label', `Open photo ${index + 1} of ${photos.length}`);

        const openPhoto = () => {
            lastFocusedPhoto = photo;
            showPhoto(index);
            lightbox.showModal();
        };

        photo.addEventListener('click', openPhoto);
        photo.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openPhoto();
            }
        });
    });

    closeButton.addEventListener('click', () => lightbox.close());
    previousButton.addEventListener('click', () => showPhoto(activeIndex - 1));
    nextButton.addEventListener('click', () => showPhoto(activeIndex + 1));

    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            lightbox.close();
        }
    });

    lightbox.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            lightbox.close();
        } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            showPhoto(activeIndex - 1);
        } else if (event.key === 'ArrowRight') {
            event.preventDefault();
            showPhoto(activeIndex + 1);
        }
    });

    lightbox.addEventListener('close', () => {
        lastFocusedPhoto?.focus();
    });
}

const revealElements = document.querySelectorAll('.scroll-reveal');

if (
    revealElements.length > 0 &&
    'IntersectionObserver' in window &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches
) {
    document.documentElement.classList.add('scroll-reveal-enabled');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach((element) => revealObserver.observe(element));
}
