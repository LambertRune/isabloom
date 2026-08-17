#!/bin/sh
set -e
node /directus/cli.js bootstrap
node /directus/cli.js schema apply --yes /directus/schema/snapshot.yaml
exec node /directus/cli.js start
