import React, { useEffect, useState, useMemo } from "react";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { SAVED_ADDRESSES, SAVED_ORDERS, GET_PRODUCT_LIST } from "../GraphQL/Queries";
import { useQuery, useMutation } from "@apollo/client/react";
import axios from "axios";
import {
  CREATE_ADDRESS_MUTATION,
  UPDATE_ADDRESS_MUTATION,
  ACCOUNT_ADDRESS_DELETE,
  ACCOUNT_SET_DEFAULT_ADDRESS,
  PASSWORD_CHANGE_MUTATION,
  CREATE_CHECKOUT_MUTATION,
  CHECKOUT_ADD_PRODUCT_LINE_MUTATION,
  ACCOUNT_UPDATE_MUTATION,
  METADATA_UPDATE
} from "../GraphQL/Mutation";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { totalValue } from "./decimalFunction";
import ProductCard from "../components/Catalog/ProductCard";
import AccountDetail from "./AccountDetail";
import "./Dashboard.css";
import {
  User,
  MapPin,
  Package,
  Heart,
  Gift,
  Settings,
  HelpCircle,
  LogOut,
  Eye,
  EyeOff,
  Phone,
  Mail,
  ShoppingBag,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Lock,
  MessageCircle,
  X,
  Bell,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  ShoppingCart,
  CircleUser,
  Check,
  Search,
  Filter
} from "lucide-react";

export default function DashboardScreen() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: addresses, orders, wishlist, rewards, returns, settings, help
  const tabFromUrl = searchParams.get("tab") || "addresses";
  const [activeTab, setActiveTab] = useState(tabFromUrl === "profile" ? "addresses" : tabFromUrl);

  // Mobile View Dropdown Accordion State (all options drop down inline without new window)
  const [openMobileDropdown, setOpenMobileDropdown] = useState(() => {
    const t = searchParams.get("tab");
    return t && t !== "profile" ? t : null;
  });

  useEffect(() => {
    const t = searchParams.get("tab");
    if (t === "profile") {
      navigate("/account-detail");
    } else if (t) {
      setActiveTab(t);
      setOpenMobileDropdown(t);
      setTimeout(() => {
        const el = document.getElementById(`mobile-menu-${t}`);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 150);
    }
  }, [searchParams, navigate]);

  const switchTab = (tabKey) => {
    setActiveTab(tabKey);
    setSearchParams({ tab: tabKey });
    setWishToken(getParsedWishlist());
    if (typeof refetchAddresses === "function") refetchAddresses();
    if (typeof refetchOrders === "function") refetchOrders();
  };

  // User display name from storage
  const userName = localStorage.getItem("userName") || localStorage.getItem("user") || "Dr. Hemanth";

  const [mobileProfileEditing, setMobileProfileEditing] = useState(false);

  console.log("[DashboardScreen] Mobile Profile Edit Mode:", mobileProfileEditing ? "UNBLOCKED (Editable)" : "BLOCKED (Read-only)");

  const toggleMobileDropdown = (key) => {
    console.log("[Dashboard Mobile] Toggling dropdown for:", key, "Previous state:", openMobileDropdown);
    setOpenMobileDropdown((prev) => {
      const next = prev === key ? null : key;
      console.log("[Dashboard Mobile] New open dropdown is:", next);
      return next;
    });
  };

  // Mobile Profile Form fields (matching Image 3)
  const [mobFullName, setMobFullName] = useState(() => localStorage.getItem("userName") || localStorage.getItem("user") || "");
  const [mobUserType, setMobUserType] = useState(() => localStorage.getItem("userType") || "Doctor");
  const [mobSpeciality, setMobSpeciality] = useState(() => localStorage.getItem("speciality") || "Dental Surgeon");
  const [mobGender, setMobGender] = useState(() => localStorage.getItem("gender") || "Male");
  const [mobBusiness, setMobBusiness] = useState(() => localStorage.getItem("business") || "");
  const [mobMobile, setMobMobile] = useState(() => localStorage.getItem("userPhone") || "");
  const [mobKpmeNo, setMobKpmeNo] = useState(() => localStorage.getItem("kpmeNo") || "");
  const [mobEmail, setMobEmail] = useState(() => localStorage.getItem("email") || localStorage.getItem("userEmail") || "");

  // Address Modal / Form state
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addrFirstName, setAddrFirstName] = useState("");
  const [addrLastName, setAddrLastName] = useState("");
  const [addrPhone, setAddrPhone] = useState("");
  const [addrCompany, setAddrCompany] = useState("");
  const [addrStreet1, setAddrStreet1] = useState("");
  const [addrStreet2, setAddrStreet2] = useState("");
  const [addrCity, setAddrCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [addrPincode, setAddrPincode] = useState("");

  // Settings / Password state
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Orders Tab Filter & Search state (My Orders screen layout)
  const [selectedOrderTab, setSelectedOrderTab] = useState("all");
  const [orderSearchQuery, setOrderSearchQuery] = useState("");
  const [orderFilterOpen, setOrderFilterOpen] = useState(false);
  const [orderSortBy, setOrderSortBy] = useState("newest");

  // Reorder loading state
  const [reorderLoadingId, setReorderLoadingId] = useState(null);

  // Wishlist Token items helper & reactive state
  const getParsedWishlist = () => {
    try {
      const rawWishlist = localStorage.getItem("wishlistToken");
      if (rawWishlist) {
        const parsed = JSON.parse(rawWishlist);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("[DashboardScreen] Failed to parse wishlistToken:", e);
    }
    return [];
  };

  const [wishToken, setWishToken] = useState(getParsedWishlist);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    console.log("[Dashboard] Mounted - profile input width configured: 200px");
  }, []);

  // GraphQL: Saved Addresses
  const { data: addressData, refetch: refetchAddresses } = useQuery(SAVED_ADDRESSES, {
    skip: !localStorage.getItem("token"),
    fetchPolicy: "cache-and-network",
    context: {
      headers: {
        Authorization: localStorage.getItem("token") ? "JWT " + localStorage.getItem("token") : "",
      },
    },
    onCompleted: (data) => {
      if (data?.me) {
        if (data.me.firstName || data.me.lastName) {
          const name = `${data.me.firstName || ""} ${data.me.lastName || ""}`.trim();
          if (name && !localStorage.getItem("userName")) localStorage.setItem("userName", name);
        }
        if (data.me.email && !localStorage.getItem("userEmail")) localStorage.setItem("userEmail", data.me.email);
        if (data.me.mobileNo && !localStorage.getItem("userPhone")) localStorage.setItem("userPhone", data.me.mobileNo);
      }
    }
  });

  // GraphQL: Saved Orders
  const { data: ordersData, refetch: refetchOrders } = useQuery(SAVED_ORDERS, {
    skip: !localStorage.getItem("token"),
    fetchPolicy: "cache-and-network",
    context: {
      headers: {
        Authorization: localStorage.getItem("token") ? "JWT " + localStorage.getItem("token") : "",
      },
    },
  });

  // Auto-sync listeners for live data updates
  useEffect(() => {
    const handleSync = () => {
      setWishToken(getParsedWishlist());
      setLocalAddresses(getLocalAddresses());
      if (typeof refetchAddresses === "function") refetchAddresses();
      if (typeof refetchOrders === "function") refetchOrders();
    };
    window.addEventListener("storage", handleSync);
    window.addEventListener("wishlistUpdated", handleSync);
    window.addEventListener("loginStatusChanged", handleSync);
    window.addEventListener("focus", handleSync);
    return () => {
      window.removeEventListener("storage", handleSync);
      window.removeEventListener("wishlistUpdated", handleSync);
      window.removeEventListener("loginStatusChanged", handleSync);
      window.removeEventListener("focus", handleSync);
    };
  }, [refetchAddresses, refetchOrders]);

  // GraphQL: Wishlist products
  const { data: wishlistData } = useQuery(GET_PRODUCT_LIST, {
    skip: wishToken.length === 0,
    fetchPolicy: "cache-first",
    variables: {
      first: 20,
      channel: "default-channel",
      filter: {
        ids: wishToken,
      }
    }
  });

  // GraphQL Mutations
  const [addressCreateM] = useMutation(CREATE_ADDRESS_MUTATION, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
  });
  const [addressUpdateM] = useMutation(UPDATE_ADDRESS_MUTATION, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
  });
  const [addressDeleteM] = useMutation(ACCOUNT_ADDRESS_DELETE, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
  });
  const [accountSetDefaultAddressM] = useMutation(ACCOUNT_SET_DEFAULT_ADDRESS, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
  });
  const [passwordChangeM] = useMutation(PASSWORD_CHANGE_MUTATION, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
  });
  const [CreateCheckout] = useMutation(CREATE_CHECKOUT_MUTATION);
  const [addLineCheckout] = useMutation(CHECKOUT_ADD_PRODUCT_LINE_MUTATION);
  const [accountUpdateM] = useMutation(ACCOUNT_UPDATE_MUTATION, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
  });
  const [updateMetadataM] = useMutation(METADATA_UPDATE, {
    context: { headers: { Authorization: "JWT " + localStorage.getItem("token") } },
  });

  // Populate mobile profile form state reactively from database (addressData.me and metadata)
  useEffect(() => {
    if (addressData?.me) {
      const me = addressData.me;
      const meta = {};
      if (Array.isArray(me.metadata)) {
        me.metadata.forEach((item) => {
          if (item?.key) meta[item.key] = item.value;
        });
      }
      console.log("[Dashboard Mobile Profile] Loaded user profile & metadata from database:", {
        email: me.email,
        firstName: me.firstName,
        lastName: me.lastName,
        metadata: meta
      });

      const fullName = [me.firstName, me.lastName].filter(Boolean).join(" ");
      if (fullName) {
        setMobFullName(fullName);
        localStorage.setItem("userName", fullName);
        localStorage.setItem("user", fullName);
      }
      if (me.email) {
        setMobEmail(me.email);
        localStorage.setItem("email", me.email);
        localStorage.setItem("userEmail", me.email);
      }
      if (meta.userType) {
        setMobUserType(meta.userType);
        localStorage.setItem("userType", meta.userType);
      }
      if (meta.speciality) {
        setMobSpeciality(meta.speciality);
        localStorage.setItem("speciality", meta.speciality);
      }
      if (meta.gender) {
        setMobGender(meta.gender);
        localStorage.setItem("gender", meta.gender);
      }
      const biz = meta.business || meta.clinic;
      if (biz) {
        setMobBusiness(biz);
        localStorage.setItem("business", biz);
      }
      if (meta.kpmeNo) {
        setMobKpmeNo(meta.kpmeNo);
        localStorage.setItem("kpmeNo", meta.kpmeNo);
      }
      const ph = meta.mobile || meta.mobileNo;
      if (ph) {
        setMobMobile(ph);
        localStorage.setItem("userPhone", ph);
      }
    }
  }, [addressData]);

  const handleSaveMobileProfile = (e) => {
    if (e) e.preventDefault();
    console.log("[Dashboard Mobile Profile] Saving profile changes:", {
      mobFullName,
      mobUserType,
      mobSpeciality,
      mobGender,
      mobBusiness,
      mobMobile,
      mobKpmeNo,
      mobEmail
    });
    localStorage.setItem("userName", mobFullName);
    localStorage.setItem("user", mobFullName);
    localStorage.setItem("userType", mobUserType);
    localStorage.setItem("speciality", mobSpeciality);
    localStorage.setItem("gender", mobGender);
    localStorage.setItem("business", mobBusiness);
    localStorage.setItem("userPhone", mobMobile);
    localStorage.setItem("kpmeNo", mobKpmeNo);
    localStorage.setItem("email", mobEmail);
    localStorage.setItem("userEmail", mobEmail);

    const token = localStorage.getItem("token");
    if (token) {
      const parts = mobFullName.trim().split(" ");
      const firstName = parts[0] || mobFullName;
      const lastName = parts.slice(1).join(" ") || "";

      // 1. Update basic account fields in Saleor
      accountUpdateM({
        variables: { input: { firstName, lastName } }
      })
        .then((res) => console.log("[Dashboard Mobile Profile] Saleor accountUpdate response:", res))
        .catch((err) => console.warn("[Dashboard Mobile Profile] Account update mutation error:", err));

      // 2. Update user metadata in Saleor database (persists in dev_hegma account_user.metadata)
      if (addressData?.me?.id) {
        const metadataInput = [
          { key: "userType", value: String(mobUserType || "") },
          { key: "speciality", value: String(mobSpeciality || "") },
          { key: "gender", value: String(mobGender || "") },
          { key: "business", value: String(mobBusiness || "") },
          { key: "kpmeNo", value: String(mobKpmeNo || "") },
          { key: "mobile", value: String(mobMobile || "") }
        ];
        console.log("[Dashboard Mobile Profile] Saving metadata to database via GraphQL updateMetadata:", {
          id: addressData.me.id,
          input: metadataInput
        });
        updateMetadataM({
          variables: {
            id: addressData.me.id,
            input: metadataInput
          }
        })
          .then((res) => console.log("[Dashboard Mobile Profile] updateMetadata persisted to database successfully:", res))
          .catch((err) => console.error("[Dashboard Mobile Profile] updateMetadata database error:", err));
      }

      // 3. Update database via Microservice REST API (updates account_user.mobile_no and metadata)
      const restApiUrl = process.env.REACT_APP_REST_API_URL || window.location.origin;
      axios.post(`${restApiUrl}/api/v1/updateUserDetails`, {
        token: token,
        email: mobEmail,
        mobile: mobMobile,
        first_name: firstName,
        last_name: lastName,
        metadata: {
          userType: mobUserType,
          speciality: mobSpeciality,
          gender: mobGender,
          business: mobBusiness,
          kpmeNo: mobKpmeNo,
          mobile: mobMobile
        }
      })
        .then((res) => console.log("[Dashboard Mobile Profile] REST updateUserDetails database result:", res.data))
        .catch((err) => console.warn("[Dashboard Mobile Profile] REST updateUserDetails call error:", err));
    }

    window.dispatchEvent(new Event("loginStatusChanged"));
    window.dispatchEvent(new Event("storage"));
    toast.success("Profile Information updated successfully!");
    setMobileProfileEditing(false);
    console.log("[Dashboard Mobile Profile] Successfully saved. Fields are now BLOCKED (mobileProfileEditing: false).");
  };

  // Default address ID state
  const [defaultAddressId, setDefaultAddressId] = useState(() => localStorage.getItem("defaultAddressId") || "");

  // Local saved addresses helper & reactive state
  const getLocalAddresses = () => {
    try {
      const raw = localStorage.getItem("savedAddresses");
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn("[DashboardScreen] Failed to parse savedAddresses:", e);
    }
    return [];
  };

  const [localAddresses, setLocalAddresses] = useState(getLocalAddresses);

  // Derived counts (auto-updates dynamically from live queries & storage)
  const ordersList = ordersData?.me?.orders?.edges || [];
  const totalOrders = ordersData?.me?.orders?.totalCount ?? ordersList.length;
  const backendAddresses = addressData?.me?.addresses || [];
  const addressesList = backendAddresses.length > 0 ? backendAddresses : localAddresses;
  const totalAddresses = addressesList.length;
  const totalWishlist = wishToken.length;

  const effectiveDefaultId = defaultAddressId || (addressesList.length > 0 ? addressesList[0]?.id : null);

  const rewardPoints = useMemo(() => {
    const stored = localStorage.getItem("rewardPoints");
    if (stored !== null && !isNaN(Number(stored))) {
      return Number(stored);
    }
    return totalOrders * 50;
  }, [totalOrders]);

  // Filtered Orders for My Orders layout (matching status tabs, search query, and sort order)
  const filteredOrders = useMemo(() => {
    return ordersList.filter(({ node: ord }) => {
      // 1. Status Filter
      const status = (ord.status || "").toUpperCase();
      if (selectedOrderTab === "processing") {
        const isProc = status === "UNFULFILLED" || status === "PARTIALLY_FULFILLED" || status.includes("PROCESS") || status === "CONFIRMED";
        if (!isProc) return false;
      } else if (selectedOrderTab === "shipped") {
        const isShipped = status === "SHIPPED" || (ord.fulfillments && ord.fulfillments.some(f => f.status === "FULFILLED" || f.trackingNumber));
        if (!isShipped) return false;
      } else if (selectedOrderTab === "delivered") {
        const isDelivered = status === "FULFILLED" || status.includes("DELIVER");
        if (!isDelivered) return false;
      } else if (selectedOrderTab === "cancelled") {
        const isCancelled = status === "CANCELED" || status === "CANCELLED";
        if (!isCancelled) return false;
      } else if (selectedOrderTab === "returned") {
        const isReturned = status === "RETURNED" || (ord.fulfillments && ord.fulfillments.some(f => f.lines?.some(l => l.userStatus === "RETURN")));
        if (!isReturned) return false;
      }

      // 2. Search Query Filter (Order ID, number, Product name)
      if (orderSearchQuery.trim()) {
        const q = orderSearchQuery.toLowerCase().trim();
        const matchesNumber = String(ord.number || "").toLowerCase().includes(q);
        const matchesId = String(ord.id || "").toLowerCase().includes(q);
        const matchesProduct = ord.fulfillments?.some(f =>
          f.lines?.some(l =>
            l.orderLine?.productName?.toLowerCase().includes(q) ||
            l.orderLine?.variantName?.toLowerCase().includes(q)
          )
        );
        if (!matchesNumber && !matchesId && !matchesProduct) return false;
      }

      return true;
    }).sort((a, b) => {
      if (orderSortBy === "oldest") {
        return new Date(a.node.created) - new Date(b.node.created);
      }
      if (orderSortBy === "amount_high") {
        return (b.node.total?.gross?.amount || 0) - (a.node.total?.gross?.amount || 0);
      }
      if (orderSortBy === "amount_low") {
        return (a.node.total?.gross?.amount || 0) - (b.node.total?.gross?.amount || 0);
      }
      return new Date(b.node.created) - new Date(a.node.created);
    });
  }, [ordersList, selectedOrderTab, orderSearchQuery, orderSortBy]);

  // Profile completion calculation
  const filledFieldsCount = [
    localStorage.getItem("userName") || localStorage.getItem("user"),
    localStorage.getItem("speciality"),
    localStorage.getItem("business"),
    localStorage.getItem("kpmeNo"),
    localStorage.getItem("userType"),
    localStorage.getItem("gender"),
    localStorage.getItem("userPhone"),
    localStorage.getItem("email") || localStorage.getItem("userEmail")
  ].filter(val => val && String(val).trim().length > 0).length;
  const profileCompletion = Math.round((filledFieldsCount / 8) * 100);

  // Open Address Modal for New
  const handleOpenAddAddress = () => {
    console.log("[DashboardScreen] handleOpenAddAddress: all fields cleared to empty.");
    setEditingAddressId(null);
    setAddrFirstName("");
    setAddrLastName("");
    setAddrPhone("");
    setAddrCompany("");
    setAddrStreet1("");
    setAddrStreet2("");
    setAddrCity("");
    setAddrState("");
    setAddrPincode("");
    setAddressModalOpen(true);
  };

  // Open Address Modal for Edit
  const handleOpenEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddrFirstName(addr.firstName || "");
    setAddrLastName(addr.lastName || "");
    setAddrPhone(addr.phone || "");
    setAddrCompany(addr.companyName || "");
    setAddrStreet1(addr.streetAddress1 || "");
    setAddrStreet2(addr.streetAddress2 || "");
    setAddrCity(addr.city || "");
    setAddrState(addr.countryArea || "Karnataka");
    setAddrPincode(addr.postalCode || "");
    setAddressModalOpen(true);
  };

  // Save or Update Address
  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!addrFirstName || !addrLastName || !addrPhone || !addrStreet1 || !addrCity || !addrPincode || !addrState) {
      toast.error("Please fill in all required address fields");
      return;
    }

    const token = localStorage.getItem("token");
    console.log("[DashboardScreen] handleSaveAddress - Auth Check:", {
      hasToken: Boolean(token),
      tokenSnippet: token ? `${token.substring(0, 10)}...` : null,
      isLoggedIn: localStorage.getItem("isLoggedIn"),
      user: localStorage.getItem("user")
    });

    const inputData = {
      firstName: addrFirstName,
      lastName: addrLastName,
      phone: addrPhone,
      companyName: addrCompany,
      streetAddress1: addrStreet1,
      streetAddress2: addrStreet2,
      city: addrCity,
      countryArea: addrState,
      postalCode: addrPincode,
      country: "IN"
    };

    // Helper to persist address locally
    const saveLocally = () => {
      const current = getLocalAddresses();
      let updated;
      if (editingAddressId) {
        updated = current.map((item) =>
          item.id === editingAddressId
            ? { ...item, ...inputData, countryArea: addrState, postalCode: addrPincode }
            : item
        );
        toast.success("Address updated successfully!");
      } else {
        const newAddress = {
          id: `local_${Date.now()}`,
          ...inputData,
          countryArea: addrState,
          postalCode: addrPincode
        };
        updated = [newAddress, ...current];
        toast.success("New address added successfully!");
      }
      localStorage.setItem("savedAddresses", JSON.stringify(updated));
      setLocalAddresses(updated);
      setAddressModalOpen(false);
      window.dispatchEvent(new Event("storage"));
    };

    // If backend token exists, attempt remote GraphQL mutation first
    if (token) {
      const authContext = {
        headers: {
          Authorization: "JWT " + token
        }
      };

      if (editingAddressId && !String(editingAddressId).startsWith("local_")) {
        addressUpdateM({
          variables: { id: editingAddressId, input: inputData },
          context: authContext,
          onCompleted: (data) => {
            console.log("[DashboardScreen] addressUpdateM completed successfully:", data);
            toast.success("Address updated successfully!");
            setAddressModalOpen(false);
            refetchAddresses();
          },
          onError: (err) => {
            console.warn("[DashboardScreen] Remote address update failed, saving locally:", err);
            saveLocally();
          }
        });
        return;
      } else if (!editingAddressId) {
        addressCreateM({
          variables: { input: inputData },
          context: authContext,
          onCompleted: (data) => {
            console.log("[DashboardScreen] addressCreateM completed successfully:", data);
            toast.success("New address added successfully!");
            setAddressModalOpen(false);
            refetchAddresses();
          },
          onError: (err) => {
            console.warn("[DashboardScreen] Remote address create failed, saving locally:", err);
            saveLocally();
          }
        });
        return;
      }
    }

    // Direct local persistence fallback when no backend token is stored
    saveLocally();
  };

  // Delete Address
  const handleDeleteAddress = (id) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const token = localStorage.getItem("token");
      const isLocal = String(id).startsWith("local_");

      const deleteLocally = () => {
        const current = getLocalAddresses();
        const updated = current.filter((item) => item.id !== id);
        localStorage.setItem("savedAddresses", JSON.stringify(updated));
        setLocalAddresses(updated);
        toast.success("Address removed successfully!");
        window.dispatchEvent(new Event("storage"));
      };

      if (token && !isLocal) {
        addressDeleteM({
          variables: { id },
          context: {
            headers: {
              Authorization: "JWT " + token
            }
          },
          onCompleted: () => {
            toast.success("Address removed successfully!");
            refetchAddresses();
          },
          onError: (err) => {
            console.warn("[DashboardScreen] Remote address delete failed, applying local delete:", err);
            deleteLocally();
          }
        });
      } else {
        deleteLocally();
      }

      if (id === defaultAddressId || String(id) === String(defaultAddressId)) {
        console.log("[DashboardScreen] Deleted default address. Resetting default address ID.");
        localStorage.removeItem("defaultAddressId");
        setDefaultAddressId("");
      }
    }
  };

  // Set Address as Default
  const handleSetDefaultAddress = (id) => {
    console.log("[DashboardScreen] Setting address as default. ID:", id);
    setDefaultAddressId(id);
    localStorage.setItem("defaultAddressId", id);

    const token = localStorage.getItem("token");
    const isLocal = String(id).startsWith("local_");

    if (token && !isLocal) {
      accountSetDefaultAddressM({
        variables: { id, type: "SHIPPING" },
        context: {
          headers: {
            Authorization: "JWT " + token
          }
        },
        onCompleted: (data) => {
          console.log("[DashboardScreen] Remote accountSetDefaultAddress success:", data);
          toast.success("Address set as default successfully!");
          if (typeof refetchAddresses === "function") refetchAddresses();
        },
        onError: (err) => {
          console.warn("[DashboardScreen] Remote default address update failed, saved locally:", err);
          toast.success("Address set as default successfully!");
        }
      });
    } else {
      toast.success("Address set as default successfully!");
    }

    window.dispatchEvent(new Event("storage"));
  };

  // Re-Order Handler
  const handleReorder = (orderNode) => {
    setReorderLoadingId(orderNode.id);
    const cartToken = localStorage.getItem("cartToken");

    const addLines = (token) => {
      let pending = orderNode.lines.length;
      orderNode.lines.forEach((line) => {
        if (line.variant?.id) {
          addLineCheckout({
            variables: {
              token,
              lines: [{ quantity: line.quantity, variantId: line.variant.id }]
            },
            onCompleted: () => {
              pending -= 1;
              if (pending <= 0) {
                setReorderLoadingId(null);
                toast.success("All items from this order have been added to your cart!");
                navigate("/cart");
              }
            },
            onError: () => {
              setReorderLoadingId(null);
              toast.error("Could not add all items to cart");
            }
          });
        }
      });
    };

    if (!cartToken) {
      CreateCheckout({
        variables: {
          channel: "default-channel",
          email: localStorage.getItem("email") || localStorage.getItem("userEmail") || "hegmakart@gmail.com",
          lines: []
        },
        onCompleted: (res) => {
          if (res?.checkoutCreate?.checkout?.token) {
            localStorage.setItem("cartToken", res.checkoutCreate.checkout.token);
            addLines(res.checkoutCreate.checkout.token);
          }
        }
      });
    } else {
      addLines(cartToken);
    }
  };

  // Change Password Handler
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    passwordChangeM({
      variables: { oldPassword, newPassword },
      onCompleted: (res) => {
        if (res?.passwordChange?.errors?.length) {
          toast.error(res.passwordChange.errors[0].message);
        } else {
          toast.success("Password changed successfully!");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        }
      },
      onError: (err) => toast.error(err.message)
    });
  };

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  console.log("[DashboardScreen Debug] Statistics Card dynamic values:", {
    totalOrders,
    rewardPoints,
    totalWishlist,
    totalAddresses,
    ordersCount: ordersList.length,
    addressesCount: addressesList.length,
    wishlistLength: wishToken.length,
    openMobileDropdown,
    activeTab
  });

  return (
    <>
      <Helmet>
        <title>Hegmakart: My Account Dashboard</title>
        <meta name="description" content="View and manage profile, orders, addresses, and wishlist" />
      </Helmet>

      {/* =========================================================================
          MOBILE VIEW (screens < 768px) - Exact match to user design images
          ========================================================================= */}
      <div className="account-page block md:hidden">
        {/* Mobile Top App Bar (Back, Logo, Cart, Wishlist, Profile) */}
        <div className="mobile-top-bar">
          <div className="mobile-top-bar-left">
            <button
              type="button"
              onClick={() => {
                console.log("[MobileTopBar] Back button clicked");
                navigate(-1);
              }}
              className="mobile-top-bar-btn"
              aria-label="Back"
            >
              <ChevronLeft size={24} strokeWidth={2.2} />
            </button>
            <img
              src="/assets/images/logo3.png"
              alt="HegmaKart Logo"
              className="mobile-top-bar-logo"
              onClick={() => {
                console.log("[MobileTopBar] Logo clicked -> navigate to /");
                navigate("/");
              }}
            />
          </div>


          <div className="mobile-top-bar-right">
            <button
              type="button"
              onClick={() => {
                console.log("[MobileTopBar] Cart clicked -> navigate to /cart");
                navigate("/cart");
              }}
              className="mobile-top-bar-icon-link"
              aria-label="Cart"
            >
              <ShoppingCart size={22} strokeWidth={1.8} />
            </button>


            <button
              type="button"
              onClick={() => {
                console.log("[MobileTopBar] Wishlist clicked -> navigate to /wishlist");
                navigate("/wishlist");
              }}
              className="mobile-top-bar-icon-link"
              aria-label="Wishlist"
            >
              <Heart size={22} strokeWidth={1.8} />
            </button>


            <button
              type="button"
              onClick={() => {
                console.log("[MobileTopBar] Profile icon clicked -> toggle profile dropdown");
                toggleMobileDropdown("profile");
              }}
              className="mobile-top-bar-icon-link"
              aria-label="Profile"
            >
              <CircleUser size={23} strokeWidth={1.8} />
            </button>
          </div>
        </div>


        {/* Mobile Header (Image 2 Top) */}
        <header className="account-header">
          <h1>My Account</h1>
        </header>


        <div className="account-content">
          {/* Profile Card (Image 2 Top) */}
          <div
            className="profile-card cursor-pointer"
          // onClick={() => toggleMobileDropdown("profile")}
          >
            <div className="profile-avatar">
              <User size={34} strokeWidth={2.2} />
            </div>
            <div className="profile-details">
              <div className="profile-top">
                <div className="profile-info">
                  <h2>{mobFullName || "Dr. Hemanth"}</h2>
                  <p>{mobSpeciality || "Dental Surgeon"}</p>
                </div>
              </div>
              <div className="profile-progress">
                <div className="progress-track">
                  <div
                    className="progress-fill"
                    style={{ width: `${profileCompletion ?? 0}%` }}
                  />
                </div>
                <span>{profileCompletion ?? 0}%</span>
              </div>
            </div>
          </div>






          {/* Account Menu Card with Inline Dropdowns for ALL options */}
          <div className="account-menu">
            <h2>Account Menu</h2>
            <div className="menu-list">


              {/* 1. Profile Information Dropdown (Image 3) */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("profile")}
                  className={`menu-item ${openMobileDropdown === "profile" ? "active-dropdown" : ""}`}
                >
                  <User size={19} className="menu-icon" />
                  <span>Profile Information</span>
                  {openMobileDropdown === "profile" ? (
                    <ChevronDown size={18} className="text-black" />
                  ) : (
                    <ChevronRight size={18} className="menu-arrow" />
                  )}
                </button>


                {openMobileDropdown === "profile" && (
                  <div className="mobile-dropdown-content">
                    <form onSubmit={handleSaveMobileProfile}>
                      <div className="mobile-form-group">
                        <label className="mobile-form-label">Full Name</label>
                        <input
                          type="text"
                          disabled={!mobileProfileEditing}
                          value={mobFullName}
                          onChange={(e) => setMobFullName(e.target.value)}
                          className="mobile-form-input"
                        />
                      </div>


                      <div className="mobile-form-group">
                        <label className="mobile-form-label">Type</label>
                        <select
                          disabled={!mobileProfileEditing}
                          value={mobUserType}
                          onChange={(e) => setMobUserType(e.target.value)}
                          className={`mobile-form-input ${mobileProfileEditing ? "bg-white cursor-pointer" : "cursor-not-allowed bg-[#f8fafc]"}`}
                        >
                          <option value="">Select Type</option>
                          <option value="Dentist">Dentist</option>
                          <option value="Dental Clinic">Dental Clinic</option>
                          <option value="Dental Lab">Dental Lab</option>
                          <option value="Hospital">Hospital</option>
                          <option value="Distributor">Distributor</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>


                      <div className="mobile-form-group">
                        <label className="mobile-form-label">Speciality</label>
                        <input
                          type="text"
                          disabled={!mobileProfileEditing}
                          value={mobSpeciality}
                          onChange={(e) => setMobSpeciality(e.target.value)}
                          className="mobile-form-input"
                        />
                      </div>


                      <div className="mobile-form-group">
                        <label className="mobile-form-label">Gender</label>
                        <select
                          disabled={!mobileProfileEditing}
                          value={mobGender}
                          onChange={(e) => setMobGender(e.target.value)}
                          className={`mobile-form-input ${mobileProfileEditing ? "bg-white cursor-pointer" : "cursor-not-allowed bg-[#f8fafc]"}`}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>


                      <div className="mobile-form-group">
                        <label className="mobile-form-label">Clinic</label>
                        <input
                          type="text"
                          disabled={!mobileProfileEditing}
                          value={mobBusiness}
                          onChange={(e) => setMobBusiness(e.target.value)}
                          className="mobile-form-input"
                        />
                      </div>


                      <div className="mobile-form-group">
                        <label className="mobile-form-label">Mobile</label>
                        <input
                          type="tel"
                          disabled={!mobileProfileEditing}
                          value={mobMobile}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                            setMobMobile(val);
                          }}
                          maxLength={10}
                          className="mobile-form-input"
                        />
                      </div>


                      <div className="mobile-form-group">
                        <label className="mobile-form-label">KPME No</label>
                        <input
                          type="text"
                          disabled={!mobileProfileEditing}
                          value={mobKpmeNo}
                          onChange={(e) => setMobKpmeNo(e.target.value)}
                          className="mobile-form-input"
                        />
                      </div>


                      <div className="mobile-form-group">
                        <label className="mobile-form-label">Email</label>
                        <input
                          type="email"
                          disabled={!mobileProfileEditing}
                          value={mobEmail}
                          onChange={(e) => setMobEmail(e.target.value)}
                          className="mobile-form-input"
                        />
                      </div>


                      <div className="mobile-form-actions">
                        <button
                          type="button"
                          onClick={() => {
                            const nextState = !mobileProfileEditing;
                            console.log("[Dashboard Mobile Profile] Edit/Cancel button clicked. New editing state:", nextState ? "UNBLOCKED (Editing)" : "BLOCKED (Locked)");
                            setMobileProfileEditing(nextState);
                          }}
                          className={`mobile-btn-edit ${mobileProfileEditing ? "bg-amber-50 text-amber-700 border-amber-300" : ""}`}
                        >
                          {mobileProfileEditing ? "Cancel" : "Edit"}
                        </button>
                        <button
                          type="submit"
                          disabled={!mobileProfileEditing}
                          className={`mobile-btn-save ${!mobileProfileEditing ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                          Save Changes
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>


              {/* 2. Manage Addresses Dropdown */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("addresses")}
                  className={`menu-item ${openMobileDropdown === "addresses" ? "active-dropdown" : ""}`}
                >
                  <MapPin size={19} className="menu-icon" />
                  <span>Manage Addresses</span>
                  {openMobileDropdown === "addresses" ? (
                    <ChevronDown size={18} className="menu-arrow text-blue-600" />
                  ) : (
                    <ChevronRight size={18} className="menu-arrow" />
                  )}
                </button>


                {openMobileDropdown === "addresses" && (
                  <div className="mobile-dropdown-content">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[14px] font-bold text-slate-800">
                        Saved Addresses
                      </span>


                      <button
                        type="button"
                        onClick={handleOpenAddAddress}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11.5px] font-semibold border-0 cursor-pointer"
                      >
                        + Add New Address
                      </button>
                    </div>


                    {addressesList.length === 0 ? (
                      <p className="text-[15px] text-slate-500 py-3 text-center m-0">
                        No saved addresses found.
                      </p>
                    ) : (
                      <div className="space-y-2 ">
                        {addressesList.map((addr, idx) => {
                          const isDefault = effectiveDefaultId
                            ? (addr.id === effectiveDefaultId || String(addr.id) === String(effectiveDefaultId))
                            : idx === 0;


                          return (
                            <div
                              key={addr.id || idx}
                              className={`w-full rounded-xl border ${isDefault ? "border-blue-400 bg-blue-50/20 shadow-xs" : "border-slate-200 bg-white"} p-3.5 transition-all`}
                            >
                              {/* Name and Default Badge */}
                              <div className="flex items-center justify-between gap-2">
                                <div className="text-[14px] font-bold text-slate-900">
                                  {addr.firstName} {addr.lastName}
                                </div>
                                {isDefault && (
                                  <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                                    Default
                                  </span>
                                )}
                              </div>


                              {/* Company */}
                              {addr.companyName && (
                                <div className="mt-0.5 text-[13px] text-slate-600">
                                  {addr.companyName}
                                </div>
                              )}


                              {/* Address */}
                              <div className="mt-1 flex items-start gap-1.5 text-[12px] text-slate-600">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  className="mt-0.5 shrink-0 text-blue-600"
                                >
                                  <path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" />
                                  <circle cx="12" cy="10" r="2.5" />
                                </svg>


                                <span>
                                  {[addr.streetAddress1, addr.city]
                                    .filter(Boolean)
                                    .join(", ")}
                                  {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                                </span>
                              </div>


                              {/* Phone */}
                              {addr.phone && (
                                <div className="mt-1 flex items-center gap-1.5 text-[12px] text-slate-600">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="shrink-0 text-blue-600"
                                  >
                                    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24c1.12.37 2.33.56 3.58.56a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.19 2.46.56 3.58a1 1 0 0 1-.25 1.01l-2.19 2.2Z" />
                                  </svg>


                                  <span>{addr.phone}</span>
                                </div>
                              )}


                              {/* Actions Bar */}
                              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditAddress(addr)}
                                    className="inline-flex items-center justify-center rounded-md border border-blue-200 bg-blue-50 px-3 py-1.5 text-[12px] font-semibold text-blue-600 cursor-pointer hover:bg-blue-100"
                                  >
                                    Edit
                                  </button>


                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="inline-flex items-center justify-center rounded-md border border-red-200 bg-red-50 px-3 py-1.5 text-[12px] font-semibold text-red-600 cursor-pointer hover:bg-red-100"
                                  >
                                    Delete
                                  </button>
                                </div>


                                {!isDefault && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetDefaultAddress(addr.id)}
                                    className="inline-flex items-center justify-center rounded-md border border-slate-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer"
                                  >
                                    Set as default
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}
              </div>


              {/* 3. My Orders Dropdown */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("orders")}
                  className={`menu-item ${openMobileDropdown === "orders" ? "active-dropdown" : ""}`}
                >
                  <ShoppingBag size={19} className="menu-icon" />
                  <span>My Orders</span>
                  {openMobileDropdown === "orders" ? (
                    <ChevronDown size={18} className="menu-arrow text-blue-600" />
                  ) : (
                    <ChevronRight size={18} className="menu-arrow" />
                  )}
                </button>


                {openMobileDropdown === "orders" && (
                  <div className="mobile-dropdown-content">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[14px] font-bold text-slate-800">Recent Orders ({ordersList.length})</span>
                      <button
                        type="button"
                        onClick={() => navigate("/order")}
                        className="text-blue-600 text-[11.5px] font-semibold bg-transparent border-0 cursor-pointer p-0 hover:underline"
                      >
                        All orders &rarr;
                      </button>
                    </div>
                    {ordersList.length === 0 ? (
                      <p className="text-[12.5px] text-slate-500 py-3 text-center m-0">No orders found.</p>
                    ) : (
                      <div className="space-y-2">
                        {ordersList.slice(0, 5).map(({ node: ord }) => (
                          <div key={ord.id} className="p-2.5 border border-slate-200 rounded-xl bg-slate-50/50">
                            <div className="flex justify-between items-center text-[12.5px] font-bold">
                              <span>Order #{ord.number}</span>
                              <span className="text-blue-600">₹{ord.total?.gross?.amount?.toLocaleString() || "0"}</span>
                            </div>
                            <div className="text-[11.5px] text-slate-500 mt-0.5">Status: {ord.statusDisplay}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>


              {/* 4. Wishlist Dropdown */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("wishlist")}
                  className={`menu-item ${openMobileDropdown === "wishlist" ? "active-dropdown" : ""}`}
                >
                  <Heart size={19} className="menu-icon" />
                  <span>Wishlist</span>
                  {openMobileDropdown === "wishlist" ? (
                    <ChevronDown size={18} className="menu-arrow text-blue-600" />
                  ) : (
                    <ChevronRight size={18} className="menu-arrow" />
                  )}
                </button>


                {openMobileDropdown === "wishlist" && (
                  <div className="mobile-dropdown-content">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[14px] font-bold text-slate-800">Saved Wishlist ({totalWishlist})</span>
                      <button
                        type="button"
                        onClick={() => navigate("/wishlist")}
                        className="text-blue-600 text-[11.5px] font-semibold bg-transparent border-0 cursor-pointer p-0 hover:underline"
                      >
                        Open wishlist &rarr;
                      </button>
                    </div>
                    <p className="text-[12px] text-slate-500 m-0">Saved medical supplies and equipment for fast checkout.</p>
                  </div>
                )}
              </div>


              {/* 5. Rewards & Offers Dropdown */}
              <div className="hidden w-full">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("rewards")}
                  className={`menu-item ${openMobileDropdown === "rewards" ? "active-dropdown" : ""}`}
                >
                  <Gift size={19} className="menu-icon" />
                  <span>Rewards &amp; Offers</span>
                  {openMobileDropdown === "rewards" ? (
                    <ChevronDown size={18} className="menu-arrow text-blue-600" />
                  ) : (
                    <ChevronRight size={18} className="menu-arrow" />
                  )}
                </button>


                {openMobileDropdown === "rewards" && (
                  <div className="mobile-dropdown-content text-center py-4">
                    {/* <div className="text-[24px] font-extrabold text-emerald-600">{rewardPoints.toLocaleString()} Points</div> */}
                    <p className="text-[12px] text-slate-600 mt-1 mb-0">Hegmakart Points will Coming Soon.</p>
                  </div>
                )}
              </div>


              {/* 6. Settings Dropdown */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("settings")}
                  className={`menu-item ${openMobileDropdown === "settings" ? "active-dropdown" : ""}`}
                >
                  <Settings size={19} className="menu-icon" />
                  <span>Settings</span>
                  {openMobileDropdown === "settings" ? (
                    <ChevronDown size={18} className="menu-arrow text-blue-600" />
                  ) : (
                    <ChevronRight size={18} className="menu-arrow" />
                  )}
                </button>


                {openMobileDropdown === "settings" && (
                  <div className="mobile-dropdown-content">
                    <div className="rounded-xl border border-slate-200 bg-white p-4 sm:p-5">


                      {/* Header */}
                      <div className="mb-5">
                        <h3 className="text-[16px] font-bold text-slate-800">
                          Change Password
                        </h3>
                        <p className=" text-[11px] leading-relaxed text-slate-500">
                          Update your password to keep your account secure.
                        </p>
                      </div>


                      <form onSubmit={handleChangePassword} className="space-y-4">


                        {/* Current Password */}
                        <div>
                          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                            Current Password
                          </label>


                          <div className="relative flex items-center">
                            <input
                              type={showOldPassword ? "text" : "password"}
                              placeholder="Enter current password"
                              value={oldPassword}
                              onChange={(e) => setOldPassword(e.target.value)}
                              autoComplete="current-password"
                              required
                              className="form-input !h-14 w-full rounded-lg border border-slate-200 bg-slate-50 pl-3.5 pr-11 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                console.log("[Dashboard Mobile] Toggling current password visibility to:", !showOldPassword);
                                setShowOldPassword((prev) => !prev);
                              }}
                              className="absolute right-3 border-0 bg-transparent mb-2 p-1 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                              aria-label={showOldPassword ? "Hide current password" : "Show current password"}
                            >
                              {showOldPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>


                        {/* New Password */}
                        <div>
                          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                            New Password
                          </label>


                          <div className="relative flex items-center">
                            <input
                              type={showNewPassword ? "text" : "password"}
                              placeholder="Enter new password"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              autoComplete="new-password"
                              required
                              minLength={8}
                              className="form-input !h-14 w-full rounded-lg border border-slate-200 bg-slate-50 pl-3.5 pr-11 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                console.log("[Dashboard Mobile] Toggling new password visibility to:", !showNewPassword);
                                setShowNewPassword((prev) => !prev);
                              }}
                              className="absolute right-3 border-0 bg-transparent mb-2 p-1.5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                              aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                            >
                              {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>


                        {/* Confirm Password */}
                        <div>
                          <label className="mb-1.5 block text-[13px] font-semibold text-slate-700">
                            Confirm New Password
                          </label>


                          <div className="relative flex items-center">
                            <input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Re-enter new password"
                              value={confirmPassword}
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              autoComplete="new-password"
                              required
                              minLength={8}
                              className="form-input !h-14 w-full rounded-lg border border-slate-200 bg-slate-50 pl-3.5 pr-11 text-[13px] text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                console.log("[Dashboard Mobile] Toggling confirm password visibility to:", !showConfirmPassword);
                                setShowConfirmPassword((prev) => !prev);
                              }}
                              className="absolute right-3 border-0 bg-transparent mb-2 p-1.5 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                            >
                              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                          </div>
                        </div>


                        {/* Submit Button */}
                        <button
                          type="submit"
                          className="mt-2 flex w-full items-center justify-center rounded-lg border-0 bg-blue-600 px-4 py-3 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Update Password
                        </button>
                      </form>
                    </div>
                  </div>


                )}
              </div>


              {/* 7. Help & Support Dropdown */}
              <div className="w-full">
                <button
                  type="button"
                  onClick={() => toggleMobileDropdown("help")}
                  className={`menu-item ${openMobileDropdown === "help" ? "active-dropdown" : ""}`}
                >
                  <HelpCircle size={19} className="menu-icon" />
                  <span>Help &amp; Support</span>
                  {openMobileDropdown === "help" ? (
                    <ChevronDown size={18} className="menu-arrow text-blue-600" />
                  ) : (
                    <ChevronRight size={18} className="menu-arrow" />
                  )}
                </button>


                {openMobileDropdown === "help" && (
                  <div className="mobile-dropdown-content space-y-2  text-slate-600">
                    <div className="w-full rounded-xl border border-blue-100 bg-blue-50 p-4 space-y-3">
                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-700">
                        <span className="font-semibold text-gray-900">Email:</span>
                        <a
                          href="mailto:support@hegmakart.com"
                          className="font-semibold text-blue-600 no-underline hover:text-blue-800"
                        >
                          support@hegmakart.com
                        </a>
                      </div>


                      <div className="flex flex-wrap items-center gap-2 text-[12px] text-gray-700">
                        <span className="font-semibold text-gray-900">Phone:</span>
                        <a
                          href="tel:+918553666877"
                          className="font-semibold text-blue-600 no-underline hover:text-blue-800"
                        >
                          +91 8553666877
                        </a>
                      </div>


                      <div className="text-[12px] text-gray-700">
                        <span className="font-semibold text-gray-900">Working Hours:</span>{" "}
                        Mon - Sat, 9:00 AM - 7:00 PM IST
                      </div>
                    </div>
                  </div>
                )}
              </div>


              {/* 8. Logout (Image 1) */}
              <button
                type="button"
                onClick={logoutHandeler}
                className="menu-item"
              >
                <LogOut size={19} className="text-[#ef4444] shrink-0" />
                <span className="text-[#ef4444] font-semibold text-center pr-6">Logout</span>
              </button>
            </div>
          </div>
          {/* Statistics Card (Image 2 Middle) */}
          <div className="stats-card mt-2 rounded-2xl">
            <div className="stats-grid">
              {/* Total Orders */}
              <div className="stat-item cursor-pointer" onClick={() => toggleMobileDropdown("orders")}>
                <div className="stat-icon bg-blue-50 text-blue-600">
                  <ShoppingBag size={20} strokeWidth={2} />
                </div>
                <div className="stat-details">
                  <h3>{totalOrders ?? 0}</h3>
                  <p>Total Orders</p>
                </div>
              </div>


              {/* Rewards Points */}
              <div className="stat-item cursor-pointer" onClick={() => toggleMobileDropdown("rewards")}>
                <div className="stat-icon bg-emerald-50 text-emerald-600">
                  <Gift size={20} strokeWidth={2} />
                </div>
                <div className="stat-details">
                  <h3>{(rewardPoints ?? 0).toLocaleString()}</h3>
                  <p>Rewards Points</p>
                </div>
              </div>


              {/* Wishlist Items */}
              <div className="stat-item cursor-pointer" onClick={() => toggleMobileDropdown("wishlist")}>
                <div className="stat-icon bg-purple-50 text-purple-600">
                  <Heart size={20} strokeWidth={2} />
                </div>
                <div className="stat-details">
                  <h3>{totalWishlist ?? 0}</h3>
                  <p>Wishlist Items</p>
                </div>
              </div>


              {/* Saved Addresses */}
              <div className="stat-item cursor-pointer" onClick={() => toggleMobileDropdown("addresses")}>
                <div className="stat-icon bg-orange-50 text-orange-600">
                  <MapPin size={20} strokeWidth={2} />
                </div>
                <div className="stat-details">
                  <h3>{totalAddresses ?? 0}</h3>
                  <p>Saved Addresses</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          DESKTOP VIEW (screens >= 768px)
          ========================================================================= */}
      <div className="desktop-dashboard-container hidden md:block">
        <Header />

        <main className="bg-[#F4F6F8] pb-6 pt-6 " style={{ fontFamily: "'Outfit', 'DM Sans', sans-serif" }}>
          <div className="max-w-[1340px] mx-auto px-4 sm:px-6 ">

            <div className="flex flex-col lg:flex-row gap-6 items-start">

              {/* Left Sidebar Card */}
              <aside className="dashboard-sidebar w-full lg:w-[250px] shrink-0 bg-white rounded-3xl p-4 border border-slate-100 shadow-sm flex flex-col justify-between">
                <div>
                  {/* User Header */}
                  <div className="flex items-center gap-3">
                    <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <User size={30} strokeWidth={2.2} />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-[16px] font-bold text-slate-900 leading-tight m-0 truncate">
                        {userName || "Dr. Rajesh Sharma"}
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

                  {/* Vertical Navigation Menu - All Tabs in Same Template */}
                  <nav className="mt-2 flex flex-col gap-1 border-t border-slate-100 pt-3">
                    <Link
                      to="/account-detail"
                      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 cursor-pointer text-left w-full text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent no-underline"
                    >
                      <User size={18} strokeWidth={1.8} />
                      <span>Profile Information</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => switchTab("addresses")}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 cursor-pointer text-left w-full ${activeTab === "addresses"
                        ? "text-blue-600 bg-blue-50/80 font-semibold"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent"
                        }`}
                    >
                      <MapPin size={18} strokeWidth={activeTab === "addresses" ? 2.3 : 1.8} />
                      <span>Manage Addresses</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => switchTab("orders")}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 cursor-pointer text-left w-full ${activeTab === "orders"
                        ? "text-blue-600 bg-blue-50/80 font-semibold"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent"
                        }`}
                    >
                      <Package size={18} strokeWidth={activeTab === "orders" ? 2.3 : 1.8} />
                      <span>My Orders</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => switchTab("wishlist")}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 cursor-pointer text-left w-full ${activeTab === "wishlist"
                        ? "text-blue-600 bg-blue-50/80 font-semibold"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent"
                        }`}
                    >
                      <Heart size={18} strokeWidth={activeTab === "wishlist" ? 2.3 : 1.8} />
                      <span>Wishlist</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => switchTab("rewards")}
                      className={`hidden flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 cursor-pointer text-left w-full ${activeTab === "rewards"
                        ? "text-blue-600 bg-blue-50/80 font-semibold"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent"
                        }`}
                    >
                      <Gift size={18} strokeWidth={activeTab === "rewards" ? 2.3 : 1.8} />
                      <span>Rewards &amp; Offers</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => switchTab("settings")}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 cursor-pointer text-left w-full ${activeTab === "settings"
                        ? "text-blue-600 bg-blue-50/80 font-semibold"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent"
                        }`}
                    >
                      <Settings size={18} strokeWidth={activeTab === "settings" ? 2.3 : 1.8} />
                      <span>Change Password</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => switchTab("help")}
                      className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-[13.5px] transition-all border-0 cursor-pointer text-left w-full ${activeTab === "help"
                        ? "text-blue-600 bg-blue-50/80 font-semibold"
                        : "text-slate-600 hover:text-blue-600 hover:bg-slate-50 bg-transparent"
                        }`}
                    >
                      <HelpCircle size={18} strokeWidth={activeTab === "help" ? 2.3 : 1.8} />
                      <span>Help &amp; Support</span>
                    </button>
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


              </aside>

              {/* Right Main Content Area - Renders Active Tab */}
              <div className="flex-1 w-full flex flex-col gap-6">

                {/* TAB 1: Profile Information (Modular AccountDetail Component) */}
                {activeTab === "profile" && (
                  <AccountDetail isEmbedded={true} />
                )}

                {/* TAB 2: Manage Addresses */}
                {activeTab === "addresses" && (
                  <div className="bg-white rounded-3xl p-2 sm:p-8 border border-slate-100 shadow-sm animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-3 ">
                      <div>
                        <h1 className="text-[22px] font-bold text-slate-900 ml-4">
                          Manage Addresses
                        </h1>
                        <p className="text-[13px] text-slate-500 mt-1 mb-0 ml-4">
                          Manage your clinic, hospital &amp; residential delivery addresses
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleOpenAddAddress}
                        className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[13px] rounded-xl shadow-xs transition-all cursor-pointer border-0"
                      >
                        <Plus size={16} />
                        <span>Add New Address</span>
                      </button>
                    </div>

                    {addressesList.length === 0 ? (
                      <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <MapPin size={36} className="text-slate-400 mx-auto mb-2" />
                        <h3 className="text-[15px] font-bold text-slate-700 m-0">No Saved Addresses Found</h3>
                        <p className="text-[10px] text-slate-500 mt-1 mb-4">Add your shipping address for fast and effortless checkouts.</p>
                        <button
                          type="button"
                          onClick={handleOpenAddAddress}
                          className="px-5 py-2 bg-blue-600 text-white font-semibold text-s rounded-xl border-0 cursor-pointer"
                        >
                          Add Address
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {addressesList.map((addr, idx) => {
                          const isDefault = effectiveDefaultId
                            ? (addr.id === effectiveDefaultId || String(addr.id) === String(effectiveDefaultId))
                            : idx === 0;

                          return (
                            <div
                              key={addr.id || idx}
                              className={`rounded-xl border ${isDefault ? "border-blue-400 bg-blue-50/15 shadow-xs" : "border-slate-200 bg-white"} p-3.5 transition-colors hover:border-blue-400 flex flex-col justify-between`}
                            >
                              <div className="flex items-start justify-between gap-3">

                                {/* Left: Address Details */}
                                <div className="min-w-0 flex-1">

                                  {/* Name and Default Badge */}
                                  <div className="mb-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <h4 className="m-0 text-[15px] font-bold text-slate-900">
                                        {addr.firstName} {addr.lastName}
                                      </h4>

                                      {isDefault && (
                                        <span className="shrink-0 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-semibold text-blue-600">
                                          Default
                                        </span>
                                      )}
                                    </div>

                                    {/* Company */}
                                    {addr.companyName && (
                                      <p className="m-0 mt-1 text-[13px] text-slate-600">
                                        {addr.companyName}
                                      </p>
                                    )}
                                  </div>

                                  {/* Location */}
                                  <div className="mt-1 flex items-start gap-1.5 text-[13px] leading-relaxed text-slate-600">
                                    <MapPin
                                      size={14}
                                      className="mt-0.5 shrink-0 text-blue-600"
                                    />

                                    <div className="min-w-0 break-words">
                                      {addr.streetAddress1}
                                      {addr.streetAddress2 ? `, ${addr.streetAddress2}` : ""}

                                      <div>
                                        {[addr.city, addr.countryArea].filter(Boolean).join(", ")}
                                        {addr.postalCode ? ` - ${addr.postalCode}` : ""}
                                      </div>
                                    </div>
                                  </div>

                                  {/* Phone */}
                                  {addr.phone && (
                                    <div className="mt-1 flex items-center gap-1.5 text-[13px] text-slate-600">
                                      <Phone
                                        size={14}
                                        className="shrink-0 text-blue-600"
                                      />
                                      <span className="break-all">{addr.phone}</span>
                                    </div>
                                  )}

                                </div>

                                {/* Right: Edit and Delete Buttons */}
                                <div className="flex shrink-0 flex-col gap-2 mt-1">

                                  <button
                                    type="button"
                                    onClick={() => handleOpenEditAddress(addr)}
                                    className="inline-flex w-[72px] items-center justify-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1.5 text-[11px] font-semibold text-blue-600 cursor-pointer transition-colors hover:border-blue-500 hover:bg-blue-100"
                                  >
                                    <Edit2 size={12} />
                                    Edit
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="inline-flex w-[72px] items-center justify-center gap-1 rounded-md border border-red-200 bg-red-50 px-2 py-1.5 text-[11px] font-semibold text-red-600 cursor-pointer transition-colors hover:border-red-500 hover:bg-red-100"
                                  >
                                    <Trash2 size={12} />
                                    Delete
                                  </button>
                                  {!isDefault && (
                                    <button
                                      type="button"
                                      onClick={() => handleSetDefaultAddress(addr.id)}
                                      className="inline-flex items-center justify-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-[11px] font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-colors cursor-pointer whitespace-nowrap"
                                    >
                                      <Check size={12} className="text-slate-400" />
                                      Set as default
                                    </button>
                                  )}
                                </div>

                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: My Orders */}
                {activeTab === "orders" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm animate-in fade-in duration-200">

                    {/* Top Header: Title on Left, Search & Filter on Right */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <h1 className="text-[24px] font-bold text-slate-900 m-0 tracking-tight">
                        My Orders
                      </h1>

                      <div className="flex items-center gap-3">
                        {/* Search Input */}
                        <div className="relative flex items-center">
                          <Search size={16} className="absolute left-3.5 text-slate-400 pointer-events-none" />
                          <input
                            type="text"
                            value={orderSearchQuery}
                            onChange={(e) => setOrderSearchQuery(e.target.value)}
                            placeholder="Search by Order ID / Product"
                            className="pl-9 pr-8 py-2 text-[13px] border border-slate-200 rounded-xl outline-none focus:border-blue-500 w-[230px] sm:w-[280px] bg-white transition-all text-slate-800 placeholder:text-slate-400 focus:ring-1 focus:ring-blue-500"
                          />
                          {orderSearchQuery && (
                            <button
                              type="button"
                              onClick={() => setOrderSearchQuery("")}
                              className="absolute right-2.5 text-slate-400 hover:text-slate-600 border-0 bg-transparent cursor-pointer p-0"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>

                        {/* Filter Button & Popover */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOrderFilterOpen((prev) => !prev)}
                            className={`inline-flex items-center gap-1.5 px-3.5 py-2 border rounded-xl text-[13px] font-medium transition-colors cursor-pointer ${orderFilterOpen || orderSortBy !== "newest"
                              ? "border-blue-500 bg-blue-50 text-blue-600 font-semibold"
                              : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                              }`}
                          >
                            <Filter size={15} className={orderFilterOpen || orderSortBy !== "newest" ? "text-blue-600" : "text-slate-500"} />
                            <span>Filter</span>
                          </button>

                          {orderFilterOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-lg p-2 z-20 animate-in fade-in">
                              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                                Sort Orders
                              </div>
                              <button
                                type="button"
                                onClick={() => { setOrderSortBy("newest"); setOrderFilterOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] border-0 cursor-pointer transition-colors ${orderSortBy === "newest" ? "bg-blue-50 text-blue-600 font-semibold" : "bg-transparent text-slate-700 hover:bg-slate-50"}`}
                              >
                                Newest First
                              </button>
                              <button
                                type="button"
                                onClick={() => { setOrderSortBy("oldest"); setOrderFilterOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] border-0 cursor-pointer transition-colors ${orderSortBy === "oldest" ? "bg-blue-50 text-blue-600 font-semibold" : "bg-transparent text-slate-700 hover:bg-slate-50"}`}
                              >
                                Oldest First
                              </button>
                              <button
                                type="button"
                                onClick={() => { setOrderSortBy("amount_high"); setOrderFilterOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] border-0 cursor-pointer transition-colors ${orderSortBy === "amount_high" ? "bg-blue-50 text-blue-600 font-semibold" : "bg-transparent text-slate-700 hover:bg-slate-50"}`}
                              >
                                Amount: High to Low
                              </button>
                              <button
                                type="button"
                                onClick={() => { setOrderSortBy("amount_low"); setOrderFilterOpen(false); }}
                                className={`w-full text-left px-3 py-2 rounded-xl text-[12.5px] border-0 cursor-pointer transition-colors ${orderSortBy === "amount_low" ? "bg-blue-50 text-blue-600 font-semibold" : "bg-transparent text-slate-700 hover:bg-slate-50"}`}
                              >
                                Amount: Low to High
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Sub-tabs: All Orders, Processing, Shipped, Delivered, Cancelled, Returned */}
                    <div className="flex items-center gap-7 sm:gap-11 border-b border-slate-200 mt-5 overflow-x-auto no-scrollbar">
                      {[
                        { key: "all", label: "All Orders" },
                        { key: "processing", label: "Processing" },
                        { key: "shipped", label: "Shipped" },
                        { key: "delivered", label: "Delivered" },
                        { key: "cancelled", label: "Cancelled" },
                        { key: "returned", label: "Returned" },
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          type="button"
                          onClick={() => {
                            console.log("[Dashboard My Orders] Switched sub-tab to:", tab.key);
                            setSelectedOrderTab(tab.key);
                          }}
                          className={`pb-3 text-[14px] transition-all whitespace-nowrap bg-transparent border-0 cursor-pointer -mb-px ${selectedOrderTab === tab.key
                            ? "text-blue-600 font-semibold border-b-2 border-blue-600"
                            : "text-slate-600 hover:text-slate-900 font-normal"
                            }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    {/* Orders Content Area */}
                    <div className="mt-6">
                      {filteredOrders.length === 0 ? (
                        <div className="text-center py-16 px-4">
                          <ShoppingBag size={44} className="text-slate-300 mx-auto mb-3" />
                          <h3 className="text-[14px] font-bold text-slate-800 m-0">No Orders Found</h3>
                          <p className="text-[12px] text-slate-500 mt-1 mb-4">
                            {orderSearchQuery
                              ? `No orders matching "${orderSearchQuery}".`
                              : selectedOrderTab !== "all"
                                ? `No ${selectedOrderTab} orders found.`
                                : "Explore our clinical catalogue and place your first order."}
                          </p>
                          {orderSearchQuery || selectedOrderTab !== "all" || orderSortBy !== "newest" ? (
                            <button
                              type="button"
                              onClick={() => {
                                setOrderSearchQuery("");
                                setSelectedOrderTab("all");
                                setOrderSortBy("newest");
                              }}
                              className="inline-block px-4 py-2 border border-slate-200 text-slate-700 font-semibold text-[12px] rounded-xl bg-white hover:bg-slate-50 cursor-pointer"
                            >
                              Reset Filters
                            </button>
                          ) : (
                            <Link
                              to="/"
                              className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold text-[12px] rounded-xl no-underline"
                            >
                              Start Shopping
                            </Link>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-4">
                          {filteredOrders.map(({ node: ord }) => (
                            <div
                              key={ord.id}
                              className="border border-slate-200 rounded-2xl p-5 hover:border-blue-300 transition-all shadow-xs bg-white flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-[16px] text-slate-900">
                                    Order #{ord.number}
                                  </span>
                                  <span
                                    className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${ord.status === "FULFILLED"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : ord.status === "CANCELED" || ord.status === "CANCELLED"
                                        ? "bg-red-50 text-red-700 border border-red-200"
                                        : "bg-blue-50 text-blue-700 border border-blue-200"
                                      }`}
                                  >
                                    {ord.status || "CONFIRMED"}
                                  </span>
                                </div>
                                <span className="text-[12px] text-slate-500">
                                  Placed on: {new Date(ord.created).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                </span>
                                <span className="text-[14px] font-extrabold text-slate-900 mt-1">
                                  ₹{totalValue(ord.total?.gross?.amount || 0)}
                                </span>
                              </div>

                              <div className="flex items-center gap-2.5 shrink-0">
                                <Link
                                  to={`/orderDetails/${ord.id}`}
                                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 font-semibold text-[12.5px] no-underline transition-all"
                                >
                                  View Details
                                </Link>

                                <button
                                  type="button"
                                  disabled={reorderLoadingId === ord.id}
                                  onClick={() => handleReorder(ord)}
                                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[12.5px] rounded-xl border-0 cursor-pointer transition-all disabled:opacity-50"
                                >
                                  {reorderLoadingId === ord.id ? "Adding..." : "Re-Order"}
                                </button>

                                {ord.invoices && ord.invoices[0]?.url && (
                                  <a
                                    href={ord.invoices[0].url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="p-2 border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-600 no-underline"
                                    title="Download Tax Invoice"
                                  >
                                    <ExternalLink size={16} />
                                  </a>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 4: Wishlist */}
                {activeTab === "wishlist" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm animate-in fade-in duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h1 className="text-[22px] font-bold text-slate-900 m-0">
                          My Wishlist
                        </h1>
                        <p className="text-[13px] text-slate-500 mt-1 mb-0">
                          Products you saved for quick clinic ordering
                        </p>
                      </div>
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                        {wishToken.length} Items
                      </span>
                    </div>

                    {wishToken.length === 0 ? (
                      <div className="text-center py-14 px-4 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                        <Heart size={40} className="text-slate-400 mx-auto mb-2" />
                        <h3 className="text-[14px] font-bold text-slate-800 m-0">Your Wishlist is Empty</h3>
                        <p className="text-[11px] text-slate-500 mt-1 mb-4">Save essential clinical supplies to buy whenever you need.</p>
                        <Link
                          to="/"
                          className="inline-block px-6 py-2.5 bg-blue-600 text-white font-semibold text-[12px] rounded-xl no-underline"
                        >
                          Explore Products
                        </Link>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-7 ml-3">
                        {wishlistData?.products?.edges?.map(({ node: prod }) => (
                          <ProductCard
                            key={prod.id}
                            product={prod}
                            isInWishlist={true}
                            onToggleWishlist={() => {
                              const updated = wishToken.filter(id => id !== prod.id);
                              localStorage.setItem("wishlistToken", JSON.stringify(updated));
                              window.dispatchEvent(new Event("wishlistUpdated"));
                              toast.success("Item removed from wishlist");
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 5: Rewards & Offers */}
                {activeTab === "rewards" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm animate-in fade-in duration-200">
                    <div className="mb-6">
                      <h1 className="text-[22px] font-bold text-slate-900 m-0">
                        Rewards &amp; Offers
                      </h1>
                      <p className="text-[13px] text-slate-500 mt-1 mb-0">
                        Redeem reward coins and active discount coupons on clinical supplies
                      </p>
                    </div>

                    {/* Loyalty Points Banner */}
                    <div className="hidden bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white mb-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <span className="text-xs uppercase tracking-wider font-bold text-emerald-200">
                          Available Balance
                        </span>
                        <h3 className="text-3xl font-extrabold mt-1 mb-0">
                          1,250 HegmaPoints
                        </h3>
                        <p className="text-xs text-emerald-100 mt-1 mb-0">
                          Worth ₹1,250 towards your next purchase. Automatically applies at checkout!
                        </p>
                      </div>
                      <Link
                        to="/"
                        className="px-5 py-2.5 bg-white text-emerald-800 font-bold text-xs rounded-xl no-underline hover:bg-emerald-50 transition-all shrink-0"
                      >
                        Redeem Now &rarr;
                      </Link>
                    </div>

                    {/* Coupons List */}
                    <h3 className="text-base font-bold text-slate-800 mb-3 mt-6">
                      Exclusive Practitioner Coupons
                    </h3>
                    <div className="hidden grid grid-cols-1 md:grid-cols-2 gap-4">

                    </div>
                  </div>
                )}

                {/* TAB 7: Settings & Security */}
                {activeTab === "settings" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 justify-center border border-slate-100 shadow-sm animate-in fade-in duration-200">

                    {/* Header */}
                    <div className="mb-4 ml-5">
                      <h1 className="text-[22px] font-bold text-slate-900 m-0">
                        Change Password
                      </h1>
                    </div>

                    {/* Password Card */}
                    <div className="w-full max-w-[450px] h-[305px] mx-5 p-4 sm:p-6 bg-white items-center border border-slate-200 rounded-2xl shadow-sm">

                      <div className="mb-2">
                        <h3 className="text-[15px] font-bold text-slate-800 mb-1">
                          Change Password
                        </h3>

                        <p className="text-[12px] text-slate-500 ">
                          Update your password to keep your account secure.
                        </p>
                      </div>

                      <form onSubmit={handleChangePassword}>

                        <div className="flex flex-col gap-3">

                          {/* Current Password */}
                          <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] items-center gap-2 sm:gap-4">

                            <label className="text-[12px] font-semibold text-slate-700">
                              Current Password
                            </label>

                            <div className="flex items-center gap-2 px-3 py-3 border border-slate-200 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white transition-all">

                              <Lock size={16} className="text-slate-400 shrink-0" />

                              <input
                                type={showOldPassword ? "text" : "password"}
                                required
                                autoComplete="current-password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Enter current password"
                                className="w-full min-w-0 text-[12px] text-slate-800 bg-transparent outline-none border-0 p-0 focus:ring-0"
                              />

                              <button
                                type="button"
                                onClick={() => setShowOldPassword((prev) => !prev)}
                                className="shrink-0 border-0 bg-transparent p-0 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                                aria-label={showOldPassword ? "Hide current password" : "Show current password"}
                              >
                                {showOldPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>

                            </div>
                          </div>

                          {/* New Password */}
                          <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] items-center gap-2 sm:gap-4">

                            <label className="text-[12px] font-semibold text-slate-700">
                              New Password
                            </label>

                            <div className="flex items-center gap-2 px-3 py-3 border border-slate-200 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white transition-all">

                              <Lock size={16} className="text-slate-400 shrink-0" />

                              <input
                                type={showNewPassword ? "text" : "password"}
                                required
                                minLength={8}
                                autoComplete="new-password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Minimum 8 characters"
                                className="w-full min-w-0 text-[12px] text-slate-800 bg-transparent outline-none border-0 p-0 focus:ring-0"
                              />

                              <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="shrink-0 border-0 bg-transparent p-0 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                                aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                              >
                                {showNewPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>

                            </div>
                          </div>

                          {/* Confirm New Password */}
                          <div className="grid grid-cols-1 sm:grid-cols-[140px_minmax(0,1fr)] items-center gap-2 sm:gap-4">

                            <label className="text-[12px] font-semibold text-slate-700">
                              Confirm New Password
                            </label>

                            <div className="flex items-center gap-2 px-3 py-3 border border-slate-200 rounded-xl focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-100 bg-white transition-all">

                              <Lock size={16} className="text-slate-400 shrink-0" />

                              <input
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                minLength={8}
                                autoComplete="new-password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                className="w-full min-w-0 text-[12px] text-slate-800 bg-transparent outline-none border-0 p-0 focus:ring-0"
                              />

                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="shrink-0 border-0 bg-transparent p-0 text-slate-400 hover:text-blue-600 cursor-pointer transition-colors"
                                aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                              >
                                {showConfirmPassword ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>

                            </div>
                          </div>

                        </div>

                        {/* Submit Button */}
                        <div className="mt-2 pt-2 border-t border-slate-100 flex justify-center mb-3">

                          <button
                            type="submit"
                            className="w-full sm:w-[180px] px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[12px] rounded-xl border-0 cursor-pointer transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2"
                          >
                            Update Password
                          </button>

                        </div>

                      </form>
                    </div>
                  </div>
                )}

                {/* TAB 8: Help & Support */}
                {activeTab === "help" && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm animate-in fade-in duration-200">
                    <div className="mb-4">
                      <h1 className="text-[22px] font-bold text-slate-900 m-0">
                        Help &amp; Support
                      </h1>
                      <p className="text-[13px] text-slate-500 mt-1 mb-0">
                        Direct support lines for hospitals, dental clinics &amp; practitioners
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col items-start gap-2">
                        <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center mb-1">
                          <Phone size={20} />
                        </div>
                        <h4 className="font-bold text-[12px] text-slate-900 m-0">Call Helpline</h4>
                        <p className="text-[11px] text-slate-500 m-0">Available Mon - Sat (9am - 7pm)</p>
                        <a href="tel:8553666877" className="text-[11px] font-bold text-blue-600 mt-1 no-underline">
                          +91 8553666877
                        </a>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col items-start gap-2">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
                          <MessageCircle size={18} />
                        </div>
                        <h4 className="font-bold text-[12px] text-slate-900 m-0">WhatsApp Support</h4>
                        <p className="text-[11px] text-slate-500 m-0">Instant responses for orders &amp; quotes</p>
                        <a
                          href="https://api.whatsapp.com/send?phone=918553666877"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-emerald-600 mt-1 no-underline"
                        >
                          Chat with Specialist &rarr;
                        </a>
                      </div>

                      <div className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 flex flex-col items-start gap-2 ">
                        <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-1">
                          <Mail size={18} />
                        </div>
                        <h4 className="font-bold text-[12px] text-slate-900 m-0">Email Support</h4>
                        <p className="text-[11px] text-slate-500 m-0">For institutional procurement enquiries</p>
                        <a href="mailto:support@hegmakart.com" className="text-[11px] font-bold text-purple-600 mt-1 no-underline">
                          support@hegmakart.com
                        </a>
                      </div>
                    </div>


                  </div>
                )}

                {/* Bottom Metrics / Stats Strip Card (Matches Mockup Exactly) */}
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
                      <button
                        type="button"
                        onClick={() => switchTab("orders")}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 hover:underline mt-0.5 bg-transparent border-0 p-0 cursor-pointer"
                      >
                        View all orders &rarr;
                      </button>
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
                      <button
                        type="button"
                        onClick={() => switchTab("rewards")}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 hover:underline mt-0.5 bg-transparent border-0 p-0 cursor-pointer"
                      >
                        View rewards &rarr;
                      </button>
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
                      <button
                        type="button"
                        onClick={() => switchTab("wishlist")}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-purple-600 hover:underline mt-0.5 bg-transparent border-0 p-0 cursor-pointer"
                      >
                        View wishlist &rarr;
                      </button>
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
                      <button
                        type="button"
                        onClick={() => switchTab("addresses")}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-orange-600 hover:underline mt-0.5 bg-transparent border-0 p-0 cursor-pointer"
                      >
                        Manage addresses &rarr;
                      </button>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </main>
      </div>
      {/* Address Add / Edit Modal */}
      {
        addressModalOpen && (
         <div
  className="fixed inset-0 z-[99999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden"
  onClick={() => setAddressModalOpen(false)}
>
           <div
  className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-hidden my-auto animate-in fade-in duration-200"
  onClick={(e) => e.stopPropagation()}
>
              <div className="flex items-start justify-between pb-3 mb-3 border-b border-slate-100">
                <div>
                  <h3 className="text-[16px] font-bold text-slate-900 mb-0.5 ">
                    {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
                  </h3>
                  <p className="text-[11px] text-slate-500 m-0 mt-1">
                    Enter exact location details for hospital/clinic supply delivery
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="w-12 h-12 rounded-full flex items-center justify-center text-slate-900 hover:text-slate-600 hover:bg-slate-100 transition-colors bg-transparent border-0 cursor-pointer"
                  aria-label="Close"
                >
                  <X size={30} />
                </button>
              </div>

              <form onSubmit={handleSaveAddress} className="flex flex-col gap-3 -mt-10">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">First Name *</label>
                    <input
                      type="text"
                      required
                      value={addrFirstName}
                      onChange={(e) => setAddrFirstName(e.target.value)}
                      className="w-full text-[11px] px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Last Name *</label>
                    <input
                      type="text"
                      required
                      value={addrLastName}
                      onChange={(e) => setAddrLastName(e.target.value)}
                      className="w-full text-[11px] px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={addrPhone}
                    onChange={(e) => setAddrPhone(e.target.value)}
                    placeholder="10-digit mobile number"
                    className="w-full text-[11px] px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Hospital / Clinic / Business Name</label>
                  <input
                    type="text"
                    value={addrCompany}
                    onChange={(e) => setAddrCompany(e.target.value)}
                    placeholder="Optional clinic name"
                    className="w-full text-[11px] px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Street Address 1 *</label>
                  <input
                    type="text"
                    required
                    value={addrStreet1}
                    onChange={(e) => setAddrStreet1(e.target.value)}
                    placeholder="House / building / street name"
                    className="w-full text-[11px] px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Street Address 2</label>
                  <input
                    type="text"
                    value={addrStreet2}
                    onChange={(e) => setAddrStreet2(e.target.value)}
                    placeholder="Apartment, suite, unit, floor"
                    className="w-full text-[11px] px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">City *</label>
                    <input
                      type="text"
                      required
                      value={addrCity}
                      onChange={(e) => setAddrCity(e.target.value)}
                      className="w-full text-[11px] px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      required
                      value={addrPincode}
                      onChange={(e) => setAddrPincode(e.target.value)}
                      placeholder="6-digit pincode"
                      className="w-full text-[11px] px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">State *</label>
                  <select
                    value={addrState}
                    onChange={(e) => setAddrState(e.target.value)}
                    required
                    className="w-full text-[11px] px-3.5 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white transition-all cursor-pointer"
                  >
                    <option value="">Select State</option>
                    <option value="ANDHRA PRADESH">ANDHRA PRADESH</option>
                    <option value="Arunachal Pradesh">Arunachal Pradesh</option>
                    <option value="Assam">Assam</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Chandigarh">Chandigarh</option>
                    <option value="Chhattisgarh">Chhattisgarh</option>
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

                <div className="flex items-center justify-end gap-3 pt-3 mt-0 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setAddressModalOpen(false)}
                    className="px-5 py-2 border border-slate-200 rounded-xl text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-semibold cursor-pointer border-0 shadow-xs transition-colors"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
      }
      <div className="hidden md:block">
        <Footer />
      </div>
    </>
  );
}