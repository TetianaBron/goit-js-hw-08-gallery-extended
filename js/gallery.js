import items from './gallery-items.js';

const gallery = document.querySelector('.js-gallery');

gallery.insertAdjacentHTML('afterbegin', htmlGallery());

function htmlGallery() {
  return items
    .map(
      ({ preview, original, description }) =>
        `<li class='gallery__item'><a class="gallery__link" href="${original}"><img class='gallery__image' src="${preview}" data-source="${original}" alt="${description}"></li>`,
    )
    .join('');
};

const previewImage = (function (images) {
  let index = 0;
  return {
    calculateIndex: function (src) {
      for (let i = 0; i < images.length; i++) {
        if (images[i].original === src) {
          index = i;
          break;
        }
      }  
    },
    prev: function () {
      if (--index < 0) index = images.length - 1;
      return images[index];
    },
    next: function () {
      if (++index > images.length - 1) index = 0;
      return images[index];
    }
  };
})(items);

const container = document.querySelector('.js-gallery');
const lightboxImg = document.querySelector('.lightbox__image');
const lightbox = document.querySelector('.js-lightbox');
const lightboxButton = document.querySelector('button[data-action="close-lightbox"]');
const lightboxOverlay = document.querySelector('.lightbox__overlay');
  
container.addEventListener('click', openModalbyClick);

function openModalbyClick(evt) {
  evt.preventDefault();
  if (evt.target.nodeName !== 'IMG') {
    return;
  } 
   // evt.target.getAttribute('data-source');
  openModal(evt.target.dataset.source, evt.target.alt);
}

function openModal(src, alt) {
  window.addEventListener('keydown', onKeyPress);
  lightbox.classList.add('is-open');
  lightboxImg.src = src;
  lightboxImg.alt = alt;
  previewImage.calculateIndex(src);
}

function openImagebyFocus(evt) {
  if (evt.code === 'Enter' && evt.target.classList.contains('gallery__link')) {
    const image = evt.target.querySelector('img');
    openModal(image.dataset.source, image.alt);
  }
}

window.addEventListener('keydown', openImagebyFocus);

lightboxButton.addEventListener('click', closeModal);

function closeModal() {
  window.removeEventListener('keydown', onKeyPress);
  lightbox.classList.remove('is-open');
  lightboxImg.removeAttribute('src');
  lightboxImg.removeAttribute('alt');
}

 lightboxOverlay.addEventListener('click', closeModalOnOverlay);

function closeModalOnOverlay() {
  closeModal();
}

function onKeyPress(evt) {
  if (evt.code === 'Escape') {
   closeModal();
  } else if (evt.code === 'ArrowLeft') {
    const prevImage = previewImage.prev();
    lightboxImg.src = prevImage.original;
    lightboxImg.alt = prevImage.description;
  } else if (evt.code === 'ArrowRight') {
    const nextImage = previewImage.next();
    lightboxImg.src = nextImage.original;
    lightboxImg.alt = nextImage.description;
  }
}


