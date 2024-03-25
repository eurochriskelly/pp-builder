#!/usr/bin/env node

const { Command } = require('commander');
const fs = require('fs');
const { resolve } = require('path');
const { importFixtures } = require('../src/import');

const program = new Command();

program
  .option('-s, --schedule <path>', 'Path to the schedule file');

program.parse(process.argv);

const options = program.opts();

if (!options.schedule) {
  console.error('Schedule file is required');
  process.exit(1);
}

const schedule = fs.readFileSync(resolve(options.schedule), 'utf8');
importFixtures(schedule);
