suburb_layer
  .bindTooltip(function(this_layer) {
    var suburb_name = this_layer.feature.properties.SA22018_V1_00_NAME;
    return suburb_name;
  })
  .addTo(map);

// suburb_layer
//   .onEachFeature(function (this_layer) {
//     var suburb_name = this_layer.feature.properties.SA22018_V1_00_NAME;
//     mouseover: highlightFeature,
//       mouseout: resetHighlight
//   });
