from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    comic_api_key: str
    secret_key: str
    algorithm: str

    class Config:
        env_file = ".env"


settings = Settings()


def get_settings():
    return settings
