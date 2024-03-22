const yaml = require('js-yaml');
const SUT = require('./validate');
const FIXTURES = require('./fixtures-test-data'); 

describe('Valdiation functions work', () => {

  it('should validate the planned fixtures', () => {
    const config = FIXTURES['simple valid yaml']
    const issues = []
    const result = SUT.validateFixtures(yaml.load(config), issues)
    expect(result).toBe(true)
    expect(issues.length).toBe(0)
  })

  it('should not validate incorrect fixtures', () => {
    const config = yaml.load(FIXTURES['simple invalid yaml'])
    var issues = []
    const result = SUT.validateFixtures(config, issues)
    expect(result).toBe(false)
    expect(issues.length).toBe(1)
  })

  it('should not validate incorrect pitches', () => {
    const config = yaml.load(FIXTURES['bad pitch'])
    var issues = []
    const result = SUT.checkPitches(config, issues)
    expect(result).toBe(false)
    expect(issues.length).toBe(1)
  })

})