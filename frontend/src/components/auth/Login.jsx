import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { StyledForm } from "./StyledForm";
import { toast } from "react-hot-toast";
import { tableSortLabelClasses } from "@mui/material";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const auth = useSelector((state) => state.auth);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (auth._id) {
      navigate("/cart");
    }
  }, [auth._id, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(user);
    dispatch(loginUser(user));
  };

  useEffect(() => {
    if(auth.loginStatus === "rejected") {
      toast.error(auth.loginError);
    }
  }, [auth.loginStatus])


  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <h1>Log in op uw account</h1>
        <p>
          Of <Link to="/register">Account aanmaken</Link>
        </p>
        <div>
          <label>E-mailadres</label>
          <input
            type="email"
            onChange={(e) => setUser({ ...user, email: e.target.value })}
          />
        </div>
        <div>
          <label>Wachtwoord</label>
          <input
            type="password"
            onChange={(e) => setUser({ ...user, password: e.target.value })}
          />
        </div>
        <button onClick={(e) => handleSubmit(e)}>
          {auth.loginStatus === "pending" ? "Indienen..." : "Inloggen"}
        </button>
      </StyledForm>
    </>
  );
};

export default Login;
