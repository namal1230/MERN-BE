pipeline {
    agent any
    
    environment {
        IMAGE_NAME = 'namal1230/mern-be'
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_CREDENTIALS_ID = 'docker-hub-creds'
        DOCKER_HUB_REPO = 'namaldil/saas-backend'
    }
    
    stages {
        stage('SCM Checkout') {
            steps {
                retry(3){
                    git branch: 'main', url: 'https://github.com/namal1230/MERN-BE'
                }
            }
        }
        
        stage('Build') {
            steps {
                bat 'npm ci'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    echo '🐳 Building Docker image...'
                    dockerImage = docker.build("${DOCKER_HUB_REPO}:latest")
                }
            }
        }
        stage('Push to Docker Registry') {
            steps {
                script {
                    echo '📤 Pushing Docker image to registry...'
                    docker.withRegistry('https://index.docker.io/v1/', DOCKER_CREDENTIALS_ID) {
                        dockerImage.push("latest")
                    }
                }
            }
        }
    }
    
    post {
        always {
            bat 'docker logout'
        }
    }
}