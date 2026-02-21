#!/bin/bash


# This script will call jest for one test file. 
# All files matching *.spec.* will be listed and the user will be prompted to select one.\
# The selected file will be passed to jest for testing.

# Get all test files
testFiles=$(find ./src -name "*.spec.*" | sort)
select testFile in $testFiles; do
  if [ -n "$testFile" ]; then
    clear
    jest $testFile --watch
    break
  else
    echo "Invalid selection"
  fi
done