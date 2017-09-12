'use strict'
const SensiboClient = require('../src/SensiboClient')
const Pod = require('../src/Pod')
const MockAdapter = require('axios-mock-adapter')
const axios = require('axios')
const {baseUrl, paths, fields} = require('../src/constants.json')
describe('SensiboClient', () => {
  const fakeApiKey = 'fake-api-key'
  it('should make constructor values readonly', () => {
    const client = new SensiboClient(fakeApiKey)
    expect(() => {
      client.apiKey = ''
    }).toThrowError(TypeError)
  })
  describe('getPods', () => {
    const path = `${baseUrl}${paths.pods}?apiKey=${fakeApiKey}&fields=${fields.id},${fields.room}`
    it('should return an array of Pod objects based on the returned values from the request', async() => {
      const mock = new MockAdapter(axios)
      const pod = {id: '1', room: {icon: 'lounge', name: 'Lounge'}}
      mock.onGet(path).reply(200, {
        status: 'success',
        result: [pod]
      })
      const client = new SensiboClient(fakeApiKey)
      const pods = await client.getPods()
      expect(pods.length).toBe(1)
      expect(pods[0].constructor).toBe(Pod)
      expect(pods[0].id).toBe(pod.id)
      expect(pods[0].room).toEqual(pod.room)
      expect(pods[0].apiKey).toBe(fakeApiKey)
    })
    it('should reject the promise when the request fails', async () => {
      const mock = new MockAdapter(axios)
      mock.onGet(path).reply(401)
      const client = new SensiboClient(fakeApiKey)
      let err
      await client.getPods().catch(e => {
        err = e
      })
      expect(err.message).toBe('Request failed with status code 401')
    })
  })
})
