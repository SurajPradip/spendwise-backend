from rest_framework import generics
from rest_framework.response import Response
from .serializers import *

class CreateOrListSpendingObjAPIview(generics.GenericAPIView):
    serializer_class = CreateSpendingObjSerializer

    def get(self,request,*args,**kwargs):
        data = SpendwiseBasicDetails.objects.all().order_by('-date')
        serialized_data = ListSpendingObjSerializer(data,many=True).data
        return Response({"msg":"success","response":serialized_data})
    
    def post(self,request):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"msg":"success","response":"serialized_data"})
        return Response({"Msg":serializer.errors})

class GetPerDayExpense(generics.GenericAPIView):   
    
    def generate_daily_expense(self,expenses):
        expense_dict = {}
        for item in expenses:
            date = item['date'].strftime('%d-%m-%Y')
            if date not in expense_dict:
                expense_dict[date] = {
                    'price':item['price'],
                    's_faction':2,
                    'reason':[item['reason']] if item['price'] > 700 else [],
                    'categories':[item['category']]
                }
            else:
                expense_dict[date]['price'] += item['price']
                expense_dict[date]['s_faction'] = 2
                if item['price'] > 700:
                    expense_dict[date]['reason'].append(item['reason'])
                
                if not item['category'] in expense_dict[date]['categories']:
                    expense_dict[date]['categories'].append(item['category'])
        return expense_dict
             
    def get(self,request,*args,**kwargs):
        expenses = SpendwiseBasicDetails.objects.all().values('date','reason','category','price')
        daily_expense = self.generate_daily_expense(expenses)
        return Response({"expense_per_day":daily_expense})

class GetCategoryWiseExpense(generics.GenericAPIView):
    serializer_class = CatExpensesSerializer
        
    def get(self,request,*args,**kwargs):
        category_id = self.kwargs['category_id']
        cat_expenses_objs = SpendwiseBasicDetails.objects.filter(category=category_id)
        cat_expenses = self.get_serializer(cat_expenses_objs,many=True)
        return Response({"category_wise":cat_expenses.data})
