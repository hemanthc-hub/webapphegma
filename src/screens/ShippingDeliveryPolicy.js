import React,{useEffect,useState} from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import "./Term&Conditions.css"
import { Helmet } from 'react-helmet-async'

const TermAndConditionsScreen = () => {
  const bannerStyle={
    backgroundSize:'60%/cover',
    backgroundImage:`url('assets/images/elements/page-header.png')`,
backgroundRepeat:'no-repeat'

}
const [change, setChange]= useState(1)

const pageTop =()=>{
  window.scrollTo(0, 0);
}
useEffect(()=>{
  pageTop()
  setChange(5)
},[change])
const containerStyle={
textAlign: 'justify',
paddingTop: '10px',
paddingBottom: '90px'
}
  return (
    <>
	<Helmet>
<title>Hegmakart: Shipping and Delivery Policy</title>
<meta name="description" content="Term & Conditions"/>
</Helmet>
      <Header/>
      <main className="main info-box-wrapper">
		

			<div className="container" style={containerStyle}>
				<h3 className='mt-2'>SHIPPING and DELIVERY POLICY</h3>
                    <p>
<ul className='term'>
	<li>When your request is received, it will be sent within 1 to 2 days subject to availability of products in warehouse. Contingent on your area, requests may take up to 4 days to arrive</li>

	<li>All bundles are conveyed by reputed external courier administration. Delivery costs are estimated by your entire request and your area estimate and weight. Delivery costs are carefully determined in the shopping cart and will be added to the request total before checkout.
</li>

	<li>Hegmakart delivers products worldwide.</li>

	<li>Hegmakart will in any case bend over backwards to state your purchase as indicated by the assessed convention bar, we will state within the allocation at the moment that in case of unforeseen circumstances beyond our ability to control Not sure.
</li>

	<li>We will deliver your item to the location displayed on your order confirmation.</li>

	<li>All items will be communicated through a receipt, for which you will have to confirm receipt of these products.</li>
	
    <li>Hegmakart  will provide cargo free conveyance for orders at a predetermined amount, although those per conveyance address are relevant.</li>

	<li>Hegmakart  maintains whatever authority is required to make changes in cargo-free strategy without note.</li>



</ul>
<h4>FAQ Related to Shipping and Delivery</h4>
<ul className='term'>
	<li><h4>Why does the delivery date not correspond to the delivery timeline of X Y business days?
</h4></li>
<p className='pl-4'>It is possible that the Seller or the courier partners have a holiday between the day you place your order and the date of delivery, which is based on the timelines shown on the product page. In this case, we add a day to the estimated date. Some courier partners and Sellers do not work on Sundays and this is factored into the delivery dates.</p>

	<li><h4>What is the estimated delivery time?</h4></li>
    <p className='pl-4'>
    Hegmakart generally procure and ship the items within the time specified on the product page. Business days exclude public holidays and Sundays.Estimated delivery time depends on the following factors:
<li className='pt-2 pl-2'>The Product’s availability in warehouse</li>
<li className='pt-2 pl-2'>The Seller offering the product</li>
<li className='pt-2 pl-2'>The destination to which you want the order shipped to and location of the Seller</li>
    </p>


	<li><h4>Are there any hidden costs on items sold by Sellers on Hegmakart?</h4></li>
    <p className='pl-4'>There are NO hidden charges when you make a purchase on Hegmakart. List prices are final and all-inclusive. The price you see on the product page is exactly what you would pay.</p>

	<li><h4>Hegmakart does not/cannot ship to my area. Why?</h4></li>
    <p className='pl-4'>
<li className='pt-2 pl-2'>Please enter your pincode on the product page to know whether the product can be delivered to your location.
</li>
<li className='pt-2 pl-2'>If you haven't provided your pincode until the checkout stage, the pincode in your shipping address will be used to check for serviceability.
</li>
<li className='pt-2 pl-2'>Whether your location can be serviced or not depends on whether the Courier partner ships to your location and legal restrictions, if any, in shipping particular products to your location.
</li>
<li className='pt-2 pl-2'>The availability of reliable courier partners in your location</li>
<li className='pt-2 pl-2'>At times Sellers prefer not to ship to certain locations. This is entirely at their discretion.</li>
    </p>

<li><h4>Why is the CoD option not offered in my location?</h4></li>
<p>Availability of CoD depends on the ability of our courier partner servicing your location to accept cash as payment at the time of delivery. Our courier partners have limits on the cash amount payable on delivery depending on the destination and your order value might have exceeded this limit. Please enter your pin code on the product page to check if COD is available in your location.</p>

<li><h4>I need to return an item, how do I arrange for a pick-up?</h4></li>
<p>Returns are easy. Contact us to initiate a return. You will receive a call explaining the process once you have initiated a return. Wherever possible Hegmakart will facilitate the pick-up of the item. In case, the pick-up cannot be arranged through Hegmakart’s Logistic partner, you can return the item through a third-party courier service. Return fees are borne by the Buyer.
</p>

<li><h4>What do the different tags like "In Stock", "Available" mean?</h4></li>
<h5 className='mb-1'>'In Stock'</h5>
<p>For items listed as "In Stock", Sellers will mention the delivery time based on your location pincode (usually 2-3 business days, 4-5 business days or 4-6 business days in areas where standard courier service is available). For other areas, orders will be sent by Registered Post through the Indian Postal Service which may take 1-2 weeks depending on the location.
</p>


<h5 className='mb-1'>‘Available'</h5>
<p>The Seller might not have the item in stock but can procure it when an order is placed for the item. The delivery time will depend on the estimated procurement time and the estimated shipping time to your location.
</p>

<h5 className='mb-1'>Preorder' or 'Forthcoming'</h5>
<p>Such items are expected to be released soon and can be pre-booked for you. The item will be shipped to you on the day of it's official release launch and will reach you in 2 to 6 business days. The Preorder duration varies from item to item. Once known, release time and date is mentioned. 
</p>

<h5 className='mb-1'>'Out of Stock'</h5>
<p>Currently, the item is not available for sale. Use the 'Notify Me' feature to know once it is available for purchase. The item is popular and is sold out. You can however 'book' an order for the product and it will be shipped according to the timelines mentioned by the Seller.

</p>

<h5 className='mb-1'>'Temporarily Unavailable'</h5>
<p>The product is currently out of stock and is not available for purchase. The product could be in stock soon. Use the 'Notify Me' feature to know when it is available for purchase.

</p>

<h5 className='mb-1'>Does Hegmakart deliver internationally?</h5>
<p>As of now, Hegmakart doesn't deliver items internationally.
</p>

<h5 className='mb-1'>Contact Us</h5>
<p>In any case you face any difficulty, kindly feel free to contact us:  support@hegmakart.com
</p>
</ul>

</p>
                 
			</div>
            {/* <!-- End .container --> */}

			
				
		</main>
      <Footer/>
    </>
  )
}

export default TermAndConditionsScreen
