import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import axios from "axios";
import { setHeaders, url } from "../../slices/api";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../slices/authSlice";

const UserProfile = () => {
  const params = useParams();
  const dispatch = useDispatch();


  const [user, setUser] = useState({
    name: "",
    email: "",
    isAdmin: false,
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${url}/users/find/${params.id}`,
          setHeaders()
        );

        setUser({ ...res.data, password: "" });
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, [params.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setUpdating(true);
      const res = await axios.put(
        `${url}/users/${params.id}`,
        {
          ...user,
        },
        setHeaders()
      );

      setUser({ ...res.data, password: "" });
      setUpdating(false);
    } catch (err) {
      console.log(err);
      setUpdating(false);
    }
  };

  return (
    <StyledProfile>
      <ProfileContainer>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3>User profile</h3>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
							required
            />
            <label htmlFor="email">E-mail:</label>
            <input
              type="text"
              id="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
							required
            />
            <label htmlFor="password">New Password:</label>
            <input
              type="text"
              value={user.password}
              id="password"
              onChange={(e) => setUser({ ...user, password: e.target.value })}
							required
            />
            <button>{updating ? "Updating..." : "Update"}</button>
            <button onClick={() => {dispatch(logoutUser(null));window.location = "/";}}  className="uitloggen">Logout</button>
          </form>
        )}
      </ProfileContainer>
    </StyledProfile>
  );
};

export default UserProfile;

const StyledProfile = styled.div`
  margin: 3rem;
  display: flex;
  justify-content: center;
`;

const ProfileContainer = styled.div`
  max-width: 400px;
  width: 100%;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px;

  form {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    button {
      margin-top: 10px;
    }

    .uitloggen {
      background: crimson;
      width: 100%;
    }

    h3 {
      margin-bottom: 0.5rem;
    }

    label {
      margin-bottom: 0.2rem;
			font-size: 15px;
      color: gray;
    }
    input {
      margin-bottom: 1rem;
      border-bottom: 1px solid gray;
      width: 100%;
			padding: 7px 8px;
			font-size: 1.2rem;
			border: 1px solid #d4d4d4;
			border-radius: 5px;
			margin-bottom: 5px;
			&:focus {
				border-color: white;
				outline: 2px solid var(--action);
			}
    }
  }
`;

const Admin = styled.div`
  color: rgb(253, 181, 40);
  background: rgb(253, 181, 40, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
  margin-bottom: 1rem;
`;
const Customer = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgb(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
  margin-bottom: 1rem;
`;
