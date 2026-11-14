from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://italearn:localdev@db:5432/italearn"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:4173"
    CLERK_SECRET_KEY: str = ""
    CLERK_PUBLISHABLE_KEY: str = ""
    GOOGLE_APPLICATION_CREDENTIALS: str = ""
    ANTHROPIC_API_KEY: str = ""
    # Comma-separated Clerk user IDs that see the feedback inbox
    ADMIN_CLERK_IDS: str = ""

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.CORS_ORIGINS.split(",")]

    @property
    def admin_clerk_ids(self) -> set[str]:
        return {i.strip() for i in self.ADMIN_CLERK_IDS.split(",") if i.strip()}

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
