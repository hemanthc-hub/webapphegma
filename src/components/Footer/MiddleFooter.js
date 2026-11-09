import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaPhoneAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { SHOP_DATA } from '../../GraphQL/Queries'
import { useQuery } from '@apollo/client/react'

const MiddleFooter = () => {
    const loggedInUser = localStorage.getItem("user");
    const [descri, setDescri] = useState("");

    const { } = useQuery(SHOP_DATA, {
        onCompleted: (data) => {
            setDescri(data.shop.description)
        },
    });
    return (
        <>
            <div className="footer-middle">
                <div style={{ maxWidth: "95%" }} className="container">
                    <div className="row" >
                        <div className="col-lg-5 col-12"><a >
                            <img src={window.location.protocol + "//" + window.location.hostname + ":" + window.location.port + "/assets/images/logoHegma.png"} alt="Logo" className="footerlogo" />
                        </a>
                            <p style={{ color: "grey", marginRight: 40 }}>
                                {descri}
                            </p>
                            <div className="contactw follow">
                                <p className="titlet ">Follow us</p>
                                <div className="social-icons" style={{ paddingBottom: 16 }}>
                                    <a href="https://www.facebook.com/Hegmakartcom-2433982146891560" className="social-icon social-facebook icon-facebook"
                                        target="_blank"></a>
                                    <a href="https://www.instagram.com/hegma_kart/" className="social-icon social-instagram icon-instagram"
                                        target="_blank"></a>
                                    <a href="https://www.linkedin.com/company/hegmakart-com/" className="social-icon social-linkedin fab fa-linkedin-in"
                                        target="_blank"></a>
                                </div>

                            </div>
                        </div>


                        {/* <div className="col-lg-2 col-6"><div className="widget">
                                    <h4 className="widget-title">About</h4>

                                    <ul className="links">
                                        <li><Link to="/about">About us</Link></li>
                                        
                                        <li><a >All Collections</a></li>
                                       
                                        <li><Link to="/TermAndConditions">Terms &amp; Conditions</Link></li>
                                    </ul>
                                    </div>
								</div> */}
                        {/* <div className="col-lg-2 col-6">
								    <div className="widget">
                                    <h4 className="widget-title">Categories</h4>

                                    <ul className="links">
                                        <li><a >Patient Education Models</a></li>
                                        <li><a >Implantology</a></li>
                                        <li><a >Sterilization</a></li>
                                        <li><a >Laboratory</a></li>
                                        <li><a >New Clinic setup Kits</a></li>
                                    </ul>
                                    </div>
								  </div> */}


                        <div className="col-lg-3 col-12">
                            <div className="widget">
                                <p style={{ paddingBottom: 10, fontSize: "1.7rem", fontWeight: "bold", margin: 0 }} className="widget-title">Quick Links</p>

                                <ul className="links">
                                    <li><Link to={loggedInUser ? "/Dashboard" : "/login"} >My Account</Link></li>
                                    <li><Link to="/contact-us"  >Contact Us</Link></li>
                                    <li><Link to="/privacy-policy">Privacy Policy</Link></li>

                                    <li><Link to="/TermAndConditions">Terms &amp; Conditions</Link></li>
                                    <li><Link to="/ShippingDeliveryPolicy">Shipping and Delivery Policy</Link></li>
                                    <li><Link to="/ReturnPolicy">Return &amp; Refund Policy</Link></li>
                                    {/* <li><Link to="/privacy-policy">Privacy Policy</Link></li> */}
                                </ul>
                            </div>


                        </div>

                        <div className="col-lg-4 col-12"><div className="cwidget">
                            <div className="contactwidget email">
                                <p style={{ fontSize: "1.7rem", paddingBottom: 10 }} className="titlet">Registered Office Address:</p>
                                <p style={{ color: "grey" }}>
                                    Hegma Tech Private Limited <br />
                                    #515,1st floor, 6th 'A' main, AECS Layout,<br /> A Block,Singasandra
                                    , Bengaluru. 560068<br /> Karnataka, India
                                    <br />
                                    www.hegmakart.com
                                </p>

                            </div>
                            <FaPhoneAlt style={{ fontSize: "2rem" }} />
                            <a style={{ paddingLeft: 10, color: "grey" }}>+918553666877 / 8553666977</a>
                        </div>
                            <div style={{ paddingTop: 10 }} className="contactwidget email">
                                <MdEmail style={{ fontSize: "2.5rem" }} />
                                {/* <p className="titlet">E-mail address:</p> */}
                                <a href="mailto:support@hegmakart.com" target="_blank" style={{ paddingLeft: 10 }}>
                                    <strong>Email:</strong>  support@hegmakart.com </a><br />
                                <a href="" style={{ paddingLeft: 36 }}>
                                    <strong>
                                        Website:</strong>  www.hegmakart.com</a>
                            </div>




                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default MiddleFooter
