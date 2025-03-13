import { useState } from "react";
import './App.css';
import axios from 'axios';
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import './Seller.css';

function Seller() {
  const [img, setImg] = useState(null);
  const [name, setName] = useState("");
  const [dis, setDis] = useState("");
  const [price, setPrice] = useState("");
  const [store, setStore] = useState("");
  const [count, setCount] = useState("");
  const videoSrc = '/backvideo.mp4';

  const handleImageChange = (e) => {
    setImg(e.target.files[0]); // Store the selected image in state
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", dis);
    formData.append("price", price);
    formData.append("store", store);
    formData.append("count", count);

    if (img) {
      formData.append("img", img);
    } else {
      console.error("No image selected!");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/add/", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      console.log(response.data);
      enqueueSnackbar('Product Attached Successfully', { variant: "success" });
    } catch (error) {
      console.error("Error saving product", error);
    }
  };

  return (
    <SnackbarProvider maxSnack={1}>
      <video autoPlay muted loop className="video-bg">
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="navbar-container">
        <img src="/src/assets/123.png" alt="Store Logo" className="navbar-logo" />
        <h2 className="store-title">Ziya Store</h2>
      </div>
      <h2 className="section-heading">Product Seller</h2>
      <form onSubmit={handleSubmit} className="form-container" encType="multipart/form-data">
        <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
        <input type="text" placeholder="Product Name" value={name} onChange={(e) => setName(e.target.value)} className="input-field" />
        <input type="text" placeholder="Description" value={dis} onChange={(e) => setDis(e.target.value)} className="input-field" />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field" />
        <input type="text" placeholder="Store Name" value={store} onChange={(e) => setStore(e.target.value)} className="input-field" />
        <input type="number" placeholder="Count" value={count} onChange={(e) => setCount(e.target.value)} className="input-field" />
        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </SnackbarProvider>
  );
}

export default Seller;
