var send_button = L.easyButton(
  "fa-paper-plane",
  function(control) {
    alert('"suburb info sent"');
  },
  "send data",
  {
    position: "bottomright"
  }
);
send_button.addTo(map);

// send_bu.on("zoomend", function(e) {
//   if (e.target.getZoom() > 13) {
//     findCoffee.enable();
//   } else {
//     findCoffee.disable();
//   }
// });
