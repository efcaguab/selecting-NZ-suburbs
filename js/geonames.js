var ADMIN_CODES = [
    "country",
    "adminCode1",
    "adminCode2",
    "adminCode3",
    "continentCode"
  ],
  BBOX = ["east", "west", "north", "south"],
  POSTALCODE_REGEX_US = /^\d{5}(-\d{4})?$/,
  POSTALCODE_REGEX_UK = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) [0-9][A-Za-z]{2})$/;
(L.Control.Geonames = L.Control.extend({
  includes: L.Evented ? L.Evented.prototype : L.Mixin.Events,
  _active: !1,
  _resultsList: null,
  _marker: null,
  _popup: null,
  _hasResults: !1,
  options: {
    geonamesSearch: "https://secure.geonames.org/searchJSON",
    geonamesPostalCodesSearch:
      "https://secure.geonames.org/postalCodeSearchJSON",
    username: "",
    maxresults: 5,
    zoomLevel: null,
    className: "leaflet-geonames-icon",
    workingClass: "leaflet-geonames-icon-working",
    featureClasses: ["A", "H", "L", "P", "R", "T", "U", "V"],
    baseQuery: "isNameRequired=true",
    position: "topleft",
    showMarker: !0,
    showPopup: !0,
    adminCodes: {},
    bbox: {},
    lang: "en",
    alwaysOpen: !1,
    enablePostalCodes: !1,
    postalCodesRegex: POSTALCODE_REGEX_US
  },
  onAdd: function(s) {
    "topcenter" == this.options.position &&
      (s._controlCorners.topcenter = L.DomUtil.create(
        "div",
        "leaflet-top leaflet-center",
        s._controlContainer
      )),
      (this._container = L.DomUtil.create(
        "div",
        "leaflet-geonames-search leaflet-bar"
      )),
      L.DomEvent.disableClickPropagation(this._container);
    var t = (this._link = L.DomUtil.create(
      "a",
      this.options.className,
      this._container
    ));
    (t.href = "#"), (t.title = "Search by location name or postcode");
    var e = L.DomUtil.create("form", "", this._container);
    L.DomEvent.addListener(e, "submit", this._search, this);
    var o = (this._input = L.DomUtil.create("input", "", e));
    return (
      (o.type = "search"),
      (o.placeholder =
        "Search for a suburb" +
        (this.options.enablePostalCodes ? " or postal codes" : "")),
      (this._url = this.options.geonamesSearch),
      (this._resultsList = L.DomUtil.create("ul", "", this._container)),
      L.DomEvent.on(
        o,
        "keyup change search",
        function(s) {
          "search" === s.type &&
            (L.DomUtil.removeClass(this._resultsList, "hasResults"),
            L.DomUtil.removeClass(this._resultsList, "noResults"),
            (this._hasResults = !1),
            (this._resultsList.innerHTML = ""),
            this.removeMarker(),
            this.removePopup());
        },
        this
      ),
      L.DomEvent.on(
        o,
        "focus",
        function() {
          this.active || this.show();
        },
        this
      ),
      this.options.alwaysOpen
        ? ((this._active = !0),
          L.DomUtil.addClass(this._container, "active"),
          L.DomEvent.on(t, "click", this.show, this))
        : L.DomEvent.on(
            t,
            "click",
            function() {
              this._active ? this.hide() : this.focus();
            },
            this
          ),
      s.on(
        "click",
        function(s) {
          s.originalEvent instanceof KeyboardEvent ||
            (this.options.alwaysOpen ? this.hideResults() : this.hide());
        },
        this
      ),
      this._container
    );
  },
  addPoint: function(s) {
    var t = this;
    this.removeMarker(), this.removePopup();
    var e = this._getNameParts(s).join(", "),
      o = parseFloat(s.lat),
      i = parseFloat(s.lng);
    if (this.options.showMarker || this.options.showPopup) {
      var n = this.options.zoomLevel || this._map.getMaxZoom();
      this._map.setView([o, i], n, !1);
    }
    this.options.showMarker
      ? ((this._marker = L.marker([o, i]).addTo(this._map)),
        this.options.showPopup &&
          (this._marker.bindPopup(e),
          this._marker.openPopup(),
          this._marker.on("popupclose", function() {
            t._onPopupClosed();
          })))
      : this.options.showPopup &&
        (this._popup = L.popup()
          .setLatLng([o, i])
          .setContent(e)
          .openOn(this._map)
          .on("remove", function() {
            t._onPopupClosed();
          }));
  },
  show: function() {
    (this._active = !0),
      L.DomUtil.addClass(this._container, "active"),
      this._hasResults
        ? L.DomUtil.addClass(this._resultsList, "hasResults")
        : L.DomUtil.addClass(this._resultsList, "noResults");
  },
  hide: function() {
    (this._active = !1),
      L.DomUtil.removeClass(this._container, "active"),
      this.hideResults();
  },
  hideResults: function() {
    L.DomUtil.removeClass(this._resultsList, "hasResults"),
      L.DomUtil.removeClass(this._resultsList, "noResults");
  },
  focus: function() {
    this.show(), this._input.focus();
  },
  _close: function() {
    this.hide(), this.removeMarker(), this.removePopup();
  },
  removeMarker: function() {
    null != this._marker &&
      (this._map.removeLayer(this._marker), (this._marker = null));
  },
  removePopup: function() {
    null != this._popup &&
      (this._map.closePopup(this._popup), (this._popup = null));
  },
  _onPopupClosed: function() {
    this._close(),
      (this._input.value = ""),
      (this._hasResults = !1),
      (this._resultsList.innerHTML = "");
  },
  _search: function(s) {
    var t, e, o;
    L.DomEvent.preventDefault(s),
      L.DomUtil.addClass(this._link, this.options.workingClass),
      L.DomUtil.removeClass(this._resultsList, "noResults"),
      (this._hasResults = !1),
      (this._resultsList.innerHTML = "");
    var i = this._input.value,
      n = { lang: this.options.lang },
      a = "";
    for (e in (this.options.enablePostalCodes &&
    this.options.postalCodesRegex.test(i)
      ? ((o = this.options.geonamesPostalCodesSearch),
        (n.postalcode = i),
        (n.isReduced = !1))
      : ((o = this.options.geonamesSearch),
        (n.q = i),
        this.options.featureClasses &&
          this.options.featureClasses.length &&
          (a +=
            "&" +
            this.options.featureClasses
              .map(function(s) {
                return "featureClass=" + s;
              })
              .join("&"))),
    this.options.adminCodes))
      if (-1 != ADMIN_CODES.indexOf(e)) {
        var r = this.options.adminCodes[e];
        n[e] = "function" == typeof r ? r() : r;
      }
    var l =
      "function" == typeof this.options.bbox
        ? this.options.bbox()
        : this.options.bbox;
    for (t in BBOX)
      if (!l[BBOX[t]]) {
        l = null;
        break;
      }
    if (l) for (t in BBOX) n[(e = BBOX[t])] = l[e];
    this.fire("search", { params: n });
    var h = {
        username: this.options.username,
        maxRows: this.options.maxresults,
        style: "LONG"
      },
      u = o + "?" + this._objToQuery(h) + "&" + this._objToQuery(n) + a;
    this.options.baseQuery && (u += "&" + this.options.baseQuery);
    var p = this,
      c = "geonamesSearchCallback";
    this._jsonp(
      u,
      function(s) {
        document.body.removeChild(document.getElementById("getJsonP")),
          delete window[c],
          p._processResponse(s);
      },
      c
    );
  },
  _objToQuery: function(s) {
    var t = [];
    for (var e in s)
      s.hasOwnProperty(e) &&
        t.push(encodeURIComponent(e) + "=" + encodeURIComponent(s[e]));
    return t.join("&");
  },
  _jsonp: function(s, t, e) {
    (e = e || "jsonpCallback"), (window[e] = t), (s += "&callback=" + e);
    var o = document.createElement("script");
    (o.id = "getJsonP"),
      (o.src = s),
      (o.async = !0),
      document.body.appendChild(o);
  },
  _processResponse: function(s) {
    var t, i;
    (void 0 !== s.geonames
      ? (t = s.geonames)
      : void 0 !== s.postalCodes && (t = s.postalCodes),
    L.DomUtil.removeClass(this._link, this.options.workingClass),
    0 < t.length)
      ? (L.DomUtil.addClass(this._resultsList, "hasResults"),
        (this._hasResults = !0),
        t.forEach(function(s) {
          i = L.DomUtil.create("li", "", this._resultsList);
          var t = this._getNameParts(s),
            e = t.slice(0, 2).join(", "),
            o = 2 < t.length ? "<br/><em>" + t[2] + "</em>" : "";
          (i.innerHTML = e + o),
            L.DomEvent.addListener(
              i,
              "click",
              function() {
                (this._input.value = e),
                  this.options.alwaysOpen ? this.hideResults() : this.hide(),
                  this.fire("select", { geoname: s }),
                  this.addPoint(s);
              },
              this
            );
        }, this))
      : (L.DomUtil.addClass(this._resultsList, "noResults"),
        ((i = L.DomUtil.create("li", "", this._resultsList)).innerText =
          "No results found"));
  },
  _getNameParts: function(t) {
    var e,
      o = [];
    return (
      void 0 !== t.name
        ? o.push(t.name)
        : void 0 !== t.postalCode && o.push(t.postalCode),
      ["adminName1", "adminName2", "countryName", "countryCode"].forEach(
        function(s) {
          (e = t[s]) && "" != e && e != o[0] && o.push(e);
        },
        this
      ),
      o
    );
  }
})),
  (L.control.geonames = function(s) {
    return new L.Control.Geonames(s);
  });
