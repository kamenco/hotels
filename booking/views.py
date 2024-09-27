from django.shortcuts import render


from django.conf import settings
from django.shortcuts import render

def my_view(request):
    return render(request, 'base.html', {'MEDIA_URL': settings.MEDIA_URL})
