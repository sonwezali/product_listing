from django.http import JsonResponse
from .models import Product
import requests

def get_gold_price():
    # Example using a free gold price API
    try:
        response = requests.get('https://data-asg.goldprice.org/json/usd')
        data = response.json()
        return data['items'][0]['price']
    except:
        # Fallback price if API fails
        return 64.77  # Example gold price per gram

def product_list(request):
    # Ensure products are loaded
    if Product.objects.count() == 0:
        Product.load_from_json()

    products = Product.objects.all()
    gold_price = get_gold_price()

    product_list = []
    for product in products:
        # Price calculation as per requirements
        price = round((product.popularity_score + 1) * product.weight * gold_price, 2)
        
        product_data = {
            'name': product.name,
            'popularityScore': product.popularity_score,
            'normalizedPopularityScore': round(product.popularity_score / 20, 1),
            'weight': product.weight,
            'price': price,
            'images': {
                'yellow': product.yellow_image,
                'rose': product.rose_image,
                'white': product.white_image
            }
        }
        product_list.append(product_data)
    
    return JsonResponse(product_list, safe=False)