pipeline {
  agent any
  options {
    timeout(time: 1, unit: 'HOURS') 
  }
  environment {
    ENTERPRISE = "guyin"
    PROJECT = "guyinsoft"
    ARTIFACT = "guyinsoft"
    CODE_DEPOT = "guyinsoft-web"
    
    ARTIFACT_BASE = "${ENTERPRISE}-docker.pkg.coding.net"
    ARTIFACT_IMAGE="${ARTIFACT_BASE}/${PROJECT}/${ARTIFACT}/${CODE_DEPOT}"

    K8S_SERVER_URL = "https://cls-81fbt76g.ccs.tencent-cloud.com"
  }
  stages {
    stage('检出') {
      steps {
        checkout([$class: 'GitSCM', branches: [[name: env.GIT_BUILD_REF]],
                            userRemoteConfigs: [[url: env.GIT_REPO_URL, credentialsId: env.CREDENTIALS_ID]]])
      }
    }
    stage('打包镜像') {
      steps {
		sh "docker build -t ${ARTIFACT_IMAGE}:${env.GIT_BUILD_REF} ."
        sh "docker tag ${ARTIFACT_IMAGE}:${env.GIT_BUILD_REF} ${ARTIFACT_IMAGE}:latest"
      }
    }
    stage('推送到制品库') {
      steps {
		script {
          docker.withRegistry("https://${ARTIFACT_BASE}", "${env.DOCKER_REGISTRY_CREDENTIALS_ID}") {
            docker.image("${ARTIFACT_IMAGE}:${env.GIT_BUILD_REF}").push()
       		docker.image("${ARTIFACT_IMAGE}:latest").push()
          }
        }
      }
    }
    stage('部署到 K8s 集群') {
      steps {
        script {
          dockerUser = ""
          dockerPassword = ""
          dockerServer = ARTIFACT_BASE
          dockerImage = "${ARTIFACT_IMAGE}:latest"

          withCredentials([usernamePassword(credentialsId: env.CODING_ARTIFACTS_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASSWORD')]) {
            dockerUser = DOCKER_USER
            dockerPassword = DOCKER_PASSWORD
          }
          withKubeConfig([credentialsId: '5df3ee24-08f3-4b27-a9e7-0f2703c80dd2', serverUrl: K8S_SERVER_URL]) {
            // sh(script: "kubectl create secret docker-registry coding-devops --docker-server=${dockerServer} --docker-username=${dockerUser} --docker-password=${dockerPassword} --docker-email=megadron@qq.com", returnStatus: true) 
            sh(script: "kubectl apply -f deploy.yaml", returnStatus: true)
            sh "kubectl patch deployment guyinsoft-web -p \"{\\\"spec\\\":{\\\"template\\\":{\\\"metadata\\\":{\\\"annotations\\\":{\\\"date\\\":\\\"`date +'%s'`\\\"}}}}}\""
          }
        }
      }
    }
  }
}