# 21-Points
Before you can build this project, you must install and configure the following dependencies on your machine:

1. [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle.

After installing Node, you should be able to run the following command to install development tools (like
[Bower][] and [BrowserSync][]). You will only need to run this command when dependencies change in package.json.

    npm install

We use [Grunt][] as our build system. Install the grunt command-line tool globally with:

    npm install -g grunt-cli

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

    gradlew
    grunt

Bower is used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in `bower.json`. You can also run `bower update` and `bower install` to manage dependencies.
Add the `-h` flag on any command to see how you can use it. For example, `bower update -h`.

# Building

To optimize the 21-Points client for production, run:

    gradlew -Pprod bootRepackage

This will concatenate and minify CSS and JavaScript files. It will also modify `index.html` so it references
these new files.

To ensure everything worked, run:

    java -jar build/libs/*.war

Then navigate to [http://localhost:8080](http://localhost:8080) in your browser.

# Testing

Unit tests are written in Java for the API and [Jasmine][] for the UI. UI unit tests are located in `src/test/javascript/specs` and can be run with:

    grunt test

UI end-to-end tests are powered by [Protractor][], which is built on top of WebDriverJS. They're located in `src/test/javascript/e2e` and can be run by starting Spring Boot in one terminal (`gradlew bootRun`) and
running the tests (grunt itest) in a second one.

If you want to run all JavaScript tests and generate a code metrics report, run:

grunt jenkins

To learn more about how Protractor was integrated into this project, see
[Adding Protractor Tests and Automating with Jenkins](http://www.jhipster-book.com/#!/news/entry/adding-protractor-tests).

# Continuous Integration

To setup this project in Jenkins, use the following configuration:

* Project name: `21-points`
* Source Code Management
    * Git Repository: `git@bitbucket.org:mraible/21-points.git`
    * Branches to build: `*/master`
    * Additional Behaviours: `Wipe out repository & force clone`
* Build Triggers
    * Poll SCM / Schedule: `H/5 * * * *`
* Build
    * Invoke Gradle script / Use Gradle Wrapper / Tasks: `-Pprod clean test bootRepackage`
    * Execute Shell / Command:
       
        ./gradlew bootRun &
        bootPid=$!
        sleep 30s
        grunt jenkins
        kill $bootPid

* Post-build Actions
    * Build other projects: `21-points-deploy`
    * Publish JUnit test result report / Test Report XMLs: `build/test-results/*.xml,build/reports/e2e/*.xml`
    * Publish HTML Reports / Report
        * HTML directory to archive: `build/reports/e2e/screenshots`
        * Index page[s]: `report.html`
        * Report title: `Test Screenshots`
    * Publish HTML Reports / Report
        * HTML directory to archive: `build/reports/metrics`
        * Index page[s]: `index.html`
        * Report title: `Code Metrics`

Then create another job to deploy to Heroku.

* Project name: `21-points-deploy`
* Source Code Management
    * Git Repository: `git@bitbucket.org:mraible/21-points.git`
    * Branches to build: `*/master`
* Build
    * Invoke Gradle script / Use Gradle Wrapper / Tasks: `-Pprod bootRepackage -x test`
    * Execute Shell / Command: `heroku deploy:jar --jar build/libs/*.war`

[Node.js]: https://nodejs.org/
[Bower]: http://bower.io/
[Grunt]: http://gruntjs.com/
[BrowserSync]: http://www.browsersync.io/
[Karma]: http://karma-runner.github.io/
[Jasmine]: http://jasmine.github.io/2.0/introduction.html
[Protractor]: https://angular.github.io/protractor/
