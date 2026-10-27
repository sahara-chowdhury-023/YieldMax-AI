
from django.urls import path
from .views import health_check, farms_api, farmers_api, farm_detail

urlpatterns = [
    path("health/", health_check, name="health-check"),
    path("farms/", farms_api, name="farms-api"),
    path("farmers/", farmers_api, name="farmers-api"),
    path("farms/<int:pk>/", farm_detail, name="farm-detail"),
]
