function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(51.7397156, -1.254819),
          zoom: 13
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

      var marker = new google.maps.Marker({
      position: new google.maps.LatLng(51.7397156, -1.254819),
      map: map,
      title: 'hello world!'
  });
      }
      google.maps.event.addDomListener(window, 'load', initialize);