import React, { useState, useEffect } from 'react'
import "./Quickview.css"
import { useParams } from 'react-router';
import { useQuery } from '@apollo/client/react';
import { GET_PRODUCT_DETAILS } from '../GraphQL/Queries';
import { Link } from "react-router-dom";
import Ratings from './Ratings';

const CategoryQuickview = ({ setQuickviewOpenModal }) => {

	const [currentImage, setCurrentImage] = useState('assets/images/products/zoom/Woodpecker Dpex III Apex Locator 001.jpg')
	const [product, setProducts] = useState({})
	const [description, setDescription] = useState('')
	const [variantId, setVariantId] = useState("");
	let { pid } = useParams()

	const setImage = (e) => {
		setCurrentImage(e.target.src)
	}

	// Replaced onCompleted with data + useEffect — reliable with Apollo v4 + React 18
	const { loading, data: productData } = useQuery(GET_PRODUCT_DETAILS, {
		fetchPolicy: "network-only",
		variables: {
			id: pid,
			channel: "default-channel"
		},
	});

	useEffect(() => {
		if (!productData?.product) return;
		const p = productData.product;
		setProducts(p);
		if (p.thumbnail?.url) setCurrentImage(p.thumbnail.url);
		setDescription(p.description ?? '');
		if (p.variants?.[0]?.id) setVariantId(p.variants[0].id);
	}, [productData]);

	// Guard: wait for product to be populated
	if (loading || !product.id) {
		return <h1>please wait loading...</h1>
	}

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
							<div className="label-group">
								<div className="product-label label-sale">
									-16%
								</div>
							</div>

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
							<a className="rating-link">( {product.rating} )</a>
						</div>
						{/* <!-- End .ratings-container --> */}
						<ul className="single-info-list">
							<li>
								MANUFACTURER: <strong>WOOD PACKER</strong>
							</li>
						</ul>
						<hr className="short-divider" />

						<div className="price-box">
							<span className="old-price">₹{product.pricing?.priceRange?.start?.gross?.amount}</span>
							<span className="new-price">₹{product.pricing?.priceRange?.start?.gross?.amount}</span>
						</div>
						{descriptionText && <p>{descriptionText}</p>}

						<div className="cartcontainr">
							<a className="btn btn-dark " title="Add to Cart">Add to Cart</a>
						</div>

						<div className="sociall">
							<div className="product-single-share mb-3">
								<label className="sr-only">Share:</label>
								<a className="btn-icon-wish add-wishlist" title="Add to Wishlist"><i
									className="icon-wishlist-2"></i><span>Add to
									Wishlist</span></a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default CategoryQuickview
