#!/usr/bin/env node

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { Command } from 'commander';
import readline from 'readline';

const fs = require('fs');
const { resolve } = require('path');
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

    program
        .command('serve')
        .description('Launch a web server to view tournament details')
        .option('-p, --port <port>', 'Port to run the frontend server on', '5421')
        .option('--rest-port <port>', 'Port to run the REST API on', '4000')
        .option('--rest-host <host>', 'Host to run the REST API on', '192.168.1.147')
        .option('--bypass-auth', 'Bypass authentication for testing', false)
        .action((options) => {
            const port = parseInt(options.port, 10) || 5421;
            const restPort = parseInt(options.restPort, 10) || 4000;
            const restHost = options.restHost || '192.168.1.147';
            process.env['GCP_DB_HOST'] = restHost
            process.env['GCP_DB_PORT'] = restPort
            process.env['GCP_DB_PORT3'] = restPort
            const bypassAuth = !!options.bypassAuth;
            console.log(`Starting web server on port ${port} with REST API at ${restHost}:${restPort}${bypassAuth ? ' with authentication bypassed' : ''}`);
            // Run server directly
            const { startServer } = require('../../src/ui/server/app'); // Import server logic
            startServer(port, restPort, restHost, bypassAuth);
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
