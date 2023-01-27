import axios from 'axios';
import React, {useState} from 'react'
import { toast } from 'react-hot-toast';
import { url } from '../slices/api';

const MailList = () => {
	const [mail, setMail] = useState("");

	const handleMailSubmit = () => {
		if (!mail) {
			toast.error("Please fill in your Email")
		} else if (mail.length > 100) {
			toast.error("Your email exceeded the character limit")
		} else {
			axios({
				method: "post",
				url: `${url}/mail`,
				headers: {},
				data: {
					email: mail
				}
			})
			.then(() => toast.success("Subscribed"))
		}
	}

	return 	(
		<section className="mail-list">
			<h1>Subscribe to our mailing list</h1>
			<div>
				<input onChange={(e) => setMail(e.target.value)} placeholder="Email" type="text" required/>
				<button onClick={() => handleMailSubmit()}>Subscribe</button>
			</div>
		</section>
	)
}
	
export default MailList