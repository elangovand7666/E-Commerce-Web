import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import chatbot from "./assets/chatbot.jpg";
import { enqueueSnackbar, SnackbarProvider } from "notistack";

function Product() {
  const videos = "/backvideo.mp4";
  const { product_id, email } = useParams();
  const [product, setProduct] = useState(null);
  const [feed, setFeed] = useState("");
  const [feedbacks, setFeedbacks] = useState([]); // Store feedbacks

  // Fetch Product Details
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/products/${product_id}`);
        setProduct(res.data);
        setFeedbacks(res.data.feedbacks || []); // Fetch and store feedbacks
      } catch (error) {
        console.error("Error fetching product:", error);
        setProduct(null);
      }
    };
    fetchProduct();
  }, [product_id]);

  // Fetch Feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/feedbacks/${product_id}`);
        setFeedbacks(res.data.feedbacks || []);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setFeedbacks([]);
      }
    };
    fetchFeedbacks();
  }, [product_id]);

  // Submit Feedback
  const feedback = async (e) => {
    e.preventDefault();
    if (!feed.trim()) {
      enqueueSnackbar("Please enter feedback", { variant: "warning" });
      return;
    }
    try {
      const res = await axios.post(
        `http://127.0.0.1:8000/feedback/${email}/${product_id}/`,
        { feed },
        { headers: { "Content-Type": "application/json" } }
      );
      enqueueSnackbar(res.data.message || "Feedback Saved", { variant: "success" });
      setFeed(""); // Clear input
      setFeedbacks([...feedbacks, { email, feedback: feed }]); // Update state
    } catch (error) {
      enqueueSnackbar("Error submitting feedback", { variant: "error" });
      console.error("Feedback error:", error);
    }
  };

  const handleAddToCart = async (product_id) => {
    if (!email) {
      alert("User email is missing. Please log in.");
      return;
    }
  
    try {
      const res = await axios.post(`http://127.0.0.1:8000/cart/${email}/`, {
        product_id: product_id,
      });
  
      enqueueSnackbar(res.data.message || "Product added to cart!",{variant:"success"});
    } catch (error) {
      console.error("Error adding to cart:", error);
      enqueueSnackbar("Failed to add product to cart. Please try again.",{variant:"warning"});
    }
  };
  
  
  

  return (
    <SnackbarProvider maxSnack={3}>
      <video autoPlay muted loop className="background-video">
        <source src={videos} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="top">
        <img src="/123.png" alt="" />
        <h2>Ziya Store</h2>
      </div>
      <Link to="/chatbot">
        <button className="chatbot">
          <img src={chatbot} alt="" />
        </button>
      </Link>

      <div className="product-detail">
        {product ? (
          <div key={product._id}>
            <h2 className="cart-prod">Shop : {product.store}</h2>
            <img className="product-img" src={product.image_url || "placeholder.jpg"} alt={product.name} width="100" />
            <h2 className="cart-prod">{product.name}</h2>
            <p className="product-desp">Description : {product.description}</p>
            <h3 className="cart-prod">Price : ₹{product.price}</h3>
            <button className="cart-button" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
          </div>
        ) : (
          <p>Loading product details...</p>
        )}
        <div className="feedback">
          <h2 class="cart">Feedback</h2>
        {/* Feedback Form */}
        <form onSubmit={feedback}>
          <input type="text" value={feed} onChange={(e) => setFeed(e.target.value)} placeholder="Enter feedback" required />
          <button type="submit">Send</button>
        </form>
      

      {/* Print Feedbacks */}
      <h3>Customer Feedback</h3>
        {feedbacks.length > 0 ? (
          feedbacks.map((fb, index) => (
            <p key={index}><strong>{fb.email}:</strong> {fb.feedback}</p>
          ))
        ) : (
          <p>No feedback available yet.</p>
        )}
      </div>
      </div>
    </SnackbarProvider>
  );
}

export default Product;
