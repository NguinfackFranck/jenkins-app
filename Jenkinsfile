pipeline {
    agent any
    environment {
        NETLIFY_SITE_ID = '88b2d35d-78f7-4678-a3f8-51455e0666e0' 
        NETLIFY_AUTH_TOKEN = credentials('netlify-auth-token')
    }

    stages {
        stage('Build') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e
                    npm ci
                    npm run build
                '''
            }
        }
        stage('Test') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    test -f ./build/index.html
                    npm test
                '''
            }
        }
        stage('Deploy') {
            agent {
                docker {
                    image 'node:18-bullseye'
                    reuseNode true
                }
            }
            steps {
                sh '''
                    set -e
                    npm install netlify-cli
                    node_modules/.bin/netlify --version
                    echo "Deploying to production Netlify site ID: $NETLIFY_SITE_ID"
                    node_modules/.bin/netlify status
                    node_modules/.bin/netlify deploy --dir=./build --prod
                '''
            }
        }
    }
}