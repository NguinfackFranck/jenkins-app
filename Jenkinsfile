pipeline {
    agent any

    environment {
        BUILD_DIR = 'build'
        INDEX_HTML = 'index.html'
        REACT_APP_VERSION = "1.0.$BUILD_ID"
        APP_NAME = 'learnjenkinsapp'
        AWS_DEFAULT_REGION = "us-east-1"
        AWS_ECS_CLUSTER = 'LearnJenkinsApp-Production-Cluster'
        AWS_ECS_SERVICE = 'LearnJenkinsApp-TaskDefinition-Prod-Service'
        AWS_ECS_TASKDEF = 'LearnJenkinsApp-TaskDefinition-Prod'
        AWS_ECR_DOCKER_REGISTRY = '140023385864.dkr.ecr.us-east-1.amazonaws.com/babsom'
    }
 
    stages {

        stage('Build') {
            agent {
                docker {
                    image 'node:18-alpine'
                    reuseNode true
                }
            }
 
            steps {
                sh '''
                    ls -la
                    npm --version
                    npm ci
                    npm run build
                    ls -la
                '''
            }
        }

        stage('Build Docker Image') {
            agent {
                docker {
                    image 'my-aws-cli'
                    reuseNode true
                    args "-u root -v /var/run/docker.sock:/var/run/docker.sock --entrypoint=''"
                }
            }

            steps {
                withCredentials([usernamePassword(credentialsId: 'my-aws', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                        aws --version
                        docker --version
                        docker build -t $AWS_ECR_DOCKER_REGISTRY/$APP_NAME:$REACT_APP_VERSION .
                        aws ecr get-login-password | docker login --username AWS --password-stdin $AWS_ECR_DOCKER_REGISTRY
                        docker push $AWS_ECR_DOCKER_REGISTRY/$APP_NAME:$REACT_APP_VERSION
                    '''
                }
            }
        }
 
        stage ('Deploy to AWS') {
            agent {
                docker {
                    image 'my-aws-cli'
                    reuseNode true
                    args "--entrypoint=''"
                }
            }

            steps {
                // stream editor -i ... editing in place(nimm the datei als input)  "s ... substitude /what to replace/what to replace with/global(all occurances)" filename
                withCredentials([usernamePassword(credentialsId: 'my-aws', passwordVariable: 'AWS_SECRET_ACCESS_KEY', usernameVariable: 'AWS_ACCESS_KEY_ID')]) {
                    sh '''
                            aws --version
                            sed -i "s/#APP_VERSION#/$REACT_APP_VERSION/g" aws/task-definition-prod.json
                            cat aws/task-definition-prod.json
                            LATEST_TD_REVISION=$(aws ecs register-task-definition --cli-input-json file://aws/task-definition-prod.json | jq '.taskDefinition.revision')
                            echo $LATEST_TD_REVISION
                            aws ecs update-service --cluster $AWS_ECS_CLUSTER --service $AWS_ECS_SERVICE --task-definition $AWS_ECS_TASKDEF:$LATEST_TD_REVISION
                            aws ecs wait services-stable --cluster $AWS_ECS_CLUSTER --services $AWS_ECS_SERVICE
                        '''
                }
            }
        }
     }
}