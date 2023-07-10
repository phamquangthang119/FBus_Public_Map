import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  onChildAdded,
  onChildRemoved,
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-database.js";

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

async function getLocations(database) {
  const locationsRef = ref(database, "locations");
  const locationSnapshot = await get(locationsRef);
  const locationData = locationSnapshot.val();

  if (locationData) {
    const locationList = {};
    Object.entries(locationData).forEach(([key, value]) => {
      locationList[key] = Object.values(value);
    });

    return locationList;
  } else {
    return {};
  }
}

let markers = [];
let mapObj; // Define your Leaflet map object here

function addMarkerToMap(latitude, longitude) {
  if (latitude && longitude) {
    const busIcon = L.icon({
      iconUrl: "/bus.png",
      iconSize: [30, 25],
    });

    const marker = L.marker([latitude, longitude], { icon: busIcon }).addTo(
      mapObj
    );

    marker
      .bindPopup(`Latitude: ${latitude}<br>Longitude: ${longitude}`)
      .openPopup();
    markers.push(marker);
  }
}

function updateMarkerPositions() {
  getLocations(database)
    .then((locationList) => {
      console.log("Location list:");
      console.log(locationList);

      markers.forEach((marker) => {
        mapObj.removeLayer(marker);
      });

      markers = [];

      Object.values(locationList).forEach((location) => {
        addMarkerToMap(location.latitude, location.longitude);
      });
    })
    .catch((error) => {
      console.error(error);
    });
}

updateMarkerPositions();
setInterval(updateMarkerPositions, 5000);

// export { updateMarkerPositions };
