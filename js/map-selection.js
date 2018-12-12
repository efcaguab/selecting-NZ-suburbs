suburb_layer.on("click", select_unselect);

function select_unselect(x) {
  var feature_layer = x.layer;
  if (feature_layer.feature.properties.selected) {
    feature_layer.feature.properties.selected = false;
    feature_layer.setStyle({ color: "black" });
  } else {
    feature_layer.feature.properties.selected = true;
    feature_layer.setStyle({ color: "green" });
  }
}
