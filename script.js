const slider = document.querySelector('.slider-container');
const slides = Array.from(slider.querySelectorAll('.slide'));

let isDragged = false;
let startPosition = 0;
let currentTranslate = 0;
let previousTranslate = 0;
let animationID = 0;
let currentSlide = 0;

slides.forEach((slide, index) => {
    // preventing the default behavious of click and drag an image
    const slideImage = slide.querySelector('img');
    slideImage.addEventListener('dragstart', e => e.preventDefault());

    // Touch events
    slide.addEventListener('touchstart', touchStart(index));
    slide.addEventListener('touchend', touchEnd);
    slide.addEventListener('touchmove', touchMove);

    // Mouse events
    slide.addEventListener('mousedown', touchStart(index));
    slide.addEventListener('mouseup', touchEnd);
    slide.addEventListener('mouseleave', touchEnd);
    slide.addEventListener('mousemove', touchMove);
});

// disabling browsers context menu (right click)
window.oncontextmenu = function(e) {
    e.preventDefault();
    e.stopPropagation();
    return false;
}

function touchStart(index) {
    return function(event) {
        currentSlide = index;
        // checking if its a mouse or finger touch / desktop or mobile
        startPosition = getPositionX(event);

        isDragged = true;
        console.log('start');

        animationID = requestAnimationFrame(slideAnimation);

        slider.classList.add('grabbed');
    }
}

function getPositionX(event) {
    return event.type.includes('mouse') 
    ? event.pageX : event.touches[0].clientX;
}

function slideAnimation() {
    setSliderPosition();
    // calling function reqursively
    if (isDragged) requestAnimationFrame(slideAnimation);
}

function setSliderPosition() {
    slider.style.transform = `translateX(${currentTranslate}px)`;
}

function touchEnd() {
    isDragged = false;
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate - previousTranslate;
    if (movedBy < -100 && currentSlide < slides.length - 1) currentSlide += 1;
    if (movedBy > 100 && currentSlide > 0) currentSlide -= 1;

    setPositionByIndex();
    
    slider.classList.remove('grabbed');

    // console.log('end');
}

function setPositionByIndex() {
    currentTranslate = currentSlide * -window.innerWidth;
    previousTranslate = currentTranslate;

    setSliderPosition();
}

function touchMove(event) {
    if (isDragged) {
        const currentPosition = getPositionX(event); 
        currentTranslate = previousTranslate + currentPosition - startPosition;

        console.log('move');
    }
}