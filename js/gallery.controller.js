'use strict'

function renderGallery() {
  let cardsHTML = ''
  cardsHTML += gMemesArray
    .map((meme, i) => {
      return `
    <article onclick="onGalleryItemClick(${i})" class="gallery-item">
      <img src="/images/${meme.name}" />
      <div class="gallery-item-overlay flex column">
        <i class="fa-solid fa-pen flex center"></i>
        <p>${meme.description}</p>
      </div>
    </article>
    `
    })
    .join('')

  document.querySelector('.gallery').innerHTML = cardsHTML
}

function onGalleryItemClick(itemIndex) {
  console.log('onGalleryItemClick')
  canvasInit(itemIndex)
  onSwitchPage('generator')
}
