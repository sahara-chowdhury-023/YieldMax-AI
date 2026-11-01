
from django.utils import timezone
from django.db import transaction

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from apps.farms.models import Farm
from apps.predictions.models import Prediction

from .models import CropGuideline, ChatMessage
from .serializers import AdvisorChatSerializer

from services.advisor import (
    AdvisorServiceUnavailable,
    generate_advisor_response,
)


@api_view(["GET"])
def advisory_api(request, farm_id):

    # 1. Find farm
    try:
        farm = Farm.objects.get(pk=farm_id)

    except Farm.DoesNotExist:
        return Response(
            {
                "code": "FARM_NOT_FOUND",
                "message": "Farm not found",
                "field_errors": {
                    "farm_id": ["Invalid farm ID."]
                },
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    # 2. Calculate days after transplant
    today = timezone.localdate()

    if farm.planting_date is None or farm.planting_date > today:
        days_after_transplant = None
    else:
        days_after_transplant = (
            today - farm.planting_date
        ).days

    # 3. Get only verified and reviewed guidelines
    verified_guidelines = CropGuideline.objects.filter(
        crop_code=farm.crop_code,
        land_type=farm.land_type,
        stage=farm.crop_stage,
        is_verified=True,
        reviewed_at__isnull=False,
        reviewed_by__gt="",
    )

    # 4. Separate current and upcoming guidelines
    if days_after_transplant is None:

        do_now = verified_guidelines.filter(
            stage="pre_planting"
        )

        coming_up = CropGuideline.objects.none()

    else:

        do_now = verified_guidelines.filter(
            start_day__lte=days_after_transplant,
            end_day__gte=days_after_transplant,
        )

        coming_up = verified_guidelines.filter(
            start_day__gt=days_after_transplant,
            start_day__lte=days_after_transplant + 7,
        )

    # 5. Serialize guideline data
    def serialize_guidelines(guidelines):
        return [
            {
                "id": guideline.id,
                "topic": guideline.topic,
                "stage": guideline.stage,
                "instruction": guideline.instruction,
                "start_day": guideline.start_day,
                "end_day": guideline.end_day,
                "language_code": guideline.language_code,
                "source_name": guideline.source_name,
                "source_url": guideline.source_url,
                "reviewed_by": guideline.reviewed_by,
                "reviewed_at": (
                    guideline.reviewed_at.isoformat()
                    if guideline.reviewed_at
                    else None
                ),
            }
            for guideline in guidelines
        ]

    # 6. Return advisory response
    return Response(
        {
            "farm_id": farm.id,
            "crop_code": farm.crop_code,
            "crop_stage": farm.crop_stage,
            "planting_date": (
                farm.planting_date.isoformat()
                if farm.planting_date
                else None
            ),
            "days_after_transplant": days_after_transplant,
            "do_now": serialize_guidelines(do_now),
            "coming_up": serialize_guidelines(coming_up),
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def advisor_chat_api(request):

    # 1. Validate request data
    serializer = AdvisorChatSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(
            {
                "code": "INVALID_INPUT",
                "message": "Invalid chat request",
                "field_errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    farm_id = serializer.validated_data["farm_id"]
    question = serializer.validated_data["question"]

    # 2. Find farm
    try:
        farm = Farm.objects.get(pk=farm_id)

    except Farm.DoesNotExist:
        return Response(
            {
                "code": "FARM_NOT_FOUND",
                "message": "Farm not found",
                "field_errors": {
                    "farm_id": ["Invalid farm ID."]
                },
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    # 3. Load latest prediction
    prediction = (
        Prediction.objects.filter(farm=farm)
        .order_by("-created_at")
        .first()
    )

    if prediction is None:
        return Response(
            {
                "code": "PREDICTION_NOT_FOUND",
                "message": "No prediction found for this farm.",
                "field_errors": {},
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    # 4. Load scenario results
    scenarios = prediction.scenarios.all().order_by("id")

    # 5. Load only verified and reviewed guidelines
    guidelines = CropGuideline.objects.filter(
        crop_code=farm.crop_code,
        land_type=farm.land_type,
        stage=farm.crop_stage,
        is_verified=True,
        reviewed_at__isnull=False,
        reviewed_by__gt="",
    ).order_by("start_day")

    # 6. Call AI advisor service
    try:
        answer = generate_advisor_response(
            question=question,
            farm=farm,
            prediction=prediction,
            scenarios=scenarios,
            guidelines=guidelines,
        )

    except AdvisorServiceUnavailable:
        return Response(
            {
                "code": "ADVISOR_SERVICE_UNAVAILABLE",
                "message": "Advisor AI service is not configured yet.",
                "farm_id": farm.id,
                "prediction_id": prediction.id,
                "scenarios_loaded": scenarios.count(),
                "verified_guidelines_loaded": guidelines.count(),
            },
            status=status.HTTP_503_SERVICE_UNAVAILABLE,
        )

    # 7. Validate AI service response
    if not isinstance(answer, str) or not answer.strip():
        return Response(
            {
                "code": "INVALID_ADVISOR_RESPONSE",
                "message": "Advisor service returned an invalid response.",
            },
            status=status.HTTP_502_BAD_GATEWAY,
        )

    # 8. Save user question and assistant answer together
    with transaction.atomic():

        ChatMessage.objects.create(
            farm=farm,
            role="user",
            content=question,
        )

        ChatMessage.objects.create(
            farm=farm,
            role="assistant",
            content=answer.strip(),
            prompt_version="v1",
        )

    # 9. Return AI response
    return Response(
        {
            "farm_id": farm.id,
            "prediction_id": prediction.id,
            "answer": answer.strip(),
        },
        status=status.HTTP_200_OK,
    )
