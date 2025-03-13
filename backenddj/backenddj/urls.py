"""
URL configuration for backenddj project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from app.views import add_product,create_meeting,get_cart,add_to_cart,get_all_products, get_product_image,chat,get_products,get_search,send_otp,verify_otp,feedback,profile,profileupdate

urlpatterns = [
    path('api/chat/', chat, name="chat"),
    path('api/products/', get_all_products, name='get_all_products'),
    path('api/search/<str:message>/',get_search,name="get_search"),
    path('api/products/<str:product_id>/', get_products, name='get_product_by_id'),
    path('api/products/image/<str:image_id>/', get_product_image, name='get_product_image'),
    path('profile/<str:email>/',profile,name="profile"),
    path('profileupdate/<str:email>/', profileupdate, name="profileupdate"),
    path('send-otp/',send_otp,name="send-otp"),
    path('api/create-meeting/<str:email1>/<str:email2>/', create_meeting, name='create_meeting'),
    path('cart/<str:email>/', add_to_cart, name="add_to_cart"),
    path('carted/<str:email>/', get_cart, name="get_cart"),
    path('feedback/<str:email>/<str:product_id>/', feedback, name='feedback'),
    path('verify-otp/',verify_otp,name="verify-otp"),
    path('api/add/', add_product, name="add_product"),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
