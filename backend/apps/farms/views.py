
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from .models import Farmer, Farm
from .serializers import FarmerSerializer, FarmSerializer


@api_view(["GET"])
def health_check(request):
    return Response(
        {
            "status": "ok",
            "service": "YieldMax API",
        },
        status=status.HTTP_200_OK,
    )


@api_view(["GET", "POST"])
def farms_api(request):
    # POST: Create a new farm
    if request.method == "POST":
        serializer = FarmSerializer(data=request.data)

        if serializer.is_valid():
            farm = serializer.save()
            return Response(
                FarmSerializer(farm).data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )

    # GET: List all farms
    farms = Farm.objects.select_related("farmer").all()
    serializer = FarmSerializer(farms, many=True)

    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
def farmers_api(request):
    # POST: Create a new farmer
    serializer = FarmerSerializer(data=request.data)

    if serializer.is_valid():
        farmer = serializer.save()

        return Response(
            FarmerSerializer(farmer).data,
            status=status.HTTP_201_CREATED,
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST,
    )

@api_view(["GET"])
def farm_detail(request, pk):
    try:
        farm = Farm.objects.select_related("farmer").get(pk=pk)
    except Farm.DoesNotExist:
        return Response(
            {"error": "Farm not found"},
            status=status.HTTP_404_NOT_FOUND,
        )

    serializer = FarmSerializer(farm)
    return Response(serializer.data, status=status.HTTP_200_OK)
