pipeline {
    agent any

    stages {
        stage('Continuous integration') {
            stages {
                stage('Check node version and install dependencies') {
                    steps {
                        nodejs(nodeJSInstallationName: 'Node 16 LTS') {
                            sh 'node --version'
                            // I had issues with `npm test`, both locally and in
                            // Jenkins pipeline execution, so I ended up using yarn
                            sh 'npm i -g yarn'
                            sh 'yarn'
                        }
                    }
                }
                stage('Run tests') {
                    steps {
                        nodejs(nodeJSInstallationName: 'Node 16 LTS') {
                            sh 'npm test'
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
                withSonarQubeEnv('SonarQube EC2 instance') {
                    nodejs(nodeJSInstallationName: 'Node 16 LTS') {
                        // Important: send lcov.info so that SonarQube processes
                        // code coverage output from Jest
                        sh '''$SCANNER_HOME/bin/sonar-scanner -Dsonar.organization=$ORGANIZATION \
                        -Dsonar.java.binaries=build/classes/java/ \
                        -Dsonar.projectKey=$PROJECT_NAME \
                        -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
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
