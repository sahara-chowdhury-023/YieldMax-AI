from django.urls import path
from .views import (
    predictions_api,
    prediction_detail,
    economics_calculate,
)

urlpatterns = [
    path("predictions/", predictions_api, name="predictions-api"),
    path(
        "predictions/<int:pk>/",
        prediction_detail,
        name="prediction-detail",
    ),
    path(
        "predictions/economics/calculate/",
        economics_calculate,
        name="predictions-economics-calculate",
    ),
    path(
        "economics/calculate/",
        economics_calculate,
        name="economics-calculate",
    ),
]
