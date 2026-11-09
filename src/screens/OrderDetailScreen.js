import React, { useState } from "react";
import { totalValue } from "./decimalFunction";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import "./OrderDetail.css";
import { SAVED_ORDERS } from "../GraphQL/Queries";
import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import "./OrderDetails.css";
import { IoAlertCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom'
import axios from "axios";
import Ratings from './Ratings';
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

import { AiFillCloseCircle, AiFillCheckCircle } from "react-icons/ai";
const OrderDetailScreen = () => {
  let { id } = useParams();
  let orderStatus = "Not Shipped";
  let breakCondition = false;
  const [status, setStatus] = useState(false);
  const [returnModal, setReturnModal] = useState(false);
  const [replaceModal, setReplaceModal] = useState(false);
  const [orderCancelModal, setOrderCancelModal] = useState(false);
  const [order, setOrders] = useState([]);
  const [modals, setModals] = useState("")
  const [lines, setOrdersLines] = useState([]);
  const [fulfilments, setOrdersFulfilments] = useState([]);
  const [cancleProductId, setCancleProductId] = useState([])
  const [returnProductId, setReturnProductId] = useState([])
  const [showCancelButton, setShowCancelButton] = useState(false)
  const [showReturnButton, setShowReturnButton] = useState(false)
  const [cancleTextArea, setCancleTextArea] = useState("")
  const [returnTextArea, setReturnTextArea] = useState("")
  const [variantName, setVariantName] = useState("")
  const [productName, setProductName] = useState("")
  const [fulfQuantity, setFulfQuantity] = useState(0)
  const [created, setCreated] = useState("")
  const [orderNo, setOrderNo] = useState("")
  const [review, setReview] = useState("")
  const [orderQuantity, setOrderQuantity] = useState(1)
  const [orderQuantity1, setOrderQuantity1] = useState(1)
  const [circleLoader, setCircleLoader] = useState("Continue")
  const [showBulkEnquiry, setShowBulkEnquiry] = useState(false);
  const [bulkEnquiryLoader, setBulkEnquiryLoader] = useState("Submit");
  const [variantName1, setVariantName1] = useState("");
  const [bulkEnquirySuccessMessage, setBulkEnquirySuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState("")
  const [paymentStatus, setPaymentStatus] = useState("")
  const [totalBalance, setTotalBalance] = useState('')
  const [productStatus, setProductStatus] = useState()
  const [invoiceUrl, setInvoiceUrl] = useState("");
  //{console.log("fulfilments",fulfilments)}
  const { loading, data: savedOrdersData } = useQuery(SAVED_ORDERS, {
    fetchPolicy: "no-cache",
    context: {
      headers: {
        Authorization: "JWT " + localStorage.getItem("token"),
      },
    },
    onCompleted: (data) => {
      // Keep onCompleted for fallback
    },
  });

  React.useEffect(() => {
    if (savedOrdersData?.me?.orders?.edges) {
      const edges = savedOrdersData.me.orders.edges;
      for (let index = 0; index < edges.length; index++) {
        if (edges[index].node.id === id) {
          console.log("Save orders", savedOrdersData);
          setOrders(edges[index]);
          setOrderNo(edges[index].node.number)
          setOrdersLines(edges[index].node.lines);
          setOrdersFulfilments(edges[index].node.fulfillments);
          setPaymentStatus(edges[index].node.paymentStatus)
          setTotalBalance(edges[index].node.totalBalance.amount)
          setProductStatus(edges[index].node.status)
          setStatus(true);
          for (let index1 = 0; index1 < edges[index].node.invoices.length; index1++) {
            setInvoiceUrl(edges[index].node.invoices[index1].url)
          }
        }
      }
    }
  }, [savedOrdersData, id]);
  const [rating, setRating] = useState(0);

  function handleRatingChange(newRating) {
    setRating(newRating);
  }
  //  console.log("lines",lines)
  // console.log("xxxxxxxxxxxxxxxxxxxxxxxxx","PARTIALLY_REFUNDED")
  const orderCancle = async (e) => {
    e.preventDefault();
    setCircleLoader(
      <div style={{ top: 0, left: "40%", }} className="loaderr"></div>
    );
    //   setTimeout(() => {
    //     setCircleLoader("submit");
    // }, 2000);
    var options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/cancelOrder",
      data: JSON.stringify({
        token: localStorage.getItem("token"),
        order_id: order.node.id,
        lines: cancleProductId,
        remark: cancleTextArea,
        action: "Cancellation",
        changeQuantity: 0,
        productName: productName,
        created: ''
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios(options)
      .then((response) => {
        // console.log(response);
        setOrderCancelModal(false);
        setCircleLoader("submit");
        setBulkEnquirySuccessMessage(true);
        setErrorMessage("Your order cancellation request has been sent successfully")
      })
      .catch((error) => {
        // console.log(error);
        setCircleLoader("Continue");
        setOrderCancelModal(false);
        setBulkEnquirySuccessMessage(true);
        setCancleTextArea("")
        setErrorMessage("There was some issue in cancelling the order");
      });

  }
  const orderReturn = async (e) => {
    e.preventDefault();
    setCircleLoader(
      <div style={{ top: 0, left: "40%", }} className="loaderr"></div>
    );
    var options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/cancelOrder",
      data: JSON.stringify({
        token: localStorage.getItem("token"),
        order_id: order.node.id,
        lines: returnProductId,
        remark: returnTextArea,
        action: "return",
        changeQuantity: orderQuantity,
        productName: productName,
        created: created
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios(options)
      .then((response) => {
        // console.log(response);
        setReturnModal(false);
        setCircleLoader("submit");
        setBulkEnquirySuccessMessage(true);
        setErrorMessage("Your order return request has been sent successfully")
      })
      .catch((error) => {
        // console.log(error);
        setReturnModal(false);
        setCircleLoader("submit");
        setBulkEnquirySuccessMessage(true);
        setErrorMessage("There was some issue in your request")
        setReturnTextArea("")
      });

  }
  const orderReplace = async (e) => {
    e.preventDefault();
    setCircleLoader(
      <div style={{ top: 0, left: "40%", }} className="loaderr"></div>
    );
    var options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/cancelOrder",
      data: JSON.stringify({
        token: localStorage.getItem("token"),
        order_id: order.node.id,
        lines: returnProductId,
        remark: returnTextArea,
        action: "replace",
        changeQuantity: orderQuantity1,
        productName: productName,
        created: created
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios(options)
      .then((response) => {
        // console.log(response);
        setReturnModal(false);
        setCircleLoader("submit");
        setBulkEnquirySuccessMessage(true);
        setErrorMessage("Your order replace request has been sent successfully")
      })
      .catch((error) => {
        // console.log(error);
        setReturnModal(false);
        setCircleLoader("submit");
        setBulkEnquirySuccessMessage(true);
        setErrorMessage("There was some issue in your request")
        setReturnTextArea("")
      });

  }
  const submitReview = async (e) => {
    setBulkEnquiryLoader(
      <div style={{ top: 10, left: 172 }} className="loaderr"></div>
    );
    e.preventDefault();
    var options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/updateProductReview",
      data: JSON.stringify({
        product_name: variantName,
        rating: rating,
        review: review,
        order_number: orderNo,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios(options)
      .then((response) => {
        console.log(response);
        setShowBulkEnquiry(false);
        setBulkEnquiryLoader("submit");
        setModals("")
        setBulkEnquirySuccessMessage(true);
        setErrorMessage("Your product review have been submitted successfully")
      })
      .catch((error) => {
        console.log(error);
        setShowBulkEnquiry(false);
        setBulkEnquiryLoader("submit");
        setModals("")
        setBulkEnquirySuccessMessage(true);
        setErrorMessage("There is some technical error.");
      });
  };

  const getReviewData = async (e) => {
    setVariantName(e)
    setBulkEnquiryLoader(
      <div style={{ top: 10, left: 172 }} className="loaderr"></div>
    );
    var options = {
      method: "post",
      url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/getOrderReviewData",
      data: JSON.stringify({
        order_number: order.node.number
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    };
    axios(options)
      .then((response) => {
        console.log(response.data);
        setRating(0);
        setReview("");
        setVariantName1("")
        let arr = response.data;
        if (arr.length !== 0) {
          for (let index = 0; index < arr.length; index++) {
            var response1 = arr[index];
            if (e == response1.productName) {
              setRating(response1.rating);
              setReview(response1.review);
              setVariantName1(response1.productName)
            }
          }
        }
        setModals("pageBg")
        setShowBulkEnquiry(true);
        setBulkEnquiryLoader("submit");
      })
      .catch((error) => {
        // setRating(0);
        // setReview("");
        // setVariantName1("")
        // let arr = "(3, 'good', '[BETA] Denmax Autoclavable Endo Box - Circular')(2, ' csacs', '[BETA] Denmax Autoclavable Endo Box - Circular')(4, 'dre', '[BETA] Denmax Autoclavable Endo Box - Circular')(3, 'xsa', '[BETA] Denmax Autoclavable Endo Box - Circular')(3, 'fdbdt', '[BETA] Denmax Autoclavable Endo Box - Circular')(3, ' v  vb', '[BETA] Denmax Autoclavable Endo Box - Circular')";
        // const arr1 = arr.split(")(");
        // for (let index = 0; index < arr1.length; index++) {
        //   var response1 = arr1[index];
        //   response1 = response1.replaceAll(" '", "").replaceAll("'", "").replaceAll("(", "").replaceAll(")", "");
        //   // alert(response1.split(",")[2])
        //   if (e == response1.split(",")[2]) {
        //     setRating(response1.split(",")[0]);
        //     setReview(response1.split(",")[1]);
        //     setVariantName1(response1.split(",")[2])
        //   }
        // }
        // setShowBulkEnquiry(true);
        // setBulkEnquiryLoader("submit");
        console.log(error);
        setErrorMessage("There is some technical error.");
      });
  };

  if (loading) {
    return (
      <div className="loading-overlay">
        <div className="bounce-loader">
          <div className="bounce1"></div>
          <div className="bounce2"></div>
          <div className="bounce3"></div>
        </div>
      </div>
    );
  }
  let shippingNumber = 1;
  return (
    <div>
      <Helmet>
        <title>Hegmakart: Order Details</title>
        <meta name="description" content="Orders Details" />
      </Helmet>
      {bulkEnquirySuccessMessage && (
        <div
          onClick={() => {
            setBulkEnquirySuccessMessage(false);
          }}
          style={{
            width: "100%",
            zIndex: 1060,
            height: "100vh",
            position: "fixed",
            background: "rgba(0, 0, 0, 0.6)",
          }}
        >
          {bulkEnquirySuccessMessage && (
            <div className="errorBoxContentt">
              <div style={{ position: "relative", padding: 10 }}>
                {errorMessage === "Your order cancellation request has been sent successfully" || errorMessage === "Your order return request has been sent successfully" || errorMessage === "Your product review have been submitted successfully" || errorMessage === "Your order replace request has been sent successfully" ?
                  <p style={{ color: "green" }}><AiFillCheckCircle style={{ color: "green", marginRight: 5, fontSize: "25px" }} />{errorMessage}</p>
                  :
                  <p style={{ color: "red" }}><AiFillCloseCircle style={{ color: "red", marginRight: 6, fontSize: "23px" }} />{errorMessage}</p>
                }

                <div
                  className="closeBtn"
                  onClick={() => {
                    setBulkEnquirySuccessMessage(false);
                    if (errorMessage === "Your order cancellation request has been sent successfully" || errorMessage === "Your order return request has been sent successfully" || errorMessage === "Your product review have been submitted successfully" || errorMessage === "Your order replace request has been sent successfully") {
                       window.location.reload();
                    }
                  }}
                >
                  X
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {/* Return PopUp */}
      {returnModal && (
        <div
          style={{ background: "rgba(0, 0, 0, 0.8)" }}
          className="ModalBackground"
        >{console.log("orderStatus", orderStatus)}
          <div
            style={{ width: "70%", height: "430px", overflow: "scroll" }}
            className="ModalContainer"
          >
            <div style={{ display: "flex", justifyContent: "center", paddingBottom: 20 }}>
              <p style={{ fontWeight: 500, fontSize: 22 }}>
                Return Item
              </p>
            </div>
            <p
              onClick={() => {
                setReturnModal(false);
                setReturnTextArea("");
              }}
              style={{ fontSize: 25, marginRight: 20, cursor: "pointer", position: 'absolute', right: 10 }}
            >
              X
            </p>

            <div>
              {lines.map((value) => (
                <>
                  {value.id == returnProductId ?
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}>
                      {console.log("orderReturn", value)}
                      {fulfilments.map((value1, index) => {
                        { console.log("fulfilments", value1) }
                        return (
                          <>
                            {fulfilments[index].lines.map((value2) => (

                              <>{console.log("value2", value2)}
                                {!breakCondition ? (
                                  <div style={{ display: "none" }}>
                                    {value.id.includes(value2.orderLine.id)
                                      ? value2.orderLine.quantityToFulfill === 0
                                        ? (orderStatus = "Shipped")
                                        : (orderStatus = "Partially Shipped")
                                      : (orderStatus = "Not Shipped")}
                                  </div>
                                ) : null}
                                {orderStatus === "Shipped"
                                  ? (breakCondition = true)
                                  : orderStatus === "Partially Shipped"
                                    ? (breakCondition = true)
                                    : (breakCondition = false)}
                              </>
                            ))}
                          </>
                        )
                      })}
                      <div
                        style={{
                          marginBottom: 20,
                          border: "none",
                          borderBottom: "1px solid grey",
                          paddingTop: 0,
                          paddingBottom: 0,
                          height: "fit-content",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        className="mainoffer"
                      >
                        <div style={{ display: "flex" }}>

                          {/* {orderStatus === "Shipped" ?
                        <input
                          style={{
                            marginLeft: 10,
                            marginRight: 15,
                            accentColor: "orangered",
                          }}
                          value={value.id}
                          id={value.quantity}
                          type="checkbox"
                          onChange={handleChangeCheckedReturn}
                        ></input>
                        :
                        <input
                          style={{
                            marginLeft: 10,
                            marginRight: 15,
                            accentColor: "orangered",
                            visibility: "hidden"
                          }}
                          value={value.id}
                          type="checkbox"
                          onChange={handleChangeCheckedReturn}
                        ></input>
                      } */}
                          {/* {console.log(value)} */}
                          {(breakCondition = false)}
                          {value.thumbnail !== null ? (
                            <figure
                              style={{ paddingRight: 10 }}
                              className="product-image-container"
                            >
                              <a className="product-image">
                                <img
                                  style={{ maxWidth: 100, height: 100 }}
                                  src={value.thumbnail.url}
                                  alt="product"
                                />
                              </a>
                            </figure>
                          ) : null}
                          <div style={{ marginLeft: 10 }} className="underoffer">
                            <p style={{ marginBottom: 5 }} className="ptitle">
                              {value.variantName}
                            </p>
                            <b>
                              ₹
                              {value.weightedShipping === null ||
                                value.weightedShipping === 0
                                ? totalValue(value.unitPrice.net.amount)
                                : totalValue(
                                  value.unitPrice.net.amount -
                                  value.weightedShipping
                                )}
                            </b>

                            {orderStatus !== "Shipped" ? <p style={{ display: "flex", marginTop: 5 }}>
                              <IoAlertCircleOutline style={{ color: "red", fontSize: 20 }} />
                              <span style={{ fontSize: 12, paddingLeft: 5 }}>You cannot return this product as it has not been shipped yet</span>
                            </p> : null}
                          </div>
                        </div>
                        <select onChange={({ target }) => setOrderQuantity(target.value)} style={{ width: 160, height: 30, border: "1px solid orange", borderRadius: 3, color: "orangered" }}>
                          {(() => {
                            let td = [];
                            for (let i = 1; i <= fulfQuantity; i++) {
                              td.push(<option value={i} >{i}</option>);
                            }
                            return td;
                          })()}
                        </select>
                      </div>


                    </div> : null}
                </>
              ))}
              <p className="m-0 mb-1">Reason for Return:</p>
              <div style={{ marginBottom: 15, marginLeft: 15 }}>
                <textarea value={returnTextArea} onChange={(e) => setReturnTextArea(e.target.value)} style={{
                  width: "100%", height: "90px", border: "1px solid lightgrey", padding: "5px 10px",
                  fontSize: "12px", borderRadius: 3
                }} row="5" placeholder="Specify the Reason why you want to Return the Product..."></textarea>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p
                onClick={orderReturn}
                style={{ width: 200, marginRight: 30, position: "relative" }}
                className="orderActions"
              >
                {circleLoader}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Replace */}
      {replaceModal && (
        <div
          style={{ background: "rgba(0, 0, 0, 0.8)" }}
          className="ModalBackground"
        >{console.log("orderStatus", orderStatus)}
          <div
            style={{ width: "70%", height: "430px", overflow: "scroll" }}
            className="ModalContainer"
          >
            <div style={{ display: "flex", justifyContent: "center", paddingBottom: 20 }}>
              <p style={{ fontWeight: 500, fontSize: 22 }}>
                Replace Item
              </p>
            </div>
            <p
              onClick={() => {
                setReplaceModal(false);
                setReturnTextArea("");
              }}
              style={{ fontSize: 25, marginRight: 20, cursor: "pointer", position: 'absolute', right: 10 }}
            >
              X
            </p>

            <div>
              {lines.map((value) => (
                <>
                  {value.id == returnProductId ?
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}>
                      {console.log("orderReturn", value)}
                      {fulfilments.map((value1, index) => {
                        { console.log("fulfilments", value1) }
                        return (
                          <>
                            {fulfilments[index].lines.map((value2) => (

                              <>{console.log("value2", value2)}
                                {!breakCondition ? (
                                  <div style={{ display: "none" }}>
                                    {value.id.includes(value2.orderLine.id)
                                      ? value2.orderLine.quantityToFulfill === 0
                                        ? (orderStatus = "Shipped")
                                        : (orderStatus = "Partially Shipped")
                                      : (orderStatus = "Not Shipped")}
                                  </div>
                                ) : null}
                                {orderStatus === "Shipped"
                                  ? (breakCondition = true)
                                  : orderStatus === "Partially Shipped"
                                    ? (breakCondition = true)
                                    : (breakCondition = false)}
                              </>
                            ))}
                          </>
                        )
                      })}

                      <div
                        style={{
                          marginBottom: 20,
                          border: "none",
                          borderBottom: "1px solid grey",
                          paddingTop: 0,
                          paddingBottom: 0,
                          height: "fit-content",
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center"
                        }}
                        className="mainoffer"
                      >
                        <div style={{ display: "flex" }}>

                          {/* {orderStatus === "Shipped" ?
                        <input
                          style={{
                            marginLeft: 10,
                            marginRight: 15,
                            accentColor: "orangered",
                          }}
                          value={value.id}
                          id={value.quantity}
                          type="checkbox"
                          onChange={handleChangeCheckedReturn}
                        ></input>
                        :
                        <input
                          style={{
                            marginLeft: 10,
                            marginRight: 15,
                            accentColor: "orangered",
                            visibility: "hidden"
                          }}
                          value={value.id}
                          type="checkbox"
                          onChange={handleChangeCheckedReturn}
                        ></input>
                      } */}
                          {/* {console.log(value)} */}
                          {(breakCondition = false)}
                          {value.thumbnail !== null ? (
                            <figure
                              style={{ paddingRight: 10 }}
                              className="product-image-container"
                            >
                              <a className="product-image">
                                <img
                                  style={{ maxWidth: 100, height: 100 }}
                                  src={value.thumbnail.url}
                                  alt="product"
                                />
                              </a>
                            </figure>
                          ) : null}
                          <div style={{ marginLeft: 10 }} className="underoffer">
                            <p style={{ marginBottom: 5 }} className="ptitle">
                              {value.variantName}
                            </p>
                            <b>
                              ₹
                              {value.weightedShipping === null ||
                                value.weightedShipping === 0
                                ? totalValue(value.unitPrice.net.amount)
                                : totalValue(
                                  value.unitPrice.net.amount -
                                  value.weightedShipping
                                )}
                            </b>

                            {orderStatus !== "Shipped" ? <p style={{ display: "flex", marginTop: 5 }}>
                              <IoAlertCircleOutline style={{ color: "red", fontSize: 20 }} />
                              <span style={{ fontSize: 12, paddingLeft: 5 }}>You cannot replace this product as it has not been shipped yet</span>
                            </p> : null}
                          </div> </div>
                        <select onChange={({ target }) => setOrderQuantity1(target.value)} style={{ width: 160, height: 30, border: "1px solid orange", borderRadius: 3, color: "orangered" }}>
                          {(() => {
                            let td = [];
                            for (let i = 1; i <= fulfQuantity; i++) {
                              td.push(<option value={i} >{i}</option>);
                            }
                            return td;
                          })()}
                        </select>

                      </div>


                    </div> : null}
                </>
              ))}

              <p className="m-0 mb-1">Reason for Replace:</p>
              <div style={{ marginBottom: 15, marginLeft: 15 }}>
                <textarea value={returnTextArea} onChange={(e) => setReturnTextArea(e.target.value)} style={{
                  width: "100%", height: "90px", border: "1px solid lightgrey", padding: "5px 10px",
                  fontSize: "12px", borderRadius: 3
                }} row="5" placeholder="Specify the Reason why you want to Return the Product..."></textarea>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <p
                onClick={orderReplace}
                style={{ width: 200, marginRight: 30, position: "relative" }}
                className="orderActions"
              >
                {circleLoader}
              </p>
            </div>
          </div>
        </div>
      )}

      {orderCancelModal && (
        <div
          style={{ background: "rgba(0, 0, 0, 0.8)" }}
          className="ModalBackground"
        >
          <div
            style={{ width: "70%", height: "420px", overflow: "scroll", boxShadow: "rgb(100 100 111 / 20%) 0px 7px 29px 0px" }}
            className="ModalContainer"
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p style={{ fontWeight: 500, fontSize: 18, paddingBottom: 20 }}>
                Cancel Item
              </p>
            </div>
            <p
              onClick={() => {
                setOrderCancelModal(false);
                setCancleTextArea("")
              }}
              style={{ fontSize: 25, marginRight: 20, cursor: "pointer", position: "absolute", right: 10 }}
            >
              X
            </p>

            <div>

              {lines.map((value) => (
                <>
                  {value.id == cancleProductId ?
                    <div
                      style={{ display: "flex", justifyContent: "space-between" }}
                    >
                      {fulfilments.map((value1, index) => {
                        { console.log("fulfilments", value1) }
                        return (
                          <>
                            {fulfilments[index].lines.map((value2) => (

                              <>{console.log("value2", value2)}
                                {!breakCondition ? (
                                  <div style={{ display: "none" }}>
                                    {value.id.includes(value2.orderLine.id)
                                      ? value2.orderLine.quantityToFulfill === 0
                                        ? (orderStatus = "Shipped")
                                        : (orderStatus = "Partially Shipped")
                                      : (orderStatus = "Not Shipped")}
                                  </div>
                                ) : null}
                                {orderStatus === "Shipped"
                                  ? (breakCondition = true)
                                  : orderStatus === "Partially Shipped"
                                    ? (breakCondition = true)
                                    : (breakCondition = false)}
                              </>
                            ))}
                          </>
                        )
                      })}

                      <div
                        style={{
                          marginBottom: 15,
                          border: "none",
                          borderBottom: "1px solid grey",
                          paddingTop: 0,
                          paddingBottom: 0,
                          height: "fit-content",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                        className="mainoffer"
                      >
                        <div style={{ display: "flex" }}>
                          {/* {orderStatus !== "Shipped" ? <input
                        style={{
                          marginLeft: 10,
                          marginRight: 15,
                          accentColor: "orangered",
                        }}
                        value={value.id}
                        id={value.quantity}
                        // id={value.id}
                        // checked={cancleProductId === value.id}
                        onChange={handleChangeChecked}
                        type="checkbox"
                      ></input> : <input
                        style={{
                          visibility: "hidden",
                          marginLeft: 10,
                          marginRight: 15,
                          accentColor: "orangered",
                        }}
                        type="checkbox"
                      ></input>} */}
                          {/* {console.log(value)} */}
                          {(breakCondition = false)}
                          {value.thumbnail !== null ? (
                            <figure
                              style={{ paddingRight: 10 }}
                              className="product-image-container"
                            >
                              <a className="product-image">
                                <img
                                  style={{ maxWidth: 100, height: 100 }}
                                  src={value.thumbnail.url}
                                  alt="product"
                                />
                              </a>
                            </figure>
                          ) : null}

                          <div style={{ marginLeft: 10 }} className="underoffer">
                            <p style={{ marginBottom: 5 }} className="ptitle">
                              {value.variantName}
                            </p>
                            <b>
                              ₹
                              {value.weightedShipping === null ||
                                value.weightedShipping === 0
                                ? totalValue(value.unitPrice.net.amount)
                                : totalValue(
                                  value.unitPrice.net.amount -
                                  value.weightedShipping
                                )}


                            </b>
                            <p style={{ paddingTop: 5, marginBottom: 8 }}>
                              <b style={{ color: "#999" }}>Quantity: </b>
                              {value.quantity}
                            </p>
                            {orderStatus === "Shipped" ? <p style={{ display: "flex" }}>
                              <IoAlertCircleOutline style={{ color: "red", fontSize: 20 }} />
                              <span style={{ fontSize: 12, paddingLeft: 5 }}>You cannot cancel the order now as the products have already been shipped</span>
                            </p> : null}


                          </div>
                        </div>
                      </div>
                    </div>
                    : null}
                </>
              ))}
              <p className="m-0 mb-1">Reason for Cancel:</p>
              {orderStatus !== "Shipped" ? <div style={{ marginRight: 30 }}>
                <div style={{ marginBottom: 15, marginLeft: 15 }}>
                  <textarea value={cancleTextArea} onChange={(e) => setCancleTextArea(e.target.value)} style={{
                    width: "100%", height: "90px", border: "1px solid lightgrey", padding: "5px 10px",
                    fontSize: "12px", borderRadius: 3
                  }} placeholder="Specify the Reason why you want to Cancel the Product..."></textarea>
                </div>
                {/* <select
                     style={{
                       borderRadius: 7,
                       border: "1px solid #8080802b",
                       outline: "none",
                       padding: 10,
                       background: "rgb(255 165 0 / 5%)",
                     }}
                   >
                     <option value="ANDAMAN and NICOBAR ISLANDS">
                       Select Reason
                     </option>
                     <option value="ANDHRA PRADESH">
                       Price of the item is decrease
                     </option>
                  
                     <option value="Assam">I have changed my Mind</option>
                   </select> */}
              </div> : null}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <p
                // onClick={() => {
                //   setOrderCancelModal(false);
                // }}
                onClick={orderCancle}
                style={{ width: 200, }}
                className="orderActions"
              >
                {circleLoader}
              </p>
            </div>
          </div>
        </div>
      )}
      <Header />
      <main className={`main ${modals}`}>
        {status ? (
        <div className="container">
          <ul className="checkout-progress-bar d-flex justify-content-center flex-wrap">
            <li className="active">
              <Link to="/Dashboard" style={{ color: "#999" }}>Dashboard</Link>
            </li>
            <li>
              <Link to="/order">Orders</Link>
            </li>
            <li className="disabled">
              <a style={{ color: "#F39655" }}>Order Details</a>
            </li>
          </ul>

          <div style={{}} className="orderDetail">
            <div style={{ height: "fit-content" }} className="overoffer">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 className="account-sub-title d-none d-md-block mt-0 pt-1 ml-1">
                  Products in Order #{order.node.number} {" "} <span style={{ paddingLeft: 10 }}>{productStatus}</span>
                </h3>

                {invoiceUrl !== "" ?
                  <div className="d-flex">
                    <a target="_blank" href={invoiceUrl}>
                      <div
                        className="orderAction" style={{ width: 160 }}
                      >
                        Download invoice
                      </div>
                    </a>
                  </div>
                  : null}

              </div>

              {lines.map((value) => (
                <div
                  style={{
                    marginBottom: 15,
                    border: "2px solid #e7e7e7",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    padding: 20,
                    height: "fit-content",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  className="mainoffer"
                >
                  <div style={{ display: "flex" }}>
                    {/* {console.log(value)} */}
                    {(breakCondition = false)}
                    {value.thumbnail !== null ? (
                      <figure
                        style={{ paddingRight: 10 }}
                        className="product-image-container"
                      >
                        <a className="product-image">
                          <img
                            style={{ maxWidth: 90, height: 90 }}
                            src={value.thumbnail.url}
                            alt="product"
                          />
                        </a>
                      </figure>
                    ) : null}
                    <div className="underoffer">
                      <p className="ptitle">{value.variantName}</p>
                      <b>
                        ₹
                        {value.weightedShipping === null ||
                          value.weightedShipping === 0
                          ? totalValue(value.unitPrice.net.amount)
                          : totalValue(
                            value.unitPrice.net.amount -
                            value.weightedShipping
                          )}
                      </b>
                      <p style={{ paddingTop: 5 }}>
                        <b style={{ color: "#999" }}>Quantity: </b>
                        {value.quantity}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>


                    {fulfilments.map((value1, index) => (
                      <>
                        {fulfilments[index].lines.map((value2) => (
                          <>
                            {!breakCondition ? (
                              <div style={{ display: "none" }}>
                                {value.id.includes(value2.orderLine.id)
                                  ? value2.orderLine.quantityToFulfill === 0
                                    ? (orderStatus = "Shipped")
                                    : (orderStatus = "Partially Shipped")
                                  : (orderStatus = "Not Shipped")}
                              </div>
                            ) : null}
                            {orderStatus === "Shipped"
                              ? (breakCondition = true)
                              : orderStatus === "Partially Shipped"
                                ? (breakCondition = true)
                                : (breakCondition = false)}
                          </>
                        ))}
                      </>
                    ))}

                    <div className="d-flex align-items-center justify-content-end">
                      <h4 style={{ fontSize: "1.6rem", alignContent: "right" }}>
                        Status:
                      </h4>
                      <p style={{ fontWeight: 600, color: "#999", paddingLeft: 3 }}>
                        {value.userStatus == null ? orderStatus : value.userStatus}
                      </p>
                    </div>

                    {orderStatus === "Not Shipped" && value.userStatus != "Cancellation Requested" ?
                      <div
                        onClick={() => {
                          setOrderCancelModal(true); setCancleProductId(value.id); setProductName(value.productName);
                        }}
                        className="orderAction" style={{ width: 160 }}
                      >
                        Request Cancellation
                      </div>
                      : null}
                    {orderStatus !== "Not Shipped" ?
                      <div className="d-flex justify-content-end">
                        <div
                          className="orderAction" style={{ width: 160 }}
                          onClick={() => { getReviewData(value.variantName) }}
                        >
                          Your Review
                        </div>
                      </div>
                      : null}

                  </div>
                </div>
              ))}

              <h3 className="account-sub-title d-none d-md-block mt-0 pt-1 ml-1">
                {fulfilments.length > 0 ? "Shipments details" : ""}
              </h3>

              {fulfilments.map((value, index) => (
                <>
                  {value.lines.length !== 0 &&
                    <div
                      style={{
                        marginBottom: 20,
                        border: "2px solid #e7e7e7",
                        boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                        padding: 20,
                        height: "fit-content",
                        justifyContent: "space-between",
                      }}
                      className="mainoffer"
                    >
                      <div style={{ display: "flex" }}>
                        <div className="underoffer" style={{ width: "100%" }}>
                          <div className="d-flex justify-content-between align-items-center">
                            <b className="ptitle">Shipment {shippingNumber++}</b>
                            {value.status === "DELIVERED" && value.fulfillmentDate != null ?
                              <b className="ptitle">Status: <span style={{ color: "grey" }}>{value.status} AT {value.fulfillmentDate.substring(0, 10)} </span></b>
                              : <b className="ptitle">Status: <span style={{ color: "grey" }}>{value.status}</span></b>}
                          </div>

                          <p className="ptitle">
                            Shipped on {value.created.substring(0, 10)}
                          </p>
                          <b className="ptitle">
                            Tracking number: {value.trackingNumber}
                          </b>
                          <p />

                          <b className="ptitle">Products in this shipment:</b>
                          <div className={value.status === "DELIVERED" ? " border-top mt-1 pt-2" : " "}>
                            {/* {fulfilments[index].lines.map((value1) => (
                              <p className="ptitle">
                                {value1.quantity} x {value1.orderLine.variantName}
                              </p>
                            ))} */}
                            {fulfilments[index].lines.map((value1) => (
                              <div className="d-flex justify-content-between align-items-center"> <p className="ptitle">
                                {value1.quantity} x {value1.orderLine.variantName}
                              </p>
                                {value.status === "DELIVERED" && value1.userStatus == null ?
                                  <>
                                    {(value1.orderLine.variant.product.returnAvailableDays != null || value1.orderLine.variant.product.returnAvailableDays != 0) && Math.floor(((new Date()).getTime() - (new Date(value.fulfillmentDate)).getTime()) / (24 * 60 * 60 * 1000)) <= value1.orderLine.variant.product.returnAvailableDays ?
                                      <>
                                        <div className="d-flex">
                                          <div
                                            onClick={() => {
                                              setReturnModal(true); setReturnProductId(value1.orderLine.id); setProductName(value1.orderLine.productName); setCreated(value.created); setFulfQuantity(value1.quantity);
                                            }}
                                            className="orderAction" style={{ width: 160 }}
                                          >
                                            Return Item
                                          </div><div
                                            onClick={() => {
                                              setReplaceModal(true); setReturnProductId(value1.orderLine.id); setProductName(value1.orderLine.productName); setCreated(value.created); setFulfQuantity(value1.quantity);
                                            }}
                                            className="orderAction" style={{ width: 160 }}
                                          >
                                            Replace Item
                                          </div>
                                        </div>
                                      </> : <span><h5>You can't Return/Replace this item</h5></span>}
                                  </>
                                  :
                                  <>
                                    {value1.userStatus != null ? <div><label>{value1.userStatus} for {value1.changeQuantity} items</label>
                                    </div> : null}
                                  </>
                                }
                              </div>
                            ))}</div>
                          {/* {console.log("Status", value)} */}


                        </div>
                      </div>
                    </div>}</>
              ))}
              {/* Refunded Details */}
              <h3 className="account-sub-title d-none d-md-block mt-0 pt-1 ml-1">
                {paymentStatus === "PARTIALLY_REFUNDED" ? "Refund details" : ""}
              </h3>
              {paymentStatus === "PARTIALLY_REFUNDED" &&
                <div
                  style={{
                    display: "flex",
                    marginBottom: 20,
                    border: "2px solid #e7e7e7",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    padding: 20,
                    height: "fit-content",

                  }}
                  className="mainoffer"
                >
                  <b className="ptitle">Refund Issued on this order:</b>
                  <p className="ptitle px-2 pt-1 mb-0">
                    ₹{totalBalance * "-1"}
                  </p>
                </div>}
              {status ? (
                <div
                  style={{
                    border: "2px solid #e7e7e7",
                    boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",
                    padding: 20,
                    height: "fit-content",
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 40,
                  }}
                >
                  <div>
                    <h4>Delivery Address</h4>
                    <div style={{ margin: 0 }} className="heading d-flex">
                      <h5 className="text-dark mb-0">
                        {order.node.shippingAddress.firstName}{" "}
                        {order.node.shippingAddress.lastName}
                      </h5>
                    </div>

                    <div style={{ marginBottom: 0 }} className="address-box">
                      {order.node.shippingAddress.streetAddress1},{" "}
                      {order.node.shippingAddress.streetAddress2} <br />{" "}
                      {order.node.shippingAddress.city}, India,{" "}
                      {order.node.shippingAddress.postalCode} <br />
                      Phone number: {order.node.shippingAddress.phone}
                    </div>
                  </div>
                  {order.node.isPaid ? (
                    <div>
                      <h4 style={{ fontSize: "1.6rem" }}>Payment Method</h4>
                      <p style={{ fontWeight: 600, color: "#999" }}>
                        {order.node.payments[0].paymentMethodType}
                      </p>
                    </div>
                  ) : null}
                  <div style={{ width: 300 }}>
                    <h4>Order Summary</h4>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Subtotal :</p>
                      <p>
                        ₹
                        {totalValue(
                          lines.reduce(
                            (total, item) =>
                              total +
                              (item.weightedShipping === null ||
                                item.weightedShipping === 0
                                ? item.unitPrice.net.amount * item.quantity
                                : (item.unitPrice.net.amount -
                                  item.weightedShipping) *
                                item.quantity),
                            0
                          )
                        )}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Shipping :</p>
                      <p>₹{order.node.shippingPrice.net.amount}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>weighted Delivery Charges :</p>
                      <p>
                        ₹
                        {totalValue(
                          lines.reduce(
                            (total, item) =>
                              total + item.weightedShipping * item.quantity,
                            0
                          )
                        )}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>Total :</p>
                      <p>₹{totalValue(order.node.undiscountedTotal.net.amount)}</p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <p>{`Applied Promotion ${order.node.voucher !== null ? `(${order.node.voucher.code})` : ""}`} :</p>
                      <p>
                        ₹
                        {/* {order.node.discounts.length > 0
                          ? totalValue(order.node.discounts[0].amount.amount)
                          : 0} */}
                        {totalValue(order.node.undiscountedTotal.net.amount - order.node.total.net.amount)}
                      </p>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <h5>Grand Total :</h5>
                      <h6>₹{totalValue(order.node.total.net.amount)}</h6>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* <!-- End .row --> */}
        </div>
        ) : (
          <div className="loaderr" style={{ position: "relative", top: "50px", left: "50%" }}></div>
        )}
        {/* <!-- End .container --> */}

        <div className="mb-6"></div>
        {/* <!-- margin --> */}
      </main>
      <Footer />
      {showBulkEnquiry && (
        <div
          style={{ display: "block", backgroundColor: "#fff" }}
          className="form-popup"
          id="myForm"
        >
          <div className="form-container" >
            <div style={{ backgroundColor: "#fff", padding: 20 }}>
              {variantName1 == "" ?
                <h4 className="text-center">Please provide your rating and review</h4> : <h4 className="text-center">You have already given your review</h4>}
              <div className="d-lg-flex d-md-flex flex-row justify-content-between align-items-center border-bottom border-dark  ">
                {/* Product Detail Start*/}
                <div>
                  {lines.map((value) => (
                    <>
                      {value.variantName == variantName ?
                        <div
                          style={{
                            marginBottom: 15,
                            // border: "2px solid #e7e7e7",
                            // boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px",

                            height: "fit-content",
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                          className="mainoffers"
                        >
                          <div style={{ display: "flex" }}>
                            {/* {console.log(value)} */}
                            {(breakCondition = false)}
                            {value.thumbnail !== null ? (
                              <figure
                                style={{ paddingRight: 10 }}
                                className="product-image-container"
                              >
                                <a className="product-image">
                                  <img
                                    style={{ maxWidth: 90, height: 90 }}
                                    src={value.thumbnail.url}
                                    alt="product"
                                  />
                                </a>
                              </figure>
                            ) : null}
                            <div className="underoffer">
                              <p className="ptitle">{value.variantName}</p>
                              <b>
                                ₹
                                {value.weightedShipping === null ||
                                  value.weightedShipping === 0
                                  ? totalValue(value.unitPrice.net.amount)
                                  : totalValue(
                                    value.unitPrice.net.amount -
                                    value.weightedShipping
                                  )}
                              </b>
                              <p style={{ paddingTop: 5 }}>
                                <b style={{ color: "#999" }}>Quantity: </b>
                                {value.quantity}
                              </p>
                            </div>
                          </div>

                          {/* <div style={{ textAlign: "right" }}>
                    <h4 style={{ fontSize: "1.6rem", alignContent: "right" }}>
                      Status
                    </h4>
                    {fulfilments.map((value1, index) => (
                      <>
                        {fulfilments[index].lines.map((value2) => (
                          <>
                            {!breakCondition ? (
                              <div style={{ display: "none" }}>
                                {value.id.includes(value2.orderLine.id)
                                  ? value2.orderLine.quantityToFulfill === 0
                                    ? (orderStatus = "Shipped")
                                    : (orderStatus = "Partially Shipped")
                                  : (orderStatus = "Not Shipped")}
                              </div>
                            ) : null}
                            {orderStatus === "Shipped"
                              ? (breakCondition = true)
                              : orderStatus === "Partially Shipped"
                                ? (breakCondition = true)
                                : (breakCondition = false)}
                          </>
                        ))}
                      </>
                    ))}
                    <p style={{ fontWeight: 600, color: "#999" }}>
                      {orderStatus}
                    </p>
                    <div style={{ paddingLeft: 0 }} className="cartcontainn">
                    <button
                      className="btn btn-dark"
                      onClick={getReviewData}
                    >
                      Edit Rating
                    </button>
                  </div>
                  </div> */}
                        </div> : null}
                    </>
                  ))}
                </div>
                {/* Product Detail End*/}
                {/* Start */}
                {variantName1 == "" ?
                  <div>
                    {[...Array(5)].map((star, i) => {
                      const ratingValue = i + 1;
                      return (
                        <span key={i} onClick={() => handleRatingChange(ratingValue)}>
                          {ratingValue <= rating ? <AiFillStar size={30} color={"green"} /> : <AiOutlineStar size={30} color={"gray"} />}
                        </span>
                      );
                    })}
                  </div> :
                  <div className="">
                    <span className="" style={{ width: '100%' }}><Ratings value={rating} /></span>
                  </div>}
              </div>
              {variantName1 == "" ?
                <div className="pt-3">
                  <h5>Write your Review</h5>
                  <div>
                    <textarea name="RattingComment" value={review} onChange={({ target }) => setReview(target.value)} placeholder="How is the Product? what do you like? what you don’t like?" style={{ height: "90px", width: "100%", paddingLeft: 8 }} />
                  </div>
                  <div className="text-center mt-2">
                    <button onClick={submitReview} className="px-5 py-2" style={{ color: "orangered", cursor: "pointer", fontSize: 17, fontWeight: 600, border: "none", backgroundColor: "#FFFFFF", boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px", }}>Submit</button>
                  </div>
                </div> :
                <div className="pt-3">
                  <h5>Your Review</h5>
                  <div>
                    <label>{review}</label>
                  </div>
                </div>
              }
              <span
                className="deleteMeetingClose"
                onClick={() => {
                  setShowBulkEnquiry(false);
                  setModals("")

                }}
              >
                &times;
              </span>
            </div>

          </div>
          {/* <form className="form-container ">
            <h4>
              <span className="popuptitle">
                Let us know the details of Bulk Quantity required
                for 
              </span>
            </h4>
            <div className="form-row">
              <div className="col-md-6 col-sm-12">
                {" "}
                <label for="name">
                  <b>Name</b>
                </label>
                <input

                  type="text"
                  placeholder="Enter Your Name"
                  name="name"
                  onChange={(event) => {
                    setName(event.target.value);
                  }}
                  required
                />{" "}
              </div>
              <div className="col-md-6 col-sm-12">
                {" "}
                <label for="phone">
                  <b>Phone</b>
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Phone Number"
                  name="phone"
                  onChange={(event) => {
                    setPhone(event.target.value);
                  }}
                  required
                />
              </div>{" "}
            </div>

            <div className="form-row">
              {" "}
              <div className="col-md-6 col-sm-12">
                {" "}
                <label for="email">
                  <b>Email</b>
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Email"
                  name="email"
                  onChange={(event) => {
                    setEmail(event.target.value);
                  }}
                  required
                />
              </div>
              <div className="col-md-6 col-sm-12">
                {" "}
                <label for="pin">
                  <b>Pin Code</b>
                </label>
                <input
                  type="text"
                  placeholder="Enter Your Pin Code"
                  name="pin"
                  onChange={(event) => {
                    setPincode(event.target.value);
                  }}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              {" "}
              <div className="col-md-6 col-sm-12">
                {" "}
                <label for="pin">
                  <b>Price</b>
                </label>
                <input
                  type="text"
                  placeholder="Expected Price Per Piece"
                  name="price"
                  onChange={(event) => {
                    setPrice(event.target.value);
                  }}
                  required
                />
              </div>
              <div className="col-md-6 col-sm-12">
                {" "}
                <label for="pin">
                  <b>Quantity</b>
                </label>
                <input
                  type="number"
                  placeholder="Enter Quantity"
                  name="quantity"
                  onChange={(event) => {
                    setQuantity(event.target.value);
                  }}
                  required
                />
              </div>
            </div>

            <div className="pcbutton">
              {" "}
              <button
                style={{ position: "relative" }}
                type="submit"
                className="btn "
                onClick={submitReview}
              >
                {bulkEnquiryLoader}
              </button>
            </div>

            <span
              className="deleteMeetingClose"
              onClick={() => {
                setShowBulkEnquiry(false);
                setModals("")
              }}
            >
              &times;
            </span>
          </form> */}
        </div>
      )}
    </div>
  );
};

export default OrderDetailScreen;
