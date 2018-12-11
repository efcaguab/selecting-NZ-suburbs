var api_url =
  "https://datafinder.stats.govt.nz/services/query/v1/vector.json?key=437b19e49aa74bebb8d272a32fd2264a&layer=92213&x=";
var suburb_layer = L.geoJson();
var loaded_suburbs_id = [];
pull_suburbs();

function pull_suburbs(m) {
  var map_center = map.getCenter(),
    request_url =
      api_url +
      map_center.lng +
      "&y=" +
      map_center.lat +
      "&max_results=10&radius=10000&geometry=true&with_field_names=true";
  d3.json(request_url).then(draw_suburbs);
}

function draw_suburbs(data) {
  suburbs_json = data.vectorQuery.layers;
  suburbs_json = suburbs_json[Object.keys(suburbs_json)[0]];
  var this_ids = get_suburb_ids_from_geojson(suburbs_json),
    filtered_suburbs_json = filter_geojson(suburbs_json),
    filtered_ids = get_suburb_ids_from_geojson(filtered_suburbs_json);
  loaded_suburbs_id = loaded_suburbs_id.concat(filtered_ids);
  suburb_layer = suburb_layer.addData(suburbs_json);
  suburb_layer = suburb_layer.addTo(map);
}

function get_suburb_ids_from_geojson(geojson) {
  var feature_ids = [],
    feature_keys = Object.keys(geojson.features),
    number_of_features = feature_keys.length;

  for (var i = 0, len = number_of_features; i < number_of_features; i++) {
    feature_ids[i] = geojson.features[feature_keys[i]].id;
  }
  return feature_ids;
}

function filter_geojson(geojson) {
  var this_features = geojson.features,
    filtered_features = this_features.filter(
      x => !loaded_suburbs_id.includes(x.id)
    );
  geojson.features = filtered_features;
  return geojson;
}

// Events
map.on("moveend", pull_suburbs);
