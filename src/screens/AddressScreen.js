import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Link } from "react-router-dom";
import { SAVED_ADDRESSES } from "../GraphQL/Queries";
import { useQuery, useMutation } from "@apollo/client/react";
import { CREATE_ADDRESS_MUTATION, UPDATE_ADDRESS_MUTATION } from "../GraphQL/Mutation";
import { ACCOUNT_ADDRESS_DELETE } from "../GraphQL/Mutation";
import { SAVED_ORDERS } from "../GraphQL/Queries";
import { PASSWORD_CHANGE_MUTATION } from "../GraphQL/Mutation";
import { ACCOUNT_UPDATE_MUTATION, CREATE_CHECKOUT_MUTATION, CHECKOUT_ADD_PRODUCT_LINE_MUTATION } from "../GraphQL/Mutation";
import "./Dashboard.css";
import { BiEdit } from "react-icons/bi";

import { BsTrash } from 'react-icons/bs'
import { Helmet } from "react-helmet-async";
const AddressScreen = () => {
  const [showAddBillingAddress, setShowAddBillingAddress] = useState(false)
  const [addAddressLoader, setAddAddressLoader] = useState("SAVE ADDRESS")
  const [currentId, setCurrentId] = useState();
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [formOpen, setForm] = useState(true);
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
  const [stateName, setStateName] = useState("Karnataka");
  const [pincode, setPincode] = useState();
  const [saveAddressErrorMessage, setSaveAddressErrorMessage] = useState(false)
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

  const { data, refetch } = useQuery(SAVED_ADDRESSES, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
    onCompleted: (data) => {
      setAddress(data.me.addresses);
      setUserFirstName(data.me.firstName);
      setUserLastName(data.me.lastName)
    },
  });
  // console.log(data);

  useEffect(() => {
    if (data?.me) {
      setAddress(data.me.addresses);
      setUserFirstName(data.me.firstName);
      setUserLastName(data.me.lastName);
    }
  }, [data]);

  const { data: ordersData } = useQuery(SAVED_ORDERS, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
    onCompleted: (data) => {
      setOrders(data.me.orders.edges);
    },
  });

  useEffect(() => {
    if (ordersData?.me?.orders) {
      setOrders(ordersData.me.orders.edges);
    }
  }, [ordersData]);

  //console.log(order);

  const [addressCreate] = useMutation(CREATE_ADDRESS_MUTATION, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
  });

  const [addressUpdate] = useMutation(UPDATE_ADDRESS_MUTATION, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
  });

  const [addressDelete] = useMutation(ACCOUNT_ADDRESS_DELETE, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
  });

  const [passwordChangeM] = useMutation(PASSWORD_CHANGE_MUTATION, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
  });

  const [accountUpdateM] = useMutation(ACCOUNT_UPDATE_MUTATION, {
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
  });

  const addressDeleteHandeler = (e) => {
    addressDelete({
      variables: {
        id: addressDeleteId,
      },
      onCompleted: (data) => {
        //console.log(data);
        setModalOpen(false)
        refetch()
      },
      onError: (err) => {
        console.error(err);
        setModalOpen(false);
      }
    });
    // setTimeout(() => {
    //   window.location.reload(true);
    // }, 500);
  };

  const passwordChangeHandeler = (e) => {
    setChangePasswordLoader(<div className='loaderr'></div>)
    setTimeout(() => {
      // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
      window.location.reload(false)
    }, 3000);
    e.preventDefault();
    alert(newPassword);
    passwordChangeM({
      variables: {
        oldPassword: currentPassword,
        newPassword: newPassword,
      },

      onCompleted: (data) => {
        // console.log(data);
      },
      onError: (err) => {
        console.error(err);
      }
    });
  };

  if (currentId == undefined) {
    setCurrentId("")
  }

  const changeNameHandeler = (e) => {
    e.preventDefault();

    accountUpdateM({
      variables: {
        input: {
          lastName: changedLastName,
          firstName: changedFirstName,
        },
      },

      onCompleted: (data) => {
        // console.log(data);
      },
      onError: (err) => {
        console.error(err);
      }
    });

    setTimeout(() => {
      // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
      window.location.reload(false)
    }, 100);
  };

  // console.log(addressDeleteId)

  const formSubmitted = async (e) => {
    e.preventDefault();
    setAddAddressLoader(<div className='loaderr'></div>)
    if (phone?.length != 10) {
      errorMessage('Please check your phone number')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (firstName?.length <= 1) {
      errorMessage('firstName min two character')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (lastName?.length <= 1) {
      errorMessage('lastName min two character')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (address1?.length <= 1) {
      errorMessage('Please fill Street address')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (cityName?.length <= 1) {
      errorMessage('Please fill Town / City ')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (cityArea?.length <= 1) {
      errorMessage('Please fill State ')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (pincode?.length != 6) {
      errorMessage('Please fill valid pinCode')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else {
      errorMessage(false)
    }

    setTimeout(() => {
      setAddAddressLoader("SAVE ADDRESS")
    }, 5000);


    addressCreate({
      variables: {
        input: {
          firstName: firstName,
          lastName: lastName,
          city: cityName,
          phone: phone,
          country: 'IN',
          cityArea: cityArea,
          postalCode: pincode,
          companyName: companyName,
          streetAddress1: address1,
          streetAddress2: address2,
          countryArea: stateName,
        },
      },
      onCompleted: (data) => {
        //console.log("address",data);
        if (data.accountAddressCreate.address === null) {
          errorMessage("Could not save address, please check your pincode");
          setSaveAddressErrorMessage(true)
          setAddAddressLoader("save address")
        } else {
          errorMessage(false)
          // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
          window.location.reload(false)
        }
      },
      onError: (err) => {
        console.error(err);
        window.alert("Error saving address: " + err.message);
        errorMessage("An error occurred while saving the address.");
        setSaveAddressErrorMessage(true);
        setAddAddressLoader("save address");
      }
    });
  };

  const editformSubmitted = async (e) => {
    e.preventDefault();
    setAddAddressLoader(<div className='loaderr'></div>)
    if (phone?.length != 10) {
      errorMessage('Please check your phone number')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (firstName?.length <= 2) {
      errorMessage('firstName min three character')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (lastName?.length <= 2) {
      errorMessage('lastName min three character')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (address1?.length <= 1) {
      errorMessage('Please fill Street address')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (cityName?.length <= 1) {
      errorMessage('Please fill Town / City ')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (stateName?.length <= 1) {
      errorMessage('Please fill State ')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else if (pincode?.length != 6) {
      errorMessage('Please fill right pinCode')
      setAddAddressLoader("SAVE ADDRESS")
      return false
    } else {
      errorMessage(false)
    }

    setTimeout(() => {
      setAddAddressLoader("SAVE ADDRESS")
    }, 5000);

    addressUpdate({
      variables: {
        id: currentId,
        input: {
          firstName: firstName,
          lastName: lastName,
          city: cityName,
          phone: phone,
          country: 'IN',
          postalCode: pincode,
          companyName: companyName,
          streetAddress1: address1,
          streetAddress2: address2,
          countryArea: stateName,
        },
      },
      onCompleted: (data) => {
        // console.log(data);
        if (data.accountAddressUpdate.address === null) {
          // errorMessage("Could not save address, please check your pincode");
          setSaveAddressErrorMessage(true)
          setAddAddressLoader("save address")
        } else {
          setCurrentId("")
          // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
          window.location.reload(false)
        }
      },
      onError: (err) => {
        console.error(err);
        window.alert("Error updating address: " + err.message);
        setSaveAddressErrorMessage(true);
        setAddAddressLoader("save address");
      }
    });
  };
  //console.log(stateName)
  const editForm = e => {
    const { id } = e.target;
    setCurrentId(id)

    for (let index = 0; index < Address.length; index++) {
      if (id == Address[index].id) {
        setFirstName(Address[index].firstName)
        setLastName(Address[index].lastName)
        setPhone(Address[index].phone.substring(3, Address[index].phone.length))
        setAddress1(Address[index].streetAddress1)
        setAddress2(Address[index].streetAddress2)
        setCityArea(Address[index]?.cityArea)
        setCityName(Address[index].city)
        setStateName(Address[index].countryArea)
        setPincode(Address[index].postalCode)
        setCompanyName(Address[index].companyName)
        setShowAddBillingAddress(true)
      }
    }
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
        <title>Hegmakart: Addresses</title>
        <meta name="description" content="Addresses" />
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
              <button onClick={addressDeleteHandeler}>Continue</button>
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
                    onClick={() => { setShowAddBillingAddress(false) }}
                    className="nav-link"
                    id="address-tab"

                    style={{ fontWeight: 700, color: "grey", cursor: "pointer" }}
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
              {showAddBillingAddress ? <div style={{ display: "block", opacity: 1 }} className="tab-pane fade" id="billing" role="tabpanel">
                <div className="address account-content mt-0 pt-2">
                  <h4 className="title">Billing address</h4>
                  {currentId == '' ?
                    <form onSubmit={formSubmitted} className="mb-2" action="#">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              First name <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              onChange={(event) => {
                                setFirstName(event.target.value);
                              }}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Last name <span className="required">*</span>
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              onChange={(event) => {
                                setLastName(event.target.value);
                              }}
                              className="form-control"
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="form-group mb-3">
                        <label>
                          Phone <span className="required">*</span>
                        </label>
                        <input
                          type="number"
                          onChange={(event) => {
                            setPhone(event.target.value);
                          }}
                          className="form-control"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Hospital name/Clinic name </label>
                        <input
                          type="text"
                          onChange={(event) => {
                            setCompanyName(event.target.value);
                          }}
                          className="form-control"
                        />
                      </div>



                      <div className="form-group">
                        <label>
                          Street address 1<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) => {
                            setAddress1(event.target.value);
                          }}
                          placeholder="House number and street name"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>
                          Street address 2
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          onChange={(event) => {
                            setAddress2(event.target.value);
                          }}
                          placeholder="Apartment, suite, unit, etc."

                        />
                      </div>

                      {/* <div className="form-group">
                        <label>
                          CityArea <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          onChange={(event) => {
                            setCityArea(event.target.value);
                          }}
                          className="form-control"
                          required
                        />
                      </div> */}

                      <div className="form-group">
                        <label>
                          Town / City <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          onChange={(event) => {
                            setCityName(event.target.value);
                          }}
                          className="form-control"
                          required
                        />
                      </div>


                      <div className="select-custom">
                        <label>State<span className="required">*</span></label>
                        <select onChange={(event) => { setStateName(event.target.value); }} className="form-control">
                          <option value="ANDAMAN and NICOBAR ISLANDS">ANDAMAN & NICOBAR ISLANDS</option>
                          <option value="ANDHRA PRADESH">ANDHRA PRADESH</option>
                          <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                          <option value="Assam">Assam</option>
                          <option value="Bihar">Bihar</option>
                          <option value="Chandigarh">Chandigarh</option>
                          <option value="Chhattisgarh">Chhattisgarh</option>
                          <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                          <option value="Delhi">Delhi</option>
                          <option value="Goa">Goa</option>
                          <option value="Gujarat">Gujarat</option>
                          <option value="Haryana">Haryana</option>
                          <option value="Himachal Pradesh">Himachal Pradesh</option>
                          <option value="Jammu and Kashmir">Jammu and Kashmir</option>
                          <option value="Jharkhand">Jharkhand</option>
                          <option value="Karnataka" selected="selected">Karnataka</option>
                          <option value="Kerala">Kerala</option>
                          <option value="Ladakh">Ladakh</option>
                          <option value="Lakshadweep">Lakshadweep</option>
                          <option value="Madhya Pradesh">Madhya Pradesh</option>
                          <option value="Maharashtra">Maharashtra</option>
                          <option value="Manipur">Manipur</option>
                          <option value="Meghalaya">Meghalaya</option>
                          <option value="Mizoram">Mizoram</option>
                          <option value="Nagaland">Nagaland</option>
                          <option value="Odisha">Odisha</option>
                          <option value="Puducherry">Puducherry</option>
                          <option value="Punjab">Punjab</option>
                          <option value="Rajasthan">Rajasthan</option>
                          <option value="Sikkim">Sikkim</option>
                          <option value="Tamil Nadu">Tamil Nadu</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tripura">Tripura</option>
                          <option value="Uttar Pradesh">Uttar Pradesh</option>
                          <option value="Uttarakhand">Uttarakhand</option>
                          <option value="West Bengal">West Bengal</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>
                          Pincode <span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          onChange={(event) => {
                            setPincode(event.target.value);
                          }}
                          className="form-control"
                          required
                        />
                      </div>



                      {/* <div className="form-group mb-3">
                  <label>Email address <span className="required">*</span></label>
                  <input type="email" className="form-control" placeholder="editor@gmail.com"
                    required />
                </div> */}
                      {saveAddressErrorMessage && <div style={{ color: "red", paddingBottom: 5, marginBottom: -45 }}>Could not save Address, Please Check Your Pincode</div>}
                      {errorMe && <div style={{ color: "red", paddingBottom: 5, marginBottom: -45 }}>{errorMe}</div>}

                      <div className="form-footer mb-0">

                        <div style={{ marginRight: 32 }} className="cartcontainr">

                          <button

                            type="submit"
                            style={{ color: "white", width: 150 }}
                            className="btn btn-dark save-change"
                            title="Add to Cart"
                          >
                            {addAddressLoader}
                          </button>
                        </div>
                      </div>
                    </form> : <>
                      <form onSubmit={editformSubmitted} className="mb-2" action="#">
                        <div className="row">
                          <div className="col-md-6">
                            <div className="form-group">
                              <label>
                                First name <span className="required">*</span>
                              </label>
                              <input
                                type="text"
                                name="firstName"
                                value={firstName}
                                onChange={(event) => {
                                  setFirstName(event.target.value);
                                }}
                                className="form-control"
                                required
                              />
                            </div>
                          </div>

                          <div className="col-md-6">
                            <div className="form-group">
                              <label>
                                Last name <span className="required">*</span>
                              </label>
                              <input
                                type="text"
                                name="lastName"
                                onChange={(event) => {
                                  setLastName(event.target.value);
                                }}
                                value={lastName}
                                className="form-control"
                                required
                              />
                            </div>
                          </div>
                        </div>
                        <div className="form-group mb-3">
                          <label>
                            Phone <span className="required">*</span>
                          </label>
                          <input
                            type="number"
                            onChange={(event) => {
                              setPhone(event.target.value);
                            }}
                            value={phone}
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Hospital name/Clinic name </label>
                          <input
                            type="text"
                            onChange={(event) => {
                              setCompanyName(event.target.value);
                            }}
                            value={companyName}
                            className="form-control"
                          />
                        </div>



                        <div className="form-group">
                          <label>
                            Street address 1<span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(event) => {
                              setAddress1(event.target.value);
                            }}
                            value={address1}
                            placeholder="House number and street name"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>
                            Street address 2
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            onChange={(event) => {
                              setAddress2(event.target.value);
                            }}
                            value={address2}
                            placeholder="Apartment, suite, unit, etc."

                          />
                        </div>

                        {/* <div className="form-group">
                          <label>
                            CityArea <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            onChange={(event) => {
                              setCityArea(event.target.value);
                            }}
                            value={cityArea}
                            className="form-control"
                            required
                          />
                        </div> */}

                        <div className="form-group">
                          <label>
                            Town / City <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            onChange={(event) => {
                              setCityName(event.target.value);
                            }}
                            value={cityName}
                            className="form-control"
                            required
                          />
                        </div>


                        <div className="select-custom">
                          <label>State<span className="required">*</span></label>
                          <select onChange={(event) => { setStateName(event.target.value); }} className="form-control">
                            {stateName.includes("ANDAMAN and NICOBAR ISLANDS") ?
                              <option selected value="ANDAMAN and NICOBAR ISLANDS">ANDAMAN & NICOBAR ISLANDS</option>
                              : <option value="ANDAMAN and NICOBAR ISLANDS">ANDAMAN & NICOBAR ISLANDS</option>}
                            {stateName.includes("ANDHRA PRADESH") ?
                              <option selected value="ANDHRA PRADESH">ANDHRA PRADESH</option>
                              : <option value="ANDHRA PRADESH">ANDHRA PRADESH</option>}
                            {stateName.includes("Arunachal Pradesh") ?
                              <option selected value="Arunachal Pradesh">Arunachal Pradesh</option>
                              : <option value="Arunachal Pradesh">Arunachal Pradesh</option>}
                            {stateName.includes("Assam") ?
                              <option selected value="Assam">Assam</option>
                              : <option value="Assam">Assam</option>}
                            {stateName.includes("Bihar") ?
                              <option selected value="Bihar">Bihar</option>
                              : <option value="Bihar">Bihar</option>}
                            {stateName.includes("Chandigarh") ?
                              <option selected value="Chandigarh">Chandigarh</option>
                              : <option value="Chandigarh">Chandigarh</option>}
                            {stateName.includes("Chhattisgarh") ?
                              <option selected value="Chhattisgarh">Chhattisgarh</option>
                              : <option value="Chhattisgarh">Chhattisgarh</option>}
                            {stateName.includes("Dadra and Nagar Haveli") ?
                              <option selected value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>
                              : <option value="Dadra and Nagar Haveli">Dadra and Nagar Haveli</option>}
                            {stateName.includes("Delhi") ?
                              <option selected value="Delhi">Delhi</option>
                              : <option value="Delhi">Delhi</option>}
                            {stateName.includes("Goa") ?
                              <option selected value="Goa">Goa</option>
                              : <option value="Goa">Goa</option>}
                            {stateName.includes("Gujarat") ?
                              <option selected value="Gujarat">Gujarat</option>
                              : <option value="Gujarat">Gujarat</option>}
                            {stateName.includes("Haryana") ?
                              <option selected value="Haryana">Haryana</option>
                              : <option value="Haryana">Haryana</option>}
                            {stateName.includes("Himachal Pradesh") ?
                              <option selected value="Himachal Pradesh">Himachal Pradesh</option>
                              : <option value="Himachal Pradesh">Himachal Pradesh</option>}
                            {stateName.includes("Jammu and Kashmir") ?
                              <option selected value="Jammu and Kashmir">Jammu and Kashmir</option>
                              : <option value="Jammu and Kashmir">Jammu and Kashmir</option>}
                            {stateName.includes("Jharkhand") ?
                              <option selected value="Jharkhand">Jharkhand</option>
                              : <option value="Jharkhand">Jharkhand</option>}
                            {stateName.includes("Karnataka") ?
                              <option selected value="Karnataka">Karnataka</option>
                              : <option value="Karnataka">Karnataka</option>}
                            {stateName.includes("Kerala") ?
                              <option selected value="Kerala">Kerala</option>
                              : <option value="Kerala">Kerala</option>}
                            {stateName.includes("Ladakh") ?
                              <option selected value="Ladakh">Ladakh</option>
                              : <option value="Ladakh">Ladakh</option>}
                            {stateName.includes("Lakshadweep") ?
                              <option selected value="Lakshadweep">Lakshadweep</option>
                              : <option value="Lakshadweep">Lakshadweep</option>}
                            {stateName.includes("Madhya Pradesh") ?
                              <option selected value="Madhya Pradesh">Madhya Pradesh</option>
                              : <option value="Madhya Pradesh">Madhya Pradesh</option>}
                            {stateName.includes("Maharashtra") ?
                              <option selected value="Maharashtra">Maharashtra</option>
                              : <option value="Maharashtra">Maharashtra</option>}
                            {stateName.includes("Manipur") ?
                              <option selected value="Manipur">Manipur</option>
                              : <option value="Manipur">Manipur</option>}
                            {stateName.includes("Meghalaya") ?
                              <option selected value="Meghalaya">Meghalaya</option>
                              : <option value="Meghalaya">Meghalaya</option>}
                            {stateName.includes("Mizoram") ?
                              <option selected value="Mizoram">Mizoram</option>
                              : <option value="Mizoram">Mizoram</option>}
                            {stateName.includes("Nagaland") ?
                              <option selected value="Nagaland">Nagaland</option>
                              : <option value="Nagaland">Nagaland</option>}
                            {stateName.includes("Odisha") ?
                              <option selected value="Odisha">Odisha</option>
                              : <option value="Odisha">Odisha</option>}
                            {stateName.includes("Puducherry") ?
                              <option selected value="Puducherry">Puducherry</option>
                              : <option value="Puducherry">Puducherry</option>}
                            {stateName.includes("Punjab") ?
                              <option selected value="Punjab">Punjab</option>
                              : <option value="Punjab">Punjab</option>}
                            {stateName.includes("Rajasthan") ?
                              <option selected value="Rajasthan">Rajasthan</option>
                              : <option value="Rajasthan">Rajasthan</option>}
                            {stateName.includes("Sikkim") ?
                              <option selected value="Sikkim">Sikkim</option>
                              : <option value="Sikkim">Sikkim</option>}
                            {stateName.includes("Tamil Nadu") ?
                              <option selected value="Tamil Nadu">Tamil Nadu</option>
                              : <option value="Tamil Nadu">Tamil Nadu</option>}
                            {stateName.includes("Telangana") ?
                              <option selected value="Telangana">Telangana</option>
                              : <option value="Telangana">Telangana</option>}
                            {stateName.includes("Tripura") ?
                              <option selected value="Tripura">Tripura</option>
                              : <option value="Tripura">Tripura</option>}
                            {stateName.includes("Uttar Pradesh") ?
                              <option selected value="Uttar Pradesh">Uttar Pradesh</option>
                              : <option value="Uttar Pradesh">Uttar Pradesh</option>}
                            {stateName.includes("Uttarakhand") ?
                              <option selected value="Uttarakhand">Uttarakhand</option>
                              : <option value="Uttarakhand">Uttarakhand</option>}
                            {stateName.includes("West Bengal") ?
                              <option selected value="West Bengal">West Bengal</option>
                              : <option value="West Bengal">West Bengal</option>}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>
                            Pincode <span className="required">*</span>
                          </label>
                          <input
                            type="text"
                            onChange={(event) => {
                              setPincode(event.target.value);
                            }}
                            className="form-control"
                            value={pincode}
                            required
                          />
                        </div>



                        {/* <div className="form-group mb-3">
										<label>Email address <span className="required">*</span></label>
										<input type="email" className="form-control" placeholder="editor@gmail.com"
											required />
									</div> */}
                        {saveAddressErrorMessage && <div style={{ color: "red", paddingBottom: 5, marginBottom: -45 }}>Could not save Address, Please Check Your Pincode</div>}
                        {errorMe && <div style={{ color: "red", paddingBottom: 5, marginBottom: -45 }}>{errorMe}</div>}

                        <div className="form-footer mb-0">

                          <div style={{ marginRight: 32 }} className="cartcontainr">

                            <button

                              type="submit"
                              style={{ color: "white", width: 150 }}
                              className="btn btn-dark save-change"
                              title="Add to Cart"
                            >
                              {addAddressLoader}
                            </button>
                          </div>
                        </div>
                      </form>
                    </>
                  }
                </div>

              </div> : <div style={{ display: "block", opacity: 1 }} className="tab-pane fade" id="address" role="tabpanel">
                <h3 className="account-sub-title d-none d-md-block mb-1">
                  <i className="sicon-location-pin align-middle mr-3"></i>Addresses
                </h3>
                <div className="addresses-content">
                  <p className="mb-4">
                    The following addresses will be used on the checkout page by
                    default.
                  </p>
                  <div className="row ">

                    <div style={{ maxWidth: "96.3%", color: "orangered", marginBottom: 0, cursor: "pointer", fontWeight: "bold", fontSize: 20, flex: "100%" }} className="address col-md-6 addressBox">


                      <a onClick={() => { setShowAddBillingAddress(true) }} style={{ background: "transparent", paddingLeft: 0, fontSize: "1.8rem", color: "orangered" }} className=" link-to-tab"
                      >    + Add New Address </a>

                    </div>

                  </div>
                  <div className="row saved-address">
                    {Address.map((value) => {
                      return (
                        <div className="address col-md-6 addressBox">
                          <div className="heading d-flex">
                            <h4 className="text-dark mb-0">
                              {value.firstName} {value.lastName}
                            </h4>
                          </div>

                          <div className="address-box">
                            {value.streetAddress1} {value.streetAddress2} <br /> {value.city},{" "}
                            {value.countryArea}, {value.postalCode} <br />{" "}
                            phone number: {value.phone}
                          </div>
                          <BsTrash onClick={() => {
                            setAddressDeleteId(value.id);
                            setModalOpen(true);
                          }} className="deleteAddressBin" />
                          <a
                            style={{ display: "none" }}

                            onClick={() => {
                              setAddressDeleteId(value.id);
                              setModalOpen(true);
                            }}
                            className="btn btn-default address-action link-to-tab deleteBtn"
                          >
                            Delete
                          </a>
                          <a style={{ background: "transparent", paddingLeft: 0, fontSize: "1.8rem", color: "orangered" }} className=" link-to-tab"
                          >    <BiEdit onClick={editForm} id={value.id} /> </a>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>}


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

export default AddressScreen;
