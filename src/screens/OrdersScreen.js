import React, { useEffect, useState } from "react";
import Header from "../components/Header/Header";
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
// import { BsTrash } from 'react-icons/bs'
import { Helmet } from "react-helmet-async";
import { totalValue } from "./decimalFunction";


const OrdersScreen = () => {
  const [addAddressLoader, setAddAddressLoader] = useState("SAVE ADDRESS")
  const [currentPassword, setCurrentPassword] = useState();
  const [newPassword, setNewPassword] = useState();
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
  const [reorderError, setReorderError] = useState()
  const [reloader, setReloader] = useState(false)
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

  const { data } = useQuery(SAVED_ADDRESSES, {
    fetchPolicy: "cache-and-network",
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
  useEffect(() => {
    if (data) console.log("Dev Log - Saved Addresses:", data);
  }, [data]);

  const { data: ordersData, refetch } = useQuery(SAVED_ORDERS, {
    fetchPolicy: "cache-and-network",
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
    onCompleted: (data) => {
      setOrders(data.me.orders.edges);
    },
  });
  console.log("Orders Data:", ordersData);

  useEffect(() => {
    if (ordersData?.me?.orders) {
      setOrders(ordersData.me.orders.edges);
    }
  }, [ordersData]);
  const [addressCreate] = useMutation(CREATE_ADDRESS_MUTATION, {
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
        console.log(data);
      },
    });
    setTimeout(() => {
      window.location.reload(true);
    }, 1);
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
        console.log(data);
      },
    });
  };

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
        console.log(data);
      },
    });

    setTimeout(() => {
      // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
      window.location.reload(false)
    }, 100);
  };

  // console.log(addressDeleteId)

  const formSubmitted = async (e) => {
    setAddAddressLoader(<div className='loaderr'></div>)
    setTimeout(() => {
      setAddAddressLoader("SAVE ADDRESS")
    }, 5000);

    e.preventDefault();
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
        console.log(data);
      },
    });
    setTimeout(() => {
      // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
      window.location.reload(false)
    }, 5000);
  };
  // console.log(stateName)
  const reOrder = e => {
    setReloader(true)
    setReorderError("")
    const { id } = e.target;
    if (localStorage.getItem("cartToken") === null) {
      CreateCheckout({
        variables: {
          channel: 'default-channel',
          email: '',
          lines: []
        },
        onCompleted: data => {
          console.log(data);
          if (data.checkoutCreate.checkout !== null) {
            localStorage.setItem('cartToken', data.checkoutCreate.checkout.token);
            for (let index = 0; index < order.length; index++) {
              if (id === order[index].node.id) {
                for (let index1 = 0; index1 < order[index].node.lines.length; index1++) {
                  addLineCheckout({
                    variables: {
                      token: data.checkoutCreate.checkout.token,
                      lines: [
                        {
                          quantity: order[index].node.lines[index1].quantity,
                          variantId: order[index].node.lines[index1].variant.id
                        }
                      ]
                    },
                    onCompleted: data => {
                      console.log(data);
                      setReloader(false);
                      setReorderError("All items from your order have been added to the cart");
                      setTimeout(() => {
                        //  debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
                        window.location.reload(false);
                      }, 1500);
                    }
                  });
                }
              }
            }
          }
        }
      });
    } else {
      for (let index = 0; index < order.length; index++) {
        if (id === order[index].node.id) {
          for (let index1 = 0; index1 < order[index].node.lines.length; index1++) {
            if (order[index].node.lines[index1].variant !== null) {
              addLineCheckout({
                variables: {
                  token: localStorage.getItem("cartToken"),
                  lines: [
                    {
                      quantity: order[index].node.lines[index1].quantity,
                      variantId: order[index].node.lines[index1].variant.id,

                    }
                  ]
                },
                onCompleted: data => {
                  console.log(data);
                  setReloader(false);
                  setReorderError("All items from your order have been added to the cart");
                  setTimeout(() => {
                    //  debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
                    window.location.reload(false);
                  }, 1500);
                }
              });
            } else {
              setTimeout(() => {
                setReloader(false)
                setReorderError("Some of the items from your order could not be added to the cart as those are not available now")
              }, 1000)

            }
          }
        }
      }

    }
    // errorMessage("Product added to cart successfully.");
  };
  useEffect(() => {
    if (order) console.log("Dev Log - Order length:", order?.length, "orders:", order);
  }, [order]);
  const PageRefreshHandeler = () => {
    setTimeout(() => {
      // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
      window.location.reload(false)
    }, 1);
  }
  return (
    <>
      <div className="position-relative">
        <Helmet>
          <title>Hegmakart: Your Orders</title>
          <meta name="description" content="Your Orders" />
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

        {reloader && (
          <div
            style={{
              width: "100%",
              zIndex: 1060,
              height: "100vh",
              position: "fixed",
              background: "rgba(0, 0, 0, 0.6)",
            }}
          >
            <div
              style={{ left: "50%", top: "50%", zIndex: 1060 }}
              className="loaderr"
            ></div>
          </div>
        )}
        <Header />
        <main className="main position-relative">
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

                      style={{ fontWeight: 700, color: "grey", cursor: "pointer" }}
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
                      id="address-tab"


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
              <div className="col-lg-9 order-lg-last order-1 tab-content ">

                {/* <!-- End .tab-pane --> */}

                <div style={{ display: "block", opacity: 1 }} className="tab-pane fade" id="order" role="tabpanel position-relative">
                  <div className="order-content ">
                    <div className="">
                      <div className="d-flex justify-content-between align-items-center ">
                        <h3 className="account-sub-title d-none d-md-block" style={{ position: "sticky", top: 0, background: "#fff", paddingBottom: "5px" }}>
                          <i className="sicon-social-dropbox align-middle mr-3"></i>Orders
                        </h3>
                        <h6 style={{ position: "sticky", top: 10, background: "#fff", paddingBottom: "5px" }} className={reorderError === "All items from your order have been added to the cart" ? "text-success" : "text-danger"}>{reorderError}</h6>
                      </div>
                    </div>
                    <div className="order-content-table table-responsive" style={{ maxHeight: 400, overflowX: "auto" }}>
                      {order && order.length > 0 ? (
                        <table className="table" style={{ width: "100%", wordBreak: "break-word", whiteSpace: "normal" }}>
                          <tbody style={{ position: "sticky", top: 0, background: "#fff", paddingBottom: "5px" }}>
                            <tr>
                              <th className="order-id th">ORDER</th>
                              <th className="order-date th">DATE</th>
                              <th className="order-status th">STATUS</th>
                              <th className="order-price th">TOTAL</th>
                              <th className="order-action th">ACTIONS</th>
                            </tr>
                          </tbody>
                          {order?.map((values) => {
                            return (
                              <tbody>
                                <tr>
                                  <td></td>
                                </tr>
                                <tr>
                                  <th>{values.node.number}</th>
                                  <th>{new Date(values.node.created).toLocaleString("en-GB", { day: "numeric", month: "long", year: "numeric", hour: "numeric", minute: "numeric", second: "numeric" })}</th>
                                  <th>{values.node.status}</th>
                                  <th>₹{totalValue(values.node.total.gross.amount)}</th>

                                  <th>
                                    <div className="viewo">
                                      <div className="viewo1">
                                        <Link to={{ pathname: `/orderDetails/${values.node.id}` }}>
                                          <button
                                            className="btn btn-primary btn-sm"
                                            style={{ width: "100%" }}
                                          >
                                            View
                                          </button>
                                        </Link>
                                      </div>
                                      <br />
                                      <div className="rod">
                                        <button
                                          className="btn btn-primary btn-sm"
                                          style={{ width: "100%" }} id={values.node.id}
                                          onClick={reOrder}
                                        >
                                          Re-order
                                        </button>
                                      </div>
                                    </div>
                                  </th>
                                </tr>
                              </tbody>
                            );
                          })}
                        </table>
                      ) : (
                        <div style={{ padding: "20px 0", textAlign: "center" }}>
                          <h5>No orders found.</h5>
                        </div>
                      )}



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

        {/* popup reorder */}
        {/* <div className="border border-dark rounded bg-white   position-absolute " style={{top:"40%",left:"35%",width:"250px",height:"140px"}}>
        hhh
      </div> */}
      </div>
    </>
  );
};

export default OrdersScreen;
