import React,{useEffect,useState} from 'react'
import { Helmet } from 'react-helmet-async'
import Footer from '../components/Footer/Footer'
import Header from '../components/Header/Header'
import "./ReturnPolicy.css"

const ReturnPolicyScreen = () => {
  const bannerStyle={
    backgroundSize:'60%/cover',
    backgroundImage:`url('assets/images/elements/page-header.png')`,
backgroundRepeat:'no-repeat'

}

const containerStyle={
textAlign: 'justify',
paddingTop: '10px',
paddingBottom: '90px'
}
const [change, setChange]= useState(1)

const pageTop =()=>{
  window.scrollTo(0, 0);
}
useEffect(()=>{
  pageTop()
  setChange(5)
},[change])
  return (
    <>
	<Helmet>
<title>Hegmakart: Return Policy</title>
<meta name="description" content="Return Policy"/>
</Helmet>
      <Header/>
      <main className="main info-box-wrapper">
			{/* <div className="category-banner-container bg-gray">
				<div className="category-banner banner text-uppercase"
					style={bannerStyle}>
					<div className="container position-relative">
						<nav aria-label="breadcrumb" className="breadcrumb-nav text-black">
							<ol className="breadcrumb justify-content-center">
								<li className="breadcrumb-item"><a >Home</a></li>
								<li className="breadcrumb-item active" aria-current="page">Refund and return policy</li>
							</ol>
						</nav>
						<h1 className="page-title text-center text-black">Refund and return policy</h1>
					</div>
				</div>
			</div> */}

			<div className="container mt-1" style={containerStyle}>
			<h3 className='mb-0'>Returns</h3><br/>
                    <p>
					Returns is a scheme provided by us directly under this policy in terms of 
which the option of exchange, replacement and/ or refund is offered by the 
respective sellers to you. All products listed under a particular category may 
not have the same return policy. For all products, the policy on the product 
page shall prevail over the general return policy. Do refer the respective 
item's applicable return policy on the product page for any exceptions to the 
table below.
<br/>
<br/>
The return policy is divided into two parts; Do read all sections carefully to 
understand the conditions and cases under which returns will be accepted.
</p>
<h4 style={{marginTop:30, marginBottom:20}}>Part 1 – Category, Return Window and Actions possible</h4>
<div className='termsPart1'>
	<div className='allProducts'>
	<p style={{paddingTop:50}}>All products</p>	
		</div>
	<div className='allProductsConditions'>
		<ul>
			<li>10 days from the date of delivery.</li>
			<li>Replacement only</li>
			<li>In order to help you resolve issues with your product, we may 
troubleshoot your product either through online tools, over the phone,
and/or through a call from technical team.</li>
<li>If a defect is determined within the Returns Window, a replacement 
of the same model will be provided at no additional cost</li>
			<li>Note- If the rectification comes frequently then rectification cost will 
be applicable as per T&C</li>
		</ul>
	</div>
</div>

<h4 style={{marginTop:30, marginBottom:20}}>Products are not eligible for returns</h4>
<div style={{borderBottom:"none"}} className='termsPart1'>
	<div className='allProducts'>
	<p style={{paddingTop:15}}>No Returns 
categories</p>	
		</div>
	<div className='allProductsConditions2'>
		<ul >
			<li >Products not in warranty or exceeds the time for replacement (10 days) 
are not returned and all we ask for is the product returned back to us 
must have intact original Packaging, seal, and the accessories.</li>
			<li >The following table contains a list of products that are not eligible for 
returns as per the company Returns Policy.</li>
			
		</ul>
	</div>
</div>
<div style={{borderBottom:"none"}} className='termsPart1'>
	<div className='allProducts'>
	<p style={{paddingTop:40}}>Equipments</p>	
		</div>
	<div className='allProductsConditions2'>
		<ul>
			<li >Dental Chairs, Dental Compressors, UV chambers and Autoclaves, X-
ray Units, RVG sensor machine, Model Trimmers, OPG and CBCT 
machines, Apex locators and Endomotors, Ultrasonic Cleaners and 
Scalers, Micromotors, Implant Motors/Physiodispenser, Bleaching 
Light and light cure units, Amalgamator.</li>
			
		</ul>
	</div>
</div>
<div className='termsPart1'>
	<div className='allProducts'>
	<p style={{paddingTop:12}}>Products 
directly used 
on Patients.</p>	
		</div>
	<div className='allProductsConditions2'>
		<ul>
			<li >Tooth creme or mousse, MRC/Orthodontic trainers, Water Flossers, 
Chin Caps, headgear, face mask or other myofunctional appliances.</li>
			
		</ul>
	</div>
</div>


{/* TermAndConditions part 2 */}
<p><h4 style={{paddingTop:50}}>Part 2 - Returns Pick-Up and Processing</h4>
In case of returns where you would like item(s) to be picked up from a 
different address, the address can only be changed if pick-up service is 
available at the new address.

</p>
<h4 style={{marginTop:30, marginBottom:20}}>Your product will be checked for the following conditions after 
received to us:</h4>
<div style={{borderBottom:"none"}} className='termsPart1'>
	<div className='allProducts'>
	<p style={{paddingTop:10}}>Category</p>	
		</div>
	<div className='allProductsConditions2'>
		<ul >
			<li >Conditions</li>
			
		</ul>
	</div>
</div>
<div style={{borderBottom:"none"}} className='termsPart1'>
	<div className='allProducts'>
	<p style={{paddingTop:10}}>Complete 
Product</p>	
		</div>
	<div className='allProductsConditions2'>
		<ul>
			<li >All in-the-box accessories & freebies and combos (if any) 
should be presen</li>
			
		</ul>
	</div>
</div>
<div style={{borderBottom:"none"}} className='termsPart1'>
	<div className='allProducts'>
	<p style={{paddingTop:10}}>
	unused Products<span style={{visibility:"hidden"}}>vvv</span>
</p>	
		</div>
	<div className='allProductsConditions2'>
		<ul>
			<li >
			The product should be unused, unwashed, unsoiled, 
without any stains and with non-tampered quality check 
seals/ warranty seals (wherever applicable). Before 
returning any product.
			</li>
			
		</ul>
	</div>
</div>
<div style={{borderBottom:"none"}} className='termsPart1'>
	<div className='allProducts'>
	<p style={{paddingTop:10}}>
	Undamaged 
Product
</p>	
		</div>
	<div className='allProductsConditions2'>
		<ul>
			<li >
			The product should be undamaged and without any 
scratches, dents, tears or holes
			</li>
			
		</ul>
	</div>
</div>
<div className='termsPart1'>
	<div className='allProducts'>
	<p style={{paddingTop:10}}> 
	Undamaged 
Packaging</p>	
		</div>
	<div className='allProductsConditions2'>
		<ul>
			<li >Product's original packaging/ box should be undamaged. 
For any products for which a refund is to be given, the 
refund will be processed once the returned product has 
been received by the customer to us.</li>
			
		</ul>
	</div>
</div>
<p>
For any products for which a refund is to be given, the refund will be 
processed once the returned product has been received by the customer to 
us.
<br/>
<br/>
In certain cases where the manufacturer is unable to process a replacement 
for any reason whatsoever, a refunds will be given in the same manner the 
payment was received. If the order was prepaid, refund will be done in the 
bank account and if the order was cash on delivery, customer need to 
provide bank account details, account should be in the name of customer
</p>


                    
			</div>
            {/* <!-- End .container --> */}

			
				
		</main>
      <Footer/>
    </>
  )
}

export default ReturnPolicyScreen
