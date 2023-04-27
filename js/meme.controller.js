'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gStartPos

function canvasInit(src, i) {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  addListeners()

  // resizeCanvas()

  if (src === 'gallery') {
    createMeme(`images/${getMemesArray()[i].name}`)
    createLine('Hello there!', { x: gElCanvas.width / 2, y: 50 })
  } else if (src === 'saved-meme') {
  }

  drawMeme(gElCanvas, getMeme(), 500, true)
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()
  // Listen for resize ev
  // window.addEventListener('resize', resizeCanvas)
  // window.addEventListener('resize', () => {
  //   onInit()
  // })
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
  drawMeme(gElCanvas, getMeme(), 500, true)
}

function setTextInputValue(val) {
  const elTextInput = document.querySelector('.input-text')
  elTextInput.value = val
}

function onAddLine() {
  document.querySelector('.input-text').value = ''

  createLine('TEXT', { x: gElCanvas.width / 2, y: gElCanvas.height - 64 })
  drawMeme(gElCanvas, getMeme(), 500, true)
}

function onNextLine() {
  advanceLine()
  drawMeme(gElCanvas, getMeme(), 500, true)
}

function onDeleteLine() {
  deleteLine()
  drawMeme(gElCanvas, getMeme(), 500, true)
}

function onFontSizeChange(change) {
  setFontSize(change)
  drawMeme(gElCanvas, getMeme(), 500, true)
}

function onTextAlignChange(direction) {
  setTextAlign(direction)
  drawMeme(gElCanvas, getMeme(), 500, true)
}

function onFontFamilyChange(el) {
  setFontFamily(el.value)
  drawMeme(gElCanvas, getMeme(), 500, true)
}

function onFontColorChange(el) {
  setFontColor(el.value)
  drawMeme(gElCanvas, getMeme(), 500, true)
}

function onStrokeColorChange(el) {
  setStrokeColor(el.value)
  drawMeme(gElCanvas, getMeme(), 500, true)
}

function clearMarkedText() {
  unsetCurrLine()
  drawMeme(gElCanvas, getMeme(), 500, true)
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
      if (!elMainLayout) {
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
  setCurrLine(lineClicked[0], true)
  setLineDrag(true)
  gStartPos = pos

  setTextInputValue(getCurrLine().text)

  drawMeme(gElCanvas, getMeme(), 500, true)

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
  drawMeme(gElCanvas, getMeme(), 500, true)
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
  // console.log('pos:', pos)
  // Check if its a touch ev
  if (TOUCH_EVS.includes(ev.type)) {
    //soo we will not trigger the mouse ev
    ev.preventDefault()
    //Gets the first touch point
    ev = ev.changedTouches[0]
    //Calc the right pos according to the touch screen
    // console.log('ev.pageX:', ev.pageX)
    // console.log('ev.pageY:', ev.pageY)
    pos = {
      x: ev.pageX - ev.target.offsetLeft - ev.target.clientLeft,
      y: ev.pageY - ev.target.offsetTop - ev.target.clientTop,
    }
    // console.log('pos:', pos)
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
}
