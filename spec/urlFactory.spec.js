'use strict'
const {createUrl} = require('../src/urlFactory')
describe('urlFactory', () => {
  describe('createUrl', () => {
    it('should return the same value if only a valid URL was passed', () => {
      const url = 'https://example.com/'
      expect(createUrl(url)).toBe(url)
    })
    it('should return path with a given base URL if given a base URL', () => {
      const path = 'foo/bar'
      const baseUrl = 'https://example.com'
      expect(createUrl(path, baseUrl)).toBe(`${baseUrl}/${path}`)
    })
    it('should accept an array as a path and join it accordingly', () => {
      const path = ['foo/', '/bar']
      const baseUrl = 'https://example.com'
      expect(createUrl(path, baseUrl)).toBe(`${baseUrl}/foo/bar`)
    })
    it('should accept a partial path in the baseUrl', () => {
      const path = 'bar'
      const baseUrl = 'https://example.com/foo'
      expect(createUrl(path, baseUrl)).toBe(`${baseUrl}/${path}`)
    })
    it('should accept a string as a query', () => {
      const path = 'foo/bar'
      const baseUrl = 'https://example.com'
      const query = 'foo=bar&baz=quux'
      expect(createUrl(path, baseUrl, query)).toBe(`${baseUrl}/${path}?${query}`)
    })
    it('should accept an object as a query', () => {
      const path = 'foo/bar'
      const baseUrl = 'https://example.com'
      const query = {
        foo: 'bar',
        baz: 'quux'
      }
      expect(createUrl(path, baseUrl, query)).toBe(`${baseUrl}/${path}?foo=bar&baz=quux`)
    })
    it('should convert arrays in the query object to comma separated values', () => {
      const path = 'foo/bar'
      const baseUrl = 'https://example.com'
      const query = {
        foo: ['bar', 'baz', 'quux']
      }
      expect(createUrl(path, baseUrl, query)).toBe(`${baseUrl}/${path}?foo=bar,baz,quux`)
    })
  })
})
