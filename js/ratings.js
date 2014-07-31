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

function ratings(postcode, fn)
{
    process_json(postcode, function(data, status) {
        num = data['FHRSEstablishment']['EstablishmentCollection']['EstablishmentDetail'].length;
        $.each(data['FHRSEstablishment']['EstablishmentCollection']['EstablishmentDetail'], function(index, value){
            var l1 = value.Geocode.Latitude;
            var l2 = value.Geocode.Longitude;
            fn(l1,l2);

            new google.maps.Marker({
                position: new google.maps.LatLng(value.Geocode.Latitude, value.Geocode.Longitude),
                map: map,
                title: value.BusinessName
            });
        });
    });
}

function hygiene(rating, fn)
{
    var restaurant = function(data, status) {
        $.each(data['FHRSEstablishment']['EstablishmentCollection']['EstablishmentDetail'], function(index, value){
            console.log(value.RatingValue);
            //if (rating == parseInt(value.RatingValue))
                fn(value.BusinessName + ', ' + value.PostCode, value.RatingValue);
        });
    };
    process_json('ox1', restaurant);
    process_json('ox2', restaurant);
    process_json('pl1', restaurant);
    process_json('pl4', restaurant);
    process_json('rg4', restaurant);
}
