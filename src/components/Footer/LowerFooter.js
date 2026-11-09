import React from 'react'

const LowerFooter = () => {
  const currentYear= new Date().getFullYear();

  return (
    <>
      <div className="footerbottomm">
					
					<div className="footertt">
					<div className="footerlogoo">
                            <img src={window.location.protocol + "//"+window.location.hostname + ":" + window.location.port + "/assets/images/apps.png"} alt="apps"  width="270px"/>
                        </div>
					<div className="footer-copyright">
                        
                            <p>© HegmaKart.{currentYear} All Rights Reserved</p>
                        </div>

                        <div className="payfooter">
                            <img src={window.location.protocol + "//"+window.location.hostname + ":" + window.location.port + "/assets/images/demoes/demo21/payment-icon.png"} alt="payment"/>
                        </div>
						
						</div>
                    </div>
    </>
  )
}

export default LowerFooter
