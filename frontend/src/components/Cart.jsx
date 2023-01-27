import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import CheckoutPaypal from "./CheckoutPaypal";

import {
  addToCart,
  clearCart,
  decreaseCart,
  getTotals,
  removeFromCart,
} from "../slices/cartSlice";
import { BiHome } from "react-icons/bi";

import { Link } from "react-router-dom";
import PayButton from "./PayButton";
import FadeIn from "react-fade-in/lib/FadeIn";
import { Breadcrumbs } from "@mui/material";

const initialOptions = {
  "client-id": "AZULZj3b1W-Do6EC0evzv4R9azDkHklA5uiA4yy8VGVvck69AnMHEdTL5RGtT7QsBiNTVF6K57MNIL84",
  currency: "EUR",
  intent: "capture",
}

const Cart = () => {
  const cart = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  // const navigate = useNavigate();

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };
  const handleDecreaseCart = (product) => {
    dispatch(decreaseCart(product));
  };
  const handleRemoveFromCart = (product) => {
    dispatch(removeFromCart(product));
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  return (
    <div className="cart-container">
      {cart.cartItems.length === 0 ? (
        <div className="cart-empty">
          <FadeIn>
          <p>Your shopping cart is empty</p>
          <div className="start-shopping">
            <Link to="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                fill="currentColor"
                className="bi bi-arrow-left"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
              <span>View products</span>
            </Link>
          </div>
          </FadeIn>
        </div>
      ) : (
        <>
        <Breadcrumbs className="breadcrumbs">
          <Link to="/"><BiHome /></Link>
          <Link className="breadcrumbs-a" to="/cart">Cart</Link>
        </Breadcrumbs>
        <div className="cart">
          
          <div className="titles">
            <h3 className="product-title">Product</h3>
            <h3 className="price">Price</h3>
            <h3 className="quantity">Amount</h3>
            <h3 className="total">Total</h3>
          </div>
          <div className="cart-items">
            <FadeIn>
            {cart.cartItems &&
              cart.cartItems.map((cartItem) => (
                <div className="cart-item" key={cartItem._id}>
                  <div className="cart-product">
                    <Link to={"/product/" + cartItem._id}>
                      <img src={cartItem.image?.url} alt={cartItem.name} />
                    </Link>
                    <div>
                      <h3>{cartItem.name}</h3>
                    </div>
                  </div>
                  <div className="cart-product-price">€{cartItem.price.toLocaleString('nl-nl', { maximumFractionDigits: 2, minimumFractionDigits: 2})}</div>
                  <div className="cart-product-quantity">
                    <button onClick={() => handleDecreaseCart(cartItem)}>
                      -
                    </button>
                    <div className="count">{cartItem.cartQuantity}</div>
                    <button onClick={() => handleAddToCart(cartItem)}>+</button>
                  </div>
                  <div className="cart-product-total-price">
                    €{(cartItem.price * cartItem.cartQuantity).toLocaleString('nl-nl', { maximumFractionDigits: 2, minimumFractionDigits: 2})}
                  </div>
                </div>
              ))}
              </FadeIn>
          </div>
          <div className="cart-summary">
            <button className="clear-btn" onClick={() => handleClearCart()}>
              Clear shopping cart
            </button>
            <div className="cart-checkout">
              <div className="subtotal">
                <span>Subtotal</span>
                <span className="amount">€{cart.cartTotalAmount.toLocaleString('nl-nl', { maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
              </div>
              <p>Taxes and shipping charges are calculated at checkout</p>
              <PayButton cartItems={cart.cartItems} />
              <PayPalScriptProvider cartTotalAmount={cart.cartTotalAmount} options={initialOptions}>
                <CheckoutPaypal cartItems={cart.cartItems}/>
              </PayPalScriptProvider>

              <div className="continue-shopping">

                <Link to="/">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    className="bi bi-arrow-left"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                    />
                  </svg>
                  <span>Continue shopping</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Cart;
