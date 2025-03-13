import './Cart.css';
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function Cart() {
    const { email } = useParams();
    const [cart, setCart] = useState([]);

    const videos = '/backvideo.mp4';

    useEffect(() => {
        if (!email) return;

        const fetchCart = async () => {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/carted/${email}/`);
                setCart(res.data.cart || []);
            } catch (error) {
                console.error("Error fetching cart data:", error);
            }
        };
        fetchCart();
    }, [email]);

    // Calculate total quantity and amount dynamically
    const totalQty = cart.length;
    const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);

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

            <h2 className="chathead">Cart</h2>
            <div className="total-cart">
                {cart.length > 0 ? (
                    cart.map((item, index) => (
                        <div key={index} className="cart-item">
                            <img src={item.image_url ? item.image_url : "/placeholder.jpg"} alt={item.name} width="100" />
                            <h2>{item.name}</h2>
                            <h3>₹{item.price}</h3>
                        </div>
                    ))
                ) : (
                    <p>Your cart is Loading...</p>
                )}
            </div>

            <div className="total-carts">
                <h1 class="head">Billings</h1>
                <hr></hr>
                <h2>Total Items  :  {totalQty} (product)</h2>
                <h2>Total Amount  :  ₹{totalAmount}</h2>
            </div>
        </>
    );
}

export default Cart;
