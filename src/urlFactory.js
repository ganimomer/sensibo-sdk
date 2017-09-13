'use strict'
const {URL, URLSearchParams} = require('url')
const {join: joinPath} = require('path')
const createUrl = (path, baseUrl, query) => {
  if (baseUrl) {
    const {pathname} = new URL(baseUrl)
    path = [pathname].concat(path)
  }
  const url = new URL(Array.isArray(path) ? joinPath(...path) : path, baseUrl)
  const searchParams = new URLSearchParams(query)
  url.search = decodeURIComponent(searchParams.toString())
  return url.href
}
module.exports = {
  createUrl
}
