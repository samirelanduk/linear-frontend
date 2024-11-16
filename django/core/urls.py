from django.urls import path
from core.views import tokens

urlpatterns = [
    path("tokens", tokens),
]