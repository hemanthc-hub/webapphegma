import React, { useState, useEffect } from 'react'
import "./Quickview.css"
import "./ProductScreen.css"
import { useParams, useNavigate } from 'react-router';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PRODUCT_DETAILS } from '../GraphQL/Queries';
import { CREATE_CHECKOUT_MUTATION, CHECKOUT_ADD_PRODUCT_LINE_MUTATION, UPDATE_WISHLIST_MUTATION } from '../GraphQL/Mutation';
import { Link } from "react-router-dom";
import Ratings from './Ratings';
import { Helmet } from 'react-helmet-async';
import { totalValue } from './decimalFunction';

const HomeQuickview = ({ setQuickviewOpenModal }) => {
	const navigate = useNavigate()
	const [currentImage, setCurrentImage] = useState('assets/images/products/zoom/Woodpecker Dpex III Apex Locator 001.jpg')
	const [product, setProducts] = useState({})
	const [description, setDescription] = useState('')
	const [setattributes, setattributeList] = useState([]);
	const [variantId, setVariantId] = useState("");
	const [addwishlist, setAddWishlist] = useState([])
	let { slug } = useParams()
	const [CreateCheckout] = useMutation(CREATE_CHECKOUT_MUTATION);
	const [updateWishlist] = useMutation(UPDATE_WISHLIST_MUTATION, {
		context: {
			headers: {
				Authorization: "JWT " + localStorage.getItem("token"),
			},
		},
	});
	const [addLineCheckout] = useMutation(CHECKOUT_ADD_PRODUCT_LINE_MUTATION);
	const [loader, setLoader] = useState("add to cart")
	const [purchaseNote, setPurchaseNote] = useState('')
	const [wishHeart, setWishHeart] = useState()


	useEffect(() => {
		if (!(localStorage.getItem("wishlistToken") === null || localStorage.getItem("wishlistToken") === undefined || localStorage.getItem("wishlistToken") === '')) {
		  setAddWishlist([])
		  let wishToken = localStorage.getItem("wishlistToken").replaceAll("[","").replaceAll("]","").replaceAll("'","").replaceAll(" ","")
		  for (let index = 0; index < wishToken.split(",").length; index++) {
			setAddWishlist((addwishlist) => [...addwishlist, wishToken.split(",")[index]])
		  }
		}
	  }, [])

	const setImage = (e) => {
		setCurrentImage(e.target.src)
	}

	// Replaced onCompleted with data + useEffect — onCompleted is unreliable
	// when Apollo serves results from cache (React 18 + Apollo v4 concurrent mode).
	const { loading, data: productData, refetch } = useQuery(GET_PRODUCT_DETAILS, {
		fetchPolicy: "network-only",
		variables: {
			slug: slug,
			channel: "default-channel"
		},
	})

	useEffect(() => {
		if (!productData?.product) return;
		const p = productData.product;
		setProducts(p);
		setattributeList(p.attributes);
		if (p.media?.[0]?.url) setCurrentImage(p.media[0].url);
		setDescription(p.description ?? '');
		if (p.variants?.[0]?.id) setVariantId(p.variants[0].id);
		setPurchaseNote(p.purchaseNote ?? '');
	}, [productData]);

	const onAddToCart = async e => {
		setLoader(<div className='loaderr'></div>)
		e.preventDefault();
		if (localStorage.getItem("cartToken") === null) {
			CreateCheckout({
				variables: {
					channel: 'default-channel',
					email: localStorage.getItem("user") !== null ? localStorage.getItem("email") : "hegmakart@gmail.com",
					lines: [
						{
							quantity: 1,
							variantId: variantId
						}
					]
				},
				onCompleted: data => {
					if (data.checkoutCreate.checkout !== null) {
						localStorage.setItem('cartToken', data.checkoutCreate.checkout.token);
					}
					window.dispatchEvent(new CustomEvent('cart-updated'));
					setLoader('add to cart')
				},
				onError: (err) => {
					console.error(err);
					setLoader('add to cart');
					localStorage.removeItem("cartToken");
				}
			});
		} else {
			addLineCheckout({
				variables: {
					token: localStorage.getItem("cartToken"),
					lines: [
						{
							quantity: 1,
							variantId: variantId
						}
					]
				},
				onCompleted: data => {
					if (data?.checkoutLinesAdd?.errors?.length > 0) {
						localStorage.removeItem("cartToken");
					}
					window.dispatchEvent(new CustomEvent('cart-updated'));
					setLoader('add to cart')
				},
				onError: (err) => {
					console.error(err);
					setLoader('add to cart');
					localStorage.removeItem("cartToken");
				}
			});
		}
	};

	const onAddToWishlist = async e => {
		e.preventDefault();
		const { id } = e.target;
		setWishHeart(id === variantId ? "added-wishlist" : "")
		if (!addwishlist.includes(id)) {
			setAddWishlist([...addwishlist, id])
			if(localStorage.getItem("wishlistToken")===null){
				localStorage.setItem("wishlistToken", JSON.stringify([id]));
			  }else{
				if(!localStorage.getItem("wishlistToken").includes(id)){
			  localStorage.setItem("wishlistToken",  JSON.stringify([
				...JSON.parse(localStorage.getItem("wishlistToken")),
				id,
			  ]));}}
			if (localStorage.getItem("token")) {
				updateWishlist({
				  variables: {
					input: {
					  wishlistToken: JSON.stringify([...addwishlist, id]),
					},
				  },
				});
			}
		  }
	};

	// Guard: wait until product is fully loaded. Checking product.id ensures
	// we don't render before the useEffect has had a chance to populate state.
	if (loading || !product.id) {
		return <h1>please wait loading...</h1>
	}

	// Safely parse description — it may be a JSON string or already an object
	let descriptionText = '';
	try {
		const obj = typeof description === 'string' && description
			? JSON.parse(description)
			: description;
		descriptionText = obj?.blocks?.[0]?.data?.text ?? '';
	} catch (e) {
		descriptionText = '';
	}

	return (
		<>
			<Helmet>
				<title>Hegmakart: {product.name}</title>
				<meta name="description" content={product.name} />
			</Helmet>
			<div className='modalBackground'>
				<div className='modalContainer'>
					<div className="titleCloseBtn">
						<Link to="/"> <button
							onClick={() => {
								setQuickviewOpenModal(false);
							}}
						>
							X
						</button>
						</Link>

					</div>
					<div className="col-lg-5 col-md-4 product-single-gallery">
						<div className="product-slider-container">
							<div className="">
								<div className="product-item">
									<img className="product-single-image"
										src={currentImage}
									/>
								</div>
							</div>
							{/* <!-- End .product-single-carousel --> */}
							<span className="prod-full-screen">
								<i className="icon-plus"></i>
							</span>
						</div>

						<div className="prod-thumbnail owl-dots">
							{(product.media ?? []).map((media, idx) => (
								<React.Fragment key={media.url ?? idx}>
									<div className="owl-dot">
										<img onClick={setImage} src={media.url} width="110" height="110"
											alt="product-thumbnail" />
									</div>
								</React.Fragment>
							))}
						</div>
					</div>



					<div className="col-lg-7 col-md-4 product-single-details">

						<h1 className="product-title" style={{ fontSize: '20px' }}>{product.name} </h1>



						<div className="ratings-container">
							<div className="">
								<span className="" style={{ width: '100%' }}><Ratings value={product.rating} /></span>
							</div>
							{!(product.rating == null || product.rating == 0) ?<a className="rating-link">{product.rating.toString().length > 1?product.rating.toFixed(1):product.rating} </a>:null}
						</div>
						{/* <!-- End .ratings-container --> */}
						{setattributes.map((attributes, idx) => (
							<React.Fragment key={attributes.attribute?.slug ?? idx}>
								{attributes.attribute.name === "Manufacturer" ? (
									<ul className="single-info-list">
										<li>
											MANUFACTURER:{" "}
											<strong>{attributes.values.length > 0 ? attributes.values[0].name : null}</strong>
										</li>
									</ul>
								) : null}
							</React.Fragment>
						))}
						<hr className="short-divider" />

						{!product.productType.hasVariants ? (
							<div className="price-box">
								<>
									{product.variants[0].originalPrice
										!==
										product.pricing.priceRange.start.net.amount ? (
										<>

											<span className="old-price">
												₹
												{
													totalValue(product.variants[0].weightedShipping !== null || product.variants[0].weightedShipping !== 0 ? product.variants[0].originalPrice - product.variants[0].weightedShipping : product.variants[0].originalPrice)
												}
											</span>
											<span className="new-price">
												₹{totalValue(product.pricing.priceRange.start.net.amount - product.variants[0].weightedShipping)}
											</span>
											{!(product.variants[0].weightedShipping === null || product.variants[0].weightedShipping === '0.00') ?
												<span style={{ color: "orangered", marginLeft: 10 }}>+ ₹ {totalValue(parseInt(product.variants[0].weightedShipping))} Weighted Delivery Charges</span> : null}

										</>
									) : (
										<>
											<span className="new-price">
												₹{totalValue(product.pricing.priceRange.start.net.amount)}
											</span>
											{!(product.variants[0].weightedShipping === null || product.variants[0].weightedShipping === '0.00') ?
												<span style={{ color: "blue", marginLeft: 10 }}> + ₹ {totalValue(parseInt(product.variants[0].weightedShipping))} Weighted Delivery Charges</span> : null}
										</>

									)}
								</>
							</div>
						) : (
							<div className="price-box">
								<span style={{ color: "grey", fontWeight: 500, marginLeft: 0 }} className="new-price">
									Starts from: <span style={{ fontFamily: "sans-serif", color: "black" }}> ₹{totalValue(product.pricing.priceRange.start.net.amount)}</span>
								</span>
							</div>
						)}
						{descriptionText && <p className='quickDescription'>{descriptionText}</p>}

						<div style={{
							display: 'flex',
							flexDirection: "column"
						}}>
							{!product.productType.hasVariants ?
								<><div style={{ paddingTop: 0, display: "flex" }} className="cartcontainr">
									<a onClick={onAddToCart} style={{ color: "white", minWidth: "130px" }} className="btn btn-dark save-change" title="Add to Cart">
										{loader}
									</a>

									{wishHeart !== "added-wishlist" ?
										<a style={{ cursor: "pointer" }} id={product.id} onClick={onAddToWishlist} className="btn-icon-wish add-wishlist"
											title="Add to Wishlist"><i className="icon-wishlist-2"></i><span id={product.id}>
												add to wishlist</span>
										</a>
										:
										<a style={{ cursor: "pointer" }} onClick={() => navigate("/wishlist")} className="btn-icon-wish add-wishlist"
											title="Add to Wishlist"><i className="icon-wishlist-2"></i><span id={product.id}>
												Browse wishlist</span>
										</a>
									}
								</div>
								</>
								:
								<div style={{ paddingTop: 0, }} className="cartcontainr">
									<Link to={`/product/${encodeURIComponent(product.slug)}`} style={{ color: "white", }} className="btn   btn-dark " title="Add to Cart">
										View Product Details
									</Link></div>
							}

							<p style={{ color: "orangered", marginTop: 10 }}>{purchaseNote}</p>
						</div>
						<div className="product-single-share mb-3">
						</div>

					</div>
				</div>
			</div>



		</>
	)
}

export default HomeQuickview
