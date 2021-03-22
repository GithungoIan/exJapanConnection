// arrange the slides next to one another
const track = document.querySelector('.carousel__track');
const slides = Array.from(track.children);
const nextButton = document.querySelector('.carousel__button--right');
const prevButton = document.querySelector('.carousel__button--left');
const slideWidth = slides[0].getBoundingClientRect().width;
const setSlidePosition = (slide, index) => {
  slide.style.left = `${slideWidth * index}px`;
}
slides.forEach(setSlidePosition);

const moveTOSlide = (track, currentSlide, targetSlide) => {
  track.style.transform = `translateX(-${targetSlide.style.left})`
  currentSlide.classList.remove('current-slide');
  targetSlide.classList.add('current-slide');
}


const hideShowArrows = (slides, prevButton, nextButton, targetIndex) => {

  if(targetIndex === 0){
    prevButton.classList.add('is-hidden');
    nextButton.classList.remove('is-hidden');
  }else if(targetIndex === slides.length - 1){
    prevButton.classList.remove('is-hidden');
    nextButton.classList.add('is-hidden');
  }else {
    prevButton.classList.remove('is-hidden');
    nextButton.classList.remove('is-hidden')
  }
}

// When i click left, move slides to the left
prevButton.addEventListener('click', e => {
  const currentSlide = track.querySelector('.current-slide');
  const prevSlide = currentSlide.previousElementSibling;
  const prevIndex = slides.findIndex(slide => slide === prevSlide);

  moveTOSlide(track, currentSlide, prevSlide);
  hideShowArrows(slides, prevButton, nextButton, prevIndex);
});

// when i click right, move slides to the right
nextButton.addEventListener('click', e => {
  const currentSlide = track.querySelector('.current-slide');
  const nextSlide = currentSlide.nextElementSibling;
  const nextIndex = slides.findIndex(slide => slide === nextSlide);

  moveTOSlide(track, currentSlide, nextSlide);
  hideShowArrows(slides, prevButton, nextButton, nextIndex);
});
