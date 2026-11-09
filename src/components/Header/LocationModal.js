import React, { useState, useEffect } from "react";
import {
  MapPin,
  Search,
  Navigation,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  ChevronRight,
  Truck
} from "lucide-react";
import { toast } from "sonner";
import {
  fetchByPincode,
  fetchByPostOffice,
  detectCurrentLocation,
  saveLocation,
  getSavedLocation,
  clearLocation
} from "../../services/postOfficeService";

const LocationModal = ({ isOpen, onClose }) => {
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [postOffices, setPostOffices] = useState([]);
  const [activeLocation, setActiveLocation] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const current = getSavedLocation();
      console.log("[LocationModal] Opened. Current location in storage:", current);
      setActiveLocation(current);
      setErrorMessage("");
      setPostOffices([]);
      setSearchInput(current?.pincode || "");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const query = searchInput.trim();
    console.log("[LocationModal] Initiating search for:", query);

    if (!query) {
      setErrorMessage("Please enter a PIN code or area name.");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");
    setPostOffices([]);

    let res;
    if (/^\d{6}$/.test(query)) {
      res = await fetchByPincode(query);
    } else if (/^\d+$/.test(query)) {
      setIsLoading(false);
      setErrorMessage("Indian Postal PIN code must be exactly 6 digits.");
      return;
    } else {
      res = await fetchByPostOffice(query);
    }

    setIsLoading(false);
    console.log("[LocationModal] Search result:", res);

    if (res.success && res.postOffices?.length > 0) {
      if (/^\d{6}$/.test(query)) {
        handleSelectBranch(res.postOffices[0]);
      } else {
        setPostOffices(res.postOffices);
      }
    } else {
      setErrorMessage(res.message || "No post offices found. Please try another PIN code or area.");
    }
  };

  const handleSelectBranch = (branch) => {
    console.log("[LocationModal] Branch selected:", branch);
    const locationData = {
      pincode: branch.Pincode,
      name: branch.Name?.trim(),
      district: branch.District,
      state: branch.State,
      block: branch.Block,
      branchType: branch.BranchType,
      deliveryStatus: branch.DeliveryStatus
    };

    saveLocation(locationData);
    setActiveLocation(locationData);
    toast.success(`Delivering to ${locationData.name} (${locationData.pincode})`);
    onClose();
  };

  const handleDetectGPS = async () => {
    console.log("[LocationModal] User clicked Detect GPS location");
    setIsDetectingGps(true);
    setErrorMessage("");
    setPostOffices([]);

    const res = await detectCurrentLocation();
    setIsDetectingGps(false);
    console.log("[LocationModal] GPS Detection result:", res);

    if (res.success && res.postOffices?.length > 0) {
      handleSelectBranch(res.postOffices[0]);
    } else if (res.success && res.pincode) {
      const locationData = {
        pincode: res.pincode,
        name: res.city || "",
        district: res.city || "",
        state: ""
      };
      saveLocation(locationData);
      setActiveLocation(locationData);
      toast.success(`Delivering to ${res.city || res.pincode}`);
      onClose();
    } else {
      setErrorMessage(res.message || "Could not detect location. Please enter PIN code manually.");
      toast.error(res.message || "Location detection failed");
    }
  };

  const handleClearLocation = () => {
    console.log("[LocationModal] Clearing location");
    clearLocation();
    setActiveLocation(null);
    setSearchInput("");
    setPostOffices([]);
    toast.info("Delivery location cleared");
  };

  return (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Card */}
      <div
        className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col transform transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center gap-2.5">

            <div className="flex items-center gap-2.5">
              <img
                src="/assets/images/logoHegma.png"
                alt="Hegma Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-16 h-16 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors border-0 bg-transparent cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        <div className="flex items-center gap-4 px-6 pt-2 pb-1">
          <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
            <img
              src="/landing/img/icons/location-icon.svg"
              alt="Location"
              className="w-7 h-7 object-contain"
            />
          </div>

          <div>
            <h2 className="text-[12px] font-bold text-slate-900 leading-tight mb-1">
              Choose Delivery Location
            </h2>

            <p className="text-base text-slate-500 m-0">
              Check product availability and estimated delivery time.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="pt-2 pl-5 pr-5 overflow-y-auto space-y-1 flex-1">
          {/* Active Saved Location */}
          {activeLocation && (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl p-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wide">
                    Currently Selected
                  </div>
                  <div className="text-sm font-bold text-slate-900 truncate">
                    {activeLocation.name ? `${activeLocation.name}, ` : ""}{activeLocation.district || ""}{" "}
                    <span className="text-emerald-700 font-mono">({activeLocation.pincode})</span>
                  </div>
                  {activeLocation.state && (
                    <div className="text-[11px] text-slate-600 truncate">
                      {activeLocation.state}, India
                    </div>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={handleClearLocation}
                className="text-xs text-slate-500 hover:text-red-600 font-medium underline shrink-0 cursor-pointer bg-transparent border-0"
              >
                Clear
              </button>
            </div>
          )}

          {/* Detect Location Button */}
          <button
            type="button"
            onClick={handleDetectGPS}
            disabled={isDetectingGps}
            className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold transition-all hover:border-slate-300 shadow-2xs active:scale-[0.99] disabled:opacity-60 cursor-pointer"
          >
            {isDetectingGps ? (
              <>
                <Loader2 size={16} className="animate-spin text-orange-500" />
                <span>Detecting your location...</span>
              </>
            ) : (
              <>
                <Navigation size={16} className="text-blue-600 fill-blue-600" />
                <span>Use current location (GPS)</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center justify-center my-2 pb-2">
            <hr className="flex-1 border-0 border-t border-slate-300 m-0" />

            <span className="px-2 text-[8px] font-medium text-slate-400 uppercase">
              Or
            </span>

            <hr className="flex-1 border-0 border-t border-slate-300 m-0" />
          </div>

          {/* Search Input Form */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter 6-digit PIN code "
                className="w-full pl-5 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all"
                maxLength={30}
              />
              <Search
                size={16}
                className="absolute left-1 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchInput.trim()}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Searching</span>
                </>
              ) : (
                <span>Check</span>
              )}
            </button>
          </form>

          {/* Error / Alert Message */}
          {errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-xs font-medium rounded-xl border border-red-100">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-500" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Post Office Results List */}
          {postOffices.length > 0 && (
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-600 px-1">
                <span>Select your Post Office Branch ({postOffices.length} found):</span>
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1.5 pr-1 divide-y divide-slate-50">
                {postOffices.map((office, idx) => {
                  const isDelivery = office.DeliveryStatus?.toLowerCase() === "delivery";
                  const isCurrent =
                    activeLocation?.pincode === office.Pincode &&
                    activeLocation?.name?.toLowerCase() === office.Name?.trim()?.toLowerCase();

                  return (
                    <div
                      key={`${office.Pincode}-${office.Name}-${idx}`}
                      onClick={() => handleSelectBranch(office)}
                      className={`group flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${isCurrent
                        ? "bg-blue-50/70 border-blue-200"
                        : "bg-white hover:bg-slate-50 border-slate-100 hover:border-slate-200"
                        }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${isCurrent
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                            }`}
                        >
                          <Building2 size={14} />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-800 truncate">
                              {office.Name}
                            </span>
                            <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                              {office.Pincode}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {office.District}, {office.State}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${isDelivery
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                        >
                          <Truck size={10} />
                          {isDelivery ? "Delivery" : "Non-Delivery"}
                        </span>
                        <ChevronRight
                          size={14}
                          className="text-slate-300 group-hover:text-slate-600 transition-colors"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quick Informational Note */}
          <div className="text-[11px] text-slate-400 text-center pt-2">
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
