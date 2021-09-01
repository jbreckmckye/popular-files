#!/usr/bin/env bash

node_modules/.bin/ts-node --transpile-only --script-mode --pretty lib.ts "${1}"
