function BuyCtrl($http, $window, $scope) {
    var bc = this;
    var notify = {
        type: 'info',
        title: 'now! najbliższe sklepy',
        content: 'Znaleziono wszystkie najbliższe miejsca',
        timeout: 10000 //time in ms
    };
    var marker;
    var infowindow;

    var activeWindow;
    function buyClick(event) {
        // current location
        var loc = event.latLng;

        if (marker !== undefined) {
            marker.setPosition(loc);
        } else {

            marker = new google.maps.Marker({
                position: loc,
                map: $window.gmap,
                icon: './img/navigation.png',
                draggable: true
            });
        }

        document.getElementById('pop').play();

        console.log('pos:', loc.lat(), loc.lng());

        

        var ro = localStorage.getItem('geoHistory');
        lt2 = JSON.parse(ro);
        
        var c = confirm("Czy chcesz wyszukać wszystkie najbliższe miejsca?");
        if (c) {
            /* swal({
                 title: "najbliższe miejsca",
                 text: "Czy chcesz wyszukać najbliższe miejsca?",
                 imageUrl: "https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/help_support_question_mark-256.png",
                 showCancelButton: true,
                 confirmButtonColor: "#00ff9f",
                 cancelButtonColor: 'orangered',
                 confirmButtonText: "Tak",
                 cancelButtonText: "Nie",
                 showLoaderOnConfirm: true
            */
            //}).then(function() {
            document.getElementById('detector').play();
            $scope.$emit('notify', notify);

            svc = new $window.google.maps.places.PlacesService($window.gmap);
            var searchOptions = {
                location: loc,
                radius: 1000,
                types: ['grocery_or_supermarket']
            };

            function callback(results, status) {
                var placesServiceStatus = google.maps.places.PlacesServiceStatus.OK;
                if (status === placesServiceStatus) {
                    

                    
                    

                    $scope.res = results;

                    var url = [];

                    for (var i = 0; i < results.length; i++) {

                        
                        var new_name = results[i].name.replace(/ /g, "+");
                        url[i] = 'https://www.google.com/maps/place/' + new_name + '/@' + results[i].geometry.location.toUrlValue() + ',' + 17 + 'z/';
                        createMarker(results[i], url[i]);

                        

                    }
                    $scope.loc = loc;
                    $scope.url = url;
                    $scope.$apply();
                    

                }
            }

            function createMarker(place, link) {
                var placeLoc = place.geometry.location;
                var placeName = place.name;
                var marker = new google.maps.Marker({
                    map: $window.gmap,
                    position: placeLoc,
                    title: placeName,
                    url: link,
                });
                google.maps.event.addListener(marker, 'click', function() {
                    window.open(marker.url, '_blank');
                });

            }

            svc.nearbySearch(searchOptions, callback);
            

        } else {
            return;
        }

    }
    $window.gmap = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 50.0619625,
            lng: 19.9371255
        },
        zoom: 18
    });
    document.getElementById("map_title").innerHTML = "Wskaż swoją pozycje na mapie: ";
    document.getElementById("map_panel").className = "panel panel-default";

    // click
    $window.gmap.addListener('click', buyClick);

}
angular.module('nowApp')
.controller("BuyCtrl", BuyCtrl);
