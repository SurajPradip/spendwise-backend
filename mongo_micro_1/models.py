from django.db import models

class UserProfile(models.Model):
    profile_id = models.CharField(max_length=200,unique=True)
    name = models.CharField(max_length=200)
    age = models.IntegerField()

    def __str__(self) -> str:
        return self.name

class CategoryChoices(models.IntegerChoices):
    FOOD = 1, "Food"
    APARTMENT = 2, "Apartment"
    PETROL = 3, "Petrol",
    REGRET = 4, "Regret",
    LUXURY = 5, "Luxury",
    OTHERS = 6 , "Others",
    INVESTMENT = 7, "Investment",
    HOME = 8 , "Home",
    DEBT = 9 ,"Debt",
    TRAVEL = 10 ,"Travel",
    SELF_CARE = 11 , "Self Care",
    DONATIONS = 12 , "Donations"

class SpendwiseBasicDetails(models.Model):
    date = models.DateTimeField()
    reason = models.CharField(max_length=200)
    category = models.IntegerField(default=CategoryChoices.FOOD,choices=CategoryChoices.choices)
    price = models.FloatField()
    s_faction = models.FloatField(default=2.5)
    is_active = models.BooleanField(default=True)
    
    def __str__(self) -> str:
        return f'{self.reason}-{self.price}'