
 var googleMapsBaseUrl = 'https://maps.googleapis.com/maps/api/streetview?size=600x400&location=';
 var nyTimesBaseUrl = 'http://api.nytimes.com/svc/search/v2/articlesearch';
 var nyTimesApiKey = '7b363882f54c420c90f354086bce4bae';

    var fourSquareBaseUrl = 'https://api.foursquare.com/v2/venues/search?'; 
    var clientId=  'MB0MVWIKLOFFRCDNABWAYRU4FKBLKUZSYXQPELUG2W2KNXM5';
    var clientSecret = 'ZG2JJFTOUSQBOSYYJJYDFXCS34HQUEXW35LIJPZ5JRVFL3DX';

function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $wikiHeaderElem = $('#wikipedia-header');
    var $nytHeaderElem = $('#nytimes-header');
    var $placesElem = $('#four-places');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');
    var $places = $('#four-places');
     var $placesTitle= $('#places-title');
    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");
    $placesElem.text("");
    // Input variables
    var street = $('#street').val();
    var city = $('#city').val();
    var address = street + ', ' + city;

    //SelecDropdown; 
    var dropdown = '<select id="dropdownID">';
    // Greeting
    $greeting.text('So you want to live at ' + address + '?');

    // Background image
   
    var googleMapsUrl = googleMapsBaseUrl + address;
    var backgroundImage = "<img class='bgimg' src='" + googleMapsUrl + "''>";
    $body.append(backgroundImage);

    //NY times


    var nyTimesRequestUrl = nyTimesBaseUrl + '.json?api-key=' + nyTimesApiKey + '&q=' + city;
    

    var foursquareRequestUrl  = fourSquareBaseUrl + 'near=' + city  + '&client_id=' + clientId + '&client_secret=' +  clientSecret + '&v=20171121'; 



    $.getJSON( nyTimesRequestUrl, function( data ) {
        var docs = data.response.docs;
        $.each( docs, function( key, val ) {
            var title = '<a href="' + val.web_url +'">' + val.headline.main + '</a>';
            
            var leadParagraph = '';
            if (val.lead_paragraph) {
                leadParagraph = '<p>' + val.lead_paragraph + '</p> ';
            };

            var listItem = '<li class="article">' + title + leadParagraph + '<p class="caption">' + val.snippet +'</p></li>';

            $nytHeaderElem.text('New York Times Articles about ' + city);
            $nytElem.append(listItem);
        });
    }).fail(function(){
        $nytHeaderElem.text('New York Times Articles could not be loaded');
    });

    // Wikipedia
    var wikiBaseUrl = 'http://en.wikipedia.org/w/api.php?format=json&action=opensearch&search=';
    var wikiUrl = wikiBaseUrl + city;

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('Could not load wikipedia links');
    }, 8000);

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        success: function(data){
            for (var i = 0; i <= data[1].length - 1; i++) {
                var pageLink = '<li class="list-article"><a href="' + data[3][i] + '">' + data[1][i] + '</a></li>';
                $wikiElem.append(pageLink);
            };

            clearTimeout(wikiRequestTimeout);
        }
    });

      $.ajax({
        url: foursquareRequestUrl,
        dataType: 'jsonp',
        success: function (data) {
            var result = data.response.venues;
            $placesTitle.text('Places in ' + city);
            for (var i = 0; i <= result.length - 1; i++) {   
                 var placeInfo = '<li id="article">' + result[i].name + '</li>  <p>'+ result[i].location.formattedAddress+ '</p><hr>';
                 $places.append(placeInfo);
            };



         
    },
        // Alert the user on error.
        error: function (e) {
            infowindow.setContent('<h5>Foursquare data is unavailable.</h5>');
            document.getElementById("error").innerHTML = "<h4>Foursquare data is unavailable. Please try refreshing.</h4>";
    }
    });

    return false;
};



$('#form-container').submit(loadData);




