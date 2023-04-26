'use strict'

const MEMES_KEY = 'memes'
let memes = null

function saveToStorage(key, val) {
  localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
  const val = localStorage.getItem(key)
  return JSON.parse(val)
}

function loadSavedMemes() {
  if (!memes) {
    memes = loadFromStorage(MEMES_KEY)
    if (!memes) {
      memes = []
    }
  }
}

function getSavedMemes() {
  loadSavedMemes()

  return memes
}

function saveMeme(meme) {
  console.log('here')
  loadSavedMemes()
  console.log('memes', memes)

  memes.unshift(meme)
  console.log('new memes', memes)

  saveToStorage(MEMES_KEY, memes)
}
