#!/usr/bin/env bash

# exit when any command fails
set -e

# change the versions in package.json and build.gradle and release before running.
./gradlew clean -Pprod bootJar -x test
#heroku deploy:jar --jar build/libs/*.jar --includes newrelic.jar:newrelic.yml
heroku deploy:jar --jar build/libs/*.jar
