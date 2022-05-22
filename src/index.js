import './sass/main.scss';

import axios, { Axios } from 'axios';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import ImagesApiService from './js/ssearch-images-service';

// =======================Посилання на елементи форми=================

const inputEl = document.querySelector('.search-form__input');
const searchBtn = document.querySelector('.search-form__btn');
const galeryEl = document.querySelector('.gallery');
// const showMoreBtn = document.querySelector('.load-more');

const imagesApiService = new ImagesApiService();

// ======================Слухачі======================================
searchBtn.addEventListener('click', onBtnClick);
// document.addEventListener('scroll', smoothScroll);
// showMoreBtn.addEventListener('click', onShowMoreBtnClick);

// ====================Функції Слухачів===============================

let lightBox = null;

async function onBtnClick(evt) {
  evt.preventDefault();
  window.addEventListener('scroll', onWindowScroll);
  imagesApiService.qwery = inputEl.value.trim();
  imagesApiService.resetPage();
  if (imagesApiService.qwery !== '') {
    try {
      const resolve = await imagesApiService.fetchImages();
      const imgArray = resolve.data.hits;

      if (imgArray.length === 0) {
        galeryEl.innerHTML = '';
        Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      } else {
        galeryEl.innerHTML = ImgCardRender(imgArray);
        Notify.info(`Hooray! We found ${resolve.data.totalHits} images.`);
      }

      imagesApiService.nexPage += 1;

      addLightBox();

      return imgArray;
    } catch (error) {
      console.log(error);
    }
  }
}

async function onWindowScroll() {
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
    try {
      const response = await imagesApiService.fetchImages();
      const imgsArray = response.data.hits;
      console.log(imgsArray);
      if (imgsArray.length === 0) {
        Notify.failure("We're sorry, but you've reached the end of search results.");
      } else {
        galeryEl.insertAdjacentHTML('beforeend', ImgCardRender(imgsArray));
        smoothScroll();
      }

      imagesApiService.nexPage += 1;

      refreshLightBox();

      return imgsArray;
    } catch (error) {
      Notify.failure("We're sorry, but you've reached the end of search results.");
      window.removeEventListener('scroll', onWindowScroll);
      console.log(error);
    }
  }
}

// ========================Інші функції==========================================

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

function addLightBox() {
  lightBox = new SimpleLightbox('.gallery a', {
    captionDelay: '250ms',
    captionsData: 'alt',
  });
}
function refreshLightBox() {
  lightBox.refresh();
}

function smoothScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

// function onShowMoreBtnClick() {
//   imagesApiService.qwery = inputEl.value.trim();
//   imagesApiService
//     .fetchImages()
//     .then(img => {
//       const imgsArray = img.data.hits;
//       console.log(img.data);
//       galeryEl.insertAdjacentHTML('beforeend', ImgCardRender(imgsArray));
//       const lightBox = new SimpleLightbox('.gallery a', {
//         captionDelay: '250ms',
//         captionsData: 'alt',
//       });
//       lightBox.refresh();
//       imagesApiService.nexPage += 1;
//     })
//     .catch(error => {
//       return console.log(error);
//     });
// }
