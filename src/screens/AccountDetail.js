import React, { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useQuery, useMutation } from "@apollo/client/react";
import axios from "axios";
import { SAVED_ADDRESSES, SAVED_ORDERS } from "../GraphQL/Queries";
import { ACCOUNT_UPDATE_MUTATION, METADATA_UPDATE } from "../GraphQL/Mutation";
import {
  User,
  MapPin,
  Package,
  Heart,
  Gift,
  Settings,
  HelpCircle,
  LogOut,
  Stethoscope,
  Building2,
  ShieldCheck,
  Phone,
  Mail,
  ShoppingBag,
  ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import "./Dashboard.css";

const AccountDetail = ({
  fullName: propFullName,
  setFullName: propSetFullName,
  userType: propUserType,
  setUserType: propSetUserType,
  speciality: propSpeciality,
  setSpeciality: propSetSpeciality,
  gender: propGender,
  setGender: propSetGender,
  business: propBusiness,
  setBusiness: propSetBusiness,
  mobile: propMobile,
  setMobile: propSetMobile,
  kpmeNo: propKpmeNo,
  setKpmeNo: propSetKpmeNo,
  userEmail: propUserEmail,
  setUserEmail: propSetUserEmail,
  isEditing: propIsEditing,
  setIsEditing: propSetIsEditing,
  handleSaveProfile: propHandleSaveProfile,
  isEmbedded = false
}) => {
  const navigate = useNavigate();

  // Local state for profile fields
  const [localFullName, setLocalFullName] = useState(() => propFullName || localStorage.getItem("userName") || localStorage.getItem("user") || "Dr. Rajesh Sharma");
  const [localUserType, setLocalUserType] = useState(() => propUserType || localStorage.getItem("userType") || "Doctor");
  const [localSpeciality, setLocalSpeciality] = useState(() => propSpeciality || localStorage.getItem("speciality") || "General Physician");
  const [gender, setGender] = useState(() => propGender || localStorage.getItem("gender") || "Male");
  const [business, setBusiness] = useState(() => propBusiness || localStorage.getItem("business") || "City Healthcare Clinic");

  const [mobile, setMobile] = useState(() => propMobile || localStorage.getItem("userPhone") || "");
  const [mobileError, setMobileError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [kpmeNo, setKpmeNo] = useState(() => propKpmeNo || localStorage.getItem("kpmeNo") || "KA-KPME-48291");
  const [userEmail, setUserEmail] = useState(() => propUserEmail || localStorage.getItem("email") || localStorage.getItem("userEmail") || "");
  const [isEditing, setIsEditing] = useState(() => (propIsEditing !== undefined ? propIsEditing : false));

  React.useEffect(() => {
    if (propIsEditing !== undefined) {
      setIsEditing(propIsEditing);
    }
  }, [propIsEditing]);

  // Logout Handler
  const logoutHandeler = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");
    localStorage.removeItem("loginByOtp");
    localStorage.removeItem("dummyemail");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("user");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("recentData");
    localStorage.removeItem("wishlistToken");
    localStorage.removeItem("tempEmail");
    localStorage.removeItem("cartToken");
    localStorage.removeItem("rzp_checkout_anon_id");
    localStorage.removeItem("rzp_device_id");

    window.dispatchEvent(new Event("loginStatusChanged"));
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  // GraphQL Mutations
  const [accountUpdateM] = useMutation(ACCOUNT_UPDATE_MUTATION, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
  });

  const [updateMetadataM] = useMutation(METADATA_UPDATE, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
  });

  // Queries for live metrics
  const { data: ordersData } = useQuery(SAVED_ORDERS, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
    fetchPolicy: "cache-and-network"
  });

  const { data: addressData } = useQuery(SAVED_ADDRESSES, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
    fetchPolicy: "cache-and-network"
  });

  // Populate state reactively from database (addressData.me and metadata)
  React.useEffect(() => {
    if (addressData?.me) {
      const me = addressData.me;
      const meta = {};
      if (Array.isArray(me.metadata)) {
        me.metadata.forEach((item) => {
          if (item?.key) meta[item.key] = item.value;
        });
      }
      console.log("[AccountDetail] Loaded user profile & metadata from database:", {
        email: me.email,
        firstName: me.firstName,
        lastName: me.lastName,
        metadata: meta
      });

      const fullName = [me.firstName, me.lastName].filter(Boolean).join(" ");
      if (fullName) {
        setLocalFullName(fullName);
        localStorage.setItem("userName", fullName);
        localStorage.setItem("user", fullName);
      }
      if (me.email) {
        setUserEmail(me.email);
        localStorage.setItem("email", me.email);
        localStorage.setItem("userEmail", me.email);
      }
      if (meta.userType) {
        setLocalUserType(meta.userType);
        localStorage.setItem("userType", meta.userType);
      }
      if (meta.speciality) {
        setLocalSpeciality(meta.speciality);
        localStorage.setItem("speciality", meta.speciality);
      }
      if (meta.gender) {
        setGender(meta.gender);
        localStorage.setItem("gender", meta.gender);
      }
      const biz = meta.business || meta.clinic;
      if (biz) {
        setBusiness(biz);
        localStorage.setItem("business", biz);
      }
      if (meta.kpmeNo) {
        setKpmeNo(meta.kpmeNo);
        localStorage.setItem("kpmeNo", meta.kpmeNo);
      }
      const ph = meta.mobile || meta.mobileNo;
      if (ph) {
        setMobile(ph);
        localStorage.setItem("userPhone", ph);
      }
    }
  }, [addressData]);

  // Local fallback saved addresses
  const getLocalAddresses = () => {
    try {
      const raw = localStorage.getItem("savedAddresses");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("[AccountDetail] Failed to parse savedAddresses:", e);
    }
    return [];
  };

  const getWishlistCount = () => {
    try {
      const raw = localStorage.getItem("wishlist");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed.length;
      }
    } catch (e) {
      console.warn("[AccountDetail] Failed to parse wishlist:", e);
    }
    return 0;
  };

  // Profile completion calculation
  const filledFieldsCount = [
    localFullName,
    localSpeciality,
    business,
    kpmeNo,
    localUserType,
    gender,
    mobile,
    userEmail
  ].filter(val => val && String(val).trim().length > 0).length;
  const profileCompletion = Math.round((filledFieldsCount / 8) * 100);

  // Live Metrics calculations
  const totalOrders = ordersData?.me?.orders?.totalCount ?? (ordersData?.me?.orders?.edges?.length || 0);
  const backendAddresses = addressData?.me?.addresses || [];
  const totalAddresses = backendAddresses.length > 0 ? backendAddresses.length : getLocalAddresses().length;
  const totalWishlist = getWishlistCount();

  const rewardPoints = useMemo(() => {
    const stored = localStorage.getItem("rewardPoints");
    if (stored !== null && !isNaN(Number(stored))) {
      return Number(stored);
    }
    return totalOrders * 50;
  }, [totalOrders]);

  const onSave = (e) => {
    if (e) e.preventDefault();

    const mobileIsValid = /^[0-9]{10}$/.test(mobile.trim());
    const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim());

    if (!mobileIsValid) {
      setMobileError("Mobile number should be 10 digits.");
      toast.error("Please enter a valid 10-digit mobile number", {
        className: "hk-toast validation-toast",
      });
      return;
    }

    if (!emailIsValid) {
      setEmailError("Please enter a valid email address.");
      toast.error("Please enter a valid email address", {
        className: "hk-toast validation-toast",
      });
      return;
    }

    setMobileError("");
    setEmailError("");
    console.log("[AccountDetail] Saving profile changes:", {
      localFullName,
      localUserType,
      localSpeciality,
      gender,
      business,
      mobile,
      kpmeNo,
      userEmail
    });

    localStorage.setItem("userName", localFullName);
    localStorage.setItem("user", localFullName);
    localStorage.setItem("userType", localUserType);
    localStorage.setItem("speciality", localSpeciality);
    localStorage.setItem("gender", gender);
    localStorage.setItem("business", business);
    localStorage.setItem("userPhone", mobile);
    localStorage.setItem("kpmeNo", kpmeNo);
    localStorage.setItem("email", userEmail);
    localStorage.setItem("userEmail", userEmail);

    const token = localStorage.getItem("token");
    if (token) {
      const parts = localFullName.trim().split(" ");
      const firstName = parts[0] || localFullName;
      const lastName = parts.slice(1).join(" ") || "";

      // 1. Update basic account fields in Saleor
      accountUpdateM({
        variables: { input: { firstName, lastName } }
      })
        .then((res) => console.log("[AccountDetail] Saleor accountUpdate response:", res))
        .catch((err) => console.warn("[AccountDetail] Account update mutation error:", err));

      // 2. Update user metadata in Saleor database (persists in dev_hegma account_user.metadata)
      if (addressData?.me?.id) {
        const metadataInput = [
          { key: "userType", value: String(localUserType || "") },
          { key: "speciality", value: String(localSpeciality || "") },
          { key: "gender", value: String(gender || "") },
          { key: "business", value: String(business || "") },
          { key: "kpmeNo", value: String(kpmeNo || "") },
          { key: "mobile", value: String(mobile || "") }
        ];
        console.log("[AccountDetail] Saving metadata to database via GraphQL updateMetadata:", {
          id: addressData.me.id,
          input: metadataInput
        });
        updateMetadataM({
          variables: {
            id: addressData.me.id,
            input: metadataInput
          }
        })
          .then((res) => console.log("[AccountDetail] updateMetadata persisted to database successfully:", res))
          .catch((err) => console.error("[AccountDetail] updateMetadata database error:", err));
      }

      // 3. Update database via Microservice REST API (updates account_user.mobile_no and metadata)
      const restApiUrl = process.env.REACT_APP_REST_API_URL || window.location.origin;
      axios.post(`${restApiUrl}/api/v1/updateUserDetails`, {
        token: token,
        email: userEmail,
        mobile: mobile,
        first_name: firstName,
        last_name: lastName,
        metadata: {
          userType: localUserType,
          speciality: localSpeciality,
          gender: gender,
          business: business,
          kpmeNo: kpmeNo,
          mobile: mobile
        }
      })
        .then((res) => console.log("[AccountDetail] REST updateUserDetails database result:", res.data))
        .catch((err) => console.warn("[AccountDetail] REST updateUserDetails call error:", err));
    }

    window.dispatchEvent(new Event("loginStatusChanged"));
    window.dispatchEvent(new Event("storage"));
    setIsEditing(false);
    if (propSetIsEditing) propSetIsEditing(false);
    console.log("[AccountDetail] Profile saved successfully, blocked fields again (isEditing: false).");
    toast.success("Profile Information updated successfully!");
  };


  console.log("[AccountDetail] Loaded account details view for:", localFullName, {
    totalOrders,
    rewardPoints,
    totalWishlist,
    totalAddresses,
    profileCompletion
  });

  const cardContent = (
    <div className="bg-[#FFFFFF] rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-sm animate-in fade-in duration-200">
      <div className="mb-4">
        <h1 className="text-[22px] font-bold text-slate-900 m-0">
          Profile Information
        </h1>
        <p className="text-[13px] text-slate-500 mt-1 mb-0">
          Update your personal information
        </p>
      </div>

      <form onSubmit={onSave} noValidate>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">

          {/* Row 1: Full Name & Type */}
          <div className="flex items-center gap-2">
            <label className="dashboard-profile-label text-[15px] font-medium text-slate-900 w-[90px] shrink-0">
              Full Name
            </label>
            <div className={`dashboard-input-wrapper w-[200px] flex items-center gap-2.5 px-3 py-2 border rounded-xl transition-all ${isEditing
              ? "border-slate-200 bg-white focus-within:border-blue-500 shadow-xs"
              : "border-slate-200/80 bg-slate-50/80 text-slate-500 cursor-not-allowed"
              }`}>
              <User size={15} className={isEditing ? "text-slate-900 shrink-0" : "text-slate-400/60 shrink-0"} />
              <input
                type="text"
                value={localFullName}
                disabled={!isEditing}
                onChange={(e) => setLocalFullName(e.target.value)}
                placeholder=""
                className={`w-full text-[15px] bg-transparent outline-none border-0 p-0 focus:ring-0 ${isEditing ? "text-slate-700" : "text-slate-500 cursor-not-allowed"
                  }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="dashboard-profile-label text-[15px] font-medium text-slate-900 w-[68px] shrink-0">
              Type
            </label>
            <div className={`dashboard-input-wrapper w-[300px] flex items-center gap-2.5 px-3 py-2 border rounded-xl transition-all ${isEditing
              ? "border-slate-200 bg-white focus-within:border-blue-500 shadow-xs"
              : "border-slate-200/80 bg-slate-50/80 text-slate-500 cursor-not-allowed"
              }`}>
              <Stethoscope size={15} className={isEditing ? "text-slate-900 shrink-0" : "text-slate-400/60 shrink-0"} />
              <select
                type="text"
                value={localUserType}
                disabled={!isEditing}
                onChange={(e) => setLocalUserType(e.target.value)}
                placeholder=""
                className={`w-full text-[13px] bg-transparent outline-none border-0 p-0 focus:ring-0 ${isEditing ? "text-slate-700" : "text-slate-500 cursor-not-allowed"
                  }`}
              >
                <option value="">Select Type</option>
                <option value="Dentist">Dentist</option>
                <option value="Dental Clinic">Dental Clinic</option>
                <option value="Dental Lab">Dental Lab</option>
                <option value="Hospital">Hospital</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Row 2: Speciality & Gender */}
          <div className="flex items-center gap-2">
            <label className="dashboard-profile-label text-[15px] font-medium text-slate-900 w-[90px] shrink-0">
              Speciality
            </label>
            <div className={`dashboard-input-wrapper w-[200px] flex items-center gap-2.5 px-3 py-2 border rounded-xl transition-all ${isEditing
              ? "border-slate-200 bg-white focus-within:border-blue-500 shadow-xs"
              : "border-slate-200/80 bg-slate-50/80 text-slate-500 cursor-not-allowed"
              }`}>
              <Stethoscope size={15} className={isEditing ? "text-slate-900 shrink-0" : "text-slate-400/60 shrink-0"} />
              <input
                type="text"
                value={localSpeciality}
                disabled={!isEditing}
                onChange={(e) => setLocalSpeciality(e.target.value)}
                placeholder=""
                className={`w-full text-[13px] bg-transparent outline-none border-0 p-0 focus:ring-0 ${isEditing ? "text-slate-700" : "text-slate-500 cursor-not-allowed"
                  }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="dashboard-profile-label text-[15px] font-medium text-slate-900 w-[68px] shrink-0">
              Gender
            </label>
            <div
              className={`dashboard-input-wrapper w-[200px] flex items-center gap-2.5 px-3 py-2 border rounded-xl transition-all ${isEditing
                  ? "border-slate-200 bg-white focus-within:border-blue-500 shadow-xs"
                  : "border-slate-200/80 bg-slate-50/80 text-slate-500 cursor-not-allowed"
                }`}
            >
              <User
                size={15}
                className={
                  isEditing
                    ? "text-slate-900 shrink-0"
                    : "text-slate-400/60 shrink-0"
                }
              />

              <div className="relative flex-1">
                <select
                  value={gender}
                  disabled={!isEditing}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full appearance-none text-[13px] bg-transparent outline-none border-0 p-0 pr-6 focus:ring-0 ${isEditing
                      ? "text-slate-500 cursor-pointer"
                      : "text-slate-500 cursor-not-allowed"
                    }`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>

                <ChevronDown
                  size={16}
                  strokeWidth={2.5}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-900 pointer-events-none"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Clinic & Mobile */}
          <div className="flex items-center gap-2">
            <label className="dashboard-profile-label text-[15px] font-medium text-slate-900 w-[90px] shrink-0">
              Clinic
            </label>
            <div className={`dashboard-input-wrapper w-[200px] flex items-center gap-2.5 px-3 py-2 border rounded-xl transition-all ${isEditing
              ? "border-slate-200 bg-white focus-within:border-blue-500 shadow-xs"
              : "border-slate-200/80 bg-slate-50/80 text-slate-500 cursor-not-allowed"
              }`}>
              <Building2 size={15} className={isEditing ? "text-slate-900 shrink-0" : "text-slate-400/60 shrink-0"} />
              <input
                type="text"
                value={business}
                disabled={!isEditing}
                onChange={(e) => setBusiness(e.target.value)}
                placeholder=""
                className={`w-full text-[13px] bg-transparent outline-none border-0 p-0 focus:ring-0 ${isEditing ? "text-slate-800" : "text-slate-500 cursor-not-allowed"
                  }`}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <label className="dashboard-profile-label text-[15px] font-medium text-slate-00 w-[68px] shrink-0">
              Mobile <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-col w-[300px]">
              <div
                className={`dashboard-input-wrapper w-full flex items-center gap-2.5 px-3 py-2 border rounded-xl transition-all ${isEditing
                    ? mobileError
                      ? "border-red-400 bg-white focus-within:border-red-500 shadow-xs"
                      : "border-slate-200 bg-white focus-within:border-blue-500 shadow-xs"
                    : "border-slate-200/80 bg-slate-50/80 text-slate-500 cursor-not-allowed"
                  }`}
              >
                <Phone
                  size={15}
                  className={
                    isEditing
                      ? "text-slate-900 shrink-0"
                      : "text-slate-400/60 shrink-0"
                  }
                />

                <input
                  type="tel"
                  value={mobile}
                  disabled={!isEditing}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setMobile(value);

                    if (value.length === 10) {
                      setMobileError("");
                    }
                  }}
                  onBlur={() => {
                    if (mobile.length !== 10) {
                      setMobileError("Mobile number should be 10 digits.");
                      toast.error("Please enter a valid 10-digit mobile number", {
                        className: "hk-toast validation-toast",
                      });
                    } else {
                      setMobileError("");
                    }
                  }}
                  maxLength={10}
                  inputMode="numeric"
                  placeholder=""
                  className={`w-full text-[13px] bg-transparent outline-none border-0 p-0 focus:ring-0 ${isEditing
                      ? "text-slate-800"
                      : "text-slate-500 cursor-not-allowed"
                    }`}
                />
              </div>

              {mobileError && isEditing && (
                <p className="text-red-500 text-[11px] mt-1">
                  {mobileError}
                </p>
              )}
            </div>
          </div>

          {/* Row 4: KPME Reg No & Email ID */}
          <div className="flex items-center gap-2">
            <label className="dashboard-profile-label text-[15px] font-medium text-slate-900 w-[90px] shrink-0">
              KPME Reg
            </label>
            <div className={`dashboard-input-wrapper w-[200px] flex items-center gap-2.5 px-3 py-2 border rounded-xl transition-all ${isEditing
              ? "border-slate-200 bg-white focus-within:border-blue-500 shadow-xs"
              : "border-slate-200/80 bg-slate-50/80 text-slate-500 cursor-not-allowed"
              }`}>
              <ShieldCheck size={15} className={isEditing ? "text-slate-900 shrink-0" : "text-slate-400/60 shrink-0"} />
              <input
                type="text"
                value={kpmeNo}
                disabled={!isEditing}
                onChange={(e) => setKpmeNo(e.target.value)}
                placeholder=""
                className={`w-full text-[13px] bg-transparent outline-none border-0 p-0 focus:ring-0 font-medium ${isEditing ? "text-slate-600" : "text-slate-500 cursor-not-allowed"
                  }`}
              />
            </div>
          </div>

          <div className="flex items-start gap-2">
            <label className="dashboard-profile-label text-[15px] font-medium text-slate-900 w-[68px] shrink-0 pt-2 ml-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div>
              <div className={`dashboard-input-wrapper w-[300px] -ml-2 flex items-center gap-2.5 px-3 py-2 border rounded-xl transition-all ${isEditing
                ? emailError
                  ? "border-red-400 bg-white focus-within:border-red-500 shadow-xs"
                  : "border-slate-200 bg-white focus-within:border-blue-500 shadow-xs"
                : "border-slate-200/80 bg-slate-50/80 text-slate-500 cursor-not-allowed"
                }`}>
                <Mail size={15} className={isEditing ? "text-slate-900 shrink-0" : "text-slate-400/60 shrink-0"} />
                <input
                  type="email"
                  value={userEmail}
                  disabled={!isEditing}
                  onChange={(e) => {
                    const value = e.target.value;
                    setUserEmail(value);
                    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
                      setEmailError("");
                    }
                  }}
                  onBlur={() => {
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail.trim())) {
                      setEmailError("Please enter a valid email address.");
                      toast.error("Please enter a valid email address", {
                        className: "hk-toast validation-toast",
                      });
                    } else {
                      setEmailError("");
                    }
                  }}
                  placeholder=""
                  className={`w-full text-[13px]  bg-transparent outline-none border-0 p-0 focus:ring-0 ${isEditing ? "text-slate-800" : "text-slate-500 cursor-not-allowed "
                    }`}
                />
              </div>
              {emailError && isEditing && (
                <p className="text-red-500 text-[11px] mt-1 mb-0">
                  {emailError}
                </p>
              )}
            </div>
          </div>

        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-between mt-4 -mb-12 mr-5">
          <button
            type="button"
            onClick={() => {
              const nextState = !isEditing;
              console.log("[AccountDetail] Edit button clicked! Transitioning isEditing from", isEditing, "to", nextState);
              setIsEditing(nextState);
              if (propSetIsEditing) propSetIsEditing(nextState);
            }}
            className={`px-7 py-2.5 border rounded-xl font-medium text-[13px] transition-all cursor-pointer ${isEditing
              ? "border-amber-300 bg-amber-50 text-amber-700 hover:bg-amber-100 active:scale-95"
              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50 active:scale-95"
              }`}
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>

          <button
            type="submit"
            disabled={!isEditing}
            className={`px-8 py-2.5 font-semibold text-[13px] rounded-xl shadow-xs transition-all border-0 ${isEditing
              ? "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white cursor-pointer"
              : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }`}
          >
            Save Changes
          </button>
        </div>
      </form >
    </div >
  );

  if (isEmbedded) {
    return cardContent;
  }

  return (
    <>
      <Helmet>
        <title>Hegmakart: Profile Information</title>
        <meta name="description" content="Update your personal and clinical account information" />
      </Helmet>

      <Header />

      <main className="bg-[#F4F6F8] pb-6 pt-6 " style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>
        <div className="max-w-[1340px] mx-auto px-4 sm:px-6">

          <div className="flex flex-col lg:flex-row gap-6 items-start">

            {/* Left Sidebar Card */}
            <aside className="dashboard-sidebar w-full lg:w-[250px]  shrink-0 bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
              <div>
                {/* User Header */}
                <div className="flex items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                    <User size={30} strokeWidth={2.2} />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-[16px] font-bold text-slate-900 leading-tight m-0 truncate">
                      {localFullName || "Dr. Rajesh Sharma"}
                    </h2>
                    <p className="text-[12px] text-slate-500 font-normal leading-tight m-0 mt-0.5">
                      Healthcare<br />Professional
                    </p>
                  </div>
                </div>

                {/* Profile Completion Bar */}
                <div className="mt-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-slate-500 font-medium">Profile Completion</span>
                    <span className="text-blue-600 font-bold">{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    />
                  </div>
                </div>

                {/* Vertical Navigation Menu */}
                <nav className="mt-2 flex flex-col gap-1 border-t border-slate-100 pt-3">
                  {/* Profile Information: Active on this page */}
                  <Link
                    to="/account-detail"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-[13.5px] transition-all border-0 text-blue-600 bg-blue-50/80 no-underline w-full"
                  >
                    <User size={18} strokeWidth={2.3} />
                    <span>Profile Information</span>
                  </Link>

                  <Link
                    to="/Dashboard?tab=addresses"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent no-underline w-full"
                  >
                    <MapPin size={18} strokeWidth={1.8} />
                    <span>Manage Addresses</span>
                  </Link>

                  <Link
                    to="/Dashboard?tab=orders"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent no-underline w-full"
                  >
                    <Package size={18} strokeWidth={1.8} />
                    <span>My Orders</span>
                  </Link>

                  <Link
                    to="/Dashboard?tab=wishlist"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent no-underline w-full"
                  >
                    <Heart size={18} strokeWidth={1.8} />
                    <span>Wishlist</span>
                  </Link>

                  <Link
                    to="/Dashboard?tab=rewards"
                    className="hidden flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent no-underline w-full"
                  >
                    <Gift size={18} strokeWidth={1.8} />
                    <span>Rewards &amp; Offers</span>
                  </Link>

                  <Link
                    to="/Dashboard?tab=settings"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent no-underline w-full"
                  >
                    <Settings size={18} strokeWidth={1.8} />
                    <span>Change Password</span>
                  </Link>

                  <Link
                    to="/Dashboard?tab=help"
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent no-underline w-full"
                  >
                    <HelpCircle size={18} strokeWidth={1.8} />
                    <span>Help &amp; Support</span>
                  </Link>
                  <button
                    type="button"
                    onClick={logoutHandeler}
                    className="flex items-center gap-3 px-3.5 py-2 rounded-xl font-medium text-[13.5px] text-red-500 hover:bg-red-50 transition-colors bg-transparent border-0 cursor-pointer text-left w-full "
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </nav>
              </div>

              {/* Logout Button */}
              <div className="pt-3 border-t border-slate-100 mt-4">

              </div>

            </aside>

            {/* Right Main Content Area */}
            <div className="flex-1 min-w-0 flex flex-col gap-6">

              {cardContent}

              {/* Bottom Metrics / Stats Strip Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-100">

                {/* Metric 1: Total Orders */}
                <div className="flex items-center gap-3.5 pr-0 sm:pr-4 py-2 sm:py-0">
                  <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <ShoppingBag size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-500">
                      Total Orders
                    </span>
                    <span className="block text-[20px] font-bold text-slate-900 leading-tight">
                      {totalOrders}
                    </span>
                    <Link
                      to="/Dashboard?tab=orders"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline mt-0.5 no-underline"
                    >
                      View all orders &rarr;
                    </Link>
                  </div>
                </div>

                {/* Metric 2: Rewards Points */}
                <div className="flex items-center gap-3.5 px-0 sm:px-4 py-2 sm:py-0">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Gift size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-500">
                      Rewards Points
                    </span>
                    <span className="block text-[20px] font-bold text-slate-900 leading-tight">
                      {rewardPoints.toLocaleString()}
                    </span>
                    <Link
                      to="/Dashboard?tab=rewards"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline mt-0.5 no-underline"
                    >
                      View rewards &rarr;
                    </Link>
                  </div>
                </div>

                {/* Metric 3: Wishlist Items */}
                <div className="flex items-center gap-3.5 px-0 sm:px-4 py-2 sm:py-0">
                  <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                    <Heart size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-500">
                      Wishlist Items
                    </span>
                    <span className="block text-[20px] font-bold text-slate-900 leading-tight">
                      {totalWishlist}
                    </span>
                    <Link
                      to="/Dashboard?tab=wishlist"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:underline mt-0.5 no-underline"
                    >
                      View wishlist &rarr;
                    </Link>
                  </div>
                </div>

                {/* Metric 4: Saved Addresses */}
                <div className="flex items-center gap-3.5 pl-0 sm:pl-4 py-2 sm:py-0">
                  <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} strokeWidth={2} />
                  </div>
                  <div>
                    <span className="block text-[11px] font-medium text-slate-500">
                      Saved Addresses
                    </span>
                    <span className="block text-[20px] font-bold text-slate-900 leading-tight">
                      {totalAddresses}
                    </span>
                    <Link
                      to="/Dashboard?tab=addresses"
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:underline mt-0.5 no-underline"
                    >
                      Manage addresses &rarr;
                    </Link>
                  </div>
                </div>

              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
};

export default AccountDetail;