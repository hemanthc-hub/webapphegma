import React, { useState,useEffect } from 'react'
import { totalValue } from './decimalFunction'
import { Link } from 'react-router-dom'
import { GET_CHECKOUT_BY_TOKEN } from '../GraphQL/Queries'
import {useMutation, useQuery } from '@apollo/client/react'
import { CHECKOUT_LINE_DELETE, CHECKOUT_ADD_PRODUCT_LINE_MUTATION, CHECKOUT_LINE_UPDATE } from '../GraphQL/Mutation'
import { Navigate } from 'react-router-dom'
import { MdRemoveShoppingCart } from 'react-icons/md';
import { Trash2, Minus, Plus } from 'lucide-react';
import "./Wishlist.css"
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { Helmet } from 'react-helmet-async'
import OutOfStock from './OutOfStock'
import { toast } from 'sonner'


const CartScreen = () => {

	const [cartProduct, setCartProduct]=useState([])
	const [cartData, setCartData]=useState([])
	const [savingAmount, setSavingAmount] = useState([]);
	const[checkoutLineDelete]= useMutation(CHECKOUT_LINE_DELETE)
	const [addLineCheckout] = useMutation(CHECKOUT_ADD_PRODUCT_LINE_MUTATION);
	const [updateLineCheckout] = useMutation(CHECKOUT_LINE_UPDATE);
    const[refresh,setRefresh] = useState(1)
	const [getInputValue,setGetInputValue] = useState(1)
	const [previous,setPrevious] = useState(2)
	const [outOfStockName,setOutOfStockName] = useState([])
  useEffect(() => {
    console.log("Dev Log - Cart state:", { getInputValue, previous, refresh });
  }, [getInputValue, previous, refresh]);

	const removeProduct=(id)=>{
		// const { id } = e.target;
		checkoutLineDelete({
			variables: {
				token: localStorage.getItem('cartToken'),
				lineId: id
			},
			onCompleted: data=>{
				toast.success("Item removed from cart")
				setRefresh(refresh +1)
				refetch()
			}
		})
		
	}

	const updateProduct=(e)=>{
		// setGetInputValue(getInputValue <2?1:getInputValue-1)
		if (e.target.parentElement.children[1].value > 1) {
			e.target.parentElement.children[1].value = parseInt(e.target.parentElement.children[1].value) - 1
		  }
		  else (
			e.target.parentElement.children[1].value = 1
		  )  
		  setGetInputValue(e.target.parentElement.children[1].value);
		const { id, name } = e.target;
		updateLineCheckout({
			variables: {
				token: localStorage.getItem('cartToken'),
				lines: [{
					quantity: name - 1,
					variantId: id
				}]
			},
			onCompleted: data=>{
				setRefresh(refresh +2)	
				refetch()
			}
		})
			
	}

	const addProduct=(e)=>{
		e.target.parentElement.children[1].value = parseInt(e.target.parentElement.children[1].value) + 1
		setGetInputValue(e.target.parentElement.children[1].value)
		const { id } = e.target;
		addLineCheckout({
			variables: {
				token: localStorage.getItem("cartToken"),
				lines: [
					{
					quantity: 1,
					variantId: id
					}
				]
			},
			onCompleted: data=>{
				setRefresh(refresh +3)
				refetch()
			}
		})	
		
	}
	
	const { loading, error,refetch,data:cartItems }=useQuery(GET_CHECKOUT_BY_TOKEN,{
		fetchPolicy: "cache-first",
		skip: !localStorage.getItem('cartToken') || localStorage.getItem('cartToken') === 'null' || localStorage.getItem('cartToken') === 'undefined',
		context: {
			headers: {
			  Authorization:localStorage.getItem("user") !== null? "JWT " + localStorage.getItem("token"):"",
			},
		},
		variables: {
			token : localStorage.getItem('cartToken')  
		},
		onCompleted: data => {
			console.log("🛒 [Active Cart Object - CartScreen]:", data?.checkout || data);
			if (!data?.checkout) return;
			setCartProduct(data.checkout.lines)
			setCartData(data.checkout)
			setSavingAmount([])
			for (let index = 0; index < data.checkout.lines.length; index++) {
                setSavingAmount(prev => [...prev, (data.checkout.lines[index].variant.pricing.priceUndiscounted.net.amount - data.checkout.lines[index].variant.pricing.price.net.amount) * data.checkout.lines[index].quantity])
            }
		}	
	})

	// useEffect(()=>{
	// 	if(cartItems?.checkout?.lines?.length >0){
	// 		cartItems?.checkout?.lines?.map((cart)=>( 
	// 		cart?.quantity > cart?.variant?.quantityAvailable ? handleChange(cart?.variant?.id,cart?.variant?.quantityAvailable) : null
	// 	))}
	// 	if(cartItems?.checkout?.lines?.filter((cart)=>cart?.variant?.quantityAvailable === 0).length>0){
	// 		cartItems?.checkout?.lines?.map((cart)=>(
	// 					cart?.variant?.quantityAvailable !== 0?null:  
	// 					cart?.id?removeProduct(cart?.id):null
	// 				))
	// 	}

	// },[cartItems?.checkout?.id])

	if(loading && !cartItems?.checkout){
		return (<div className="loading-overlay">
        <div className="bounce-loader">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
        </div>
    </div>)
	}

	if(error) {
		return (<Navigate to="/" />);
	}

	const handleChange=(id,quantity)=>{
		//const { id, name } = e.target;
		console.log(quantity,"name",)
		if(quantity){
			//console.log("Check Check Check")
		updateLineCheckout({
				variables: {
					token: localStorage.getItem('cartToken'),
					lines: [{
						quantity: quantity,
						variantId: id
					}]
				},
				onCompleted: data=>{
					console.log("data",data)
					 setRefresh(refresh +12)	
					
					//window.location.reload(false)
				}
			})
	
		}
	}
	

// 	useEffect(()=>{
// 		if(cartItems?.checkout?.lines?.length >0){
// cartProduct?.map((cart)=>(
// 		cart?.variant?.quantityAvailable !== 0?null:  
// 		cart?.id?removeProduct(cart?.id):null
// 	))
// }
// 	},[cartItems?.checkout?.id])

// (cartItems?.checkout?.lines || cartProduct).map((cart)=>(
// 		cart?.variant?.quantityAvailable !== 0?null:  
// 		cart?.id?removeProduct(cart?.id):null
// 	))
	// (cartItems?.checkout?.lines || cartProduct).map((cart)=>(
	// cart.quantity>cart?.variant?.quantityAvailable?addProductQuantity(cart?.variant?.id,5):null
	// ))

		// cartProduct?.map((cart)=>( 
		// 	cart?.quantity > 5 ? handleChange(cart?.variant?.id,19) : null
		// ))
	////////////

		// {cartProduct?.map((cart)=>(
		// 	cart?.variant?.quantityAvailable === 0?null:  
		// 	setOutOfStockName(pre=>({...pre,["name"]:cart?.variant?.name}))
			
		// ))}
		console.log("outOfStockName",outOfStockName)

    return (
    <>
	<Helmet>
<title>Hegmakart: Shopping Cart</title>
<meta name="description" content="Shopping Cart"/>
<style>{`
  input[type=number].no-spinners::-webkit-inner-spin-button, 
  input[type=number].no-spinners::-webkit-outer-spin-button { 
    -webkit-appearance: none; 
    margin: 0; 
  }
  input[type=number].no-spinners {
    -moz-appearance: textfield;
  }
`}</style>
</Helmet>
      <Header/>
	 
      <main className="main">
			<div className="container">
				<ul className="checkout-progress-bar d-flex justify-content-center flex-wrap">
				<li className="active">
						<Link to="/cart" style={{color:"rgb(243, 150, 85)"}} >Shopping Cart</Link>
					</li>
					<li>
						<Link to="/checkout">Checkout</Link>
					</li>
					<li className="disabled">
						<a >Order Complete</a>
					</li>
				</ul>

				{(cartItems?.checkout?.lines ?? cartProduct).length===0 ? <div className='emptyWishlist'>
          <MdRemoveShoppingCart className='brokenHeart'></MdRemoveShoppingCart>
        <h1>You Don't Have Any Items In Your Cart</h1>
        <Link to="/" className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-500 via-blue-600 to-sky-500 px-4 py-4 text-lg font-semibold text-white shadow-md transition-all duration-200 hover:from-blue-600 hover:via-blue-700 hover:to-sky-600 hover:shadow-lg">Go Shop</Link>
        </div> : <div className="row">
					<div className="col-lg-8">
                        {(cartItems?.checkout?.lines || cartProduct).map((cart, idx) => {
                            const variant = cart?.variant;
                            const prod = variant?.product;
                            const isOutOfStock = variant?.quantityAvailable === 0;
                            const exceedsAvailable = cart?.quantity > (variant?.quantityAvailable ?? 9999);
                            const netPrice = variant?.pricing?.price?.net?.amount || 0;
                            const origPrice = variant?.originalPrice || netPrice;
                            const weightedShip = variant?.weightedShipping || 0;
                            const finalPricePerUnit = weightedShip > 0 ? (netPrice - weightedShip) : netPrice;

                            const brandAttr = prod?.attributes?.find(a => a?.attribute?.name?.toLowerCase() === 'manufacturer' || a?.attribute?.name?.toLowerCase() === 'brand');
                            const brandName = brandAttr?.values?.[0]?.name || prod?.category?.name || "";

                            return (
                                <div key={cart.id || idx} className="bg-white rounded-xl border border-slate-200 shadow-sm mb-2">
                                    <div className="p-3 sm:p-4 flex gap-3 sm:gap-4">
                                        <Link to={{pathname: `/product/${encodeURIComponent(prod?.slug || "")}`}} className="shrink-0 flex items-start">
                                            <img
                                                src={prod?.media?.[0]?.url || ""}
                                                alt={variant?.name || "Product"}
                                                className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded bg-white mix-blend-multiply"
                                            />
                                        </Link>
                                        
                                        {/* Content Column */}
                                        <div className="flex-1 flex flex-col min-w-0">
                                            {/* Row 1: Brand & Trash */}
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="text-[13px] text-slate-500 pt-0.5">{brandName || ""}</div>
                                                <button 
                                                    onClick={() => removeProduct(cart.id)}
                                                    className="text-red-600 hover:text-red-700 rounded-lg transition-colors border-0 bg-transparent cursor-pointer opacity-90 hover:opacity-100 p-0 flex items-center justify-center shrink-0 w-7 h-7"
                                                    title="Remove item"
                                                >
                                                    <Trash2 size={20} className="fill-current" />
                                                </button>
                                            </div>
                                            
                                            {/* Row 2: Title */}
                                            <h2 className="text-[17px] font-medium text-slate-900 m-0 leading-snug mt-0.5 pr-2 truncate whitespace-normal line-clamp-2">
                                                <Link to={{pathname: `/product/${encodeURIComponent(prod?.slug || "")}`}} className="text-slate-900 hover:text-blue-600 no-underline">
                                                    {variant?.name}
                                                </Link>
                                            </h2>
                                            {isOutOfStock && <p className="text-red-600 text-[11px] font-semibold mt-1 mb-0">Out of stock. Will be removed on checkout.</p>}
                                            {!isOutOfStock && exceedsAvailable && <p className="text-amber-600 text-[11px] font-semibold mt-1 mb-0">Only {variant?.quantityAvailable} available. Quantity updated on checkout.</p>}

                                            {/* Row 3: Price & Quantity */}
                                            <div className="flex justify-between items-end mt-1.5">
                                                <div className="text-blue-600 font-medium text-2xl leading-none">
                                                    ₹{totalValue(finalPricePerUnit)}
                                                    {origPrice > netPrice && (
                                                        <span className="ml-2 text-slate-400 line-through text-[15px] font-normal">₹{totalValue(origPrice)}</span>
                                                    )}
                                                </div>
                                                
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <button 
                                                        name={cart.quantity} 
                                                        id={cart.variant.id} 
                                                        onClick={updateProduct} 
                                                        type='button'
                                                        style={{ border: 0, outline: 'none', background: 'transparent', boxShadow: 'none' }}
                                                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer transition-all focus:outline-none focus:ring-0 border-0 p-0"
                                                    >
                                                        <Minus size={16} className="pointer-events-none" />
                                                    </button>
                                                    <input 
                                                        className="w-8 text-center bg-transparent font-medium text-slate-800 p-0 focus:outline-none focus:ring-0 border-0 no-spinners" 
                                                        style={{ border: 0, outline: 'none', background: 'transparent', boxShadow: 'none' }}
                                                        autoComplete='off' 
                                                        type="number" 
                                                        id={cart.variant.id} 
                                                        name={getInputValue} 
                                                        onChange={(e) => { setGetInputValue(e.target.value) } } 
                                                        onKeyUp={(e) => handleChange(cart.variant.id,getInputValue)} 
                                                        value={cart.quantity} 
                                                        min={1} max={99} 
                                                    />
                                                    <button 
                                                        id={cart.variant.id} 
                                                        onClick={addProduct} 
                                                        type='button'
                                                        style={{ border: 0, outline: 'none', background: 'transparent', boxShadow: 'none' }}
                                                        className="w-7 h-7 flex items-center justify-center text-slate-600 hover:text-slate-900 cursor-pointer transition-all focus:outline-none focus:ring-0 border-0 p-0"
                                                    >
                                                        <Plus size={16} className="pointer-events-none" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {(cartItems?.checkout?.lines || cartProduct).map((cart) => (
                            <React.Fragment key={`warn-${cart.id}`}>
                                {cart?.variant?.quantityAvailable !== 0 ? null :
                                    <h5 className='text-danger mb-0 fw-bolder mt-3'>Few items are unavailable for checkout. Please continue with other available items.</h5>}
                                {cart?.variant?.quantityAvailable !== 0 ? cart?.quantity > cart?.variant?.quantityAvailable ?
                                    <h5 className='text-danger mb-0 fw-bolder mt-3'>Few items are unavailable for checkout. Please continue with other available items.</h5> : null : null}
                            </React.Fragment>
                        ))}
					</div>
                    {/* <!-- End .col-lg-8 --> */}

					<div className="col-lg-4">
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 sm:p-6 sticky top-24">
                            <h2 className="font-bold text-3xl text-slate-800 mb-5 border-b border-slate-100 pb-3" style={{fontFamily: "'Outfit', sans-serif"}}>
                                Order Summary
                            </h2>
                            
                            <div className="space-y-4 mb-6 text-xl">
                                <div className="flex justify-between items-center text-slate-600 font-medium">
                                    <span>Subtotal:</span>
                                    <span className="font-semibold">₹{ totalValue((cartItems?.checkout?.lines ?? cartProduct).reduce((total, item)=> total + (item.variant.pricing.price.net.amount * item.quantity), 0)) }</span>
                                </div>
                                <div className="flex justify-between items-center text-emerald-600 font-medium">
                                    <span>Total Saving:</span>
                                    <span className="font-semibold">₹{ totalValue((cartItems?.checkout?.lines ?? cartProduct).reduce((total, item)=>total+(((item.variant.originalPrice || item.variant.pricing.priceUndiscounted.net.amount)-item.variant.pricing.price.net.amount)*item.quantity),0))}</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 font-medium">
                                    <span>Weighted Delivery Charges:</span>
                                    <span className="font-semibold">₹{ totalValue((cartItems?.checkout?.lines ?? cartProduct).reduce((total, item)=>  total+((item.variant.weightedShipping || 0)*item.quantity),0)) }</span>
                                </div>
                                <div className="flex justify-between items-center text-slate-600 font-medium">
                                    <span>Shipping:</span>
                                    {((cartItems?.checkout ?? cartData)?.shippingPrice?.net?.amount || (cartItems?.checkout ?? cartData)?.shippingMethods?.[0]?.price?.amount) ? (
                                        <span className="font-semibold">
                                            ₹{totalValue((cartItems?.checkout ?? cartData)?.shippingPrice?.net?.amount || (cartItems?.checkout ?? cartData)?.shippingMethods?.[0]?.price?.amount)}
                                        </span>
                                    ) : (
                                        <span className="text-[14px] text-slate-400 font-normal">Calculated at checkout</span>
                                    )}
                                </div>
                                
                                <div className="border-t border-slate-200 pt-4 mt-2 flex justify-between items-end">
                                    <div>
                                        <div className="font-extrabold text-lg text-slate-900" style={{fontFamily: "'Outfit', sans-serif"}}>Grand Total</div>
                                        <div className="text-[11px] text-slate-400 font-normal mt-0.5">(inclusive of all taxes)</div>
                                    </div>
                                    <div className="font-black text-2xl text-orange-600">
                                        ₹{totalValue(((cartItems?.checkout ?? cartData)?.totalPrice?.gross?.amount ?? 0) + (((cartItems?.checkout ?? cartData)?.shippingPrice?.net?.amount === 0 ? (cartItems?.checkout ?? cartData)?.shippingMethods?.[0]?.price?.amount : 0) || 0))}
                                    </div>
                                </div>
                            </div>

                            <Link 
                                to="/checkout" 
                                className="flex items-center justify-center w-full py-4 px-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-lg uppercase rounded-xl text-center no-underline transition-all shadow-lg shadow-orange-500/20 gap-2 -mt-8"
                            >
                                Proceed to Checkout
                                <i className="fa fa-arrow-right"></i>
                            </Link>
                        </div>
					</div>
                    {/* <!-- End .col-lg-4 --> */}
				</div>}




                {/* <!-- End .row --> */}
			</div>
            {/* <!-- End .container --> */}

			<div className="mb-6"></div>
            {/* <!-- margin --> */}
		</main>
     
     
<Footer/>
    </>
  )
}

export default CartScreen
