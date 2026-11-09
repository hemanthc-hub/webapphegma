import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import "./LoginScreen.css";

const signinImage = "/assets/images/signin(3).jpeg";
const signinImage2 = "/assets/images/signin-2.jpeg";

export default function SignIn() {
	const navigate = useNavigate();

	const [email, setEmail] = useState("");
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [showOtpInput, setShowOtpInput] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const otpInputsRef = useRef([]);

	// Auto-focus first OTP input when OTP screen appears
	useEffect(() => {
		if (showOtpInput) {
			console.log("[LoginScreen] showOtpInput became true. Focusing first OTP input.");
			const timer = setTimeout(() => {
				otpInputsRef.current[0]?.focus();
			}, 50);
			return () => clearTimeout(timer);
		}
	}, [showOtpInput]);

	// Detect input type for dynamic icon
	const isPhone = /^[0-9+]/.test(email);
	const isEmail = email.includes("@");
	const inputType = isEmail ? "email" : isPhone ? "phone" : "default";

	// Generate OTP
	const handleGenerateOtp = (e) => {
		e.preventDefault();

		if (!email.trim()) {
			toast.error("Please enter Email or Mobile Number");
			return;
		}
		if (!isEmail && !/^(\+91)?[6-9]\d{9}$/.test(email.trim())) {
			toast.error("Please enter a valid 10-digit mobile number");
			return;
		}
		if (isEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
			toast.error("Please enter a valid email address");
			return;
		}

		const identifier = email.trim().replace(/^\+91/, "");
		const baseUrl = process.env.REACT_APP_OTP_API_URL
			|| process.env.REACT_APP_REST_API_URL
			|| window.location.origin;

		setIsSubmitting(true);
		console.log("[LoginScreen] Generating OTP ->", { baseUrl, identifier, url: `${baseUrl}/api/v1/sendOTP` });
		axios.post(`${baseUrl}/api/v1/sendOTP`, { mobile: identifier }, {
			headers: { Accept: "application/json", "Content-Type": "application/json" }
		}).then((response) => {
			console.log("[LoginScreen] sendOTP response:", { status: response.status, data: response.data });
			if (response.status === 200) {
				setOtp(["", "", "", "", "", ""]);
				setShowOtpInput(true);
				toast.success("OTP sent successfully");
			} else {
				toast.error(response.data?.message || "Could not send OTP");
			}
		}).catch((error) => {
			console.error("[LoginScreen] sendOTP error:", {
				status: error.response?.status,
				data: error.response?.data,
				message: error.message
			});
			toast.error(error.response?.data?.message || "Could not send OTP. Please check your network.");
		}).finally(() => {
			setIsSubmitting(false);
		});
	};

	// Verify OTP
	const handleVerifyOtp = (e) => {
		e.preventDefault();
		const enteredOtp = Array.isArray(otp) ? otp.join("") : (otp || "");
		if (!/^\d{6}$/.test(enteredOtp)) {
			toast.error("Please enter the complete 6-digit OTP");
			return;
		}

		const identifier = email.trim().replace(/^\+91/, "");
		const baseUrl = process.env.REACT_APP_OTP_API_URL
			|| process.env.REACT_APP_REST_API_URL
			|| window.location.origin;

		setIsSubmitting(true);
		console.log("[LoginScreen] Verifying OTP ->", {
			baseUrl,
			identifier,
			enteredOtp,
			channel: "default-channel",
			url: `${baseUrl}/api/v1/verifyOTP`
		});
		axios.post(`${baseUrl}/api/v1/verifyOTP`, {
			mobile: identifier,
			otp: enteredOtp,
			channel: "default-channel"
		}, {
			headers: { Accept: "application/json", "Content-Type": "application/json" }
		}).then((response) => {
			console.log("[LoginScreen] verifyOTP response:", { status: response.status, data: response.data });
			const data = response.data;
			if (data?.api_status === "true" && data.token) {
				localStorage.setItem("isLoggedIn", "true");
				localStorage.setItem("token", data.token);
				localStorage.setItem("user", data.user?.email || identifier);
				localStorage.setItem("loginByOtp", "yes");
				if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

				if (isPhone) {
					localStorage.setItem("userPhone", identifier);
					localStorage.setItem("userName", data.user?.firstName || identifier);
				} else {
					localStorage.setItem("userEmail", identifier);
					localStorage.setItem("email", identifier);
					localStorage.setItem("userName", data.user?.firstName || identifier.split("@")[0]);
				}

				window.dispatchEvent(new Event("loginStatusChanged"));
				toast.success("Login Successful");
				navigate("/");
			} else {
				toast.error(data?.message || "Invalid OTP");
			}
		}).catch((error) => {
			console.error("[LoginScreen] verifyOTP error:", {
				status: error.response?.status,
				data: error.response?.data,
				message: error.message
			});
			toast.error(error.response?.data?.message || "Could not verify OTP. Please try again.");
		}).finally(() => {
			setIsSubmitting(false);
		});
	};

	// Handle single-digit input and auto-navigation to next box
	const handleOtpChange = (e, index) => {
		const rawValue = e.target.value;
		const numericChars = rawValue.replace(/\D/g, "");
		console.log(`[LoginScreen] OTP onChange at index ${index}: raw="${rawValue}", numeric="${numericChars}"`);

		if (!numericChars) {
			const newOtp = [...otp];
			newOtp[index] = "";
			setOtp(newOtp);
			return;
		}

		// Handle multi-character autofill/paste in onChange
		if (numericChars.length >= 6) {
			const digits = numericChars.slice(0, 6).split("");
			const newOtp = ["", "", "", "", "", ""];
			digits.forEach((digit, i) => {
				newOtp[i] = digit;
			});
			setOtp(newOtp);
			console.log("[LoginScreen] Full OTP autofilled/pasted via onChange:", newOtp.join(""));
			otpInputsRef.current[5]?.focus();
			return;
		}

		// Single character or replacement
		const newOtp = [...otp];
		const char = numericChars.slice(-1); // Take latest typed digit
		newOtp[index] = char;
		setOtp(newOtp);
		console.log(`[LoginScreen] OTP updated at index ${index} with "${char}". Current OTP: ${newOtp.join("")}`);

		// Automatically navigate to next OTP input box
		if (index < 5) {
			console.log(`[LoginScreen] Auto-navigating focus to OTP box index ${index + 1}`);
			otpInputsRef.current[index + 1]?.focus();
		}
	};

	// Handle Backspace and Arrow navigation
	const handleOtpKeyDown = (e, index) => {
		console.log(`[LoginScreen] OTP onKeyDown at index ${index}: key="${e.key}", current="${otp[index]}"`);

		if (e.key === "Backspace") {
			if (!otp[index] && index > 0) {
				// Current box is empty, move focus back to previous box and clear it
				const newOtp = [...otp];
				newOtp[index - 1] = "";
				setOtp(newOtp);
				console.log(`[LoginScreen] Backspace navigated back to index ${index - 1}`);
				otpInputsRef.current[index - 1]?.focus();
			}
		} else if (e.key === "ArrowLeft" && index > 0) {
			e.preventDefault();
			otpInputsRef.current[index - 1]?.focus();
		} else if (e.key === "ArrowRight" && index < 5) {
			e.preventDefault();
			otpInputsRef.current[index + 1]?.focus();
		}
	};

	// Handle OTP paste
	const handleOtpPaste = (e, startIndex) => {
		e.preventDefault();
		const pastedText = e.clipboardData.getData("text");
		const numericChars = pastedText.replace(/\D/g, "");
		console.log(`[LoginScreen] OTP paste event at index ${startIndex}: pasted="${pastedText}", numeric="${numericChars}"`);

		if (!numericChars) return;

		const newOtp = [...otp];
		const isFullCode = numericChars.length >= 6;
		const offset = isFullCode ? 0 : startIndex;
		const digits = numericChars.slice(0, 6 - offset).split("");

		digits.forEach((digit, i) => {
			if (offset + i < 6) {
				newOtp[offset + i] = digit;
			}
		});

		setOtp(newOtp);
		console.log("[LoginScreen] OTP after paste:", newOtp.join(""));
		const nextFocusIndex = Math.min(offset + digits.length, 5);
		otpInputsRef.current[nextFocusIndex]?.focus();
	};

	return (
		<>
			<div className="signin-section">

				{/* Background Image (Responsive Desktop & Mobile) */}
				<picture className="signin-background-picture">
					<img
						src={signinImage}
						alt="Background"
						className="signin-background"
					/>
				</picture>

				{/* Close / Guest button */}
				<button
					className="guest-close-btn"
					type="button"
					title="Continue as guest"
					onClick={() => navigate("/")}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
						<line x1="18" y1="6" x2="6" y2="18" />
						<line x1="6" y1="6" x2="18" y2="18" />
					</svg>
				</button>

				{/* Background Overlay */}
				<div className="signin-overlay" />

				{/* Main Content */}
				<div className="signin-content">

					<div className="signin-container">

						{/* Illustration */}
						<div className="signin-illustration">
							<img
								src={signinImage2}
								alt="Illustration"
							/>
						</div>

						{/* Login Card */}
						<div className="signin-card">

							{/* Heading */}
							<h2 className="signin-title">
								Welcome Back! 👋
							</h2>

							{/* Description */}
							<p className="signin-description">
								Login to access your orders, wishlist and personalized
								recommendations.
							</p>

							{/* Form */}
							<form
								onSubmit={
									showOtpInput
										? handleVerifyOtp
										: handleGenerateOtp
								}
								className="signin-form"
							>

								{/* Label */}
								<label className="signin-label">
									Email / Mobile Number
								</label>

								{/* Email / Mobile Input */}
								<div className="input-wrapper">

									{/* Dynamic Icon */}
									{inputType === "email" && (
										<svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
										</svg>
									)}
									{inputType === "phone" && (
										<svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
										</svg>
									)}
									{inputType === "default" && (
										<svg xmlns="http://www.w3.org/2000/svg" className="input-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
										</svg>
									)}

									<input
										type="text"
										placeholder="Enter Email / Mobile Number"
										value={email}
										onChange={(e) => setEmail(e.target.value)}
										disabled={showOtpInput}
										className="signin-input"
									/>

								</div>

								{/* OTP Inputs */}
								{showOtpInput && (
									<div className="otp-container">
										{[0, 1, 2, 3, 4, 5].map((index) => (
											<input
												key={index}
												ref={(el) => (otpInputsRef.current[index] = el)}
												type="text"
												inputMode="numeric"
												autoComplete={index === 0 ? "one-time-code" : "off"}
												maxLength={index === 0 ? 6 : 2}
												value={otp[index] || ""}
												onChange={(e) => handleOtpChange(e, index)}
												onKeyDown={(e) => handleOtpKeyDown(e, index)}
												onPaste={(e) => handleOtpPaste(e, index)}
												onFocus={(e) => e.target.select()}
												className="otp-input"
											/>
										))}
									</div>
								)}

								{/* OTP Message */}
								{!showOtpInput && (
									<p className="otp-message">
										We will send you a One Time Password (OTP)
									</p>
								)}

								{/* Main Button */}
								<button
									type="submit"
									className="otp-button"
									disabled={isSubmitting}
								>
									{isSubmitting
										? "Please wait..."
										: showOtpInput
										? "Verify OTP"
										: "Generate OTP"}
								</button>

								{/* Divider
								<div className="signin-divider">
									<div />
									<span>OR</span>
									<div />
								</div> */}

								{/* Google Login 
								<button
									type="button"
									onClick={() => navigate("/google-signin")}
									className="google-button"
								>
									<img
										src="https://www.svgrepo.com/show/475656/google-color.svg"
										alt="Google"
									/>

									<span>
										Continue with Google
									</span>
								</button>

								{/* Sign Up */}
								{/* <p className="signup-text">
									New to HegmaKart?{" "}

									<Link
										to="/signup"
										className="signup-link"
									>
										Create an account
									</Link>
								</p> */}


								{/* Terms */}
								<p className="terms-text">
									By continuing, you agree to HegmaKart's
									<br />

									<span className="terms-link">
										Terms of Use
									</span>

									{" "}and{" "}

									<span className="terms-link">
										Privacy Policy
									</span>
									.
								</p>

							</form>
						</div>
					</div>
				</div>
			</div>

			{/* Footer */}
			{/* <Footer /> */}
		</>
	);
}