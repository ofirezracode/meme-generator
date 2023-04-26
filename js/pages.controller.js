'use strict'

let gCurrPage = '.gallery-page'

function onAppInit() {
  renderGallery()
}

function onSwitchPage(switchTo) {
  const switchToClass = `.${switchTo}-page`
  switchPage(switchToClass)
  gCurrPage = switchToClass
}

function switchPage(switchToClass) {
  const elLeavingPage = document.querySelector(gCurrPage)
  const elEnteringPage = document.querySelector(switchToClass)
  elLeavingPage.classList.add('disappear')
  setTimeout(() => {
    elLeavingPage.classList.add('appear')
    elLeavingPage.classList.add('hidden')
    elLeavingPage.classList.remove('disappear')
    elEnteringPage.classList.remove('hidden')
    setTimeout(() => {
      elEnteringPage.classList.remove('appear')
    }, 200)
  }, 200)
}
