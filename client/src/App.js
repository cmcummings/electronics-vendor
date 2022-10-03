import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Account from "./Account";
import AllProducts from "./AllProducts";
import ProductPurchase from "./ProductPurchase";
import PurchaseHistory from "./PurchaseHistory";
import Product from "./Product";
import Login from "./Login";
import NavBar from "./Navbar";
import axios from 'axios';

function App() {
  function logout() {
    localStorage.removeItem("email");
    window.location.reload(false);
  }

  function login(email, callback) {
    if (email.length > 40) {
      callback({success: false, msg: "Email length exceeded 40 characters."});
    } else if (!email.match("[a-zA-Z0-9]+@[a-z]+.[a-z]{2,}")) {
      callback({success: false, msg: "Invalid email."});
    } else {
      axios.get('http://localhost:9000/login?email=' + email).then(res => {
        if (res.status === 200) {
          localStorage.setItem("email", email);
          callback({success: true});
        } else{
          callback({success: false, msg: "Server error."});
        }
      });
    }

    return {success: false};
  }

  function isLoggedIn() {
    return localStorage.getItem("email") !== null;
  }

  return (
    <BrowserRouter>
      <NavBar/>
        <Routes>
          <Route exact path = "/" element = {<AllProducts />} />
          <Route path = "/account" element = {isLoggedIn() ? <Account logout={logout} /> : <Navigate replace to="/login" />} />
          <Route path = "/product/purchase/:id" element = {<ProductPurchase />} />
          <Route path = "/login" element={isLoggedIn() ? <Navigate replace to="/account"/> : <Login login={login} />} />
          <Route path = "/history" element = {isLoggedIn() ? <PurchaseHistory /> : <Navigate replace to="/login?r=history" /> } />
          <Route path = "/product/:id" element = {<Product />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
