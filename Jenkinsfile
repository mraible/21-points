node {
    // uncomment these 2 lines and edit the name 'node-4.4.7' according to what you choose in configuration
    // def nodeHome = tool name: 'node-4.4.7', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    // env.PATH = "${nodeHome}/bin:${env.PATH}"

    stage('check tools') {
        sh "node -v"
        sh "npm -v"
        sh "bower -v"
        sh "gulp -v"
    }

    stage('checkout') {
        checkout scm
    }

    stage('npm install') {
        sh "npm install"
    }

    stage('clean') {
        sh "./gradlew clean"
    }

    stage('backend tests') {
        sh "./gradlew test"
    }

    stage('frontend tests') {
        sh "gulp test"
    }

    stage('protractor tests') {
        sh '''./gradlew &
        bootPid=$!
        sleep 45s
        gulp itest
        kill $bootPid
        '''
    }

    stage('packaging') {
        sh "./gradlew bootRepackage -Pprod -x test --stacktrace"
    }

    stage('deploying') {
        sh "heroku deploy:jar --jar build/libs/*.war --app health-by-points-2"
    }
}
