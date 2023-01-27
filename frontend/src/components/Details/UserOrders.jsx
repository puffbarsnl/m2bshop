import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { setHeaders, url } from '../../slices/api';
import moment from "moment";
import 'moment/locale/nl'
import styled from 'styled-components';
import { Breadcrumbs } from '@mui/material';
import { Link } from 'react-router-dom';
import { BiHome } from 'react-icons/bi';

const UserOrders = () => {

  const auth = useSelector((state) => state.auth);

  const [orders, setOrders] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${url}/orders/find/${auth._id}`,
          setHeaders()
        );

        setOrders(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

		if(auth._id) {
			fetchOrder();
		}
  }, [auth._id]);

	function pad(n) {
    var s = "000" + n;
    return s.substr(s.length-4);
	}

	return (
		<div className='orders'>
			<Breadcrumbs className="breadcrumbs">
				<Link to="/"><BiHome/></Link>
				<Link to="/orders" className="breadcrumbs-a">Orders</Link>
			</Breadcrumbs>
			<Titel>Your orders</Titel>
			{orders[0] ? orders?.map((order, index) => (
				<Orders key={index}>
					<Nummer>#{pad((index + 1))}</Nummer>
					<OrderInfo>
						<div>
							<h3>Order ID:</h3>
							<p>{order._id}</p>
						</div>
						<div>
							<h3>Order Date:</h3>
							<p>{moment(order.createdAt).format('L')}</p>
						</div>
						<div>
							<h3>Total</h3>
							<p>€{(order.total / 100).toLocaleString('nl-nl', { maximumFractionDigits: 2, minimumFractionDigits: 2})}</p>
						</div>
						<div>
							{order.delivery_status === "pending" ? (
								// <Cog />
								<Afwachting>Pending</Afwachting>
							) : order.delivery_status === "dispatched" ? (
								// <OMW />
								<Onderweg>Dispatched</Onderweg>
							) : order.delivery_status === "delivered" ? (
								// <Check />
								<Geleverd>Delivered</Geleverd>
							) : (
								"ERROR"
							)}
						</div>
					</OrderInfo>
					<h3>Ordered Products:</h3>
					<CartTop>
						<h3>Name</h3>
						<h3>Quantity</h3>
						<h3>Price</h3>
					</CartTop>
					
					{orders[0] && order.products.map((boughtItems, index) => (
						<Cart key={index}>
							<div>
								<p>{boughtItems.description ? boughtItems.description : boughtItems.name}</p>		
							</div>
							<div>
								<p>{boughtItems.quantity ? boughtItems.quantity : boughtItems.cartQuantity}x</p>
							</div>
							<p>€{(boughtItems.amount_total ? boughtItems.amount_total / 100 : (boughtItems.price * boughtItems.cartQuantity)).toLocaleString('nl-nl', { maximumFractionDigits: 2, minimumFractionDigits: 2})}</p>
						</Cart>
					))}
				</Orders>
			)) : <p className="order-none">You don't have any orders</p>}
		</div>
		
	)
}

const Titel = styled.h1`
	width: 1000px;
	margin: 1rem auto;
`

const Orders = styled.div`
	border: 1px solid lightgray;
  border-radius: 5px;
	margin: 30px auto;
	padding: 1rem;
	width: 1000px;
	@media screen and (max-width: 920px) {
		margin: 30px 0;
		width: 100% !important;
		border-right: none;
		border-left: none;
		border-radius: 0;
	}
`

const OrderInfo = styled.div`
	display: flex;
	align-content: center;
	justify-content: space-between;
	width: 100%;
	margin-bottom: 1rem;
	@media screen and (max-width: 920px) {
		flex-direction: column;
	}
`

const Nummer = styled.h3`
	margin-bottom: 1rem;
`

const Afwachting = styled.div`
  color: rgb(253, 181, 40);
  background: rgb(253, 181, 40, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;
const Onderweg = styled.div`
  color: rgb(38, 198, 249);
  background-color: rgb(38, 198, 249, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const Geleverd = styled.div`
  color: rgb(102, 108, 255);
  background-color: rgba(102, 108, 255, 0.12);
  padding: 3px 5px;
  border-radius: 3px;
  font-size: 14px;
`;

const Cart = styled.div`
	display: flex;
	width: 100%;
	justify-content: space-between;
	div {
		flex: 4;
		&:first-child {
			flex: 3;
		}

		&:last-child {
			flex: 0;
		}
	}
`

const CartTop = styled.div`
	display: flex;
	h3 {
		flex: 4;
		&:first-child {
			flex: 3;
		}

		&:last-child {
			flex: 0;
		}
	}
`

export default UserOrders
