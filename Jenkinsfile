pipeline {
    agent {
        docker {
            image 'node:18'
            args '-u 0' // Run as root
        }
    }
	environment {
        CHROME_DRIVER_VERSION = ''
        CHROME_VERSION = ''
    }
    stages {
        stage('Prepare Environment') {
            steps {
                sh 'apt-get update'
                sh 'apt-get install -y git'
				
                // Install Google Chrome
                sh 'wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add -'
                sh 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" | tee /etc/apt/sources.list.d/google-chrome.list'
                sh 'apt-get update'
                sh 'apt-get install -y google-chrome-stable'
                
                // Install ChromeDriver
                sh 'wget https://edgedl.me.gvt1.com/edgedl/chrome/chrome-for-testing/119.0.6045.105/linux64/chromedriver-linux64.zip'
                sh 'if [ ! -f chromedriver-linux64.zip ]; then exit 1; fi' // Check if file is downloaded
                sh 'unzip -o chromedriver-linux64.zip'
                sh 'mv chromedriver-linux64/chromedriver /usr/bin/chromedriver'
                sh 'chown root:root /usr/bin/chromedriver'
                sh 'chmod +x /usr/bin/chromedriver'
				
                sh 'npm install -g pm2'
                git branch: 'main', url: 'https://github.com/AloysiusWooRY/ICT3103.git', credentialsId: '3x03'
                script {
                    fileContent = readFile("/tmp/shared_dir/.env")
                    fileTestContent = readFile("/tmp/shared_dir/.envtest")
                    frontendTestContent = readFile("/tmp/shared_dir/testenv.js")
                }
            }
        }
        stage('Setup Application') {
            parallel {
                stage('Frontend Setup') {
                    steps {
                        dir('frontend') {
                            sh 'npm install'
                            sh 'pm2 start npm --name frontend -- start'
                            sleep time: 20, unit: 'SECONDS'
                        }
                    }
                }
                stage('Backend Setup') {
                    steps {
                        dir('backend') {
                            writeFile file: ".env", text: fileContent
                            sh 'npm install'
                            sh 'pm2 start npm --name backend -- start'
                            sleep time: 20, unit: 'SECONDS'
                        }
                        dir('backend/test') {
                            writeFile file: ".envtest", text: fileTestContent
                        }
                    }
                }
            }
        }
        stage('Connection Tests') {
            steps {
                dir('backend/test') {
                    sh 'npx mocha connection.test.js'
                    sh 'pm2 restart backend'
                    sleep time: 20, unit: 'SECONDS'
                }
            }
        }
        stage('Authentication Tests') {
            steps {
                dir('backend/test') {
                    sh 'npx mocha authentication.test.js'
                    sh 'pm2 restart backend'
                    sleep time: 20, unit: 'SECONDS'
                }
            }
        }
        stage('Boundary Tests') {
            steps {
                dir('backend/test') {
                    sh 'npx mocha boundaryAccount.test.js'
                    sh 'npx mocha boundaryPost.test.js'
                    sh 'pm2 restart backend'
                    sleep time: 20, unit: 'SECONDS'
                }
            }
        }
        stage('UI Tests') {
            steps {
                dir('frontend/test') {
                    writeFile file: "testenv.js", text: frontendTestContent
                    sh 'chromedriver --version'
                    sh 'node ui-test.js'
                }
            }
        }
    }
}
