// This file handles the display of suburbs layer in the map

// Define the url from which the suburbs will be obtained, we are using "Statistical Area 2 2018 clipped (generalised)". More information can be found at https://datafinder.stats.govt.nz/layer/92213-statistical-area-2-2018-clipped-generalised/
var api_url =
  "https://datafinder.stats.govt.nz/services/query/v1/vector.json?key=437b19e49aa74bebb8d272a32fd2264a&layer=92213";
// Creates an empty layer to display geoJson data
var suburb_layer = L.geoJson();
var loaded_suburbs_id = []; // stores the list of ids of the suburbs that have been displayed
pull_suburbs();

// Construct the url for the request, pull and draw the data
function pull_suburbs(m) {
  var map_center = map.getCenter(),
    // construct the request address
    map_radius = get_radius_from_bounds(),
    request_url =
      api_url +
      "&x=" +
      map_center.lng +
      "&y=" +
      map_center.lat +
      "&max_results=30&radius=10000&geometry=true&with_field_names=true";
  // fetch the geoJson data and draw the suburbs when they have been obtained
  d3.json(request_url).then(draw_suburbs);
}

function get_radius_from_bounds() {}

// draws features obtained from the API while checking that they have not been drawn before
function draw_suburbs(data) {
  // data obtained from StatsNZ have a header with metainfo of the geoJson data this need to be removed before can be passed to other functions
  suburbs_json = data.vectorQuery.layers;
  suburbs_json = suburbs_json[Object.keys(suburbs_json)[0]];
  // we use the id's of the features (subirbs) to determine if they should be plotted or not
  var this_ids = get_suburb_ids_from_geojson(suburbs_json),
    // remove features from the geoJson that have been drawn vefire
    filtered_suburbs_json = filter_geojson(suburbs_json),
    // get ids of the features to draw
    filtered_ids = get_suburb_ids_from_geojson(filtered_suburbs_json);
  // add the ids of the features to draw to the global list of drawn features
  loaded_suburbs_id = loaded_suburbs_id.concat(filtered_ids);
  // ada data to the geoJson layer in the map
  suburb_layer = suburb_layer.addData(suburbs_json);
  // redraw the geoJson layer
  suburb_layer = suburb_layer.addTo(map);
}

// get feature ids from a geoJson file
function get_suburb_ids_from_geojson(geojson) {
  // this function uses arrow functions. Check https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions for more info
  return geojson.features.map(x => x.id);
}

// remove featyres from the geoJson that have been drawn already
function filter_geojson(geojson) {
  var filtered_features = geojson.features.filter(
    x => !loaded_suburbs_id.includes(x.id)
  );
  geojson.features = filtered_features;
  return geojson;
}

// Pull the suburbs everytime user moves the map, zooms in/out or the map is reloaded
map.on("moveend", pull_suburbs);
map.on("zoomend", pull_suburbs);
map.on("viewreset", pull_suburbs);
