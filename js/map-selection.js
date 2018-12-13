suburb_layer.on("click", select_unselect);

var selected_style = {
  fillColor: "#252c65",
  fillOpacity: 1,
  strokeColor: "#252c65"
};

var selected_suburbs = [];

function select_unselect(x) {
  var feature_layer = x.layer;
  if (feature_layer.feature.properties.selected) {
    feature_layer.feature.properties.selected = false;
    feature_layer.setStyle(default_style);
    remove_selected_suburb(feature_layer);
    info.update();
  } else {
    feature_layer.feature.properties.selected = true;
    feature_layer.setStyle(selected_style);
    add_selected_suburb(feature_layer);
    info.update();
  }
}

function add_selected_suburb(feature_layer) {
  selected_suburbs.push(feature_layer.feature.properties.SA22018_V1_00_NAME);
}

function remove_selected_suburb(feature_layer) {
  selected_suburbs = selected_suburbs.filter(
    x => x != feature_layer.feature.properties.SA22018_V1_00_NAME
  );
}
