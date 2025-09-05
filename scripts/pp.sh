#!/bin/bash

if [ -z "$PP_DB_NAME" ];then
  echo "PP vars not defined. Please check your environment"
  exit 1
fi

if [ -z "$1" ]; then
  echo "Please specify an environment: --acceptance, --production, or --test"
  exit 1
fi

case "$1" in
  --acceptance)
    shift
    while true;do
      echo "Starting at $(date). Press Ctrl-C to restart"
      node @@REPO_DIR@@/dist/bin/pp.js serve --port 5422 --rest-port 4010 --bypass-auth "$@"
    done
    ;;
  --production)
    shift
    node @@REPO_DIR@@/dist/bin/pp.js "$@"
    ;;
  --test)
    shift
    node @@REPO_DIR@@/dist/bin/pp.js serve --port 5423 --rest-port 4020 --bypass-auth "$@"
    ;;
  *)
    echo "Unknown option: $1"
    echo "Please use --acceptance, --production, or --test"
    exit 1
    ;;
esac

