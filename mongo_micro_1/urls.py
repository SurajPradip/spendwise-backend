
from django.urls import path,include
from . import views

urlpatterns = [
    path('create-or-list-spending-obj/',views.CreateOrListSpendingObjAPIview.as_view(),name='create-spending-obj'),
    path('get-per-day-expense/',views.GetPerDayExpense.as_view(),name='get-per-day-expense'),
    path('get-category-wise-expense/',views.GetCategoryWiseExpense.as_view(),name='get-category-wise-expense'),
    path('delete-spending-obj/<int:spending_id>/',views.DeleteSpendingObjAPIView.as_view(),name='delete-spending-obj')
]