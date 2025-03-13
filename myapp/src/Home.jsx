import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import OpenStreetMapComponent from "./OpenStreetMapComponent.jsx";
import chatbot from "./assets/chatbot.jpg";

function Home() {
  const [products, setProducts] = useState([]);
  const [user, setUser] = useState({});
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [clinicLocation, setClinicLocation] = useState("");
  const navigate = useNavigate();
  const { email } = useParams();
  const videos = "/backvideo.mp4";
  const list=["heart,eye,hair,bone"]
  const email_list=["elangovand.22csd@kongu.edu","krishnasamyr.22csd@kongu.edu","hariharans.22csd@kongu.edu","lokeshsm.22csd@kongu.edu"]


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/products/");
        setProducts(res.data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!email) return;
    axios
      .get(`http://127.0.0.1:8000/profile/${email}/`)
      .then((res) => {
        setUser(res.data);
        if (!searchQuery) {
          setSearchQuery(res.data.location || "");
          setClinicLocation(res.data.location || "");
        }
      })
      .catch((err) => console.error("Error fetching user data:", err));
  }, [email]);

  const searchProducts = async (e) => {
    e.preventDefault();
    if (!search.trim()) return;
    try {
      const res = await axios.get(`http://127.0.0.1:8000/api/search/${search}`);
      setProducts(res.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    }
  };

  const searchClinics = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setClinicLocation(searchQuery.trim());
  };

  const handleProductClick = (product) => {
    navigate(`/detail/${email}/${product._id}`);
  };
  const meeting = (value) => {
    navigate(`/meeting/${email}/${email_list[value]}`); // ✅ Use navigate properly
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
          <Link to={`/cart/${email}`}>
            <button className="topbs">Cart</button>
          </Link>
          <Link to={`/profile/${email}`}>
            <button className="topbs">Profile</button>
          </Link>
          <Link to="/">
            <button className="topbs">Logout</button>
          </Link>
        </div>
      </div>

      <Link to="/chatbot">
        <button className="chatbot">
          <img src={chatbot} alt="Chatbot" />
        </button>
      </Link>

      {/* Product Search */}
      <form onSubmit={searchProducts} className="search-container">
        <input
          className="search-input"
          placeholder="Search your Needs"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <h1 className="Cato">Medicines</h1>
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
              <button className="cart-button" onClick={() => handleAddToCart(product._id)}>Add to Cart</button>
            </div>
          ))
        ) : (
          <p>Loading products...</p>
        )}
      </div>
      <h1 className="Cato">Doctors</h1>
      <div class="container">
            <div class="item">
                <img src="/src/assets/d1.jpeg"></img>
                <h2>Heart specialist</h2>
                <p className="desp">Dr. Shobeka, MD - Cardiologist</p>
                <button className="cart-button" onClick={() => meeting(0)}>Connect</button>
              </div> 
              <div class="item">
                <img src="/src/assets/d2.jpeg"></img>
                <h2>Brain Tumour</h2>
                <p className="desp">Dr. Elangovan, MD - Neurologist</p>
                <button className="cart-button" onClick={() => meeting(0)}>Connect</button>
              </div> 
              <div class="item">
                <img src="/src/assets/d3.jpeg"></img>
                <h2>Cancer Doctor</h2>
                <p className="desp">Dr. Hariharan, MD - Oncologist</p>
                <button className="cart-button" onClick={() => meeting(0)}>Connect</button>
              </div> 
              <div class="item">
                <img src="/src/assets/d4.jpeg"></img>
                <h2>Skin specialist</h2>
                <p className="desp">Dr. Krishnasamy, MD - Dermatologist</p>
                <button className="cart-button" onClick={() => meeting(0)}>Connect</button>
              </div>           
        </div>

      {/* Clinic Search */}
      <h1 className="Cato">Clinics</h1>
      <form onSubmit={searchClinics} className="search-container">
        <input
          className="search-input"
          placeholder="Enter a location to find clinics"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="submit" className="search-button">Search</button>
      </form>

      <div className="map-container">
        <OpenStreetMapComponent searchLocation={clinicLocation} />
      </div>
    </>
  );
}

export default Home;