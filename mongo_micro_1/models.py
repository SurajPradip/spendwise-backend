from django.db import models

class UserProfile(models.Model):
    profile_id = models.CharField(max_length=200,unique=True)
    name = models.CharField(max_length=200)
    age = models.IntegerField()

    def __str__(self) -> str:
        return self.name

class CategoryChoices(models.IntegerChoices):
    FOOD = 1, "Food"
    TRANSPORTATION = 2, "Transportation"
    ENTERTAINMENT = 3, "Entertainment",
    HEALTH = 4, "Health",
    OTHERS = 5, "Others"

class SpendwiseBasicDetails(models.Model):
    date = models.DateTimeField()
    reason = models.CharField(max_length=200)
    category = models.IntegerField(default=CategoryChoices.FOOD,choices=CategoryChoices.choices)
    price = models.FloatField()
    
    def __str__(self) -> str:
        return f'{self.reason}-{self.price}'