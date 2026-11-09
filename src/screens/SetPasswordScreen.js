import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";

import { RiLockPasswordLine } from 'react-icons/ri';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Footer from "../components/Footer/Footer";
import { Link } from "react-router-dom";
import { SAVED_ADDRESSES } from "../GraphQL/Queries";
import { useQuery, useMutation } from "@apollo/client/react";
import { CREATE_ADDRESS_MUTATION } from "../GraphQL/Mutation";
import { ACCOUNT_ADDRESS_DELETE } from "../GraphQL/Mutation";
import { SAVED_ORDERS } from "../GraphQL/Queries";
import { PASSWORD_CHANGE_MUTATION } from "../GraphQL/Mutation";
import { ACCOUNT_UPDATE_MUTATION, CREATE_CHECKOUT_MUTATION, CHECKOUT_ADD_PRODUCT_LINE_MUTATION } from "../GraphQL/Mutation";
import "./Dashboard.css";
import axios from "axios";
import { Navigate } from 'react-router-dom'

import { BsTrash } from 'react-icons/bs'
const SetPasswordScreen = () => {
  const [changePasswordSuccessMessage, setChangePasswordSuccessMessage] = useState(false)
  const [changePasswordErrorMessage, setChangePasswordErrorMessage] = useState(false)
  const [addAddressLoader, setAddAddressLoader] = useState("SAVE ADDRESS")
  const [currentPassword, setCurrentPassword] = useState();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [rePassword, setRePassword] = useState();
  const [showRePassword, setShowRePassword] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [Address, setAddress] = useState([]);
  const [addressDeleteId, setAddressDeleteId] = useState();
  const [firstName, setFirstName] = useState();
  const [lastName, setLastName] = useState();
  const [changedFirstName, setChangedFirstName] = useState();
  const [changedLastName, setChangedLastName] = useState();
  const [companyName, setCompanyName] = useState();
  const [address1, setAddress1] = useState();
  const [address2, setAddress2] = useState();
  const [cityArea, setCityArea] = useState();
  const [cityName, setCityName] = useState();
  const [stateName, setStateName] = useState();
  const [pincode, setPincode] = useState();
  const [phone, setPhone] = useState();
  const [order, setOrders] = useState([]);
  const [errorMe, errorMessage] = useState([]);
  const [CreateCheckout] = useMutation(CREATE_CHECKOUT_MUTATION);
  const [addLineCheckout] = useMutation(CHECKOUT_ADD_PRODUCT_LINE_MUTATION);
  const [userFirstName, setUserFirstName] = useState();
  const [userLastName, setUserLastName] = useState();
  const username = localStorage.getItem("userName");
  const [showPasswordChangeInterface, setShowPasswordChangeInterface] = useState(false)
  const email = localStorage.getItem("user");
  const [changePasswordLoader, setChangePasswordLoader] = useState("save changes")
  const [matchPasswordErrorMessage, setMatchPasswordErrorMessage] = useState(false)

  const logoutHandeler = () => {
    //localStorage.clear();
    localStorage.removeItem('dummyemail')
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userName')
    localStorage.removeItem('user')
    localStorage.removeItem('email')
    localStorage.removeItem('userId')
    localStorage.removeItem('recentData')
    localStorage.removeItem('rzp_checkout_anon_id')
    localStorage.removeItem('rzp_device_id')
  };


  useEffect(() => {
    const loggedInUserByOtp = localStorage.getItem("loginByOtp");
    if (loggedInUserByOtp) {
      setShowPasswordChangeInterface(true)
    }
    const tempEmail = localStorage.getItem("tempEmail");
    // if(tempEmail){
    //   setShowPasswordChangeInterface(false)
    //   errorMessage('To set your password, complete your profile first')
    // }
  }, []);




  const passwordSetHandler = (e) => {
    e.preventDefault();
    setChangePasswordLoader(<div className='loaderr'></div>)
    if (rePassword !== currentPassword) {
      setMatchPasswordErrorMessage(true)
      setChangePasswordLoader("SAVE CHANGES")
      return false
    }
    setTimeout(() => {
      setChangePasswordLoader("SAVE CHANGES")
    }, 1000);

    var options = {
      method: 'post',
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/setpassword",
      data: JSON.stringify({
        'token': localStorage.getItem('token'),
        'new_password': currentPassword
      }),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    };
    axios(options)
      .then((response) => {
        setChangePasswordLoader("SAVE CHANGES");
        if (response.data !== '') {
          setChangePasswordErrorMessage(false)
          setChangePasswordSuccessMessage(true)
          localStorage.removeItem("loginByOtp")
          setTimeout(() => {
            window.location.href = "/Dashboard";
          }, 500);
        } else {
          setChangePasswordErrorMessage(true)
          setChangePasswordSuccessMessage(false)
        }
      })
      .catch((error) => {
        //	console.log(error)
        setChangePasswordErrorMessage(true)
        setChangePasswordSuccessMessage(false)
      })

  };

  if (localStorage.getItem('loginByOtp') === null) {
    return (<Navigate to="/Dashboard" />);
  }



  return (
    <>
      {modalOpen && (
        <div className="ModalBackground">
          <div className="ModalContainer">
            <div className="titleCloseBtn">
              <button
                onClick={() => {
                  setModalOpen(false);
                }}
              >
                X
              </button>
            </div>
            <div className="title">
              <h3>Are You Sure You Want to Continue?</h3>
            </div>

            <div className="footer">
              <button
                onClick={() => {
                  setModalOpen(false);
                }}
                id="CancelBtn"
              >
                Cancel
              </button>
              <button onClick={() => setModalOpen(false)}>Continue</button>
            </div>
          </div>
        </div>
      )}
      <Header />
      <main className="main">
        {/* <div className="page-header">
          <div className="container d-flex flex-column align-items-center">
            <nav aria-label="breadcrumb" className="breadcrumb-nav">
              <div className="container">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <a >Home</a>
                  </li>
                  <li className="breadcrumb-item">
                    <a >Shop</a>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">
                    My Account
                  </li>
                </ol>
              </div>
            </nav>

            <h1>My Account</h1>
          </div>
        </div> */}

        <div className="container account-container custom-account-container">
          <div >
            <h4 className='errorBoxContent'>{errorMe}</h4>
          </div>
          <div className="row">
            <div className="sidebar widget widget-dashboard mb-lg-0 mb-3 col-lg-3 order-0">
              <h2 className="text-uppercase">My Account</h2>
              <ul className="nav nav-tabs list flex-column mb-0" role="tablist">
                <li className="nav-item">
                  <Link to="/Dashboard"
                    className="nav-link active"
                    id="dashboard-tab"
                    
                    style={{ fontWeight: 400, color: "grey", cursor: "pointer" }}
                    role="tab"
                    aria-controls="dashboard"
                    aria-selected="true"
                  >
                    Dashboard
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/order"
                    className="nav-link"
                    id="order-tab"
                    

                    role="tab"
                    aria-controls="order"
                    aria-selected="true"
                  >
                    Orders
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/address"
                    className="nav-link"

                    

                    role="tab"
                    aria-controls="address"
                    aria-selected="false"
                  >
                    Addresses
                  </Link>
                </li>

                <li className="nav-item">
                  <Link to="/account-detail"
                    className="nav-link"
                    id="edit-tab"
                    

                    role="tab"
                    aria-controls="edit"
                    aria-selected="false"
                  >
                    Profile
                  </Link>
                </li>
                {!showPasswordChangeInterface && <li className="nav-item">
                  <Link to="/change-password"
                    className="nav-link"
                    id="edit-tab"
                    

                    role="tab"
                    aria-controls="edit"
                    aria-selected="false"
                  >
                    Change Password
                  </Link>
                </li>}

                {showPasswordChangeInterface && <li className="nav-item">
                  <Link to="/set-password"
                    className="nav-link active"
                    id="edit-tab"
                    

                    role="tab"
                    aria-controls="edit"
                    aria-selected="false"
                  >
                    Set Password
                  </Link>
                </li>}

                {/* <li className="nav-item">
                  <a
                    className="nav-link"
                    id="shop-address-tab"
                    
                    href="#shipping"
                    role="tab"
                    aria-controls="edit"
                    aria-selected="false"
                  >
                    Shipping Address
                  </a>
                </li> */}
                <li className="nav-item">
                  <Link to="/wishlist" className="nav-link">
                    Wishlist
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/login" onClick={logoutHandeler} className="nav-link">
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-9 order-lg-last order-1 tab-content">

              {/* <!-- End .tab-pane --> */}

              <div style={{ display: "block", opacity: 1 }} className="tab-pane fade" id="edit" role="tabpanel">
                <h3 className="account-sub-title mt-0 pt-1 ml-1">
                  <RiLockPasswordLine style={{ paddingRight: 8, marginBottom: 10, fontSize: 50, color: "#d3d3d4" }} />Set Password

                </h3>
                <div className="account-content">
                  <div>



                    {showPasswordChangeInterface && <form
                      onSubmit={passwordSetHandler}
                      className=""
                      id="accordion1"
                    >
                      <div className="card card-accordion">
                        {changePasswordErrorMessage && <p style={{ color: "Red" }}> Please enter at least 8 character long password</p>}
                        {changePasswordSuccessMessage && <p style={{ color: "green" }}>Your Password has been changed successfully</p>}
                        {matchPasswordErrorMessage && <p style={{ color: "red" }}> Password  has been not match</p>}
                        <div className="row changePasswordRow">
                          <div className="col-md-6 nameChange">
                            <div className="form-group">
                              <label for="acc-name">
                                Please enter Password <span className="required">*</span>
                              </label>
                              <div style={{ position: "relative" }}>
                                <input
                                  type={showCurrentPassword ? "text" : "password"}
                                  className="form-control"
                                  id="acc-name"
                                  name="acc-name"
                                  onChange={(event) => {
                                    setCurrentPassword(event.target.value);
                                  }}
                                  required
                                />
                                <span onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={{ position: "absolute", right: "15px", top: "10px", cursor: "pointer", color: "#666", zIndex: 10 }}>
                                  {showCurrentPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6 nameChange">
                            <div className="form-group">
                              <label for="acc-lastname">
                                Re-enter Password <span className="required">*</span>
                              </label>
                              <div style={{ position: "relative" }}>
                                <input
                                  type={showRePassword ? "text" : "password"}
                                  className="form-control"
                                  id="acc-lastname"
                                  name="acc-lastname"
                                  onChange={(event) => {
                                    setRePassword(event.target.value);
                                  }}
                                  required
                                />
                                <span onClick={() => setShowRePassword(!showRePassword)} style={{ position: "absolute", right: "15px", top: "10px", cursor: "pointer", color: "#666", zIndex: 10 }}>
                                  {showRePassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-footer  ">
                          <button
                            style={{ position: "relative", width: 150, height: 50 }}
                            type="submit"
                            className="btn btn-dark mr-0 nameChangeBtn"
                          >{changePasswordLoader}
                          </button>
                        </div>
                        {/* <div className="form-footer mt-3 mb-0">
                          <button type="submit" className="btn btn-dark mr-0">
                            Save changes
                          </button>
                        </div> */}
                      </div>
                    </form>}

                  </div>
                </div>
              </div>
              {/* <!-- End .tab-pane --> */}


              {/* <!-- End .tab-pane --> */}
              {/* <!-- End .tab-pane --> */}
            </div>
            {/* <!-- End .tab-content --> */}
          </div>
          {/* <!-- End .row --> */}
        </div>
        {/* !-- End .container --> */}

        <div className="mb-5"></div>
        {/* <!-- margin --> */}
      </main>
      <Footer />
    </>
  );
};

export default SetPasswordScreen;
