'use strict'
const axios = require('axios')
const property = require('lodash/property')
const map = require('lodash/map')
const {baseUrl, paths, fields} = require('./constants.json')
const {createUrl} = require('./urlFactory')
const Pod = require('./Pod')
module.exports = class SensiboClient {
  constructor(apiKey) {
    Object.defineProperty(this, 'apiKey', {
      value: apiKey,
      writable: false
    })
  }
  getPods() {
    const url = createUrl(paths.pods, baseUrl, {apiKey: this.apiKey, fields: [fields.id, fields.room]})
    return axios.get(url)
      .then(property('data.result'))
      .then(pods => map(pods, ({id, room}) => new Pod(this.apiKey, id, room)))
  }
}
