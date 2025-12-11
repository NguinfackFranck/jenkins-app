// Solution 1: Use a global agent (Recommended for simple pipelines)
pipeline {
    agent {
        docker {
            image 'node:18-alpine'
            // When defined globally, the agent is reused for all stages
            // 'reuseNode true' is implicitly part of this global behavior in many setups
        }
    }
    stages {
        stage('Build') {
            steps {
                sh'''
                ls -a
                node --version
                npm --version
                npm ci
                npm run build
                ls -a
                '''
            }
        }
        stage('test'){
            steps{sh'''
            test -f build/index.html
            npm test

            '''
            }
        }
    }
    post{
        always{
            junit 'test-results/junit.xml'
        }
    }
}
