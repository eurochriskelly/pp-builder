# GCP CLI Tools

This project provides a command-line interface (CLI) for managing and inspecting sports tournament schedules, clubs, and match simulations. It processes schedule files, imports club and fixture data into a SQL database, populates fixture lists, and simulates match outcomes.

## Features
- **Build**: Organize tournament schedules from a YAML file.
- **Populate**: Transcribe schedules into a fixture list interactively.
- **Import Clubs**: Import club data from a CSV file into a SQL database.
- **Import Fixtures**: Convert schedules into SQL-ready fixture data.
- **Play**: Simulate matches for a tournament by ID and category.

## Installation
1. Ensure Node.js is installed on your system.
2. Clone this repository:
   ```bash
   git clone <repository-url>
   ```
3. Navigate to the project directory and install dependencies:
   ```bash
   npm install
   ```
4. Make the CLI executable:
   ```bash
   chmod +x bin/gcp.ts
   ```

## Usage
Run the CLI from the command line using `bin/gcp.ts` followed by options. Below are the main commands and their usage:

### General Syntax
```bash
bin/gcp.ts [options]
```

### Options
- `--schedule <path>`: Path to the schedule file (required for most operations).
- `-o, --output <path>`: Path to save the output file (e.g., SQL export).
- `-d, --date <date>`: Tournament date (e.g., "2025-03-01").
- `-t, --tournament-id <number>`: Unique tournament ID.
- `-e, --title <string>`: Tournament title.
- `-l, --location <string>`: Tournament location.
- `-x, --pin-code <string>`: Login code for the tournament.

### Commands
1. **Build a Schedule**
   Organize a tournament schedule from a YAML file:
   ```bash
   bin/gcp.ts -build --schedule path/to/schedule.yaml
   ```

2. **Populate Fixtures**
   Interactively transcribe a schedule into a fixture list:
   ```bash
   bin/gcp.ts --populate --schedule path/to/schedule.yaml
   ```

3. **Import Clubs**
   Import club data from a CSV file into a SQL database:
   ```bash
   bin/gcp.ts --import-clubs path/to/clubs.csv
   ```

4. **Import Fixtures**
   Generate SQL import statements for fixtures:
   ```bash
   bin/gcp.ts --import --schedule path/to/schedule.csv -o output.sql -t 1 -d "2025-03-01" -e "Spring Cup" -l "Dublin" -x "1234"
   ```

5. **Simulate Matches**
   Play a specified number of matches for a tournament:
   ```bash
   bin/gcp.ts --play -t 1 -c "gaa" --count 3
   ```

## Example
To import fixtures for a tournament:
```bash
bin/gcp.ts --import --schedule schedule.csv -o fixtures.sql -t 1 -d "2025-03-01" -e "Spring Cup" -l "Dublin" -x "ABCD1234"
```

## Notes
- Ensure all required options are provided for each command (e.g., `tournamentId`, `date`, etc.), or the script will exit with an error.
- The tool assumes a specific CSV or YAML format for input files—check the code for details.
- Simulation connects to a local API (`http://localhost:4000`)—ensure it’s running if using `--play`.

