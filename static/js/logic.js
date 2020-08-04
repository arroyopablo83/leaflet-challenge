//var mymap = L.map('map-id').setView([51.505, -0.09], 13);

// var mymap = L.map("map-id", {
//     center: [40.7, -73.95],
//     zoom: 11
//   });

// Create the map with our layers


// L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
//     attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
//     maxZoom: 18,
//     id: 'mapbox/streets-v11',
//     tileSize: 512,
//     zoomOffset: -1,
//     accessToken: API_KEY
// }).addTo(map);


// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
   maxZoom: 3,
   id: "light-v10",
   accessToken: API_KEY
 });

 var graymap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// satellite background.
var satellitemap_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");

// outdoors background.
var outdoors_background = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v9/tiles/256/{z}/{x}/{y}?" +
  "access_token=pk.eyJ1IjoibWFudWVsYW1hY2hhZG8iLCJhIjoiY2ppczQ0NzBtMWNydTNrdDl6Z2JhdzZidSJ9.BFD3qzgAC2kMoEZirGaDjA");



// Initialize all of the LayerGroups we'll be using
var layers = {
  tectonicplates: new L.LayerGroup(),
  earthquakes: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map-id", {
    center: [40.73, -74.0059],
    zoom: 12,
    layers: [lightmap, graymap_background, satellitemap_background, outdoors_background]
  });
  
// // Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  Satellite: satellitemap_background,
  Grayscale: graymap_background,
  Outdoors: outdoors_background
};

// overlays 
var overlayMaps = {
  "Tectonic Plates": layers.tectonicplates,
  "Earthquakes": layers.earthquakes
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(overlays, overlayMaps).addTo(map);

// Create a legend to display information about our map
var info = L.control({
   position: "bottomright"
 });



// // Initialize an object containing icons for each layer group
// // var icons = {
// //   COMING_SOON: L.ExtraMarkers.icon({
// //     icon: "ion-settings",
// //     iconColor: "white",
// //     markerColor: "yellow",
// //     shape: "star"
// //   }),
// //   EMPTY: L.ExtraMarkers.icon({
// //     icon: "ion-android-bicycle",
// //     iconColor: "white",
// //     markerColor: "red",
// //     shape: "circle"
// //   }),
// //   OUT_OF_ORDER: L.ExtraMarkers.icon({
// //     icon: "ion-minus-circled",
// //     iconColor: "white",
// //     markerColor: "blue-dark",
// //     shape: "penta"
// //   }),
// //   LOW: L.ExtraMarkers.icon({
// //     icon: "ion-android-bicycle",
// //     iconColor: "white",
// //     markerColor: "orange",
// //     shape: "circle"
// //   }),
// //   NORMAL: L.ExtraMarkers.icon({
// //     icon: "ion-android-bicycle",
// //     iconColor: "white",
// //     markerColor: "green",
// //     shape: "circle"
// //   })
// // };

// Perform an API call to the Citi Bike Station Information endpoint
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(infoRes) {

  // Estilo Principal para el redondeo
  function styleInfo(feature) {
    return {
      opacity: 1,
      fillOpacity: 1,
      fillColor: getColor(feature.properties.mag),
      color: "#000000",
      radius: getRadius(feature.properties.mag),
      stroke: true,
      weight: 0.5
    };
  }

  // Aqui es para definir el color dependiendo de la magnitud y lo mandamos al estilo de arriba
  function getColor(magnitude) {
    switch (true) {
      case magnitude > 5:
        return "#ea2c2c";
      case magnitude > 4:
        return "#ea822c";
      case magnitude > 3:
        return "#ee9c00";
      case magnitude > 2:
        return "#eecc00";
      case magnitude > 1:
        return "#d4ee00";
      default:
        return "#98ee00";
    }
  }

  // Se define el radio del marcador y lo mandamos al estilo de arriba

  function getRadius(magnitude) {
    if (magnitude === 0) {
      return 1;
    }

    return magnitude * 3;
  }

  // Este es el que nos permite hacer la iteración de manera eficiente
  L.geoJson(infoRes, {
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: styleInfo,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place);
    }

  }).addTo(layers.earthquakes);

  layers.earthquakes.addTo(map);


  var legend = L.control({
    position: "bottomright"
  });


  legend.onAdd = function() {
    var div = L
      .DomUtil
      .create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "#98ee00",
      "#d4ee00",
      "#eecc00",
      "#ee9c00",
      "#ea822c",
      "#ea2c2c"
    ];


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };


  legend.addTo(map);

  // Para las placas tectonicas
  d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json",
    function(platedata) {
 
      L.geoJson(platedata, {
        color: "orange",
        weight: 2
      })
      .addTo(layers.tectonicplates);
      
      layers.tectonicplates.addTo(map);
    });
});






//console.log("Coordenadas de Movimientos sismicos y su intensidad", nuevaData)

  // When the first API call is complete, perform another call to the Citi Bike Station Status endpoint
//   d3.json("https://gbfs.citibikenyc.com/gbfs/en/station_status.json", function(statusRes) {
//     var updatedAt = infoRes.last_updated;
//     var stationStatus = statusRes.data.stations;
//     var stationInfo = infoRes.data.stations;

//     // Create an object to keep of the number of markers in each layer
//     var stationCount = {
//       COMING_SOON: 0,
//       EMPTY: 0,
//       LOW: 0,
//       NORMAL: 0,
//       OUT_OF_ORDER: 0
//     };
// });

//     // Initialize a stationStatusCode, which will be used as a key to access the appropriate layers, icons, and station count for layer group
//     var stationStatusCode;

//     // Loop through the stations (they're the same size and have partially matching data)
//     for (var i = 0; i < stationInfo.length; i++) {

//       // Create a new station object with properties of both station objects
//       var station = Object.assign({}, stationInfo[i], stationStatus[i]);
//       // If a station is listed but not installed, it's coming soon
  



//       // Update the station count
//       stationCount[stationStatusCode]++;
//       // Create a new marker with the appropriate icon and coordinates
//       var newMarker = L.marker([station.lat, station.lon], {
//         icon: icons[stationStatusCode]
//       });

//       // Add the new marker to the appropriate layer
//       newMarker.addTo(layers[stationStatusCode]);

//       // Bind a popup to the marker that will  display on click. This will be rendered as HTML
//       newMarker.bindPopup(station.name + "<br> Capacity: " + station.capacity + "<br>" + station.num_bikes_available + " Bikes Available");
//     }

//     // Call the updateLegend function, which will... update the legend!
//     updateLegend(updatedAt, stationCount);
//   });
// });

// // Update the legend's innerHTML with the last updated time and station count
// function updateLegend(time, stationCount) {
//   document.querySelector(".legend").innerHTML = [
//     "<p>Updated: " + moment.unix(time).format("h:mm:ss A") + "</p>",
//     "<p class='out-of-order'>Out of Order Stations: " + stationCount.OUT_OF_ORDER + "</p>",
//     "<p class='coming-soon'>Stations Coming Soon: " + stationCount.COMING_SOON + "</p>",
//     "<p class='empty'>Empty Stations: " + stationCount.EMPTY + "</p>",
//     "<p class='low'>Low Stations: " + stationCount.LOW + "</p>",
//     "<p class='healthy'>Healthy Stations: " + stationCount.NORMAL + "</p>"
//   ].join("");
// }
