pipeline {
    agent any
    // Set variables that will be used in Continuous integration step
    environment {
        PATH = "${env.HOME}/.npm-packages:${env.PATH}"
        NPM_PACKAGES = "${env.HOME}/.npm-packages"
        DOCKERHUB_CREDENTIALS = credentials('docker-hub-credentials')
        IMAGE_NAME = "${env.DOCKERHUB_CREDENTIALS_USR}/bmi-calculator"
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
                        // Set npm packages dir to ~/.npm-packages,
                        // in order to avoid using `sudo` before `npm i -g yarn`
                        sh "npm config set prefix ${npmdir}"

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
                                echo "Remove coverage data from previous test runs"
                                sh "rm -rf coverage"
                            }
                        }
                        sh 'npm test'
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
            agent {
                docker {
                    image 'sonarsource/sonar-scanner-cli:latest'
                }
            }
            // Set variables to be used as organization and projectKey
            environment {
                ORGANIZATION = "bhubr-github"
                PROJECT_NAME = "bhubr-jenkins-manning-sca-lp"
            }
            steps {
                // Remove coverage folder if it exists
                script {
                    if (fileExists("coverage")) {
                        echo "Remove coverage data from previous test runs"
                        sh "rm -rf coverage"
                    }
                }
                withSonarQubeEnv('SonarQube EC2 instance') {
                    // unstash coverage data from previous step
                    unstash 'coverage-data'

                    // Important: send lcov.info so that SonarQube processes
                    // code coverage output from Jest
                    sh '''sonar-scanner \
                    -Dsonar.host.url=$SONAR_HOST_URL \
                    -Dsonar.login=$SONAR_AUTH_TOKEN \
                    -Dsonar.organization=$ORGANIZATION \
                    -Dsonar.java.binaries=build/classes/java/ \
                    -Dsonar.projectKey=$PROJECT_NAME \
                    -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                    -Dsonar.coverage.exclusions=**/*.test.js,src/index.js,src/setupTests.js \
                    -Dsonar.sources=src'''
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
        stage('Build') {
            agent {
                docker { image 'node:16-alpine' }
            }
            stages {
                stage('Generate build') {
                    steps {
                        script {
                            if (fileExists("build")) {
                                sh "rm -rf build"
                            }
                        }
                        sh "yarn build"
                    }
                }
                stage('Zip build and archive it') {
                    steps {
                        zip zipFile: 'build.zip', archive: true, dir: 'build', overwrite: true
                        stash includes: 'build.zip', name: 'build-archive', allowEmpty: false
                    }
                }
            }
        }
        stage('Docker build and publish') {
            stages {
                stage('Retrieve stashed build') {
                    steps {
                        unstash 'build-archive'
                        unzip zipFile: 'build.zip', dir: 'build'
                    }
                }
                stage('Docker build') {
                    steps {
                        sh '''docker build \
                        --label org.label-schema.name=$IMAGE_NAME \
                        --label org.label-schema.build-date=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
                        --label org.label-schema.vcs-ref=$(git rev-parse --short HEAD) \
                        --label org.label-schema.version=0.1 \
                        -t $IMAGE_NAME:latest .'''
                    }
                }
                stage('Docker Hub login') {
                    steps {
                        sh '''echo $DOCKERHUB_CREDENTIALS_PSW | docker login \
                          -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'''
                    }
                }
                stage('Docker Hub push') {
                    steps {
                        sh 'docker push $IMAGE_NAME:latest'
                    }
                }
            }
        }
        stage('Trivy image scan') {
            steps {
                sh "docker run aquasec/trivy:latest image --exit-code 1 ${IMAGE_NAME}:latest"
            }
        }
    }
    post {
        success {
            slackSend color: 'good', message: "Jenkins build #${BUILD_NUMBER} SUCCESS at ${BUILD_URL}"
        }
        failure {
            slackSend color: 'danger', message: "Jenkins build #${BUILD_NUMBER} FAILURE at ${BUILD_URL}"
        }
    }
}
