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
    date = serializers.SerializerMethodField()
    
    def get_date(self,obj):
        return obj.date.strftime('%d-%m-%Y')
    
    class Meta:
        model = SpendwiseBasicDetails
        fields = ('date','reason','price')
