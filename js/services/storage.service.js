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
  loadSavedMemes()

  memes.unshift(meme)

  saveToStorage(MEMES_KEY, memes)
}
