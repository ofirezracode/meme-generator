'use strict'

function renderSavedMemes() {
  console.log('here')
  let cardsHTML = ''
  cardsHTML += getSavedMemes()
    .map((meme) => {
      return `
    <article class="saved-memes-item">
      <img src="${meme.img}" />
      <div class="saved-memes-item-overlay flex column">
        <i onclick="onEditSavedMemeClick()" class="fa-solid fa-pen flex"></i>
        <i class="fa-solid fa-trash flex"></i>
      </div>
    </article>
    `
    })
    .join('')
  document.querySelector('.saved-memes').innerHTML = cardsHTML
}

function onEditSavedMemeClick() {}
