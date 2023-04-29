'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gStartPos
let gSetWidth
let gIsChoosingColor

function canvasInit(src, i) {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  addListeners()

  // resizeCanvas()

  gSetWidth = window.innerWidth > 500 ? 500 : window.innerWidth

  if (src === 'gallery') {
    createMeme(`images/${getMemesArray()[i].name}`)
    createLine('Hello there!', { x: gSetWidth / 2, y: 50 })
  } else if (src === 'saved-meme') {
  }

  drawMeme(gElCanvas, getMeme(), gSetWidth, true)
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()
}

/*******************************/
/*Setting up the canvas*/
/*******************************/

function resizeCanvas() {
  const elContainer = document.querySelector('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
  drawMeme(getMeme())
}

/*******************************/
/*Handling input*/
/*******************************/

function onLineTextInput(el) {
  if (!getCurrLine()) return
  setCurrLineText(el.value)
  drawMeme(gElCanvas, getMeme(), gSetWidth, true)
}

function setTextInputValue(val) {
  const elTextInput = document.querySelector('.input-text')
  elTextInput.value = val
}

function onAddLine() {
  document.querySelector('.input-text').value = ''

  createLine('TEXT', { x: gElCanvas.width / 2, y: gElCanvas.height - 64 })
  drawMeme(gElCanvas, getMeme(), gSetWidth, true)
}

function onNextLine() {
  advanceLine()
  drawMeme(gElCanvas, getMeme(), gSetWidth, true)
}

function onDeleteLine() {
  deleteLine()
  drawMeme(gElCanvas, getMeme(), gSetWidth, true)
}

function onFontSizeChange(change) {
  if (isLineSelected()) {
    setFontSize(change)
    drawMeme(gElCanvas, getMeme(), gSetWidth, true)
  }
}

function onTextAlignChange(direction) {
  if (isLineSelected()) {
    setTextAlign(direction)
    drawMeme(gElCanvas, getMeme(), gSetWidth, true)
  }
}

function onFontFamilyChange(el) {
  if (isLineSelected()) {
    setFontFamily(el.value)
    drawMeme(gElCanvas, getMeme(), gSetWidth, true)
  }
}

function onFontColorChange(el) {
  if (isLineSelected()) {
    setFontColor(el.value)
    drawMeme(gElCanvas, getMeme(), gSetWidth, true)
  }
  gIsChoosingColor = false
}

function onStrokeColorChange(el) {
  if (isLineSelected()) {
    setStrokeColor(el.value)
    drawMeme(gElCanvas, getMeme(), gSetWidth, true)
  }
  gIsChoosingColor = false
}

function clearMarkedText() {
  unsetCurrLine()
  drawMeme(gElCanvas, getMeme(), gSetWidth, true)
}

function setChoosingColor() {
  gIsChoosingColor = true
}

/*******************************/
/*Handling Mouse and Touch events*/
/*******************************/

function addMouseListeners() {
  gElCanvas.addEventListener('mousedown', onDown)
  gElCanvas.addEventListener('mousemove', onMove)
  gElCanvas.addEventListener('mouseup', onUp)

  document.addEventListener('mousedown', function (event) {
    if (event.button === 0) {
      const elMainLayout = event.target.closest('.main-layout')
      if (!elMainLayout && !gIsChoosingColor) {
        clearMarkedText()
      }
    }
  })
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchstart', onDown)
  gElCanvas.addEventListener('touchmove', onMove)
  gElCanvas.addEventListener('touchend', onUp)
}

function onDown(ev) {
  const pos = getEvPos(ev)
  const lineClicked = getLineClicked(pos)

  if (lineClicked.length === 0) return
  setCurrLine(lineClicked[0])
  setLineDrag(true)
  gStartPos = pos

  setTextInputValue(getCurrLine().text)

  drawMeme(gElCanvas, getMeme(), gSetWidth, true)

  document.body.style.cursor = 'grabbing'
}

function onMove(ev) {
  const currLine = getCurrLine()
  if (!currLine || !currLine.isDrag) return

  const pos = getEvPos(ev)
  const dx = pos.x - gStartPos.x
  const dy = pos.y - gStartPos.y
  moveLine(dx, dy)
  gStartPos = pos
  drawMeme(gElCanvas, getMeme(), gSetWidth, true)
}

function onUp() {
  const currLine = getCurrLine()
  if (!currLine || !currLine.isDrag) return
  setLineDrag(false)
  gStartPos = null
  document.body.style.cursor = 'default'
}

function getEvPos(ev) {
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }

  if (TOUCH_EVS.includes(ev.type)) {
    ev.preventDefault()
    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
  }
  return pos
}

/*******************************/
/*Handling output*/
/*******************************/

function onDownloadClick() {
  setDownloadAsRequired()
  clearMarkedText()
}

function onSaveClick() {
  clearMarkedText()
  saveMeme(getMeme())
  renderSavedMemes()
  setNoSavedMemesVisibility(false)

  const elMemeSaved = document.querySelector('.meme-saved')
  elMemeSaved.style.display = 'block'
  setTimeout(() => {
    elMemeSaved.classList.add('slide-up')
    setTimeout(() => {
      elMemeSaved.classList.remove('slide-up')
      elMemeSaved.style.display = 'none'
    }, 1000)
  }, 1)
}
