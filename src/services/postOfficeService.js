/**
 * Post Office API Service
 * Integrates with the Indian Postal PIN Code API and client-side reverse geocoding.
 */

const POSTAL_PINCODE_BASE_URL = "https://api.postalpincode.in";
const BIGDATACLOUD_BASE_URL = "https://api.bigdatacloud.net";
const NOMINATIM_BASE_URL = "https://nominatim.openstreetmap.org";
const REQUEST_TIMEOUT_MS = 10000;
const NOMINATIM_MIN_INTERVAL_MS = 1000;

let lastNominatimRequestAt = 0;
let nominatimRequestQueue = Promise.resolve();
let cachedNominatimResult = null;

class RequestError extends Error {}

const isValidPincode = (pincode) => /^[1-9]\d{5}$/.test(String(pincode).trim());

const requestJson = async (url) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      referrerPolicy: "strict-origin-when-cross-origin",
    });
    if (!response.ok) {
      throw new RequestError("The service is temporarily unavailable. Please try again.");
    }

    try {
      return await response.json();
    } catch (error) {
      throw new RequestError("We received an invalid response. Please try again.");
    }
  } catch (error) {
    if (error instanceof RequestError) {
      throw error;
    }
    if (error && error.name === "AbortError") {
      throw new RequestError("The request timed out. Please try again.");
    }
    throw new RequestError("Unable to connect. Please check your connection and try again.");
  } finally {
    clearTimeout(timeoutId);
  }
};

const getRequestFailureMessage = (error, fallback) => {
  if (error instanceof RequestError) {
    return error.message;
  }
  return fallback;
};

const getPostOffices = (data, noResultsMessage, expectedPincode) => {
  if (!Array.isArray(data) || !data[0] || typeof data[0] !== "object") {
    return {
      success: false,
      message: "We received an invalid response. Please try again.",
    };
  }

  const result = data[0];
  if (result.Status !== "Success") {
    return {
      success: false,
      message: noResultsMessage,
    };
  }

  const postOffices = Array.isArray(result.PostOffice)
    ? result.PostOffice.filter(
        (office) =>
          office &&
          typeof office === "object" &&
          !Array.isArray(office) &&
          typeof office.Name === "string" &&
          isValidPincode(office.Pincode) &&
          (!expectedPincode || String(office.Pincode).trim() === expectedPincode)
      )
    : [];

  if (postOffices.length === 0) {
    return {
      success: false,
      message: noResultsMessage,
    };
  }

  return {
    success: true,
    postOffices,
    message: result.Message || "Post offices found",
  };
};

const fetchNominatimResult = (url, cacheKey) => {
  const request = nominatimRequestQueue.then(async () => {
    if (cachedNominatimResult && cachedNominatimResult.key === cacheKey) {
      return cachedNominatimResult.data;
    }

    const waitMs = Math.max(
      0,
      NOMINATIM_MIN_INTERVAL_MS - (Date.now() - lastNominatimRequestAt)
    );
    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    lastNominatimRequestAt = Date.now();
    const data = await requestJson(url);
    cachedNominatimResult = { key: cacheKey, data };
    return data;
  });

  nominatimRequestQueue = request.then(
    () => undefined,
    () => undefined
  );
  return request;
};

/**
 * Fetch Post Office details by 6-digit Indian PIN code.
 * @param {string} pincode - 6-digit Indian Postal PIN Code
 * @returns {Promise<{success: boolean, postOffices?: Array, message: string}>}
 */
export const fetchByPincode = async (pincode) => {
  const cleanPin = String(pincode).trim();

  if (!isValidPincode(cleanPin)) {
    return {
      success: false,
      message: "Please enter a valid 6-digit PIN code",
    };
  }

  try {
    const data = await requestJson(
      `${POSTAL_PINCODE_BASE_URL}/pincode/${encodeURIComponent(cleanPin)}`
    );
    const result = getPostOffices(data, "No post office found for this PIN code", cleanPin);
    if (!result.success && result.message === "We received an invalid response. Please try again.") {
      console.warn("[PostOfficeService] India Post returned an invalid PIN lookup response");
    }
    return result;
  } catch (error) {
    console.error("[PostOfficeService] PIN lookup failed");
    return {
      success: false,
      message: getRequestFailureMessage(
        error,
        "Failed to fetch postal information. Please try again."
      ),
    };
  }
};

/**
 * Fetch Post Offices by branch, city, or locality name.
 * @param {string} query - Name of the branch, locality or city
 * @returns {Promise<{success: boolean, postOffices?: Array, message: string}>}
 */
export const fetchByPostOffice = async (query) => {
  const cleanQuery = String(query).trim();

  if (!cleanQuery || cleanQuery.length < 3) {
    return {
      success: false,
      message: "Please enter at least 3 characters to search",
    };
  }

  try {
    const data = await requestJson(
      `${POSTAL_PINCODE_BASE_URL}/postoffice/${encodeURIComponent(cleanQuery)}`
    );
    return getPostOffices(data, "No post office branch found with this name");
  } catch (error) {
    console.error("[PostOfficeService] Post office search failed");
    return {
      success: false,
      message: getRequestFailureMessage(error, "Failed to search post office branches."),
    };
  }
};

const getIndianPincodeFromBigDataCloud = async (latitude, longitude) => {
  const url = `${BIGDATACLOUD_BASE_URL}/data/reverse-geocode-client?latitude=${encodeURIComponent(
    latitude
  )}&longitude=${encodeURIComponent(longitude)}&localityLanguage=en`;
  const data = await requestJson(url);

  if (String(data && data.countryCode).toUpperCase() !== "IN") {
    return null;
  }

  const pincode = data && typeof data.postcode === "string" ? data.postcode.trim() : "";
  return {
    pincode: isValidPincode(pincode) ? pincode : "",
    city: (data && (data.city || data.locality)) || "",
  };
};

const getIndianPincodeFromNominatim = async (latitude, longitude) => {
  const cacheKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;
  const url = `${NOMINATIM_BASE_URL}/reverse?format=jsonv2&lat=${encodeURIComponent(
    latitude
  )}&lon=${encodeURIComponent(longitude)}&zoom=18&addressdetails=1`;
  const data = await fetchNominatimResult(url, cacheKey);
  const address = data && data.address;

  if (
    !address ||
    (String(address.country_code || "").toLowerCase() !== "in" &&
      String(address.country || "").toLowerCase() !== "india")
  ) {
    return null;
  }

  const rawPincode = typeof address.postcode === "string" ? address.postcode.trim() : "";
  return {
    pincode: isValidPincode(rawPincode) ? rawPincode : "",
    city: address.city || address.town || address.county || "",
  };
};

/**
 * Detect user's current GPS location and resolve a verified Indian postal PIN code.
 * @returns {Promise<{success: boolean, pincode?: string, postOffices?: Array, details?: object, message: string}>}
 */
export const detectCurrentLocation = () => {
  return new Promise((resolve) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      resolve({
        success: false,
        message: "Location detection is not supported by your browser.",
      });
      return;
    }

    try {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          let detectedLocation = null;

          try {
            detectedLocation = await getIndianPincodeFromBigDataCloud(latitude, longitude);
          } catch (error) {
            console.warn("[PostOfficeService] BigDataCloud reverse geocoding failed");
          }

          if (detectedLocation && detectedLocation.pincode) {
            try {
              const postOfficeResult = await fetchByPincode(detectedLocation.pincode);
              if (postOfficeResult.success) {
                resolve({
                  success: true,
                  pincode: detectedLocation.pincode,
                  postOffices: postOfficeResult.postOffices,
                  city: detectedLocation.city,
                  message: `Detected location near ${detectedLocation.city || detectedLocation.pincode}`,
                });
                return;
              }
            } catch (error) {
              console.warn("[PostOfficeService] Could not verify BigDataCloud PIN code");
            }
          }

          try {
            detectedLocation = await getIndianPincodeFromNominatim(latitude, longitude);
          } catch (error) {
            console.warn("[PostOfficeService] Nominatim reverse geocoding failed");
            detectedLocation = null;
          }

          if (!detectedLocation || !detectedLocation.pincode) {
            resolve({
              success: false,
              message:
                "Could not determine a valid Indian postal PIN code from your location. Please enter your PIN code manually.",
            });
            return;
          }

          const postOfficeResult = await fetchByPincode(detectedLocation.pincode);
          if (!postOfficeResult.success) {
            resolve({
              success: false,
              message:
                "We couldn't verify the PIN code for your location. Please enter your PIN code manually.",
            });
            return;
          }

          resolve({
            success: true,
            pincode: detectedLocation.pincode,
            postOffices: postOfficeResult.postOffices,
            city: detectedLocation.city,
            message: `Detected location near ${detectedLocation.city || detectedLocation.pincode}`,
          });
        },
        (geoError) => {
          let message = "Unable to retrieve your location. Please enter your PIN code.";
          if (geoError && geoError.code === 1) {
            message = "Location permission was denied. Please allow location access or enter your PIN code.";
          } else if (geoError && geoError.code === 2) {
            message = "Location information is unavailable. Please enter your PIN code.";
          } else if (geoError && geoError.code === 3) {
            message = "Location request timed out. Please try again.";
          }
          resolve({ success: false, message });
        },
        { timeout: REQUEST_TIMEOUT_MS, enableHighAccuracy: false, maximumAge: 60000 }
      );
    } catch (error) {
      resolve({
        success: false,
        message: "Unable to retrieve your location. Please enter your PIN code.",
      });
    }
  });
};

const getLocalStorage = () => {
  try {
    if (typeof window !== "undefined") {
      return window.localStorage;
    }
  } catch (error) {
    console.warn("[PostOfficeService] Browser storage is unavailable");
  }
  return null;
};

const dispatchLocationUpdated = (locationData) => {
  try {
    if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") {
      window.dispatchEvent(new CustomEvent("locationUpdated", { detail: locationData }));
    }
  } catch (error) {
    console.error("[PostOfficeService] Could not notify location listeners");
  }
};

/**
 * Retrieve saved location from localStorage.
 * @returns {object|null}
 */
export const getSavedLocation = () => {
  const storage = getLocalStorage();
  if (!storage) {
    return null;
  }

  try {
    const rawLocation = storage.getItem("delivery_location");
    if (rawLocation) {
      try {
        const parsed = JSON.parse(rawLocation);
        if (
          parsed &&
          typeof parsed === "object" &&
          !Array.isArray(parsed) &&
          isValidPincode(parsed.pincode)
        ) {
          return parsed;
        }
      } catch (error) {
        console.warn("[PostOfficeService] Saved location data is malformed");
      }
    }
  } catch (error) {
    console.warn("[PostOfficeService] Could not read saved location");
  }

  try {
    const legacyPin = storage.getItem("delivery_pincode");
    if (legacyPin) {
      const parts = legacyPin.split(" - ");
      const pin = parts[0] ? parts[0].trim() : "";
      const name = parts[1] ? parts[1].trim() : "";
      if (isValidPincode(pin)) {
        return {
          pincode: pin,
          name,
          district: name,
          state: "",
        };
      }
    }
  } catch (error) {
    console.warn("[PostOfficeService] Could not read legacy saved PIN code");
  }

  return null;
};

/**
 * Save selected location and notify listeners across the application.
 * @param {object} locationData - { pincode, name, district, state, block, branchType }
 */
export const saveLocation = (locationData) => {
  if (!locationData || !isValidPincode(locationData.pincode)) {
    return;
  }

  const storage = getLocalStorage();
  if (storage) {
    try {
      const displayArea = locationData.name || locationData.district || "";
      const legacyString = displayArea
        ? `${locationData.pincode} - ${displayArea}`
        : String(locationData.pincode);

      storage.setItem("delivery_pincode", legacyString);
      storage.setItem("delivery_location", JSON.stringify(locationData));
    } catch (error) {
      console.error("[PostOfficeService] Could not save selected location");
    }
  }

  dispatchLocationUpdated(locationData);
};

/**
 * Clear saved location and notify listeners.
 */
export const clearLocation = () => {
  const storage = getLocalStorage();
  if (storage) {
    try {
      storage.removeItem("delivery_pincode");
      storage.removeItem("delivery_location");
    } catch (error) {
      console.error("[PostOfficeService] Could not clear saved location");
    }
  }

  dispatchLocationUpdated(null);
};
