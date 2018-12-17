var info = L.control({ position: "topcenter" });

info.onAdd = function(map) {
  this._div = L.DomUtil.create("div", "info"); // create a div with a class "info"
  this.update();
  return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function() {
  if (selected_suburbs.length == 0) {
    text_display =
      "Click to select the suburbs where is OK to live. Click again to unselect. Hit the paper plane when done.";
    send_button.disable();
  } else {
    text_display = "You've selected: " + selected_suburbs.join(" \u00B7 ");
    send_button.enable();
  }
  this._div.innerHTML = "<h4>NZ Suburbs</h4>" + text_display;
};

info.addTo(map);
