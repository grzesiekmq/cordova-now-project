function NowCtrl($http, $scope, $window) {
    var nc = this;
    var lat, lng;
    function success(position){
        lat = position.coords.latitude;
        lng = position.coords.longitude;
    }
    navigator.geolocation.getCurrentPosition(success);
    var options = {
        center: {
            lat: lat,
            lng: lng
        },
        zoom: 18
    };
    var notify = {
        type: 'info',
        title: 'now! wszystkie miejsca',
        content: 'Znaleziono wszystkie najbliższe miejsca',
        timeout: 10000 //time in ms
    };

    var marker;
    var infowindow;
    var activeWindow;
    $window.gmap = new google.maps.Map(document.getElementById('map'), options);

    function nowClick(event) {
        // current location
        var loc = event.latLng;
        var markerOptions = {
                position: loc,
                map: $window.gmap,
                icon: './img/navigation.png',
                draggable: true
            };
        var ro = localStorage.getItem('geoHistory');
        

        if (marker !== undefined) {
            marker.setPosition(loc);
        } else {

            marker = new google.maps.Marker(markerOptions);
        }

        document.getElementById('pop').play();
        console.log('pos:', loc.lat(), loc.lng());
        

        
        

        

        lt2 = JSON.parse(ro);
        console.log(lt2);

        // confirm
        var c = confirm("Czy chcesz wyszukać wszystkie najbliższe miejsca?");
        if (c) {
            /* swal({
            title: "Najbliższe miejsca",
            text: "Czy chcesz wyszukać wszystkie najbliższe miejsca?",
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

            var svc = new google.maps.places.PlacesService($window.gmap);
            var searchOptions = {
                location: loc,
                radius: 1000,
                types: ['grocery_or_supermarket', 'taxi_stand', 'food', 'car_dealer']
            };
            var placesServiceStatus = google.maps.places.PlacesServiceStatus.OK;

            function callback(results, status) {
                if (status === placesServiceStatus) {
                    var url = [];
                    var resultsLength = results.length;
                    $scope.res = results;
                    $scope.loc = loc;

                    for (var i = 0; i < resultsLength; i++) {

                        var new_name = results[i].name.replace(/ /g, "+");
                        url[i] = 'https://www.google.com/maps/place/' + new_name + '/@' + results[i].geometry.location.toUrlValue() + ',' + 17 + 'z/';
                        createMarker(results[i], url[i]);

                        console.log(results[i]);
                        // createMarker(results[i], results[i].name, results[i].vicinity);
                    }
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

            // });
        } else {
            return;
        }
    };



    // click
    $window.gmap.addListener('click', nowClick);

}
angular.module('nowApp')
.controller("NowCtrl", NowCtrl);
