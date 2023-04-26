'use strict'

const TOUCH_EVS = ['touchstart', 'touchmove', 'touchend']

let gElCanvas
let gCtx
let gStartPos
let gDownloadRequired

function canvasInit(i) {
  gElCanvas = document.querySelector('canvas')
  gCtx = gElCanvas.getContext('2d')

  addListeners()

  // resizeCanvas()

  createMeme(`images/${getMemesArray()[i].name}`)
  createLine('Hello there!', { x: gElCanvas.width / 2, y: 50 })

  drawMeme()
}

function afterImgLoad(meme, elImg) {
  setCanvasDimensions(elImg.width, elImg.height)
  gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

  meme.lines.forEach((line) => {
    drawTextLine(meme, line)
  })

  if (gDownloadRequired) {
    downloadCanvas()
  }
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

function setCanvasDimensions(imgWidth, imgHeight) {
  let canvasWidth = imgWidth
  let canvasHeight = imgHeight
  let isWide = false
  if (canvasWidth > canvasHeight) isWide = true

  if (isWide) {
    if (canvasWidth > 650) {
      canvasWidth = 650
      canvasHeight = (imgHeight * canvasWidth) / imgWidth
    }
  } else {
    if (canvasHeight > 650) {
      canvasHeight = 650
      canvasWidth = (imgWidth * canvasHeight) / imgHeight
    }
  }

  gElCanvas.width = canvasWidth
  gElCanvas.height = canvasHeight
}

function resizeCanvas() {
  const elContainer = document.querySelector('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth
  gElCanvas.height = elContainer.offsetHeight
  drawMeme(getMeme())
}

/*******************************/
/*Drawing*/
/*******************************/

function drawMeme() {
  const meme = getMeme()
  const elImg = new Image()
  elImg.src = meme.img

  elImg.onload = () => {
    afterImgLoad(meme, elImg)
  }
}

function drawTextLine(meme, line) {
  gCtx.lineWidth = 2
  gCtx.strokeStyle = meme.strokeColor
  gCtx.fillStyle = meme.fontColor
  gCtx.font = `${meme.size}px ${meme.family}`
  gCtx.textAlign = meme.align
  gCtx.textBaseline = 'middle'

  const { pos } = line

  gCtx.fillText(line.text, pos.x, pos.y)
  gCtx.strokeText(line.text, pos.x, pos.y)

  calcLineDimensions(line, meme.align)

  if (line.isCurrLine) {
    const borderWidth = 2

    gCtx.strokeStyle = 'black'
    gCtx.lineWidth = borderWidth
    gCtx.setLineDash([8])

    const { startX, startY, width, height } = line.dimensions

    gCtx.strokeRect(startX, startY, width, height)

    gCtx.setLineDash([0])
  }
}

function calcLineDimensions(line, align) {
  const textWidth = gCtx.measureText(line.text).width
  const textHeight = gCtx.measureText(line.text).actualBoundingBoxAscent + gCtx.measureText(line.text).actualBoundingBoxDescent

  let borderWidth = 0
  let textPadding = 0
  let alignModifier = 0

  if (line.isCurrLine) {
    borderWidth = 2
    textPadding = 10
    if (align !== 'center') {
      alignModifier = textWidth / 2
    }
    if (align === 'right') {
      alignModifier *= -1
    }
  }

  const { pos } = line

  const lineDimensions = {
    startX: pos.x - textWidth / 2 - borderWidth - textPadding + alignModifier,
    startY: pos.y - textHeight / 2 - borderWidth - textPadding,
    width: textWidth + borderWidth * 2 + textPadding * 2,
    height: textHeight + borderWidth * 2 + textPadding * 2,
  }

  setLineDimensions(line, lineDimensions)
}

function clearMarkedText() {
  unsetCurrLine()
  drawMeme()
}

/*******************************/
/*Handling input*/
/*******************************/

function onLineTextInput(el) {
  if (!getCurrLine()) return
  setCurrLineText(el.value)
  drawMeme()
}

function setTextInputValue(val) {
  const elTextInput = document.querySelector('.input-text')
  elTextInput.value = val
}

function onAddLine() {
  document.querySelector('.input-text').value = ''

  createLine('TEXT', { x: gElCanvas.width / 2, y: gElCanvas.height - 64 })
  drawMeme()
}

function onNextLine() {
  advanceLine()
  drawMeme()
}

function onDeleteLine() {
  deleteLine()
  drawMeme()
}

function onFontSizeChange(change) {
  setFontSize(change)
  drawMeme()
}

function onTextAlignChange(direction) {
  setTextAlign(direction)
  drawMeme()
}

function onFontFamilyChange(el) {
  setFontFamily(el.value)
  drawMeme()
}

function onFontColorChange(el) {
  setFontColor(el.value)
  drawMeme()
}

function onStrokeColorChange(el) {
  setStrokeColor(el.value)
  drawMeme()
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

  drawMeme()

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
  drawMeme()
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

function onDownloadClick(elLink) {
  gDownloadRequired = elLink
  clearMarkedText()
}

function downloadCanvas() {
  const data = gElCanvas.toDataURL()

  const a = document.createElement('a')
  a.href = data
  a.download = 'my-meme'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  gDownloadRequired = null
}
