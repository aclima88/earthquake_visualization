# earthquake_visualization

1. I declared the earthquakeMap, markerColor, minAltitude, maxAltitude, circleMarker, fillColor, and altitude variables outside the functions so they are accessible globaly to my code.

2. I declared an array to hold earthquake markers.

3. I created the createMap function to create the map.

    a. I created the tile layer that will be the background of our map.
    
    b. I created a layer group for earthquake markers.

    c. I created the baseMaps object to hold the empty map layer.
    
    ![base_map_layer](https://github.com/aclima88/earthquake_visualization/assets/133547307/70c73eb5-0a21-4add-97f8-68f86df1975e)

    d. I created an overlayMaps object to hold the earthquake markers layer.

    e. I created a layer control, and pass it the baseMaps and overlayMaps layers and add the layer control to the map.
    
    ![Layers](https://github.com/aclima88/earthquake_visualization/assets/133547307/39886776-616f-4c83-aca3-31b3166f887b)

    f. I performed an API call to the USGS Earthquake API to get the earthquake data for the past 7 days.
    
    g. I called the createMarkers function and passed the earthquakeMap and earthquakeMarkers through it.

    h. I called the createLegend function and passed the earthquakeMap through it.
    
    i. I called the updateMapMarkers function to update marker colors.

4. I created the createMarkers function.

5. I created the createLegend function.

    a. I created a legend control.
  
    b. I added the legend to the map.
    
    c. I set the "Earthquake" layer to be automatically on when the map is loaded.
    
    d. I set up event listeners to control legend visibility for when users toggle the earthquake layer on and off.
  
    e. I add the legend to the map when the "Earthquake" layer is automatically turned on initially.
    
    ![Legend](https://github.com/aclima88/earthquake_visualization/assets/133547307/4ef55406-0730-4a12-a876-60939f314772)

6. I defined a color scale based on the altitude range using interpolateCool color sequential.

    a. I looped through the earthquake data and extract the altitude data from the coordinates.

    b. I created a circle marker for each earthquake and stored the altitude as a property of the marker.
    
    c. I added the circle marker to the earthquakeMarkers array.

7. I created a layer group from the earthquakeMarkers array and add it to the map.

8. I created a function to update map markers' colors based on legendData information.

    a. I checked if altitude is lower than -10 and set the color for any altitude below -10 to the same color as the altitude range of -10 - 10.

    b. I checked if altitude is higher than 90 and set the color for any altitude above 90 to the same color as the altitude range of 90+.
    
    c. For other altitudes, I calculate the color as I had done so previously in the createLegend function.

9. I initialized the web page.

![Final Map](https://github.com/aclima88/earthquake_visualization/assets/133547307/0ebb8ed1-a303-4feb-aa24-ef3ec2951549)
