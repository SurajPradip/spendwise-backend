from rest_framework import generics,status
from mongo_micro_1.CustomMessages import Custommessage
from rest_framework.response import Response
from .serializers import *
from django.utils import timezone
from django.db.models import Sum

class CreateOrListSpendingObjAPIview(generics.GenericAPIView):
    serializer_class = CreateSpendingObjSerializer
    msg_ob = Custommessage()

    def get(self,request,*args,**kwargs):
        data = SpendwiseBasicDetails.objects.all().order_by('-date')
        serialized_data = ListSpendingObjSerializer(data,many=True).data
        return Response({"status":True, "msg": self.msg_ob.listed_successfully, 
                "response":serialized_data},status=status.HTTP_200_OK) 
    
    def post(self,request):
        serializer = self.get_serializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status":True, 
                "msg": self.msg_ob.obj_create_success.format(obj="Spending"), 
                "response":{}}, status=status.HTTP_200_OK)
            
        return Response({"status":False, "msg": self.msg_ob.obj_not_found, 
                "response":{}}, status=status.HTTP_400_BAD_REQUEST) 

class GetPerDayExpense(generics.GenericAPIView):   
    serializer_class = DayExpenseSerializer
    month = timezone.now().month
    msg_ob = Custommessage()
    
    def generate_daily_expense(self,expenses):
        expense_dict = {
            'labels':[],
            'data':[],
            'index':{}
        }
        for item in expenses:
            date = item['date']
            if date not in expense_dict['labels']:
                expense_dict['labels'].append(date)
                expense_dict['data'].append(item['price'])
                expense_dict['index'][date]=expense_dict['labels'].index(date)
            else:
                index = expense_dict['labels'].index(date)
                expense_dict['data'][index] += item['price']

        return expense_dict
             
    def get(self,request,*args,**kwargs):
        spend_objs = SpendwiseBasicDetails.objects.filter(date__month=self.month)\
            .order_by('date')
        while not spend_objs:                                                                      #Prev month
            spend_objs = SpendwiseBasicDetails.objects.filter(date__month=self.month-1)\
            .order_by('date')
        
        expenses = self.get_serializer(spend_objs,many=True).data
        daily_expense = self.generate_daily_expense(expenses)
        return Response({"status":True, 
                "msg": self.msg_ob.listed_successfully, 
                "expense_per_day":daily_expense}, status=status.HTTP_200_OK)

class GetCategoryWiseExpense(generics.GenericAPIView):
    serializer_class = CatExpensesSerializer
    month = timezone.now().month
    msg_ob = Custommessage()
    
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
        while not cat_expenses_objs:                                                                                         #Prev month
            cat_expenses_objs = SpendwiseBasicDetails.objects.filter(date__month=self.month-1).order_by('category') 
        serialized_data = self.get_serializer(cat_expenses_objs,many=True)
        cat_expenses = self.generate_category_chart(serialized_data.data)
        return Response({"status":True, 
                    "msg": self.msg_ob.listed_successfully, 
                    "category_wise":cat_expenses}, status=status.HTTP_200_OK)

class DeleteSpendingObjAPIView(generics.GenericAPIView):
    msg_ob = Custommessage()

    def get_object(self,spending_obj_id):
        try:
            return SpendwiseBasicDetails.objects.get(id=spending_obj_id)
        except:
            return None

    def delete(self,request,*args,**kargs):
        spend_obj = self.get_object(self.kwargs['spending_id'])
        if not spend_obj:
            return Response({"status":True, "msg": self.msg_ob.obj_deleted, 
                    "response":{}}, status=status.HTTP_200_OK)
        spend_obj.delete()
        return Response({"status":True, 
                "msg": self.msg_ob.listed_successfully, 
                "response":{}}, status=status.HTTP_200_OK)

class SpendingSummaryAPIView(generics.GenericAPIView):
    msg_ob = Custommessage()
    month = timezone.now().month
    
    def get(self,request,*args,**kwargs):
        spend_objs = SpendwiseBasicDetails.objects.filter(date__month=self.month)
        if not spend_objs:
            spend_objs = SpendwiseBasicDetails.objects.filter(date__month=self.month-1) #Prev month
        aggregates = spend_objs.aggregate(
            total_spending=Sum('price'),
            total_s_faction = Sum('s_faction')
        )
        balance = 1000 #Balance workflow (Income,Salary,-Total_spending)
        avg_s_faction = aggregates['total_s_faction']/spend_objs.count()
        spending_per_day = aggregates['total_spending']/spend_objs.values('date').distinct().count()
        response_dict = {
            'balance':round(balance,2),
            'avg_s_faction':round(avg_s_faction,2),
            'spending_per_day':round(spending_per_day,2)    
        }
        return Response({"status":True, 
                "msg": self.msg_ob.listed_successfully, 
                "response":response_dict}, status=status.HTTP_200_OK)