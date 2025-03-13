import { useEffect, useState } from "react";
import axios from "axios";
import './App.css'
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useNavigate, useParams,Link } from "react-router-dom";

const Register = () => {
    const videos='/backvideo.mp4'
    const { email } = useParams();
    const [user, setUser] = useState({
        name: "",
        email: email, // Pre-fill with email from params
        location: "",
        phone: ""
    });

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/profile/${email}/`)
            .then((res) => {
                setUser(res.data);
            })
            .catch((err) => console.error("Error fetching user data:", err));
    }, [email]); // Dependency array
    
    const handleRegister = (e) => {
        e.preventDefault();
        setLoading(true);
        axios.post(`http://127.0.0.1:8000/profileupdate/${email}/`, user)
            .then(() => {
                enqueueSnackbar("Profile Details Updated Successfully", { variant: "success" });
                navigate(`/home/${email}`);
            })
            .catch((error) => {
                enqueueSnackbar("Error updating profile", { variant: "error" });
            })
            .finally(() => setLoading(false));
    };
    return (
        <SnackbarProvider maxSnack={2}>
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
            <div className="register-container">
                <h1 className='Cato'>Register</h1>
                <form onSubmit={handleRegister} className="register-form">
                    <h2>Name</h2>
                    <input
                        type="text"
                        value={user.name}
                        onChange={(e) => setUser({ ...user, name: e.target.value })}
                        required
                        placeholder="Enter Your Name"
                    />

                    <h2>Email</h2>
                    <input
                        type="email"
                        value={user.email}
                        readOnly
                        disabled
                    />

                    <h2>Location</h2>
                    <input
                        type="text"
                        value={user.location}
                        onChange={(e) => setUser({ ...user, location: e.target.value })}
                        required
                        placeholder="Enter Your Location"
                    />

                    <h2>Phone</h2>
                    <input
                        type="number"
                        value={user.phone}
                        onChange={(e) => setUser({ ...user, phone: e.target.value })}
                        required
                        placeholder="Enter Your Phone Number"
                    />
                    <br /><br />

                    <button type="submit" disabled={loading}>
                        {loading ? "Saving..." : "Save"}
                    </button>
                </form>
            </div>
        </SnackbarProvider>
    );
};

export default Register;