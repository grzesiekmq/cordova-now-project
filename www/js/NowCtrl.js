function NowCtrl($scope, $window) {
    "use strict";
    var nc = this;
    var coords, lat, lng, location, options, markerOptions, marker,
        infowindow,
        activeWindow,
        result,
        svc,
        searchOptions,
        placesServiceStatus;

    var notify = {
        type: 'info',
        title: 'now! wszystkie miejsca',
        content: 'Znaleziono wszystkie najbliższe miejsca',
        timeout: 10000 //time in ms
    };

    var url = [];

    function success(position) {
        coords = position.coords;
        lat = coords.latitude;
        lng = coords.longitude;
        location = {
            lat: lat,
            lng: lng
        };


        options = {
            center: location,
            zoom: 18
        };
        markerOptions = {
            position: location,
            map: $window.gmap,
            icon: './img/navigation.png'
        };
        placesServiceStatus = google.maps.places.PlacesServiceStatus.OK;

        $window.gmap = new google.maps.Map(document.querySelector('#map'), options);


        nc.allPlaces = function () {




            // if marker defined
            if (marker !== undefined) {
                marker.setPosition(location);
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
                        url: link
                    };
                    var marker = new google.maps.Marker(placesMarkerOptions);

                    function click() {
                        window.open(marker.url, '_blank');
                    }
                    google.maps.event.addListener(marker, 'click', click);

                }

                function showResults(results, status) {
                    if (status === placesServiceStatus) {
                        var resultsLength = results.length;

                        $scope.res = results;
                        $scope.loc = location;

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


                svc = new google.maps.places.PlacesService($window.gmap);
                searchOptions = {
                    location: location,
                    radius: 1000,
                    types: ['grocery_or_supermarket', 'taxi_stand', 'food', 'car_dealer']
                };


                svc.nearbySearch(searchOptions, showResults);

                // });
            } else {
                return;
            }
        };


    }


    function error() {
        console.log('error');
    }

    navigator.geolocation.getCurrentPosition(success, error);

}
angular.module('nowApp')
    .controller("NowCtrl", NowCtrl);
