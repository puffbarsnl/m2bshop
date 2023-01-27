import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { url } from "../../slices/api";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, getTotals } from "../../slices/cartSlice";
import Reviews from "../Reviews";
import { Breadcrumbs, Rating } from "@mui/material";
import { BiHome } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { FaShoppingBag } from "react-icons/fa";
import FadeIn from "react-fade-in/lib/FadeIn";

const Product = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadCart, setLoadCart] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const user = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(getTotals());
  }, [cart, dispatch]);

  const handleCheckout = (product) => {
    dispatch(addToCart(product));



    const cartItems = JSON.parse(localStorage.getItem("cartItems"));

    axios
      .post(`${url}/stripe/create-checkout-session`, {
        cartItems,
        userId: user._id,
      })
      .then((response) => {
        if (response.data.url) {
          window.location.href = response.data.url;
        }
      })
      .catch((err) => console.log(err.message))
  };


  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/products/find/${params.id}`);

        setProduct(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProduct();
  }, [params.id]);

  useEffect(() => {
    const fetchAverageRating = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${url}/products/review/${params.id}/average`);

        setAverageRating(res.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    }
    
    fetchAverageRating();
  }, [params.id, Rating])
  

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
    navigate('/cart');
		toast.success("Added to Cart");
  };

  return (
    <div className="styled-product">
      <Breadcrumbs className="breadcrumbs">
        <Link to="/"><BiHome/></Link>
        <Link to="/products">All products</Link>
        <Link to={`/product/${params.id}`} className="breadcrumbs-a">{product.name}</Link>
      </Breadcrumbs>
      <FadeIn>
        <div className="product-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              <div className="img-container">
                <img src={product.image?.url} alt="product" />
              </div>
              <div className="product-details">
                <h1>{product.name}</h1>
                <div className="rating">
                  { averageRating.average ?
                  <>
                    <Rating name="reviewgemiddelde" value={averageRating.average} readOnly precision={0.5} />
                    <p>{`(`}{averageRating.count}{`)`}</p>
                  </> : (
                    <>
                      <Rating name="reviewgemiddelde" value={averageRating.average} readOnly precision={0.5} />
                      <p>{`(`}{averageRating.count}{`)`}</p>
                    </>
                  )
                  } 
                </div>
                
                <Price><OldPrice>{(product?.price + product?.sale).toLocaleString('nl-nl', { maximumFractionDigits: 2, minimumFractionDigits: 2})}</OldPrice>€{product?.price?.toLocaleString('nl-nl', { maximumFractionDigits: 2, minimumFractionDigits: 2})}</Price>
                <button
                  className="product-add-to-cart"
                  onClick={() => handleAddToCart(product)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  Add to Cart
                </button>
                <button 
                  className="product-purchase"
                  onClick={() => handleCheckout(product)}
                >
                  Buy now
                </button>
                <div className="payments">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" width="60" height="40" role="img" aria-labelledby="pi-paypal"><title id="pi-paypal">PayPal</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"/><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"/><path fill="#003087" d="M23.9 8.3c.2-1 0-1.7-.6-2.3-.6-.7-1.7-1-3.1-1h-4.1c-.3 0-.5.2-.6.5L14 15.6c0 .2.1.4.3.4H17l.4-3.4 1.8-2.2 4.7-2.1z"/><path fill="#3086C8" d="M23.9 8.3l-.2.2c-.5 2.8-2.2 3.8-4.6 3.8H18c-.3 0-.5.2-.6.5l-.6 3.9-.2 1c0 .2.1.4.3.4H19c.3 0 .5-.2.5-.4v-.1l.4-2.4v-.1c0-.2.3-.4.5-.4h.3c2.1 0 3.7-.8 4.1-3.2.2-1 .1-1.8-.4-2.4-.1-.5-.3-.7-.5-.8z"/><path fill="#012169" d="M23.3 8.1c-.1-.1-.2-.1-.3-.1-.1 0-.2 0-.3-.1-.3-.1-.7-.1-1.1-.1h-3c-.1 0-.2 0-.2.1-.2.1-.3.2-.3.4l-.7 4.4v.1c0-.3.3-.5.6-.5h1.3c2.5 0 4.1-1 4.6-3.8v-.2c-.1-.1-.3-.2-.5-.2h-.1z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" width="60" height="40" aria-labelledby="pi-maestro"><title id="pi-maestro">Maestro</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><circle fill="#EB001B" cx="15" cy="12" r="7"></circle><circle fill="#00A2E5" cx="23" cy="12" r="7"></circle><path fill="#7375CF" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" width="60" height="40" aria-labelledby="pi-master"><title id="pi-master">Mastercard</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z"></path><path fill="#fff" d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32"></path><circle fill="#EB001B" cx="15" cy="12" r="7"></circle><circle fill="#F79E1B" cx="23" cy="12" r="7"></circle><path fill="#FF5F00" d="M22 12c0-2.4-1.2-4.5-3-5.7-1.8 1.3-3 3.4-3 5.7s1.2 4.5 3 5.7c1.8-1.2 3-3.3 3-5.7z"></path></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 38 24" width="60" height="40" role="img" aria-labelledby="pi-ideal"><title id="pi-ideal">iDEAL</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z"/><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z" fill="#fff"/><path d="M14 6.912V19h5.648C24.776 19 27 16.302 27 12.486 27 8.834 24.776 6 19.648 6h-4.67c-.543 0-.978.414-.978.912Z" fill="#C06"/><path d="M19.312 21h-8.884C9.64 21 9 20.373 9 19.6V5.4c0-.773.64-1.4 1.428-1.4h8.884C27.742 4 29 9.317 29 12.482 29 17.974 25.555 21 19.313 21h-.001ZM10.428 4.467a.944.944 0 0 0-.878.573.936.936 0 0 0-.074.36v14.2a.936.936 0 0 0 .59.866c.115.046.238.07.362.068h8.884c5.938 0 9.212-2.86 9.212-8.052 0-6.972-5.774-8.015-9.212-8.015h-8.884Z"/><path d="M16.252 11.008c.188 0 .361.03.528.088.167.06.304.155.427.273.116.125.21.28.282.457.065.184.101.398.101.649 0 .22-.028.42-.08.604a1.417 1.417 0 0 1-.245.479 1.197 1.197 0 0 1-.413.317 1.437 1.437 0 0 1-.586.118H15V11h1.252v.008Zm-.044 2.44c.095 0 .181-.016.276-.045a.539.539 0 0 0 .23-.155.863.863 0 0 0 .168-.28c.043-.118.065-.25.065-.42 0-.147-.015-.287-.044-.405a.814.814 0 0 0-.145-.31.656.656 0 0 0-.26-.199 1.047 1.047 0 0 0-.398-.066h-.464v1.887h.572v-.008Zm3.995-2.44v.553h-1.548v.64h1.426v.51h-1.426v.73h1.585v.552h-2.229V11h2.194v.008h-.002Zm2.215 0 1.1 2.992h-.673l-.224-.663h-1.1l-.232.663h-.652l1.108-2.992h.673Zm.037 1.835-.37-1.098h-.007l-.384 1.098h.76Zm2.112-1.835v2.44H26V14h-2.076v-2.992h.643Z" fill="#fff"/><path d="M11.5 13.652c.829 0 1.5-.593 1.5-1.326 0-.732-.671-1.326-1.5-1.326s-1.5.594-1.5 1.326c0 .732.671 1.326 1.5 1.326ZM12.63 19c-1.258 0-2.269-.9-2.269-2.007v-1.568a.969.969 0 0 1 .337-.715c.214-.189.502-.294.802-.291a1.24 1.24 0 0 1 .433.073c.137.05.262.124.368.218.106.093.19.205.248.327a.93.93 0 0 1 .09.388V19h-.008Z"/></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="60" height="40" viewBox="0 0 38 24" fill="none" role="img" aria-labelledby="pi-sofort"><title id="pi-sofort">SOFORT</title><path opacity=".07" d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3Z" fill="#000"/><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32Z" fill="#fff"/><path d="M33.555 20H3L5.322 5H36l-2.445 15Z" fill="#393A41"/><path d="M13.116 10c-1.403 0-2.47 1.243-2.47 2.725 0 1.34.875 2.274 2.066 2.274 1.403 0 2.462-1.278 2.462-2.76.008-1.349-.867-2.239-2.058-2.239Zm-.315 3.738c-.538 0-.912-.423-.912-1.076 0-.723.463-1.41 1.132-1.41.536 0 .911.441.911 1.094.008.731-.462 1.392-1.132 1.392ZM21.56 10c-1.402 0-2.461 1.243-2.461 2.725 0 1.34.875 2.274 2.066 2.274 1.403 0 2.463-1.278 2.463-2.76C23.636 10.89 22.76 10 21.562 10Zm-.307 3.738c-.537 0-.912-.423-.912-1.076 0-.723.463-1.41 1.133-1.41.535 0 .911.441.911 1.094 0 .731-.463 1.392-1.133 1.392Zm6.506-2.16c0-.9-.581-1.472-1.64-1.472h-1.485l-.654 4.787h1.25l.206-1.508h.059l.66 1.508h1.434l-.918-1.676c.684-.282 1.087-.89 1.087-1.638Zm-2 .795h-.183l.139-1.007h.169c.39 0 .595.142.595.45 0 .363-.293.557-.72.557Zm-16.547-.354c-.477-.292-.581-.362-.581-.521 0-.193.19-.29.448-.29.302 0 .758.043 1.206.554.108-.4.287-.777.529-1.11-.63-.431-1.22-.652-1.756-.652-1.066 0-1.683.687-1.683 1.516 0 .715.447 1.085.977 1.412.478.29.595.387.595.564 0 .194-.198.3-.463.3-.456 0-.986-.344-1.301-.697L7 14.426c.417.378.954.582 1.507.574 1.103 0 1.699-.671 1.699-1.527 0-.705-.382-1.084-.993-1.454Zm9.263.184h-1.47l.117-.837h1.572c.2-.491.513-.923.912-1.26h-2.573c-.573 0-1.058.467-1.14 1.102l-.499 3.694h1.25l.206-1.508h1.485l.11-.82c.007-.132.015-.247.03-.37Zm9.312-2.096c.338.308.544.74.588 1.26h1.044l-.477 3.526h1.249l.477-3.527h1.162l.169-1.26h-4.212Z" fill="#EDEDED"/></svg>
                  <svg width="60" height="40" viewBox="0 0 70 48" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="0.5" y="0.5" width="69" height="47" rx="5.5" fill="white" stroke="#D9D9D9"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M18.2243 35.1715C18.2243 34.882 18.156 34.6314 18.0199 34.4199C17.8835 34.2083 17.7043 34.0468 17.4819 33.9355C17.7043 33.8242 17.8766 33.6597 17.9991 33.4426C18.1214 33.2255 18.1825 32.9806 18.1825 32.7078V32.5575C18.1825 32.2233 18.1186 31.9451 17.9908 31.7223C17.8628 31.4996 17.6833 31.3213 17.4526 31.1878C17.2219 31.0541 16.9451 30.9582 16.6227 30.8995C16.3 30.8411 15.9414 30.812 15.5465 30.812C15.4131 30.812 15.274 30.8147 15.1296 30.8203C14.9848 30.8258 14.8445 30.8328 14.7083 30.8411C14.572 30.8494 14.4468 30.8593 14.3329 30.8704C14.2188 30.8817 14.1256 30.8928 14.0534 30.9037C13.8921 30.9318 13.7781 30.9817 13.7114 31.0541C13.6448 31.1266 13.6113 31.2575 13.6113 31.4467V36.5245C13.6113 36.7139 13.646 36.8447 13.7156 36.917C13.7851 36.9895 13.9032 37.0394 14.0702 37.0673C14.1535 37.084 14.2536 37.0979 14.3704 37.1091C14.4871 37.1202 14.6136 37.1299 14.7499 37.1383C14.8862 37.1466 15.0265 37.1535 15.1711 37.1593C15.3158 37.1646 15.4575 37.1676 15.5966 37.1676C15.9581 37.1676 16.2986 37.1397 16.6185 37.084C16.9381 37.0285 17.2161 36.9295 17.4526 36.7874C17.689 36.6456 17.8766 36.4534 18.0157 36.2113C18.1546 35.969 18.2243 35.6642 18.2243 35.2967V35.1715ZM16.8063 32.7746C16.8063 32.8637 16.7924 32.9487 16.7645 33.0293C16.7366 33.11 16.6909 33.1795 16.627 33.2383C16.5629 33.2966 16.4768 33.3439 16.3684 33.38C16.2599 33.4162 16.1222 33.4343 15.9554 33.4343H15.0213V31.9895C15.049 31.9895 15.0921 31.9883 15.1505 31.9853C15.2089 31.9825 15.27 31.9812 15.3339 31.9812H15.6551C16.0833 31.9812 16.3822 32.0354 16.5518 32.144C16.7214 32.2526 16.8063 32.421 16.8063 32.6492V32.7746ZM16.5935 35.8062C16.7576 35.6782 16.8397 35.4971 16.8397 35.2634V35.1714C16.8397 34.971 16.7756 34.797 16.6478 34.6494C16.5198 34.502 16.289 34.4282 15.9554 34.4282H15.0213V35.9898H15.1671C15.231 35.9898 15.2977 35.9916 15.3673 35.9942C15.4368 35.9969 15.5035 35.9985 15.5676 35.9985H15.7051C16.1333 35.9985 16.4295 35.9343 16.5935 35.8062ZM22.7955 33.9438C22.7955 33.6377 22.7496 33.3772 22.6578 33.1629C22.5662 32.9487 22.4368 32.7732 22.27 32.6367C22.1032 32.5004 21.8988 32.4003 21.6568 32.3362C21.415 32.2722 21.1439 32.2401 20.8436 32.2401C20.5654 32.2401 20.2943 32.2597 20.0303 32.2987C19.766 32.3375 19.556 32.3766 19.4005 32.4154C19.2948 32.4435 19.242 32.5046 19.242 32.5991V33.2756C19.242 33.3314 19.2559 33.3705 19.2837 33.3925C19.3115 33.4149 19.3475 33.4261 19.3922 33.4261H19.4337C19.5006 33.4204 19.5839 33.4135 19.684 33.4051C19.7842 33.3968 19.8968 33.3901 20.022 33.3842C20.1471 33.3788 20.2777 33.3746 20.414 33.3717C20.5501 33.3689 20.6851 33.3675 20.8186 33.3675C21.0131 33.3675 21.1661 33.4038 21.2773 33.4761C21.3885 33.5486 21.4441 33.7045 21.4441 33.9438V34.2445H20.9937C20.2763 34.2445 19.7549 34.3572 19.4296 34.5827C19.1043 34.8081 18.9416 35.1659 18.9416 35.6558V35.7313C18.9416 36.0039 18.982 36.2321 19.0625 36.4158C19.1431 36.5996 19.2503 36.7472 19.3837 36.8587C19.5172 36.9699 19.6686 37.0493 19.8384 37.0964C20.008 37.1438 20.1846 37.1676 20.3681 37.1676C20.6184 37.1676 20.8339 37.1341 21.0145 37.0673C21.1952 37.0005 21.3662 36.9086 21.5276 36.7917V36.9253C21.5276 36.9699 21.5442 37.0089 21.5776 37.0422C21.6111 37.0756 21.6499 37.0923 21.6944 37.0923H22.6287C22.6731 37.0923 22.712 37.0756 22.7455 37.0422C22.7789 37.0089 22.7955 36.9699 22.7955 36.9253V33.9438ZM21.1481 36.0942C21.2619 36.0581 21.3691 36.015 21.4692 35.9648V35.0462H20.9937C20.8491 35.0462 20.7296 35.0587 20.635 35.0837C20.5404 35.1088 20.4653 35.1465 20.4098 35.1966C20.3542 35.2465 20.3152 35.3107 20.2931 35.3886C20.2707 35.4666 20.2596 35.5556 20.2596 35.6558V35.7312C20.2596 35.9092 20.3026 36.0233 20.3889 36.0734C20.4751 36.1235 20.6071 36.1485 20.7852 36.1485C20.913 36.1485 21.0339 36.1306 21.1481 36.0942ZM27.9007 36.917V34.1358C27.9007 33.8744 27.8799 33.6278 27.8381 33.3968C27.7964 33.166 27.7214 32.9653 27.6129 32.7954C27.5045 32.6256 27.3543 32.4905 27.1624 32.3904C26.9707 32.2902 26.7245 32.2401 26.4242 32.2401C26.1572 32.2401 25.9208 32.2723 25.7152 32.3369C25.5094 32.4014 25.2925 32.515 25.0646 32.6776V32.4752C25.0646 32.4305 25.0478 32.3911 25.0145 32.3575C24.9811 32.3238 24.9421 32.3068 24.8976 32.3068H23.9634C23.9187 32.3068 23.8799 32.3235 23.8467 32.357C23.8133 32.3904 23.7966 32.4295 23.7966 32.4739V36.917C23.7966 36.9615 23.8145 37.0019 23.8508 37.038C23.8869 37.0743 23.9272 37.0923 23.9717 37.0923H24.9811C25.0256 37.0923 25.0646 37.0743 25.0978 37.0382C25.1313 37.0021 25.1479 36.9619 25.1479 36.9173V33.6341C25.2925 33.5564 25.4287 33.4925 25.5567 33.4426C25.6845 33.3925 25.8096 33.3675 25.932 33.3675C26.0599 33.3675 26.1642 33.38 26.2449 33.4051C26.3254 33.4301 26.388 33.4731 26.4325 33.5345C26.477 33.5954 26.5076 33.6759 26.5243 33.7757C26.5409 33.8758 26.5494 33.9981 26.5494 34.1425V36.9173C26.5494 36.9619 26.566 37.0021 26.5994 37.0382C26.6327 37.0743 26.6715 37.0923 26.7162 37.0923H27.7255C27.7699 37.0923 27.8102 37.0743 27.8464 37.038C27.8826 37.0019 27.9007 36.9615 27.9007 36.917ZM32.0047 36.1071V36.8502C32.0047 36.9114 31.9907 36.9546 31.963 36.9796C31.9351 37.0047 31.8906 37.0255 31.8294 37.0422C31.7127 37.0701 31.5611 37.0978 31.3749 37.1259C31.1885 37.1535 30.9703 37.1676 30.72 37.1676C30.1305 37.1676 29.6592 36.9867 29.3062 36.6246C28.953 36.2628 28.7765 35.7394 28.7765 35.0546V34.3531C28.7765 33.6682 28.953 33.1448 29.3062 32.7831C29.6592 32.421 30.1305 32.2401 30.72 32.2401C30.9703 32.2401 31.1885 32.254 31.3749 32.2817C31.5611 32.3098 31.7127 32.3375 31.8294 32.3653C31.8906 32.3819 31.9351 32.4029 31.963 32.4279C31.9907 32.453 32.0047 32.4962 32.0047 32.5574V33.3007C32.0047 33.3453 31.9893 33.38 31.9588 33.4051C31.9281 33.4301 31.8906 33.4426 31.8462 33.4426H31.8294C31.6737 33.4261 31.5251 33.4121 31.3832 33.401C31.2413 33.3901 31.0508 33.3842 30.8118 33.3842C30.7172 33.3842 30.6283 33.3996 30.5448 33.4301C30.4613 33.4608 30.3891 33.5137 30.328 33.5888C30.2666 33.6641 30.2181 33.7641 30.1819 33.8895C30.1457 34.0147 30.1277 34.1692 30.1277 34.3531V35.0546C30.1277 35.2382 30.1457 35.3927 30.1819 35.5181C30.2181 35.6433 30.2666 35.7436 30.328 35.8187C30.3891 35.8939 30.4613 35.9468 30.5448 35.9774C30.6283 36.008 30.7172 36.0233 30.8118 36.0233C31.0508 36.0233 31.2413 36.0178 31.3832 36.0067C31.5251 35.9956 31.6737 35.9815 31.8294 35.9649H31.8462C31.8906 35.9649 31.9281 35.9774 31.9588 36.0025C31.9893 36.0276 32.0047 36.0623 32.0047 36.1071ZM36.6346 34.4115C36.6346 34.0773 36.5885 33.7768 36.4966 33.5095C36.4046 33.2423 36.2709 33.0155 36.0954 32.8289C35.9199 32.6424 35.7025 32.4976 35.4436 32.3946C35.1844 32.2918 34.8848 32.2401 34.5449 32.2401C34.2051 32.2401 33.9056 32.2918 33.6465 32.3946C33.3873 32.4976 33.1685 32.6424 32.9903 32.8289C32.8119 33.0155 32.6768 33.2423 32.585 33.5095C32.4928 33.7768 32.4469 34.0773 32.4469 34.4115V34.9961C32.4469 35.3301 32.4928 35.6309 32.585 35.8981C32.6768 36.1653 32.8119 36.3922 32.9903 36.5788C33.1685 36.7654 33.3873 36.91 33.6465 37.013C33.9056 37.1159 34.2051 37.1676 34.5449 37.1676C34.8848 37.1676 35.1844 37.1159 35.4436 37.013C35.7025 36.91 35.9199 36.7654 36.0954 36.5788C36.2709 36.3922 36.4046 36.1653 36.4966 35.8981C36.5885 35.6309 36.6346 35.3301 36.6346 34.9961V34.4115ZM34.5449 36.0233C35.037 36.0233 35.2832 35.6809 35.2832 34.9961V34.4115C35.2832 33.7322 35.037 33.3925 34.5449 33.3925C34.3016 33.3925 34.1164 33.4774 33.9893 33.6472C33.8619 33.8172 33.7984 34.0719 33.7984 34.4115V34.9961C33.7984 35.3357 33.8619 35.5918 33.9893 35.7644C34.1164 35.9371 34.3016 36.0233 34.5449 36.0233ZM41.5976 36.917V34.1358C41.5976 33.8744 41.5765 33.6278 41.5351 33.3968C41.4933 33.166 41.4181 32.9653 41.3095 32.7954C41.2011 32.6256 41.0511 32.4905 40.8593 32.3904C40.6674 32.2902 40.4213 32.2401 40.1211 32.2401C39.8542 32.2401 39.6177 32.2723 39.4119 32.3369C39.2062 32.4014 38.9893 32.515 38.7613 32.6776V32.4752C38.7613 32.4305 38.7447 32.3911 38.7111 32.3575C38.678 32.3238 38.6389 32.3068 38.5945 32.3068H37.6602C37.6157 32.3068 37.5769 32.3235 37.5434 32.357C37.5102 32.3904 37.4934 32.4295 37.4934 32.4739V36.917C37.4934 36.9615 37.5114 37.0019 37.5476 37.038C37.5838 37.0743 37.624 37.0923 37.6687 37.0923H38.678C38.7224 37.0923 38.7613 37.0743 38.7948 37.0382C38.828 37.0021 38.8448 36.9619 38.8448 36.9173V33.6341C38.9893 33.5564 39.1256 33.4925 39.2534 33.4426C39.3815 33.3925 39.5065 33.3675 39.629 33.3675C39.7568 33.3675 39.8611 33.38 39.9416 33.4051C40.0222 33.4301 40.0849 33.4731 40.1294 33.5345C40.1739 33.5954 40.2044 33.6759 40.2212 33.7757C40.2378 33.8758 40.2462 33.9981 40.2462 34.1425V36.9173C40.2462 36.9619 40.2628 37.0021 40.2962 37.0382C40.3296 37.0743 40.3684 37.0923 40.413 37.0923H41.4223C41.4668 37.0923 41.5072 37.0743 41.5434 37.038C41.5794 37.0019 41.5976 36.9615 41.5976 36.917ZM45.2348 36.2893V36.9357C45.2348 37.0295 45.182 37.0848 45.0763 37.1011C44.9483 37.1233 44.8371 37.1398 44.7427 37.1509C44.6481 37.162 44.5395 37.1675 44.4174 37.1675C44.1905 37.1675 43.9901 37.1493 43.816 37.1133C43.6419 37.077 43.4966 37.0061 43.3805 36.9003C43.2646 36.7945 43.1761 36.6483 43.1153 36.4617C43.0547 36.2753 43.0242 36.0347 43.0242 35.7394V33.3175L42.357 33.2088C42.3123 33.1977 42.2721 33.1769 42.2359 33.1462C42.1997 33.1157 42.1817 33.0781 42.1817 33.0335V32.4822C42.1817 32.4378 42.1997 32.3974 42.2359 32.3611C42.2721 32.325 42.3123 32.3068 42.357 32.3068H43.0242V31.622C43.0242 31.5774 43.0409 31.5414 43.0739 31.5134C43.1068 31.4857 43.1458 31.4663 43.1902 31.455L44.2016 31.2798H44.2263C44.2705 31.2798 44.3065 31.2921 44.3343 31.3171C44.3618 31.3423 44.3757 31.3771 44.3757 31.4215V32.3068H45.0597C45.104 32.3068 45.143 32.3237 45.1764 32.3573C45.2099 32.3909 45.2265 32.4305 45.2265 32.4752V33.1573C45.2265 33.2024 45.2099 33.2416 45.1764 33.2752C45.143 33.3089 45.104 33.3257 45.0597 33.3257H44.3757V35.7561C44.3757 35.9231 44.3895 36.0304 44.4174 36.0776C44.4451 36.1249 44.5229 36.1485 44.6507 36.1485H45.0597C45.1764 36.1485 45.2348 36.1955 45.2348 36.2893ZM49.6891 33.9438C49.6891 33.6377 49.6433 33.3772 49.5514 33.1629C49.4597 32.9487 49.3305 32.7732 49.1637 32.6367C48.9969 32.5004 48.7925 32.4003 48.5505 32.3362C48.3087 32.2722 48.0376 32.2401 47.7373 32.2401C47.4589 32.2401 47.188 32.2597 46.924 32.2987C46.6597 32.3375 46.4497 32.3766 46.2942 32.4154C46.1882 32.4435 46.1357 32.5046 46.1357 32.5991V33.2756C46.1357 33.3314 46.1494 33.3705 46.1773 33.3925C46.2052 33.4149 46.2412 33.4261 46.2857 33.4261H46.3274C46.3943 33.4204 46.4776 33.4135 46.5777 33.4051C46.6779 33.3968 46.7905 33.3901 46.9155 33.3842C47.0408 33.3788 47.1714 33.3746 47.3077 33.3717C47.4438 33.3689 47.5788 33.3675 47.7121 33.3675C47.9068 33.3675 48.0598 33.4038 48.171 33.4761C48.2822 33.5486 48.3378 33.7045 48.3378 33.9438V34.2445H47.8874C47.1698 34.2445 46.6486 34.3572 46.3233 34.5827C45.998 34.8081 45.8353 35.1659 45.8353 35.6558V35.7313C45.8353 36.0039 45.8755 36.2321 45.9562 36.4158C46.0366 36.5996 46.144 36.7472 46.2774 36.8587C46.4109 36.9699 46.5623 37.0493 46.7321 37.0964C46.9017 37.1438 47.0782 37.1676 47.2618 37.1676C47.5121 37.1676 47.7274 37.1341 47.9082 37.0673C48.0889 37.0005 48.2597 36.9086 48.4213 36.7917V36.9253C48.4213 36.9699 48.4379 37.0089 48.4713 37.0422C48.5046 37.0756 48.5436 37.0923 48.5881 37.0923H49.5224C49.5668 37.0923 49.6057 37.0756 49.6392 37.0422C49.6724 37.0089 49.6891 36.9699 49.6891 36.9253V33.9438ZM48.0418 36.0942C48.1556 36.0581 48.2628 36.015 48.3629 35.9648V35.0462H47.8874C47.7428 35.0462 47.6233 35.0587 47.5287 35.0837C47.4341 35.1088 47.359 35.1465 47.3035 35.1966C47.2477 35.2465 47.2088 35.3107 47.1868 35.3886C47.1644 35.4666 47.1533 35.5556 47.1533 35.6558V35.7312C47.1533 35.9092 47.1963 36.0233 47.2826 36.0734C47.3688 36.1235 47.5008 36.1485 47.6789 36.1485C47.8067 36.1485 47.9274 36.1306 48.0418 36.0942ZM53.7933 36.8502V36.1071C53.7933 36.0623 53.7779 36.0276 53.7474 36.0025C53.7167 35.9774 53.6793 35.9649 53.6348 35.9649H53.6181C53.4624 35.9815 53.3136 35.9956 53.1718 36.0067C53.0301 36.0178 52.8395 36.0233 52.6005 36.0233C52.5057 36.0233 52.4167 36.008 52.3336 35.9774C52.2501 35.9468 52.1777 35.8939 52.1165 35.8187C52.0554 35.7436 52.0067 35.6433 51.9707 35.5181C51.9343 35.3927 51.9165 35.2382 51.9165 35.0546V34.3531C51.9165 34.1692 51.9343 34.0147 51.9707 33.8895C52.0067 33.7641 52.0554 33.6641 52.1165 33.5888C52.1777 33.5137 52.2501 33.4608 52.3336 33.4301C52.4167 33.3996 52.5057 33.3842 52.6005 33.3842C52.8395 33.3842 53.0301 33.3901 53.1718 33.401C53.3136 33.4121 53.4624 33.4261 53.6181 33.4426H53.6348C53.6793 33.4426 53.7167 33.4301 53.7474 33.4051C53.7779 33.38 53.7933 33.3453 53.7933 33.3007V32.5574C53.7933 32.4962 53.7794 32.453 53.7515 32.4279C53.7235 32.4029 53.6793 32.3819 53.6181 32.3653C53.5014 32.3375 53.3497 32.3098 53.1635 32.2817C52.9771 32.254 52.759 32.2401 52.5087 32.2401C51.9189 32.2401 51.4479 32.421 51.0947 32.7831C50.7415 33.1448 50.565 33.6682 50.565 34.3531V35.0546C50.565 35.7394 50.7415 36.2628 51.0947 36.6246C51.4479 36.9867 51.9189 37.1676 52.5087 37.1676C52.759 37.1676 52.9771 37.1535 53.1635 37.1259C53.3497 37.0978 53.5014 37.0701 53.6181 37.0422C53.6793 37.0255 53.7235 37.0047 53.7515 36.9796C53.7794 36.9546 53.7933 36.9114 53.7933 36.8502ZM57.3884 36.2893V36.9357C57.3884 37.0295 57.3354 37.0848 57.2299 37.1011C57.1019 37.1233 56.9907 37.1398 56.8963 37.1509C56.8016 37.162 56.6931 37.1675 56.571 37.1675C56.3441 37.1675 56.1437 37.1493 55.9696 37.1133C55.7954 37.077 55.6502 37.0061 55.5343 36.9003C55.4183 36.7945 55.3298 36.6483 55.269 36.4617C55.2083 36.2753 55.1778 36.0347 55.1778 35.7394V33.3175L54.5106 33.2088C54.4659 33.1977 54.4257 33.1769 54.3895 33.1462C54.3533 33.1157 54.3353 33.0781 54.3353 33.0335V32.4822C54.3353 32.4378 54.3533 32.3974 54.3895 32.3611C54.4257 32.325 54.4659 32.3068 54.5106 32.3068H55.1778V31.622C55.1778 31.5774 55.1945 31.5414 55.2276 31.5134C55.2605 31.4857 55.2993 31.4663 55.3436 31.455L56.355 31.2798H56.38C56.4241 31.2798 56.4602 31.2921 56.4875 31.3171C56.5154 31.3423 56.5293 31.3771 56.5293 31.4215V32.3068H57.2133C57.2577 32.3068 57.2966 32.3237 57.3301 32.3573C57.3633 32.3909 57.3801 32.4305 57.3801 32.4752V33.1573C57.3801 33.2024 57.3633 33.2416 57.3301 33.2752C57.2966 33.3089 57.2577 33.3257 57.2133 33.3257H56.5293V35.7561C56.5293 35.9231 56.5431 36.0304 56.571 36.0776C56.5987 36.1249 56.6765 36.1485 56.8045 36.1485H57.2133C57.3301 36.1485 57.3884 36.1955 57.3884 36.2893Z" fill="#005697"/> <path d="M52.6187 14.7398H39.0664L37.6881 16.2935L33.2155 21.3349V21.3351L31.8372 22.8886H18.464L19.821 21.3153L20.4633 20.5706L21.8202 18.9973H15.6582C14.5325 18.9973 13.6113 19.943 13.6113 21.0987V25.5326C13.6113 26.6885 14.5325 27.6342 15.6582 27.6342H39.2492C40.3749 27.6342 41.9127 26.9318 42.6665 26.0733L46.235 22.0097L52.6187 14.7398Z" fill="#005697"/> <path d="M55.3418 10C56.4676 10 57.3887 10.9457 57.3887 12.1015V16.5353C57.3887 17.691 56.4676 18.6368 55.3418 18.6368H49.1999L50.5697 17.0753H50.5699L51.2491 16.3012L52.6189 14.7398H39.0667L31.8375 22.8945H18.3813L28.0314 11.9701L28.3966 11.5566C29.153 10.7005 30.6929 10 31.8186 10H55.3418V10Z" fill="#FBD500"/> </svg>
                  <svg width="60" height="40" viewBox="0 0 35 24" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="0.5" y="0.5" width="34" height="23" rx="3.5" fill="white" stroke="#D9D9D9"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M6.36273 7.74275C5.74216 7.74374 5.24008 8.18827 5.23887 8.73763V8.73766V15.3427V15.3427C5.23888 15.347 5.23892 15.3513 5.23899 15.3555C5.24004 15.4197 5.24794 15.4824 5.26205 15.5431C5.36743 15.9961 5.81972 16.3366 6.36273 16.3376H18.0559V16.3375V7.74279V7.74275H6.36273ZM6.36273 7H28.7418C29.826 7.00016 30.7043 7.77758 30.7047 8.73765V15.3427C30.7043 16.3024 29.826 17.0799 28.7418 17.0803H6.36273C5.27852 17.0799 4.40027 16.3024 4.3999 15.3427V8.73765C4.40027 7.77758 5.27852 7.00016 6.36273 7Z" fill="#0F3365"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M19.9697 14.2623H18.988V10.7321H19.8935V11.1861H19.9045C20.1008 10.8335 20.5155 10.6741 20.9628 10.6741C21.7483 10.6741 22.1789 11.3358 22.1789 11.9441C22.1789 12.6879 21.7262 13.3061 20.8808 13.3061C20.5372 13.3061 20.1662 13.1951 19.9807 12.8957H19.9697V14.2623ZM20.5701 12.6397C20.9408 12.6397 21.1645 12.3645 21.1645 11.9636C21.1645 11.6302 20.9517 11.3406 20.5701 11.3406C20.2099 11.3406 19.9697 11.6208 19.9697 11.9973C19.9697 12.3645 20.2427 12.6397 20.5701 12.6397ZM25.9408 14.2623C26.1428 14.3011 26.3445 14.3204 26.5518 14.3204C27.401 14.3204 27.6383 13.7744 27.8958 13.1819C27.9113 13.1462 27.9269 13.1104 27.9427 13.0746L28.9847 10.7321H28.0028L27.419 12.374H27.4082L26.7972 10.7321H25.7393L26.8897 13.3061C26.8193 13.5283 26.6337 13.6539 26.3941 13.6539C26.2573 13.6539 26.1372 13.6397 26.0066 13.6007L25.9408 14.2623ZM25.5749 13.33C25.5314 13.132 25.5202 12.9341 25.5202 12.736V11.7992C25.5202 11.0313 24.8931 10.7562 24.1676 10.7562C23.7474 10.7562 23.382 10.8091 23.0329 10.9349L23.0491 11.5239C23.3221 11.3888 23.6384 11.3356 23.9546 11.3356C24.3093 11.3356 24.5985 11.4274 24.6039 11.7704C24.4785 11.7509 24.3041 11.7362 24.1458 11.7362C23.6221 11.7362 22.6785 11.8283 22.6785 12.5961C22.6785 13.142 23.1803 13.3882 23.7422 13.3882C24.1458 13.3882 24.4186 13.2479 24.6421 12.9341H24.6528C24.6528 13.0107 24.6585 13.0873 24.6643 13.1649C24.6684 13.2194 24.6726 13.2743 24.6748 13.33H25.5749ZM23.5947 12.5334C23.5947 12.292 23.8565 12.2002 24.1893 12.2002C24.2936 12.2002 24.3952 12.205 24.4901 12.2096L24.4901 12.2096C24.5292 12.2114 24.5672 12.2132 24.6039 12.2146C24.6039 12.5091 24.3695 12.8089 23.9982 12.8089C23.7693 12.8089 23.5947 12.707 23.5947 12.5334Z" fill="#FFFFFE"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M10.4552 13.248H11.437V10.7321H10.4552V13.248ZM10.4552 10.3215H11.437V9.68405H10.4552V10.3215ZM13.8382 10.6741C13.9526 10.6741 14.0726 10.6886 14.1708 10.7029L14.1216 11.4273C14.0127 11.3984 13.9035 11.3984 13.7891 11.3984C13.3309 11.3984 13.0744 11.693 13.0744 12.1858V13.248H12.0927V10.7321H12.9873V11.1955H12.998C13.1672 10.877 13.4127 10.6741 13.8382 10.6741ZM17.5139 11.9926C17.5139 12.8233 16.7993 13.3061 15.8613 13.3061C14.9232 13.3061 14.2086 12.8233 14.2086 11.9926C14.2086 11.1569 14.9232 10.6741 15.8613 10.6741C16.7993 10.6741 17.5139 11.1569 17.5139 11.9926ZM15.2232 11.9926C15.2232 12.3645 15.4086 12.6975 15.8614 12.6975C16.3141 12.6975 16.4996 12.3645 16.4996 11.9926C16.4996 11.6158 16.3141 11.2826 15.8614 11.2826C15.4086 11.2826 15.2232 11.6158 15.2232 11.9926ZM8.88839 10.7321H9.77769V12.9537C9.77769 13.987 9.21043 14.3203 8.06493 14.3203C7.59591 14.3203 7.2086 14.2332 6.97942 14.1611L7.02864 13.4752C7.32857 13.6056 7.57947 13.6828 7.9886 13.6828C8.55596 13.6828 8.86128 13.4462 8.86128 12.9537V12.8182H8.85023C8.61586 13.1131 8.28863 13.248 7.89593 13.248C7.11583 13.248 6.63037 12.7268 6.63037 11.9828C6.63037 11.2342 7.02864 10.6741 7.91218 10.6741C8.33208 10.6741 8.67036 10.877 8.87772 11.1859H8.88839V10.7321ZM8.20138 11.3406C7.83589 11.3406 7.64498 11.6255 7.64498 11.9683C7.64498 12.3594 7.90683 12.5817 8.20138 12.5817C8.55034 12.5817 8.82863 12.321 8.82863 11.9345C8.82863 11.6543 8.6431 11.3406 8.20138 11.3406Z" fill="#D8232A"/> </svg>
                  <svg xmlns="http://www.w3.org/2000/svg" role="img" width="60" height="40" viewBox="0 0 38 24" aria-labelledby="pi-klarna"><title id="pi-klarna">Klarna</title><g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd"><path d="M35 0H3C1.3 0 0 1.3 0 3v18c0 1.7 1.4 3 3 3h32c1.7 0 3-1.3 3-3V3c0-1.7-1.4-3-3-3z" fill="#FFB3C7"/><path d="M35 1c1.1 0 2 .9 2 2v18c0 1.1-.9 2-2 2H3c-1.1 0-2-.9-2-2V3c0-1.1.9-2 2-2h32" fill="#FFB3C7"/><path d="M34.117 13.184c-.487 0-.882.4-.882.892 0 .493.395.893.882.893.488 0 .883-.4.883-.893a.888.888 0 00-.883-.892zm-2.903-.69c0-.676-.57-1.223-1.274-1.223-.704 0-1.274.547-1.274 1.222 0 .675.57 1.223 1.274 1.223.704 0 1.274-.548 1.274-1.223zm.005-2.376h1.406v4.75h-1.406v-.303a2.446 2.446 0 01-1.394.435c-1.369 0-2.478-1.122-2.478-2.507 0-1.384 1.11-2.506 2.478-2.506.517 0 .996.16 1.394.435v-.304zm-11.253.619v-.619h-1.44v4.75h1.443v-2.217c0-.749.802-1.15 1.359-1.15h.016v-1.382c-.57 0-1.096.247-1.378.618zm-3.586 1.756c0-.675-.57-1.222-1.274-1.222-.703 0-1.274.547-1.274 1.222 0 .675.57 1.223 1.274 1.223.704 0 1.274-.548 1.274-1.223zm.005-2.375h1.406v4.75h-1.406v-.303A2.446 2.446 0 0114.99 15c-1.368 0-2.478-1.122-2.478-2.507 0-1.384 1.11-2.506 2.478-2.506.517 0 .997.16 1.394.435v-.304zm8.463-.128c-.561 0-1.093.177-1.448.663v-.535H22v4.75h1.417v-2.496c0-.722.479-1.076 1.055-1.076.618 0 .973.374.973 1.066v2.507h1.405v-3.021c0-1.106-.87-1.858-2.002-1.858zM10.465 14.87h1.472V8h-1.472v6.868zM4 14.87h1.558V8H4v6.87zM9.45 8a5.497 5.497 0 01-1.593 3.9l2.154 2.97H8.086l-2.341-3.228.604-.458A3.96 3.96 0 007.926 8H9.45z" fill="#0A0B09" fillRule="nonzero"/></g></svg>
                  <svg width="60" height="40" viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg"> <rect x="0.5" y="0.5" width="59" height="39" rx="5.5" fill="white" stroke="#D9D9D9"/> <path fill-rule="evenodd" clip-rule="evenodd" d="M32.2379 13.5699L29.19 14.2058V11.8034L32.2379 11.1792V13.5699ZM19.852 12.5453L16.8892 13.1577L16.877 22.5909C16.877 24.3338 18.2249 25.6175 20.022 25.6175C21.0178 25.6175 21.7463 25.4408 22.1471 25.2288V22.8382C21.7585 22.9913 19.8399 23.533 19.8399 21.79V17.6093H22.1471V15.1009H19.8399L19.852 12.5453ZM52.2857 20.2944C52.2857 17.2796 50.78 14.9007 47.9021 14.9007C45.0121 14.9007 43.2636 17.2796 43.2636 20.2709C43.2636 23.8156 45.3279 25.6057 48.2907 25.6057C49.7357 25.6057 50.8286 25.2877 51.6543 24.8402V22.4849C50.8286 22.8853 49.8814 23.1326 48.6793 23.1326C47.5014 23.1326 46.4571 22.7322 46.3236 21.3425H52.2614C52.2614 21.2776 52.2658 21.1302 52.2708 20.9603L52.2708 20.9599L52.2709 20.9594C52.2777 20.7287 52.2857 20.457 52.2857 20.2944ZM46.2871 19.1756C46.2871 17.8449 47.1249 17.2913 47.8899 17.2913C48.6307 17.2913 49.4199 17.8449 49.4199 19.1756H46.2871ZM12.6757 17.4562C12.0322 17.4562 11.6436 17.6329 11.6436 18.0922C11.6436 18.5937 12.3123 18.8143 13.142 19.0879C14.4945 19.5341 16.2747 20.1213 16.2822 22.2965C16.2822 24.4045 14.5457 25.6175 12.02 25.6175C10.9757 25.6175 9.83429 25.4173 8.705 24.9462V22.1434C9.725 22.6851 11.0122 23.0855 12.02 23.0855C12.7 23.0855 13.1857 22.9089 13.1857 22.3671C13.1857 21.8117 12.4608 21.5578 11.5856 21.2512C10.2528 20.7844 8.57143 20.1956 8.57143 18.2335C8.57143 16.149 10.2107 14.9007 12.6757 14.9007C13.6836 14.9007 14.6793 15.0538 15.6872 15.4424V18.21C14.7643 17.7271 13.5986 17.4562 12.6757 17.4562ZM25.9237 15.9724L25.7294 15.1009H23.1065V25.4055H26.1422V18.4219C26.8587 17.5151 28.073 17.68 28.4494 17.8095V15.1009C28.0608 14.9596 26.6401 14.7005 25.9237 15.9724ZM29.1898 15.1009H32.2377V25.4055H29.1898V15.1009ZM36.1963 15.8193C36.6213 15.4424 37.3863 14.9007 38.5763 14.9007C40.7013 14.9007 42.7049 16.7614 42.717 20.1766C42.717 23.9099 40.7377 25.6057 38.5641 25.6057C37.4956 25.6057 36.852 25.17 36.4148 24.8638L36.4027 28.1966L33.367 28.8208V15.0891H36.0384L36.1963 15.8193ZM36.4148 22.4613C36.7062 22.7675 37.1312 23.0148 37.8477 23.0148C38.9648 23.0148 39.7177 21.8371 39.7177 20.2591C39.7177 18.7163 38.9527 17.5151 37.8477 17.5151C37.1555 17.5151 36.7184 17.7506 36.4027 18.0922L36.4148 22.4613Z" fill="#6461FC"/> </svg>
                </div>
                <div className="extra-info">
                  <div><svg stroke="none" fill="#4AD66D" strokeWidth="0" viewBox="0 0 512 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path></svg><div><h3>FREE SHIPPING</h3><p>Fast and Reliable Delivery!</p></div></div>
                  <div><svg stroke="none" fill="#4AD66D" strokeWidth="0" viewBox="0 0 512 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path></svg><div><h3>SECURE CHECKOUT</h3><p>10+ payment options!</p></div></div>
                  <div><svg stroke="none" fill="#4AD66D" strokeWidth="0" viewBox="0 0 512 512" height="24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z"></path></svg><div><h3>CUSTOMER IS KING</h3><p>Problems? Contact us!</p></div></div>
                </div>
              </div>
            </>
          )}
        </div>
      </FadeIn>

			<div className="description">
				<div>
					<h2>Description</h2>
					<p>{product.desc}</p>
				</div>
				<div>
					<h2>Fast Shipping</h2>
					<p>We have fast <b>free</b> shipping because we utilize the most reliable and efficient shipping carriers in the business. We have developed strong relationships with our carriers to ensure that our customers receive their orders as quickly and safely as possible. Our shipping team is also highly trained and experienced in selecting the best shipping option for each customer order.</p>
				</div>
				<div>
					<h2>Trustable & Safe</h2>
					<p>We use the latest security protocols to protect our customers’ personal and financial information and provide 256-bit SSL encryption to ensure that all transactions are secure. We also offer fraud protection and identity verification services to further protect our customers. Finally, our customer support team is available to help with any queries or issues that customers may have.</p>
				</div>
			</div>
      <Reviews id={params.id} />
    </div>
  );
};

export default Product;

const Price = styled.p`
  font-weight: bold;
  font-size: 25px;
  color: black;
  margin: 20px 0 20px 0;
`;

const OldPrice = styled.span`
	text-decoration: line-through;
	margin: 1rem 8px 1rem 0;
	color: gray;
	font-size: 20px;
`
