from django.urls import path 
from . import views
from django.views.decorators.csrf import csrf_exempt


#URLConf
urlpatterns= [
    path("marketing/",csrf_exempt(views.generate_text)),
    path('signin/', csrf_exempt(views.signin), name='signin'),
    path('signup/', csrf_exempt(views.signup), name='signup'),
    path('test/', csrf_exempt(views.test), name='test'),
    path('google-signin/', csrf_exempt(views.google_signin), name='google'),
    path('auth_status/', csrf_exempt(views.auth_status), name='auth_status'),
    path("upload-photo/", csrf_exempt(views.upload_photo), name="upload_photo"),


    path('**/', views.error, name='error'),
]