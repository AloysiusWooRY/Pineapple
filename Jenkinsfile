pipeline {
    agent any
    stages {
        stage('Checkout SCM') {
            steps {
                https://AloysiusWooRY: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@github.com/AloysiusWooRY/ICT3103.git
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
