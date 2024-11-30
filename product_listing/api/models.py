from django.db import models
import json
import os

class Product(models.Model):
    name = models.CharField(max_length=200)
    popularity_score = models.FloatField()
    weight = models.FloatField()
    yellow_image = models.URLField()
    rose_image = models.URLField()
    white_image = models.URLField()

    def __str__(self):
        return self.name

    @classmethod
    def load_from_json(cls):
        # First, clear existing products
        cls.objects.all().delete()
        
        # Path to your products.json file
        json_file_path = os.path.join(os.path.dirname(__file__), 'products.json')
        
        try:
            with open(json_file_path, 'r') as file:
                products_data = json.load(file)
            
            for product_data in products_data:
                cls.objects.create(
                    name=product_data['name'],
                    popularity_score=product_data['popularityScore'],
                    weight=product_data['weight'],
                    yellow_image=product_data['images']['yellow'],
                    rose_image=product_data['images']['rose'],
                    white_image=product_data['images']['white']
                )
            print(f"Successfully loaded {len(products_data)} products")
        except Exception as e:
            print(f"Error loading products: {e}")