'use strict'

// let gElPainterCanvas
// let gPainterCtx
let gIsActiveEdit
let gDownloadRequired
let gSaveRequired

function drawMeme(canvas, meme, setWidth, isActiveEdit) {
  const ctx = canvas.getContext('2d')
  gIsActiveEdit = isActiveEdit
  const elImg = new Image()
  elImg.src = meme.img

  elImg.onload = () => {
    afterImgLoad(canvas, ctx, meme, elImg, setWidth)
  }
}

function afterImgLoad(canvas, ctx, meme, elImg, setWidth) {
  setCanvasDimensions(canvas, elImg.width, elImg.height, setWidth)
  ctx.drawImage(elImg, 0, 0, canvas.width, canvas.height)

  meme.lines.forEach((line) => {
    drawTextLine(ctx, meme, line)
  })

  if (gDownloadRequired) {
    downloadCanvas(canvas)
  }
}

/*******************************/
/*Setting up the canvas*/
/*******************************/

function setCanvasDimensions(canvas, imgWidth, imgHeight, setWidth = 650) {
  let canvasWidth = imgWidth
  let canvasHeight = imgHeight
  let isWide = false
  if (canvasWidth > canvasHeight) isWide = true
  console.log('isWide', isWide)
  if (isWide) {
    if (canvasWidth > setWidth) {
      canvasWidth = setWidth
      canvasHeight = (imgHeight * canvasWidth) / imgWidth
    }
  } else {
    if (canvasHeight > setWidth) {
      canvasHeight = setWidth
      canvasWidth = (imgWidth * canvasHeight) / imgHeight
      console.log('canvasWidth', canvasWidth)
      console.log('setWidth', setWidth)
      if (canvasWidth > setWidth) {
        canvasWidth = setWidth
        canvasHeight = (imgHeight * canvasWidth) / imgWidth
        // if (window.innerWidth < 650) {
        //   canvasWidth = screen.width
        // } else {
        //   canvasWidth = setWidth
        // }
        // canvasHeight = (imgHeight * canvasWidth) / imgWidth
      }
    }
  }

  canvas.width = canvasWidth
  canvas.height = canvasHeight
}

/*******************************/
/*Drawing*/
/*******************************/

function drawTextLine(ctx, meme, line) {
  ctx.lineWidth = 2
  ctx.strokeStyle = meme.strokeColor
  ctx.fillStyle = meme.fontColor
  ctx.font = `${meme.size}px ${meme.family}`
  ctx.textAlign = meme.align
  ctx.textBaseline = 'middle'

  const { pos } = line

  ctx.fillText(line.text, pos.x, pos.y)
  ctx.strokeText(line.text, pos.x, pos.y)

  if (gIsActiveEdit) calcLineDimensions(ctx, line, meme.align)

  if (line.isCurrLine) {
    const borderWidth = 2

    ctx.strokeStyle = 'black'
    ctx.lineWidth = borderWidth
    ctx.setLineDash([8])

    const { startX, startY, width, height } = line.dimensions

    ctx.strokeRect(startX, startY, width, height)

    ctx.setLineDash([0])
  }
}

function calcLineDimensions(ctx, line, align) {
  const textWidth = ctx.measureText(line.text).width
  const textHeight = ctx.measureText(line.text).actualBoundingBoxAscent + ctx.measureText(line.text).actualBoundingBoxDescent

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

/*******************************/
/*Handling output*/
/*******************************/

function downloadCanvas(canvas) {
  const data = canvas.toDataURL()
  const a = document.createElement('a')
  a.href = data
  a.download = 'my-meme'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)

  gDownloadRequired = false
}

function setDownloadAsRequired() {
  gDownloadRequired = true
}
