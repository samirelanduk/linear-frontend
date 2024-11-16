from django.http import JsonResponse
from django.conf import settings

def tokens(request):
    return JsonResponse(settings.TOKENS, safe=False)