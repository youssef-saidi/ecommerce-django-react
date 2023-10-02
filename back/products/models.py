from django.db import models
from chatApi.models import User
from django.utils import timezone
# Create your models here.



class Product(models.Model):
    name = models.CharField(max_length=50)
    image = models.CharField(max_length=1000)
    brand = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.CharField(max_length=500)
    quantity= models.DecimalField(max_digits=10, decimal_places=1,default=1)
    maxQuantity= models.DecimalField(max_digits=10, decimal_places=1,default=1)
    isFeatured = models.BooleanField(default=True)
    creation_date = models.DateField(default=timezone.now)


class ImageCollection(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)
    creation_date = models.DateField(default=timezone.now) 

class Size(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)
    creation_date = models.DateField(default=timezone.now) 

class Color(models.Model):
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    text = models.CharField(max_length=1000)
    creation_date = models.DateField(default=timezone.now)    


class Basket(models.Model):
    User = models.ForeignKey(User, on_delete=models.CASCADE)
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    creation_date = models.DateField(default=timezone.now)
  

    


