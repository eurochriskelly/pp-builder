const yaml = require('js-yaml');
const { importFixtures, validateFixtures, _ } = require('./index')
const FIXTURES = require('./fixtures-test-data');

describe('best things in life', () => {
  it('test some stuff', () => {
    importFixtures(FIXTURES['simple valid yaml'])
    expect(1).toBe(1)
  })
})



