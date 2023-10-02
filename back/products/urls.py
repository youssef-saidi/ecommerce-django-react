from django.urls import path 
from . import views
from django.views.decorators.csrf import csrf_exempt


#URLConf
urlpatterns= [
    path("addProduct/",csrf_exempt(views.addProduct)),
    path("editProduct/",csrf_exempt(views.editProduct)),
    path("removeProduct/",csrf_exempt(views.removeProduct)),
    path("featuredProducts/",csrf_exempt(views.getFeaturedProducts)),
    path("recommendedProducts/",csrf_exempt(views.getRecommendedProducts)),
    path("all/",csrf_exempt(views.getProducts)),
    path("single/",csrf_exempt(views.getProduct)),


    

    


    

]