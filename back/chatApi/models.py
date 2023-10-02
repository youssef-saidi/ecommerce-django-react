from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.CharField(max_length=500, blank=False)
    password = models.TextField(max_length=500, blank=False)
    role = models.TextField(max_length=500, default="USER")