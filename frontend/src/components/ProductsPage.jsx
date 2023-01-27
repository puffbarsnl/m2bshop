import { Breadcrumbs } from '@mui/material';
import React, { useEffect, useRef } from 'react'
import FadeIn from 'react-fade-in/lib/FadeIn';
import { toast } from 'react-hot-toast';
import { BiHome } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { addToCart, getTotals } from '../slices/cartSlice';

const ProductsPage = () => {
	const { items: data, status } = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
	const dispatch = useDispatch();
  // const navigate = useNavigate();
	const element = useRef(null);

	useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

	const handleAddToCart = (product) => {
    dispatch(addToCart(product));
		toast.success("Added to Cart")
	};

	return (
		<div className="home-container">
				{status === "success" ? (
					<>
						<Breadcrumbs className="breadcrumbs">
							<Link to="/"><BiHome/></Link>
							<Link to="/products" className="breadcrumbs-a">All Products</Link>
						</Breadcrumbs>
						<h2 ref={element}>All products</h2>
							<FadeIn>
						<div className="products">
							{data &&
								data?.map((product) => (
									<div key={product._id} className="product">
										<Link to={"/product/" + product._id}>
											<img src={product.image?.url} alt={product.name} />
										</Link>
										<Link to={"/product/" + product._id}>
											<h3>{product.name}</h3>
										</Link>
										<div className="details">
											<span className="price">€{(product.price).toLocaleString('nl-nl', { maximumFractionDigits: 2, minimumFractionDigits: 2})}</span>
										</div>
										<button onClick={() => handleAddToCart(product)}>
											Add to Cart
										</button>
									</div>
								))}
						</div>
								</FadeIn>
					</>
				) : status === "pending" ? (
					<p>LOADING...</p>
				) : (
					<p>Unexpected error occurred...</p>
				)}
			</div>
	)
}

export default ProductsPage