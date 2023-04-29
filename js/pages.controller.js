'use strict'

let gCurrPage = '.gallery-page'
let gIsMobile

function onAppInit() {
  gIsMobile = window.innerWidth >= 650 ? false : true
  renderGallery()
  console.log('getSavedMemes()', getSavedMemes())
  if (getSavedMemes().length > 0) {
    renderSavedMemes()
  } else {
    setNoSavedMemesVisibility(true)
  }
}

function onSwitchPage(switchTo) {
  if (gIsMobile) controlMobileNav(false)
  const switchToClass = `.${switchTo}-page`
  if (switchToClass === gCurrPage) return
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
