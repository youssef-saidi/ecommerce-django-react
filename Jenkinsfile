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
