pipeline {
    agent any

    stages {
        stage('MM-Alarm'){
            steps{
                script {
                    def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                    def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                    mattermostSend (
                        color: '#D0E0E3', 
                        icon: "https://jenkins.io/images/logos/jenkins/jenkins.png",
                        message: "파이프라인 시작: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)"
                    )
                }
            }
        } 
  

        stage('Clone') { 
            steps {
                echo '클론을 시작!'
                git branch: 'dev', credentialsId: 'youfoot', url: 'https://lab.ssafy.com/s10-bigdata-dist-sub2/S10P22D207.git'
                echo '클론을 완료!'
            }
        }  
      
        stage('BE-Build') {
            steps {
                echo '백엔드 빌드 및 테스트 시작!'
                dir("./backend/ssafy_sec_proj") {
                    sh "ls"
                    sh "chmod +x ./gradlew"

                    // sh "touch ./build.gradle" 
 
                    // application properties 파일 복사
                    // sh "echo $BuildGradle > ./build.gradle"
            
                    sh "./gradlew clean build --exclude-task test"
                
                }
                echo '백엔드 빌드 및 테스트 완료!' 
            }
        }
  
        stage('Build Back Docker Image') {
            steps {
                echo '백엔드 도커 이미지 빌드 시작!'
                dir("./backend/ssafy_sec_proj") {
                    // 빌드된 JAR 파일을 Docker 이미지로 빌드
                    sh "docker build -t gungssam/youfootbe:latest ."
                }
                echo '백엔드 도커 이미지 빌드 완료!'
            }
        }
 
        stage('Push to Docker Hub-BE') {
            steps {
                echo '백엔드 도커 이미지를 Docker Hub에 푸시 시작!'
                withCredentials([usernamePassword(credentialsId: 'Docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                }
                dir("./backend/ssafy_sec_proj") {
                    sh "docker push gungssam/youfootbe:latest"
                }
                echo '백엔드 도커 이미지를 Docker Hub에 푸시 완료!'
            }
        }

        stage('Deploy to EC2-BE') {
            steps {
                echo '백엔드 EC2에 배포 시작!'
                // 여기에서는 SSH 플러그인이나 SSH 스크립트를 사용하여 EC2로 연결하고 Docker 컨테이너 실행
                sshagent(['aws-key']) { 
                    sh "docker rm -f backend"
                    sh "docker rmi gungssam/youfootbe:latest"
                    sh "docker image prune -f"
                    sh "docker pull gungssam/youfootbe:latest && docker run -d -p 8080:8080 --name backend gungssam/youfootbe:latest"
                }
                echo '백엔드 EC2에 배포 완료!'
            } 
        }

        stage('FE-Build') {
            steps {
                echo '프론트 빌드 및 테스트 시작!'
                dir("./frontend") {
                    sh "npm install --legacy-peer-deps"
                    sh "npm run build"
                }
                echo '프론트 빌드 및 테스트 완료!' 
            }
        }

        stage('Build Front Docker Image') {
            steps {
                echo '프론트 도커 이미지 빌드 시작!'
                dir("./frontend") {
                    // 빌드된 파일을 Docker 이미지로 빌드
                    sh "docker build -t gungssam/youfootfe:latest ."
                }
                echo '프론트 도커 이미지 빌드 완료!'
            }
        } 

        stage('Push to Docker Hub-FE') {
            steps {
                echo '프론트 도커 이미지를 Docker Hub에 푸시 시작!'
                withCredentials([usernamePassword(credentialsId: 'Docker-hub', usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD"
                }
                dir("frontend") {
                    sh "docker push gungssam/youfootfe:latest"
                }
                echo '프론트 도커 이미지를 Docker Hub에 푸시 완료!'
            }
        }

        stage('Deploy to EC2-FE') {
            steps {
                echo '프론트 EC2에 배포 시작!'
                // 여기에서는 SSH 플러그인이나 SSH 스크립트를 사용하여 EC2로 연결하고 Docker 컨테이너 실행
                sshagent(['aws-key']) { 
                    sh "docker rm -f frontend"
                    sh "docker rmi gungssam/youfootfe:latest"
                    sh "docker image prune -f"
                    sh "docker pull gungssam/youfootfe:latest && docker run -d -p 5173:5173 --name frontend gungssam/youfootfe:latest"
                }
                echo '프론트 EC2에 배포 완료!'
            } 
        }

    }

    post {
        success {
            echo '파이프라인이 성공적으로 완료되었습니다!'
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (
                    color: '#D0E0E3', 
                    icon: "https://jenkins.io/images/logos/jenkins/jenkins.png",
                    message: "빌드 성공: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)"
                )
            }
        }
        failure {
            echo '파이프라인이 실패하였습니다. 에러를 확인하세요.'
            script {
                def Author_ID = sh(script: "git show -s --pretty=%an", returnStdout: true).trim()
                def Author_Name = sh(script: "git show -s --pretty=%ae", returnStdout: true).trim()
                mattermostSend (
                    color: '#D0E0E3', 
                    icon: "https://4.bp.blogspot.com/-52EtGjEhW-k/UtOBXa1fhVI/AAAAAAAABbU/Lk4ZBYcvZrY/s1600/download.jpeg",
                    message: "빌드 실패: ${env.JOB_NAME} #${env.BUILD_NUMBER} by ${Author_ID}(${Author_Name})\n(<${env.BUILD_URL}|Details>)"
                )
            }
        }
    }
}