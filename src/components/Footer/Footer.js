import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import axios from "axios";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaCheckCircle,
  FaPaperPlane,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaClock
} from "react-icons/fa";
import { GET_CATEGORIES_SUBLIST, SHOP_DATA } from "../../GraphQL/Queries";
import MobileNavbar from "./MobileNavbar";
import "./Footer.css";

const Footer = ({ hideMobileNavbar = false }) => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);
  const [shopDesc, setShopDesc] = useState("India's trusted B2B medical marketplace for doctors, dermatologists, and healthcare professionals. Delivering clinical excellence with precision since 2019.");
  const [categories, setCategories] = useState([]);
  const loggedInUser = localStorage.getItem("user");

  useQuery(SHOP_DATA, {
    onCompleted: (data) => {
      if (data?.shop?.description) {
        setShopDesc(data.shop.description);
      }
    },
    onError: () => { }
  });

  const { data: catData } = useQuery(GET_CATEGORIES_SUBLIST, {
    variables: { first: 6, level: 0 },
  });

  useEffect(() => {
    if (catData?.categories?.edges) {
      setCategories(catData.categories.edges);
    }
  }, [catData]);

  const subscribeNewsLetter = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribing(true);
    const options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/newsletterSubscription",
      data: JSON.stringify({ email_id: email }),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    };
    axios(options)
      .then(() => {
        setSubscribing(false);
        setSubscribed(true);
        setEmail("");
      })
      .catch(() => {
        setSubscribing(false);
        setSubscribed(true);
      });
  };

  return (
    <>
      <footer className="hk-footer-root w-full mt-16 font-sans">
        {/* Newsletter Banner - Adapted to light theme */}
        <div className="hidden md:block">
          <div className="w-full border-y border-blue-100 bg-gradient-to-r from-[#F0F7FF] via-[#E8F3FF] to-[#F0F7FF] px-5 py-5 gap-5">


            <div className="mx-auto grid max-w-[1450px] grid-cols-1 items-center gap-6 lg:grid-cols-[1.1fr_1.15fr_0.95fr]">


              {/* LEFT - DESCRIPTION */}
              <div className="text-center lg:text-left ">


                <h3 className="font-['Outfit'] text-[20px] font-bold tracking-tight text-[#172554]">
                  Order Smarter. Order Faster.
                </h3>


                <p className="mt-2 text-[13px] leading-[1.7] text-slate-600">
                  Download the HegmaKart medical app for exclusive
                  mobile deals, or subscribe to our insider newsletter
                  for immediate clinical product drop alerts.
                </p>


              </div>




              {/* MIDDLE - SUBSCRIBE FORM */}
              <div className="w-[170px] min-w-0 lg:min-w-[450px]">


                <form
                  onSubmit={subscribeNewsLetter}
                  className="flex h-[56px] w-full items-center gap-2 rounded-full bg-white/80 p-2 shadow-[0_6px_20px_rgba(37,99,235,0.15)] transition-all duration-300 focus-within:shadow-[0_6px_24px_rgba(37,99,235,0.2)]"
                >
                  {/* Email Input */}
                  <div className="flex min-w-0 flex-1 items-center gap-3 px-3">


                    <svg
                      className="h-10 w-10 shrink-0 text-[#334155]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                        d="M3 6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v10.5a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 17.25V6.75z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.7"
                        d="M3.5 6l8.5 7 8.5-7"
                      />
                    </svg>


                    <div className="h-9 w-px shrink-0 bg-slate-300" />


                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter doctor email"
                      className="w-full min-w-0 border-none bg-transparent py-3 text-[15px] font-normal text-slate-700 outline-none ring-0 placeholder:text-[#64748B] focus:border-none focus:outline-none focus:ring-0"
                      disabled={subscribed || subscribing}
                      required
                    />
                  </div>


                  {/* Subscribe Button */}
                  <button
                    type="submit"
                    disabled={subscribed || subscribing}
                    className="flex h-[43px] min-w-[180px] shrink-0 items-center justify-center gap-3 rounded-full border-0 bg-gradient-to-r from-[#2563EB] to-[#0849D9] px-8 text-[16px] font-bold text-white shadow-[0_5px_12px_rgba(37,99,235,0.25)] outline-none ring-0 transition-all duration-300 hover:from-[#1D4ED8] hover:to-[#063BB5] hover:shadow-lg focus:border-0 focus:outline-none focus:ring-0 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-70"
                    style={{
                      border: "none",
                      outline: "none",
                      appearance: "none",
                      WebkitAppearance: "none",
                    }}
                  >
                    {subscribing ? (
                      "Joining..."
                    ) : subscribed ? (
                      <>
                        <FaCheckCircle size={15} />
                        Joined
                      </>
                    ) : (
                      <>
                        <FaPaperPlane size={15} />
                        Subscribe
                      </>
                    )}
                  </button>
                </form>


              </div>




              {/* RIGHT - APP COMING SOON */}
              <div className="flex w-full items-center gap-2 rounded-xl border border-blue-100 bg-[#DCEBFF] px-3 py-2.5">


                {/* Left Image */}
                <div className="flex h-[120px] w-[155px] shrink-0 items-center justify-center">
                  <img
                    src={`${process.env.PUBLIC_URL || ""}/assets/images/app-coming-soon.png`}
                    alt="HegmaKart Android and iOS App"
                    className="h-full w-full object-contain"
                  />
                </div>


                {/* Right Content */}
                <div className="flex min-w-0 flex-1 flex-col items-start justify-center">


                  <h3 className="m-0 font-['Outfit'] text-[15px] font-bold leading-5 text-[#172554]">
                    HegmaKart App
                  </h3>


                  <p className="m-0 mt-1 font-['Outfit'] text-[17px] font-bold leading-6 text-blue-600">
                    Coming Soon
                  </p>


                  <p className="m-0 mt-2 font-['Outfit'] text-[11px] font-normal leading-[1.4] text-slate-600">
                    Get ready for a better shopping experience on mobile.
                  </p>


                </div>


              </div>


            </div>


          </div>

          {/* Main Footer from UI2 */}
          <div className="hk-footer-panel">
            {/* Top */}
            <div className="hk-footer-content-grid">
              {/* Column 1 */}
              <div className="hk-footer-brand-column">
                <img
                  src={`${process.env.PUBLIC_URL || ""}/assets/images/logoHegma.png`}
                  alt="HegmaKart"
                  className="h-[40px] w-auto mb-1 object-contain"
                />
                <div className="hk-footer-establishment-badge">
                  <span className="hk-footer-established-pill">
                    <svg viewBox="0 0 40 44" aria-hidden="true">
                      <path d="M10 25 7 41l10-5 7 7 2-17M30 25l3 16-10-5-7 7-2-17" fill="#f5b82e" stroke="#f5b82e" strokeLinejoin="round" strokeWidth="2" />
                      <circle cx="20" cy="17" r="13" fill="#ffd45a" stroke="#ffe8a1" strokeWidth="2" />
                      <path d="m20 7 2.8 6 6.5.8-4.8 4.5 1.2 6.4-5.7-3.2-5.7 3.2 1.2-6.4-4.8-4.5 6.5-.8L20 7Z" fill="#fff" />
                    </svg>
                    <span>Established 2019</span>
                  </span>
                  <span className="hk-footer-trusted-pill">
                    <span aria-hidden="true">✦</span>
                    <span>Trusted by<br />Professionals</span>
                  </span>
                </div>

                <p className="text-[13.125px] text-slate-600 leading-10">
                  {shopDesc}
                </p>

                <div className="flex gap-3 mt-1">
                  <a
                    href="https://www.facebook.com/p/Hegmakartdental-61552795986527/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 rounded-full text-white flex items-center justify-center border border-blue-600"
                  >
                    <FaFacebookF size={19} color="white" />
                  </a>

                  <a
                    href="https://www.instagram.com/hegma_kart/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <FaInstagram size={19} />
                  </a>

                  <a
                    href="https://www.linkedin.com/company/hegmakart-com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-20 h-20 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <FaLinkedinIn size={19} />
                  </a>

                  <a
                    href="#"
                    className="w-20 h-20 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    <FaYoutube size={19} />
                  </a>
                </div>
              </div>

              {/* Quick Links + Information + Policy */}
              <div className="hk-footer-link-group">
                {/* Account & Support */}
                <div className="hk-footer-column">
                  <h3 className="font-semibold mb-4 uppercase text-[13.125px] text-slate-800">
                    Account & Support
                  </h3>

                  <ul className="space-y-3 text-slate-600 text-[13.125px] m-0 p-0 list-none">
                    <li><Link to={loggedInUser ? "/Dashboard" : "/login"} className="hover:text-blue-600 transition-colors no-underline text-slate-600">My Account</Link></li>
                    <li><Link to="/order" className="hover:text-blue-600 transition-colors no-underline text-slate-600">My Orders & Reorder</Link></li>
                    <li><Link to="/wishlist" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Saved Watchlist</Link></li>
                    <li><Link to="/offline-order" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Offline Order Desk</Link></li>
                    <li><Link to="/contact-us" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Contact Us</Link></li>
                    <li><Link to="/about" className="hover:text-blue-600 transition-colors no-underline text-slate-600">About Us</Link></li>
                  </ul>
                </div>

                {/* Medical Specialties */}
                <div className="hk-footer-column">
                  <h3 className="font-semibold mb-4 uppercase text-[13.125px] text-slate-800">
                    Specialties
                  </h3>

                  <ul className="space-y-3 text-slate-600 text-[13.125px] m-0 p-0 list-none">
                    {categories.length > 0 ? (
                      categories.slice(0, 5).map(({ node }) => (
                        <li key={node.id}>
                          <Link to={`/category/${node.slug}`} className="hover:text-blue-600 transition-colors no-underline text-slate-600">
                            {node.name}
                          </Link>
                        </li>
                      ))
                    ) : (
                      <>
                        <li><Link to="/collection/special-offers" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Special Offers</Link></li>
                        <li><Link to="/offline-order" className="hover:text-blue-600 transition-colors no-underline text-slate-600">New Clinic Setup Kits</Link></li>
                      </>
                    )}
                    <li><Link to="/brand/3M" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Featured Brands</Link></li>
                  </ul>
                </div>

                {/* Policy */}
                <div className="hk-footer-column">
                  <h3 className="font-semibold mb-4 uppercase text-[13.125px] text-slate-800">
                    Policy
                  </h3>

                  <ul className="space-y-3 text-slate-600 text-[13.125px] m-0 p-0 list-none">
                    <li><Link to="/privacy-policy" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Privacy Policy</Link></li>
                    <li><Link to="/TermAndConditions" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Terms of Use</Link></li>
                    <li><Link to="/ShippingDeliveryPolicy" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Shipping Policy</Link></li>
                    <li><Link to="/ReturnPolicy" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Return & Refund Policy</Link></li>
                  </ul>
                </div>
              </div>

              {/* Contact Information */}
              <div className="hk-footer-contact">
                <h3 className="font-semibold mb-4 uppercase text-[13.125px] text-slate-800">
                  Contact Us
                </h3>

                <div className="space-y-5 text-[13.125px] text-slate-600">
                  {/* Address */}
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                    <p className="leading-10 m-0">
                      Hegma Tech Pvt. Ltd.
                      <br />
                      #515, 1st floor, 6th 'A' main, AECS Layout, A
                      Block, Singasandra, Bengaluru. 560068
                      Karnataka, India
                    </p>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-3">
                    <FaPhoneAlt className="w-5 h-5 text-blue-600 shrink-0" />
                    <a href="tel:+918553666877" className="text-slate-600 hover:text-blue-600 no-underline transition-colors">+91 855-366-6877</a>
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="w-5 h-5 text-blue-600 shrink-0" />
                    <a href="mailto:support@hegmakart.com" className="text-slate-600 hover:text-blue-600 no-underline transition-colors">support@hegmakart.com</a>
                  </div>

                  {/* Working Hours */}
                  <div className="flex items-center gap-3">
                    <FaClock className="w-5 h-5 text-blue-600 shrink-0" />
                    <span>Mon-Sat 9:00 AM - 7:00 PM IST</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="hk-footer-payments">
              <div className="flex flex-col items-center justify-center gap-2">
                <h3 className="font-semibold uppercase text-[15px] text-slate-800 m-0 whitespace-nowrap">
                  Payment Partners
                </h3>

                <img
                  src={`${process.env.PUBLIC_URL || ""}/assets/images/demoes/demo21/payment-icon.png`}
                  alt="Payment Partners"
                  className="hk-footer-payment-image object-contain"
                />
              </div>
            </div>

            {/* Divider */}
            <div className="hk-footer-bottom">
              <p className="text-[13.125px] text-slate-500 m-0 text-center md:text-left">
                Made with <span className="text-red-500">❤</span> for Dental Professionals
              </p>

              <img
                src={`${process.env.PUBLIC_URL || ""}/assets/images/apps.png`}
                alt="Download on Google Play and the App Store"
                className="hk-footer-app-badges"
              />

              <p className="text-[13.125px] text-slate-500 m-0 text-center md:text-right">
                © {new Date().getFullYear()} Hegmakart. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
        <div className="block md:hidden">
          <div className="bg-gradient-to-r from-[#F0F7FF] via-[#E8F3FF] to-[#F0F7FF] py-6 px-4 border-b border-blue-100">
            <div className="max-w-xl mx-auto flex flex-col items-center gap-4">
              <div className="text-center">
                <h3 className="text-slate-800 font-extrabold text-xl tracking-tight" style={{ fontFamily: "Outfit, sans-serif" }}>
                  Order Smarter. Order Faster.
                </h3>
                <p className="text-slate-600 text-[12.5px] mt-1.5 leading-relaxed">
                  Download the HegmaKart medical app for exclusive mobile deals, or subscribe to our insider newsletter for immediate clinical product drop alerts.
                </p>
              </div>

              <div className="w-full">
                <form onSubmit={subscribeNewsLetter} className="flex items-center w-full bg-white rounded-full p-1.5 border border-blue-200 shadow-sm">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter doctor email..."
                    className="bg-transparent text-slate-800 px-3 py-2 outline-none text-[13px] placeholder:text-slate-400 w-full min-w-0 flex-1 border-none focus:outline-none"
                    disabled={subscribed || subscribing}
                    required
                  />
                  <button
                    type="submit"
                    disabled={subscribed || subscribing}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] px-4 py-2 rounded-full transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    {subscribing ? "Joining..." : subscribed ? <><FaCheckCircle size={14} /> Joined</> : <><FaPaperPlane size={13} /> Subscribe</>}
                  </button>
                </form>
              </div>

              {/* App Coming Soon with Image */}
              <div className="flex w-full items-center gap-3 rounded-2xl border border-blue-100 bg-[#DCEBFF] p-3 shadow-sm">
                <div className="flex h-[90px] w-[110px] shrink-0 items-center justify-center">
                  <img
                    src={`${process.env.PUBLIC_URL || ""}/assets/images/app-coming-soon.png`}
                    alt="HegmaKart Android and iOS App"
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
                  <h3 className="m-0 font-['Outfit'] text-[14px] font-bold leading-5 text-[#172554]">
                    HegmaKart App
                  </h3>

                  <p className="m-0 mt-0.5 font-['Outfit'] text-[16px] font-bold leading-6 text-blue-600">
                    Coming Soon
                  </p>

                  <p className="m-0 mt-1 font-['Outfit'] text-[11px] font-normal leading-[1.4] text-slate-600">
                    Get ready for a better shopping experience on mobile.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="hk-footer-panel hk-footer-mobile-panel">
            <div className="hk-footer-mobile-brand">
              <img
                src={`${process.env.PUBLIC_URL || ""}/assets/images/logoHegma.png`}
                alt="HegmaKart"
                className="h-[50px] w-auto mb-1 object-contain"
              />
              <div className="hk-footer-establishment-badge">
                <span className="hk-footer-established-pill">
                  <svg viewBox="0 0 40 44" aria-hidden="true">
                    <path d="M10 25 7 41l10-5 7 7 2-17M30 25l3 16-10-5-7 7-2-17" fill="#f5b82e" stroke="#f5b82e" strokeLinejoin="round" strokeWidth="2" />
                    <circle cx="20" cy="17" r="13" fill="#ffd45a" stroke="#ffe8a1" strokeWidth="2" />
                    <path d="m20 7 2.8 6 6.5.8-4.8 4.5 1.2 6.4-5.7-3.2-5.7 3.2 1.2-6.4-4.8-4.5 6.5-.8L20 7Z" fill="#fff" />
                  </svg>
                  <span>Established 2019</span>
                </span>
                <span className="hk-footer-trusted-pill">
                  <span aria-hidden="true">✦</span>
                  <span>Trusted by<br />Professionals</span>
                </span>
              </div>

              <p className="text-[13.125px] text-slate-800 leading-10">
                {shopDesc}
              </p>

              <div className="flex gap-3 mt-5">
                <a
                  href="https://www.facebook.com/p/Hegmakartdental-61552795986527/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-13 h-13 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <FaFacebookF size={14} />
                </a>

                <a
                  href="https://www.instagram.com/hegma_kart/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-13 h-13 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <FaInstagram size={14} />
                </a>

                <a
                  href="https://www.linkedin.com/company/hegmakart-com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-13 h-13 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <FaLinkedinIn size={14} />
                </a>

                <a
                  href="#"
                  className="w-13 h-13 rounded-full border border-blue-600 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300"
                >
                  <FaYoutube size={14} />
                </a>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4 ml-4 mb-4 hk-footer-mobile-links">

              {/* Account & Support */}
              <div className="hk-footer-column">
                <h3 className="w-full self-start text-left font-semibold mb-2 uppercase text-[13.125px] text-slate-800 -ml-5">
                  Account & Support
                </h3>

                <ul className="space-y-3 text-slate-600 text-[13.125px] m-0 p-0 list-none">
                  <li><Link to={loggedInUser ? "/Dashboard" : "/login"} className="hover:text-blue-600 transition-colors no-underline text-slate-600">My Account</Link></li>
                  <li><Link to="/order" className="hover:text-blue-600 transition-colors no-underline text-slate-600">My Orders & Reorder</Link></li>
                  <li><Link to="/wishlist" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Saved Watchlist</Link></li>
                  <li><Link to="/offline-order" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Offline Order Desk</Link></li>
                  <li><Link to="/contact-us" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Contact Us</Link></li>
                  <li><Link to="/about" className="hover:text-blue-600 transition-colors no-underline text-slate-600">About Us</Link></li>
                </ul>
              </div>

              {/* Specialties */}
              <div className="hk-footer-column">
                <h3 className="w-full self-start text-left font-semibold mb-2 uppercase text-[13.125px] text-slate-800">
                  Specialties
                </h3>

                <ul className="space-y-3 text-slate-600 text-[13.125px] m-0 p-0 list-none">
                  {categories.length > 0 ? (
                    categories.slice(0, 5).map(({ node }) => (
                      <li key={node.id}>
                        <Link
                          to={`/category/${node.slug}`}
                          className="hover:text-blue-600 transition-colors no-underline text-slate-600"
                        >
                          {node.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <>
                      <li><Link to="/collection/special-offers" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Special Offers</Link></li>
                      <li><Link to="/offline-order" className="hover:text-blue-600 transition-colors no-underline text-slate-600">New Clinic Setup Kits</Link></li>
                    </>
                  )}
                  <li><Link to="/brand/3M" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Featured Brands</Link></li>
                </ul>
              </div>

            </div>
            {/* policy */}
            <div className="ml-[15px] hk-footer-column hk-footer-mobile-policy">
              <h3 className="w-full self-start text-left font-semibold mb-2 uppercase text-[13.125px] text-slate-800 -ml-5">
                Policy
              </h3>

              <ul className="space-y-3 text-slate-600 text-[13.125px] m-0 p-0 list-none">
                <li><Link to="/privacy-policy" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Privacy Policy</Link></li>
                <li><Link to="/TermAndConditions" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Terms of Use</Link></li>
                <li><Link to="/ShippingDeliveryPolicy" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Shipping Policy</Link></li>
                <li><Link to="/ReturnPolicy" className="hover:text-blue-600 transition-colors no-underline text-slate-600">Return & Refund Policy</Link></li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="col-span-2 mt-3 lg:col-span-1 lg:mt-0 lg:-ml-4 xl:-ml-5 ml-2 hk-footer-contact hk-footer-mobile-contact">
              <h3 className="w-full self-start text-left font-semibold mb-2 uppercase text-[13.125px] text-slate-800 -ml-2">
                Contact Us
              </h3>

              <div className="space-y-2 text-[13.125px] text-slate-600 ml-4">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <FaMapMarkerAlt className="w-5 h-5 text-blue-600 mt-1 shrink-0" />
                  <p className="leading-10 m-0">
                    Hegma Tech Pvt. Ltd.
                    <br />
                    #515, 1st floor, 6th 'A' main, AECS Layout, A
                    Block, Singasandra, Bengaluru. 560068
                    Karnataka, India
                  </p>
                </div>

                {/* Phone */}
                <div className="flex items-center gap-3">
                  <FaPhoneAlt className="w-5 h-5 text-blue-600 shrink-0" />
                  <a
                    href="tel:+918553666877"
                    className="text-slate-600 hover:text-blue-600 no-underline transition-colors"
                  >
                    +91 855-366-6877
                  </a>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3">
                  <FaEnvelope className="w-5 h-5 text-blue-600 shrink-0" />
                  <a
                    href="mailto:support@hegmakart.com"
                    className="text-slate-600 hover:text-blue-600 no-underline transition-colors"
                  >
                    support@hegmakart.com
                  </a>
                </div>

                {/* Working Hours */}
                <div className="flex items-center gap-3">
                  <FaClock className="w-5 h-5 text-blue-600 shrink-0" />
                  <span>Mon-Sat 9:00 AM - 7:00 PM IST</span>
                </div>
              </div>
            </div>
            <div className="w-full mt-2 pt-1 border-t border-slate-200 hk-footer-payments">
              <div className="ml-0">
                <h3 className="font-semibold mb-1 uppercase text-[13.125px] text-slate-800">
                  Payment Partners
                </h3>

                <img
                  src={`${process.env.PUBLIC_URL || ""}/assets/images/demoes/demo21/payment-icon.png`}
                  alt="Payment Partners"
                  className="hk-footer-payment-image ml-0"
                />
              </div>
            </div>
            <div className="hk-footer-bottom hk-footer-mobile-bottom">
              <p className="text-[13.125px] text-slate-500 m-0 text-center">
                Made with <span className="text-red-500">❤</span> for Dental Professionals
              </p>
              <img
                src={`${process.env.PUBLIC_URL || ""}/assets/images/apps.png`}
                alt="Download on Google Play and the App Store"
                className="hk-footer-app-badges"
              />
              <p className="text-[13.125px] text-slate-500 m-0 text-center">
                © {new Date().getFullYear()} Hegmakart. All Rights Reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Responsive Mobile Navbar Overlay */}
      {!hideMobileNavbar && <MobileNavbar />}
    </>
  );
};

export default Footer;
