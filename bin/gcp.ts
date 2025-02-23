#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Command } from 'commander';
import { spawn } from 'child_process';
import readline from 'readline';

const fs = require('fs');
const { resolve } = require('path');
const { importFixturesCsv, importClubsCsv } = require('../src/import');
const { populate } = require('../src/populate');
const { organize } = require('../src/populate/organize');
const program = new Command();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const main = async () => {
  program
    .name('gcp')
    .description('CLI tool for managing tournament schedules and simulations')
    .option('-build', 'Organize a tournament schedule from a YAML file')
    .option('--populate', 'Interactively transcribe a schedule into fixtures')
    .option('--import', 'Generate SQL import for fixtures from a schedule')
    .option('--import-clubs <path>', 'Import club data from a CSV file')
    .option('--play', 'Simulate matches for a tournament')
    .option('--list-tournaments', 'List all available tournaments')
    .option('--serve', 'Launch a web server to view tournament details')  // New option
    // Sub-options
    .option('--schedule <path>', 'Path to the schedule file')
    .option('-o, --output <path>', 'Path to the output file')
    .option('-d, --date <date>', 'Date of tournament (e.g., "2025-03-01")')
    .option('-m, --match-id <string>', 'Match ID')
    .option('-c, --category <string>', 'Competition category (e.g., "gaa")')
    .option('--count <number>', 'Number of matches to simulate')
    .option('--score <string>', 'Score (e.g., "0-01/2-12" or "?-??/?-??")')
    .option('-t, --tournament-id <number>', 'Tournament ID')
    .option('-e, --title <string>', 'Tournament title')
    .option('-l, --location <string>', 'Tournament location')
    .option('-x, --pin-code <string>', 'Tournament login code');

  program.parse(process.argv);
  const options = program.opts();

  if (process.argv.length <= 2) {
    console.log('Welcome to GCP CLI Tools!');
    console.log('Run tournament management commands with ease.\n');
    program.help();
  }

  if (options.listTournaments) {
    const { getTournaments } = require('../src/simulation/retrieve');
    console.log('Fetching available tournaments ...');
    const tournaments = await getTournaments();
    if (tournaments.length === 0) {
      console.log('No tournaments found or API is unavailable.');
    } else {
      console.table(
        tournaments.map((t: any) => ({
          ID: t.id,
          Title: t.Title || t.title,
          Date: t.Date || t.date,
          Location: t.Location || t.location,
        }))
      );
    }
    process.exit(0);
  }

  if (options.serve) {
    const { getTournaments } = require('../src/simulation/retrieve');
    console.log('Fetching available tournaments...');
    const tournaments = await getTournaments();
    if (tournaments.length === 0) {
      console.log('No tournaments found or API is unavailable.');
      process.exit(1);
    }

    console.table(
      tournaments.map((t: any) => ({
        ID: t.id,
        Title: t.Title || t.title,
        Date: t.Date || t.date,
        Location: t.Location || t.location,
      }))
    );

    const tournamentId = await new Promise((resolve) => {
      rl.question('Enter the Tournament ID to serve: ', (answer) => {
        resolve(parseInt(answer, 10));
      });
    });

    const validIds = tournaments.map((t: any) => t.id);
    if (!validIds.includes(tournamentId)) {
      console.error('Invalid Tournament ID. Please select from the list.');
      rl.close();
      process.exit(1);
    }

    rl.close();

    console.log(`Starting server for Tournament ID ${tournamentId} on port 5421...`);
    const serverProcess = spawn('node', ['src/ui/server.js', tournamentId], {
      stdio: 'inherit', // Inherit stdio to see server output
      cwd: process.cwd()
    });

    serverProcess.on('error', (err) => {
      console.error('Failed to start server:', err.message);
      process.exit(1);
    });

    // Don't exit the process, let the server run
    return;
  }

  if (options.play) {
    const { play } = require('../src/simulation');
    await play(+options.tournamentId, options.category, +options.count);
    process.exit(0);
  }

  if (options.populate) {
    console.log('Populating fixtures...');
    execSync(`cp ${options.schedule} /tmp/fixtures.yaml`);
    await populate('/tmp/fixtures.yaml');
  }

  if (options.importClubs) {
    const clubdata = fs.readFileSync(resolve(options.importClubs), 'utf8');
    await importClubsCsv(clubdata);
    process.exit(0);
  }

  const schedule = fs.readFileSync(resolve(options.schedule), 'utf8');

  if (options.build) {
    console.log('Building tournament schedule...');
    const tournamentData: any = yaml.load(schedule);
    organize(tournamentData);
    process.exit(0);
  }

  if (options.import) {
    console.log('Generating SQL import for fixtures...');
    const requiredKeys = ['location', 'title', 'date', 'tournamentId', 'pinCode'];
    if (!requiredKeys.every((key) => key in options)) {
      console.error(`Missing required options: [${requiredKeys.join(', ')}]`);
      process.exit(1);
    }
    const { tournamentId, date, title, location, pinCode } = options;
    const csv = importFixturesCsv(schedule, tournamentId, date, title, location, pinCode);
    if (csv) {
      writeFileSync(options.output, csv);
      console.log(`SQL written to [${options.output}]`);
    }
    process.exit(0);
  }

  if (options.schedule) {
    console.log('Generating SQL import for fixtures...');
    const requiredKeys = ['location', 'title', 'date', 'tournamentId'];
    if (!requiredKeys.every((key) => key in options)) {
      console.error(`Missing required options: [${requiredKeys.join(', ')}]`);
      process.exit(1);
    }
    const { tournamentId, date, title, location } = options;
    const csv = importFixturesCsv(schedule, tournamentId, date, title, location);
    writeFileSync(options.output, csv);
    console.log(`SQL written to [${options.output}]`);
    process.exit(0);
  }

  if (options.serve) {
      const { getTournaments } = require('../src/simulation/retrieve');
      console.log('Fetching available tournaments ...');
      const tournaments = await getTournaments();
      if (tournaments.length === 0) {
        console.log('No tournaments found or API is unavailable.');
        process.exit(1);
      }

      console.table(
        tournaments.map((t: any) => ({
          ID: t.id,
          Title: t.Title || t.title,
          Date: t.Date || t.date,
          Location: t.Location || t.location,
        }))
      );

      const tournamentId = await new Promise((resolve) => {
        rl.question('Enter the Tournament ID to serve: ', (answer) => {
          resolve(parseInt(answer, 10));
        });
      });

      const validIds = tournaments.map((t: any) => t.id);
      if (!validIds.includes(tournamentId)) {
        console.error('Invalid Tournament ID. Please select from the list.');
        rl.close();
        process.exit(1);
      }

      rl.close();

      console.log(`Starting server for Tournament ID ${tournamentId} on port 5421...`);
      const serverProcess = spawn('node', ['src/ui/server.js', tournamentId], {
        stdio: 'inherit',
        cwd: process.cwd()
      });

      serverProcess.on('error', (err) => {
        console.error('Failed to start server:', err.message);
        process.exit(1);
      });

      return;
  }

};

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
