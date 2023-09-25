// Create the createMap function.
function createMap() {
    // Create the map.
    let earthquakeMap = L.map("map", {
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
    });
  }
  
  // Create the createMarkers function.
  function createMarkers(data, earthquakeMap, earthquakeMarkers) {
    // Calculate the minimum and maximum altitude values in the earthquake data.
    const minAltitude = d3.min(data, (d) => d.geometry.coordinates[2]);
    const maxAltitude = d3.max(data, (d) => d.geometry.coordinates[2]);
  
    // Define a color scale based on the altitude range using interpolateCool.
    const markerColor = d3.scaleSequential(d3.interpolateSinebow).domain([minAltitude, maxAltitude]);
  
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
          radius: data[i].properties.mag * 5, // You can adjust the radius as needed.
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
  
  // Initialize the web page
  createMap();
  