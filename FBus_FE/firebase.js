import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  onChildAdded,
  onChildRemoved,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";
// import firebase from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8sCzcRQR7WMnrklJV3hpPeoyjiGHwdmY",
  authDomain: "f-bus-map.firebaseapp.com",
  databaseURL: "https://f-bus-map-default-rtdb.firebaseio.com",
  projectId: "f-bus-map",
  storageBucket: "f-bus-map.appspot.com",
  messagingSenderId: "619727528772",
  appId: "1:619727528772:web:f3800ffbbb05f7af56ed11",
};
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

//

async function getLocations(database) {
  const locationsRef = ref(database, "locations");
  const locationSnapshot = await get(locationsRef);
  const locationData = locationSnapshot.val();
  // console.log(locationData);

  if (locationData) {
    const locationList = Object.entries(locationData).reduce((result, [key, value]) => {
      result[key] = Object.values(value);
      return result;
    }, {});

    return locationList;
  } else {
    return {};
  }
}

var markers = [];
var mapObj; // Define your Leaflet map object here

// Function to add a marker to the map
function addMarkerToMap(latitude, longitude) {
  if (latitude && longitude) {
    var busIcon = L.icon({
      iconUrl: "/bus.png",
      iconSize: [30, 25],
      // iconAnchor:
    });

    var marker = L.marker([latitude, longitude], { icon: busIcon }).addTo(
      mapObj
    );

    marker
      .bindPopup("Latitude: " + latitude + "<br>Longitude: " + longitude)
      .openPopup();
    markers.push(marker);
  }
}

// Function to update marker positions on the map
function updateMarkerPositions() {
  getLocations(database)
    .then((locationList) => {
      console.log("Location list: ");
      console.log(locationList);

      markers.forEach((marker) => {
        mapObj.removeLayer(marker);
      });

      markers = [];

      locationList.forEach((location) => {
        addMarkerToMap(location.latitude, location.longitude);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

// Call the updateMarkerPositions function initially and set the interval for periodic updates
updateMarkerPositions();
setInterval(updateMarkerPositions, 5000);

// Export the updateMarkerPositions function (optional)
export { updateMarkerPositions };
