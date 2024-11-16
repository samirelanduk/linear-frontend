import os
import environ

PROJECT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

BASE_DIR = os.path.dirname(PROJECT_DIR)

env = environ.Env(
    DEBUG=(bool, False),
    SECRET_KEY=(str, "12345"),
    DB_URL=(str, "sqlite:///db.sqlite3"),
    CORS_ALLOWED_ORIGINS=(list, ["http://localhost"]),
)

ALLOWED_HOSTS = ["*"]

DEBUG = env("DEBUG")

SECRET_KEY = env("SECRET_KEY")

ROOT_URLCONF = "core.urls"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

USE_TZ = True

TIME_ZONE = "UTC"

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "corsheaders",
    "core",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

if DEBUG: MIDDLEWARE += ["querycount.middleware.QueryCountMiddleware"]

DATABASES = {
    "default": env.db("DB_URL")
}

CORS_ALLOWED_ORIGINS = env("CORS_ALLOWED_ORIGINS")