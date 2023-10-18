pipeline {
	agent any
	stages {
		stage('Checkout SCM') {
            		steps {
				git branch: 'main', url: 'https://github.com/AloysiusWooRY/ICT3103.git', credentialsId: '3x03'
                	}
		}

		stage('OWASP DependencyCheck') {
			steps {
				dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
			}
		}
	}	
	post {
		success {
			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
		}
	}
}
