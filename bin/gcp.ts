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

    // Define serve command explicitly
    program
        .command('serve')
        .description('Launch a web server to view tournament details')
        .option('-p, --port <port>', 'Port to run the server on', '5421')
        .option('--bypass-auth', 'Bypass authentication for testing', false)
        .action((options) => {
            const port = parseInt(options.port, 10) || 5421;
            const bypassAuth = !!options.bypassAuth;
            console.log(`Starting web server on port ${port}${bypassAuth ? ' with authentication bypassed' : ''}...`);
            const serverArgs = ['src/ui/server.js', port.toString()];
            if (bypassAuth) {
                serverArgs.push('--bypass-auth');
            }
            const serverProcess = spawn('node', serverArgs, {
                stdio: 'inherit',
                cwd: process.cwd()
            });

            serverProcess.on('error', (err) => {
                console.error('Failed to start server:', err.message);
                process.exit(1);
            });
        });

    program.parse(process.argv);
    const options = program.opts();

    if (process.argv.length <= 2) {
        console.log('Welcome to GCP CLI Tools!');
        console.log('Run tournament management commands with ease.\n');
        program.help();
    }

    if (options.listTournaments) {
        const { getTournaments } = require('../src/simulation/retrieve');
        console.log('Fetching available tournaments...');
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

    if (options.play) {
        const { play } = require('../src/simulation');
        await play(+options.tournamentId, options.category, +options.count);
        process.exit(0);
    }
};

main().catch((err) => {
    console.error('Error:', err.message);
    process.exit(1);
});
