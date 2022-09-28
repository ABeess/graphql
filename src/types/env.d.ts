declare namespace NodeJS {
  export interface ProcessEnv {
    CLIENT_URL: string;
    PORT: string;
    DB_USERNAME: string;
    DB_PASSWORD: string;
    DB_NAME: string;
    SESSION_SECRET: string;
    ACCESS_TOKEN_SECRET: string;
    REFRESH_TOKEN_SECRET: string;
    PROJECT_ID_STORAGE: string;
    PATH_SECRET_STORAGE: string;
    NAME_STORAGE: string;
    NODE_ENV: string;
    SESSION_NAME: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  }
}
