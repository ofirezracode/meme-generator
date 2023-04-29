'use strict'

function renderSavedMemes() {
  let cardsHTML = ''
  const savedMemes = getSavedMemes()
  cardsHTML += savedMemes
    .map((_, i) => {
      return `
      <article id="meme_canvas_${i}" class="saved-memes-item">
      <canvas id="meme_canvas_${i}" width="218" height="218"></canvas>
      <div class="saved-memes-item-overlay flex column">
      <i onclick="onEditSavedMemeClick(${i})" class="fa-solid fa-pen flex"></i>
      <i onclick="onDeleteSavedMemeClick(${i})" class="fa-solid fa-trash flex"></i>
      </div>
      </article>
      `
    })
    .join('')
  document.querySelector('.saved-memes').innerHTML = cardsHTML

  // const memeId = meme.img.replace('images/meme-', '').replace('.jpg', '')
  const elCanvas = document.querySelectorAll('.saved-memes .saved-memes-item canvas')

  const setWidth = window.innerWidth > 500 ? 500 : window.innerWidth

  elCanvas.forEach((el) => {
    const meme = savedMemes[el.id.split('_')[2]]
    drawMeme(el, meme, setWidth, true)
  })
}

function onEditSavedMemeClick(i) {
  setMeme(getSavedMemes()[i])
  canvasInit('saved-meme')
  onSwitchPage('generator')
}

function onDeleteSavedMemeClick(i) {
  deleteMeme(i)
  renderSavedMemes()
  if (getSavedMemes().length === 0) {
    setNoSavedMemesVisibility(true)
  }
}

function setNoSavedMemesVisibility(isVisible) {
  if (isVisible) {
    document.querySelector('.no-saved-memes').classList.remove('hidden')
  } else {
    document.querySelector('.no-saved-memes').classList.add('hidden')
  }
}
