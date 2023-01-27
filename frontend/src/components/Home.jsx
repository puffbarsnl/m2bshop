import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { url } from "../slices/api";
import { addToCart, getTotals } from "../slices/cartSlice";
import FadeIn from "react-fade-in";
import { toast } from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa"
import img from "./assets/teslacoil2.jpg"
import MailList from "./MailList";
// import { useGetAllProductsQuery } from "../slices/productsApi";

const Home = () => {
  const { items: data, status } = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
	const popularProducts = [...data];
	popularProducts.length = 8;
	const dispatch = useDispatch();
  const navigate = useNavigate();	
	const element = useRef(null);

	useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

	useEffect(() => {
		const incrementVisitor = async () => {
			try {
				await axios.post(`${url}/visitor`);
	
				sessionStorage.setItem("visitor", true);
			} catch (error) {
				console.log(error)	
			}
		}
		
		if(sessionStorage.visitor !== 'true') {
			axios.post(`${url}/info/ip`);
			incrementVisitor();
		}
	}, [])
	
  // const { data, error, isLoading } = useGetAllProductsQuery();

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate('/cart');
		toast.success("Added to Cart")
	};

 
		// const executeScroll = () => element.current.scrollIntoView()    
		// run this function from an event handler or an effect to execute scroll 
 
		// <div ref={myRef}>Element to scroll to</div> 
		// <button onClick={executeScroll}> Click to scroll </button> 

  return (
		<>
			<div className="banner">
				<div className="banner-wrapper">
						<div className="banner-text">
							<FadeIn>
							<div className="banner-wrap">
								<h1 className="banner-title">M2BShop</h1>
								<p>Shop with Ease from M2BShop.com</p>
								<Link className="a-button" to="/products">View Products</Link>
							</div>
							</FadeIn>
						</div>
				</div>
				{/* <div className="banner-info">
					<p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef233c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>VEILIG</p>
					<p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef233c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>MILIEUVRIENDELIJK</p>
					<p><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ef233c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 18H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3.19M15 6h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-3.19"></path><line x1="23" y1="13" x2="23" y2="11"></line><polyline points="11 6 7 12 13 12 9 18"></polyline></svg>OPLAADBAAR</p>
				</div> */}
			</div>
			<div className="home-container">
				{status === "success" ? (
					<>
						<h2 ref={element}>Bestsellers</h2>
						<div className="products">
							{popularProducts &&
								popularProducts?.map((product) => (
									<div key={product._id} className="product">
										<Link to={"/product/" + product._id}>
											<img src={product.image?.url} alt={product.name} />
										</Link>
										<Link to={"/product/" + product._id}>
											<h3>{product.name}</h3>
										</Link>
										<div className="details">
											<div>
												<span className="desc">{product.desc}</span>
											</div>
											<span className="price">€{(product.price).toLocaleString('nl-nl', { maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
										</div>
										<button onClick={() => handleAddToCart(product)}>
											Add to Cart
										</button>
									</div>
								))}
						</div>
						<div className="showmore">
							<Link to="/products">Show all</Link>
						</div>
					</>
				) : status === "pending" ? (
					<p></p>
				) : (
					<p></p>
				)}
			</div>
			<section className="stats">
				<div>
					<FaCheckCircle />
					<p>Excellent customer service<br/>available 24/7</p>
				</div>
				<div>
					<FaCheckCircle />
					<p>Wide variety of secure<br/>payment options</p>
				</div>
				<div>
					<FaCheckCircle />
					<p>14-day money-back guarantee<br/>on all products</p>
				</div>
			</section>
			<section className="info-section">
				<div>
					<h1>Revolutionary Tesla Coil Bluetooth Speaker.</h1>
					<p>The Tesla Coil Bluetooth Speaker is a revolutionary device that uses Tesla Coil technology to create a powerful sound. With a range of up to 30 feet and a built-in rechargeable battery that can last up to 8 hours of continuous use, this speaker is perfect for any home or office. The sleek and modern design makes it a great addition to any space, and the Bluetooth connectivity ensures an easy and secure connection to any compatible device. </p>
					<Link className="a-button" to="/products">View Products</Link>
				</div>
				<img src={img} alt="Tesla Coil" />
			</section>
			<MailList />
			<section className="h1-section">
				<div>
					<h1>What is a Tesla Coil Speaker?</h1>
					<p>A Tesla Coil Speaker is an electromagnetically powered speaker that uses a high-voltage electrical current to generate sound. It utilizes a Tesla Coil, a special type of induction coil, to generate the voltage necessary to make sound. The frequency of the electricity produced by the Tesla Coil Speaker can reach up to several hundred kilohertz (kHz).</p>
				</div>
				<div>
					<h1>Are Tesla coil speakers safe to use?</h1>
					<p>Yes, Tesla Coil Speakers are safe to use. They generate low-level electrical current and do not produce any hazardous radiation. However, it is important to take care when handling the speaker and its components, as high-voltage electricity is involved.</p>
				</div>
				<div>
					<h1>Does it hurt when you touch the Tesla Coil electricity?</h1>
					<p>No, it does not hurt when you touch the electricity produced by a Tesla Coil Speaker.</p>
				</div>
			</section>
		</>
  );
};

export default Home;
