pipeline {
  agent any

  environment {
    NODE_ENV = 'production'
  }

  stages {
    stage('Install Dependencies') {
      steps {
        echo '📥 Installing dependencies…'
        // Windows agent: use bat, and working dir is root where package.json lives
        bat 'npm install'
      }
    }

    stage('Build Next.js App') {
      steps {
        echo '🔧 Building the Next.js app…'
        bat 'npm run build'
      }
    }

    stage('Start Application') {
      steps {
        echo '🚀 Starting Next.js app…'
        // This will keep the process alive so you can browse on localhost:3000
        bat 'npm run start'
      }
    }
  }

  post {
    success {
      echo '✅ Application is running on http://localhost:3000'
    }
    failure {
      echo '❌ Pipeline failed; check console logs.'
    }
  }
}
