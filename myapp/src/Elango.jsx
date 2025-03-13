import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Home from './Home.jsx';
import Chatbot from './Chatbot.jsx';
import Cart from './Cart.jsx';
import Product from './Product.jsx'
import Login from './Login.jsx'
import Profile from'./Profile.jsx'
import First from './First.jsx'
import Meeting from './Meeting.jsx'
import Cussel from './Cussel.jsx'
import Seller from './Seller.jsx';

function Elango(){
    return(
        <Router>
            <Routes>
            <Route path="/" element={<First/>}></Route>
            <Route path="/login" element={<Login/>}></Route>
            <Route path="/Domain/:email" element={<Cussel/>}></Route>
            <Route path="/seller" element={<Seller/>}></Route>
            <Route path="/profile/:email" element={<Profile />} />
            <Route path="/home/:email" element={<Home />} />
            <Route path='/chatbot' element={<Chatbot/>}></Route>
            <Route path="/cart/:email" element={<Cart/>}></Route>
            <Route path="/detail/:email/:product_id" element={<Product />} />
            <Route path="/meeting/:email1/:email2" element={<Meeting/>}/>
            </Routes>
      </Router>
    )
}

export default Elango