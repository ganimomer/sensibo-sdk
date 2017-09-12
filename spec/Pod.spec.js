'use strict'
const Pod = require('../src/Pod.js')
const {baseUrl, paths, fields} = require('../src/constants.json')
const MockAdapter = require('axios-mock-adapter')
const axios = require('axios')
describe('Pod', () => {
  const id = 'fake-id'
  const fakeApiKey = 'fake-api-key'
  const room = {
    icon: 'lounge',
    name: 'Lounge'
  }
  it('should make constructor values readonly and frozen', () => {
    const pod = new Pod(fakeApiKey, id, room)
    expect(() => {
      pod.apiKey = ''
    }).toThrowError(TypeError)
    expect(() => {
      pod.id = ''
    }).toThrowError(TypeError)
    expect(() => {
      pod.room = {}
    }).toThrowError(TypeError)
    expect(() => {
      pod.room.icon = 'bedroom'
    }).toThrowError(TypeError)
  })
  describe('getAcState', () => {
    const path = `${baseUrl}${paths.pod}/${id}${paths.acStates}?apiKey=${fakeApiKey}`
    it('should make a request for the AC state object and return the first state', async () => {
      const acState = {
        on: true,
        targetTemperature: 23,
        temperatureUnit: 'C',
        mode: 'cool',
        swing: 'stopped'
      }
      const mock = new MockAdapter(axios)
      mock.onGet(path).reply(200, {
        success: true,
        result: [{acState}, {acState: {}}]
      })
      const pod = new Pod(fakeApiKey, id, room)
      const result = await pod.getAcState()
      expect(result).toEqual(acState)
    })
    it('should reject the promise when the request fails', async () => {
      const mock = new MockAdapter(axios)
      mock.onGet(path).reply(401)
      const pod = new Pod(fakeApiKey, id, room)
      let err
      await pod.getAcState().catch(e => {
        err = e
      })
      expect(err.message).toBe('Request failed with status code 401')
    })
  })
  describe('setAcState', () => {
    const path = `${baseUrl}${paths.pod}/${id}${paths.acStates}?apiKey=${fakeApiKey}`
    it('should set a state to the passed state correctly', async () => {
      const mock = new MockAdapter(axios)
      const oldAcState = {
        on: true,
        fanLevel: 'high',
        temperatureUnit: 'C',
        targetTemperature: 23,
        mode: 'cool',
        swing: 'stopped'
      }
      const partialState = {
        fanLevel: 'medium',
        targetTemperature: 22
      }
      const acState = Object.assign({}, oldAcState, partialState)
      mock.onGet(path).reply(200, {
        result: [
          {acState: oldAcState}
        ]
      }).onPost(path).reply(({data}) => {
        expect(JSON.parse(data)).toEqual({acState})
        return [200, {result: {acState}}]
      })
      const pod = new Pod(fakeApiKey, id, room)
      expect(await pod.setAcState(partialState)).toEqual(acState)
    })
    it('should reject the response if given bad credentials', async () => {
      const mock = new MockAdapter(axios)
      const partialState = {
        fanLevel: 'medium',
        targetTemperature: 22
      }
      mock.onGet(path).reply(401).onPost(path).reply(401)
      const pod = new Pod(fakeApiKey, id, room)
      let err
      await pod.setAcState(partialState).catch(e => {
        err = e
      })
      expect(err.message).toBe('Request failed with status code 401')
    })
  })
  describe('getMeasurements', () => {
    const path = `${baseUrl}${paths.pod}/${id}${paths.measurements}?apiKey=${fakeApiKey}&fields=${fields.batteryVoltage},${fields.temperature},${fields.humidity}`
    it('should make a request for measurements and return the latest', async () => {
      const measurement = {
        batteryVoltage: 90,
        temperature: 25.5,
        humidity: 33.5
      }
      const mock = new MockAdapter(axios)
      mock.onGet(path).reply(200, {
        status: 'success',
        result: [measurement]
      })
      const pod = new Pod(fakeApiKey, id, room)
      const result = await pod.getMeasurements()
      expect(result).toEqual(measurement)
    })
    it('should reject the promise when the request fails', async () => {
      const mock = new MockAdapter(axios)
      mock.onGet(path).reply(401)
      const pod = new Pod(fakeApiKey, id, room)
      let err
      await pod.getMeasurements().catch(e => {
        err = e
      })
      expect(err.message).toBe('Request failed with status code 401')
    })
  })
})
