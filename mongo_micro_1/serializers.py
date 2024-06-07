from rest_framework import serializers

from mongo_micro_1.models import SpendwiseBasicDetails

class CreateSpendingObjSerializer(serializers.ModelSerializer):
 
    
    class Meta:
        model = SpendwiseBasicDetails
        fields = ('id','date','reason','category','price')

class ListSpendingObjSerializer(serializers.ModelSerializer):
    date = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    
    def get_date(self,obj):
        return obj.date.strftime('%d-%m-%Y')
    
    def get_category(self,obj):
        return obj.get_category_display()
    class Meta:
        model = SpendwiseBasicDetails
        fields = ('id','date','reason','category','price')

class CatExpensesSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='get_category_display')
    
    class Meta:
        model = SpendwiseBasicDetails
        fields = ('category','price')

class DayExpenseSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source='get_category_display')
    date = serializers.SerializerMethodField()
    
    def get_date(self,obj):
        try:
            return obj.date.strftime('%d')
        except:
            return ''
    class Meta:
        model=SpendwiseBasicDetails
        fields=('id','category','reason','price','date')
