import { useParams } from "react-router-dom";
import {Link} from 'react-router-dom';
import './App.css'


function Cussel(){
    const {email}=useParams();
    const videos = "/backvideo.mp4";


    return(
        <>
      <video autoPlay muted loop className="background-video">
        <source src={videos} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <div className="top">
        <img src="/123.png" alt="Logo" />
        <h2>Ziya Store</h2>
      </div>

      <div class="container">
            <div class="item">
                <img src="/src/assets/d1.jpeg"></img>
                <h2>Customer</h2>
                <Link to={`/home/${email}`}><button className="cart-button">Go</button></Link>
              </div> 
              <div class="item">
                <img src="/src/assets/d2.jpeg"></img>
                <h2>Seller</h2>
                <Link to={`/seller`}><button className="cart-button">Go</button></Link>
              </div>         
        </div>

                
    </>
    )
}

export default Cussel