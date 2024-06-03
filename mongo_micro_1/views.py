from rest_framework import generics
from rest_framework.response import Response
from .serializers import *
from django.utils import timezone

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
    month = timezone.now().month
    
    def generate_daily_expense(self,expenses):
        expense_dict = {
            'labels':[],
            'data':[],
            'index':{}
        }
        for item in expenses:
            date = item['date'].strftime('%d')
            if date not in expense_dict['labels']:
                expense_dict['labels'].append(date)
                expense_dict['data'].append(item['price'])
                expense_dict['index'][date]=expense_dict['labels'].index(date)
            else:
                index = expense_dict['labels'].index(date)
                expense_dict['data'][index] += item['price']

        return expense_dict
             
    def get(self,request,*args,**kwargs):
        expenses = SpendwiseBasicDetails.objects.filter(date__month=self.month)\
            .order_by('date').values('date','reason','category','price')
            
        daily_expense = self.generate_daily_expense(expenses)
        return Response({"expense_per_day":daily_expense})

class GetCategoryWiseExpense(generics.GenericAPIView):
    serializer_class = CatExpensesSerializer
    month = timezone.now().month
    
    def generate_category_chart(self,expenses):
        expense_dict = {
            'labels':[],
            'data':[],
            'index':{}
        }
        for item in expenses:
            if item['category'] not in expense_dict['labels']:
                expense_dict['labels'].append(item['category'])
                expense_dict['data'].append(item['price'])
                expense_dict['index'][item['category']]=expense_dict['labels'].index(item['category'])
            else:
                index = expense_dict['labels'].index(item['category'])
                expense_dict['data'][index] += item['price']
        return expense_dict
                
        
    def get(self,request,*args,**kwargs):
        cat_expenses_objs= SpendwiseBasicDetails.objects.filter(date__month=self.month).order_by('category')
        serialized_data = self.get_serializer(cat_expenses_objs,many=True)
        cat_expenses = self.generate_category_chart(serialized_data.data)
        return Response({"category_wise":cat_expenses})
