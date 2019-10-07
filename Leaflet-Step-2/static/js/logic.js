// function that creates the legend
function createLegend() {
  // Set up the legend
  var legend = L.control({ position: "bottomright" });

  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = [" 0-1 ", " 1-2 ", " 2-3 ", " 3-4 ", " 4-5 ", " 5+ "];
    var colors = ["green", "lightgreen", "yellow", "orange", "lightred", "red"];
    var labels = [];

    // Add min & max
    var legendInfo = '<div class="labels"></div>';

    div.innerHTML = legendInfo;

    limits.forEach(function(limit, index) {
      labels.push(
        '<li style="background-color: ' +
          colors[index] +
          '">' +
          limits[index] +
          "</li>"
      );
    });

    console.log(labels);

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    console.log(div);
    return div;
  };
  console.log(legend);
  return legend;
}

// Create the createMap function
function createMap(earthquakeLayer, zLevel) {
  // Create the tile layer that will be the background of our map
  var light = L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution: "Earthquakes in the World",
      maxZoom: 18,
      id: "mapbox.light",
      accessToken: API_KEY
    }
  );

  // Create a baseMaps object to hold the lightmap layer
  var baseMaps = {
    Light: light
  };

  // Create an overlayMaps object to hold the earthquake layer
  var overlayMaps = {
    Earthquakes: earthquakeLayer
  };

  // Create the map object with options
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: zLevel,
    layers: [light, earthquakeLayer]
  });

  // call function to create legend
  var mapLegend = createLegend();
  // add the legend to the map
  mapLegend.addTo(myMap);

  // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

function configMarker(feature) {
  // Define the array that will hold the correct settings depending on the magnitude
  var circleMarker = {};

  // determine the color and the radius based on the data
  if (feature.properties.mag <= 1) {
    circleMarker["fillColor"] = "green";
    circleMarker["color"] = "green";
    circleMarker["radius"] = 3;
  } else if (feature.properties.mag <= 2) {
    circleMarker["fillColor"] = "lightgreen";
    circleMarker["color"] = "lightgreen";
    circleMarker["radius"] = 5;
  } else if (feature.properties.mag <= 3) {
    circleMarker["fillColor"] = "yellow";
    circleMarker["color"] = "yellow";
    circleMarker["radius"] = 7;
  } else if (feature.properties.mag <= 4) {
    circleMarker["fillColor"] = "orange";
    circleMarker["color"] = "orange";
    circleMarker["radius"] = 9;
  } else if (feature.properties.mag <= 2) {
    circleMarker["fillColor"] = "lightred";
    circleMarker["color"] = "lightred";
    circleMarker["radius"] = 11;
  } else {
    circleMarker["fillColor"] = "red";
    circleMarker["color"] = "red";
    circleMarker["radius"] = 13;
  }

  circleMarker["weight"] = 1;
  circleMarker["fillOpacity"] = 0.5;

  return circleMarker;
}

// Create the createMarkers function
function createMarkers(response) {
  // We require Features information
  eqData = response.features;

  // Define initial zoom level
  var mapZoomLevel = 3;

  // Define a function that would be executed for each feature in the array
  // Give each feature a popup describing the place, magnitude and time of the earthquake
  function onEachFeature(feature, layer) {
    return layer.bindPopup(
      "<h3>" +
        feature.properties.place +
        "<br>Magnitude: " +
        feature.properties.mag +
        "</h3><hr><p>" +
        new Date(feature.properties.time) +
        "</p>"
    );
  }

  // define a function to create a circle per earthquake
  // color and radius is determined by magnitude
  function detMarker(feature, latlng) {
    circleMarker = configMarker(feature);
    return L.circleMarker(latlng, circleMarker);
    // }
  }

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  var eqLayer = L.geoJSON(eqData, {
    pointToLayer: detMarker,
    onEachFeature: onEachFeature
  });

  // Sending our earthquakes layer to the createMap function
  createMap(eqLayer, mapZoomLevel);
}

// Perform an API call to get earthquake information
url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Call createMarkers when complete
d3.json(url, createMarkers);
