// this extracts the 'arguments' from the url. the arguments is what is added from 'form + submit'
var QueryString = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();
// get geodata with restaurants being 'elements' in an array and calls back to 'fn' 
function process_json(postcode, fn)
{
    var proxy    = 'http://cdmh.co.uk/proxy.php';
    var ratings  = 'http://ratings.food.gov.uk/enhanced-search/en-GB/%5E/'+postcode+'/Relevance/0/%5E/%5E/1/1/10/json';

    proxy = './geodata/' + postcode + '.json';
    $.getJSON(
        proxy, 
        {
            u: ratings,
            format:'jsonp'
        },
        fn)
        .fail(function(a){
            console.log("fail");
            console.log(a);
        });
}
//this uses 'process_json' and reads all 'elements' to find long,lat then putting a pin on map
function ratings(postcode, fn)
{
    process_json(postcode, function(data, status) {
        // how data is formatted
        num = data['FHRSEstablishment']['EstablishmentCollection']['EstablishmentDetail'].length;
        $.each(data['FHRSEstablishment']['EstablishmentCollection']['EstablishmentDetail'], function(index, value){
            // each element, get lat,long
            var l1 = value.Geocode.Latitude;
            var l2 = value.Geocode.Longitude;
            //call back funtion to set pin
            fn(l1,l2);
            // this creates pin with data
            new google.maps.Marker({
                position: new google.maps.LatLng(value.Geocode.Latitude, value.Geocode.Longitude),
                map: map,
                title: value.BusinessName
            });
        });
    });
}
// finds all 'elements' with spec. rating you searched for
function hygiene(rating, fn)
{
    var restaurant = function(data, status) {
        console.log("Filtering to " + rating);
        $.each(data['FHRSEstablishment']['EstablishmentCollection']['EstablishmentDetail'], function(index, value){
            console.log(value.RatingValue);
            if (rating == value.RatingValue)
                fn(value.BusinessName + ', ' + value.PostCode, value.RatingValue);
        });
    };
    // to much data, narrowed down to pl, ox + rg for demo.
    process_json('ox1', restaurant);
    process_json('ox2', restaurant);
    process_json('pl1', restaurant);
    process_json('pl4', restaurant);
    process_json('rg4', restaurant);
}
