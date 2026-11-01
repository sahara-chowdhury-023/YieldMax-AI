class AdvisorServiceUnavailable(Exception):
    """Raised when the AI advisor service is not configured."""


def generate_advisor_response(
    *,
    question,
    farm,
    prediction,
    scenarios,
    guidelines,
):
    """
    Integration point for the AI advisor service.

    Member A's actual AI implementation will be connected here.
    """

    raise AdvisorServiceUnavailable(
        "Advisor AI service is not configured yet."
    )