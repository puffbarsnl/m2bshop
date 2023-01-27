import React from "react";
import { Link } from "react-router-dom"

const Footer = () => {
	return (
		<footer className="footer">
				<div className="footer-links">
					<div>
						<h2>Quick Links</h2>
						<Link to="/products">All Products</Link>
						<Link to="/login">Login</Link>
						<Link to="/register">Register</Link>
						<Link to="/cart">Shopping Cart</Link>
						<Link to="/klantenservice">Customer Service</Link>
					</div>
					<div>
						<h2>Info</h2>
						{/* <Link to="/faq">FAQ</Link> */}
						<Link to="/shipping-policy">Shipping Policy</Link>
						<Link to="/return-policy">Return Policy</Link>
						{/* <Link to="/privacy-beleid">Privacybeleid</Link> */}
						{/* <Link to="/algemene-voorwaarden">Algemene voorwaarden</Link> */}
					</div>
					<div>
						<h2>Contact</h2>
						<a href="mailto:support@m2bshop.com">support@m2bshop.com</a>
					</div>
				</div>
				<p className="footer-cr">M2BShop.com 2023 © All rights reserved</p>
			</footer>
	)
}

export default Footer
