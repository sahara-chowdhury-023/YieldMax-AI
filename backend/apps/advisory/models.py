from django.db import models
from apps.farms.models import CROP_STAGE_CHOICES


class CropGuideline(models.Model):
    crop_code = models.CharField(max_length=50)
    season = models.CharField(max_length=50)
    land_type = models.CharField(max_length=50)
    topic = models.CharField(max_length=100)

    stage = models.CharField(
    max_length=20,
    choices=CROP_STAGE_CHOICES,

)
    start_day = models.IntegerField()
    end_day = models.IntegerField()

    instruction = models.TextField()
    language_code = models.CharField(max_length=10, default="bn")

    source_name = models.CharField(max_length=200)
    source_url = models.URLField(blank=True)

    reviewed_by = models.CharField(max_length=150, blank=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    is_verified = models.BooleanField(default=False)
    revision = models.PositiveIntegerField(default=1)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["start_day", "end_day"]
        indexes = [
            models.Index(
                fields=["crop_code", "land_type", "is_verified"]
            ),
        ]

    def __str__(self):
        return f"{self.crop_code} - {self.topic}"


class ChatMessage(models.Model):
    ROLE_CHOICES = [
        ("user", "User"),
        ("assistant", "Assistant"),
    ]

    farm = models.ForeignKey(
        "farms.Farm",
        on_delete=models.CASCADE,
        related_name="chat_messages",
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
    )

    content = models.TextField()
    prompt_version = models.CharField(
        max_length=50,
        blank=True,
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.role} - Farm {self.farm_id}"