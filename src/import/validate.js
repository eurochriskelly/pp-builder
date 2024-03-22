const validateFixtures = (data, issues) => {
    const isValid = checkFixtureSize(data, issues) && checkKeys(data, issues) && checkTeams(data, issues) && checkPitches(data, issues)
    return isValid
}

// Checks
const checkFixtureSize = (data, issues = []) => {
    // check that each fixtures has the same number of items as the headings 
    const headerLength = data.schedule.headings.length
    return data.schedule.fixtures.every(fixture => {
      if (fixture.length !== headerLength) {
        issues.push(`Fixture ${fixture.join(', ')} does not match header length`)
        return false
      }
      return true
    })
}

const checkKeys = (data, issues = []) => {
  const keys = ['tournamentId', 'pitches', 'categories', 'schedule', 'startDate']
  const missingKeys = keys.filter(key => !data[key])
  if (missingKeys.length) {
    issues.push(`Missing keys: ${missingKeys.join(', ')}`)
    console.log(data)
  }
  return !issues.length
}

// TODO: Implement the checkStages function
const checkStages = (data, issues = []) => {
  // Check that the stages are valid
  return true
}

// TODO: Implement the checkSchedule function
const checkSchedule = (data, issues = []) => {
  // Check that there is enough time between each match on each pitch to allow for the duration
  return true
}

const checkPitches = (data, issues = []) => {
  return data?.schedule.fixtures.every(fixture => {
    const [_, pitch ] = fixture
    if (!data.pitches.includes(pitch)) {
      issues.push(`Pitch ${pitch} not defined`)
      return false
    }
    return true
  })

}

const checkTeams = (data, issues =[]) => {
  // for each fixture, check that the tema matches the name defined in categories
  return data?.schedule.fixtures.every(fixture => {
    const [,,, category, group, team1, team2, umpireTeam] = fixture
    if (!data.categories[category]) {
      issues.push(`Category ${category} not defined`)
      return false
    }
    if (!data.categories[category][group]) {
      issues.push(`Group ${group} not defined in ${category}`)
      return false
    }
    if (!data.categories[category][group].includes(team1)) {
      issues.push(`Team ${team1} not defined in ${category} ${group}`)
    }
    if (!data.categories[category][group].includes(team2)) {
      issues.push(`Team ${team2} not defined in ${category} ${group}`)
    }
    if (!data.categories[category][group].includes(umpireTeam)) {
      issues.push(`Umpire team ${umpireTeam} not defined in ${category} ${group}`)
    }
    return !issues.length
  })
}

module.exports = {
    validateFixtures,
    checkSchedule,
    checkPitches,
    checkTeams,
    checkKeys,
    checkStages,
    checkFixtureSize,
}