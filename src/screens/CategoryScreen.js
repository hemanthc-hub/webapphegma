import React, { useState, useEffect } from 'react'
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import RecentlyViewed from "../components/RecentlyViewed/RecentlyViewed";
import { useQuery } from '@apollo/client/react';
import { MainApi, recentlyView } from '../components/FakeApi.js/FAkeApi';
import { GET_PRODUCT_LIST, GET_CATEGORIES_BANNERS, GET_FILTERS_LIST, GET_ATTRIBUTE_LIST } from '../GraphQL/Queries';
import { useParams, useLocation } from 'react-router-dom';
import Ratings from './Ratings';
import { Link } from 'react-router-dom';
import { Slider } from '@material-ui/core';
import CategoryQuickview from './CategoryQuickview'

const CategoryScreen = () => {
	const [gplProductData, setGplProductData] = useState([]);
	const [filterList, setFilterList] = useState([]);
	const [productSlugId, setProductSlugId] = useState([]);
	const [banner, setBanner] = useState()
	let { id } = useParams();
	const [quickviewOpen, setQuickviewOpen] = useState(false);
	const [filterSlug, setFilterSlug] = useState();
	const [attributes, setattributeList] = useState([]);
	const [categoryName, setCategoryName] = useState();
	const [subcategoryName, setSubCategoryName] = useState();
	const [categoryLevel, setCategoryLevel] = useState();
	const [priceinfo, setPriceInfo] = useState([])
	const [rangeVal, setRangeVal] = useState([0,1000])
	const [selectattributes, selectattributeList] = useState([]);
	const [subcategoryIdinfo, setSubCategoryIdInfo] = useState([])
	const search = useLocation().search;
	const categorydata=new URLSearchParams(search).get("c");
	///console.log(categorydata)
	
	//let location = useLocation()

	useEffect(() => {
		const sub = id;
		setFilterSlug(sub)
	}, []);

	const { } = useQuery(GET_CATEGORIES_BANNERS, {
		variables: {
			slug: id,
		}, 
		onCompleted: data => {
			// console.log(data.category.level)
			if(categorydata === null) {
				setProductSlugId(data.category.id)
			} else {
				setProductSlugId(categorydata.split(','))	
			}
			setSubCategoryName(data.category.name);
			setCategoryLevel(data.category.level);
			if(data.category.backgroundImage !== null) {
				setBanner(data.category.backgroundImage.url)
			}
			if(data.category.level !== 0) {
				setCategoryName(data.category.parent.name);
			}
		}
	})

	const { } = useQuery(GET_PRODUCT_LIST, {
		variables: {
			first: 12,
			channel: "default-channel",
			filter: { 
				categories: productSlugId,
				attributes: selectattributes
			}
		},
		onCompleted: data => {
			setGplProductData(data.products.edges);
			for (let index = 0; index < data.products.edges.length; index++) {
				for (let index1 = 0; index1 < data.products.edges[index].node.attributes.length; index1++) {
					for (let index2 = 0; index2 < data.products.edges[index].node.attributes[index1].values.length; index2++) {
						selectattributeList(selectattributes => [...selectattributes, data.products.edges[index].node.attributes[index1].values[index2].id])
					}
				}
			}
		}
	})

	const { } = useQuery(GET_FILTERS_LIST, {
		variables: {
			first: 20,
			level: 0,
			filter: { search: filterSlug }
		},
		onCompleted: data => {
			//console.log(data)
			setFilterList(data.categories.edges);
			for (let index = 0; index < data.categories.edges[0].node.children.edges.length; index++) {
				if(data.categories.edges[0].node.children.edges[index].node.products.totalCount > 0) {
					setSubCategoryIdInfo(subcategoryIdinfo => [...subcategoryIdinfo, data.categories.edges[0].node.children.edges[index].node.id]);
					for (let index1 = 0; index1 < data.categories.edges[0].node.children.edges[index].node.products.edges.length; index1++) {
						//console.log(data.categories.edges[0].node.children.edges[index].node.products.edges[index1].node.pricing.priceRange.start.gross.amount)
						setPriceInfo(priceinfo => [...priceinfo, data.categories.edges[0].node.children.edges[index].node.products.edges[index1].node.pricing.priceRange.start.gross.amount]);
					}
				}	
			}
			if(categorydata !== null) {
				setSubCategoryIdInfo(productSlugId);
			}
		}
	})

	const { } = useQuery(GET_ATTRIBUTE_LIST, {
		variables: {
		  first: 20, sortBy: {
			direction: "ASC",
			field: "NAME",
		  }
		},
		onCompleted: data => {
		 // console.log(data);
		  setattributeList(data.attributes.edges);
		}
	  })

	const handleCategoryFilter = (e) => {
        const { checked,id } = e.target;
		var url = window.location.href;  
		if (url.indexOf("?") > -1) {
			url = url.substring(0,url.indexOf("?"))
		} 
		// alert(checked)
        // Case 1 : The user checks the box
        if (checked) {
			// setSubCategoryIdInfo([...subcategoryIdinfo, id]);
			url += '?c=' + [...subcategoryIdinfo, id];
        }
    
        // Case 2  : The user unchecks the box
        else {
			// setSubCategoryIdInfo(subcategoryIdinfo.filter((e) => e !== id));
			url += '?c=' + subcategoryIdinfo.filter((e) => e !== id);
        }
		
		window.location.href = url;
		window.location.reload();
    }

	const handleAttributeFilter = (e) => {
        const { checked,id } = e.target;
		var url = window.location.href;  
		if (url.indexOf("?") > -1) {
			url = url.substring(0,url.indexOf("?"))
		} 
		// alert(checked)
        // Case 1 : The user checks the box
        if (checked) {
			url += '?attributedata=' + [...selectattributes, id];
        }
    
        // Case 2  : The user unchecks the box
        else {
			url += '?attributedata=' + selectattributes.filter((e) => e !== id);
        }
		
		window.location.href = url;
		window.location.reload();
    }

	const updateRangeVal=(e, data)=>{
		setRangeVal(data)
		//console.log(data)
	}

	const bgImage = {
		backgroundImage: { banner },
		backgroundSize: 'cover',
		backgroundRepeat: 'no-repeat',
		height: '160px',
	}

	return (
		<>
		  {quickviewOpen && <CategoryQuickview setQuickviewOpenModal={setQuickviewOpen}/>}
		<Header/>
			<main className="main">
				<div className="category-banner-container bg-gray">
					<div className="category-banner banner text-uppercase"
						style={bgImage}>

					</div>
				</div>

				<div className="container">
					<nav aria-label="breadcrumb" className="breadcrumb-nav">
						<ol className="breadcrumb">
							<li className="breadcrumb-item"><a href="/"><i className="icon-home"></i></a></li>
							<li className="breadcrumb-item"><a href="/">Home</a></li>
							{categoryLevel === 1?<li className="breadcrumb-item" aria-current="page">{categoryName}</li>:null}
							<li className="breadcrumb-item active" aria-current="page">{subcategoryName}{categoryName}</li>
						</ol>
					</nav>

					<div className="row">
						<div className="col-lg-9 main-content">
							<nav className="toolbox sticky-header" data-sticky-options="{'mobile': true}">
								<div className="toolbox-left">
									<a href="#" className="sidebar-toggle">
										<svg data-name="Layer 3" id="Layer_3"
											viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
											<line x1="15" x2="26" y1="9" y2="9" className="cls-1"></line>
											<line x1="6" x2="9" y1="9" y2="9" className="cls-1"></line>
											<line x1="23" x2="26" y1="16" y2="16" className="cls-1"></line>
											<line x1="6" x2="17" y1="16" y2="16" className="cls-1"></line>
											<line x1="17" x2="26" y1="23" y2="23" className="cls-1"></line>
											<line x1="6" x2="11" y1="23" y2="23" className="cls-1"></line>
											<path
												d="M14.5,8.92A2.6,2.6,0,0,1,12,11.5,2.6,2.6,0,0,1,9.5,8.92a2.5,2.5,0,0,1,5,0Z"
												className="cls-2"></path>
											<path d="M22.5,15.92a2.5,2.5,0,1,1-5,0,2.5,2.5,0,0,1,5,0Z" className="cls-2"></path>
											<path d="M21,16a1,1,0,1,1-2,0,1,1,0,0,1,2,0Z" className="cls-3"></path>
											<path
												d="M16.5,22.92A2.6,2.6,0,0,1,14,25.5a2.6,2.6,0,0,1-2.5-2.58,2.5,2.5,0,0,1,5,0Z"
												className="cls-2"></path>
										</svg>
										<span>Filter</span>
									</a>

									<div className="toolbox-item toolbox-sort">
										<label>Sort By:</label>

										<div className="select-custom">
											<select name="orderby" className="form-control">
												<option value="menu_order" selected="selected">Default sorting</option>
												<option value="popularity">Sort by popularity</option>
												<option value="rating">Sort by average rating</option>
												<option value="date">Sort by newness</option>
												<option value="price">Sort by price: low to high</option>
												<option value="price-desc">Sort by price: high to low</option>
											</select>
										</div>
										{/* <!-- End .select-custom --> */}


									</div>
									{/* <!-- End .toolbox-item --> */}
								</div>
								{/* <!-- End .toolbox-left --> */}

								<div className="toolbox-right">
									<div className="toolbox-item toolbox-show">
										<label>Show:</label>

										<div className="select-custom">
											<select name="count" className="form-control">
												<option value="12">12</option>
												<option value="24">24</option>
												<option value="36">36</option>
											</select>
										</div>
										{/* <!-- End .select-custom --> */}
									</div>
									{/* <!-- End .toolbox-item --> */}

									<div className="toolbox-item layout-modes">
										<a href="file:///E:/Webztechie/Hegma%20Dental/Hegma%20Kart/Hegma%20Kart/category.html" className="layout-btn btn-grid active" title="Grid">
											<i className="icon-mode-grid"></i>
										</a>
										<a href="file:///E:/Webztechie/Hegma%20Dental/Hegma%20Kart/Hegma%20Kart/category-list.html" className="layout-btn btn-list" title="List">
											<i className="icon-mode-list"></i>
										</a>
									</div>
									{/* <!-- End .layout-modes --> */}
								</div>
								{/* <!-- End .toolbox-right --> */}
							</nav>
							<div className="row">
								{gplProductData.map((value) => (

									<div className="col-6 col-sm-4 col-md-3 " key={value.node.id}>
										<div className="product-default inner-quickview inner-icon">
											<figure>
												<Link to={{pathname: `/product/${value.node.id}/${value.node.slug}`}}>
													<img src={value.node.media?.[0]?.url || "/assets/images/logo.svg"} width="280" height="280"
														alt="product" />
													<img src={value.node.media?.[0]?.url || "/assets/images/logo.svg"} width="280" height="280"
														alt="product" />
												</Link>

												{/* <div className="label-group">
													<div className="product-label label-hot">Hot</div>
													<div className="product-label label-sale">
														{console.log(value.node.pricing.discount.net)}
													</div>

												</div> */}
											</figure>

											<div className="product-details">
												<div className="category-wrap">
													<div className="category-list">
													<Link to={{pathname: `/product/${value.node.id}/${value.node.slug}`}}>{value.node.category.name}</Link>
													</div>
												</div>

												<h3 className="product-title"> 	<Link to={`/category/${value.node.id}`}>{value.node.name}</Link></h3>

												<div className="ratings-container">
													<div className="">
														<span className="" style={{ width: '100%' }}><Ratings value={value.node.rating} /></span>
														{/* <!-- End .ratings --> */}
														<span className="tooltiptext tooltip-top" >{value.node.id}</span>
													</div>
													{/* <!-- End .product-ratings --> */}
												</div>
												{/* <!-- End .product-container --> */}

												<div className="price-box">
													<span className="old-price">{value.node.pricing.priceRange.start.gross.amount}</span>
													<span className="product-price">{value.node.pricing.priceRange.start.gross.amount}</span>
												</div>
												{/* <!-- End .price-box --> */}

												<div className="product-action" style={{ textAlign: 'left' }}>
													<a href="wishlist.html" className="btn-icon-wish" title="wishlist"><i
														className="icon-heart"></i></a>
													<a href="product.html" className="btn-icon btn-add-cart"><i
														className="fa fa-arrow-right"></i><span>SELECT
															OPTIONS</span></a>
															<Link to={{pathname: `/category/${value.node.id}/${value.node.slug}`}} className="btn-quickview" onClick={() => {  setQuickviewOpen(true);}}>
															<i className="fas fa-external-link-alt"></i>
															</Link>
													{/* <a  className="btn-quickview"
														title="Quick View"><i className="fas fa-external-link-alt"></i></a> */}
												</div>
											</div>
											{/* <!-- End .product-details --> */}
										</div>
									</div>



								))}

							</div>


							<nav className="toolbox toolbox-pagination">
								<div className="toolbox-item toolbox-show">
									<label>Show:</label>

									<div className="select-custom">
										<select name="count" className="form-control">
											<option value="12">12</option>
											<option value="24">24</option>
											<option value="36">36</option>
										</select>
									</div>
									{/* <!-- End .select-custom --> */}
								</div>
								{/* <!-- End .toolbox-item --> */}

								<ul className="pagination toolbox-item">
									<li className="page-item disabled">
										<a className="page-link page-link-btn" href="#"><i className="icon-angle-left"></i></a>
									</li>
									<li className="page-item active">
										<a className="page-link" href="#">1 <span className="sr-only">(current)</span></a>
									</li>
									<li className="page-item"><a className="page-link" href="#">2</a></li>
									<li className="page-item"><a className="page-link" href="#">3</a></li>
									<li className="page-item"><span className="page-link">...</span></li>
									<li className="page-item">
										<a className="page-link page-link-btn" href="#"><i className="icon-angle-right"></i></a>
									</li>
								</ul>
							</nav>
						</div>
						{/* <!-- End .col-lg-9 --> */}
{/* categories */}
						<div className="sidebar-overlay"></div>
						<aside className="sidebar-shop col-lg-3 order-lg-first mobile-sidebar">
							<div className="sidebar-wrapper">
								<div className="widget">
									<h3 className="widget-title">
										<a data-toggle="collapse" href="#widget-body-2" role="button" aria-expanded="true"
											aria-controls="widget-body-2">Categoriest</a>
							

									</h3>

									<div className="collapse show" id="widget-body-2">
										<div className="widget-body">
											<ul className="cat-list">
												{filterList.map((filter) => (
													<><li>
														<a href="#widget-category-2" className="collapsed" data-toggle="collapse"
															role="button" aria-expanded="false"
															aria-controls="widget-category-2">
															<Link to={`/category/${filter.node.slug}`}>{filter.node.name}</Link>	<span className="products-count">({filter.node.products.totalCount})</span>
															<span className="toggle"></span>
														</a>
														<div className="collapse" id="widget-category-2">
															<ul className="cat-sublist">
																{filter.node.children.edges.map(subFilter => (
																	<>
																	{console.log(subcategoryIdinfo)}
																	{subFilter.node.products.totalCount > 0 ?
																	<li><span><input type="checkbox" checked={subcategoryIdinfo.includes(subFilter.node.id)} id={subFilter.node.id} onChange={handleCategoryFilter} /></span> <Link to={`/category/${filter.node.slug}/${subFilter.node.slug}`}>{subFilter.node.name}</Link><span className="products-count">({subFilter.node.products.totalCount})</span></li>:null}
																	
																	</>
																))}

															</ul>
														</div>
													</li>
													</>
												))}
											</ul>
										</div>
										{/* <!-- End .widget-body --> */}
									</div>
									{/* <!-- End .collapse --> */}
								</div>
								{/* <!-- End .widget --> */}

								<div className="widget">
									<h3 className="widget-title">
										<a data-toggle="collapse" href="#widget-body-3" role="button" aria-expanded="true"
											aria-controls="widget-body-3">Price</a>
									</h3>

									<div className="collapse show" id="widget-body-3">
										<div className="widget-body pb-0">
											<form action="#">
											<Slider style={{color:'#F39655'}}  value={rangeVal} onChange={updateRangeVal}/>
												{/* <!-- End .price-slider-wrapper --> */}

												<div
													className="filter-price-action d-flex align-items-center justify-content-between flex-wrap">
													<div className="filter-price-text">
														{priceinfo.sort}
														Price:
														<span>₹{priceinfo[0]} - ₹{priceinfo[priceinfo.length - 1]}</span>
													</div>
													{/* <!-- End .filter-price-text --> */}

													<button type="submit" className="btn btn-primary">Filter</button>
												</div>
												{/* <!-- End .filter-price-action --> */}
											</form>
										</div>
										{/* <!-- End .widget-body --> */}
									</div>
									{/* <!-- End .collapse --> */}
								</div>
								{/* <!-- End .widget --> */}

						        {attributes.map((attribute) => (
									<>
									{attribute.node.choices.totalCount > 0?
									<div className="widget">
										<h3 className="widget-title">
											<a data-toggle="collapse" href="#widget-body-2" role="button" aria-expanded="true"
												aria-controls="widget-body-2">{attribute.node.name}<span className="products-count">({attribute.node.choices.totalCount})</span></a>
										</h3>

										<div className="collapse show" id="widget-body-2">
											<div className="widget-body">
												<ul className="cat-list">
												{attribute.node.choices.edges.map((choice) => (
													<>
													{selectattributes.includes(choice.node.id)?
													<li className='newww'>
														<span><input type="checkbox" checked={selectattributes.includes(choice.node.id)} id={choice.node.id} onChange={handleAttributeFilter} /></span>
														<a href="#widget-category-1" data-toggle="collapse" role="button"
															aria-expanded="true" aria-controls="widget-category-1">
															{choice.node.name}
														</a>
													</li>:null}
													</>
												))}
												</ul>
											</div>
											{/* <!-- End .widget-body --> */}
										</div>
										{/* <!-- End .collapse --> */}
									</div>:null}
									</>
								))}

							</div>

							{/* <!-- End .widget --> */}

							{/* <!-- End .sidebar-wrapper --> */}
						</aside>

						{/* <!-- End .col-lg-3 --> */}
					</div>
					{/* <!-- End .row --> */}
				</div>
				{/* <!-- End .container --> */}

				<RecentlyViewed />
				<div className="mb-4"></div>
				{/* <!-- margin --> */}

			</main>
			<Footer />
		</>
	)
}

export default CategoryScreen
