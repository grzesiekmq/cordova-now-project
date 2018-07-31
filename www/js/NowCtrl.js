function NowCtrl($scope, $window) {
    "use strict";
    var nc = this;
    var lat, lng, coords;
    var options = {
        center: coords,
        zoom: 18
    };
    var markerOptions = {
        position: coords,
        map: $window.gmap,
        icon: './img/navigation.png'
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
    var url = [];
    var result;




    function success(position) {
        lat = position.coords.latitude;
        lng = position.coords.longitude;
        coords = new google.maps.LatLng(lat, lng); // current location
    }
    navigator.geolocation.getCurrentPosition(success);
    $window.gmap = new google.maps.Map(document.querySelector('#map'), options);
    var svc = new google.maps.places.PlacesService($window.gmap);
    var searchOptions = {
        location: coords,
        radius: 1000,
        types: ['grocery_or_supermarket', 'taxi_stand', 'food', 'car_dealer']
    };
    var placesServiceStatus = google.maps.places.PlacesServiceStatus.OK;

    nc.allPlaces = function() {




        // if marker defined
        if (marker !== undefined) {
            marker.setPosition(coords);
        } else {

            marker = new google.maps.Marker(markerOptions);
        }

        document.querySelector('#pop').play();











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

            document.querySelector('#detector').play();
            $scope.$emit('notify', notify);


            function createMarker(place, link) {
                var placeLoc = place.geometry.location;
                var placeName = place.name;
                var placesMarkerOptions = {
                    map: $window.gmap,
                    position: placeLoc,
                    title: placeName,
                    url: link,
                };
                var marker = new google.maps.Marker(placesMarkerOptions);

                function click() {
                    window.open(marker.url, '_blank');
                }
                google.maps.event.addListener(marker, 'click', click);

            }

            function callback(results, status) {
                if (status === placesServiceStatus) {
                    var resultsLength = results.length;

                    $scope.res = results;
                    $scope.loc = coords;

                    for (result = 0; result < resultsLength; result++) {

                        var new_name = results[result].name.replace(/ /g, "+");
                        url[result] = 'https://www.google.com/maps/place/' + new_name + '/@' + results[result].geometry.location.toUrlValue() + ',' + 17 + 'z/';
                        createMarker(results[result], url[result]);

                        console.log(results[result]);

                    }
                    $scope.url = url;
                    $scope.$apply();
                }
            }



            svc.nearbySearch(searchOptions, callback);

            // });
        } else {
            return;
        }
    };






}
angular.module('nowApp')
    .controller("NowCtrl", NowCtrl);