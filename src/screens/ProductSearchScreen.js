import React, { useState, useEffect } from 'react'
import { totalValue } from './decimalFunction';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CatalogResultsToolbar from '../components/Catalog/CatalogResultsToolbar';
import FilterSidebar from '../components/Catalog/FilterSidebar';
import ProductGrid from '../components/Catalog/ProductGrid';
import RecentlyViewed from "../components/RecentlyViewed/RecentlyViewed";
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_PRODUCT_DETAILS, GET_PRODUCT_LIST, GET_CATEGORIES_BANNERS, GET_FILTERS_LIST, GET_ATTRIBUTE_LIST, COLLECTION_DETAILS, GET_PRODUCT_Types, GET_CHECKOUT_BY_TOKEN } from '../GraphQL/Queries';
import { CHECKOUT_ADD_PRODUCT_LINE_MUTATION, CREATE_CHECKOUT_MUTATION, CHECKOUT_LINE_UPDATE, UPDATE_WISHLIST_MUTATION } from '../GraphQL/Mutation';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Ratings from './Ratings';
import { Link } from 'react-router-dom';
import { Slider } from '@material-ui/core';
import "./ProductSearchScreen.css"
import "./Quickview.css"
// import "./HomeScreen.css"
import { DirectionEnum } from '../components/Enum/direction.ts';
import { FieldEnum } from '../components/Enum/field.ts';
import { ImCross } from "react-icons/im";
import { Helmet } from 'react-helmet-async';
import { MdOutlineSearchOff, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { FaBlog } from 'react-icons/fa';



const ProductSearchScreen = () => {
	const location = useLocation();
	const navigate = useNavigate()
	//console.log("location.pathname",location.pathname);
	const [sidebarToggle, setSidebarToggle] = useState(false);
	const [viewMode, setViewMode] = useState("grid");
	const [showCategoryList, setShowCategoryList] = useState(false);
	const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
	const [gplProductData, setGplProductData] = useState([]);
	const [gplProductData1, setGplProductData1] = useState([]);
	const [filterList, setFilterList] = useState([]);
	const [productSlugId, setProductSlugId] = useState([]);
	const [productPagingData, setProductPagingData] = useState([]);
	const [bannerr, setBanner] = useState()
	let { id } = useParams();
	let { psearchData } = useParams();
	let { productType } = useParams();
	let { cosearchData } = useParams();
	let { attsearchData } = useParams();
	const [filterSlug, setFilterSlug] = useState();
	const [attributes, setattributeList] = useState([]);
	const [collectionId, setCollectionId] = useState();
	const [categoryName, setCategoryName] = useState();
	const [categorySlug, setCategorySlug] = useState();
	const [subcategoryName, setSubCategoryName] = useState();
	const [categoryLevel, setCategoryLevel] = useState();
	const [priceinfo, setPriceInfo] = useState([])
	const [rangeVal, setRangeVal] = useState([priceinfo[0], priceinfo[priceinfo.length - 1]])
	const [selectattributes, selectattributeList] = useState([]);
	const [selectattributesdata, selectattributeDataList] = useState([]);
	const [subcategoryIdinfo, setSubCategoryIdInfo] = useState([])
	const [productSearchField, setProductSearchField] = useState(false)
	const [collectionSearchField, setCollectionSearchField] = useState(false)
	const [categorySearchField, setCategorySearchField] = useState(false)
	const [productTypeSearchField, setProductTypeSearchField] = useState(false)
	const [attributeSearchField, setAttributeSearchField] = useState(false)
	const [attributeCaseMap, setAttributeCaseMap] = useState({})
	const [priceRangeMinValue, setPriceRangeMinValue] = useState(priceinfo[0])
	const [priceRangeMaxValue, setPriceRangeMaxValue] = useState(priceinfo[priceinfo.length - 1])
	const search = useLocation().search;
	let categorydata = new URLSearchParams(search).get("c");
	let attributedata = new URLSearchParams(search).get("a");
	let sortdata = new URLSearchParams(search).get("s");
	let countdata = new URLSearchParams(search).get("co") || 72;
	const [currentImage, setCurrentImage] = useState('assets/images/products/zoom/Woodpecker Dpex III Apex Locator 001.jpg')
	const [product, setProducts] = useState({})
	const [setattributes1, setattributeList1] = useState([]);
	const [CreateCheckout] = useMutation(CREATE_CHECKOUT_MUTATION);
	const [updateWishlist] = useMutation(UPDATE_WISHLIST_MUTATION, {
		context: {
			headers: {
				Authorization: "JWT " + localStorage.getItem("token"),
			},
		},
	});
	const [variantId, setVariantId] = useState("");
	const [quickviewOpen, setQuickviewOpen] = useState(false)
	useEffect(() => {
		const handlePopState = () => setQuickviewOpen(false);
		window.addEventListener('popstate', handlePopState);
		return () => window.removeEventListener('popstate', handlePopState);
	}, []);
	const [collectionName, setCollectionName] = useState("");
	const [directionSort, setDirectionSort] = useState(false)
	const [fieldSort, setFieldSort] = useState(false)
	const [fieldSort1, setFieldSort1] = useState(false)
	const [fieldSort2, setFieldSort2] = useState(false)
	const [isFirst, setIsFirst] = useState(true)
	const [after, setAfter] = useState(false)
	const [before, setBefore] = useState(false)
	const [afterData, setAfterData] = useState("");
	const [beforeData, setBeforeData] = useState("");
	const [firstCursor, setFirstCursor] = useState("");
	const [lastCursor, setLastCursor] = useState("");
	const [collapseFilter, setCollapseFilter] = useState({})
	const [quickViewId, setQuickViewId] = useState()
	const [productNotFound, setProductNotFound] = useState(false)
	const [previousId, setPreviousId] = useState()
	const [getPreviousId, setGetPreviousId] = useState()
	const [suggestionProductType, setSuggestionProductType] = useState([])
	const [addwishlist, setAddWishlist] = useState([])
	const [purchaseNote, setPurchaseNote] = useState('')
	const isTopDealsPage = location.pathname.replace(/\/+$/, "") === "/top-deals-and-featured-products";
	const isDealsCollection = !psearchData && (
		isTopDealsPage ||
		(collectionSearchField && (
			(collectionName || '').toLowerCase().includes('top deals') ||
			(collectionName || '').toLowerCase().includes('offer') ||
			(collectionName || '').toLowerCase().includes('deal') ||
			(cosearchData || '').toLowerCase().includes('deal') ||
			(cosearchData || '').toLowerCase().includes('offer')
		))
	);
	const isFeaturedArrivalsPage = new URLSearchParams(location.search).get("view") === "featured-clinical-arrivals";
	const rawSearchTerm = psearchData ? decodeURIComponent(psearchData).replace(/\+/g, " ").replace(/- /g, "").trim() : "";
	const resolvedSearchQuery = rawSearchTerm.toLowerCase() === "all" ? "" : rawSearchTerm.toLowerCase() === "spindo" ? "Spin Endo Files" : rawSearchTerm;
	const displaySearchTerm = rawSearchTerm.toLowerCase() === "spindo" ? "Spin Endo Files" : rawSearchTerm;
	const topDealsTitle = "Top Deals & Featured Products";
	const featuredArrivalsTitle = "Featured Clinical Arrivals";
	const routeCategoryTitle = id
		? id.split("-").filter(Boolean).map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")
		: "All Products";
	const selectedCategoryNames = [];
	subcategoryIdinfo.forEach((selectedValue) => {
		for (const categoryEdge of filterList) {
			const category = categoryEdge.node;
			if (category.id === selectedValue || category.slug === selectedValue) {
				selectedCategoryNames.push(category.name);
				return;
			}
			for (const childEdge of category.children?.edges || []) {
				const child = childEdge.node;
				if (child.id === selectedValue || child.slug === selectedValue) {
					selectedCategoryNames.push(child.name);
					return;
				}
			}
		}
	});
	const categoryPageTitle = isTopDealsPage
		? topDealsTitle
		: isFeaturedArrivalsPage
			? featuredArrivalsTitle
			: selectedCategoryNames.length > 0
				? selectedCategoryNames[selectedCategoryNames.length - 1]
				: id !== undefined
					? subcategoryName || categoryName || routeCategoryTitle
					: psearchData !== undefined
						? displaySearchTerm
						: attsearchData !== undefined
							? attsearchData.replace("-", " ")
							: collectionName || "All Products";
	let attributesArrObj = [];
	const [updateLineCheckout] = useMutation(CHECKOUT_LINE_UPDATE);
	const [wishlist, setWishlist] = useState([])
	const [wishHeart, setWishHeart] = useState()
	const [addLineCheckout] = useMutation(CHECKOUT_ADD_PRODUCT_LINE_MUTATION);
	const [checkWishlist, setCheckWishlist] = useState([])
	//console.log("previusId",previousId,"productType",productType,"routesid",id,"psearchData",psearchData,"categorydata",categorydata)
  useEffect(() => {
    let wt = [];
    try {
      wt = JSON.parse(localStorage.getItem('wishlistToken')) || [];
    } catch(e) {}
    setCheckWishlist(wt);
    setWishlist(wt);
  }, []);
	const setImage = (e) => {
		setCurrentImage(e.target.src)
	}

	if (categorydata === null) {
		categorydata = '';
	}
	if (attributedata === null) {
		attributedata = '';
	}
	if (sortdata === null) {
		sortdata = '';
	}
	if (countdata === null) {
		countdata = 72;
	}
	// removed pagingdata and cursordata checks
	// attributesArrObj pushing removed as we will map directly in the query.
	if (psearchData !== undefined) {
		if (psearchData.includes('- ')) {
			psearchData = psearchData.replace('- ', '')
		}
	}

	{ priceinfo.sort(function (a, b) { return a - b }) }

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [id, cosearchData, psearchData, attsearchData, productType]);

	useEffect(() => {
		const sub = id;
		setFilterSlug(sub)
		if (id !== undefined) {
			setSubCategoryName("");
			setCategoryName(routeCategoryTitle);
		}
		if (!(localStorage.getItem("wishlistToken") === null || localStorage.getItem("wishlistToken") === undefined || localStorage.getItem("wishlistToken") === '')) {
			setAddWishlist([])
			let wishToken = localStorage.getItem("wishlistToken").replaceAll("[", "").replaceAll("]", "").replaceAll("'", "").replaceAll(" ", "")
			for (let index = 0; index < wishToken.split(",").length; index++) {
				setAddWishlist((addwishlist) => [...addwishlist, wishToken.split(",")[index]])
			}
		}
		if (id !== undefined) {
			setCategorySearchField(true)
			setProductTypeSearchField(false)
			setSubCategoryIdInfo([id]);
		}
		if (productType !== undefined) {
			setProductTypeSearchField(true)
			setProductSearchField(false)
			setCollectionSearchField(false)
			setCategorySearchField(false)
		}
		if (psearchData !== undefined) {
			setProductSearchField(true)
			setCollectionSearchField(false)
			setProductTypeSearchField(false)
			setCategorySearchField(false)
		}

		if (cosearchData !== undefined) {
			setProductSearchField(false)
			setCollectionSearchField(true)
			setProductTypeSearchField(false)
			setCategorySearchField(false)
		} else {
			setCollectionName("")
			setCollectionId(undefined)
		}
		if (attsearchData !== undefined) {
			setProductSearchField(false)
			setCollectionSearchField(false)
			setCategorySearchField(false)
			setProductTypeSearchField(false)
			setAttributeSearchField(true)
			const upperAtt = attsearchData.toUpperCase().replace(/\s+/g, '-');
			selectattributeDataList((prev) => {
				if (!prev.includes(upperAtt)) return [...prev, upperAtt];
				return prev;
			});
		}
		
		if (categorydata !== '') {
			const catArr = categorydata.split(',');
			setProductSlugId(catArr.slice(0, 1));
			setProductSearchField(false);
			setCollectionSearchField(false);
			setCategorySearchField(true);
			setProductTypeSearchField(false);
			setSubCategoryIdInfo(catArr.slice(0, 1));
		} else {
			setProductSlugId([]);
			if (id === undefined) {
				setSubCategoryIdInfo([]);
			}
		}
		if (attributedata !== '') {
			selectattributeDataList((prev) => Array.from(new Set([...prev, ...attributedata.split(',')])));
			setProductSearchField(false)
			setCollectionSearchField(false)
			setProductTypeSearchField(false)
			setAttributeSearchField(true)
		}
		if (sortdata === 'R') {
			setDirectionSort(true);
			setFieldSort(true);
			setFieldSort1(false);
			setFieldSort2(false);
		} else if (sortdata === 'D') {
			setDirectionSort(true);
			setFieldSort(false);
			setFieldSort1(false);
			setFieldSort2(true);
		} else if (sortdata === 'PL') {
			setDirectionSort(false);
			setFieldSort(false);
			setFieldSort1(true);
			setFieldSort2(false);
		} else if (sortdata === 'PH') {
			setDirectionSort(true);
			setFieldSort(false);
			setFieldSort1(true);
			setFieldSort2(false);
		} else {
			// Default / PR (Priority)
			setDirectionSort(false);
			setFieldSort(false);
			setFieldSort1(false);
			setFieldSort2(false);
		}

	}, [psearchData, productType, id, categorydata, attributedata, sortdata, attsearchData, cosearchData]);


	const { refetch: refetch1, data: categoryBannerData } = useQuery(GET_CATEGORIES_BANNERS, {
		fetchPolicy: "cache-first",
		skip: !id,
		variables: { slug: id },
	});
	useEffect(() => {
		if (!categoryBannerData?.category) return;
		const cat = categoryBannerData.category;
		if (id && cat.slug !== id && cat.id !== id) return;
		setSubCategoryName(cat.name);
		setCategoryLevel(cat.level);
		if (cat.backgroundImage !== null) {
			setBanner(cat.backgroundImage.url);
		}
		if (cat.level !== 0) {
			setCategoryName(cat.parent?.name);
			setCategorySlug(cat.parent?.slug);
		}
		
		if (id && cat.id) {
			setSubCategoryIdInfo([cat.id]);
		}
	}, [categoryBannerData, id]);

	const { data: productTypesData } = useQuery(GET_PRODUCT_Types, {
		fetchPolicy: "cache-first",
		skip: !productType,
		variables: { first: 5, channel: "default-channel", filter: { search: productType } },
	});
	useEffect(() => {
		if (!productTypesData?.productTypes?.edges) return;
		setSuggestionProductType([]);
		productTypesData.productTypes.edges.forEach(edge => {
			setSuggestionProductType(pre => [...pre, edge.node.id]);
		});
	}, [productTypesData]);

	const { data: collectionDetailsData } = useQuery(COLLECTION_DETAILS, {
		fetchPolicy: "cache-first",
		skip: !cosearchData,
		variables: { slug: cosearchData, channel: 'default-channel' },
	});
	useEffect(() => {
		if (!collectionDetailsData?.collection) return;
		setCollectionName(collectionDetailsData.collection.name);
		setCollectionId(collectionDetailsData.collection.id);
	}, [collectionDetailsData]);
	useEffect(() => {
		console.log("Dev Log - Search Filters:", { collectionSearchField, productSearchField, categorySearchField, attributeSearchField, productTypeSearchField });
	}, [collectionSearchField, productSearchField, categorySearchField, attributeSearchField, productTypeSearchField]);
	// if   if  if
	const resolveCategoryIds = (slugsOrIds) => {
		if (!slugsOrIds || !slugsOrIds.length) return [];
		return slugsOrIds.map(val => {
			if (categoryBannerData?.category) {
				if (categoryBannerData.category.slug === val || categoryBannerData.category.id === val) {
					return categoryBannerData.category.id;
				}
			}
			if (filterList && filterList.length > 0) {
				for (const edge of filterList) {
					if (edge.node.slug === val || edge.node.id === val) return edge.node.id;
					if (edge.node.children && edge.node.children.edges) {
						for (const child of edge.node.children.edges) {
							if (child.node.slug === val || child.node.id === val) return child.node.id;
						}
					}
				}
			}
			return val;
		});
	};

	const resolveAttributeFilters = () => {
		if (!attributeSearchField || !selectattributesdata || selectattributesdata.length === 0) return [];
		
		if (!attributes || attributes.length === 0) {
			return [{ slug: "manufacturer", values: selectattributesdata.flatMap(attr => attributeCaseMap[attr] || [attr]) }];
		}

		const filterMap = {};

		for (const attr of attributes) {
			const slug = attr.node.slug;
			const selectedValues = [];
			
			if (attr.node.choices && attr.node.choices.edges) {
				for (const choice of attr.node.choices.edges) {
					const choiceName = choice.node.name;
					if (selectattributesdata.includes(choiceName)) {
						const mappedValues = attributeCaseMap[choiceName] || [choiceName];
						selectedValues.push(...mappedValues);
					}
				}
			}
			
			if (selectedValues.length > 0) {
				filterMap[slug] = (filterMap[slug] || []).concat(selectedValues);
			}
		}

		const mappedChoicesFound = Object.values(filterMap).flat();
		const missingChoices = selectattributesdata.filter(choice => 
			!mappedChoicesFound.includes(choice) && 
			!mappedChoicesFound.some(val => attributeCaseMap[choice]?.includes(val))
		);

		if (missingChoices.length > 0) {
			filterMap["manufacturer"] = (filterMap["manufacturer"] || []).concat(
				missingChoices.flatMap(choice => attributeCaseMap[choice] || [choice])
			);
		}

		return Object.keys(filterMap).map(slug => ({
			slug,
			values: Array.from(new Set(filterMap[slug]))
		}));
	};

	const { loading: loading1, data: productList, fetchMore } = useQuery(GET_PRODUCT_LIST, {
		fetchPolicy: "cache-first",
		variables: {
			first: Number(countdata),
			after: null,
			channel: "default-channel",
			sortBy: {
				direction: directionSort ? DirectionEnum.DESC : DirectionEnum.ASC,
				field: fieldSort ? FieldEnum.RATING : fieldSort1 ? FieldEnum.PRICE : fieldSort2 ? FieldEnum.PUBLICATION_DATE : FieldEnum.PRIORITY
			},
			filter: {
				collections: collectionSearchField && collectionId ? [collectionId] : [],
				search: resolvedSearchQuery || "",
				categories: categorySearchField ? resolveCategoryIds(subcategoryIdinfo) : [],
				attributes: resolveAttributeFilters(),
				productTypes: productTypeSearchField ? suggestionProductType : [],
				...(priceRangeMinValue !== undefined || priceRangeMaxValue !== undefined
					? { price: { gte: priceRangeMinValue, lte: priceRangeMaxValue } }
					: {})
			}
		},
	});

	const dynamicAttributes = React.useMemo(() => {
		if (!attributes || !productList?.products?.edges) return attributes;
		
		const availableChoices = new Set();
		productList.products.edges.forEach(edge => {
			const productAttrs = edge.node.attributes;
			if (productAttrs) {
				productAttrs.forEach(attr => {
					attr.values.forEach(val => {
						const upperName = val.name.trim().toUpperCase().replace(/\s+/g, '-');
						availableChoices.add(upperName);
					});
				});
			}
		});

		return attributes.map(attr => {
			if (!attr.node.choices) return attr;
			
			const filteredEdges = attr.node.choices.edges.filter(choice => 
				availableChoices.has(choice.node.name) || (selectattributesdata || []).includes(choice.node.name)
			);
			
			return {
				...attr,
				node: {
					...attr.node,
					choices: {
						...attr.node.choices,
						edges: filteredEdges
					}
				}
			};
		}).filter(attr => attr.node.choices && attr.node.choices.edges.length > 0);
	}, [attributes, productList, selectattributesdata]);

	// else else else

	useEffect(() => {
		const edgesCount = productList?.products?.edges?.length || 0;
		console.log("Dev Log - ProductSearchScreen search query executed:", {
			psearchData,
			resolvedSearchQuery,
			productCount: productList?.products?.totalCount,
			edgesCount,
			isDealsCollection
		});
		if (edgesCount === 0) {
			setProductNotFound(true);
		} else {
			setProductNotFound(false);
		}
	}, [productList, psearchData, resolvedSearchQuery, isDealsCollection]);

	const { loading: loading3, data: filtersData } = useQuery(GET_FILTERS_LIST, {
		variables: { first: 20, level: 0 },
	});
	useEffect(() => {
		if (!filtersData?.categories?.edges) return;
		setFilterList(filtersData.categories.edges);
	}, [filtersData]);

	const { data: attributeListData } = useQuery(GET_ATTRIBUTE_LIST, {
		variables: { first: 100, sortBy: { direction: "ASC", field: "NAME" } },
	});
	useEffect(() => {
		if (attributeListData?.attributes?.edges) {
			const newEdges = JSON.parse(JSON.stringify(attributeListData.attributes.edges));
			const caseMap = {};

			newEdges.forEach(attrEdge => {
				if (!attrEdge.node.choices || !attrEdge.node.choices.edges) return;
				const choices = attrEdge.node.choices.edges;
				const uniqueChoices = {};

				choices.forEach(choiceEdge => {
					const originalName = choiceEdge.node.name;
					const originalSlug = choiceEdge.node.slug;
					const upperName = originalName.trim().toUpperCase().replace(/\s+/g, '-');

					if (!uniqueChoices[upperName]) {
						uniqueChoices[upperName] = { ...choiceEdge };
						uniqueChoices[upperName].node.name = upperName;
						caseMap[upperName] = [];
					}
					if (!caseMap[upperName].includes(originalSlug)) {
						caseMap[upperName].push(originalSlug);
					}
				});

				attrEdge.node.choices.edges = Object.values(uniqueChoices);
			});

			setAttributeCaseMap(caseMap);
			setattributeList(newEdges);
		}
	}, [attributeListData]);

	const onAddToCart = async (e) => {

		// setLoader(true);

		e.preventDefault();

		const { id } = e.target;

		if (localStorage.getItem("cartToken") === null) {
			CreateCheckout({
				variables: {
					channel: "default-channel",
					email: localStorage.getItem("user") !== null ? localStorage.getItem("email") : "hegmakart@gmail.com",
					lines: [
						{
							quantity: 1,
							variantId: id,
						},
					],
				},
				onCompleted: (data) => {
					//console.log(data);
					if (data.checkoutCreate.checkout !== null) {
						localStorage.setItem("cartToken", data.checkoutCreate.checkout.token);
						window.dispatchEvent(new CustomEvent('cart-updated'));
					}
				},
				onError: (err) => {
					console.error(err);
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
							variantId: id,
						},
					],
				},
				onCompleted: (data) => {
					if (data?.checkoutLinesAdd?.errors?.length > 0) {
						localStorage.removeItem("cartToken");
					}
					window.dispatchEvent(new CustomEvent('cart-updated'));
				},
				onError: (err) => {
					console.error(err);
					localStorage.removeItem("cartToken");
				}
			});
		}
	};


	const onAddToWishlist = (e) => {

		const { id } = e.target;
		if (!wishlist.includes(id)) {
			setWishlist([...wishlist, id])
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
					onCompleted: (data) => {
						console.log("Added to Wishlist DB", data);
					},
				});
			}
		}
		setWishHeart(id === variantId ? "added-wishlist" : "")
	};

	const removeWishlist = (e) => {
		const { id } = e.target;
		if (wishlist.includes(id)) {
			let unWishlist = wishlist.filter((item) => item !== id);
			setWishlist(unWishlist)
			setAddWishlist(unWishlist)
			localStorage.setItem("wishlistToken", JSON.stringify(unWishlist));
			if (localStorage.getItem("token")) {
				updateWishlist({
					variables: {
						input: {
							wishlistToken: JSON.stringify(unWishlist),
						},
					},
					onCompleted: (data) => {
						console.log("Removed from Wishlist DB", data);
					},
				});
			}
			console.log("REMOVE TO WISHLIST")
		}

	}
	const updateFilterParams = (updates) => {
		const params = new URLSearchParams(location.search);
		Object.entries(updates).forEach(([key, val]) => {
			if (val === undefined || val === null || val === '') {
				params.delete(key);
			} else {
				params.set(key, String(val));
			}
		});
		navigate({ pathname: location.pathname, search: params.toString() }, { replace: true });
	};

	const handleToggleCategory = (catId, slug) => {
		const isCurrentlySelected = subcategoryIdinfo && (subcategoryIdinfo.includes(catId) || subcategoryIdinfo.includes(slug));
		const newCategories = isCurrentlySelected ? [] : [slug || catId];
		console.log("Dev Log - Category toggle clicked:", { catId, slug, currentSelected: subcategoryIdinfo, nextSelected: newCategories });
		setSubCategoryIdInfo(newCategories);
		updateFilterParams({ c: newCategories.join(',') });
	};

	const handleToggleAttribute = (attrId, attrSlug, choiceName) => {
		let newAttrs;
		if (selectattributesdata && selectattributesdata.includes(choiceName)) {
			newAttrs = selectattributesdata.filter((e) => e !== choiceName && e !== attrId);
		} else {
			newAttrs = [...(selectattributesdata || []), choiceName];
		}
		selectattributeDataList(newAttrs);
		updateFilterParams({ a: newAttrs.join(',') });
	};

	const handleSortChange = (newSort) => {
		updateFilterParams({ s: newSort });
	};

	const handleCountChange = (newCount) => {
		updateFilterParams({ co: newCount });
	};

	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const handleLoadMore = () => {
		const edges = productList?.products?.edges || [];
		if (edges.length === 0) return;
		const lastCursor = edges[edges.length - 1].cursor;
		
		setIsLoadingMore(true);
		fetchMore({
			variables: {
				after: lastCursor
			},
			updateQuery: (prev, { fetchMoreResult }) => {
				setIsLoadingMore(false);
				if (!fetchMoreResult) return prev;
				return {
					...prev,
					products: {
						...prev.products,
						...fetchMoreResult.products,
						edges: [
							...prev.products.edges,
							...fetchMoreResult.products.edges
						]
					}
				};
			}
		}).catch(() => setIsLoadingMore(false));
	};

	const handleClearAllFilters = () => {
		setSubCategoryIdInfo([]);
		selectattributeDataList([]);
		setPriceRangeMinValue(undefined);
		setPriceRangeMaxValue(undefined);
		updateFilterParams({ c: '', a: '', s: '' });
	};

	const updateRangeVal = (e, data) => {
		setRangeVal(data)
		console.log(data)
	}


	const { loading } = useQuery(GET_PRODUCT_DETAILS, {
		fetchPolicy: "cache-first",
		skip: !quickViewId,
		variables: {
			slug: psearchData ? quickViewId : quickViewId,
			channel: "default-channel"
		},
		onCompleted: data => {
			console.log("Dev Log - QuickView details:", data);
			setProducts(data.product)
			setattributeList1(data.product.attributes)
			setCurrentImage(data.product.media?.[0].url)
			setVariantId(data.product.variants[0].id)

		}
	})

	const sidebarOpen = () => {
		return (
			sidebarToggle ? setSidebarToggle(false) : setSidebarToggle("sidebar-opened")
		)
	}

	const sortedProducts = React.useMemo(() => {
		let edges = productList?.products?.edges ? [...productList.products.edges] : [];
		
		// Filter out products with < 20% discount for Deals collections
		if (isDealsCollection) {
			edges = edges.filter(p => {
				const node = p?.node;
				if (!node) return false;
				
				const basePrice = node.pricing?.priceRange?.start?.net?.amount || 0;
				const variant = node.variants && node.variants[0];
				const shipping = Number(node.weightedShipping) || Number(variant?.weightedShipping) || 0;
				const finalSellingPrice = shipping > 0 && basePrice > shipping ? basePrice - shipping : basePrice;
				
				const rawOriginalPrice = variant?.originalPrice !== undefined && variant.originalPrice !== "0.00" 
					? Number(variant.originalPrice) 
					: 0;
				const undiscountedPrice = node.pricing?.priceRangeUndiscounted?.start?.net?.amount || 0;
				
				const finalOriginalPrice = rawOriginalPrice > finalSellingPrice 
					? rawOriginalPrice 
					: (undiscountedPrice > finalSellingPrice ? undiscountedPrice : 0);
				
				let pct = 0;
				if (finalOriginalPrice > finalSellingPrice && finalSellingPrice > 0) {
					pct = Math.round(((finalOriginalPrice - finalSellingPrice) / finalOriginalPrice) * 100);
				}
				
				return pct > 0; // Only keep products with any discount
			});
		}
		
		if (resolvedSearchQuery && typeof resolvedSearchQuery === 'string' && resolvedSearchQuery.trim() !== '') {
			const searchTerm = resolvedSearchQuery.toLowerCase().trim();
			// Apply this sorting if user hasn't explicitly chosen another sort like Price
			const isDefaultSort = !sortdata || sortdata === '' || sortdata === 'PR';
			
			if (isDefaultSort) {
				edges.sort((a, b) => {
					const nameA = (a?.node?.name || '').toLowerCase();
					const nameB = (b?.node?.name || '').toLowerCase();
					
					const exactMatchA = nameA === searchTerm;
					const exactMatchB = nameB === searchTerm;
					if (exactMatchA !== exactMatchB) return exactMatchA ? -1 : 1;
					
					const startsWithA = nameA.startsWith(searchTerm);
					const startsWithB = nameB.startsWith(searchTerm);
					if (startsWithA !== startsWithB) return startsWithA ? -1 : 1;
					
					const containsA = nameA.includes(searchTerm);
					const containsB = nameB.includes(searchTerm);
					if (containsA !== containsB) return containsA ? -1 : 1;
					
					return nameA.localeCompare(nameB);
				});
			}
		}
		
		return edges;
	}, [productList, resolvedSearchQuery, sortdata, collectionName, cosearchData, isTopDealsPage, isDealsCollection]);

	const displayTotalCount = isDealsCollection ? sortedProducts.length : (productList?.products?.totalCount || 0);

	return (

		<div >
			<Helmet>
				<title>Hegmakart: Search Products</title>
				<meta name="description" content="Search Products" />
			</Helmet>
			<div className={sidebarToggle}>
				{quickviewOpen && (<div className='modalBackground'>
					{!loading?<div className='modalContainer'>
						<div className="titleCloseBtn">
							<button
								onClick={() => {
									setQuickviewOpen(false);
								}}
							>
								<span style={{ display: "inline-block", fontSize: 22, fontWeight: "600", color: "black" }}>X</span>
							</button>


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
								<span className="prod-full-screen">
									<i className="icon-plus"></i>
								</span>
							</div>

							<div className="prod-thumbnail owl-dots">
								{product?.media?.map((media) => (
									<div className="owl-dot">
										<img onClick={setImage} src={media.url} width="110" height="110"
											alt="product-thumbnail" />
									</div>
								))}
							</div>
						</div>



						<div className="col-lg-7 col-md-4 product-single-details">

							<h1 className="product-title" style={{ fontSize: '20px' }}>{product.name} </h1>



							<div className="ratings-container">
								<div className="">
									<span className="" style={{ width: '100%' }}><Ratings value={product.rating} /></span>
									<span className="tooltiptext tooltip-top" >{product.id}</span>
								</div>

								{!(product.rating == null || product.rating == 0) ?<a className="rating-link">{product.rating.toString().length > 1?product.rating.toFixed(1):product.rating}</a>:null}
							</div>
							{setattributes1.map((attributes) => (
								<>
									{attributes.attribute.name === "Manufacturer" ? (
										<ul className="single-info-list">
											<li>
												MANUFACTURER:{" "}
												<strong>{attributes.values.length !== 0 ? attributes.values[0].name : ""}</strong>
											</li>
										</ul>
									) : null}
								</>
							))}
							<hr className="short-divider" />

							<div className="price-box">
							<span className="new-price">₹{totalValue(product?.pricing?.priceRange?.start?.net?.amount)}</span>
								{product?.pricing?.priceRangeUndiscounted?.start?.net?.amount !== product?.pricing?.priceRange?.start?.net?.amount ?
									<span className="old-price">₹{totalValue(product?.pricing?.priceRangeUndiscounted?.start?.net?.amount)}</span> : null}
								
							</div>


							<div style={{
								display: 'flex',
								flexDirection: "column"
							}}>
								{!product?.productType?.hasVariants ?
									<> <div style={{ paddingTop: 0, display: "flex", alignItems: "baseline" }} className="cartcontainr">
										<a onClick={onAddToCart} id={product?.variants[0]?.id} style={{ color: "white", minWidth: "140px" }} className="btn btn-dark save-change" title="Add to Cart">
											add to cart
										</a>

										<div className="product-single-share mb-3">
											<label className="sr-only">Share:</label>

											{wishHeart !== "added-wishlist" ?
												<a style={{ cursor: "pointer" }} onClick={onAddToWishlist} className="btn-icon-wish add-wishlist" title="Add to 
											 Wishlist"><i className="icon-wishlist-2"></i><span id={product.id}>Add to Wishlist</span>
												</a>
												:
												<a style={{ cursor: "pointer" }} onClick={() => navigate("/wishlist")}
													className="btn-icon-wish add-wishlist " title="Add to 
											 Wishlist"><i className="icon-wishlist-2"></i><span id={product.id}>Browse  wishlist</span>
												</a>
											}

										</div>
									</div></>
									:
									<div style={{ paddingTop: 0 }} className="cartcontainr">

										<button onClick={() => navigate(`/product/${encodeURIComponent(product.slug)}`)} style={{ border: "none", padding: 0 }} title="Add to Cart">
											<Link to={psearchData ? `/search/${psearchData}` : `/category/${previousId}`} style={{ color: "white" }} className="btn btn-dark ">View Product Details</Link>
										</button></div>
								}
								<p style={{ color: "orangered", marginTop: 10 }}>{product.purchaseNote}</p>
							</div>


						</div>
					</div>:
					<div className="bounce-loader">
	 			<div className="bounce1"></div> 			<div className="bounce2"></div>
				<div className="bounce3"></div>
	 		</div>
					}
				</div>)}



				<Header />
				<main className="main">
				
					
<div
  style={{ maxWidth: "95%", paddingBottom: "60px", paddingTop: "10px" }}
  className="catalog-product-layout flex flex-col lg:flex-row gap-8 items-start px-4 md:px-6 xl:mx-auto xl:w-[95%] xl:px-0"
>
  {/* Filter Sidebar */}
  <FilterSidebar
    categories={filterList}
    attributes={attributes}
    selectedCategoryIds={subcategoryIdinfo}
    selectedAttributeIds={selectattributesdata}
    onToggleCategory={handleToggleCategory}
    onToggleAttribute={handleToggleAttribute}
    minPrice={priceinfo && priceinfo.length ? Math.floor(priceinfo[0]) : 0}
    maxPrice={priceinfo && priceinfo.length ? Math.ceil(priceinfo[priceinfo.length - 1]) : 100000}
    currentMinPrice={priceRangeMinValue !== undefined ? Number(priceRangeMinValue) : undefined}
    currentMaxPrice={priceRangeMaxValue !== undefined ? Number(priceRangeMaxValue) : undefined}
    onPriceChange={(min, max) => {
      setPriceRangeMinValue(min);
      setPriceRangeMaxValue(max);
    }}
    onClearAllFilters={handleClearAllFilters}
    isMobileOpen={mobileFilterOpen}
    onCloseMobile={() => setMobileFilterOpen(false)}
    productCount={displayTotalCount}
  />

  {/* Product Area */}
  <div className="min-w-0 flex-1 w-full">
    {/* Results Toolbar */}
    <div className="catalog-results-toolbar-container">
      <CatalogResultsToolbar
        title={categoryPageTitle}
        visibleCount={sortedProducts.length}
        totalCount={displayTotalCount}
        sortBy={sortdata}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onSortChange={handleSortChange}
        onOpenFilters={() => {
          if (window.matchMedia("(min-width: 1024px)").matches) {
            document.getElementById("catalog-filter-sidebar")?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          } else {
            setMobileFilterOpen(true);
          }
        }}
      />
    </div>

    {/* Product Grid */}
    <ProductGrid
      products={sortedProducts}
      viewMode={viewMode}
      totalCount={displayTotalCount}
      searchKeyword={categoryPageTitle}
      loading={loading1}
      wishlistIds={wishlist}
      onToggleWishlist={(productId, isInWishlist, e) => {
        if (isInWishlist) {
          removeWishlist({ target: { id: productId } });
        } else {
          onAddToWishlist({ target: { id: productId } });
        }
      }}
      onOpenQuickView={(slug) => {
        setQuickviewOpen(true);
        setQuickViewId(slug);
      }}
      onCountChange={handleCountChange}
      onLoadMore={handleLoadMore}
      isLoadingMore={isLoadingMore}
      hasNextPage={productList?.products?.pageInfo?.hasNextPage || false}
      onOpenMobileSidebar={() => setMobileFilterOpen(true)}
    />
  </div>
</div>


					<RecentlyViewed />
					<div className="mb-4"></div>
				</main>
				<Footer />
			</div>

		</div>
	)
}

export default ProductSearchScreen
