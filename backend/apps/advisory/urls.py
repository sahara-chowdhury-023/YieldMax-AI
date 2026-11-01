from django.urls import path
from .views import advisory_api, advisor_chat_api

urlpatterns = [
    path("advisory/<int:farm_id>/", advisory_api, name="advisory-api"),
    path("advisor/chat/", advisor_chat_api, name="advisor-chat-api"),
]