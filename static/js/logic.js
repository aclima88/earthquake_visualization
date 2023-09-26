// Declare the map variable outside the function.
let earthquakeMap; 

// Declare the markerColor variable outside the function.
let markerColor;

// Declare the markerColor variable outside the function.
let minAltitude;
let maxAltitude;

// Create the createMap function.
function createMap() {
  // // Check if the map container already exists.
  // if (!earthquakeMap) {
  //   // Create the map.
    earthquakeMap = L.map("map", {
      center: [41.724674, -99.428860],
      zoom: 5,
    });

    // Create the tile layer that will be the background of our map.
    let base = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(earthquakeMap);

    // Initialize an array to hold the earthquake markers.
    let earthquakeMarkers = [];

    // Create a layer control, and pass it baseMaps and overlayMaps. Add the layer control to the map.
    let baseMaps = {
      "base": base
    };

    control = L.control.layers(baseMaps, {}).addTo(earthquakeMap);

    // Perform an API call to the USGS Earthquake API to get the earthquake data for the past 7 days
    url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    d3.json(url).then(function (response) {
      console.log(response);

      // Call the createMarkers function and pass the earthquakeMap and earthquakeMarkers.
      createMarkers(response.features, earthquakeMap, earthquakeMarkers);

      // Call the createLegend function and pass the earthquakeMap.
      createLegend(earthquakeMap, markerColor);
    });
  }
// }

// Create the createMarkers function.
function createMarkers(data, earthquakeMap, earthquakeMarkers) {
  // Calculate the minimum and maximum altitude values in the earthquake data.
  minAltitude = d3.min(data, (d) => d.geometry.coordinates[2]);
  maxAltitude = d3.max(data, (d) => d.geometry.coordinates[2]);

  // Define a color scale based on the altitude range using interpolateCool.
  markerColor = d3.scaleSequential(d3.interpolateSinebow).domain([minAltitude, maxAltitude]);

  // Loop through the earthquake data.
  for (let i = 0; i < data.length; i++) {
    // Extract altitude from the coordinates.
    let altitude = data[i].geometry.coordinates[2];

    // Get the marker color based on altitude using the gradient scale.
    let fillColor = markerColor(altitude);

    // For each earthquake, create a circle marker, and set the color.
    let circleMarker = L.circleMarker(
      [data[i].geometry.coordinates[1], data[i].geometry.coordinates[0]],
      {
        radius: data[i].properties.mag * 3, // You can adjust the radius as needed.
        fillOpacity: 0.75,
        fillColor: fillColor, // Set the marker color.
      }
    );

    // Bind a popup with the earthquake's place.
    circleMarker.bindPopup(
      `<h3>Magnitude: ${data[i].properties.mag}</h3>` +
      `<h3>Location: ${data[i].properties.place}</h3>` +
      `<h3>Altitude: ${data[i].geometry.coordinates[2]}</h3>`
    );

    // Add the circle marker to the earthquakeMarkers array.
    earthquakeMarkers.push(circleMarker);
  }

  // Create a layer group from the earthquakeMarkers array and add it to the map.
  let earthquakeLayer = L.layerGroup(earthquakeMarkers);
  earthquakeLayer.addTo(earthquakeMap);

  // Add the earthquake markers layer to the layer control.
  control.addOverlay(earthquakeLayer, "Earthquake Markers");
}

// Create the createLegend function.
function createLegend(earthquakeMap) {
  // Define altitude ranges and corresponding labels.
  legendData = [
    { label: '-10 - 10', min: -10, max: 10 },
    { label: '10 - 30', min: 10, max: 30 },
    { label: '30 - 50', min: 30, max: 50 },
    { label: '50 - 70', min: 50, max: 70 },
    { label: '70 - 90', min: 70, max: 90 },
    { label: '90+', min: 90, max: maxAltitude },
  ];

  // Create a legend control.
  let legend = L.control({ position: 'bottomright' });

  // Define the legend content.
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
}


// Initialize the web page
createMap();
