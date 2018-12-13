var send_button = L.easyButton("xxx", function(control) {
  alert('"expensive query here"');
});
send_button.addTo(map);
