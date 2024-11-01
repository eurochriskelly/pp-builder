#!/bin/bash


run_tests() {
  II "Running tests ..."
  bash test/integration/tests/reschedule/interactive.sh
}

init() {
  II "Rebuilding ..."
  npm run build 
}

II() {
  echo -e "\e[33mII $(date --rfc-3339="seconds") $@\e[0m"
}

init "$@"
run_tests "$@"
