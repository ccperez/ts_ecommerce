export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      MONGODB_URI: string
      CLIENT_URL: string
      JWT_SECRET: string
      EMAIL_HOST: string
      EMAIL_PORT: number
      EMAIL_USER: string
      EMAIL_PASSWORD: string
      NODE_ENV: 'test' | 'dev' | 'prod'
    }
  }
}
