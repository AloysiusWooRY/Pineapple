pipeline {
	agent any
	stages {
		stage('Checkout SCM') {
            		steps {
				git url: 'https://github.com/AloysiusWooRY/ICT3103.git', credentialsId: '3x03'
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
