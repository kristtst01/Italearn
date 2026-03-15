from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://italearn:localdev@db:5432/italearn"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:4173"
    CLERK_SECRET_KEY: str = ""
    CLERK_PUBLISHABLE_KEY: str = ""
    WHISPER_MODEL: str = "small"
    WHISPER_DEVICE: str = "cpu"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
