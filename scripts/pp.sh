#!/bin/bash

if [ -z "$PP_DB_NAME" ];then
  echo "PP vars not defined. Please check your environment"
  exit 1
fi

if [ "$1" == "--dev" ];then
  shift
  while true;do
    echo "Starting at $(date). Press Ctrl-C to restart"
    node @@REPO_DIR@@/dist/bin/pp.js serve --port 5422 --rest-port 4010 --bypass-auth
  done
else
  node @@REPO_DIR@@/dist/bin/pp.js "$@"
fi

