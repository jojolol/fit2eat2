function initialize() {
        var mapOptions = {
          center: new google.maps.LatLng(51.7397156, -1.254819),
          zoom: 13
        };
        var map = new google.maps.Map(document.getElementById("map-canvas"),
            mapOptions);

//begin alterations 
        var json = (function () { 
            var json = null; 
                $.ajax({ 
                    'async': false, 
                    'global': false, 
                    'url': "http://ratings.food.gov.uk/enhanced-search/en-GB/%5E/ox1/Relevance/0/%5E/%5E/1/1/10/json", 
                    'dataType': "json", 
                    'success': function (data) {
                     json = data; } }); 
                return json;})(); 


//loop through, extracting information for each marker
for (var i = 0, length = json.length; i < length; i++) {
  var data = json[i],
      latLng = new google.maps.LatLng(data.lat, data.lng); 

  // Creating a marker and putting it on the map
  var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      title: 'hello world'
      });
  }

//end alterations

//original code
      //var marker = new google.maps.Marker({
      //position: new google.maps.LatLng(51.7397156, -1.254819),
      //map: map,
      //title: 'hello world!'
      //});
//}
//original code
  
      
      google.maps.event.addDomListener(window, 'load', initialize);