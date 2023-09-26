// Declare the map variable outside the function.
let earthquakeMap;

// Declare the markerColor variable outside the function.
let markerColor;

// Declare the markerColor variables outside the function.
let minAltitude;
let maxAltitude;

// Declare the circleMarker, fillColor, and altitude variables outside the function.
let circleMarker;
let fillColor;
let altitude;

// Declare an array to hold earthquake markers.
let earthquakeMarkers = [];

// Create the createMap function.
function createMap() {
  earthquakeMap = L.map("map", {
    center: [41.724674, -99.428860],
    zoom: 5,
  });

  // Create the tile layer that will be the background of our map.
  let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(earthquakeMap);

  // Perform an API call to the USGS Earthquake API to get the earthquake data for the past 7 days
  url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
  d3.json(url).then(function (response) {
    console.log(response);

    // Call the createMarkers function and pass the earthquakeMap and earthquakeMarkers.
    createMarkers(response.features, earthquakeMap);

    // Call the createLegend function and pass the earthquakeMap.
    createLegend(earthquakeMap);
  });
}

// Create the createMarkers function.
function createMarkers(data, earthquakeMap) {
  // Calculate the minimum and maximum altitude values in the earthquake data.
  minAltitude = d3.min(data, (d) => d.geometry.coordinates[2]);
  maxAltitude = d3.max(data, (d) => d.geometry.coordinates[2]);

  // Define a color scale based on the altitude range using interpolateCool.
  markerColor = d3.scaleSequential(d3.interpolateSinebow).domain([minAltitude, maxAltitude]);

  // Loop through the earthquake data.
  for (let i = 0; i < data.length; i++) {
    // Extract altitude from the coordinates.
    altitude = data[i].geometry.coordinates[2];

    // For each earthquake, create a circle marker.
    circleMarker = L.circleMarker(
      [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]],
      {
        radius: data[i].properties.mag * 3,
        fillOpacity: 0.75,
      }
    );

    // Store the altitude as a property of the marker.
    circleMarker.altitude = altitude;

    // Add the circle marker to the earthquakeMarkers array.
    earthquakeMarkers.push(circleMarker);
  }

  // Create a layer group from the earthquakeMarkers array and add it to the map.
  let earthquakeLayer = L.layerGroup(earthquakeMarkers);
  earthquakeLayer.addTo(earthquakeMap);
}

// Create the createLegend function.
function createLegend(earthquakeMap) {
  // Define altitude ranges and corresponding labels.
  let legendData = [
    { label: '-10 - 10', min: -10, max: 10 },
    { label: '10 - 30', min: 10, max: 30 },
    { label: '30 - 50', min: 30, max: 50 },
    { label: '50 - 70', min: 50, max: 70 },
    { label: '70 - 90', min: 70, max: 90 },
    { label: '90+', min: 90, max: maxAltitude },
  ];

  // Create a legend control.
  let legend = L.control({ position: 'bottomright' });

  // When the legend control is added, insert a div with the class of "info legend".
  legend.onAdd = function () {
    let div = L.DomUtil.create('div', 'info legend');
    div.innerHTML += '<h4>Altitude Ranges</h4>';
    for (let i = 0; i < legendData.length; i++) {
      div.innerHTML +=
        '<div class="legend-item">' +
        `<i style="background:${markerColor(legendData[i].min)}"></i> ` +
        legendData[i].label + '</div>';
    }
    return div;
  };

  // Add the legend to the map.
  legend.addTo(earthquakeMap);

  // Call the updateMapMarkers function to update marker colors.
  updateMapMarkers();
}

// Function to update map markers' colors based on legendData.
function updateMapMarkers() {
  for (let i = 0; i < earthquakeMarkers.length; i++) {
    let altitude = earthquakeMarkers[i].altitude;
    let color;

    // Check if altitude is lower than -10 and set the color for '-10 - 10'.
    if (altitude < -10) {
      color = markerColor(-10);
    }
    // Check if altitude is higher than 90 and set the color for '90+'.
    else if (altitude > 90) {
      color = markerColor(90);
    }
    // For other altitudes, calculate the color as usual.
    else {
      color = markerColor(altitude);
    }

    earthquakeMarkers[i].setStyle({ fillColor: color });
  }
}

// Initialize the web page
createMap();
