#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Command } from 'commander';

const fs = require('fs');
const { resolve } = require('path');
const { importFixturesCsv, importClubsCsv } = require('../src/import');
const { populate } = require('../src/populate');
const { organize } = require('../src/populate/organize');
const program = new Command();

const main = async () => {
  program
    .option('-build', 'Path to the schedule file')
    .option('--populate', 'Transcribe schedule to fixtures')
    .option('--import', 'Transcribe schedule into sql db')
    .option('--import-clubs <path>', 'Import clubs sheet')
    .option('--play', 'Play a match by id')
    // sub options
    .option('--schedule <path>', 'Path to the schedule file')
    .option('-o, --output <path>', 'Path to the output file')
    .option('-d, --date <path>', 'Date of tournament')
    .option('-m, --match-id <string>', 'Match ID')
    .option('-c, --category <string>', 'Competition category')
    .option('--count <number>', 'number of matches to simulate')
    .option('--score <string>', 'Score. e.g. 0-01/2-12  or ?-??/?-??')
    .option('-t, --tournament-id <number>', 'Tournament ID')
    .option('-e, --title <string>', 'The title of the event')
    .option('-l, --location <string>', 'Location of the tournament')
    .option('-x, --pin-code <string>', 'Log in code')
    ;

  program.parse(process.argv);
  const options = program.opts();

  if (options.play) {
    const { play } = require('../src/simulation');
    await play(+options.tournamentId, options.category, +options.count);
    process.exit(0)
  }

  if (options.populate) {
    console.log('Populating');
    // copy the file options.schedule to /tmp/fixtures.yaml
    execSync(`cp ${options.schedule} /tmp/fixtures.yaml`);
    await populate('/tmp/fixtures.yaml');
  }

  if (options.importClubs) {
    const clubdata = fs.readFileSync(resolve(options.importClubs), 'utf8');
    await importClubsCsv(clubdata);
    process.exit(0)
  }

  const schedule = fs.readFileSync(resolve(options.schedule), 'utf8');

  if (options.build) {
    console.log('Building');
    const tournamentData: any = yaml.load(schedule);
    organize(tournamentData)
    process.exit(0);
  }

  if (options.import) {
    console.log('Generating SQL import');
    const requiredKeys = ['location', 'title', 'date', 'tournamentId', 'pinCode'];
    if (!requiredKeys.every(key => key in options)) {
      console.log(`Not all required keys [${requiredKeys.join(',')}]`)
      process.exit(1);
    }
    const { tournamentId, date, title, location, pinCode } = options
    const csv = importFixturesCsv(schedule, tournamentId, date, title, location, pinCode);
    if (csv) {
      writeFileSync(options.output, csv);
      console.log(`Written to file [${options.output}]`);
    }
    process.exit(0);
  }

  if (options.schedule) {
    console.log('Generating SQL import');
    const requiredKeys = ['location', 'title', 'date', 'tournamentId'];
    if (!requiredKeys.every(key => key in options)) {
      console.log(`Not all required keys [${requiredKeys.join(',')}]`)
      process.exit(1);
    }
    const { tournamentId, date, title, location } = options
    const csv = importFixturesCsv(
      schedule, tournamentId, date, title, location
    );
    writeFileSync(options.output, csv);
    console.log(`Written to file [${options.output}]`);
    process.exit(0);
  }
}

main()

