
from django.urls import path,include
from . import views

urlpatterns = [
    path('create-or-list-spending-obj/',views.CreateOrListSpendingObjAPIview.as_view(),name='create-or-list-spending-obj'),
    path('get-per-day-expense/',views.GetPerDayExpense.as_view(),name='get-per-day-expense'), #---change name to get-per-day-line-graph-data 
    path('get-category-wise-expense/',views.GetCategoryWiseExpense.as_view(),name='get-category-wise-expense'), #------change name to get-category-bar-graph-data
    path('delete-spending-obj/<int:spending_id>/',views.DeleteSpendingObjAPIView.as_view(),name='delete-spending-obj'),
    path('balance-and-spending-summary/',views.SpendingSummaryAPIView.as_view(),name='balance-and-spending-summary'),
    path('get-day-by-day-detail/',views.DayByDAyAPIView.as_view(),name='get-day-by-day-detail'),
    path('day-spending/<int:day>/',views.DaySpendingAPIView.as_view(),name='day-spending'),
    path('get-grant-graphs/',views.GrantGRaphAPIView().as_view(),name='get-all-month-graph-data'),
    # path('monthly-spending-bar-graph/',views.MonthlySpendingBarGraphAPIView.as_view(),name='monthly-spending-bar-graph'),
    
]