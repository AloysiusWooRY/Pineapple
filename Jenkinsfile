pipeline {
    agent any
    stages {
        stage('Checkout SCM') {
            steps {
                script {
                    withCredentials([usernamePassword(credentialsId: '3x03', usernameVariable: 'GITHUB_USER', passwordVariable: 'GITHUB_TOKEN')]) {
                        sh "git clone https://github.com/AloysiusWooRY/ICT3103.git"
                    }
                }
            }
        }

        stage('OWASP DependencyCheck') {
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'Default'
            }
        }
    }   
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
    }
}
