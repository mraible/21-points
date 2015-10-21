#!/usr/bin/env bash
#./gradlew -Pprod bootRepackage -x test
heroku deploy:jar --jar build/libs/*.war --includes newrelic.jar:newrelic.yml
