import { Breadcrumbs } from "@mui/material";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { BiHome } from "react-icons/bi";
import { Link } from "react-router-dom";
import styled from 'styled-components'
import { url } from "../slices/api";
import toast from "react-hot-toast";

const Klantenservice = () => {
	const [email, setEmail] = useState("");
	const [name, setName] = useState("");
	const [message, setMessage] = useState("");

	const handleSubmit = async () => {
		try {
			await axios({
				method: "post",
				url: `${url}/contact`,
				data: {
					email: email,
					name: name,
					message: message
				}
			})
			.then(() => {
				toast.success("Successfully sent")
			})
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<Container style={{"textAlign": "center"}}>
		<Breadcrumbs className="breadcrumbs">
			<Link to="/"><BiHome/></Link>
			<Link to="/klantenservice" className="breadcrumbs-a">Customer Service</Link>
		</Breadcrumbs>
		<div className="contact-text">
			<h1>Customer Service</h1>
			<p style={{"marginTop": "5px"}}>If you need support,you can reach us at:<br/>Email: <a href="mailto:support@m2bshop.com">support@m2bshop.com</a></p>
			<br/>
			<p>Our customer service team is available <b>24/7.</b><br/>Please allow up to 24 hours for a response.</p>
			<br/>
			<p>You can also contact us in the contact form below.</p>
		</div>
		<div className="contact-form">
			<div className="contact-wrapper">
				<div className="contact-input">
					<label>Email <b style={{"color": "#dc3545"}}>*</b></label>
					<input type="email" id="email" onChange={(e) => setEmail(e.target.value)} required/>
				</div>
				<div className="contact-input">
					<label>Name <b style={{"color": "#dc3545"}}>*</b></label>
					<input type="text" id="name" onChange={(e) => setName(e.target.value)} required/>
				</div>
			</div>
			<div className="contact-textarea">
				<label>Message <b style={{"color": "#dc3545"}}>*</b></label>
				<textarea rows={6} name="message" id="message" onChange={(e) => setMessage(e.target.value)} required />
			</div>
			<button onClick={() => handleSubmit()} className="contact-button">Send</button>
		</div>

		</Container>
	)
}

const Container = styled.div`
	padding: 0 calc((100vw - 1200px) / 2);
`

export default Klantenservice
