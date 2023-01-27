import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components";
import { logoutUser } from "../slices/authSlice";
import React, { useEffect, useRef, useState } from "react";
import {FaInstagram, FaTiktok, FaRegEnvelope} from "react-icons/fa"

const NavBar = () => {
  const dispatch = useDispatch();
	const [show, setShow] = useState(false);
  const { cartTotalQuantity } = useSelector((state) => state.cart);
  const auth = useSelector((state) => state.auth);
	const userId = useSelector((state) => state.auth._id); 

	const showDropdown = () => {
		setShow(!show);
	}

	const ref = useRef(null);

	useEffect(() => {
		let texts = ref?.current?.children;
		let prev = null;
		const loopText = (curr, currIndex) => {
			let index = (currIndex + 1) % texts.length;
			setTimeout(() => {
				if(prev) {
					prev.className = "";
				}
				curr.className = "show";
				prev = curr;
				loopText(texts[index], index)	
			}, 5000)
		}

		loopText(texts[0], 0);
	}, [])

	// useEffect(() => {
	// 	let prev = null;
	// 	let animate = (curr, currIndex) => {
	// 		let index = (currIndex + 1) % ref.length;
	// 		setTimeout(() => {
	// 			if(prev) {
	// 				prev.className = "";
	// 			}
	// 			curr.className = "show";
	// 			prev = curr;
	// 			animate(ref[index], ref);
	// 		}, 4000);
	// 	}

	// 	animate(ref[0], 0);
	// }, [])
	

	// let prev = null;
	// let animate = (curr, currIndex) => {
	// 	let index = (currIndex + 1) % texts.length
	// 	setTimeout(() => {
	// 		if(prev) {
	// 			prev.className = "";
	// 		} 
	// 		curr.className = "show";
	// 		prev = curr;
	// 		animate(texts[index], index);
	// 	}, 4000);
	// }

	// animate(texts[0], 0);

  return (
		<>
		{/* MOBILE NAVBAR */}
		<nav className="mobile-bar">
			{
				show ? (
					<button onClick={() => showDropdown()}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
					) : (
						<button onClick={() => showDropdown()}><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
				)
			}
			<Link to="/">
        <h2>M2BSHOP</h2>
      </Link>
			<div className="mobile-standard">
			{userId ? (
					<Link to={"/user/" + userId}>
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
					</Link>
					) : (
					<Link to={"/login"}>
						<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
					</Link>
					)}
			<Link to="/cart">
        <div className="nav-bag">
				<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <span className="bag-quantity">
            <span>{cartTotalQuantity}</span>
          </span>
        </div>
      </Link>
			</div>
		</nav>
		<div className={`mobile-links ${show ? "show" : null}`}>
			{auth._id ? (
				<MobileLinks>
					<Link onClick={() => showDropdown()} to="/">
						Home
					</Link>
					<Link onClick={() => showDropdown()} to="/products">
						All Products
					</Link>
					<Link to="/faq">
						FAQ
					</Link>
					<Link onClick={() => showDropdown()} to="/customer-service">
						Customer Service
					</Link>
					{userId && (
						<Link onClick={() => showDropdown()} to="/orders">Orders</Link>
					)}
					{auth.isAdmin ? (
							<Link onClick={() => showDropdown()} to="/admin/summary">Admin</Link>
					) : ""}
					<div
						onClick={() => {
							dispatch(logoutUser(null));
						}}
					>
						Logout
					</div>
				</MobileLinks>
			) : (
				<MobileAuthLinks>
					<Link onClick={() => showDropdown()} to="/">
						Home
					</Link>
					<Link onClick={() => showDropdown()} to="/products">
						All Products
					</Link>
					<Link to="/faq">
						FAQ
					</Link>
					<Link onClick={() => showDropdown()} to="/customer-service">
						Customer Service
					</Link>
				</MobileAuthLinks>
			)}
		</div>

		{/* PC NAVBAR */}
		<nav className="info-bar">
			<div>
				<a target="_blank" rel="norefferer noopener" href="https://instagram.com/m2bshopcom"><FaInstagram /></a>
				<a target="_blank" rel="norefferer noopener" href="https://tiktok.com/@m2bshop"><FaTiktok /></a>
			</div>
			<div ref={ref} className="info-loop">
				<p className="show"><b>Secure</b> checkout with <b>256-bit SSL</b> encryption.</p>
				<p><b>Trusted</b> by over 10.000 satisfied customers.</p>
				<p>30-day money-back <b>guarantee</b> on all products.</p>
			</div>
			<a href="mailto:support@m2bshop.com"><FaRegEnvelope /></a>
		</nav>
    <nav className="nav-bar">
      <Link to="/">
        <h2>M2BSHOP</h2>
      </Link>
			<div className="nav-links">

      {auth._id ? (
        <Links>
					<Link to="/">
						Home
					</Link>
					<Link to="/products">
						All Products
					</Link>
					<Link to="/faq">
						FAQ
					</Link>
					<Link to="/customer-service">
							Customer Service
						</Link>
					{userId && (
						<Link to="/orders">Orders</Link>
					)}
          {auth.isAdmin ? (
              <Link to="/admin/summary">Admin</Link>
          ) : null}
          <a style={{cursor: "pointer"}}
            onClick={() => {
              dispatch(logoutUser(null));
							window.location = "/";
            }}
          >
            Logout
          </a>
        </Links>
      ) : (
        <AuthLinks>
					<Link to="/">
						Home
					</Link>
					<Link to="/products">
						All Products
					</Link>
					<Link to="/faq">
						FAQ
					</Link>
					<Link to="/customer-service">
						Customer Service
					</Link>
        </AuthLinks>
      )}
			</div>
			<div className="standard-links">
				{userId ? (
					<Link to={"/user/" + userId}>
						<svg style={{marginBottom: "5px"}} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
					</Link>
					) : (
						<Link to="/login">
							<svg style={{marginBottom: "5px"}} xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
						</Link>
					)}
				<Link to="/cart">
					<div className="nav-bag">
					<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
						<span className="bag-quantity">
							<span>{cartTotalQuantity}</span>
						</span>
					</div>
				</Link>
			</div>
    </nav>
		</>
  );
};

export default NavBar;

const AuthLinks = styled.div`
  a {
		margin-left: 1.5rem;
		
		&:last-child {
			margin-right: 40px;
		}
  }
`;

const Links = styled.div`
	color: black;
	display: flex;
	justify-content: center;

	div {
		cursor: pointer;
		margin-left: 1.5rem;
		margin-right: 20px;
	}

  a {
		margin-left: 1rem;
	}
`;

const MobileAuthLinks = styled.div`
	display: flex;
	flex-direction: column;
`

const MobileLinks = styled.div`
	display: flex;
	flex-direction: column;

	div {
		color: #202020;
		font-size: 1.5rem;
		padding: 20px 0;
		text-decoration: none;
	}
`
