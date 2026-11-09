import React from 'react'
import Header from '../components/Header/Header'
import "./OrderCompleted.css"
import { Link } from 'react-router-dom'
import { AiFillCheckCircle } from 'react-icons/ai';
import Footer from '../components/Footer/Footer';
import { Helmet } from 'react-helmet-async';

const OrderCompletedScreen = () => {
  const bannerStyle={
    backgroundSize:'60%/cover',
    backgroundImage:`url('assets/images/elements/page-header.png')`,
backgroundRepeat:'no-repeat'

}
  return (
    <div>
	<Helmet>
<title>Hegmakart: Order Completed</title>
<meta name="description" content="Order Completed"/>
</Helmet>
    <Header/>
    <main className="main info-box-wrapper">
			<div className="category-banner-container bg-gray">
				<div className="category-banner  text-uppercase"
					style={bannerStyle}>
					<div className="container position-relative">
						<nav aria-label="breadcrumb" className="breadcrumb-nav text-black">
							<ol className="breadcrumb justify-content-center">
								<li className="breadcrumb-item"><Link to="/">Home</Link></li>
								<li className="breadcrumb-item active" aria-current="page">Order Completed</li>
							</ol>
						</nav>
						<h1 className="page-title text-center text-black">Order Completed</h1>
					</div>
				</div>
			</div>

			<div className="containerrr"  >
		<AiFillCheckCircle className='orderCompleted'/>		
     <h4>Your Order Is Successfully placed. Thank you for Shopping with Us.</h4>
	 <h4>Order Details will be sent to your email and phone.</h4>        
			<h5 style={{paddingBottom:'90px',paddingTop:'20px'}}><span style={{color:"orangered",cursor:"pointer"}}></span></h5>
			</div>
		
            {/* <!-- End .container --> */}

			
				
		</main>
    <Footer/>
      
    </div>
  )
}

export default OrderCompletedScreen
