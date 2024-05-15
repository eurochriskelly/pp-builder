#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Command } from 'commander';

const fs = require('fs');
const { resolve } = require('path');
const { importFixtures, importFixturesCsv } = require('../src/import');
const { populate } = require('../src/populate');
const { organize } = require('../src/populate/organize');
const program = new Command();

const main = async () => {
  program
    .option('-s, --schedule <path>', 'Path to the schedule file')
    .option('-b, --build', 'Path to the schedule file')
    .option('-p, --populate', 'Transcribe schedule to fixtures')
    .option('-i, --import', 'Transcribe schedule into sql db')
    ;

  program.parse(process.argv);

  const options = program.opts();

  if (!options.schedule) {
    console.error('Schedule file is required using -s or --schedule option');
    process.exit(1);
  }

  if (options.populate) {
    console.log('Populating');
    // copy the file options.schedule to /tmp/fixtures.yaml
    execSync(`cp ${options.schedule} /tmp/fixtures.yaml`);
    await populate('/tmp/fixtures.yaml');
  }

  const schedule = fs.readFileSync(resolve(options.schedule), 'utf8');

  if (options.build) {
    console.log('Building');
    const tournamentData: any = yaml.load(schedule);
    organize(tournamentData)
    process.exit(0);
  }

  if (options.import) {
    console.log('Importing');
    importFixturesCsv(schedule);
    process.exit(0);
  }
}

main()
