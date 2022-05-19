import './sass/main.scss';
import debounce from 'lodash.debounce';
import axios, { Axios } from 'axios';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
// import InfiniteScroll from 'infinite-scroll';
import ImagesApiService from './js/ssearch-images-service';
const DEBOUNCE_DELAY = 300;
// =======================Посилання на елементи форми=================

const inputEl = document.querySelector('.search-form__input');
const searchBtn = document.querySelector('.search-form__btn');
const galeryEl = document.querySelector('.gallery');
const showMoreBtn = document.querySelector('.load-more');

const imagesApiService = new ImagesApiService();

// ======================Слухачі======================================
searchBtn.addEventListener('click', onBtnClick);
showMoreBtn.addEventListener('click', onShowMoreBtnClick);
function onBtnClick(evt) {
  evt.preventDefault();
  imagesApiService.qwery = inputEl.value.trim();

  imagesApiService.fetchImages().then(img => {
    const imgsArray = img.data.hits;
    console.log(imgsArray);
    if (imgsArray.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      galeryEl.innerHTML = ImgCardRender(imgsArray);
      new SimpleLightbox('.gallery a', {
        captionDelay: '250ms',
        captionsData: 'alt',
      }).refresh();
    }
  });
  imagesApiService.nexPage += 1;
}

function onShowMoreBtnClick() {
  imagesApiService.qwery = inputEl.value.trim();
  imagesApiService.fetchImages().then(img => {
    const imgsArray = img.data.hits;
    console.log(imgsArray);
    if (imgsArray.length === 0) {
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      galeryEl.innerHTML = ImgCardRender(imgsArray);
      new SimpleLightbox('.gallery a', {
        captionDelay: '250ms',
        captionsData: 'alt',
      }).refresh();
    }
  });
}

function ImgCardRender(arg) {
  return arg
    .map(
      item => `<a class="gallery-item post" href="${item.largeImageURL}"> <div class="photo-card">
      <img src="${item.webformatURL}" alt="${item.tags}" width="350" height="200" loading="lazy" />

  <div class="info">
    <p class="info-item">
      <b>Likes </b>
      <span class="info-item__wrap">${item.likes}</span>
    </p>
    <p class="info-item">
      <b>Views </b>
      <span class="info-item__wrap">${item.views}</span>
    </p>
    <p class="info-item">
      <b>Comments </b>
      <span class="info-item__wrap">${item.comments}</span>
    </p>
    <p class="info-item">
      <b>Downloads </b>
      <span class="info-item__wrap">${item.downloads}</span>
    </p>
  </div>
</div></a>`,
    )
    .join('');
}

// inputEl.addEventListener('input', debounce(onInputType, DEBOUNCE_DELAY));

// function onInputType() {
//   const searchingImg = inputEl.value.trim();

//   getImages(searchingImg).then(img => {
//     const imgsArray = img.data.hits;
//     console.log(imgsArray);
//     galeryEl.innerHTML = ImgCardRender(imgsArray);
//   });
// }
