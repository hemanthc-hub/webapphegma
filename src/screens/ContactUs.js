import React from 'react'
import "./ContactUs.css"
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import SEO from '../components/SEO'
import { useEffect,useState } from "react"

const ContactUs = () => {
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
      <SEO title="Hegmakart: Contact Us" description="Contact Us" keywords="contact, hegmakart" />
      <Header/>
      <main className="main contact-two">
            <nav aria-label="breadcrumb" className="breadcrumb-nav mb-0">
                <div className="container">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item"><a >Home</a></li>
                        <li className="breadcrumb-item active" aria-current="page">Contact Us</li>
                    </ol>
                </div>
            </nav>

            
<div className="container">
            <div className="container mb-4 mb-lg-1">
                <div style={{marginBottom:30}} className="row ">
                    <div className="col-md-6">
                        <h2 className="font1 font-weight-light ls-n-10"><strong>Contact Us</strong></h2>

                        <form action="#">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group required-field mb-2">
                                        <label for="contact-name">Your name</label>
                                        <input type="text" className="form-control" id="contact-name" name="contact-name"
                                            required/>
                                    </div>
                                    {/* <!-- End .form-group --> */}
                                </div>

                                <div className="col-md-6">
                                    <div className="form-group required-field mb-2">
                                        <label for="contact-email">Your email address</label>
                                        <input type="email" className="form-control" id="contact-email" name="contact-email"
                                            required/>
                                    </div>
                                    {/* <!-- End .form-group --> */}
                                </div>
                            </div>

                            <div className="form-group mb-2">
                                <label for="contact-subject">Subject</label>
                                <input type="text" className="form-control" id="contact-subject" name="contact-subject"/>
                            </div>
                            {/* <!-- End .form-group --> */}

                            <div className="form-group mb-0">
                                <label for="contact-message">Your Message</label>
                                <textarea cols="30" rows="1" id="contact-message" className="form-control"
                                    name="contact-message" required></textarea>
                            </div>
                            {/* <!-- End .form-group --> */}

                            <div className="form-footer mb-0">
                                <button type="submit" className="btn btn-primary font1">Send Message</button>
                            </div>
                            {/* <!-- End .form-footer --> */}
                        </form>
                    </div>
                    {/* <!-- End .col-md-8 --> */}

                    <div className="col-md-6">
                        <h2 className="contact-title font1 ls-n-10 text-primary"><strong style={{color:"orangered"}}>Get in touch</strong></h2>
                        <p>
                        Hegmakart is one stop solution for Doctors,
Surgeons and Lab technicians.
We provide door step delivery of all Medical Products,
Equipment's and Instruments.</p>

                        <hr className="mt-3 mb-0" />

                        <div className="contact-info mb-2">
                            <h2 className="contact-title font1 ls-n-10 text-primary"><strong style={{color:"orangered"}}>The Office</strong></h2>

                            <div className="porto-sicon-box d-flex align-items-center mb-1">
                                <div className="porto-icon">
                                    <i className="fas fa-map-marker-alt sat"></i>
                                </div>
                                <h3 className="porto-sicon-title font1 ls-n-10">

                                    <strong>Address: </strong> #515,1st floor, 6th 'A' main, AECS Layout,
A Block,Singasandra , Bengaluru. 560068
Karnataka, India

                                </h3>
                            </div>
                            <div className="porto-sicon-box d-flex align-items-center mb-1">
                                <div className="porto-icon">
                                    <i className="fa fa-phone sat"></i>
                                </div>
                                <h3 className="porto-sicon-title font1 ls-n-10">
                                    <strong>Phone:</strong> +91 8553666877</h3>
                            </div>
                            <div className="porto-sicon-box d-flex align-items-center mb-1">
                                <div className="porto-icon">
                                    <i className="fa fa-envelope sat"></i></div>
                                <h3 className="porto-sicon-title font1 ls-n-10">
                                    <strong>Email:</strong>  support@hegmakart.com</h3>
                            </div>
                        </div>
                        {/* <!-- End .contact-info --> */}

                        <hr className="mt-1 mb-0" />

                        <div style={{marginBottom:20}} className="contact-time">
                            <h2 className="contact-title font1 ls-n-10 text-primary"><strong style={{color:"orangered"}}>Business Hours</strong></h2>

                            <div className="porto-sicon-box d-flex align-items-center mb-1">
                                <div className="porto-icon">
                                    <i className="far fa-clock"></i>
                                </div>
                                <h3 className="porto-sicon-title font1 ls-n-10 ">Monday - Friday
                                    9am to 5pm</h3>
                            </div>

                            <div className="porto-sicon-box  d-flex align-items-center mb-1">
                                <div className="porto-icon">
                                    <i className="far fa-clock"></i>
                                </div>

                                <h3 className="porto-sicon-title font1 ls-n-10">Saturday - 9am
                                    to 2pm</h3>
                            </div>

                            <div className="porto-sicon-box d-flex align-items-center mb-1">
                                <div className="porto-icon"><i className="far fa-clock"></i></div>
                                <h3 className="porto-sicon-title font1 ls-n-10">Sunday - Closed
                                </h3>
                            </div>
                        </div>
                    </div>
                    {/* <!-- End .col-md-4 --> */}
                </div>
                {/* <!-- End .row --> */}
            </div>
            {/* <!-- End .container --> */}
            </div>
        </main>
      <Footer/>
    </>
  )
}

export default ContactUs
