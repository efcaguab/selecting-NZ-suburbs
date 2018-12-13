var control = L.control.geonames({
  //position: 'topcenter',  // in addition to standard 4 corner Leaflet control layout, this will position and size from top center
  geonamesURL: "//api.geonames.org/searchJSON", // override this if using a proxy to get connection to geonames
  username: "cbi_spatial", // Geonames account username.  Must be provided
  zoomLevel: 13, // Max zoom level to zoom to for location.  If null, will use the map's max zoom level.
  maxresults: 5, // Maximum number of results to display per search
  className: "leaflet-geonames-icon", //class for icon
  workingClass: "leaflet-geonames-icon-working", //class for search underway
  featureClasses: ["A", "P"], // feature classes to search against.  See: http://www.geonames.org/export/codes.html
  baseQuery: "isNameRequired=true", // The core query sent to GeoNames, later combined with other parameters above
  position: "topcenter",
  showMarker: true, //Show a marker at the location the selected location
  showPopup: false, //Show a tooltip at the selected location
  adminCodes: {
    // filter results by a country and state.  Values can be strings or return by a function.
    country: "nz"
    // adminCode1: function () { return 'wa' }
  },
  lang: "en", // language for results
  bbox: { east: 179.5, west: 164, north: -30, south: -50 }, // bounding box filter for results (e.g., map extent).  Values can be an object with east, west, north, south, or a function that returns that object.
  alwaysOpen: true, //if true, search field is always visible
  enablePostalCodes: false // if true, use postalCodesRegex to test user provided string for a postal code.  If matches, then search against postal codes API instead.
  // postalCodesRegex: POSTALCODE_REGEX_US // regex used for testing user provided string for a postal code.  If this test fails, the default geonames API is used instead.
});
map.addControl(control);
