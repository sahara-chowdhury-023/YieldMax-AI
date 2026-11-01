from rest_framework import serializers


class AdvisorChatSerializer(serializers.Serializer):
    farm_id = serializers.IntegerField(min_value=1)
    question = serializers.CharField(
        required=True,
        allow_blank=False,
        trim_whitespace=True,
        max_length=2000,
    )
