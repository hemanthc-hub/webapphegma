import React from 'react'
import Header from '../components/Header/Header'

import Footer from '../components/Footer/Footer'
import { Helmet } from 'react-helmet-async'

const OrderPlacedScreen = () => {
  const pageHeaderStyle={
    backgroundSize:'50%/cover',
    backgroundImage:`url('assets/images/page-header-bg.jpg')`,
}
  return (
    <>
    <Helmet>
<title>Hegmakart: Order Placed</title>
<meta name="description" content="Order Placed"/>
</Helmet>
      <Header/>

      <main className="main about">
			<div className="page-header page-header-bg text-left"
				style={pageHeaderStyle}>
				<div className="container">
					<h1><span>ORDER PLACED SUCCESSFULLY</span></h1>
				</div>
                {/* <!-- End .container --> */}
			</div>
            {/* <!-- End .page-header --> */}

			
			
		</main>
      <Footer/>
    </>
  )
}

export default OrderPlacedScreen
