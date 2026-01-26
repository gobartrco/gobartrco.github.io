(function () {
  "use strict";

  // Helper function to get a cookie value by name
  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  }

  // Helper function to set a cookie
  function setCookie(name, value, days, domain) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/;domain=${domain};SameSite=Lax`;
    document.cookie = cookieString;
  }

  // Helper function to extract root domain (e.g., ".bartr.co" from "bartr.co" or "app.bartr.co")
  function getRootDomain() {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

    // If it's already a root domain (e.g., "bartr.co"), return it with a dot prefix
    if (parts.length === 2) {
      return `.${hostname}`;
    }

    // If it's a subdomain (e.g., "app.bartr.co"), extract the root domain
    if (parts.length > 2) {
      return `.${parts.slice(-2).join(".")}`;
    }

    // Fallback for localhost or other cases
    return hostname;
  }

  // Helper function to get query string parameter
  function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  // Check for discountCode in query string
  const queryDiscountCode = getQueryParam("discountCode");

  if (queryDiscountCode) {
    // Set cookie with 24-hour expiration and root domain scope
    const rootDomain = getRootDomain();
    setCookie("discountCode", queryDiscountCode, 1, rootDomain);
  }

  // Get the saved discount code from cookie
  const savedDiscountCode = getCookie("discountCode");

  let discountCode;

  if (savedDiscountCode) {
    // Use saved discount code if it exists
    discountCode = savedDiscountCode;
  } else {
    discountCode = null;
  }

  // Check for discountToken in query string
  const queryDiscountToken = getQueryParam("discountToken");

  if (queryDiscountToken) {
    // Set cookie with 24-hour expiration and root domain scope
    const rootDomain = getRootDomain();
    setCookie("discountToken", queryDiscountToken, 1, rootDomain);
  }

  // Get the saved discount token from cookie
  const savedDiscountToken = getCookie("discountToken");

  let discountToken;

  if (savedDiscountToken) {
    // Use saved discount token if it exists
    discountToken = savedDiscountToken;
  } else {
    discountToken = null;
  }
})();
