from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    SECRET_KEY: str = "dev-secret-change-me"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60
     # Email notifications
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_PORT: int = 587
    SMTP_USERNAME: str =""
    SMTP_PASSWORD: str =""
    EMAIL_FROM: str =""
    EMAIL_NOTIFICATIONS_ENABLED: bool = False

    DATABASE_URL: str = "postgresql://skincare:skincare@localhost:5432/skincare_db"
    MONGO_URL: str = "mongodb://localhost:27017"
    MONGO_DB: str = "skincare_docs"
    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_URI: str = "http://localhost:8000/api/auth/google/callback"
    FRONTEND_URL: str = "http://localhost:5173"
       

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")


settings = Settings()