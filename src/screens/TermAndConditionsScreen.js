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
<title>Hegmakart: Term & Conditions</title>
<meta name="description" content="Term & Conditions"/>
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
								<li className="breadcrumb-item active" aria-current="page">Terms and conditions</li>
							</ol>
						</nav>
						<h1 className="page-title text-center text-black">Terms and conditions</h1>
					
					</div>
				</div>
			</div> */}

			<div className="container" style={containerStyle}>
				<h3 className='mt-2'>Welcome to HegmaKart.com</h3>
				<h4>Hegmakart is registered with Hegma Tech  Pvt. Ltd.</h4><br/>
                    <p>With any purchase from Hegmakart.com website/app, customer 
unconditionally agrees to the terms and conditions mentioned 
below even if you have read them or not. Please read this 
agreement carefully before proceeding, as customer is bound to 
these conditions for accessing, browsing or purchase. If you 
(customer) do not agree and accept any of the terms, conditions 
and policies unconditionally, do not use this platform.<br/>
These Terms of Use govern all the products offered on the 
platform of Hegmakart.com website/app.<br/>
Throughout this document, “we”, “us”, “our”, “ours” refer to 
Hegmakart.com website/app. Wherever the text mentions ‘you’ or
‘your’, this means YOU (reader/customer)

<ul className='terms'>
	<li>1. You acknowledge and undertake that you are wholly 
responsible for your decision to buy any product/products 
after your own analysis, judgement and thereafter 
transaction done by you on this website. Hegmakart.com 
website/app takes no responsibility of the usage, 
implementation and result/outcome of the products. It is 
entirely buyer’s/user’s responsibility to choose and decide 
the right product.</li>
	<li>2. Hegmakart.com website/app reserves the right to refuse 
access to the website, terminate accounts, remove or edit 
content at any time without any prior notice and with 
absolute discretion</li>
	<li>3. In case of any violation of the terms and conditions, 
Hegmakart.com website/app reserves the right to refuse 
further use of services or even terminate account without 
any prior notice.
</li>
	<li>4. Entitlement to the goods remains that of Hegmakart.com 
website/app until you have paid for them. Entitlement will 
pass to you once the goods are paid in full and all payments 
have been cleared by a relevant banking process</li>
	<li>5. Hegmakart.com website/app reserves the right to not 
allow any changes to the order after the order has been 
accepted/placed</li>
	<li>6. Hegmakart.com website/app will not be responsible for 
any transactions done by mistake due to any internet issue 
at customer’s end.</li>
	<li>7. All reasonable attempts will be made to ensure that all 
the information given on this website is accurate, but offers 
no liability or assurance of genuineness of the information. 
Hegmakart.com website/app will not be responsible for any 
errors or incomplete information of products on its website</li>
	<li>8. Hegmakart.com website/app assumes that you are a 
medical practitioner or someone who is using it on his/her 
behalf. Any accidental/intentional order placed by someone 
else is solely the responsibility of the account owner</li>
	<li>9. Customer is solely responsible for the account information
like username and password and you hereby undertake the 
responsibility of any action taking place in your account.</li>
	<li>10. You acknowledge and agree that any information 
provided by you is only yours and does not infringe the 
confidentiality of a third party/person in any way</li>
	<li>11. If you are making a purchase on someone else’s behalf, 
you agree and bound the account holder to all the terms and
conditions of Hegmakart.com website/app</li>
	<li>12. In case of any knowledge or belief that your information 
has been breached in any way, you must contact Hegmakart
website/app at support@hegmakartkart.com</li>
	<li>13. If any issue is suspected as per the confidentiality of 
your account, you might be asked to change your password 
or re-register with no liability of Hegmakart.com 
website/app</li>
	<li>14. The pictures of all products at Hegmakart.com 
website/app are merely indicated for information and may 
vary from the actual product. Product packaging also might 
vary or change from time to time</li>
	<li>15. Hegmakart.com website/app strives to provide accurate 
product and pricing information; however, errors may occur</li>
	<li>16. Hegmakart.com website/app reserves all rights to 
change/alter prices of any product and suspend/cancel 
orders at any point of time unless it has been received by 
the customer.</li>
	<li>17. No changes can be made to the order once the order has
been dispatched from our warehouse. However, if you still 
require to contact us then drop us an email at 
support@Hegmakart.com. Our dedicated team aims to 
contact you within 24 hours. If ordered by mistake, you can 
still return the items by simply contacting our customer 
service.</li>
	<li>18. In case of any delays in delivery you may track the 
status of your order by visiting ‘My Orders’. Our aim is to 
meet the delivery times but during busy periods like 
promotional sale, festive occasions, tech updates, extreme 
weather conditions may delay the delivery and it may take a
little longer time than mentioned. Hegmakart.com 
website/app will not be responsible for any such delays; 
however, we always work hard to keep these temporary 
changes to a minimum. For any queries related to delays 
you may contact us by dropping an email at 
support@hegmalkart.com</li>
	<li>19. In case of cancellation of the paid order, the paid amount
will be reversed to the account information provided at the 
time of purchase and Hegmakart.com website/app will not 
be responsible for any accurate time duration taken in the 
transfer. Transfer is solely due as per the time taken by the 
bank</li>
	<li>20. If any product is found unavailable after receiving the 
order, customer will be notified of the order cancellation via 
email and payment will be refunded to the same account of 
the account holder from which payment was made. 
Hegmakart.com website/app shall not be liable to any 
damages in such event/events owing to cancellation of the 
order or delay in delivery.</li>
	<li>21. Payments can be made via debit card, credit card, net 
banking, UPI wallet, Paytm, cash on delivery as per 
availability of services by third party companies.</li>
	<li>22. If you use the Hegmakart.com website/app, you are 
responsible for maintaining the confidentiality of your 
account and password and for restricting access to your 
computer to prevent unauthorised access to your account. 
You agree to accept responsibility for all activities that occur
under your account or password.</li>
	<li>23.  We will do our utmost to ensure that availability of the 
website will be uninterrupted and that transmissions will be 
error-free. However, this cannot be guaranteed due to 
nature of the Internet. Also, your access to the website may 
also be occasionally suspended or restricted to allow for 
repairs, maintenance, or the introduction of new features or 
services at any time without prior notice. We will attempt to 
limit the frequency and duration of any such suspension or 
restriction.</li>
	<li>24. Any content of this website must not be copied, 
reproduced, sold/resold or duplicated for any commercial 
activity without prior written consent of Hegma Tech  pvt. 
ltd.</li>
	<li>25. You must not use this website for any 
fraudulent/unlawful activity whatsoever.</li>
	<li>26. Any dispute will be subjected to Bangalore jurisdiction 
only</li>
</ul>
<h4>Cancellation policy</h4>
<ul className='terms'>
	<li>1. In order to cancel the order before the shipment of the 
product/products, customer has to go to ‘My Orders’ and 
cancel the order or else contact support@hegmakart.com</li>
	<li>2. In order to cancel the order after the shipment of the 
product/products, customer has to contact 
support@hegmakart.com</li>
	<li>3. Refund is processed within 24-48 business hours when 
order stands cancelled before/after shipment. We process 
the refund once the products have been received and 
verified at our warehouse 
</li>
	<li>4. Refund in case of cancellation after dispatch might take 
longer. </li>


</ul>
<h4>Return/Replacement Policy</h4>
<ul className='terms'>
	<li>In case of returns, Hegmakart.com website/app arranges 
pick-up of the goods but shipping charges will be applicable. 
Customer has to bear the shipping charges or else can 
arrange the return by own means</li>
	<li>The product must be returned in its original packaging with
all contents intact as shipped.</li>
	<li>A part of the order can also be returned if multiple items 
were ordered. However, all the components of the product 
must be intact and product should ne unused/altered.</li>
	<li>In case of a return/replacement/refund, we process the 
refund once the products have been received and verified at
our warehouse</li>
	<li>In case of cancellation before shipment, we process the 
refund within 24-48 business hours after receiving the 
cancellation request.</li>
	<li>In case of cancellation once the shipment has already been
dispatched or if it is being returned, we process the refund 
once the products have been received and verified at our 
warehouse.</li>
	<li>For payments done through credit/debit cards or net 
banking, the refund will be processed to the same account 
from which the payment was made within 24-48 business 
hours of us receiving the products back. It may take 2-3 
additional business days for the amount to reflect in your 
account.</li>
	<li>For cash on delivery transactions, we will initiate a bank 
transfer against the refund amount against the billing details
shared by you. This process will be completed within 24-48 
business hours of us receiving the products back and your 
bank details on email. It will take an additional 2-3 business 
days for the amount to reflect in your account.</li>
	<li>Equipment which cannot be returned include Dental chairs,
Dental compressors, UV chambers, autoclaves, X-ray units, 
RVG sensor machine, Model trimmers, OPG and CBCT 
machines, apex locators, endomotors, Ultasonic scalers, 
Micromotors, Physio dispenser, Bleaching light and other 
light curing units, amalgamator etc</li>
	<li>Products which are not applicable for returns include tooth 
crème/mousse, MRC/orthodontic trainers, water flossers, 
chin caps, headgears, face masks or other myofunctional 
appliances.</li>
	<li>For more information: https://www.hemakart.com/return-
policy</li>
	<li>For more information: https://www.hemakart.com/return-
policy:</li>
	<li>Product is damaged due to misuse/overuse</li>
	<li>Returned without original packaging including, price tags, 
labels, original packing and/or any attachments or if original packaging is damaged</li>
	<li>If Serial Number is tampered</li>
	<li>Defective products that are not covered under 
Company’s/Manufacturer’s warranty</li>
	<li>Product is used or altered</li>
	<li>If request is initiated after 10 business days of order 
delivery</li>
	<li>No returns of free product/products</li>
	
</ul>
<h4>Refund policy</h4>
<ul className='terms'>
	<li>For payments done through credit/debit cards or net 
banking, the refund will be processed to the same account 
from which the payment was made within 24-48 business 
hours of us receiving the products back. It may take 2-3 
additional business days for the amount to reflect in your 
account.</li>
	<li>For cash on delivery transactions, we will initiate a bank 
transfer against the refund amount against the billing details
shared by you. This process will be completed within 24-48 
business hours of us receiving the products back and your 
bank details on email. It might take an additional 2-3 
business days (might take 7-10 days in some cases) for the 
amount to reflect in your account.</li>
	


</ul>

<h4>Privacy policy</h4>
This Privacy Policy outlines approach of Hegmakart.com 
website/app to Data Protection and Privacy to fulfil its obligations 
under the applicable laws and regulations. This Privacy Policy 
applies to your Personal information which is processed by us, 
whether in physical or electronic form. Hegmakart.com 
website/app is committed to treating your privacy seriously. It is 
important that you know as to what we do with your provided 
information. The information we receive and gather from you, 
personal or otherwise, is used to register you, verify your identity 
to permit you to use the app, undertake transactions for 
payments, to communicate with you, to inform for any 
promotional offers, services or updates associated with 
Hegmakart.com website/app, and to generally maintain your 
account information with us. We also use this information to 
customize your experience and improve Hegmakart.com 
website/app.

<ul className='terms'>
	<li>We understand that your personal information is important 
and sensitive so must be safeguarded, thereby every 
attempt is made to ensure protection of the same.</li>
	<li> You can choose not to provide certain information, but 
then you might not be able to use Hegmakart.com 
website/app.</li>
	<li>If you continue to use this website, it implies that you have 
read these terms and conditions along with the changes 
made to it time and again.</li>
	<li>Therefore, it is advised that you visit the ‘Terms and 
conditions’ page frequently for any modifications made to it.</li>
	<li>By agreeing to the terms and conditions you are giving 
your consent to Hegmakart.com website/app to use your 
personal information.</li>
	<li>We might receive information about you from other 
sources, such as updated delivery and address information 
from our courier partners, which we use to correct our 
records and deliver your next purchase a better experience</li>
	<li>Data/information recorded may include: name, contact 
number, email address, shipping address, date of birth, 
country or citizenship and transaction details like name of 
bank, branch name, card number, type of card and 
transaction number.</li>
	<li>Technical details which will be recorded are location, 
device information and network carrier used for the device.</li>
	<li> Location details such as IP address and your location at the
time of place of order.</li>
	<li>Other details such as pages viewed at Hegmakart.com 
website/app</li>
	<li>For more information: https://www.Hegmakart.com/privacy-
policy</li>

</ul>
<h4>Limited Licensure</h4>
Hegmakart.com website/app grants you limited, non-exclusive, 
non-transferable, non- sublicensable license to access, and make 
personal or/and commercial use of the platform. All rights not 
expressly granted to you in these Terms of Use, are reserved and 
retained by the Hegma kart.com website/app and its affiliates.
Hegmakart.com website/app reserves the right, at any time, 
without notice and at its sole discretion, to terminate your license 
to use the website and to block and prevent your future access of 
the website.<br/> <br/> 

<h4>General</h4>
You acknowledge and hereby agree to the above given ‘Terms 
and Conditions’ and that it constitutes the complete and exclusive
agreement between us concerning your use of the 
Hegmakart.com website/app, and supersede and govern all prior 
proposals, agreements, or other communications.<br/>
We reserve the right in our sole discretion, to change/ alter/ 
modify these Terms and Conditions at any time by posting the 
changes on the Hegmakart.com website/app. Any changes are 
effective immediately upon posting to the Hegmakart.com 
website/app. Your continued use of the Hegmakart.com 
website/app thereafter constitutes your agreement to all such 
changed ‘Terms and Conditions’. We may, with or without prior 
notice, terminate any of the rights granted by these ‘Terms and 
Conditions’. You shall comply immediately with any termination or
other notice, including, as applicable, by ceasing all use of the 
Site
<div style={{paddingTop:20}}>
	<h5 style={{lineHeight:2.5}}>
	Contact Information <br/>
Hegma Tech Pvt Ltd <br/>
#515,1st floor, 6th 'A' main, AECS Layout,<br/>
A Block,Singasandra , Bengaluru. 560068 Karnataka, India <br/>
Email: support@hegmakart.com Website: www.hegmakart.com
	</h5>
</div>
</p>
                 
			</div>
            {/* <!-- End .container --> */}

			
				
		</main>
      <Footer/>
    </>
  )
}

export default TermAndConditionsScreen
