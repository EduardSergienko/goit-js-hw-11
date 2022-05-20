import axios, { Axios } from 'axios';

export default class ImagesApiService {
  constructor() {
    this.searchingImg = '';
    this.page = 1;
  }
  fetchImages() {
    const BASE_URL = 'https://pixabay.com/api/';
    const API_KEY = 'key=27491202-6941cbc6cc49fba95622056d0';
    return axios
      .get(
        ` ${BASE_URL}?${API_KEY}&q=${this.searchingImg}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=20`,
      )
      .catch(error => {
        if (error.request) {
          return;
        }
      });
  }

  resetPage() {
    this.page = 1;
  }

  get qwery() {
    return this.searchingImg;
  }
  set qwery(newQwery) {
    this.searchingImg = newQwery;
  }
  get nexPage() {
    return this.page;
  }
  set nexPage(newPage) {
    this.page = newPage;
  }
}
