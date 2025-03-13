from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import json
import google.generativeai as genai
from pymongo import MongoClient
import gridfs
import smtplib
import random
from bson import ObjectId
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import time
import string
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from bson.objectid import ObjectId
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
import pymongo

# Configure Gemini API
API_KEY = "AIzaSyBUvOCPYGrXUqxol-v_DxoUrLvKN6yIgo4"
genai.configure(api_key=API_KEY)

# MongoDB connection
client = MongoClient("mongodb+srv://es:es7666@cluster0.jjxan.mongodb.net")
database = client['Ayurvedha']
collection = database['products']
collection1=database['user']
fs = gridfs.GridFS(database)

def generate_room_name():
    return ''.join(random.choices(string.ascii_letters + string.digits, k=10))

def create_meeting(request, email1, email2):
    room_name = generate_room_name()
    
    # Django backend URL where frontend is hosted
    frontend_url = "http://localhost:5173"  # Change this to your actual frontend URL

    meeting_link = f"{frontend_url}/meeting/{email1}/{email2}/{room_name}"

    # Send emails to both participants
    subject = "Join Your Video Meeting"
    message = f"Click the link to join the meeting: {meeting_link}"
    sender_email = "mentorconnect2364@gmail.com"  # Replace with your email
    recipient_list = [email1, email2]

    send_email(sender_email, email1,subject, message,"tjvp hbrs vimf vark")
    send_email(sender_email, email2,subject, message,"tjvp hbrs vimf vark")

    return JsonResponse({"room_name": room_name, "meeting_link": meeting_link})
# Fetch all products with image URLs
def get_all_products(request):
    try:
        products = list(collection.find({}))  # Fetch all products

        if not products:
            return JsonResponse({"error": "No products found"}, status=404)

        products_with_images = []
        for product in products:
            product['_id'] = str(product['_id'])  # Convert ObjectId to string
            if 'image_id' in product:
                product['image_url'] = f"http://127.0.0.1:8000/api/products/image/{product['image_id']}"
            else:
                product['image_url'] = None
            products_with_images.append(product)

        return JsonResponse(products_with_images, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

otp_collection = database['otp_storage']  # New collection for storing OTPs

# Function to send email
def send_email(sender_email, receiver_email, subject, body, password):
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = subject
    message.attach(MIMEText(body, "plain"))

    try:
        with smtplib.SMTP("smtp.gmail.com", 587) as server:
            server.starttls()
            server.login(sender_email, password)
            server.sendmail(sender_email, receiver_email, message.as_string())
    except Exception as e:
        print(f"Failed to send email. Error: {str(e)}")

# ✅ Send OTP API
@csrf_exempt
def send_otp(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        print("📩 Received Data:", data)  # Debugging line
        email = data.get("email", "")

        # Generate 6-digit OTP
        otp = str(random.randint(100000, 999999))
        expiry_time = int(time.time()) + 300  # OTP valid for 5 minutes

        # Store OTP in MongoDB
        otp_collection.update_one(
            {"email": email},
            {"$set": {"otp": otp, "expires_at": expiry_time}},
            upsert=True
        )

        # Send OTP via email
        send_email(
            sender_email="mentorconnect2364@gmail.com",
            receiver_email=email,
            subject="Your OTP for Ziya Store",
            body=f"Your OTP is: {otp}\nUse this within 5 minutes. Make You to Healthy Life",
            password="tjvp hbrs vimf vark"
        )

        return JsonResponse({"message": "OTP sent successfully!"})

    except Exception as e:
        print("❌ Error:", str(e))  # Debugging line
        return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt
def profile(request, email=None):
    if request.method == "GET":
        print(email)
        if email is None:
            return JsonResponse({"error": "Email is required"}, status=400)

        user = collection1.find_one({"email": email})

        if not user:
            return JsonResponse({"success": "User not found"}, status=200)

        return JsonResponse({
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "location": user.get("location", ""),
            "phone": user.get("phone", ""),
        })

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def profileupdate(request, email):  # Use email from URL
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)  # Parse JSON request body
        print("Received Data:", data)

        if not email:
            return JsonResponse({"error": "Email is required"}, status=400)

        update_data = {k: v for k, v in data.items() if v is not None}
        if not update_data:
            return JsonResponse({"error": "No valid data provided for update"}, status=400)

        # Check if user exists
        user = collection1.find_one({"email": email})

        if user:
            # Update existing user
            collection1.update_one({"email": email}, {"$set": update_data})
            return JsonResponse({"message": "Profile updated successfully"})
        else:
            # Insert new user
            new_user = {"email": email, **update_data}
            collection1.insert_one(new_user)
            return JsonResponse({"message": "New profile created successfully"})

    except Exception as e:
        print("Error:", str(e))
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def feedback(request, email=None, product_id=None):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            feedback_text = data.get("feed")

            if not feedback_text:
                return JsonResponse({"error": "Feedback cannot be empty"}, status=400)

            # Convert product_id to ObjectId
            try:
                product_oid = ObjectId(product_id)
            except Exception:
                return JsonResponse({"error": "Invalid product ID"}, status=400)

            # Check if product exists
            product = collection.find_one({"_id": product_oid})
            if not product:
                return JsonResponse({"error": "Product not found"}, status=404)

            # Add feedback to the product's feedbacks array
            result = collection.update_one(
                {"_id": product_oid},
                {"$push": {"feedbacks": {"email": email, "feedback": feedback_text}}}
            )

            # Check if the update was successful
            if result.modified_count == 0:
                return JsonResponse({"error": "Failed to add feedback"}, status=500)

            return JsonResponse({"message": "Feedback saved successfully"})

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def get_cart(request, email=None):
    if request.method == "GET":
        try:
            user = collection1.find_one({"email": email}, {"cart": 1, "_id": 0})
            if not user or "cart" not in user:
                return JsonResponse({"cart": []})  # Empty cart

            # Convert product IDs to ObjectId
            product_ids = [ObjectId(pid) for pid in user["cart"]]

            # Fetch product details
            products = list(collection.find({"_id": {"$in": product_ids}}))

            # Convert ObjectId to string for JSON response
            for product in products:
                product["_id"] = str(product["_id"])
                if "image_id" in product:  # Fix: Check for "image_id"
                    product["image_url"] = f"http://127.0.0.1:8000/api/products/image/{product['image_id']}"
                else:
                    product["image_url"] = None  # Fallback if no image

            return JsonResponse({"cart": products})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def add_to_cart(request, email=None):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            product_id = data.get("product_id")
            print(data)

            if not product_id:
                return JsonResponse({"error": "Product ID is required"}, status=400)

            # Check if user exists
            user = collection1.find_one({"email": email})
            if not user:
                return JsonResponse({"error": "User not found"}, status=404)

            # Ensure the 'cart' field exists as an array
            if "cart" not in user or not isinstance(user["cart"], list):
                collection1.update_one({"email": email}, {"$set": {"cart": []}})

            # Check if the product is already in the cart to avoid duplicates
            if product_id in user.get("cart", []):
                return JsonResponse({"message": "Product already in cart"})

            # Add product to cart
            collection1.update_one(
                {"email": email},
                {"$push": {"cart": product_id}}
            )

            return JsonResponse({"message": "Product added to cart successfully"})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@csrf_exempt
def verify_otp(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        data = json.loads(request.body)
        email = data.get("email", "")
        otp = data.get("otp", "")

        if not email or not otp:
            return JsonResponse({"error": "Email and OTP are required"}, status=400)

        # Retrieve stored OTP from MongoDB
        stored_otp_data = otp_collection.find_one({"email": email})

        if not stored_otp_data:
            return JsonResponse({"error": "OTP not found. Please request a new one."}, status=400)

        stored_otp = stored_otp_data.get("otp", "")
        expires_at = stored_otp_data.get("expires_at", 0)

        # Check if OTP matches and is not expired
        if otp == stored_otp and int(time.time()) < expires_at:
            return JsonResponse({"message": "OTP verified successfully!", "email": email})
        else:
            return JsonResponse({"error": "Wrong or expired OTP. Please try again."}, status=400)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt  # Disable CSRF for simplicity (remove in production)
def get_search(request, message=None):
    try:
        if not message:
            return JsonResponse({"error": "No search term provided"}, status=400)

        search_terms = message.lower().split()  # Convert to lowercase and split
        products = list(collection.find({}))  # Fetch all products (optimize this in future)

        matching_products = [
            product for product in products
            if any(term in product.get('name', '').lower() for term in search_terms)
        ]

        if not matching_products:
            return JsonResponse({"error": "No products found"}, status=404)

        # Convert ObjectId to string and add image URLs
        for product in matching_products:
            product['_id'] = str(product['_id'])
            if 'image_id' in product:
                product['image_url'] = f"http://127.0.0.1:8000/api/products/image/{product['image_id']}"
            else:
                product['image_url'] = None

        return JsonResponse(matching_products, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
@csrf_exempt
def get_products(request, product_id=None):
    try:
        query = {}  # Default to getting all products
        if product_id:
            try:
                query = {"_id": ObjectId(product_id)}  # Convert to ObjectId
            except Exception:
                return JsonResponse({"error": "Invalid product ID format"}, status=400)

        products = list(collection.find(query))

        if not products:
            return JsonResponse({"error": "No products found"}, status=404)

        products_with_images = []
        for product in products:
            product['_id'] = str(product['_id'])  # Convert ObjectId to string
            product['image_url'] = f"http://127.0.0.1:8000/api/products/image/{product['image_id']}" if 'image_id' in product else None
            products_with_images.append(product)

        return JsonResponse(products_with_images[0] if product_id else products_with_images, safe=False, status=200)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
def get_product_image(request, image_id):
    try:
        print(f"🔍 Fetching image with ID: {image_id}")

        file = fs.get(ObjectId(image_id))  # Fetching image from GridFS
        if not file:
            print("❌ No file found in GridFS")
            return JsonResponse({"error": "Image not found"}, status=404)

        response = HttpResponse(file.read(), content_type="image/jpeg")
        response['Content-Disposition'] = 'inline; filename="image.jpg"'
        return response

    except Exception as e:
        print(f"❌ Error fetching image: {e}")
        return JsonResponse({"error": "Image not found"}, status=404)

# Chatbot API
@csrf_exempt
def chat(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            user_message = data.get("message", "")

            if not user_message:
                return JsonResponse({"error": "No message provided"}, status=400)

            model = genai.GenerativeModel("gemini-1.5-flash")
            response = model.generate_content([{"role": "user", "parts": [{"text": user_message}]}])

            # Debugging: Print the full API response
            print("Gemini API Response:", response)

            # Extracting correct response format
            if response and response.candidates:
                bot_reply = response.candidates[0].content.parts[0].text
                return JsonResponse({"reply": bot_reply})

            return JsonResponse({"reply": "I'm not sure how to respond."})

        except Exception as e:
            print("Error:", str(e))
            return JsonResponse({"error": "Internal Server Error"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=405)

@csrf_exempt
def add_product(request):
    client = pymongo.MongoClient("mongodb+srv://es:es7666@cluster0.jjxan.mongodb.net/Ayurvedha")
    db = client.Ayurvedha
    fs = gridfs.GridFS(db)

    if request.method == "POST":
        try:
            print("🔹 Received Data:", request.POST.dict())   
            print("🔹 Received Files:", request.FILES)      

            name = request.POST.get("name")
            description = request.POST.get("description")
            price = request.POST.get("price")
            store = request.POST.get("store")
            count = request.POST.get("count")
            print(name,store)

            if not all([name, description, price, store, count]):
                print("❌ Missing Fields!")
                return JsonResponse({"error": "Missing fields"}, status=400)

            image = request.FILES.get("img")
            if image:
                image_id = fs.put(image.read(), filename=image.name)
                print(f"✅ Image uploaded with ID: {image_id}")  # Debugging log
            else:
                print("❌ No image uploaded")


            price = float(price)
            count = int(count)

            image = request.FILES["img"]
            image_id = fs.put(image.read(), filename=image.name)

            product = {
                "name": name,
                "description": description,
                "price": price,
                "store": store,
                "count": count,
                "image_id": str(image_id)  # ✅ Convert image ID to string
            }

            inserted_product = db.products.insert_one(product)
            product_id = str(inserted_product.inserted_id)  # ✅ Convert ObjectId to string

            return JsonResponse({"message": "Product saved successfully", "id": product_id}, status=201)

        except Exception as e:
            print(f"❌ Error: {str(e)}")   
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=400)

