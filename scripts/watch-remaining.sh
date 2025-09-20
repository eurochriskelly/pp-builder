#!/usr/bin/env bash

if [ $# -eq 0 ]; then
  echo "Usage: $0 <tournamentId> or $0 tournamentId=<id>"
  exit 1
fi

if [[ $1 =~ ^tournamentId=([0-9]+)$ ]]; then
  TOURNAMENT_ID="${BASH_REMATCH[1]}"
else
  TOURNAMENT_ID="$1"
fi

if [ -z "$TOURNAMENT_ID" ] || ! [[ "$TOURNAMENT_ID" =~ ^[0-9]+$ ]]; then
  echo "Invalid tournamentId: must be a positive integer"
  exit 1
fi

DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_NAME="${DB_NAME:-EuroTourno}"
SLEEP_SECS="${SLEEP_SECS:-10}"

trap 'echo; echo "Exiting."; exit 0' INT

while :; do
  clear
  NOW="$(date '+%F %T')"
  QUERY="SELECT
    CONCAT(LEFT(category,1), '.', LPAD(RIGHT(CAST(id AS CHAR), 2), 2, '0')) AS hxid,
    stage,
    pitch,
    DATE_FORMAT(scheduled, '%H:%i') AS scheduled_time,
    COALESCE(DATE_FORMAT(started, '%H:%i'), '-') AS started,
    team1Id,
    'vs' AS vs,
    team2Id
  FROM
      EuroTourno.fixtures
  WHERE
      tournamentId = $TOURNAMENT_ID and goals1 is null;"

  echo "Monitoring Remaining Fixtures in EuroTourno"
  echo "-------------------------------------------"
  echo "Current time: $NOW"
  echo

  mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -D "$DB_NAME" -t -e "$QUERY" 2>/tmp/mysql_poll.err || cat /tmp/mysql_poll.err

  sleep "$SLEEP_SECS"
done
