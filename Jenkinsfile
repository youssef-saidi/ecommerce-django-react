pipeline {
    agent any
    triggers {
        pollSCM '* * * * *'
    }
    stages {
        stage('CLone Project and Verify Tooling') {
            steps {
                
                git(
                    url: "https://github.com/youssef-saidi/ecommerce-django-react",
                    branch: "master",
                    changelog: true,
                    poll: true
                )
                sh '''
                docker --version 
                docker version
                docker info
                docker compose version 
                curl --version
                '''
            }
        }
       // stage('Prune Docker data') {
        //    steps {
          //      sh 'docker system prune -a --volumes -f'
            //}
        //}
        
        stage('Build and Start Container') {
            steps {
                sh 'docker compose -f docker-compose.yml up -d --build'
            }
        }
        stage('Run tests against the container') {
            steps {
                          script {
                    def containerName = "miniprojet-frontend-1"
                    def maxAttempts = 5  // Adjust the number of attempts as needed
                    def waitTime = 10     // Adjust the wait time (in seconds) as needed
                    def attempts = 0

                    while (attempts < maxAttempts) {
                        def containerStatus = sh(returnStdout: true,script: "docker ps --filter name=${containerName} --format '{{.Status}}'")
                        echo "status ::::::${containerStatus} ..."
                        if (containerStatus.contains("Up")) {
                            sleep(waitTime)
                            echo 'Container is up and running.'
                            break
                        } else {
                            echo "Container is not yet ready. Retrying in ${waitTime} seconds..."
                            sleep(waitTime)
                            attempts++
                        }
                    }

                    if (attempts == maxAttempts) {
                        error 'Container did not start within the expected time.'
                    }
                }
                
                sh 'curl http://host.docker.internal:3000'
                echo 'Frontend worked successfully'
                sh 'curl http://host.docker.internal:8000'
                echo 'Backend worked successfully'
            }
        }
    }
     //   post {
       //     always {
         //       sh 'docker compose down --remove-orphans -v'
           //     sh 'docker compose ps'
            //}
        //}
    }
