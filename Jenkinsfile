pipeline {
  agent any
  stages {
    stage('CI') {
      // agent {
      //   docker { image 'node:16.13.1-alpine' }
      // }
      stages {
        stage('NPM') {
          steps {
            nodejs(nodeJSInstallationName: 'Node 16 LTS') {
              sh 'ls -a'
              sh '[[ -f build.zip ]] && rm build.zip'
              sh '[[ -d build ]] && rm -r build'
              sh 'node --version'
              sh 'npm ci'
            }
          }
        }
        stage('Test') {
          steps {
            nodejs(nodeJSInstallationName: 'Node 16 LTS') {
              sh 'npm test'
            }
            sh 'ls -l'
            archiveArtifacts artifacts: 'coverage/*.*', followSymlinks: false
            cobertura autoUpdateHealth: false, autoUpdateStability: false, coberturaReportFile: 'coverage/cobertura-coverage.xml', conditionalCoverageTargets: '70, 0, 0', failUnhealthy: false, failUnstable: false, lineCoverageTargets: '80, 0, 0', maxNumberOfBuilds: 0, methodCoverageTargets: '80, 0, 0', onlyStable: false, sourceEncoding: 'ASCII', zoomCoverageChart: false
          }
        }
      }
    }
  }
}