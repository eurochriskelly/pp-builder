#!/bin/bash

if [ -z "$PP_DB_NAME" ];then
  echo "PP vars not defined. Please check your environment"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Usage: pp <command> [options]"
  echo "For serve command, specify --env=acceptance, --env=production, or --env=test"
  exit 1
fi

command=$1
shift

if [ "$command" != "serve" ]; then
  node @@REPO_DIR@@/dist/bin/pp.js "$command" "$@"
  exit $?
fi

# Parse remaining arguments for --env
env=""
other_args=()
while [ $# -gt 0 ]; do
  if [[ $1 == --env=* ]]; then
    env="${1#--env=}"
  else
    other_args+=("$1")
  fi
  shift
done

if [ -z "$env" ]; then
  echo "For serve command, please specify --env=acceptance, --env=production, or --env=test"
  exit 1
fi

case "$env" in
  acceptance)
    while true; do
      echo "Starting at $(date). Press Ctrl-C to restart"
      node @@REPO_DIR@@/dist/bin/pp.js serve --port 5422 --rest-port 4010 --bypass-auth "${other_args[@]}"
    done
    ;;
  production)
    node @@REPO_DIR@@/dist/bin/pp.js serve "${other_args[@]}"
    ;;
  test)
    node @@REPO_DIR@@/dist/bin/pp.js serve --port 5423 --rest-port 4020 --bypass-auth "${other_args[@]}"
    ;;
  *)
    echo "Unknown environment: $env"
    echo "Please use --env=acceptance, --env=production, or --env=test"
    exit 1
    ;;
esac

