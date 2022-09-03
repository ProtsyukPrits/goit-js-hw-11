import '../css/style.css';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import throttle from 'lodash.throttle';
import 'simplelightbox/dist/simple-lightbox.min.css'
import { cardsMarkup } from './cardsRender';
import { fetchData, fetchDataLoad } from './callFetch';

const NOTIFY_OPTIONS = {
  timeout: 1000,
  showOnlyTheLastOne: true,
  clickToClose: true,
};
let query = '';
let items = [];
let page = 1;
const PHOTOES_PER_PAGE = 40;

const refs = {
  formEl: document.querySelector('.search-form'),
  galleryEls: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.load-more'),
  btnSubmit: document.querySelector('#search-btn'),
  endContent: document.querySelector('#end-content'),
};

async function onSubmit(e) {
  e.preventDefault();

  refs.galleryEls.innerHTML = '';
  query = e.target.searchQuery.value.trim();
  if (!query) {
    emptySearch();
    return;
  }

  const data = await fetchData(query, page);
  items = data.hits;
  const createMarkupGallery = cardsMarkup(items);
  refs.galleryEls.insertAdjacentHTML('beforeend', createMarkupGallery);
  lightbox();

  try {
    if (items.length > 0) {
      let itemQuantity = data.totalHits;
      foundImg(itemQuantity);
      refs.btnLoadMore.classList.add('show');
    } else if (items.length <= 0) {
      refs.btnSubmit.disabled = true;
      noMaches();
    }

    if (PHOTOES_PER_PAGE > items.length) {
      endContent();
      refs.btnLoadMore.classList.remove('show');
      return;
    }
  } catch (error) {
    console.log(error);
  }
}


async function onBtnLoadMore() {
  const data = await fetchDataLoad(query);
  let moreItems = data.hits;
  const markupGallery = cardsMarkup(moreItems);
  refs.galleryEls.insertAdjacentHTML('beforeend', markupGallery);
  lightbox();
  const totalPages = Math.ceil(data.totalHits / PHOTOES_PER_PAGE);

  try {
    if (page === totalPages) {
      page += 1;
      endContent();
      refs.btnLoadMore.classList.remove('show');
      return;
    }
  } catch (error) {
    console.log(error);
  }
}

refs.formEl.addEventListener('submit', onSubmit);

// і закомітити слік
refs.btnLoadMore.addEventListener('click', onBtnLoadMore);

// Спробуйте розкомітити скрол 
// window.addEventListener(
//   'scroll',
//   throttle(() => {
//     onBtnLoadMore();
//   }, 300)
// );



function lightbox () {
  new SimpleLightbox('.gallery a', {
    captionDelay: 250,
   }).refresh();
}

function foundImg(itemQuantity) {
  Notiflix.Notify.info(
    `"Hooray! We found ${itemQuantity} images."`,
    NOTIFY_OPTIONS
  );
}

function emptySearch() {
  Notiflix.Notify.warning(
    `You should type request to recieve info`,
    NOTIFY_OPTIONS
  );
}

function noMaches() {
  Notiflix.Notify.failure(
    `Sorry there are no images maching your search query. Please try again`,
    NOTIFY_OPTIONS
  );
}

function endContent() {
  Notiflix.Notify.failure(
    `"We're sorry, but you've reached the end of search results."`,
    NOTIFY_OPTIONS
  );
}
