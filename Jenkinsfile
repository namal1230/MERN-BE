pipeline {
    agent any
    
    environment {
        NODE_ENV = 'production'
        REGISTRY = 'docker.io'
        IMAGE_NAME = 'namal1230/mern-be'
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKER_CREDENTIALS = credentials('docker-hub-credentials')
    }
    
    options {
        buildDiscarder(logRotator(numToKeepStr: '10'))
        timeout(time: 30, unit: 'MINUTES')
    }
    
    stages {
        stage('Checkout') {
            steps {
                echo '🔄 Checking out code...'
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                echo '📦 Installing npm dependencies...'
                sh '''
                    npm install
                '''
            }
        }
        
        stage('Build') {
            steps {
                echo '🔨 Building TypeScript project...'
                sh '''
                    npm run build
                '''
            }
        }
        
        stage('Test') {
            steps {
                echo '✅ Running tests...'
                sh '''
                    npm test
                '''
            }
        }
        
        stage('Code Quality') {
            steps {
                echo '🔍 Running code quality checks...'
                sh '''
                    npm audit --audit-level=moderate || true
                '''
            }
        }
        
        stage('Build Docker Image') {
            steps {
                echo '🐳 Building Docker image...'
                sh '''
                    docker build \
                        --tag ${IMAGE_NAME}:${IMAGE_TAG} \
                        --tag ${IMAGE_NAME}:latest \
                        .
                '''
            }
        }
        
        stage('Push to Docker Registry') {
            when {
                branch 'main'
            }
            steps {
                echo '📤 Pushing Docker image to registry...'
                sh '''
                    echo $DOCKER_CREDENTIALS_PSW | docker login -u $DOCKER_CREDENTIALS_USR --password-stdin
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${IMAGE_NAME}:latest
                    docker logout
                '''
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo '🚀 Deploying application...'
                sh '''
                    # Add your deployment script here
                    # Example: kubectl set image deployment/mern-be mern-be=${IMAGE_NAME}:${IMAGE_TAG}
                    echo "Deployment stage - Configure as per your infrastructure"
                '''
            }
        }
    }
    
    post {
        always {
            echo '🧹 Cleaning up...'
            sh '''
                docker system prune -f || true
            '''
            cleanWs()
        }
        
        success {
            echo '✨ Pipeline completed successfully!'
        }
        
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
