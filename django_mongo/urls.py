"""
URL configuration for django_mongo project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path, re_path
from drf_spectacular.views import (SpectacularAPIView, SpectacularRedocView,
                                   SpectacularSwaggerView)

schema_view = get_schema_view(
    openapi.Info(
        title="Your Project API",
        default_version='v1',
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)



urlpatterns =[
    path("admin/", admin.site.urls),
    path("django/",include("mongo_micro_1.urls")),
]

urlpatterns += [
    # Swagger Urls
    # path("__debug__/", include("debug_toolbar.urls")),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('doc/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
    
]
