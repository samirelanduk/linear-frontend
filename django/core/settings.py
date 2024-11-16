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
env.read_env(os.path.join(PROJECT_DIR, ".env"))

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

TOKENS = []
for n in range(1, 10):
    try:
        name = env(f"WORKSPACE{n}_NAME")
        token = env(f"WORKSPACE{n}_TOKEN")
        TOKENS.append({"name": name, "token": token})
    except:
        pass