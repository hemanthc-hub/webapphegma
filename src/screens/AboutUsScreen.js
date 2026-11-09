import React from 'react'
import Header from '../components/Header/Header'
import { Link } from 'react-router-dom'

import Footer from '../components/Footer/Footer'
import SEO from '../components/SEO'

const AboutUsScreen = () => {
  const pageHeaderStyle={
    backgroundSize:'50%/cover',
    backgroundImage:`url('assets/images/page-header-bg.jpg')`,
}
  return (
    <>
      <SEO title="Hegmakart: About Us" description="About Us" keywords="about us, hegmakart" />
      <Header/>

      <main className="main about">
			<div className="page-header page-header-bg text-left"
				style={pageHeaderStyle}>
				<div className="container">
					<h1><span>ABOUT US</span>
						OUR COMPANY</h1>
					<a style={{color:"white"}} className="btn btn-dark">Contact</a>
				</div>
                {/* <!-- End .container --> */}
			</div>
            {/* <!-- End .page-header --> */}

			<nav aria-label="breadcrumb" className="breadcrumb-nav">
				<div className="container">
					<ol className="breadcrumb">
						<li className="breadcrumb-item"><Link to="/" ><i className="icon-home"></i></Link></li>
						<li className="breadcrumb-item active" aria-current="page">About Us</li>
					</ol>
				</div>
                {/* <!-- End .container --> */}
			</nav>

			<div className="about-section">
				<div className="container">
					<h2 className="subtitle">OUR STORY</h2>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
						the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
						of type and scrambled it to make a type specimen book. It has survived not only five centuries,
						but also the leap into electronic typesetting, remaining essentially unchanged.</p>
					<p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
						the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley
						of type and scrambled it to make a type specimen book.</p>

					<p className="lead">“ Many desktop publishing packages and web page editors now use Lorem Ipsum as their
						default model search for evolved over sometimes by accident, sometimes on purpose ”</p>
				</div>
                {/* <!-- End .container --> */}
			</div>
            {/* <!-- End .about-section --> */}

			<div className="features-section bg-gray">
				
			</div>
            {/* <!-- End .features-section --> */}

			
			
		</main>
      <Footer/>
    </>
  )
}

export default AboutUsScreen
