pipeline {
    agent any
    environment {
        PATH = "${env.HOME}/.npm-packages:${env.PATH}"
        NPM_PACKAGES = "${env.HOME}/.npm-packages"
    }

    stages {
        stage('Continuous integration') {
            agent {
                docker { image 'node:16-alpine' }
            }
            stages {
                stage('Check node version and install dependencies') {
                    steps {
                        script {
                            npmdir = "${HOME}/.npm-packages"
                            if (fileExists(npmdir)) {
                                echo '.npm-packages folder exists'
                            } else {
                                echo '.npm-packages does not exist, create it'
                                sh "mkdir ${HOME}/.npm-packages"
                            }
                        }
                        sh "npm config set prefix ${npmdir}"
                        sh 'node --version'
                        // I had issues with `npm test`, both locally and in
                        // Jenkins pipeline execution, so I ended up using yarn
                        sh 'npm i -g yarn'
                        sh 'yarn'
                    }
                }
                stage('Run tests') {
                    steps {
                        script {
                            if (fileExists("coverage")) {
                                echo ">>> REMOVE coverage from previous tests"
                                sh "rm -rf coverage"
                            }
                        }
                        sh 'npm test'
                        sh "echo pwd is ${PWD}"
                        sh 'ls -ltrh coverage'
                        stash includes: 'coverage/**/*', name: 'coverage-data'
                    }
                    post {
                        always {
                            step([$class: 'CoberturaPublisher', coberturaReportFile: 'coverage/cobertura-coverage.xml', lineCoverageTargets: '90, 55, 45', failUnhealthy: false, failUnstable: false])
                        }
                    }
                }
            }
        }
        stage('Static Code Analysis') {
            // Get path to sonar-scanner,
            // Set variables to be used as organization and projectKey
            environment {
                SCANNER_HOME = tool 'Sonar Scanner 4'
                ORGANIZATION = "bhubr-github"
                PROJECT_NAME = "bhubr-jenkins-manning-sca-lp"
            }
            // We need to wrap nodejs block inside withSonarQubeEnv
            // in order to perform SCA on JavaScript code
            steps {
                script {
                    if (fileExists("coverage")) {
                        echo ">>> REMOVE coverage from previous tests"
                        sh "rm -rf coverage"
                    }
                }
                withSonarQubeEnv('SonarQube EC2 instance') {
                    nodejs(nodeJSInstallationName: 'Node 16 LTS') {
                        unstash 'coverage-data'
                        // Important: send lcov.info so that SonarQube processes
                        // code coverage output from Jest
                        sh "echo pwd is ${PWD}"
                        sh 'ls -ltrh coverage'
                        sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.organization=$ORGANIZATION \
                        -Dsonar.java.binaries=build/classes/java/ \
                        -Dsonar.projectKey=$PROJECT_NAME \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                        -Dsonar.coverage.exclusions=**/*.test.js,src/index.js,src/setupTests.js \
                        -Dsonar.sources=src'''
                    }
                }
            }
        }
        stage('Quality Gate') {
            steps {
                timeout(time: 10, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true, webhookSecretId: 'sonarqube-webhook-secret'
                }
            }
        }
    }
}
