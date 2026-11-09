import React, { useState, useEffect } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import { totalValue } from './decimalFunction'
import { Link } from 'react-router-dom'
import { GET_CHECKOUT_BY_TOKEN, SAVED_ADDRESSES, SHOP_DATA } from '../GraphQL/Queries'
import {
    CHECKOUT_EMAIL_UPDATE, CHECKOUT_SHIPPING_ADDRESS_UPDATE, CHECKOUT_LINE_DELETE,
    CHECKOUT_BILLING_ADDRESS_UPDATE, CHECKOUT_DELIEVERY_METHOD_UPDATE,
    CREATE_ADDRESS_MUTATION, CHECKOUT_ADD_PROMO_CODE, CHECKOUT_REMOVE_PROMO_CODE,
    METADATA_UPDATE, CHECKOUT_CUSTOMER_ATTACH, UPDATE_ADDRESS_MUTATION, CHECKOUT_LINE_UPDATE
} from '../GraphQL/Mutation'
import { useMutation, useQuery } from '@apollo/client/react'
import { Navigate } from 'react-router-dom'
import { BsTag } from 'react-icons/bs';
import { RiSecurePaymentFill } from 'react-icons/ri';
import axios from "axios";
import { BiEdit } from "react-icons/bi";

import "./Checkout.css"
import { Helmet } from 'react-helmet-async'
import OutOfStock from './OutOfStock'

const CheckoutScreen = () => {
    const [continueToPlaceOrderLoader, setContinueToPlaceOrderLoader] = useState("continue")
    const [placeOrderLoader, setPlaceOrderLoader] = useState("place Order")
    const [shippingAddressActive, setShippingAddressActive] = useState(false)
    const [billingAddressActive, setBillingAddressActive] = useState(false)
    const [placeOrderButtonActive, setPlaceOrderButtonActive] = useState(true)
    const [checked, setChecked] = useState(true)
    const [showBillingAddreses, setShowBillingAddresses] = useState(true)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [isFirst, setIsFirst] = useState(true)
    const [cartProduct, setCartProduct] = useState([])
    const [cartData, setCartData] = useState([])
    const [updateLineCheckout] = useMutation(CHECKOUT_LINE_UPDATE);
    const [orderId, setOrderId] = useState("")
    const [deliveryAddressModalOpen, setDeliveryAddressModalOpen] = useState(false);
    const [isbillingAddress, setIsBillingAddress] = useState(true);
    const [isbillingLAddress, setIsBillingLAddress] = useState(true);
    const [isCodAvailable, setIsCodAvailable] = useState(true);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [address1, setAddress1] = useState("");
    const [address2, setAddress2] = useState("");
    const [cityArea, setCityArea] = useState("");
    const [cityName, setCityName] = useState("");
    const [stateName, setStateName] = useState("Karnataka");
    const [pincode, setPincode] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [bfirstName, setBFirstName] = useState("");
    const [blastName, setBLastName] = useState("");
    const [bcompanyName, setBCompanyName] = useState("");
    const [baddress1, setBAddress1] = useState("");
    const [baddress2, setBAddress2] = useState("");
    const [bcityArea, setBCityArea] = useState("");
    const [bcityName, setBCityName] = useState("");
    const [currentId, setCurrentId] = useState("");
    const [bstateName, setBStateName] = useState("Karnataka");
    const [bpincode, setBPincode] = useState("");
    const [bphone, setBPhone] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [voucherCode, setVoucherCode] = useState("");
    const [shippingAddress, setShippingAddressValue] = useState("");
    const [billingAddress, setBillingAddressValue] = useState("");
    const [lpayMethod, setLpayMethod] = useState("online");
    const [payMethod, setpayMethod] = useState("online");
    const [savingAmount, setSavingAmount] = useState([]);
    const [errorMe, errorMessage] = useState([]);
    const [errorMe1, errorMessage1] = useState([]);
    const [delMethodId, setDelieveryMethodId] = useState("");
    const [dellMethodId, setDellieveryMethodId] = useState("");
    const [codLimit, setCodLimit] = useState(0);
    const [shippingLimit, setShippingLimit] = useState(0);
    const [checkoutEmailUpdate] = useMutation(CHECKOUT_EMAIL_UPDATE)
    const [checkoutShippingUpdate] = useMutation(CHECKOUT_SHIPPING_ADDRESS_UPDATE)
    const [checkoutBillingUpdate] = useMutation(CHECKOUT_BILLING_ADDRESS_UPDATE)
    const [checkoutDelMethodUpdate] = useMutation(CHECKOUT_DELIEVERY_METHOD_UPDATE)
    const [addLPromoCode] = useMutation(CHECKOUT_ADD_PROMO_CODE)
    const [removeLPromoCode] = useMutation(CHECKOUT_REMOVE_PROMO_CODE)
    const [updateMetaData] = useMutation(METADATA_UPDATE)
    const [address, setAddress] = useState([]);
    const [saveAddressErrorMessage, setSaveAddressErrorMessage] = useState(false)
    const [couponCodeError, setCouponCodeError] = useState("")
    const [showPromoCodeDiscount, setShowPromoCodeDiscount] = useState("")
    const [checkoutLineDelete] = useMutation(CHECKOUT_LINE_DELETE)
    const [productNameOut, setProductNameOut] = useState([])
    const [refresh, setRefresh] = useState(0)

    // Phase 2: Inline Guest Checkout & Pre-Payment Mobile Verification State
    const [showGuestOtpModal, setShowGuestOtpModal] = useState(false);
    const [guestOtpPhone, setGuestOtpPhone] = useState("");
    const [guestOtpCode, setGuestOtpCode] = useState("");
    const [guestOtpLoading, setGuestOtpLoading] = useState(false);
    const [guestOtpError, setGuestOtpError] = useState("");
    const [guestOtpTimer, setGuestOtpTimer] = useState(0);

    useEffect(() => {
        let timer;
        if (showGuestOtpModal && guestOtpTimer > 0) {
            timer = setTimeout(() => setGuestOtpTimer(guestOtpTimer - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [showGuestOtpModal, guestOtpTimer]);

    const formatGuestTimer = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleResendGuestOtp = () => {
        setGuestOtpError("");
        setGuestOtpCode("");
        var options = {
            method: 'post',
            url: (process.env.REACT_APP_OTP_API_URL || process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/sendOTP",
            data: JSON.stringify({ 'mobile': guestOtpPhone }),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        };
        axios(options).then((res) => {
            if (res.data === 'sent' || res.data !== '' || res.status === 200) {
                setGuestOtpTimer(600);
            } else {
                setGuestOtpError(res.data?.message || res.data?.api_message || "Failed to resend OTP.");
            }
        }).catch(() => {
            setGuestOtpError("Network error while resending OTP.");
        });
    };

    const handleVerifyGuestOtp = (e) => {
        if (e) e.preventDefault();
        setGuestOtpError("");
        if (guestOtpCode.length !== 6 || isNaN(guestOtpCode)) {
            setGuestOtpError("Please enter a valid 6-digit OTP.");
            return;
        }
        setGuestOtpLoading(true);
        var options = {
            method: 'post',
            url: (process.env.REACT_APP_OTP_API_URL || process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/verifyOTP",
            data: JSON.stringify({ 'mobile': guestOtpPhone, 'otp': guestOtpCode, 'channel': 'default-channel' }),
            headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
        };
        axios(options).then((res) => {
            setGuestOtpLoading(false);
            if (res.data && res.data.api_status) {
                localStorage.setItem('token', res.data.token);
                if (res.data.refreshToken) localStorage.setItem('refreshToken', res.data.refreshToken);
                localStorage.setItem('userName', res.data.user.firstName + " " + res.data.user.lastName);
                localStorage.setItem('user', res.data.user.firstName + " " + res.data.user.lastName);
                localStorage.setItem('email', res.data.user.email || email);
                localStorage.setItem('loginByOtp', "yes");
                if (res.data.user.id) localStorage.setItem('userId', res.data.user.id);
                setIsLoggedIn(true);
                setShowGuestOtpModal(false);

                // Reconcile and bind anonymous cart token to verified user
                const currentCartToken = localStorage.getItem('cartToken');
                if (currentCartToken) {
                    axios({
                        method: 'post',
                        url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/hegma/v1/hegma/getCheckoutToken",
                        data: JSON.stringify({ 'guestCartToken': currentCartToken }),
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': 'JWT ' + res.data.token
                        }
                    }).then((cartRes) => {
                        if (cartRes && cartRes.data && cartRes.data.checkout_token && cartRes.data.checkout_token !== 'null' && cartRes.data.checkout_token !== 'None') {
                            localStorage.setItem('cartToken', cartRes.data.checkout_token);
                        }
                        executeLPaymentActual();
                    }).catch(() => {
                        executeLPaymentActual();
                    });
                } else {
                    executeLPaymentActual();
                }
            } else {
                setGuestOtpError(res.data?.message || res.data?.api_message || "Invalid OTP entered. Please try again.");
            }
        }).catch(() => {
            setGuestOtpLoading(false);
            setGuestOtpError("Error verifying OTP. Please check your network.");
        });
    };

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
        const loggedInUser = localStorage.getItem("user");
        if (loggedInUser) {
            setIsLoggedIn(true);
            if (checked && shippingAddress !== "") {
                setPlaceOrderButtonActive(false)
                setBillingAddressValue("2")
            } else if (billingAddress === "1" && shippingAddress !== "") {
                setPlaceOrderButtonActive(false)
            }
            else {
                setPlaceOrderButtonActive(true)
            }

        }
    }, [checked, shippingAddress, billingAddress])
    //console.log("shippingAddress", shippingAddress,checked,billingAddress)

    const { refetch: refetch1, data: cartItems } = useQuery(GET_CHECKOUT_BY_TOKEN, {
        context: {
            headers: {
                Authorization: localStorage.getItem("user") !== null ? "JWT " + localStorage.getItem("token") : "",
            },
        },
        variables: {
            token: localStorage.getItem('cartToken')
        },
    })
    useEffect(() => {
        if (cartItems?.checkout?.lines?.length > 0) {
            cartItems?.checkout?.lines?.map((cart) => (
                cart?.quantity > cart?.variant?.quantityAvailable ? handleChange(cart?.variant?.id, cart?.variant?.quantityAvailable) : null
            ))
        }
        if (cartItems?.checkout?.lines?.filter((cart) => cart?.variant?.quantityAvailable === 0).length > 0) {
            cartItems?.checkout?.lines?.map((cart) => (
                cart?.variant?.quantityAvailable !== 0 ? null :
                    cart?.id ? removeProduct(cart?.id) : null
            ))
        }

    }, [cartItems?.checkout?.id])

    const handleChange = (id, quantity) => {
        if (quantity) {
            updateLineCheckout({
                variables: {
                    token: localStorage.getItem('cartToken'),
                    lines: [{
                        quantity: quantity,
                        variantId: id
                    }]
                },
                onCompleted: data => {
                    console.log("data", data)
                }
            })

        }
    }


    const removeProduct = (id) => {
        checkoutLineDelete({
            variables: {
                token: localStorage.getItem('cartToken'),
                lineId: id
            },
            onCompleted: data => {
                //console.log(data)	
                setRefresh(refresh + 1)
                // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
                window.location.reload(false)
                // refetch()
            }
        })

    }




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

    const [addPromoCode] = useMutation(CHECKOUT_ADD_PROMO_CODE, {
        context: {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        },
    });

    const [removePromoCode] = useMutation(CHECKOUT_REMOVE_PROMO_CODE, {
        context: {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        },
    });

    const [customerAttach] = useMutation(CHECKOUT_CUSTOMER_ATTACH, {
        context: {
            headers: {
                Authorization: "JWT " + localStorage.getItem("token"),
            },
        },
    });
    // useEffect(() => {
    //     const loggedInUser = localStorage.getItem("user");
    //     if (loggedInUser) {
    //         setIsLoggedIn(true);
    //     }
    // }, []);

    useEffect(() => {
        const loggedInUser = localStorage.getItem("user");
        if (!loggedInUser) {
            setPlaceOrderButtonActive(false)
        }
    }, []);

    // currentId is initialized to "" so no render-time setState needed

    async function createPayment() {
        if (payMethod === '') {
            alert('Please select payment method')
            return false;
        }

        if (shippingLimit > cartData.totalPrice.gross.amount) {
            errorMessage1('Minimum order amount is Rs ' + shippingLimit + '. Please add more products in your cart to place order.')
            return false;
        }

        setPlaceOrderLoader(<div style={{ marginLeft: 30 }} className='loaderr'></div>)

        // customerAttach({
        //     variables: {
        //         token: localStorage.getItem('cartToken')
        //     },
        //     onCompleted: data => {
        //         // console.log(data)
        //     }
        // })

        if (payMethod === 'online') {
            var initoptions = {
                method: 'post',
                url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/razorpayInit",
                data: JSON.stringify({ 'checkout_token': localStorage.getItem('cartToken') }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            axios(initoptions)
                .then((response) => {
                    setPlaceOrderLoader("Place Order")
                    console.log(response);
                    if (response.data !== '') {
                        var options = {
                            "key": "rzp_live_CL125PYYzO1z2K", // Enter the Key ID generated from the Dashboard
                            "amount": Math.round((cartData?.totalPrice?.gross?.amount || 0) * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                            "currency": "INR",
                            "name": "",
                            "description": "",
                            "image": "https://hegmadental.s3.ap-south-1.amazonaws.com/static/logoHegmaPG.png",
                            "order_id": typeof response.data === 'string' ? response.data : (response.data.order_id || response.data.id), //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                            "handler": function (response) {
                                var completeoptions = {
                                    method: 'post',
                                    url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/razorpayComplete",
                                    data: JSON.stringify({
                                        'checkout_token': localStorage.getItem('cartToken'),
                                        'razorpay_payment_id': response.razorpay_payment_id,
                                        'razorpay_order_id': response.razorpay_order_id,
                                        'razorpay_signature': response.razorpay_signature
                                    }),
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                };
                                axios(completeoptions)
                                    .then((response) => {
                                        console.log(response);
                                        if (response.data === 'Success') {
                                            errorMessage("Order placed successfully.");
                                            localStorage.removeItem('cartToken');
                                            localStorage.removeItem('setFirst');
                                            localStorage.removeItem('dummyemail');
                                            localStorage.removeItem('dummycoupon');
                                            window.location.href = "/orderPlace";
                                        } else {
                                            errorMessage("Order not placed successfully.");
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })
                            },
                            "prefill": {
                                "name": "",
                                "email": "",
                                "contact": "0000000000"
                            },
                            "notes": {
                                "address": "Hegma Kart"
                            },
                            "theme": {
                                "color": "#3399cc"
                            }
                        };
                        var rzp1 = new window.Razorpay(options);
                        rzp1.on('payment.failed', function (response) {
                            console.log(response.error);
                        });
                        rzp1.open();
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            var codOptions = {
                method: 'post',
                url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/razorpayCompleteCod",
                data: JSON.stringify({ 'checkout_token': localStorage.getItem('cartToken') }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            axios(codOptions)
                .then((response) => {
                    console.log(response);
                    if (response.data !== '') {
                        errorMessage("Order placed successfully.");
                        localStorage.removeItem('cartToken');
                        localStorage.removeItem('setFirst');
                        localStorage.removeItem('dummyemail');
                        localStorage.removeItem('dummycoupon');
                        window.location.href = "/orderPlace";
                    } else {
                        errorMessage("Order not placed successfully.");
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const { loading, refetch } = useQuery(GET_CHECKOUT_BY_TOKEN, {
        notifyOnNetworkStatusChange: true,
        context: {
            headers: {
                Authorization: localStorage.getItem("user") !== null ? "JWT " + localStorage.getItem("token") : "",
            },
        },
        variables: {
            token: localStorage.getItem('cartToken')
        }
    })

    useEffect(() => {
        if (cartItems?.checkout) {
            const data = cartItems;
            console.log("🛒 [Active Cart Object - CheckoutScreen]:", data.checkout);
            try {
                setShowPromoCodeDiscount(data.checkout.discount?.amount || 0)
                setCartProduct(data.checkout.lines)
                setCartData(data.checkout)
                if (data.checkout.totalPrice.gross.amount < 2000) {
                    setDellieveryMethodId('U2hpcHBpbmdNZXRob2Q6MzU=')
                } else {
                    setDellieveryMethodId('U2hpcHBpbmdNZXRob2Q6NDU=')
                }
                if (localStorage.getItem('dummyemail') === null) {
                    setEmail(data.checkout.email)
                }
                setVoucherCode(data.checkout.voucherCode)
                setCouponCode(data.checkout.voucherCode || '')
                for (let index = 0; index < (data.checkout.lines?.length || 0); index++) {
                    const originalPrice = data.checkout.lines[index].variant.originalPrice || data.checkout.lines[index].variant.pricing.priceUndiscounted?.net?.amount || data.checkout.lines[index].variant.pricing.price.net.amount;
                    const currentPrice = data.checkout.lines[index].variant.pricing.price.net.amount;
                    setSavingAmount(savingAmount => [...savingAmount, (originalPrice - currentPrice) * data.checkout.lines[index].quantity]);
                    if (data.checkout.lines[index].variant?.quantityAvailable === 0) {
                        setProductNameOut((pre) => [...pre, data.checkout.lines[index].variant.name])
                    }
                }
                for (let index = 0; index < (data.checkout.lines?.length || 0); index++) {
                    if (data.checkout.lines[index].variant.product.codAvailable == null || data.checkout.lines[index].variant.product.codAvailable) {
                    } else {
                        setIsCodAvailable(false);
                        break;
                    }
                }
                let shippingamount = -1
                for (let index = 0; index < (data.checkout.shippingMethods?.length || 0); index++) {
                    if (data.checkout.shippingMethods[index].price.amount > shippingamount) {
                        shippingamount = data.checkout.shippingMethods[index].price.amount;
                        setDelieveryMethodId(data.checkout.shippingMethods[index].id)
                    }
                }
                if (localStorage.getItem('email') && data.checkout.email !== localStorage.getItem('email')) {
                    checkoutEmailUpdate({
                        variables: {
                            token: localStorage.getItem('cartToken'),
                            email: localStorage.getItem('email')
                        },
                        onCompleted: data => {
                            console.log(data)
                        }
                    })
                }
                if (localStorage.getItem('user')) {
                    customerAttach({
                        variables: {
                            token: localStorage.getItem('cartToken')
                        }
                    })
                }
                if (data.checkout.deliveryMethod !== null) {
                    setIsFirst(false)
                    if (localStorage.getItem('setFirst') === 'true') {
                        setIsFirst(true)
                    }
                }
                if (data.checkout.shippingAddress !== null) {
                    setFirstName(data.checkout.shippingAddress.firstName)
                    setLastName(data.checkout.shippingAddress.lastName)
                    setPhone(data.checkout.shippingAddress.phone)
                    setAddress1(data.checkout.shippingAddress.streetAddress1)
                    setAddress2(data.checkout.shippingAddress.streetAddress2)
                    setCityName(data.checkout.shippingAddress.city)
                    setCityArea(data.checkout.shippingAddress.cityArea)
                    setStateName(data.checkout.shippingAddress.countryArea)
                    setPincode(data.checkout.shippingAddress.postalCode)
                }

                if (data.checkout.billingAddress !== null) {
                    setBFirstName(data.checkout.billingAddress.firstName)
                    setBLastName(data.checkout.billingAddress.lastName)
                    setBPhone(data.checkout.billingAddress.phone)
                    setBAddress1(data.checkout.billingAddress.streetAddress1)
                    setBAddress2(data.checkout.billingAddress.streetAddress2)
                    setBCityName(data.checkout.billingAddress.city)
                    setBCityArea(data.checkout.billingAddress.cityArea)
                    setBStateName(data.checkout.billingAddress.countryArea)
                    setBPincode(data.checkout.billingAddress.postalCode)
                }

                for (let index = 0; index < (data.checkout.metadata?.length || 0); index++) {
                    if (data.checkout.metadata[index].key === 'mobile') {
                        setMobile(data.checkout.metadata[index].value)
                    }
                }
            } catch (error) {
                console.error("GET_CHECKOUT_BY_TOKEN useEffect CRASH:", error);
            }
        }
    }, [cartItems]);
    //  console.log("productNameOut",productNameOut)
    const { refetch: refetchAddresses, data: savedAddressData } = useQuery(SAVED_ADDRESSES, {
        skip: !localStorage.getItem("token"),
        context: {
            headers: {
                Authorization: localStorage.getItem("token") ? "JWT " + localStorage.getItem("token") : "",
            },
        },
        onCompleted: (data) => {
            // console.log("!loginAddress",data)
            if (localStorage.getItem("email") && data?.me === null) {
                // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
                window.location.reload(false)
            } else {
                if (data?.me) { setAddress(data.me.addresses); }
            }
        },
    });

    useEffect(() => {
        if (savedAddressData?.me) {
            setAddress(savedAddressData.me.addresses);
        }
    }, [savedAddressData]);

    const { data: shopData } = useQuery(SHOP_DATA, {
        onCompleted: (data) => {
            console.log("!loginAddress", data.shop.codAvailableLimit)
        },
    });

    useEffect(() => {
        if (shopData?.shop) {
            setCodLimit(shopData.shop.codAvailableLimit);
            setShippingLimit(shopData.shop.shippingMinimumLimit);
        }
    }, [shopData]);
    // cityArea: cityArea,
    const createAddress = async (e) => {
        e.preventDefault();
        if (phone?.length != 10) {
            errorMessage('Please check your phone number')
            return false
        } else if (firstName?.length <= 1) {
            errorMessage('firstName min two character')
            return false
        } else if (lastName?.length <= 1) {
            errorMessage('lastName min two character')
            return false
        } else if (address1?.length <= 1) {
            errorMessage('Please fill Street address')
            return false
        } else if (cityName?.length <= 1) {
            errorMessage('Please fill Town / City ')
            return false
        } else if (stateName?.length <= 1) {
            errorMessage('Please fill State ')
            return false
        } else if (pincode?.length != 6) {
            errorMessage('Please fill valid pinCode')
            return false
        } else {
            errorMessage(false)
        }
        addressCreate({
            variables: {
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
                console.log(data);
                if (data.accountAddressCreate.address === null) {
                    setSaveAddressErrorMessage(true)
                    errorMessage("Could not save address, please check your pincode");
                } else {
                    setSaveAddressErrorMessage(false);
                    errorMessage(false);
                    setDeliveryAddressModalOpen(false);
                    refetchAddresses();
                }
            },
            onError: (err) => {
                console.error(err);
                setSaveAddressErrorMessage(true);
                errorMessage("Error saving address: " + err.message);
            }
        });
    };
    // cityArea: cityArea,
    const editAddress = async (e) => {
        e.preventDefault();
        if (phone?.length != 10) {
            errorMessage('Please check your phone number')
            return false
        } else if (firstName?.length <= 1) {
            errorMessage('firstName min two character')
            return false
        } else if (lastName?.length <= 1) {
            errorMessage('lastName min two character')
            return false
        } else if (address1?.length <= 1) {
            errorMessage('Please fill Street address')
            return false
        } else if (cityName?.length <= 1) {
            errorMessage('Please fill Town / City ')
            return false
        } else if (stateName?.length <= 1) {
            errorMessage('Please fill State ')
            return false
        } else if (pincode?.length != 6) {
            errorMessage('Please fill valid pinCode')
            return false
        } else {
            errorMessage(false)
        }
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
                console.log(data);
                if (data.accountAddressUpdate.address === null) {
                    setSaveAddressErrorMessage(true)
                    errorMessage("Could not save address, please check your pincode");
                } else {
                    setCurrentId("")
                    setDeliveryAddressModalOpen(false);
                    refetchAddresses();
                }
            },
            onError: (err) => {
                console.error(err);
                setSaveAddressErrorMessage(true);
                errorMessage("Error updating address: " + err.message);
            }
        });
    };
    // cityArea: address[id].cityArea,
    const updateShippingAddress = (e) => {
        const { id } = e.target;
        checkoutShippingUpdate({
            variables: {
                token: localStorage.getItem('cartToken'),
                shippingAddress: {
                    firstName: address[id].firstName,
                    lastName: address[id].lastName,
                    streetAddress1: address[id].streetAddress1,
                    streetAddress2: address[id].streetAddress2,
                    city: address[id].city,
                    country: 'IN',
                    postalCode: address[id].postalCode,
                    phone: address[id].phone,
                    countryArea: address[id].countryArea
                }
            },
            onCompleted: data => {
                console.log(data)
                refetch();
            }
        })

        checkoutBillingUpdate({
            variables: {
                token: localStorage.getItem('cartToken'),
                billingAddress: {
                    firstName: address[id].firstName,
                    lastName: address[id].lastName,
                    streetAddress1: address[id].streetAddress1,
                    streetAddress2: address[id].streetAddress2,
                    city: address[id].city,
                    cityArea: address[id].cityArea,
                    country: 'IN',
                    postalCode: address[id].postalCode,
                    phone: address[id].phone,
                    countryArea: address[id].countryArea
                }
            },
            onCompleted: data => {
                console.log(data)
                if (billingAddressActive) {
                    setPlaceOrderButtonActive(false);
                }
            }
        })
    }

    const createShipping = (e) => {
        setContinueToPlaceOrderLoader(<div style={{ marginLeft: 30 }} className='loaderr'></div>)
        setTimeout(() => {
            setContinueToPlaceOrderLoader("Continue")
        }, 2000);
        if (delMethodId === '') {
            errorMessage("Please check your address");
            setSaveAddressErrorMessage(true)
        } else {
            checkoutDelMethodUpdate({
                variables: {
                    token: localStorage.getItem('cartToken'),
                    deliveryMethodId: delMethodId
                },
                onCompleted: data => {
                    console.log(data)
                    refetch()
                    localStorage.removeItem('setFirst');
                    setIsFirst(false);
                }
            })
        }
    }

    const applyPromoCode = (e) => {
        addPromoCode({
            variables: {
                token: localStorage.getItem('cartToken'),
                promoCode: couponCode
            },
            onCompleted: data => {
                setCouponCodeError(data.checkoutAddPromoCode.errors.length === 1 ? data.checkoutAddPromoCode.errors[0].message : "")
                console.log(data)
                refetch()
                // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
                window.location.reload(false)
            }
        })
    }

    const unapplyPromoCode = (e) => {
        removePromoCode({
            variables: {
                token: localStorage.getItem('cartToken'),
                promoCode: voucherCode
            },
            onCompleted: data => {
                console.log(data)
                setCouponCode('')
                setVoucherCode(null)
                setShowPromoCodeDiscount(0)
                refetch()
                //debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
                window.location.reload(false)
            }
        })
    }
    // cityArea: address[id].cityArea,
    const updateBillingAddress = (e) => {
        const { id } = e.target;
        checkoutBillingUpdate({
            variables: {
                token: localStorage.getItem('cartToken'),
                billingAddress: {
                    firstName: address[id].firstName,
                    lastName: address[id].lastName,
                    streetAddress1: address[id].streetAddress1,
                    streetAddress2: address[id].streetAddress2,
                    city: address[id].city,
                    country: 'IN',
                    postalCode: address[id].postalCode,
                    phone: address[id].phone,
                    countryArea: address[id].countryArea
                }
            },
            onCompleted: data => {
                console.log(data)
                if (shippingAddressActive) {
                    setPlaceOrderButtonActive(false);
                }
            }
        })
    }

    const applyLPromoCode = (e) => {
        if (email === '') {
            alert('Please enter email')
            return false;
        }
        checkoutEmailUpdate({
            variables: {
                token: localStorage.getItem('cartToken'),
                email: email
            },
            onCompleted: data => {
                addLPromoCode({
                    variables: {
                        token: localStorage.getItem('cartToken'),
                        promoCode: couponCode
                    },
                    onCompleted: data => {
                        refetch()
                        setCouponCodeError(data.checkoutAddPromoCode.errors.length === 1 ? data.checkoutAddPromoCode.errors[0].message : "")
                        // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
                        window.location.reload(false)
                    }
                })
            }
        })
    }

    const unapplyLPromoCode = (e) => {
        removeLPromoCode({
            variables: {
                token: localStorage.getItem('cartToken'),
                promoCode: voucherCode
            },
            onCompleted: data => {
                setCouponCode('')
                setVoucherCode(null)
                setShowPromoCodeDiscount(0)
                refetch()
                // debugger; // <-- PAUSES EXECUTION BEFORE LOGOUT REDIRECT
                window.location.reload(false)
            }
        })
    }
    // setCityArea(address[index].cityArea)
    const editForm = e => {
        const { id } = e.target;
        setCurrentId(id)
        for (let index = 0; index < address.length; index++) {
            if (id == address[index].id) {
                setFirstName(address[index].firstName)
                setLastName(address[index].lastName)
                setPhone(address[index].phone.substring(3, address[index].phone.length))
                setAddress1(address[index].streetAddress1)
                setAddress2(address[index].streetAddress2)
                setCityName(address[index].city)
                setStateName(address[index].countryArea)
                setPincode(address[index].postalCode)
                setCompanyName(address[index].companyName)
                setDeliveryAddressModalOpen(true)
            }
        }
    };

    async function createLShipping(e) {
        e.preventDefault()
        if (email === '') {
            alert('Please enter email')
            return false;
        }
        else if (mobile === undefined || mobile.length < 10) {
            alert('Please enter mobile number')
            return false;
        }
        else if (firstName === undefined || firstName.length < 3) {
            alert('Please enter First Name')
            return false;
        }
        else if (lastName === undefined || lastName.length < 3) {
            alert('Please enter Last Name')
            return false;
        } else if (phone === undefined || phone.length < 10) {
            alert('Please enter Valid Phone No.')
            return false;
        } else if (address1 === undefined || address1.length < 4) {
            alert('Please enter Valid Street Address1')
            return false;
        } else if (cityName === undefined || cityName.length < 2) {
            alert('Please enter Valid Town/City Name')
            return false;
        } else if (pincode === undefined || pincode.length < 6) {
            alert('Please enter Valid Pincode')
            return false;
        }

        if (!checked) {
            if (bfirstName === undefined || bfirstName.length < 3) {
                alert('Please enter Billing Address First Name')
                return false;
            }
            else if (blastName === undefined || blastName.length < 3) {
                alert('Please enter Billing Address Last Name')
                return false;
            } else if (bphone === undefined || bphone.length < 10) {
                alert('Please enter Billing Address Valid Phone No.')
                return false;
            } else if (baddress1 === undefined || baddress1.length < 5) {
                alert('Please enter Billing Address Valid Street Address1')
                return false;
            } else if (baddress2 === undefined || baddress2.length < 5) {
                alert('Please enter Billing Address Valid Street Address2')
                return false;
            } else if (bcityName === undefined || bcityName.length < 2) {
                alert('Please enter Billing Address Valid town/City Name')
                return false;
            } else if (bpincode === undefined || bpincode.length < 6) {
                alert('Please enter Billing Address Valid Pincode')
                return false;
            }
        }

        setContinueToPlaceOrderLoader(<div style={{ marginLeft: 30 }} className='loaderr'></div>)
        setTimeout(() => {
            setContinueToPlaceOrderLoader("Continue")
        }, 2000);
        updateMetaData({
            variables: {
                id: cartData.id,
                input: [{
                    key: 'mobile',
                    value: mobile
                }]
            },
            onCompleted: data => {
                console.log(data)
                checkoutEmailUpdate({
                    variables: {
                        token: localStorage.getItem('cartToken'),
                        email: email
                    },
                    onCompleted: data => {
                        console.log(data)
                        localStorage.removeItem('dummyemail');
                        checkoutShippingUpdate({
                            variables: {
                                token: localStorage.getItem('cartToken'),
                                shippingAddress: {
                                    firstName: firstName,
                                    lastName: lastName,
                                    streetAddress1: address1,
                                    streetAddress2: address2,
                                    city: cityName,
                                    // cityArea: cityArea,
                                    country: 'IN',
                                    postalCode: pincode,
                                    phone: phone,
                                    countryArea: stateName
                                }
                            },
                            onCompleted: data => {
                                if (data.checkoutShippingAddressUpdate.checkout === null) {
                                    setSaveAddressErrorMessage(true)
                                    errorMessage("Could not save address, please check your pincode");
                                } else {
                                    console.log(data)
                                    refetch();
                                    setTimeout(() => {
                                    }, 2000);
                                    if (isbillingLAddress) {
                                        checkoutBillingUpdate({
                                            variables: {
                                                token: localStorage.getItem('cartToken'),
                                                billingAddress: {
                                                    firstName: firstName,
                                                    lastName: lastName,
                                                    streetAddress1: address1,
                                                    streetAddress2: address2,
                                                    city: cityName,
                                                    // cityArea: cityArea,
                                                    country: 'IN',
                                                    postalCode: pincode,
                                                    phone: phone,
                                                    countryArea: stateName
                                                }
                                            },
                                            onCompleted: data => {
                                                if (data.checkoutBillingAddressUpdate.checkout === null) {
                                                    setSaveAddressErrorMessage(true)
                                                    errorMessage("Could not save address, please check your pincode");
                                                } else {
                                                    console.log(data)
                                                    if (dellMethodId === '') {
                                                        errorMessage("Please check your address");
                                                        setSaveAddressErrorMessage(true)
                                                    } else {
                                                        checkoutDelMethodUpdate({
                                                            variables: {
                                                                token: localStorage.getItem('cartToken'),
                                                                deliveryMethodId: dellMethodId
                                                            },
                                                            onCompleted: data => {
                                                                refetch();
                                                                localStorage.removeItem('setFirst');
                                                                setIsFirst(false);
                                                            }
                                                        })
                                                    }

                                                }
                                            }
                                        })
                                    } else {
                                        checkoutBillingUpdate({
                                            variables: {
                                                token: localStorage.getItem('cartToken'),
                                                billingAddress: {
                                                    firstName: bfirstName,
                                                    lastName: blastName,
                                                    streetAddress1: baddress1,
                                                    streetAddress2: baddress2,
                                                    city: bcityName,
                                                    cityArea: bcityArea,
                                                    country: 'IN',
                                                    postalCode: bpincode,
                                                    phone: bphone,
                                                    countryArea: bstateName
                                                }
                                            },
                                            onCompleted: data => {
                                                if (data.checkoutBillingAddressUpdate.checkout === null) {
                                                    setSaveAddressErrorMessage(true)
                                                    errorMessage("Could not save address, please check your pincode");
                                                } else {
                                                    console.log(data)
                                                    if (dellMethodId === '') {
                                                        errorMessage("Please check your address");
                                                        setSaveAddressErrorMessage(true)
                                                    } else {
                                                        checkoutDelMethodUpdate({
                                                            variables: {
                                                                token: localStorage.getItem('cartToken'),
                                                                deliveryMethodId: dellMethodId
                                                            },
                                                            onCompleted: data => {
                                                                refetch();
                                                                localStorage.removeItem('setFirst');
                                                                setIsFirst(false);
                                                            }
                                                        })
                                                    }

                                                }
                                            }
                                        })
                                    }
                                }
                            }
                        })
                    }

                })
            }
        })
    }

    async function createLPayment() {
        if (lpayMethod === '') {
            alert('Please select payment method')
            return false;
        }
        if (!localStorage.getItem("token") || !isLoggedIn) {
            const targetPhone = mobile || phone;
            if (!targetPhone || String(targetPhone).length < 10) {
                alert('Please provide a valid 10-digit mobile number in the shipping details.');
                return false;
            }
            setGuestOtpPhone(String(targetPhone));
            setPlaceOrderLoader(<div style={{ marginLeft: 30 }} className='loaderr'></div>);
            var otpOpts = {
                method: 'post',
                url: (process.env.REACT_APP_OTP_API_URL || process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/sendOTP",
                data: JSON.stringify({ 'mobile': targetPhone }),
                headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' }
            };
            axios(otpOpts).then((res) => {
                setPlaceOrderLoader("place Order");
                if (res.data === 'sent' || res.data !== '' || res.status === 200) {
                    setShowGuestOtpModal(true);
                    setGuestOtpTimer(600);
                } else {
                    alert(res.data?.message || res.data?.api_message || "Could not send verification OTP.");
                }
            }).catch(() => {
                setPlaceOrderLoader("place Order");
                alert('Network error while requesting verification OTP.');
            });
            return;
        }
        executeLPaymentActual();
    }

    function executeLPaymentActual() {
        setPlaceOrderLoader(<div style={{ marginLeft: 30 }} className='loaderr'></div>)
        setTimeout(() => {
            setPlaceOrderLoader("place Order")
        }, 5000);

        if (lpayMethod === 'online') {
            var initoptions = {
                method: 'post',
                url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/razorpayInit",
                data: JSON.stringify({ 'checkout_token': localStorage.getItem('cartToken') }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            axios(initoptions)
                .then((response) => {
                    console.log(response);
                    if (response.data !== '') {
                        var options = {
                            "key": "rzp_live_CL125PYYzO1z2K", // Enter the Key ID generated from the Dashboard
                            "amount": Math.round((cartData?.totalPrice?.gross?.amount || 0) * 100), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
                            "currency": "INR",
                            "name": "",
                            "description": "",
                            "image": "https://hegmadental.s3.ap-south-1.amazonaws.com/static/logoHegmaPG.png",
                            "order_id": typeof response.data === 'string' ? response.data : (response.data.order_id || response.data.id), //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
                            "handler": function (response) {
                                var completeoptions = {
                                    method: 'post',
                                    url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/razorpayComplete",
                                    data: JSON.stringify({
                                        'checkout_token': localStorage.getItem('cartToken'),
                                        'razorpay_payment_id': response.razorpay_payment_id,
                                        'razorpay_order_id': response.razorpay_order_id,
                                        'razorpay_signature': response.razorpay_signature
                                    }),
                                    headers: {
                                        'Accept': 'application/json',
                                        'Content-Type': 'application/json'
                                    }
                                };
                                axios(completeoptions)
                                    .then((response) => {
                                        console.log(response);
                                        if (response.data === 'Success') {
                                            errorMessage("Order placed successfully.");
                                            localStorage.removeItem('cartToken');
                                            localStorage.removeItem('setFirst');
                                            localStorage.removeItem('dummyemail');
                                            localStorage.removeItem('dummycoupon');
                                            window.location.href = "/orderPlace";
                                        } else {
                                            errorMessage("Order not placed successfully.");
                                        }
                                    })
                                    .catch((error) => {
                                        console.log(error)
                                    })
                            },
                            "prefill": {
                                "name": (firstName || "") + " " + (lastName || ""),
                                "email": email || localStorage.getItem("email") || "",
                                "contact": mobile || phone || "0000000000"
                            },
                            "notes": {
                                "address": "Hegma Kart"
                            },
                            "theme": {
                                "color": "#3399cc"
                            }
                        };
                        var rzp1 = new window.Razorpay(options);
                        rzp1.on('payment.failed', function (response) {
                            console.log(response.error);
                        });
                        rzp1.open();
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        } else {
            var codOptions = {
                method: 'post',
                url: (process.env.REACT_APP_REST_API_URL || window.location.origin) + "/api/v1/razorpayCompleteCod",
                data: JSON.stringify({ 'checkout_token': localStorage.getItem('cartToken') }),
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            };
            axios(codOptions)
                .then((response) => {
                    console.log(response);
                    if (response.data !== '') {
                        errorMessage("Order placed successfully.");
                        localStorage.removeItem('cartToken');
                        localStorage.removeItem('setFirst');
                        localStorage.removeItem('dummyemail');
                        localStorage.removeItem('dummycoupon');
                        window.location.href = "/orderPlace";
                    } else {
                        errorMessage("Order not placed successfully.");
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }

    const removeFirst = async (e) => {
        e.preventDefault();
        localStorage.setItem('setFirst', 'true');
        setIsFirst(true);
    };

    if (loading) {
        return (<div className="loading-overlay">
            <div className="bounce-loader">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
            </div>
        </div>)
    }


    if (localStorage.getItem('cartToken') === null) {
        return (<Navigate to="/orderPlace" />);
    }

    return (

        <>
            <Helmet>
                <title>Hegmakart: Checkout</title>
                <meta name="description" content="Checkout" />
            </Helmet>
            <script src="assets/js/jquery.min.js"></script>
            <script src="assets/js/bootstrap.bundle.min.js"></script>
            <script src="assets/js/plugins.min.js"></script>
            <script src="assets/js/optional/isotope.pkgd.min.js"></script>
            <script src="assets/js/jquery.appear.min.js"></script>
            <script src="assets/js/jquery.plugin.min.js"></script>
            <script src="assets/js/jquery.countdown.min.js"></script>

            <script src="assets/js/main.min.js"></script>
            <script src="assets/js/nouislider.min.js"></script>
            {deliveryAddressModalOpen &&
                <div className="CheckoutAddressModalBackground">
                    <div className="CheckoutAddressModalContainer">
                        <div className="col-lg-7" style={{ maxWidth: "100%" }}>
                            <ul className="checkout-steps">
                                <li>
                                    {currentId == '' ?
                                        <h2 className="step-title">ADD NEW ADDRESS</h2> :
                                        <h2 className="step-title">EDIT ADDRESS</h2>}

                                    {currentId == '' ?
                                        <form onSubmit={createAddress} id="checkout-form">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>First name
                                                            <abbr className="required" title="required">*</abbr>
                                                        </label>
                                                        <input type="text" className="form-control" onChange={(event) => { setFirstName(event.target.value); }} required />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Last name
                                                            <abbr className="required" title="required">*</abbr></label>
                                                        <input type="text" className="form-control" onChange={(event) => { setLastName(event.target.value); }} required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Phone <abbr className="required" title="required">*</abbr></label>
                                                <input type="tel" className="form-control" onChange={(event) => { setPhone(event.target.value); }} required />
                                            </div>

                                            <div className="form-group">
                                                <label>Hospital name/Clinic name</label>
                                                <input type="text" className="form-control" onChange={(event) => { setCompanyName(event.target.value); }} />
                                            </div>

                                            <div className="form-group mb-1 pb-2">
                                                <label>Street address 1
                                                    <abbr className="required" title="required">*</abbr></label>
                                                <input type="text" className="form-control" placeholder="House number and street name" onChange={(event) => { setAddress1(event.target.value); }} required />
                                            </div>

                                            <div className="form-group">
                                                <label>Street address 2
                                                </label>
                                                <input type="text" className="form-control" placeholder="Apartment, suite, unite, etc." onChange={(event) => { setAddress2(event.target.value); }} />
                                            </div>

                                            {/* <div className="form-group">
                                            <label>CityArea
                                                <abbr className="required" title="required">*</abbr></label>
                                            <input type="text" className="form-control" onChange={(event) => { setCityArea(event.target.value); }} required />
                                        </div> */}

                                            <div className="form-group">
                                                <label>Town / City
                                                    <abbr className="required" title="required">*</abbr></label>
                                                <input type="text" className="form-control" onChange={(event) => { setCityName(event.target.value); }} required />
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
                                                    <option value="Karnataka" >Karnataka</option>
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
                                                <label>Pincode
                                                    <abbr className="required" title="required">*</abbr></label>
                                                <input type="text" className="form-control" onChange={(event) => { setPincode(event.target.value); }} required />
                                            </div>
                                            {saveAddressErrorMessage && <div style={{ color: "red", paddingBottom: 5 }}>Could not save Address, Please Check Your Pincode</div>}
                                            {errorMe && <div style={{ color: "red", paddingBottom: 5, marginBottom: 5 }}>{errorMe}</div>}

                                            <button type="submit" className="form-control" style={{ background: "black", color: "white", fontWeight: "bold", fontSize: "16px" }} >ADD ADDRESS</button>
                                        </form> :
                                        <form onSubmit={editAddress} id="checkout-form">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>First name
                                                            <abbr className="required" title="required">*</abbr>
                                                        </label>
                                                        <input type="text" className="form-control" value={firstName} onChange={(event) => { setFirstName(event.target.value); }} required />
                                                    </div>
                                                </div>

                                                <div className="col-md-6">
                                                    <div className="form-group">
                                                        <label>Last name
                                                            <abbr className="required" title="required">*</abbr></label>
                                                        <input type="text" className="form-control" value={lastName} onChange={(event) => { setLastName(event.target.value); }} required />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Phone <abbr className="required" title="required">*</abbr></label>
                                                <input type="tel" className="form-control" value={phone} onChange={(event) => { setPhone(event.target.value); }} required />
                                            </div>

                                            <div className="form-group">
                                                <label>Hospital name/Clinic name</label>
                                                <input type="text" className="form-control" value={companyName} onChange={(event) => { setCompanyName(event.target.value); }} />
                                            </div>

                                            <div className="form-group mb-1 pb-2">
                                                <label>Street address 1
                                                    <abbr className="required" title="required">*</abbr></label>
                                                <input type="text" className="form-control" value={address1} placeholder="House number and street name" onChange={(event) => { setAddress1(event.target.value); }} required />
                                            </div>

                                            <div className="form-group">
                                                <label>Street address 2
                                                </label>
                                                <input type="text" className="form-control" value={address2} placeholder="Apartment, suite, unite, etc." onChange={(event) => { setAddress2(event.target.value); }} />
                                            </div>

                                            {/* <div className="form-group">
                                            <label>CityArea
                                                <abbr className="required" title="required">*</abbr></label>
                                            <input type="text" className="form-control" value={cityArea} onChange={(event) => { setCityArea(event.target.value); }} required />
                                        </div> */}

                                            <div className="form-group">
                                                <label>Town / City
                                                    <abbr className="required" title="required">*</abbr></label>
                                                <input type="text" className="form-control" value={cityName} onChange={(event) => { setCityName(event.target.value); }} required />
                                            </div>


                                            <div className="select-custom">
                                                <label>State<span className="required">*</span></label>
                                                <select value={stateName} onChange={(event) => { setStateName(event.target.value); }} className="form-control">
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
                                                    <option value="Karnataka">Karnataka</option>
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
                                                <label>Pincode
                                                    <abbr className="required" title="required">*</abbr></label>
                                                <input type="text" className="form-control" value={pincode} onChange={(event) => { setPincode(event.target.value); }} required />
                                            </div>
                                            {saveAddressErrorMessage && <div style={{ color: "red", paddingBottom: 5 }}>Could not save Address, Please Check Your Pincode</div>}
                                            {errorMe && <div style={{ color: "red", paddingBottom: 5, marginBottom: 5 }}>{errorMe}</div>}
                                            <button type="submit" className="form-control" style={{ background: "black", color: "white", fontWeight: "bold", fontSize: "16px" }} >EDIT ADDRESS</button>
                                        </form>
                                    }
                                </li>
                            </ul>
                        </div>
                        <div className="CheckouttitleCloseBtn">

                            <button onClick={() => { setDeliveryAddressModalOpen(false); setCurrentId("") }}
                            >
                                X
                            </button>
                        </div>



                    </div>
                </div>}
            <Header />
            <main className="main main-test">
                <div className="container checkout-container">

                    <ul className="checkout-progress-bar d-flex justify-content-center flex-wrap">
                        <li>
                            <Link to='/cart' >Shopping Cart</Link>
                        </li>
                        <li className="active">
                            <Link to="/checkout" style={{ color: "rgb(243, 150, 85)" }} >Checkout</Link>
                        </li>
                        <li className="disabled">
                            <a >Order Complete</a>
                        </li>
                    </ul>

                    {/* {!isLoggedIn?
                
                :
                <div>
                   
                    <p style={{marginBottom:40}}>
                    Hello <strong className="text-dark">{localStorage.getItem("userName")}</strong> (not
                    <strong className="text-dark">{localStorage.getItem("userName")}</strong>?
                    <Link
                      to="/login"
                      style={{padding:0, color:"orangered",fontSize:10}}
                      className="btn  "
                    >
                      Log out
                    </Link>
                    )
                  </p>
                </div>
                } */}

                    <div style={{ marginBottom: 30, padding: 10 }} className="row">
                        {!isLoggedIn ?
                            <>
                                <div style={{ marginTop: 10 }} className='col-lg-7'>
                                    <div>

                                        <p style={{ marginBottom: 40, marginLeft: -8 }}>
                                            Continue as a guest? If you already registered
                                            <Link
                                                to="/login"
                                                style={{ padding: 0, color: "orangered", fontSize: 10 }}
                                                className="btn  "
                                            >
                                                Please login here
                                            </Link>
                                        </p>
                                        {isFirst ?
                                            <div className="col-lg-7" style={{ maxWidth: "100%", marginLeft: -16 }}>
                                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr" }} className="row">
                                                    <div style={{ maxWidth: "100%" }} className="col-md-4">
                                                        <div className="form-group">
                                                            <label>E-mail
                                                                <abbr className="required" title="required">*</abbr>
                                                            </label>
                                                            <input type="text" className="form-control" value={email} onChange={(event) => { setEmail(event.target.value); }} required />
                                                        </div>
                                                    </div>
                                                    <div style={{ maxWidth: "100%", paddingRight: 5 }} className="col-md-3">
                                                        <div className="form-group">
                                                            <label>Mobile
                                                                <abbr className="required" title="required">*</abbr>
                                                            </label>
                                                            <input type="text" className="form-control" value={mobile} onChange={(event) => { setMobile(event.target.value); }} required />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> : null}
                                    </div>
                                    {!isFirst ?
                                        <>
                                            <h3 style={{ marginLeft: -12, marginTop: 50 }} className="account-sub-title d-none d-md-block mb-1">
                                                <RiSecurePaymentFill style={{ fontSize: 37, color: "#d3d3d4", marginRight: "8px" }} ></RiSecurePaymentFill>Choose Payment Mode
                                            </h3>

                                            <div className="row ">

                                                <div style={{ maxWidth: "95%", display: "flex", color: "orangered", fontWeight: "bold", fontSize: 16, flex: "100%", boxShadow: '0 1px 1px 0 rgb(0 0 0 / 16%)', border: '2px solid #e7e7e7', paddingTop: 25, paddingBottom: 25, paddingLeft: 13, marginBottom: 30 }} className="address col-md-6 ">
                                                    <div>
                                                        <input type="radio" checked={lpayMethod === 'online'} name='selected' value='online' onChange={(e) => setLpayMethod(e.target.value)} style={{ accentColor: "orangered" }}></input>
                                                        <span style={{ paddingLeft: 8 }}>Pay Online</span>
                                                    </div>
                                                    <div style={{ paddingLeft: 30 }}>
                                                        <input type="radio" checked={lpayMethod === 'cod'} name='selected' value='cod' onChange={(e) => setLpayMethod(e.target.value)} style={{ accentColor: "orangered" }}></input>
                                                        <span style={{ paddingLeft: 8 }}>Cash On Delivery</span>
                                                    </div>
                                                </div>

                                            </div></> : null}

                                    {isFirst ?
                                        <>
                                            <div style={{ marginTop: 30 }} className="" id="address" role="tabpanel">
                                                <h3 style={{ marginLeft: -12 }} className="account-sub-title d-none d-md-block mb-1">
                                                    <i className="sicon-location-pin align-middle mr-3"></i>Enter Delivery Address here
                                                </h3>
                                                <div className="addresses-content">
                                                    <p style={{ marginLeft: -12 }} className="mb-4">
                                                        The following addresses will be used on the checkout page by
                                                        default.
                                                    </p>

                                                    <div className="col-lg-7" style={{ maxWidth: "100%", marginLeft: -17 }}>
                                                        <ul className="checkout-steps">
                                                            <li>
                                                                <h2 className="step-title">ADD ADDRESS</h2>
                                                                {saveAddressErrorMessage && <div style={{ color: "red", paddingBottom: 5 }}>Could not save Address, Please Check Your Pincode</div>}
                                                                <form id="checkout-form">
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label>First name
                                                                                    <abbr className="required" title="required">*</abbr>
                                                                                </label>
                                                                                <input type="text" className="form-control" value={firstName} onChange={(event) => { setFirstName(event.target.value); }} />
                                                                            </div>
                                                                        </div>

                                                                        <div className="col-md-6">
                                                                            <div className="form-group">
                                                                                <label>Last name
                                                                                    <abbr className="required" title="required">*</abbr></label>
                                                                                <input type="text" className="form-control" value={lastName} onChange={(event) => { setLastName(event.target.value); }} />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label>Phone <abbr className="required" title="required">*</abbr></label>
                                                                        <input type="tel" className="form-control" value={phone} onChange={(event) => { setPhone(event.target.value); }} />
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label>Hospital name/Clinic name</label>
                                                                        <input type="text" className="form-control" onChange={(event) => { setCompanyName(event.target.value); }} />
                                                                    </div>

                                                                    <div className="form-group mb-1 pb-2">
                                                                        <label>Street address 1
                                                                            <abbr className="required" title="required">*</abbr></label>
                                                                        <input type="text" className="form-control" value={address1} placeholder="House number and street name" onChange={(event) => { setAddress1(event.target.value); }} />
                                                                    </div>

                                                                    <div className="form-group">
                                                                        <label>Street address 2
                                                                        </label>
                                                                        <input type="text" className="form-control" value={address2} placeholder="Apartment, suite, unite, etc." onChange={(event) => { setAddress2(event.target.value); }} />
                                                                    </div>

                                                                    {/* <div className="form-group">
                                                                        <label>CityArea
                                                                            <abbr className="required" title="required">*</abbr></label>
                                                                        <input type="text" value={cityArea} className="form-control" onChange={(event) => { setCityArea(event.target.value); }} required />
                                                                    </div> */}

                                                                    <div className="form-group">
                                                                        <label>Town / City
                                                                            <abbr className="required" title="required">*</abbr></label>
                                                                        <input type="text" className="form-control" value={cityName} onChange={(event) => { setCityName(event.target.value); }} />
                                                                    </div>

                                                                    <div className="select-custom">
                                                                        <label>State<span className="required">*</span></label>
                                                                        <select value={stateName} onChange={(event) => { setStateName(event.target.value); }} className="form-control">
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
                                                                            <option value="Karnataka" >Karnataka</option>
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
                                                                        <label>Pincode
                                                                            <abbr className="required" title="required">*</abbr></label>
                                                                        <input type="text" value={pincode} className="form-control" onChange={(event) => { setPincode(event.target.value); }} />
                                                                    </div>
                                                                    {/* <button type="submit" className="form-control" style={{background:"black", color:"white", fontWeight:"bold", fontSize:"16px"}} >ADD ADDRESS</button> */}
                                                                </form>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>

                                            </div>
                                            <div style={{ marginBottom: 30 }} className="" id="address" role="tabpanel">
                                                <h3 style={{ marginLeft: -12 }} className="account-sub-title d-none d-md-block mb-1">
                                                    <i className="sicon-location-pin align-middle mr-3"></i>Billing Address
                                                </h3>
                                                <div className="addresses-content">

                                                    <p style={{ marginLeft: -12 }} className="mb-4">
                                                        <input style={{ marginLeft: 10, marginRight: 5, accentColor: "orangered" }} defaultChecked={checked} type="checkbox" onChange={({ target }) => setIsBillingLAddress(target.checked)} onClick={(e) => { setChecked(e.target.checked) }} ></input>
                                                        Check If your
                                                        BillingAddress is same as shipping address
                                                    </p>
                                                    {!checked ?
                                                        <div className="col-lg-7" style={{ maxWidth: "100%", marginLeft: -17 }}>
                                                            <ul className="checkout-steps">
                                                                <li>
                                                                    <h2 className="step-title" onClick={() => { setChecked(true) }}>ADD ADDRESS</h2>

                                                                    <form id="checkout-form">
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <div className="form-group">
                                                                                    <label>First name
                                                                                        <abbr className="required" title="required">*</abbr>
                                                                                    </label>
                                                                                    <input type="text" value={bfirstName} className="form-control" onChange={(event) => { setBFirstName(event.target.value); }} />
                                                                                </div>
                                                                            </div>

                                                                            <div className="col-md-6">
                                                                                <div className="form-group">
                                                                                    <label>Last name
                                                                                        <abbr className="required" title="required">*</abbr></label>
                                                                                    <input type="text" value={blastName} className="form-control" onChange={(event) => { setBLastName(event.target.value); }} />
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="form-group">
                                                                            <label>Phone <abbr className="required" title="required">*</abbr></label>
                                                                            <input type="tel" className="form-control" value={bphone} onChange={(event) => { setBPhone(event.target.value); }} />
                                                                        </div>

                                                                        <div className="form-group">
                                                                            <label>Hospital name/Clinic name</label>
                                                                            <input type="text" className="form-control" onChange={(event) => { setBCompanyName(event.target.value); }} />
                                                                        </div>

                                                                        <div className="form-group mb-1 pb-2">
                                                                            <label>Street address 1
                                                                                <abbr className="required" title="required">*</abbr></label>
                                                                            <input type="text" className="form-control" value={baddress1} placeholder="House number and street name" onChange={(event) => { setBAddress1(event.target.value); }} />
                                                                        </div>

                                                                        <div className="form-group">
                                                                            <label>Street address 2
                                                                            </label>
                                                                            <input type="text" className="form-control" value={baddress2} placeholder="Apartment, suite, unite, etc." onChange={(event) => { setBAddress2(event.target.value); }} />
                                                                        </div>

                                                                        {/* <div className="form-group">
                                                                            <label>CityArea
                                                                                <abbr className="required" title="required">*</abbr></label>
                                                                            <input type="text" className="form-control" value={bcityArea} onChange={(event) => { setBCityArea(event.target.value); }} required />
                                                                        </div> */}

                                                                        <div className="form-group">
                                                                            <label>Town / City
                                                                                <abbr className="required" title="required">*</abbr></label>
                                                                            <input type="text" className="form-control" value={bcityName} onChange={(event) => { setBCityName(event.target.value); }} />
                                                                        </div>


                                                                        <div className="select-custom">
                                                                            <label>State<span className="required">*</span></label>
                                                                            <select value={bstateName} onChange={(event) => { setBStateName(event.target.value); }} name="orderby" className="form-control">
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
                                                                                <option value="Karnataka" >Karnataka</option>
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
                                                                            <label>Pincode
                                                                                <abbr className="required" title="required">*</abbr></label>
                                                                            <input type="text" className="form-control" value={bpincode} onChange={(event) => { setBPincode(event.target.value); }} />
                                                                        </div>
                                                                        {/* <button type="submit" className="form-control" style={{background:"black", color:"white", fontWeight:"bold", fontSize:"16px"}} >ADD ADDRESS</button> */}
                                                                    </form>
                                                                </li>
                                                            </ul>
                                                        </div> : null
                                                    }

                                                </div>

                                            </div></> :
                                        <div style={{ marginBottom: 30 }} className="" id="address" role="tabpanel">
                                            <h3 style={{ marginLeft: -12 }} className="account-sub-title d-none d-md-block mb-1">
                                                <i className="sicon-location-pin align-middle mr-3"></i>Shipping Address
                                            </h3>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: '10px' }}>

                                                <div style={{ marginRight: 6, marginTop: 0 }} className="row saved-address">

                                                    <div style={{ maxWidth: "350px", flex: "100%", paddingTop: 15, paddingBottom: 0, paddingLeft: 15 }} className="address col-md-6 addressBox">
                                                        <div className="heading d-flex">

                                                            <h4 className="text-dark mb-0">
                                                                {cartData.shippingAddress.firstName}  {cartData.shippingAddress.lastName}
                                                            </h4>
                                                        </div>

                                                        <div className="address-box">
                                                            {cartData.shippingAddress.streetAddress1} {cartData.shippingAddress.streetAddress2}  <br /> ,{cartData.shippingAddress.city}{" "}
                                                            ,{cartData.shippingAddress.countryArea}  <br />,{cartData.shippingAddress.postalCode}{" "}<br />
                                                            phone number: {cartData.shippingAddress.phone}
                                                        </div>

                                                    </div>

                                                </div>


                                            </div>

                                            <button style={{ marginLeft: -10, cursor: "pointer" }} onClick={removeFirst} className='couponButton'>Change Address</button>
                                        </div>
                                    }
                                </div>
                            </>
                            :
                            <>
                                <div className='col-lg-7'>
                                    <div>

                                        <p style={{ marginBottom: 40, fontSize: 17 }}>
                                            Hello <strong className="text-dark">{localStorage.getItem("userName")}</strong>
                                            {/* (not
                                            <strong className="text-dark">{localStorage.getItem("userName")}</strong>?
                                            <Link
                                                to="/login"
                                                style={{ padding: 0, color: "orangered", fontSize: 10 }}
                                                className="btn  "
                                                onClick={logoutHandeler}
                                            >
                                                Log out
                                            </Link>
                                            ) */}
                                        </p>
                                    </div>
                                    {!isFirst ?
                                        <>
                                            <h3 style={{ marginLeft: -9 }} className="account-sub-title d-none d-md-block mb-1">
                                                <RiSecurePaymentFill style={{ fontSize: 37, color: "#d3d3d4", marginRight: "8px" }} ></RiSecurePaymentFill>Choose Payment Mode
                                            </h3>

                                            <div className="row ">

                                                <div style={{ maxWidth: "95%", display: "flex", color: "orangered", fontWeight: "bold", fontSize: 16, flex: "100%", boxShadow: '0 1px 1px 0 rgb(0 0 0 / 16%)', border: '2px solid #e7e7e7', paddingTop: 25, paddingBottom: 25, paddingLeft: 13, marginBottom: 30 }} className="address col-md-6 ">
                                                    <div>
                                                        <input type="radio" checked={payMethod === 'online'} name='selected' value='online' onChange={(e) => setpayMethod(e.target.value)} style={{ accentColor: "orangered" }}></input>
                                                        <span style={{ paddingLeft: 8 }}>Pay Online</span>
                                                    </div>
                                                    <div style={{ paddingLeft: 30 }}>
                                                        {isCodAvailable ?
                                                            <>
                                                                {codLimit >= cartData.totalPrice.gross.amount ?
                                                                    <input type="radio" checked={payMethod === 'cod'} name='selected' value='cod' onChange={(e) => setpayMethod(e.target.value)} style={{ accentColor: "orangered" }}></input> :
                                                                    <input type="radio" disabled checked={payMethod === 'cod'} name='selected' value='cod' onChange={(e) => setpayMethod(e.target.value)} style={{ accentColor: "orangered" }}></input>}</> :
                                                            <input type="radio" disabled checked={payMethod === 'cod'} name='selected' value='cod' onChange={(e) => setpayMethod(e.target.value)} style={{ accentColor: "orangered" }}></input>}
                                                        <span style={{ paddingLeft: 8 }}>Cash On Delivery</span>
                                                    </div>
                                                </div>

                                            </div></> : null}

                                    {isFirst ?
                                        <>
                                            <p className="mb-4">
                                                <input checked={isbillingAddress} style={{ marginLeft: 10, marginRight: 5, accentColor: "orangered" }} type="checkbox" onChange={({ target }) => setIsBillingAddress(target.checked)} onClick={(e) => { setChecked(e.target.checked); setBillingAddressActive(true) }}></input>
                                                Check If Billing Address Same as shipping Address
                                            </p>
                                            <div style={{ marginTop: 30 }} className="" id="address" role="tabpanel">
                                                <h3 className="account-sub-title  d-block mb-1">
                                                    <i className="sicon-location-pin align-middle mr-3"></i>Select Delivery Address
                                                </h3>
                                                <div className="addresses-content">
                                                    <p className="mb-4">
                                                        The following addresses will be used on the checkout page by
                                                        default.
                                                    </p>
                                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: '10px' }}>
                                                        {address.map((value, index) => (
                                                            <div style={{ marginRight: 6, marginTop: 0 }} className="row saved-address">

                                                                <div style={{ maxWidth: "350px", flex: "100%", paddingLeft: 35 }} className="address col-md-6 addressBox">
                                                                    <div className="heading d-flex">
                                                                        <input name="shippingAddress" id={index} value={index} checked={shippingAddress === String(index)} onClick={(event) => { setShippingAddressValue(event.target.value); setShippingAddressActive(true) }} onChange={updateShippingAddress} style={{ accentColor: "orangered", position: "absolute", top: 30, left: 11 }} type="radio" ></input>
                                                                        <h4 className="text-dark mb-0">
                                                                            {value.firstName} {value.lastName}
                                                                        </h4>
                                                                    </div>

                                                                    <div className="address-box">
                                                                        {value.streetAddress1} <br /> {value.city},{" "}
                                                                        {value.country.country}, {value.postalCode} <br />{" "}
                                                                        phone number: {value.phone}
                                                                    </div>

                                                                    <div className="row ">
                                                                        <div style={{ color: "orangered", cursor: "pointer", fontSize: 20 }}>
                                                                            <BiEdit onClick={editForm} id={value.id} />
                                                                        </div>
                                                                    </div>

                                                                </div>

                                                            </div>
                                                        ))}

                                                    </div>
                                                    <div className="row ">

                                                        <div onClick={() => { setCurrentId(""); setFirstName(""); setLastName(""); setPhone(""); setAddress1(""); setAddress2(""); setCityName(""); setStateName("Karnataka"); setPincode(""); setCompanyName(""); setSaveAddressErrorMessage(false); errorMessage(false); setDeliveryAddressModalOpen(true) }} style={{ maxWidth: "95%", color: "orangered", cursor: "pointer", fontWeight: "bold", fontSize: 20, flex: "100%" }} className="address col-md-6 addressBox">


                                                            + Add New Shipping Address

                                                        </div>

                                                    </div>
                                                </div>

                                            </div>
                                            <div style={{ marginBottom: 30 }} className="" id="address" role="tabpanel">
                                                {!checked && <><h3 className="account-sub-title  d-block mb-1">
                                                    <i className="sicon-location-pin align-middle mr-3"></i>Billing Address
                                                </h3><div className="addresses-content">

                                                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: '10px' }}>
                                                            {address.map((value, index) => (
                                                                <div style={{ marginRight: 6, marginTop: 0 }} className="row saved-address">

                                                                    <div style={{ maxWidth: "350px", flex: "100%", paddingLeft: 35 }} className="address col-md-6 addressBox">
                                                                        <div className="heading d-flex">
                                                                            <input name="billingAddress" id={index} onChange={updateBillingAddress} value={index} checked={billingAddress === String(index)} onClick={(event) => { setBillingAddressValue(event.target.value); setBillingAddressActive(true) }} style={{ accentColor: "orangered", position: "absolute", top: 30, left: 11 }} type="radio"></input>
                                                                            <h4 className="text-dark mb-0">
                                                                                {value.firstName} {value.lastName}
                                                                            </h4>
                                                                        </div>

                                                                        <div className="address-box">
                                                                            {value.streetAddress1} <br /> {value.city},{" "}
                                                                            {value.country.country}, {value.postalCode} <br />{" "}
                                                                            phone number: {value.phone}
                                                                        </div>

                                                                        <div className="row ">
                                                                            <div style={{ color: "orangered", cursor: "pointer", fontSize: 20 }}>
                                                                                <BiEdit onClick={editForm} id={value.id} />
                                                                            </div>
                                                                        </div>

                                                                    </div>

                                                                </div>
                                                            ))}

                                                        </div>

                                                        <div className="row ">

                                                            <div onClick={() => { setCurrentId(""); setFirstName(""); setLastName(""); setPhone(""); setAddress1(""); setAddress2(""); setCityName(""); setStateName("Karnataka"); setPincode(""); setCompanyName(""); setSaveAddressErrorMessage(false); errorMessage(false); setDeliveryAddressModalOpen(true) }} style={{ maxWidth: "95%", color: "orangered", cursor: "pointer", fontWeight: "bold", fontSize: 20, flex: "100%" }} className="address col-md-6 addressBox">


                                                                + Add New Billing Address

                                                            </div>

                                                        </div>

                                                    </div></>}

                                            </div></> :
                                        <div style={{ marginBottom: 30 }} className="" id="address" role="tabpanel">
                                            <h3 style={{ marginLeft: -12 }} className="account-sub-title d-none d-md-block mb-1">
                                                <i className="sicon-location-pin align-middle mr-3"></i>Shipping Address
                                            </h3>
                                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gridGap: '10px' }}>

                                                <div style={{ marginRight: 6, marginTop: 0 }} className="row saved-address">

                                                    <div style={{ maxWidth: "350px", flex: "100%", paddingTop: 15, paddingBottom: 0, paddingLeft: 15 }} className="address col-md-6 addressBox">
                                                        <div className="heading d-flex">

                                                            <h4 className="text-dark mb-0">
                                                                {cartData.shippingAddress.firstName}  {cartData.shippingAddress.lastName}
                                                            </h4>
                                                        </div>

                                                        <div className="address-box">
                                                            {cartData.shippingAddress.streetAddress1} {cartData.shippingAddress.streetAddress2}  <br /> ,{cartData.shippingAddress.city}{" "}
                                                            ,{cartData.shippingAddress.countryArea}  <br />,{cartData.shippingAddress.postalCode}{" "}<br />
                                                            phone number: {cartData.shippingAddress.phone}
                                                        </div>

                                                    </div>

                                                </div>


                                            </div>

                                            <button style={{ marginLeft: -10, cursor: "pointer" }} onClick={removeFirst} className='couponButton'>Change Address</button>
                                        </div>
                                    }
                                </div>
                            </>

                        }
                        {/* <!-- End .col-lg-8 --> */}

                        <div className="col-lg-5">
                            {/* {productNameOut?.length >0?<OutOfStock productName={productNameOut}/>:null} */}

                            <div className="order-summary">

                                <h2 >Product</h2>

                                {(cartItems?.checkout?.lines || cartProduct || []).map((cart, index) => (
                                    <div key={cart?.id || index} style={{ marginBottom: 20 }} className="product">
                                        <div className="product-details">
                                            <h6 style={{ marginBottom: 0 }} className="product-title">
                                                <Link to={{ pathname: `/product/${encodeURIComponent(cart.variant.product.slug)}` }}>{cart.variant.name}</Link>
                                            </h6>

                                            <span className="cart-product-info">
                                                <span className="cart-product-qty">{cart.quantity}</span> × {cart.variant.weightedShipping === null || cart.variant.weightedShipping === 0 ? <span className="new-price" style={{ paddingRight: 5 }}>₹{totalValue(cart.variant.pricing.price.net.amount)}</span> : <span className="new-price" style={{ paddingRight: 5 }}>₹{totalValue(cart.variant.pricing.price.net.amount - cart.variant.weightedShipping)}</span>} {cart.variant.originalPrice !== cart.variant.pricing.price.net.amount ? <span className="old-price">₹{cart.variant.weightedShipping === null || cart.variant.weightedShipping === 0 ? totalValue(cart.variant.originalPrice) : totalValue(cart.variant.originalPrice - cart.variant.weightedShipping)}</span> : null}

                                            </span>
                                            <span style={{ float: 'right' }}>₹{cart.variant.weightedShipping === null || cart.variant.weightedShipping === 0 ? totalValue(cart.variant.pricing.price.net.amount * cart.quantity) : totalValue((cart.variant.pricing.price.net.amount - cart.variant.weightedShipping) * cart.quantity)}</span>
                                        </div>
                                        {/* <!-- End .product-details -->                                             */}
                                    </div>
                                ))}
                                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 30, }}>
                                    <div>
                                        <BsTag style={{ fontSize: 25 }}></BsTag>
                                        <input className='couponInput' type="text" disabled={!!voucherCode} value={couponCode} onChange={(event) => { setCouponCode(event.target.value); setCouponCodeError(""); }} placeholder='Apply Coupons'></input>
                                    </div>

                                    {!voucherCode ?
                                        (!isLoggedIn ?
                                            <button onClick={applyLPromoCode} className='couponButton'>APPLY</button>
                                            : <button onClick={applyPromoCode} className='couponButton'>APPLY</button>)
                                        :
                                        (localStorage.getItem('dummycoupon') === null ?
                                            (!isLoggedIn ?
                                                <button onClick={unapplyLPromoCode} className='couponButton'>Remove</button>
                                                : <button onClick={unapplyPromoCode} className='couponButton'>Remove</button>)
                                            : null)
                                    }
                                </div>
                                {voucherCode !== null && voucherCode !== "" &&
                                    <div style={{ marginTop: 10 }}>
                                        <label>{voucherCode} coupon applied successfully</label>
                                    </div>
                                }
                                <span className='text-danger fw-600 mb-2 pt-2 d-block'>{couponCodeError}</span>
                                {/* <!-- End .cart-product --> */}
                                {/* <div className="dropdown-cart-subtotal" style={{paddingTop:'20px'}}>
                                        <span>SUBTOTAL:</span>

                                        <span className="cart-subtotal-price float-right">₹{cartData.totalPrice.net.amount}</span>
                                    </div> */}

                                <div className="discount price">
                                    <span>Total Saving:</span>

                                    <span className="cart-total-discount float-right">₹{totalValue((cartItems?.checkout?.lines || cartProduct || []).reduce((total, item) => total + (((item.variant.originalPrice || item.variant.pricing.priceUndiscounted?.net?.amount || item.variant.pricing.price.net.amount) - item.variant.pricing.price.net.amount) * item.quantity), 0))}</span>


                                </div>

                                {/* <div className="dropdown-cart-subtotal">
                                        <span>GST:</span>
                                        {cartData.length !== 0?
                                        <span className="cart-subtotal-price float-right">₹{cartData.totalPrice.tax.amount}</span>:
                                        <span className="cart-subtotal-price float-right">₹0</span>}
                                    </div> */}

                                <div className="dropdown-cart-subtotal">
                                    <span>Shipping:</span>
                                    {cartData?.totalPrice ?
                                        <span className="cart-subtotal-price float-right">₹{totalValue(cartData?.shippingPrice?.net?.amount || cartData?.shippingMethods?.[0]?.price?.amount || 0)}</span> :
                                        <span className="cart-subtotal-price float-right">₹0</span>}
                                </div>
                                <div className="discount price">
                                    <span>Weighted Delivery Charges:</span>
                                    <span className="cart-subtotal-price float-right">₹{totalValue((cartItems?.checkout?.lines || cartProduct || []).reduce((total, item) => total + ((item.variant.weightedShipping || 0) * item.quantity), 0))}</span>
                                </div>
                                {showPromoCodeDiscount !== 0 ? <div className="discount price">
                                    <span>PromoCode Discount</span>
                                    <span className="cart-subtotal-price float-right">₹{totalValue(showPromoCodeDiscount)}</span>
                                </div> : null}
                                {/* <!-- End .dropdown-cart-total --> */}


                                {/* <!-- End .dropdown-cart-total --> */}

                                <table className="table table-mini-cart">
                                    <thead>

                                    </thead>
                                    <tbody></tbody>
                                    <tfoot>



                                        <tr className="order-total">
                                            <td style={{ paddingLeft: 0, paddingTop: 30 }}>
                                                <h4>Grand Total</h4>
                                                <p style={{ fontSize: "1.2rem" }}>(inclusive of all taxes)</p>
                                            </td>
                                            <td style={{ paddingRight: 0, paddingTop: 0 }}>
                                                {cartData?.totalPrice ?
                                                    <b className="total-price"><span>₹{totalValue((cartData.totalPrice.gross.amount ?? 0) + ((cartData?.shippingPrice?.net?.amount === 0 ? cartData?.shippingMethods?.[0]?.price?.amount : 0) || 0))}</span></b> :
                                                    <b className="total-price"><span>₹0</span></b>}
                                            </td>
                                        </tr>
                                    </tfoot>

                                </table>





                                <div style={{ color: "red", paddingBottom: 5, paddingTop: 5, fontSize: 18 }}>{errorMe1}</div>
                                <div className="checkout-discount">
                                    {cartData?.totalPrice ?
                                        <>
                                            {!isLoggedIn ?
                                                <>
                                                    {isFirst ?
                                                        <>
                                                            <span><h4 style={{ color: "red", fontWeight: 600, marginBottom: 5, marginTop: 20, fontFamily: 'Open Sans' }}>Note: Shipping Charges, if any, will be added to the total amount on the next Step. Please Continue</h4></span>
                                                            <button style={{ position: "relative", height: 45 }} onClick={createLShipping} disabled={placeOrderButtonActive} type="submit" className="btn btn-dark btn-place-order" form="checkout-form">{continueToPlaceOrderLoader}</button></>
                                                        : <button style={{ position: "relative", height: 45 }} onClick={createLPayment} type="submit" className="btn btn-dark btn-place-order" form="checkout-form">{placeOrderLoader}</button>}
                                                </>
                                                :
                                                <>
                                                    {isFirst ?
                                                        <>
                                                            <span><h4 style={{ color: "red", fontWeight: 600, marginBottom: 5, marginTop: 20, fontFamily: 'Open Sans' }}>Note: Shipping Charges, if any, will be added to the total amount on the next Step. Please Continue</h4></span>
                                                            <button style={{ position: "relative", height: 45 }} onClick={createShipping} disabled={placeOrderButtonActive} type="submit" className="btn btn-dark btn-place-order" form="checkout-form">{continueToPlaceOrderLoader}</button></>
                                                        : <button style={{ position: "relative", height: 45 }} onClick={createPayment} type="submit" className="btn btn-dark btn-place-order" form="checkout-form">{placeOrderLoader}</button>}
                                                </>
                                            }
                                        </>
                                        : null}

                                </div>




                            </div>
                            {/* <!-- End .cart-summary --> */}
                        </div>
                        {/* <!-- End .col-lg-4 --> */}
                    </div>
                    {/* <!-- End .row --> */}

                    {/* <!-- End .container --> */}
                </div>
                {showGuestOtpModal && (
                    <div style={{
                        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
                        backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 10000,
                        display: "flex", alignItems: "center", justifyContent: "center", padding: "15px"
                    }}>
                        <div style={{
                            background: "white", padding: "30px 25px", borderRadius: "8px",
                            boxShadow: "0 4px 20px rgba(0,0,0,0.25)", width: "100%", maxWidth: "400px",
                            textAlign: "center", position: "relative"
                        }}>
                            <button
                                onClick={() => setShowGuestOtpModal(false)}
                                style={{
                                    position: "absolute", top: "12px", right: "12px", background: "none",
                                    border: "none", fontSize: "20px", cursor: "pointer", color: "#666"
                                }}
                                title="Cancel Verification"
                            >✕</button>

                            <h4 style={{ color: "#222", fontWeight: "700", marginBottom: "10px", fontSize: "19px", fontFamily: "Open Sans" }}>
                                Verify Mobile to Complete Order
                            </h4>

                            <p style={{ fontSize: "14px", color: "#555", marginBottom: "20px", lineHeight: "1.5" }}>
                                We sent a security OTP to <b>+91 {guestOtpPhone}</b> to verify your identity and protect against unauthorized orders.
                            </p>

                            <form onSubmit={handleVerifyGuestOtp} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        maxLength="6"
                                        value={guestOtpCode}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/[^0-9]/g, "");
                                            if (val.length <= 6) setGuestOtpCode(val);
                                        }}
                                        style={{
                                            width: "100%", padding: "12px", borderRadius: "5px",
                                            border: "1px solid #ccc", fontSize: "18px", textAlign: "center",
                                            letterSpacing: "4px", fontWeight: "bold"
                                        }}
                                        autoFocus
                                        required
                                    />
                                </div>

                                {guestOtpTimer > 0 ? (
                                    <p style={{ fontSize: "13px", color: "#666", margin: 0 }}>
                                        Code valid for <strong>{formatGuestTimer(guestOtpTimer)}</strong>
                                    </p>
                                ) : (
                                    <p style={{ fontSize: "13px", color: "#e03b24", margin: 0 }}>
                                        OTP expired.{' '}
                                        <span
                                            onClick={handleResendGuestOtp}
                                            style={{ color: "orangered", cursor: "pointer", textDecoration: "underline", fontWeight: "bold" }}
                                        >
                                            Resend OTP
                                        </span>
                                    </p>
                                )}

                                {guestOtpError && (
                                    <div style={{ color: "#e03b24", fontSize: "13px", margin: "5px 0", textAlign: "left" }}>
                                        {guestOtpError}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={guestOtpLoading || guestOtpCode.length !== 6 || guestOtpTimer === 0}
                                    style={{
                                        width: "100%", padding: "12px", background: (guestOtpCode.length === 6 && guestOtpTimer > 0 && !guestOtpLoading) ? "orangered" : "#ccc",
                                        color: "white", border: "none", borderRadius: "5px",
                                        fontSize: "15px", fontWeight: "bold", cursor: "pointer",
                                        transition: "background-color 0.2s"
                                    }}
                                >
                                    {guestOtpLoading ? "Verifying..." : "Verify & Place Order"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    )
}

export default CheckoutScreen
