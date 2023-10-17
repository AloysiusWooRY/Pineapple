pipeline {
	agent any

	stage('Checkout SCM') {
		steps {
				git 'ICT3103/JenkinsDependencyCheckTest'
		}
	}
	
	stages {
		stage('OWASP Dependency-Check Vulnerabilities') {
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
