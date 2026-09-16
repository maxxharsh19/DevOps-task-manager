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

        stage('Deploy Application') {
            steps {
                sh 'docker compose up -d --force-recreate'
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'docker compose ps'
            }
        }
    }

    post {

        success {
            echo '✅ CI/CD pipeline completed successfully.'
            echo '🚀 Application deployed successfully.'
        }

        failure {
            echo '❌ CI/CD pipeline failed. Check the build logs.'
        }
    }
}
