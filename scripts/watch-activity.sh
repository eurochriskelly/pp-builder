#!/usr/bin/env bash

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_NAME="${DB_NAME:-EuroTourno}"
SLEEP_SECS="${SLEEP_SECS:-5}"

# ANSI escape codes
RED="\033[1;31m"
RESET="\033[0m"

START_TS="$(date '+%F %T')"
trap 'echo; echo "Exiting."; exit 0' INT

while :; do
  clear
  NOW="$(date '+%F %T')"
  QUERY="SELECT COUNT(*) FROM fixtures WHERE tournamentId=31 AND updated > '${START_TS}';"
  COUNT=$(mysql -N -s -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -D "$DB_NAME" -e "$QUERY" 2>/tmp/mysql_poll.err)

  echo "Monitoring EuroTourno.fixtures"
  echo "------------------------------"
  echo " Baseline timestamp : $START_TS"
  echo " Current time       : $NOW"
  echo " Count found        : $COUNT"
  echo

  if [[ "$COUNT" =~ ^[0-9]+$ ]] && (( COUNT >= 1 )); then
    NOTE_TS="$NOW"
    echo -e "${RED}"
    echo "###########################################################"
    echo "###   ⚠️  WARNING: Data detected at $NOTE_TS   ⚠️   ###"
    echo "###########################################################"
    echo -e "${RESET}"
    for i in 1 2 3; do
      printf "\a"
      sleep 0.2   # adjust delay (seconds)
    done
    read -rp "Press Enter to resume monitoring..."
    START_TS="$NOTE_TS"
  else
    sleep "$SLEEP_SECS"
  fi
done
