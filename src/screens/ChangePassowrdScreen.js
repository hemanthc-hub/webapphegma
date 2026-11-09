import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";

import { RiLockPasswordLine } from 'react-icons/ri';
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

import { BsTrash } from 'react-icons/bs'
import { Helmet } from "react-helmet-async";
const ChangePasswordScreen = () => {
  const [changePasswordSuccessMessage, setChangePasswordSuccessMessage] = useState(false)
  const [changePasswordErrorMessage, setChangePasswordErrorMessage] = useState(false)
  const [matchPasswordErrorMessage, setMatchPasswordErrorMessage] = useState(false)
  const [addAddressLoader, setAddAddressLoader] = useState("SAVE ADDRESS")
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
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
  }, []);



  const [passwordChangeM] = useMutation(PASSWORD_CHANGE_MUTATION, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
  });




  const passwordChangeHandeler = (e) => {
    e.preventDefault();
    setChangePasswordLoader(<div className='loaderr'></div>)
    if (newPassword !== confirmPassword) {
      setMatchPasswordErrorMessage(true)
      setChangePasswordLoader("SAVE CHANGES")
      return false
    }
    console.log("ERERERERER")
    setTimeout(() => {
      setChangePasswordLoader("SAVE CHANGES")
    }, 1000);


    passwordChangeM({
      variables: {
        oldPassword: currentPassword,
        newPassword: newPassword,
      },

      onCompleted: (data) => {
        // console.log(data);

        if (data.passwordChange.errors.length === 0) {
          setMatchPasswordErrorMessage(false)
          setChangePasswordSuccessMessage(true)
          setChangePasswordErrorMessage(false)
        }
        else {
          setChangePasswordErrorMessage(true)
          setChangePasswordSuccessMessage(false)
          setMatchPasswordErrorMessage(false)
        }
      },

    });
  };


  const PageRefreshHandeler = () => {
    setTimeout(() => {
      // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
      window.location.reload(false)
    }, 1);
  }


  return (
    <>
      <Helmet>
        <title>Hegmakart: Change Password</title>
        <meta name="description" content="Hegmakart: Change Password" />
      </Helmet>
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
                <li className="nav-item">
                  <Link to="/change-password"
                    className="nav-link"
                    id="edit-tab"

                    style={{ fontWeight: 700, color: "grey", cursor: "pointer" }}
                    role="tab"
                    aria-controls="edit"
                    aria-selected="false"
                  >
                    Change Password
                  </Link>
                </li>

                {showPasswordChangeInterface && <li className="nav-item">
                  <Link to="/set-password"
                    className="nav-link"
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
                  <Link to="/wishlist" onClick={PageRefreshHandeler} className="nav-link">
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
                <h3 className="account-sub-title d-none d-md-block mt-0 pt-1 ml-1">
                  <RiLockPasswordLine style={{ paddingRight: 8, marginBottom: 10, fontSize: 50, color: "#d3d3d4" }} />Password
                  Change
                </h3>
                <div className="account-content">
                  <div>

                    {/* <form
                      className="form-group mb-4 emailChangeForm"
                      style={{ marginTop: 40 }}
                    >
                      <div className="emailChangeContainer">
                        <div className="form-group">
                          <label for="acc-email">
                            Email address <span className="required">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control emailChange"
                            id="acc-email"
                            name="acc-email"
                            placeholder="editor@gmail.com"
                            required
                          />
                        </div>
                      </div>
                      <div className="form-footer  ">
                        <button
                          type="submit"
                          className="btn btn-dark mr-0 nameChangeBtn"
                        >
                          Save changes
                        </button>
                      </div>
                    </form> */}



                    {!showPasswordChangeInterface && <form
                      onSubmit={passwordChangeHandeler}
                      className=""
                      id="accordion1"
                    >
                      <div className="card card-accordion">
                        {changePasswordErrorMessage && <p style={{ color: "Red" }}> X Current Password Entered By You Is Incorrect!</p>}
                        {changePasswordSuccessMessage && <p style={{ color: "green" }}>Your Password has been changed successfully</p>}
                        {matchPasswordErrorMessage && <p style={{ color: "red" }}>New Password and Confirm Password  has been not match</p>}
                        <div className="row changePasswordRow">
                          <div className="col-md-6 nameChange">
                            <div className="form-group">
                              <label for="acc-name">
                                Current Password <span className="required">*</span>
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="acc-name"
                                name="acc-name"
                                onChange={(event) => {
                                  setCurrentPassword(event.target.value);
                                }}
                                required
                              />
                            </div>
                          </div>

                          <div className="col-md-6 nameChange">
                            <div className="form-group">
                              <label for="acc-lastname">
                                New Password <span className="required">*</span>
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="acc-lastname"
                                name="acc-lastname"
                                onChange={(event) => {
                                  setNewPassword(event.target.value);
                                }}
                                required
                              />
                            </div>
                          </div>

                          <div className="col-md-6 nameChange">
                            <div className="form-group">
                              <label for="acc-lastname">
                                Confirm New Password <span className="required">*</span>
                              </label>
                              <input
                                type="password"
                                className="form-control"
                                id="acc-lastname"
                                name="acc-lastname"
                                onChange={(event) => {
                                  setConfirmPassword(event.target.value);
                                }}
                                required
                              />
                            </div>
                          </div>

                          {/* <div className="form-group">
                            <label for="acc-password">Current Password </label>
                            <input
                              type="password"
                              className="form-control"
                              id="acc-password"
                              name="acc-password"
                              onChange={(event)=>{setCurrentPassword(event.target.value)}}
                            />
                          </div> */}

                          {/* <div className="form-group">
                            <label for="acc-password">New Password </label>
                            <input
                              type="password"
                              className="form-control"
                              id="acc-new-password"
                              name="acc-new-password"
                            
                            />
                          </div> */}

                          {/* <div className="form-group">
                            <label for="acc-password">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              id="acc-confirm-password"
                              name="acc-confirm-password"
                              onChange={(event)=>{setNewPassword(event.target.value)}}
                            />
                          </div> */}
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

              {/* <div className="tab-pane fade" id="shipping" role="tabpanel">
                <div className="address account-content mt-0 pt-2">
                  <h4 className="title mb-3">Shipping Address</h4>

                  <form className="mb-2" action="#">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            First name <span className="required">*</span>
                          </label>
                          <input type="text" className="form-control" required />
                        </div>
                      </div>

                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Last name <span className="required">*</span>
                          </label>
                          <input type="text" className="form-control" required />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Company </label>
                      <input type="text" className="form-control" />
                    </div>

                    <div className="select-custom">
                      <label>
                        Country <span className="required">*</span>
                      </label>
                      <select name="orderby" className="form-control">
                        <option value="" selected="selected">
                          {" "}
                          Indian Territory
                        </option>
                        <option value="1">a</option>
                        <option value="2">b</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>
                        Street address <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="House number and street name"
                        required
                      />
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Apartment, suite, unit, etc. (optional)"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Town / City <span className="required">*</span>
                      </label>
                      <input type="text" className="form-control" required />
                    </div>

                    <div className="form-group">
                      <label>
                        State <span className="required">*</span>
                      </label>
                      <input type="text" className="form-control" required />
                    </div>

                    <div className="form-group">
                      <label>
                        Pincode <span className="required">*</span>
                      </label>
                      <input type="text" className="form-control" required />
                    </div>

                    <div className="form-footer mb-0">
                      <div className="form-footer-right">
                        <button type="submit" className="btn btn-dark py-4">
                          Save Address
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
                <div style={{ paddingTop: "30px" }}>
                   {" "}
                  <input
                    type="radio"
                    id="html"
                    name="fav_language"
                    value="Billing address"
                  />
                   {" "}
                  <label for="Billing address">
                    Make Silling Address Your Default Address
                  </label>
                   
                </div>
              </div> */}
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

export default ChangePasswordScreen;
