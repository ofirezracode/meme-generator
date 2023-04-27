'use strict'

function controlMobileNav(isOpening) {
  const elMobileNav = document.querySelector('nav')
  const elMobileMenu = document.querySelector('.nav-links')
  const elBarsIcon = document.querySelector('.fa-bars')
  const elXmarkIcon = document.querySelector('.fa-xmark')

  if (isOpening) {
    elMobileNav.classList.add('fixed')
    elMobileMenu.classList.remove('hidden')
    elBarsIcon.classList.add('hidden')
    elXmarkIcon.classList.remove('hidden')
  } else {
    elMobileNav.classList.remove('fixed')
    elMobileMenu.classList.add('hidden')
    elBarsIcon.classList.remove('hidden')
    elXmarkIcon.classList.add('hidden')
  }
}
