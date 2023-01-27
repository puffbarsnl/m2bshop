import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../slices/authSlice";
import { StyledForm } from "./StyledForm";
import { toast } from "react-hot-toast";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);


  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (auth._id) {
      navigate("/cart");
    }
  }, [auth._id, navigate]);

  // {auth.registerStatus === "rejected" ? (
  //   <p>{auth.registerError}</p>
  // ) : null}

  useEffect(() => {
    if(auth.registerStatus === "rejected") {
      toast.error(auth.registerError);
    }
  }, [auth.registerStatus])
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if(user.confirmPassword === user.password) {
      dispatch(registerUser(user));
    } else {
      toast.error("Wachtwoorden komen niet overeen")
    }
  };

  return (
    <>
      <StyledForm onSubmit={handleSubmit}>
        <h1>Registreer uw account</h1>
        <p>
          Of <Link to="/login">Inloggen</Link>
        </p>
        <div>
          <label>Volledige naam</label>
          <input
            type="text"
            onChange={(e) => setUser({ ...user, name: e.target.value })}
          />
        </div>
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
        <div>
          <label>Herhaal wachtwoord</label>
          <input
            type="password"
            onChange={(e) => setUser({ ...user, confirmPassword: e.target.value })}
          />
        </div>
        <button>
          {auth.rigisterStatus === "Laden..." ? "Indienen..." : "Registreren"}
        </button>
      </StyledForm>
    </>
  );
};

export default Register;
