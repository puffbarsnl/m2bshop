import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

import Home from "./components/Home";
import NavBar from "./components/NavBar";
import NotFound from "./components/NotFound";
import Cart from "./components/Cart";

import React, { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import ProductsPage from "./components/ProductsPage";
import { useDispatch } from "react-redux";
import { loadUser } from "./slices/authSlice";
import CheckoutSuccess from "./components/CheckoutSuccess";
import Dashboard from "./components/admin/Dashboard";
import Products from "./components/admin/Products";
import Users from "./components/admin/Users";
import Orders from "./components/admin/Orders";
import Summary from "./components/admin/Summary";
import CreateProduct from "./components/admin/CreateProduct";
import ProductsList from "./components/admin/lists/ProductsList";
import Product from "./components/Details/Product";
import UserProfile from "./components/Details/UserProfile";
import Order from "./components/Details/Order";
import UserOrders from "./components/Details/UserOrders";
import Klantenservice from "./components/Klantenservice";
import FAQ from "./components/info/FAQ";
import Footer from "./components/Footer";
import ScrollToTop from "./ScrollToTop";
// import Privacybeleid from "./components/info/Privacybeleid";
import Retourbeleid from "./components/info/Retourbeleid";
import Verzendbeleid from "./components/info/Verzendbeleid";
import Algemenevoorwaarden from "./components/info/Algemenevoorwaarden";
import Reviews from "./components/admin/Reviews";
import Server from "./components/admin/Server";
import Ips from "./components/admin/Ips";
import MailList from "./components/admin/MailingList";
import Contact from "./components/admin/Contact";

// const initialOptions = {
//   "client-id": "Ae4Yr0-ydoK23Ujy5BDUK-iznEzBN8SpgoxforBS15e-hA6cPFC8p8sWEmPXcrGZwMvSCHT5ydH0dvVW",
//   currency: "EUR",
//   intent: "capture",
// }

function App() {
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(loadUser(null));
  }, [dispatch]);

  return (
		<div className="App">
			<Toaster position="bottom-left" toastOptions={{ duration: 5000, error: { duration: 20000 }, style: { background: "#333", color: "#fff"} }}/>
      <BrowserRouter>
				<ScrollToTop />
				{/* {statement && <Statement />} */}
        <NavBar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout-success" element={<CheckoutSuccess />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/order/:id" element={<Order />} />
						<Route path="/orders" element={<UserOrders />} />
						<Route path="/customer-service" element={<Klantenservice />} />
						<Route path="/faq" element={<FAQ />} />
						{/* <Route path="/privacy-beleid" element={<Privacybeleid />} /> */}
						<Route path="/return-policy" element={<Retourbeleid />} />
						<Route path="/shipping-policy" element={<Verzendbeleid />} />
						<Route path="/terms-and-conditions" element={<Algemenevoorwaarden />} />
            <Route path="/user/:id" element={<UserProfile />} />
            <Route path="/admin" element={<Dashboard />}>
              <Route path="summary" element={<Summary />} />
              <Route path="products" element={<Products />}>
                <Route index element={<ProductsList />} />
                <Route path="create-product" element={<CreateProduct />} />
              </Route>
              <Route path="users" element={<Users />} />
              <Route path="orders" element={<Orders />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="mailing-list" element={<MailList />} />
              <Route path="contact" element={<Contact />} />
              <Route path="server" element={<Server />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
				<Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
