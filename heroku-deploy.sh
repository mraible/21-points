#!/usr/bin/env bash

# exit when any command fails
set -e

# change the versions in package.json and build.gradle and release before running.
./gradlew clean -Pprod bootJar -x test

# If the command below doesn't work, run heroku plugins:install java
heroku deploy:jar --jar build/libs/*.jar \
  --includes newrelic-agent.jar:newrelic.yml \
  --app health-by-points
