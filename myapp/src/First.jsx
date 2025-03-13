import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import chatbot from './assets/chatbot.jpg';
import { Link, useNavigate, useParams } from 'react-router-dom';

function First() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const {email}=useParams();
  const videos='/backvideo.mp4'

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/products/");
        setProducts(res.data || []);  // Ensure data is always an array
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]); // Fallback to empty array
      }
    };

    fetchProducts();
  }, []);

  // ✅ Make search function async
  const seasss = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/search/${search}`);
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  // ✅ Correct the navigate function
  const handleProductClick = (product) => {
    navigate(`/detail/${product._id}`);
  };

  return (
    <>
    <video autoPlay muted loop className="background-video">
                <source src={videos} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
      <div className="top">
        <img src="/123.png" alt="Logo" />
        <h2>Ziya Store</h2>
        <div className="topb">
          <Link to="/login"><button className="topbs">Login</button></Link>
        </div>
      </div>

      {/* ✅ Corrected form */}
      <form onSubmit={seasss} className="search-container">
        <input 
          className="search-input" 
          placeholder='Search your Needs' 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <h1 className='Cato'>Medicines</h1>
      <div className="container">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product._id} className="item" onClick={() => handleProductClick(product)}>
              <img 
                src={product.image_url || "placeholder.jpg"} 
                alt={product.name} 
                width="100" 
              />
              <h2 className="pname">{product.name}</h2>
              <p className="desp">{product.description}</p>
              <h3>₹{product.price}</h3>
              <button className="cart-button">Add to Cart</button>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>

    </>
  );
}

export default First;
