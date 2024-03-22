#!/usr/bin/env node

const fs = require('fs');
const commander = require('commander');
const { importFixtures } = require('./src/import')

// USAGE gcp-import --schedule ./schedule.yaml
commander
  .option('-s, --schedule <path>', 'Path to the schedule file')
  .parse(process.argv);

if (!commander.schedule) {
  console.error('Schedule file is required');
  process.exit(1);
}

const schedule = fs.readFileSync(commander.schedule, 'utf8');
importFixtures(schedule);
