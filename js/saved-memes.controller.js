'use strict'

function renderSavedMemes() {
  console.log('here')
  let cardsHTML = ''
  cardsHTML += getSavedMemes()
    .map((_, i) => {
      return `
      <article id="meme_canvas_${i}" class="saved-memes-item">
      <canvas id="meme_canvas_${i}" width="218" height="218"></canvas>
      <div class="saved-memes-item-overlay flex column">
      <i onclick="onEditSavedMemeClick(${i})" class="fa-solid fa-pen flex"></i>
      <i class="fa-solid fa-trash flex"></i>
      </div>
      </article>
      `
    })
    .join('')
  document.querySelector('.saved-memes').innerHTML = cardsHTML

  // const memeId = meme.img.replace('images/meme-', '').replace('.jpg', '')
  const elCanvas = document.querySelectorAll('.saved-memes .saved-memes-item canvas')

  const savedMemes = getSavedMemes()

  const setWidth = window.innerWidth > 500 ? 500 : window.innerWidth

  elCanvas.forEach((el) => {
    const meme = savedMemes[el.id.split('_')[2]]
    drawMeme(el, meme, setWidth, true)
  })
}

function onEditSavedMemeClick(i) {
  //save to gmeme
  setMeme(getSavedMemes()[i])

  canvasInit('saved-meme')
  //page navigate
  onSwitchPage('generator')
}
