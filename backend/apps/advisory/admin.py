from django.contrib import admin
from .models import CropGuideline, ChatMessage


@admin.register(CropGuideline)
class CropGuidelineAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "crop_code",
        "topic",
        "stage",
        "is_verified",
        "reviewed_by",
    )

    list_filter = (
        "crop_code",
        "stage",
        "is_verified",
        "land_type",
    )

    search_fields = (
        "crop_code",
        "topic",
        "instruction",
        "source_name",
    )


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "farm",
        "role",
        "prompt_version",
        "created_at",
    )

    list_filter = (
        "role",
        "created_at",
    )

    search_fields = (
        "content",
        "farm__crop_code",
    )

    readonly_fields = ("created_at",)