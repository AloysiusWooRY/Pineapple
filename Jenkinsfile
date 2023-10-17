pipeline {
	agent any
	stages {
		stage('OWASP Dependency-Check Vulnerabilities') {
			steps {
				dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
			}
		}
		
		stage('Checkout SCM') {
			steps {
				git 'ICT3103/JenkinsDependencyCheckTest'
			}
		}


	}	
	post {
		success {
			dependencyCheckPublisher pattern: 'dependency-check-report.xml'
		}
	}
}
