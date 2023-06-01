export {}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: number
      MONGODB_URI: string
      CLIENT_URL: string
      NODE_ENV: 'test' | 'dev' | 'prod'
    }
  }
}
