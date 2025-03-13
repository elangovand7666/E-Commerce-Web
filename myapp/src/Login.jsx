import { useState } from "react";
import axios from "axios";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";


const Login = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const videos = "/backvideo.mp4";

    // ✅ Send OTP to email
    const sendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/send-otp/",
                { email }, // Data sent
                { headers: { "Content-Type": "application/json" } } // Ensure JSON
            );
            enqueueSnackbar(response.data.message || "OTP sent successfully!", { variant: "success" });
            setOtpSent(true);
        } catch (error) {
            console.error("❌ Error sending OTP:", error.response?.data);
            enqueueSnackbar("Failed to send OTP. Try again.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };
    
    // ✅ Verify OTP and login
    const verifyOtp = async (e) => {
        e.preventDefault();

        if (!otp) {
            enqueueSnackbar("Please enter the OTP.", { variant: "warning" });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/verify-otp/", { email, otp });
            enqueueSnackbar(response.data.message || "Login successful!", { variant: "success" });
            navigate(`/Domain/${email}`);
        } catch (error) {
            enqueueSnackbar("Invalid or expired OTP.", { variant: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SnackbarProvider maxSnack={2}>
            <video autoPlay muted loop className="background-video">
                <source src={videos} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
            <div className="login-container">
                <h1 class="Cato2">Ziya Store</h1>

                {!otpSent ? (
                    <form onSubmit={sendOtp} className="otp-form">
                        <h2 className='Cato2'>Email</h2>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Enter Your Email"
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Sending OTP..." : "Get OTP"}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={verifyOtp} className="otp-form">
                        <h2 className='Cato'>Enter OTP</h2>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            required
                            placeholder="Enter OTP"
                            disabled={loading}
                        />
                        <button type="submit" disabled={loading}>
                            {loading ? "Verifying..." : "Login"}
                        </button>
                    </form>
                )}
            </div>
        </SnackbarProvider>
    );
};

export default Login;
