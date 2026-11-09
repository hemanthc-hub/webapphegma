// import React, { useState, useEffect } from 'react'
// import Header from '../components/Header/Header'
// import Footer from '../components/Footer/Footer'
// import { useMutation, useQuery } from '@apollo/client/react'
// import { TOKEN_AUTH_MUTATION, CHECKOUT_CUSTOMER_ATTACH, UPDATE_WISHLIST_MUTATION } from '../GraphQL/Mutation'
// import { GET_CHECKOUT_BY_TOKEN, } from "../GraphQL/Queries";
// import { Navigate, useNavigate, useLocation } from 'react-router-dom'
// import "./LoginScreen.css"
// import "./ProductScreen"
// import axios from "axios";
// import { Helmet } from 'react-helmet'
// import { Link } from 'react-router-dom'

// const LoginScreen = () => {
// 	const navigate = useNavigate()
// 	const [forgotPasswordPopupLoader, setForgotPasswordPopupLoader] = useState("continue")
// 	const [otpPopupLoader, setOtpPopupLoader] = useState("Verify")
// 	const [showOtpPopup, setShowOtpPopup] = useState(false)
// 	const [showLoginWithOtpPopup, setShowLoginWithOtpPopup] = useState(false)
// 	const [errorPopup, setErrorPopup] = useState(false)
// 	const [username, setUsername] = useState("");
// 	const [password, setPassword] = useState("");
// 	const [mobile, setMobile] = useState("");
// 	const [otp, setOtp] = useState("");
// 	const [user, setUser] = useState();
// 	const [errorMe, errorMessage] = useState([""]);
// 	const [otpValidation, setOtpValidation] = useState(false)
// 	const [errorOMe, errorOMessage] = useState("");
// 	const [tokenauth] = useMutation(TOKEN_AUTH_MUTATION);
// 	const [customerAttach] = useMutation(CHECKOUT_CUSTOMER_ATTACH);
// 	const [updateWishlist] = useMutation(UPDATE_WISHLIST_MUTATION);
// 	const [quantity, setQuantity] = useState("");
// 	const search = useLocation().search;
// 	let checkoutmessage = new URLSearchParams(search).get("cm");


// 	useEffect(() => {
// 		const loggedInUser = localStorage.getItem("user");
// 		if (loggedInUser) {
// 			setUser(loggedInUser);
// 		}
// 	}, []);

// 	// cart Quantity Start
// 	const { } = useQuery(GET_CHECKOUT_BY_TOKEN, {
// 		context: {
// 			headers: {
// 				Authorization: localStorage.getItem("user") !== null ? "JWT " + localStorage.getItem("token") : "",
// 			},
// 		},
// 		variables: {
// 			token: localStorage.getItem("cartToken"),
// 		},
// 		onCompleted: (data) => {
// 			//console.log("LOGIN cart Quantity",data,data.checkout.lines.length)
// 			try {
// 				setQuantity(data.checkout.lines.length);
// 			} catch (error) {

// 			}


// 		},
// 	});
// 	// cart quantity end
// 	const customerAttachs = () => {
// 		if (quantity > 0) {
// 			customerAttach({
// 				context: {
// 					headers: {
// 						Authorization: "JWT " + localStorage.getItem("token"),
// 					},
// 				},
// 				variables: {
// 					token: localStorage.getItem("cartToken")
// 				},
// 				onCompleted: data => {
// 					console.log("customerAttach", data)
// 				}
// 			})
// 		} else {
// 			var options = {
// 				method: 'post',
// 				url: 'https://wsi.rocketinpocket.com/hegma/v1/hegma/getCheckoutToken',
// 				data: JSON.stringify({
// 					'token': localStorage.getItem("token"),
// 				}),
// 				headers: {
// 					'Accept': 'application/json',
// 					'Content-Type': 'application/json'
// 				}
// 			};
// 			axios(options)
// 				.then((response) => {
// 					console.log("ROCKET IN POCKET API CAL", response);
// 					if (response.data === '') {
// 						console.log("ROCKET IN POCKET API CAL,response Blank");
// 						customerAttach({
// 							context: {
// 								headers: {
// 									Authorization: "JWT " + localStorage.getItem("token"),
// 								},
// 							},
// 							variables: {
// 								token: localStorage.getItem("cartToken")
// 							},
// 							onCompleted: data => {
// 								//console.log("customerAttach",data)
// 							}
// 						})
// 					} else {
// 						localStorage.setItem('cartToken', response.data)
// 						console.log("ROCKET IN POCKET API CAL,response DAta not Blank");
// 					}
// 				})
// 				.catch((error) => {
// 					console.log("error", error)

// 				})

// 		}
// 	}
// 	const handleSubmit = async e => {
// 		e.preventDefault();
// 		let username2 = username
// 		if (username.length === 10 && !username.includes('@')) {
// 			username2 = username + '@hegmakart.com'
// 		}
// 		tokenauth({
// 			variables: {
// 				email: username2,
// 				password: password
// 			},
// 			onCompleted: data => {
// 				console.log(data);
// 				if (data.tokenCreate.refreshToken === null) {
// 					setErrorPopup(true);
// 					errorMessage("Incorrect Account Detail");
// 					if (data.tokenCreate.errors[0].message.includes('Account inactive.')) {
// 						setErrorPopup(true);
// 						errorMessage("Your account is blocked/disabled , contact support@hegmakart.com for further help.");
// 						return (<Navigate to="/" />);
// 					}
// 				}

// 				if (data.tokenCreate.user.isStaff === true) {
// 					errorMessage("Incorrect Account Detail");
// 					setErrorPopup(true);
// 					return (<Navigate to="/" />);
// 				}
// 				try {
// 					// store the user in localStorage
// 					localStorage.setItem('token', data.tokenCreate.token);
// 					localStorage.setItem('refreshToken', data.tokenCreate.refreshToken);
// 					localStorage.setItem('userName', data.tokenCreate.user.firstName + " " + data.tokenCreate.user.lastName);
// 					localStorage.setItem('user', username);
// 					localStorage.setItem('email', data.tokenCreate.user.email);
// 					if (!(localStorage.getItem("wishlistToken") === null || localStorage.getItem("wishlistToken") === undefined || localStorage.getItem("wishlistToken") === '')) {
// 						updateWishlist({
// 							context: {
// 								headers: {
// 									Authorization: "JWT " + data.tokenCreate.token,
// 								},
// 							},
// 							variables: {
// 								input: {
// 									wishlistToken: localStorage.getItem("wishlistToken"),
// 								},
// 							},
// 							onCompleted: (data) => {
// 								console.log(data);
// 							},
// 						});
// 					} else {
// 						if (!(data.tokenCreate.user.wishlistToken === null || data.tokenCreate.user.wishlistToken === undefined)) {
// 							localStorage.setItem('wishlistToken', data.tokenCreate.user.wishlistToken);
// 						}
// 					}
// 					if (quantity > 0) {
// 						customerAttach({
// 							context: {
// 								headers: {
// 									Authorization: "JWT " + localStorage.getItem("token"),
// 								},
// 							},
// 							variables: {
// 								token: localStorage.getItem("cartToken")
// 							},
// 							onCompleted: data => {
// 								console.log("customerAttach", data)
// 							}
// 						})
// 					} else {
// 						var options = {
// 							method: 'post',
// 							url: 'https://wsi.rocketinpocket.com/hegma/v1/hegma/getCheckoutToken',
// 							data: JSON.stringify({
// 								'token': localStorage.getItem("token"),
// 							}),
// 							headers: {
// 								'Accept': 'application/json',
// 								'Content-Type': 'application/json'
// 							}
// 						};
// 						axios(options)
// 							.then((response) => {
// 								console.log("ROCKET IN POCKET API CAL", response);
// 								if (response.data === '') {
// 									console.log("ROCKET IN POCKET API CAL,response Blank");
// 									customerAttach({
// 										context: {
// 											headers: {
// 												Authorization: "JWT " + localStorage.getItem("token"),
// 											},
// 										},
// 										variables: {
// 											token: localStorage.getItem("cartToken")
// 										},
// 										onCompleted: data => {
// 											//console.log("customerAttach",data)
// 										}
// 									})
// 								} else {
// 									localStorage.setItem('cartToken', response.data)

// 									console.log("ROCKET IN POCKET API CAL,response DAta not Blank")
// 								}
// 							})
// 							.catch((error) => {
// 								console.log("error", error)

// 							})

// 					}
// 					if (data.tokenCreate.user.email.includes('@hegmakart.com')) {
// 						let tempEmail = data.tokenCreate.user.email
// 						tempEmail = tempEmail.replace('@hegmakart.com', '')
// 						if (!isNaN(tempEmail) && tempEmail.length === 10) {
// 							localStorage.setItem('tempEmail', "yes");
// 						} else {
// 							setErrorPopup(true)
// 							errorMessage("Incorrect Account Detail");
// 							return (<Navigate to="/" />)
// 						}
// 					}

// 					localStorage.setItem('userId', data.tokenCreate.user.id);

// 					setUser(username);
// 					(<Navigate to="/" />)

// 				} catch (e) {
// 					setErrorPopup(true)
// 					errorMessage("Incorrect Account Detail");
// 					return (<Navigate to="/" />);
// 				}
// 			}
// 		});
// 	};

// 	// if there's a user show the message below

// 	if (user) {
// 		// return (<Navigate to="/" />);
// 		setTimeout(() => {
// 			window.location.href = "/"
// 		}, 2000)
// 	}
// 	const otpPopup = async e => {
// 		e.preventDefault();
// 		let firstChar = mobile.substring(0, 1)
// 		let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// 		if (!(regEmail.test(mobile) || (mobile.match('[0-9]{10}') && firstChar > 5 && mobile.length == 10))) {
// 			errorOMessage("Please enter a valid mobile number or email id")
// 			setOtpValidation(true)
// 			setShowLoginWithOtpPopup(true)
// 		} else {
// 			setForgotPasswordPopupLoader(<div style={{ marginLeft: 30 }} className='loaderr'></div>)


// 			var options = {
// 				method: 'post',
// 				url: window.location.origin + "/api/v1/sendOTP",
// 				data: JSON.stringify({
// 					'mobile': mobile
// 				}),
// 				headers: {
// 					'Accept': 'application/json',
// 					'Content-Type': 'application/json'
// 				}
// 			};
// 			axios(options)
// 				.then((response) => {
// 					//console.log(response);
// 					if (response.data !== '') {
// 						setShowLoginWithOtpPopup(false)
// 						setForgotPasswordPopupLoader("Continue")
// 						setShowOtpPopup(true)

// 					}
// 				})
// 				.catch((error) => {
// 					//console.log(error)
// 					errorMessage("There is some technical error.");
// 				})
// 		}
// 	}

// 	const verifyOtp = async e => {
// 		setOtpPopupLoader(<div style={{ margin: "auto", position: "initial" }} className='loaderr'></div>)
// 		e.preventDefault();
// 		var options = {
// 			method: 'post',
// 			url: window.location.origin + "/api/v1/verifyOTP",
// 			data: JSON.stringify({
// 				'mobile': mobile,
// 				'otp': otp
// 			}),
// 			headers: {
// 				'Accept': 'application/json',
// 				'Content-Type': 'application/json'
// 			}
// 		};
// 		axios(options)
// 			.then((response) => {
// 				console.log(response);
// 				if (response.data !== '') {

// 					if (response.data.api_status) {
// 						// store the user in localStorage
// 						localStorage.setItem('token', response.data.token);
// 						localStorage.setItem('refreshToken', response.data.refreshToken);
// 						localStorage.setItem('userName', response.data.user.firstName + " " + response.data.user.lastName);
// 						localStorage.setItem('user', response.data.user.firstName + " " + response.data.user.lastName);
// 						localStorage.setItem('email', response.data.user.email);
// 						if (!(localStorage.getItem("wishlistToken") === null || localStorage.getItem("wishlistToken") === undefined || localStorage.getItem("wishlistToken") === '')) {
// 							updateWishlist({
// 								context: {
// 									headers: {
// 										Authorization: "JWT " + response.data.token,
// 									},
// 								},
// 								variables: {
// 									input: {
// 										wishlistToken: localStorage.getItem("wishlistToken"),
// 									},
// 								},
// 								onCompleted: (data) => {
// 									console.log(data);
// 								},
// 							});
// 						} else {
// 							if (!(response.data.user.wishlistToken === null || response.data.user.wishlistToken === undefined)) {
// 								localStorage.setItem('wishlistToken', response.data.user.wishlistToken);
// 							}
// 						}
// 						localStorage.setItem('loginByOtp', "yes");
// 						localStorage.setItem('userId', response.data.user.id);
// 						customerAttachs()
// 						setUser(username);
// 						if (response.data.user.email.includes('@hegmakart.com')) {
// 							let tempEmail = response.data.user.email
// 							tempEmail = tempEmail.replace('@hegmakart.com', '')
// 							if (!isNaN(tempEmail) && tempEmail.length === 10) {
// 								localStorage.setItem('tempEmail', "yes");
// 							} else {
// 								setOtpPopupLoader("Verify")
// 								setShowOtpPopup(false)
// 								setErrorPopup(true)
// 								errorMessage("Incorrect Account Detail");
// 							}
// 						}
// 						(<Navigate to="/" />)
// 					} else {
// 						setOtpPopupLoader("Verify")
// 						setShowOtpPopup(false)
// 						setErrorPopup(true)

// 						let errMsg = response.data.message || "";
// 						if (response.data.errors && response.data.errors.length > 0) {
// 							errMsg = response.data.errors[0].message;
// 						}

// 						if (errMsg.includes('Account inactive., contact support@hegmakart.com for further help.')) {
// 							errorMessage("Your account is blocked/disabled , contact support@hegmakart.com for further help.");
// 						} else if (errMsg) {
// 							errorMessage(errMsg); // Display the actual error from the backend (e.g. "Please enter valid OTP." or rate limits)
// 						} else {
// 							errorMessage("Please enter valid otp.");
// 						}
// 					}

// 				}
// 			})
// 			.catch((error) => {
// 				//console.log(error)
// 				setErrorPopup(true)
// 				errorMessage("There is some technical error.");
// 			})
// 	}

// 	if (localStorage.getItem('email')) {
// 		setTimeout(() => {
// 			window.location.href = '/';
// 		}, 2000)
// 	}
// 	const changePasswordPopup = () => {
// 		setShowOtpPopup(false)

// 		setTimeout(() => {
// 			setShowLoginWithOtpPopup(true)
// 		}, 10);
// 	}

// 	return (
// 		<>
// 			<Helmet>
// 				<title>Hegmakart: Login</title>
// 				<meta name="description" content="Login" />
// 			</Helmet>

// 			{showLoginWithOtpPopup && <div style={{ display: "block", opacity: 1, background: "rgba(0,0,0,.6)" }} class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
// 				<div style={{ width: "40%" }} class="modal-dialog" role="document">
// 					<div style={{ marginTop: 200, borderRadius: 5 }} class="modal-content clearfix">
// 						<p style={{ position: "absolute", cursor: "pointer", right: -25, color: "white", fontSize: "3rem", fontFamily: "Roboto,Arial,sans-serif" }} onClick={() => { setShowLoginWithOtpPopup(false) }}>X</p>

// 						{/* <button type="button" class="close"  ><span onClick={()=>{setShowLoginWithOtpPopup(false)}} >×</span></button> */}
// 						<form onSubmit={otpPopup} class="modal-body">
// 							<span style={{ color: "red", fontWeight: 500, fontSize: "1.5rem" }}>{otpValidation ? errorOMe : null}</span>
// 							<h3 style={{ fontSize: "1.5rem", color: "grey", textAlign: "left" }} >Enter your 10 digit mobile number or email id to continue</h3>

// 							<div class="form-group">

// 								<input style={{ paddingLeft: 6 }} type="text" class="form-control" onChange={({ target }) => setMobile(target.value)} placeholder="Enter Mobile no/Email Id" required />
// 							</div>





// 							<button style={{ position: "relative" }} type="submit" class="btn btn-dark btn-md w-100">
// 								{forgotPasswordPopupLoader}
// 							</button>

// 						</form>
// 					</div>
// 				</div>
// 			</div>}

// 			{showOtpPopup && <div style={{ display: "block", opacity: 1, background: "rgba(0,0,0,.6)" }} class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
// 				<div style={{ width: "40%" }} class="modal-dialog" role="document">
// 					<div style={{ marginTop: 200, borderRadius: 5 }} class="modal-content clearfix">
// 						<p style={{ position: "absolute", cursor: "pointer", right: -25, color: "white", fontSize: "3rem", fontFamily: "Roboto,Arial,sans-serif" }} onClick={() => { setShowOtpPopup(false) }}>X</p>
// 						{/* <button type="button" class="close" data-dismiss="modal" ><span onClick={()=>{setShowOtpPopup(false)}} >×</span></button> */}
// 						<form class="modal-body">
// 							<p style={{ textAlign: "left", fontWeight: 500, color: "grey" }}> Please Enter OTP sent to <span style={{ fontSize: "1.6rem", fontWeight: 700 }}>{mobile} </span> <span onClick={changePasswordPopup} style={{ color: "orangered", cursor: "pointer" }}>Change</span></p>
// 							<p style={{ textAlign: "left", fontWeight: 500, display: "none" }}>We have sent an Otp to your given mobile number. please enter Otp to continue</p>
// 							<div style={{ maxWidth: "100%" }} class="form-group">

// 								<input style={{ paddingLeft: 5 }} type="text" class="form-control" onChange={({ target }) => setOtp(target.value)} placeholder="Enter Otp Here" required />
// 							</div>

// 							<button style={{ position: "relative" }} onClick={verifyOtp} type="submit" class="btn btn-dark btn-md w-100">
// 								{otpPopupLoader}
// 							</button>
// 						</form>
// 					</div>
// 				</div>
// 			</div>}

// 			<Header />
// 			< class=" bg-light">
// 				{/* <div class="page-header">
// 				<div class="container d-flex flex-column align-items-center">
// 					<nav aria-label="breadcrumb" class="breadcrumb-nav">
// 						<div class="container">
// 							<ol class="breadcrumb">
// 								<li class="breadcrumb-item"><a >Home</a></li>
// 								<li class="breadcrumb-item"><a >Shop</a></li>
// 								<li class="breadcrumb-item active" aria-current="page">
// 									My Account
// 								</li>
// 							</ol>
// 						</div>
// 					</nav>

// 					<h1>My Account</h1>
// 				</div>
// 			</div> */}

// 				<div class="container" style={{ paddingTop: 35 }}>

// 					<div class="row">
// 						<div className='col-lg-8 col-md-10 col-sm-11 col-11 mx-auto loginCon'>
// 							<div className='row'>
// 								<div className='col-5' style={{ background: "#EF6A37" }}>
// 									<div className='ml-md-5 ml-2 ml-sm-3 mr-md-4 mr-sm-2 mr-1 '>
// 										<h2 className='text-white mt-md-6 mt-sm-3 mt-1 loginText' >Login</h2>
// 										<p className='text-white leftText'>Get access to your Orders, Wishlist and Recommendations</p>
// 										<div className='d-flex justify-content-center align-items-end logoCon'>
// 											<span className="loginLogo">
// 												<img
// 													src="assets/images/logoWhite.png"
// 													alt="Logo"
// 												/>
// 											</span>
// 										</div>
// 									</div>

// 								</div>
// 								<div class="col-7 px-md-5 px-sm-4 px-2 bg-white">
// 									<div class="row">
// 										<div class="col-12">
// 											{errorPopup && <div className='errorBox'>
// 												<h4 className='errorBoxContent'>{errorMe}</h4>
// 											</div>}
// 											{checkoutmessage !== null && !errorPopup && <div className='errorBox'>
// 												<h4 className='errorBoxContent'>Please login to continue checkout</h4>
// 											</div>}
// 											{/* <div class="heading mb-1">
// 									<h2 class="title">Login</h2>
// 								</div> */}
// 											<form onSubmit={handleSubmit} action="#" className={!errorPopup ? 'mt-md-4 mt-sm-2 mt-1' : 'mt-md-1 mt-sm-1'}>
// 												{/* Email */}
// 												<label for="login-email">
// 													Enter Email/ Mobile Number
// 													<span class="required">*</span>
// 												</label>
// 												<input name="username" type="text" class="form-input form-wide" id="login-email" value={username} autoComplete="off" onChange={({ target }) => setUsername(target.value)} placeholder="Enter Email/Mobile Number" />
// 												{/*Password  */}
// 												<div className='d-flex justify-content-between mt-md-3 mt-sm-2 mt-1'>
// 													<label for="login-password">
// 														Password
// 														<span class="required">*</span>
// 													</label>
// 													<span onClick={() => { setShowLoginWithOtpPopup(true) }} style={{ color: "orangered", fontWeight: 700, cursor: "pointer" }}>Forgot?</span>
// 												</div>
// 												<input name="password" type="password" class="form-input form-wide" id="login-password" autoComplete="off" value={password} onChange={({ target }) => setPassword(target.value)} required placeholder="Enter password" />

// 												{/* Login Btn */}
// 												<div className='mt-md-2 mt-sm-1 mt-1'>
// 													<span className='termPolicy' style={{ paddingBottom: 4, display: "block", color: "gray", fontWeight: 500 }}>By continuing, you agree to Hegmakart <Link to="/TermAndConditions"><span style={{ color: "#2874f0" }}>Terms of Use</span></Link> and <Link to="/privacy-policy"><span style={{ color: "#2874f0" }}>Privacy Policy</span></Link>.</span>

// 													<button type="submit" class="btn  btn-md w-100  text-white py-md-4  py-sm-3 py-2 loginBtn" >
// 														LOGIN
// 													</button>
// 													<div class="text-center py-md-3 py-sm-2">OR </div>
// 													<button style={{ display: "none" }} type="submit" class="btn btn-dark  w-100">
// 														Forgot Password / request OTP
// 													</button>
// 													<button onClick={() => { setShowLoginWithOtpPopup(true) }} type="button" class="btn btn-dark py-md-4  py-sm-3 py-2  w-100 requestBtn" >
// 														Request OTP
// 													</button>
// 												</div>
// 												<div class="orr"></div>

// 												<div>
// 													<div className='loginWithOtpBtn' onClick={() => { setShowLoginWithOtpPopup(true) }}>New to HegmaKart? Create an Account</div>
// 												</div>


// 											</form>
// 										</div>
// 									</div>
// 								</div></div></div>
// 					</div>
// 					{/* <div class="row">
				
// 					<div class="col-lg-6 mx-auto">
// 						<div class="row">
						    
// 							<div class="col-md-12">
// 								{errorPopup && <div className='errorBox'>
// 								<h4 className='errorBoxContent'>The Username or Password You Entered Is incorrect</h4>
// 								</div>}
								
							
// 								<div class="heading mb-1">
// 									<h2 class="title">Login</h2>
// 								</div>
								
// 								<form style={{marginBottom:150}} onSubmit={handleSubmit} action="#">
// 									<label for="login-email">
// 										Enter Email/ Mobile Number
// 										<span class="required">*</span>
// 									</label>
									
// 									<input name="username" type="text" class="form-input form-wide" id="login-email" value={username} autoComplete="off" onChange={({ target }) => setUsername(target.value)} />
// 									<label for="login-password">
// 										Password
// 										<span class="required">*</span>
// 									</label>
// 									<input name="password" type="password" class="form-input form-wide" id="login-password" autoComplete="off" value={password} onChange={({ target }) => setPassword(target.value)} required />

// 									<button type="submit" class="btn btn-dark btn-md w-100">
// 										LOGIN
// 									</button>
// 									<div class="orr">OR request OTP</div>
// 									<button style={{display:"none"}} type="submit" class="btn btn-dark  w-100">
// 										Forgot Password / request OTP
// 									</button>
// 									<button onClick={()=>{setShowLoginWithOtpPopup(true)}} type="button" class="btn btn-dark  w-100">
// 										Forgot Password / request OTP
// 									</button>
// 									<div class="orr"></div>
									
// <div>
// 	<div className='loginWithOtpBtn' onClick={()=>{setShowLoginWithOtpPopup(true)}}>New to HegmaKart? Create an Account</div>
// </div>
					
									
// 								</form>
// 							</div>
							
// 						</div>
// 					</div>
// 				</div> */}
// 				</div>
// 			</>
// 			<Footer />
// 		</>
// 	)
// }

// export default LoginScreen
