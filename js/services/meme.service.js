'use strict'

let gMeme = {
  img: '',
  lines: [
    {
      text: 'Howdy!',
      pos: {},
      rotation: {},
      isCurrLine: true,
      size: '',
      align: '',
      family: '',
      fontColor: '',
      strokeColor: '',
    },
  ],
}

let gCurrLine = 0

function getMeme() {
  return gMeme
}

function createMeme(img) {
  gMeme = {
    img,
    lines: [],
  }
}

function setMeme(meme) {
  gMeme = meme
}

function createLine(
  text = '',
  pos = '',
  rotation = '',
  size = 32,
  align = 'center',
  family = 'impact',
  fontColor = 'white',
  strokeColor = 'black'
) {
  _resetCurrLine()
  gMeme.lines.push({
    text,
    pos,
    rotation,
    isCurrLine: true,
    size,
    align,
    family,
    fontColor,
    strokeColor,
  })
  gCurrLine = gMeme.lines.length - 1
}

function isLineSelected() {
  return !(gCurrLine === null)
}

function setFontSize(size) {
  gMeme.lines[gCurrLine].size += size
}

function setTextAlign(align) {
  gMeme.lines[gCurrLine].align = align
}

function setFontFamily(family) {
  gMeme.lines[gCurrLine].family = family
}

function setFontColor(color) {
  gMeme.lines[gCurrLine].fontColor = color
}

function setStrokeColor(color) {
  gMeme.lines[gCurrLine].strokeColor = color
}

function getCurrLine() {
  return gMeme.lines[gCurrLine]
}

function setCurrLineText(text) {
  gMeme.lines[gCurrLine].text = text
}

function advanceLine() {
  if (!gCurrLine) {
    gCurrLine = 0
  } else if (gCurrLine + 1 >= gMeme.lines.length) {
    gCurrLine = 0
  } else {
    gCurrLine++
  }
  _resetCurrLine()
  gMeme.lines[gCurrLine].isCurrLine = true
}

function deleteLine() {
  if (gMeme.lines.length > 1) {
    gMeme.lines.splice(gCurrLine, 1)
    _resetCurrLine()
    gCurrLine = 0
    gMeme.lines[0].isCurrLine = true
  }
}

function unsetCurrLine() {
  _resetCurrLine()
  gCurrLine = null
}

function setCurrLine(line) {
  _resetCurrLine()
  line.isCurrLine = true
  gCurrLine = gMeme.lines.findIndex((line) => line.isCurrLine)
}

function setLineDimensions(line, dimensions) {
  line.dimensions = dimensions
}

function _resetCurrLine() {
  gMeme.lines.forEach((line) => (line.isCurrLine = false))
}

function getLineClicked(clickedPos) {
  return gMeme.lines.filter((line) => {
    const { startX, startY, width, height } = line.dimensions
    if (clickedPos.x >= startX && clickedPos.x <= startX + width && clickedPos.y >= startY && clickedPos.y <= startY + height) {
      return true
    }
    return false
  })
}

function setLineDrag(isDrag) {
  gMeme.lines[gCurrLine].isDrag = isDrag
}

function moveLine(dx, dy) {
  const { pos } = gMeme.lines[gCurrLine]
  pos.x += dx
  pos.y += dy
}
