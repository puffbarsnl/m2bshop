import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { clearCart, getTotals } from "../slices/cartSlice";

const CheckoutSuccess = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  return (
    <Container>
      <h2>Your order is completed.</h2>
      <p>It may take a while for your order to be processed.</p>
			{/* <p style={{background: "#333", color: "#fff", padding: 8, borderRadius: 4}}>MEDEDELING: Vanwege populariteit zijn onze producten over 10-15 dagen op voorraad.</p> */}
      <p>
        For questions, please navigate to:{" "}
        <strong><Link to="/klantenservice">Customer service</Link></strong>
      </p>
      <p>You can check your order status by navigating to: <strong><Link to="/orders">Orders</Link>.</strong></p>
      <br/>
      <p><b>If you did not register/login an account whilst purchasing, you will receive Order updates by E-mail.</b></p>
    </Container>
  );
};

export default CheckoutSuccess;

const Container = styled.div`
  min-height: 80vh;
  max-width: 800px;
  width: 100%;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    margin-bottom: 0.5rem;
    color: var(--action);
  }

  a {
    color: var(--action);
  }
`;
