export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string | undefined
      DEV_MONGODB_URI: string
      PRD_MONGODB_URI: string
      CLIENT_URL: string
      JWT_SECRET: string
      EMAIL_HOST: string
      EMAIL_PORT: string | undefined
      EMAIL_USER: string
      EMAIL_PASSWORD: string
      NODE_ENV: 'test' | 'dev' | 'prod'
    }
  }
}
