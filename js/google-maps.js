jQuery(function($) {
    // Asynchronously Load the map API 
    var script = document.createElement('script');
    script.src = "//maps.googleapis.com/maps/api/js?key=AIzaSyC044Dz5wIms3JC00azMOd7fMr3dU1sUAo&callback=initMap";
    document.body.appendChild(script);
});

function initialize() {
    var map;
    var origin = {lat: 70, lng: 140};
    var bounds = new google.maps.LatLngBounds();
    var mapOptions = {
        mapTypeId: 'roadmap',
        center: origin,
        zoom: 1
    };
                    
    // Display a map on the page
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
    map.setTilt(45);
        
    // Multiple Markers
    var markers = [
        ['Juan de Fuca Ridge Flank', 47.75,-127.76],
        ['Grizzly Bare Outcrop', 47.19,-128.00],
        ['Juan de Fuca Ridge', 48.46,-128.71],
        ['Atlantic Continental Margin', 40.0,-69.5],
        ['URI', 41.5,-71.42],
        ['Station ALOHA', 22.75,-158.00],
        ['Oahu West Coast', 21.42,-158.257]
        
        
    ];
                        
    // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' +
        '<h3>Juan de Fuca Ridge Flank</h3>' +
        '<p>I sailed to the Juan de Fuca Ridge Flank six times and have used the Alvin Submarine three times and the Jason ROV three times!</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Grizzly Bare Outcrop</h3>' +
        '<p>I never sailed to Grizzly Bare Outcrop but I did have some samples of marine mud collected from here for a published study.</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Juan de Fuca Ridge</h3>' +
        '<p>The Juan de Fuca Ridge waypoint generally represents the vents that I got to cruise to in year 2010.</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Atlantic Continental Shelf</h3>' +
        '<p>I sailed the Atlantic in search of methane seeps as part of the UNOLS Chief Scientist Training Cruise. </p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>University of Rhode Island Inner Space Center</h3>' +
        '<p>As part of the Atlantic Shelf research cruise, we acted as shore-based participants at the URI Inner Space Center.</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Station ALOHA</h3>' +
        '<p>I sailed eight times to the famous Station ALOHA site north of Oahu, Hawaii as part of the Hawaii Ocean Time-Series. </p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3>Oahu West Coast</h3>' +
        '<p>As part of a Pelagic Fishes class, I sailed to the Oahu West Coast to experience life sampling deep-sea animals.</p>' +
        '</div>']
    ];
        
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;
    
    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0]
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(2);
        google.maps.event.removeListener(boundsListener);
    });
    
}
