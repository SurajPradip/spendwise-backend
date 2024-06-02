from django.contrib import admin
from .models import SpendwiseBasicDetails, UserProfile

admin.site.register(UserProfile)
admin.site.register(SpendwiseBasicDetails)

