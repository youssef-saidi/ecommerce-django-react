from django.shortcuts import render
import openai
from django.http import JsonResponse
import os
from chatApi.models import User
from products.models import Product

from django.contrib.auth import authenticate, login,logout
from google.oauth2 import id_token
from google.auth.transport import requests
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import default_storage
import numpy as np
import pickle
# import tensorflow
# from keras.layers import GlobalMaxPooling2D
# from tensorflow.keras.applications.resnet50 import ResNet50, preprocess_input
from sklearn.neighbors import NearestNeighbors
from numpy.linalg import norm
import cv2




@csrf_exempt
def signin(request):
    if request.method == 'POST':
        email = request.POST['email']
        password = request.POST['password']
   
        # user = authenticate(request, name=name, password=password)
        user = authenticate(request, email=email, password=password)
        # data = list(user.values())
       
        if user is not None:
            login(request, user)
            print(user.username)

            data = {
                'id':user.id,
                'username': user.username,
                'email': email,
                'role': user.role,
            # 'last_name': user.last_name,
            }
            response = {
                "data": data,
                "status" :True
            }
            return JsonResponse(response) 
        else:
            response = {
                "message": "error",
                "status" :False
            }

            return JsonResponse(response)
            
    response = {
        "message": "error",
        "status" :False
    }     
    return JsonResponse(response) 


def signup(request):
    if request.method == 'POST':
        name = request.POST['name']
        email = request.POST['email']
        password = request.POST['password']


        
        # check if the email already exists
        if User.objects.filter(email=email).exists():
            response = {
                "message": "Email already exists",
                "status": False
            }
            return JsonResponse(response)

        # create the user
        user = User.objects.create_user(username=name, email=email, password=password)
        user.save()

        # authenticate the user
        user = authenticate(request, username=name, password=password)
        if user is not None:
            login(request, user)
            response = {
                "message": "Signup successful",
                "status": True
            }
            return JsonResponse(response)
        else:
            response = {
                "message": "Error during signup",
                "status": False
            }
            return JsonResponse(response)
    else:
        response = {
            "message": "Invalid request method",
            "status": False
        }
        return JsonResponse(response)




def generate_text(request):
    if request.method == "POST":
    
        SECRET_KEY_OPENAI = os.getenv('SECRET_KEYYY')
        openai.api_key = SECRET_KEY_OPENAI
        name = request.POST.get("NameProduct")
        duration= request.POST.get("Duration")
  
        # + name + " Duration : " + str(duration)
        prompt='i need a marketing plan for each day for my product titled ' + name + " Duration : " + str(duration) + 'days to publish it in social media i need just the days'
        # prompt= 'I wanna a marketing plan of this product: adidas nmd r1, to publish on social media. the plan should be planned on 8 days. Generate some post and slogans to post on facebook. I want the answer coded into html table'

        model_engine = "text-davinci-002"
        completions = openai.Completion.create(
            engine=model_engine,
            prompt=prompt,
            max_tokens=1024,
            n=1,
            stop=None,
            temperature=0.5,
        )
        message = completions.choices[0].text
        
        response = {
            "message": message,
            "status" :True
        }

        # Render the response
        return JsonResponse(response) 
    else:

        response = {
            "message": "error",
            "status" :False

        }
        
        return JsonResponse(response) 

def error(request):
    response = {
        "message": "error",
        "status" :False

    }
        
    return JsonResponse(response) 

def test(request):
    response = {
        "message": "error",
        "status" :True

    }
        
    return JsonResponse(response) 


def google_signin(request):
    token = request.POST.get('token')
    try:
        GOOGLE_CLIENT_ID="597108938911-epftobp6kh9gtv66ah7tano9r4q2jkt2.apps.googleusercontent.com"
        idinfo = id_token.verify_oauth2_token(token, requests.Request(), GOOGLE_CLIENT_ID)
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')
        # Create a session for the authenticated user
        request.session['user'] = idinfo['sub']
        return JsonResponse({'success': True})
    except ValueError:
        return JsonResponse({'success': False})


def auth_status(request):
    if request.user.is_authenticated:
        data = {
            'id':request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'role': request.user.role,
            # 'last_name': user.last_name,
        }
        return JsonResponse({'is_authenticated': True,"data":data})
    else:
        return JsonResponse({'is_authenticated': False ,"data":{}})        


# AI

@csrf_exempt
def upload_photo(request):
    try:    
        indices = []
        features = []
        if request.method == "POST":
            feature_list=np.array(pickle.load(open('chatApi/featurevector.pkl','rb')))
            filename=pickle.load(open('chatApi/filesnames.pkl','rb'))

            model=ResNet50(weights='imagenet', include_top=False, input_shape=(224,224,3))
            model.trainable=False

            model=tensorflow.keras.Sequential([
                model,
                GlobalMaxPooling2D()
            ])

            uploaded_file = request.FILES.get("photo")
            products = []
            if save_uploaded_file(uploaded_file):
                features = extract_feature('uploads/'+uploaded_file.name, model)
                indices = recommend(features, feature_list)
                imgs = []
                for i in indices[0]:
                    imgs.append(filename[i])
                    print(filename[i])
                    
                    prod = Product.objects.get(name=filename[i][5:-4])
                                    
                    products.append({
                        'id': prod.id,
                        'name': prod.name,
                        'price': prod.price,
                        'description': prod.description,
                        'quantity': prod.quantity,
                        'maxQuantity': prod.maxQuantity,
                        'isFeatured': prod.isFeatured,
                        'brand': prod.brand,
                        'image': prod.image,
                        'creation_date': prod.creation_date,
                    })
                print(products)
                return JsonResponse({"message": "Photo uploaded successfully.", "photo": uploaded_file.name,"imgs":imgs, "products": products})
        else:
            return JsonResponse({"message": "Invalid request method."})
    except Product.DoesNotExist:
                    # Handle the case where no matching product was found
        print("hiiiiiiiiiiiiiiii")
        return JsonResponse({"message": "No Product found"})
    pass    
################################

def save_uploaded_file(uploaded_file):
	path = default_storage.save('uploads/'+uploaded_file.name, uploaded_file)
	return path
	

def extract_feature(img_path, model):
    img=cv2.imread(img_path)
    img=cv2.resize(img,(224,224))
    img=np.array(img)
    expand_img=np.expand_dims(img, axis=0)
    pre_img=preprocess_input(expand_img)
    result=model.predict(pre_img).flatten()
    normalized=result/norm(result)
    return normalized

def recommend(features, feature_list):
    neighbors=NearestNeighbors(n_neighbors=5, algorithm='brute', metric="euclidean")
    neighbors.fit(feature_list)
    distance,indices= neighbors.kneighbors([features])
    return indices

