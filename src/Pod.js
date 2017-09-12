'use strict'
const {baseUrl, paths, fields} = require('./constants')
const {createUrl} = require('./urlFactory')
const head = require('lodash/head')
const property = require('lodash/property')
const flow = require('lodash/flow')
const axios = require('axios')
module.exports = class Pod {
  constructor(apiKey, id, room) {
    Object.defineProperties(this, {
      apiKey: {
        value: apiKey,
        writable: false
      },
      id: {
        value: id,
        writable: false
      },
      room: {
        value: Object.freeze(room),
        writable: false
      }
    })
  }
  async getAcState() {
    const getLatestState = flow(property('result'), head, property('acState'))
    const url = createUrl([paths.pod, this.id, paths.acStates], baseUrl, {apiKey: this.apiKey})
    const response = await axios.get(url)
    return getLatestState(response.data)
  }
  async setAcState(state) {
    const url = createUrl([paths.pod, this.id, paths.acStates], baseUrl, {apiKey: this.apiKey})
    const latestState = await this.getAcState()
    const acState = Object.assign(latestState, state)
    const response = await axios.post(url, {acState})
    return response.data.result.acState
  }
  async getMeasurements() {
    const getLatestMeasurement = flow(property('result'), head)
    const url = createUrl(
      [paths.pod, this.id, paths.measurements],
      baseUrl,
      {
        apiKey: this.apiKey,
        fields: [fields.batteryVoltage, fields.temperature, fields.humidity]
      })
    const response = await axios.get(url)
    return getLatestMeasurement(response.data)
  }
}
