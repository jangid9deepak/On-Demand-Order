import time
import logging

logger = logging.getLogger(__name__)


class RequestLoggingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start_time = time.time()

        response = self.get_response(request)

        duration = time.time() - start_time

        username = request.user.username if request.user.is_authenticated else "anonymous"

        logger.info(
            f"{request.method} {request.path} "
            f"user={username} status={response.status_code} "
            f"time={duration:.3f}s"
        )

        return response