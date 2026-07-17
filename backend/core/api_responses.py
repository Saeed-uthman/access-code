from rest_framework.response import Response
from rest_framework import status


def success_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    body = {"success": True, "message": message}
    if data is not None:
        body["data"] = data
    return Response(body, status=status_code)


def error_response(message="An error occurred", status_code=status.HTTP_400_BAD_REQUEST, errors=None):
    body = {"success": False, "error": message}
    if errors is not None:
        body["errors"] = errors
    return Response(body, status=status_code)
