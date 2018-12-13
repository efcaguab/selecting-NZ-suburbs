// This file creates the base leaflet map

// Create a blank map and place it in the div with id="map"
// Set the default position and zoom of the map
var map = L.map("map", {
  zoomControl: false
}).setView([-41.28666552, 174.772996908], 14);

// Create a new layer for the map for the tiles
L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}",
  {
    attribution:
      'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: "abcd",
    minZoom: 10, // zooms have been chosen match the ranges of suburb sizes
    maxZoom: 17,
    ext: "png"
  }
).addTo(map); // add the recently created layer to the blank map we created before
// We have now a base map with tiles

L.control
  .zoom({
    position: "bottomright"
  })
  .addTo(map);
