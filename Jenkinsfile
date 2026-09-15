pipeline {

    agent {
        label 'dev'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Validate Backend') {
            steps {
                sh 'python3 -m compileall backend'
            }
        }

        stage('Build Docker Images') {
            steps {
                sh 'docker compose build'
            }
        }

    }

    post {

        success {
            echo '✅ CI pipeline completed successfully.'
        }

        failure {
            echo '❌ CI pipeline failed. Check the build logs.'
        }

    }
}
