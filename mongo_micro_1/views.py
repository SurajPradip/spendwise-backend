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
        month = request.GET.get('month') if request.GET.get('month') else timezone.now().month
        year = request.GET.get('year') if request.GET.get('year') else timezone.now().year
        
        data = SpendwiseBasicDetails.objects.filter(date__month=month,date__year=year).order_by('-date')
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
    serializer_class = DayExpenseGraphSerializer
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
        month = request.GET.get('month') if request.GET.get('month') else timezone.now().month
        year = request.GET.get('year') if request.GET.get('year') else timezone.now().year
        
        spend_objs = SpendwiseBasicDetails.objects.filter(date__month=month,date__year=year,is_active=True)
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
        month = request.GET.get('month') if request.GET.get('month') else timezone.now().month
        year = request.GET.get('year') if request.GET.get('year') else timezone.now().year
        
        cat_expenses_objs = SpendwiseBasicDetails.objects.filter(date__month=month,date__year=year,is_active=True) 
        serialized_data = self.get_serializer(cat_expenses_objs,many=True)
        cat_expenses = self.generate_category_chart(serialized_data.data) if serialized_data else {}
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
        spend_obj.update(is_active=False)
        return Response({"status":True, 
                "msg": self.msg_ob.listed_successfully, 
                "response":{}}, status=status.HTTP_200_OK)

class SpendingSummaryAPIView(generics.GenericAPIView):
    msg_ob = Custommessage()
    
    def get(self,request,*args,**kwargs):
        month = request.GET.get('month') if request.GET.get('month') else timezone.now().month
        year = request.GET.get('year') if request.GET.get('year') else timezone.now().year
        
        spend_objs = SpendwiseBasicDetails.objects.filter(date__month=month,date__year=year,is_active=True)
        if spend_objs:
            aggregates = spend_objs.aggregate(
                total_spending=Sum('price'),
                total_s_faction = Sum('s_faction')
            )
            print(spend_objs,'---------------------------------')
            balance = 1000 #Balance workflow (Income,Salary,-Total_spending)
            avg_s_faction = aggregates['total_s_faction']/spend_objs.count()
            spending_per_day = aggregates['total_spending']/spend_objs.values('date').distinct().count()
            response_dict = {
                'balance':round(balance,2),
                'avg_s_faction':round(avg_s_faction,2),
                'spending_per_day':round(spending_per_day,2)    
            }
        else:
            response_dict = {} #-----------------------spillover workflow
        return Response({"status":True, 
                "msg": self.msg_ob.listed_successfully, 
                "response":response_dict}, status=status.HTTP_200_OK)

class DayByDAyAPIView(generics.GenericAPIView):
    serializer_class = DayExpenseDetailSerializer
    msg_ob = Custommessage()
    month = timezone.now().month
    
    def generate_day_by_day_detail(self,expenses):
        expense_dict = {}
        for item in expenses:
            if item['date'] not in expense_dict:
                expense_dict[item['date']] = {
                    'day_spending':round(item['price'],2),
                    'categories':[item['category']],
                    'avg_s_faction':item['s_faction']
                }
            else:
                expense_dict[item['date']]['day_spending'] += round(item['price'],2)
                expense_dict[item['date']]['avg_s_faction'] = (float(expense_dict[item['date']]['avg_s_faction'])+float(item['s_faction']))/2
                if item['category'] not in expense_dict[item['date']]['categories']:
                    expense_dict[item['date']]['categories'].append(item['category'])
                    
        return expense_dict
        
    def get(self,request,*args,**kwargs):
        month = request.GET.get('month') if request.GET.get('month') else timezone.now().month
        year = request.GET.get('year') if request.GET.get('year') else timezone.now().year
        
        spend_objs = SpendwiseBasicDetails.objects.filter(date__month=month,date__year=year).order_by('-date')
            
        response_dict = self.generate_day_by_day_detail(self.get_serializer(spend_objs,many=True).data)
        return Response({"status":True, 
                "msg": self.msg_ob.listed_successfully, 
                "response":response_dict}, status=status.HTTP_200_OK)

class DaySpendingAPIView(generics.GenericAPIView):
    msg_ob = Custommessage()
    serializer_class = DayExpenseDetailSerializer
    def get(self,request,*args,**kwargs):
        month = request.GET.get('month') if request.GET.get('month') else timezone.now().month
        year = request.GET.get('year') if request.GET.get('year') else timezone.now().year
        day = self.kwargs['day']

        spend_objs = SpendwiseBasicDetails.objects.filter(
            date__day=day,date__month=month,date__year=year).order_by('price')
        
        response_dict = self.get_serializer(spend_objs,many=True).data
        
        return Response({"status":True, 
                "msg": self.msg_ob.listed_successfully, 
                "response":response_dict}, status=status.HTTP_200_OK)

class GrantGRaphAPIView(generics.GenericAPIView):
    serializer_class = DayExpenseGraphSerializer
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
        response_list = []                                  #Breaks when year comes in to play
        spend_objs = SpendwiseBasicDetails.objects.filter(is_active=True)
        months = spend_objs.values_list('date__month',flat=True).distinct()
        for month in months:
            month_spend_objs = spend_objs.filter(date__month=month)
            expenses = self.get_serializer(month_spend_objs,many=True).data
            daily_expense = self.generate_daily_expense(expenses)
            response_list.append({                      #Add pagination too too much graph 
                'month':month,
                'data':daily_expense
            })
            
        return Response({"status":True, 
                "msg": self.msg_ob.listed_successfully, 
                "response":response_list}, status=status.HTTP_200_OK)