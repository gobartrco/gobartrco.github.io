  // Populate COUNTRY field from Cloudflare CF-IPCountry cookie
  (function() {
    const countryInput = document.getElementById('mce-COUNTRY');
    if (!countryInput) {
      return;
    }
    
    // Function to get cookie value by name
    function getCookie(name) {
      const value = '; ' + document.cookie;
      const parts = value.split('; ' + name + '=');
      if (parts.length === 2) {
        return parts.pop().split(';').shift();
      }
      return null;
    }
    
    // Read the CF-IPCountry cookie
    const countryCode = getCookie('CF-IPCountry');
    if (countryCode && countryInput) {
      countryInput.value = countryCode;
    }
  })();