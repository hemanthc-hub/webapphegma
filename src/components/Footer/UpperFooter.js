import React, { useState, useEffect } from "react";
import axios from "axios";
import { BsFillCheckCircleFill } from "react-icons/bs";

const UpperFooter = () => {

  const [email1, setEmail1] = useState();
  const [showBulkEnquiry, setShowBulkEnquiry] = useState(false);
  const [bulkEnquiryLoader, setBulkEnquiryLoader] = useState("Submit");
  const subscribeNewsLetter = async (e) => {
    setBulkEnquiryLoader(
      <div style={{ top: 10, left: 172 }} className="loaderr"></div>
    );
    e.preventDefault();
    var options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/newsletterSubscription",
      data: JSON.stringify({
        email_id: email1
      }),
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
      },
    };
    axios(options)
      .then((response) => {
        setShowBulkEnquiry(true);
        console.log(response);
      })
      .catch((error) => {
        setShowBulkEnquiry(true);
        console.log(error);
      });
  };

  return (
    <>

      {showBulkEnquiry && (
        <div
          style={{ display: "block", }}
          className="form-popup"
          id="myForm"
        >
          <form className="form-container " style={{ border: "1px solid green" }}>

            <div style={{ backgroundColor: "white", height: 50, }} >
              <h4 style={{ margin: 0, textAlign: "center", paddingTop: 15, paddingBottom: 15 }}>
                <BsFillCheckCircleFill
                  style={{ color: "green", marginRight: 22 }}
                ></BsFillCheckCircleFill>
                <span className="popuptitle">
                  Thank you for subscribing to our newsletter
                </span>
              </h4>

              <span
                className="deleteMeetingClose"
                onClick={() => {
                  setShowBulkEnquiry(false);
                }}
              >
                &times;
              </span>
            </div>
          </form>
        </div>
      )}
      <div className="footer-top">
        <div style={{ maxWidth: "95%" }} className="container">
          <div className="row align-items-center">
            <div className="col-md-6 col-lg-7">
              <h4 className="widget-newsletter-title mb-1 font1 font-weight-bold text-white ls-n-10">Sign Up to
                Newsletter</h4>
              <p className="widget-newsletter-content ls-n-10 text-white mb-0 lh-1">Get all the latest
                information on  Sales and Offers.</p>
            </div>

            <div className="col-md-10 col-lg-5">
              <form action="#" className="mb-0">
                <div className="footer-submit-wrapper d-flex">
                  <input type="email" onChange={(event) => { setEmail1(event.target.value); }} className="form-control mb-0"
                    placeholder="Enter your Email address..." required />
                  <button type="submit" onClick={subscribeNewsLetter} className="btn btn-md btn-dark">Subscribe</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UpperFooter
