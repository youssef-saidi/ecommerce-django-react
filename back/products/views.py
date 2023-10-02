from django.shortcuts import render
from django.http import JsonResponse
from products.models import *


def test(request):
    if request.method == 'POST':
        print(request.POST)
        name= request.POST['name']
        print(name)
        response = {
            "message": "error",
            "status" :False
        }
   
        # conn = connexion()
        # cur = conn.cursor()

        # descriptions = []
        # # for row in cur.tables(tableType="TABLE"):
        # #     print(row)
        # fixed_table_name = normalize('Clients')
        # q = f'insert into Clients values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        # values = ('CL008','CLIENT00466557', 'Null', 'Null', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 'None', 3, 'None', 0,'Normal',2,True, True) 
        # # q = f'insert into  Clients values 
        # description = {
        #     "table_name": 'Clients',
        #     "fixed_table_name": fixed_table_name,
        #     "columns": [],
        # }  
        # descriptions.append(description)

        # object=cur.execute(q,values)
        # if object.rowcount > 0:
        #     response = {
        #         "message": "Data inserted successfully!",
        #         "status" :True
        #     }
        #     print("Data inserted successfully!")
        # else:
        #     response = {
        #     "message": "No data was inserted.",
        #     "status" :False
        #     }
        #     print("No data was inserted.")
        # conn.commit()
        # cur.close()
        # try:
        #     conn.close()
        # except Exception as e:
        #     print("Error closing database connection: ", e)

    return JsonResponse(response) 


# Create your views here.
def addProduct(request):
    if request.method == 'POST':
        print(request.POST)
        name= request.POST['name']
        # image= request.POST['image']	
        image="/images/img1.png"
        brand= request.POST['brand']	
        price=	request.POST['price']
        description=request.POST['description']
        maxQuantite=request.POST['maxQuantite']	
        if request.POST['isFeatured']=="false" :
            isFeatured=False 
        else:
            isFeatured=True

        product = Product(name=name,image=image,brand=brand,price=price,description=description,maxQuantity=maxQuantite,isFeatured=isFeatured)
        product.save()
        if product is not None:
            response = {
                "message": "product added successfully",
                "status" :True
            }
            return JsonResponse(response) 
        else:
            response = {
                "message": "error",
                "status" :False
            }

            return JsonResponse(response)
        
    else:
        response = {
            "message": "Request is not allowed !",
            "status" :False
        }

        return JsonResponse(response)


def editProduct(request):
    if request.method == 'POST':
        try:
            idProduct=request.POST['idProduct']
            name= request.POST['name']
            # image= request.POST['image']
            image="/images/img1.png"	
            brand= request.POST['brand']	
            price=	request.POST['price']
            description=request.POST['description']
            maxQuantite=request.POST['maxQuantity']	
            if request.POST['isFeatured']=="false" :
                isFeatured=False 
            else:
                isFeatured=True
            product=Product.objects.get(id=idProduct)[:6]
            print(product)
            Product.objects.filter(id=idProduct).update(name=name,image=image,brand=brand,price=price,description=description,maxQuantite=maxQuantite,isFeatured=isFeatured)
            
            
            response = {
                "message": "product updated successfully",
                "status" :True
            }
            return JsonResponse(response) 
            
        except Product.DoesNotExist:
            print("Product with id "+ idProduct +" does not exist.")  
            response = {
                "message": "Product with id "+ idProduct +"does not exist.",
                "status" :False
            }
            return JsonResponse(response)       
        
    else:
        response = {
            "message": "Request is not allowed !",
            "status" :False
        }

        return JsonResponse(response)

def removeProduct(request):
    if request.method == 'POST':
        try:
            idProduct=request.POST['idProduct']

            product=Product.objects.get(id=idProduct)
            product.delete()
            
            
            response = {
                "message": "product deleted successfully",
                "status" :True
            }
            return JsonResponse(response) 
            
        except Product.DoesNotExist:
            print("Product with id "+ idProduct +" does not exist.")  
            response = {
                "message": "Product with id "+ idProduct +"does not exist.",
                "status" :False
            }
            return JsonResponse(response)       
        
           

    else:
        response = {
            "message": "Request is not allowed !",
            "status" :False
        }

        return JsonResponse(response)



def getFeaturedProducts(request):
    if request.method == 'GET':
        try:
            
            product=Product.objects.filter(isFeatured=True)[:6]
            print(list(product.values()))
            data = list(product.values())
            
            
            response = {
                "data": data,
                "status" :True
            }
            return JsonResponse(response) 
            
        except Product.DoesNotExist:
            response = {
                "message": "no featured product",
                "status" :False
            }
            return JsonResponse(response)       
        
    else:
        response = {
            "message": "Request is not allowed !",
            "status" :False
        }

        return JsonResponse(response)   

def getRecommendedProducts(request):

    if request.method == 'GET':
        try:
            
            product=Product.objects.filter(isFeatured=False)[:6]
            data = list(product.values())
            
            
            response = {
                "data": data,
                "status" :True
            }
            return JsonResponse(response) 
            
        except Product.DoesNotExist:
            response = {
                "message": "no featured product",
                "status" :False
            }
            return JsonResponse(response)       
        
    else:
        response = {
            "message": "Request is not allowed !",
            "status" :False
        }

        return JsonResponse(response)    


def getProducts(request):

    if request.method == 'GET':
        try:
            
            product=Product.objects.all()[:50]
            data = list(product.values())
            
            
            response = {
                "data": data,
                "status" :True
            }
            return JsonResponse(response) 
            
        except Product.DoesNotExist:
            response = {
                "message": "no products",
                "status" :False
            }
            return JsonResponse(response)       
        
    else:
        response = {
            "message": "Request is not allowed !",
            "status" :False
        }

        return JsonResponse(response)   



def getProduct(request):

    if request.method == 'GET':
        try:
            idProduct=request.GET['id']
            print(idProduct)

            product=Product.objects.filter(id=idProduct).values()
            print(product)
            data = list(product)
            
            
            response = {
                "data": data,
                "status" :True
            }
            return JsonResponse(response) 
            
        except Product.DoesNotExist:
            response = {
                "message": "no products",
                "status" :False
            }
            return JsonResponse(response)       
        
    else:
        response = {
            "message": "Request is not allowed !",
            "status" :False
        }

        return JsonResponse(response) 